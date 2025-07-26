<script lang="ts">
	import { invalidate } from '$app/navigation';

	let formData = {
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
	};

	let message = '';
	let loading = false;

	function addCustomMetric() {
		formData.custom_metrics.push({ key: '', value: '', unit: '' });
	}

	function removeCustomMetric(index: number) {
		formData.custom_metrics.splice(index, 1);
	}

	async function handleSubmit() {
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

<div class="max-w-2xl mx-auto mt-10 p-6 bg-base-200 rounded-xl shadow-lg">
	<h2 class="text-2xl font-semibold mb-6">📋 Add Health Metrics</h2>

	<form class="space-y-4" on:submit|preventDefault={handleSubmit}>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="form-control">
				<label class="label">Systolic (mmHg)</label>
				<input type="number" class="input input-bordered" bind:value={formData.systolic} />
			</div>
			<div class="form-control">
				<label class="label">Diastolic (mmHg)</label>
				<input type="number" class="input input-bordered" bind:value={formData.diastolic} />
			</div>
			<div class="form-control">
				<label class="label">Heart Rate (bpm)</label>
				<input type="number" class="input input-bordered" bind:value={formData.heart_rate} />
			</div>
			<div class="form-control">
				<label class="label">Blood Glucose (mg/dL)</label>
				<input type="number" class="input input-bordered" bind:value={formData.blood_glucose} />
			</div>
			<div class="form-control">
				<label class="label">Weight (kg)</label>
				<input type="number" class="input input-bordered" bind:value={formData.weight} />
			</div>
			<div class="form-control">
				<label class="label">Temperature (°C)</label>
				<input type="number" class="input input-bordered" bind:value={formData.temperature} />
			</div>
		</div>

		<!-- Custom Metrics -->
		<div class="divider">Custom Metrics</div>
		{#each formData.custom_metrics as metric, index}
			<div class="grid grid-cols-3 gap-2 items-end mb-2">
				<input type="text" class="input input-bordered" placeholder="Key" bind:value={metric.key} />
				<input type="text" class="input input-bordered" placeholder="Value" bind:value={metric.value} />
				<input type="text" class="input input-bordered" placeholder="Unit" bind:value={metric.unit} />
			</div>
		{/each}

		<div class="flex gap-2 mb-4">
			<button type="button" class="btn btn-outline btn-sm" on:click={addCustomMetric}>
				➕ Add Custom Metric
			</button>
			{#if formData.custom_metrics.length > 1}
				<button type="button" class="btn btn-error btn-sm" on:click={() => removeCustomMetric(formData.custom_metrics.length - 1)}>
					🗑 Remove Last
				</button>
			{/if}
		</div>

		<!-- Hidden Source -->
		<input type="hidden" bind:value={formData.source} />

		<button type="submit" class="btn btn-primary w-full" disabled={loading}>
			{loading ? 'Submitting...' : 'Submit Metrics'}
		</button>

		{#if message}
			<p class="mt-4 text-center text-sm">{message}</p>
		{/if}
	</form>
</div>
