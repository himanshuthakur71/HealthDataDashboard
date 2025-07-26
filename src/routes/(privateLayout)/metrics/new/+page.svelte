<script lang="ts">
	import { invalidate } from '$app/navigation';
	import CustomMetricFrom from '$lib/components/CustomMetricFrom.svelte';
	import { customMetrics } from '$lib/stores/customMetricStore.svelte';

	let formData = $state({
		systolic: '',
		diastolic: '',
		heart_rate: '',
		blood_glucose: '',
		weight: '',
		temperature: '',
		source: '',
		custom_metrics: [
			{ key: '', value: '', unit: 'ng/mL' },
			{ key: '', value: '', unit: 'μmol/L' }
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

<section class="hms-container py-6">
	<div class="mb-8">
		<p
			class=" flex h-[60px] w-[60px] items-center justify-center rounded-full bg-base-300 text-3xl"
		>
			📋
		</p>
		<h1 class=" mt-[3px] border-b-[3px] border-secondary pb-[8px] text-2xl font-bold">
			<span>Health Metrics</span>
			<span class=" text-secondary">|</span>
			<span class=" text-[#7f7f7f]">New</span>
		</h1>
		<p class=" text-lg text-[#7f7f7f]">Create new metrics here.</p>
	</div>

	<form>
		<div class="grid max-w-3xl grid-cols-1 gap-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<label class="floating-label">
					<span>Systolic (mmHg)</span>
					<input
						name="systolic"
						type="text"
						placeholder="Systolic (mmHg)"
						class="input w-full"
						required
						bind:value={formData.systolic}
					/>
				</label>
				<label class="floating-label">
					<span>Diastolic (mmHg)</span>
					<input
						name="diastolic"
						type="text"
						placeholder="Diastolic (mmHg)"
						class="input w-full"
						required
						bind:value={formData.diastolic}
					/>
				</label>
				<label class="floating-label">
					<span>Heart Rate (bpm)</span>
					<input
						name="heart_rate"
						type="text"
						placeholder="Heart Rate (bpm)"
						class="input w-full"
						required
						bind:value={formData.heart_rate}
					/>
				</label>
				<label class="floating-label">
					<span>Blood Glucose (mg/dL)</span>
					<input
						name="blood_glucose"
						type="text"
						placeholder="Blood Glucose (mg/dL)"
						class="input w-full"
						required
						bind:value={formData.blood_glucose}
					/>
				</label>
				<label class="floating-label">
					<span>Weight (kg)</span>
					<input
						name="weight"
						type="text"
						placeholder="Weight (kg)"
						class="input w-full"
						required
						bind:value={formData.weight}
					/>
				</label>

				<label class="floating-label">
					<span>Temperature (°C)</span>
					<input
						name="temperature"
						type="text"
						placeholder="Temperature (°C)"
						class="input w-full"
						required
						bind:value={formData.temperature}
					/>
				</label>
			</div>

			<div class="relative py-4">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t border-accent"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-base-100 px-2 text-[#737373]">Custom Metrics</span>
				</div>
			</div>

			{#each customMetrics.attributes as _, index}
				<CustomMetricFrom />
			{/each}
		</div>
	</form>
</section>

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
