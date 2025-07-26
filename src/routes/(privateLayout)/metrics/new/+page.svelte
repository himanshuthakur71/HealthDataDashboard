<script lang="ts">
	import { invalidate } from '$app/navigation';
	import CustomMetricFrom from '$lib/components/CustomMetricFrom.svelte';
	import { customMetrics } from '$lib/stores/customMetricStore.svelte';

	const newCustomMetric = { key: '', value: '', unit: 'ng/mL' }

	let formData = $state({
		systolic: '',
		diastolic: '',
		heart_rate: '',
		blood_glucose: '',
		weight: '',
		temperature: '',
		source: '',
		custom_metrics: [
			
		]
	});

	let message = $state('');
	let loading = $state(false);

	

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
			custom_metrics:  customMetrics.attributes.filter((m) => m.key && m.value && m.unit)
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

			<div class="w-full">
				<button type="button" class="btn btn-outline" onclick={() => (customMetrics.add(newCustomMetric))}>
				➕ Add Custom Metric
			</button>
			</div>
		</div>
	</form>
</section>


