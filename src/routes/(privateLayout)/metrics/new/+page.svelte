<script lang="ts">
	import { invalidate } from '$app/navigation';

	let formData = $state({
		systolic: '120',
		diastolic: '80',
		heart_rate: '72',
		blood_glucose: '95',
		weight: '70',
		temperature: '36.8',
		source: 'manual',
		custom_metrics: [
			{ key: 'Vitamin D', value: '30', unit: 'ng/mL' },
			{ key: 'Iron', value: '12', unit: 'μmol/L' }
		]
	});

	let message = $state('');
	let loading = $state(false);

	function addCustomMetric() {
		formData.custom_metrics.push({ key: '', value: '', unit: '' });
	}

	function removeCustomMetric(index: number) {
		formData.custom_metrics.splice(index, 1);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		loading = true;

		const payload = {
			...formData,
			systolic: Number(formData.systolic),
			diastolic: Number(formData.diastolic),
			heart_rate: Number(formData.heart_rate),
			blood_glucose: Number(formData.blood_glucose),
			weight: Number(formData.weight),
			temperature: Number(formData.temperature),
			custom_metrics: formData.custom_metrics.filter((m) => m.key && m.value && m.unit)
		};

		const res = await fetch('/api/metrics/new', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const result = await res.json();
		loading = false;

		if (result.success) {
			message = '✅ Metric submitted successfully!';
			invalidate('metrics');
		} else {
			message = `❌ Error: ${result.error}`;
		}
	}
</script>

<div class="mx-auto mt-10 max-w-2xl rounded-xl bg-base-200 p-6 shadow-lg">
	<h2 class="mb-6 text-2xl font-semibold">📋 Add Health Metrics</h2>

	<form class="space-y-4" onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="form-control">
				<label class="label">Systolic (mmHg)</label>
				<input type="number" class="input-bordered input" bind:value={formData.systolic} />
			</div>
			<div class="form-control">
				<label class="label">Diastolic (mmHg)</label>
				<input type="number" class="input-bordered input" bind:value={formData.diastolic} />
			</div>
			<div class="form-control">
				<label class="label">Heart Rate (bpm)</label>
				<input type="number" class="input-bordered input" bind:value={formData.heart_rate} />
			</div>
			<div class="form-control">
				<label class="label">Blood Glucose (mg/dL)</label>
				<input type="number" class="input-bordered input" bind:value={formData.blood_glucose} />
			</div>
			<div class="form-control">
				<label class="label">Weight (kg)</label>
				<input type="number" class="input-bordered input" bind:value={formData.weight} />
			</div>
			<div class="form-control">
				<label class="label">Temperature (°C)</label>
				<input type="number" class="input-bordered input" bind:value={formData.temperature} />
			</div>
		</div>

		<!-- Custom Metrics -->
		<div class="divider">Custom Metrics</div>
		{#each formData.custom_metrics as metric, index}
			<div class="mb-2 grid grid-cols-3 items-end gap-2">
				<input type="text" class="input-bordered input" placeholder="Key" bind:value={metric.key} />
				<input
					type="text"
					class="input-bordered input"
					placeholder="Value"
					bind:value={metric.value}
				/>
				<input
					type="text"
					class="input-bordered input"
					placeholder="Unit"
					bind:value={metric.unit}
				/>
			</div>
		{/each}

		<div class="mb-4 flex gap-2">
			<button type="button" class="btn btn-outline btn-sm" onclick={addCustomMetric}>
				➕ Add Custom Metric
			</button>
			{#if formData.custom_metrics.length > 1}
				<button
					type="button"
					class="btn btn-sm btn-error"
					onclick={() => removeCustomMetric(formData.custom_metrics.length - 1)}
				>
					🗑 Remove Last
				</button>
			{/if}
		</div>

		<!-- Hidden Source -->
		<input type="hidden" bind:value={formData.source} />

		<button type="submit" class="btn w-full btn-primary" disabled={loading}>
			{loading ? 'Submitting...' : 'Submit Metrics'}
		</button>

		{#if message}
			<p class="mt-4 text-center text-sm">{message}</p>
		{/if}
	</form>
</div>
