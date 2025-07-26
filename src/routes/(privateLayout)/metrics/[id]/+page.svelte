<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import CustomMetricFrom from '$lib/components/CustomMetricFrom.svelte';
	import { customMetrics } from '$lib/stores/customMetricStore.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();

	const newCustomMetric = { key: '', value: '', unit: '' };

	let formData = $state({
		systolic: '',
		diastolic: '',
		heart_rate: '',
		blood_glucose: '',
		weight: '',
		temperature: '',
		source: 'manual',
		custom_metrics: [] as any
	});

	let modalSuccess = $state(false);
	let loading = $state(false);

    // console.log(data.metric)

	onMount(() => {
        formData = data.metric;
        customMetrics.update(data.metric.custom_metrics);
		if (!customMetrics.attributes?.length) {
			customMetrics.add({ ...newCustomMetric });
		}
	});

	// $effect(() => {
	// 	$inspect(formData)
	// })

	async function handleSubmit(e: Event) {
		e.preventDefault();

		loading = true;

		formData.custom_metrics = customMetrics.attributes;
		

		try {
			const res = await fetch('/api/metrics/new', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			const result = await res.json();
			if (result.success) {
				modalSuccess = true;
			} else {
				alert(`❌ Error: ${result.error}`);
			}
		} catch (err) {
			console.error(err);
			alert('Something went wrong while submitting!');
		} finally {
			loading = false;
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
			<span class=" text-[#7f7f7f]">{data?.metric?.id}</span>
		</h1>
		<p class=" text-lg text-[#7f7f7f]">Edit your metrics here.</p>
	</div>

	<form onsubmit={handleSubmit}>
		<p class=" mb-2 text-xs text-[#7f7f7f]">(All fields required.)</p>
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
				<CustomMetricFrom {index} />
			{/each}

			<div class="w-full">
				<button
					type="button"
					class="btn btn-soft btn-secondary"
					onclick={() => customMetrics.add(newCustomMetric)}
				>
					➕ Add Custom Metric
				</button>
			</div>
		</div>

		<div class="mt-16 flex w-full gap-[30px]">
			<button type="submit" class="btn btn-wide max-w-[130px] btn-lg btn-primary">Save</button>
			<a href="/metrics" class="btn btn-wide max-w-[130px] btn-outline btn-lg btn-primary">Cancel</a
			>
		</div>
	</form>
</section>

{#if modalSuccess}
	<dialog id="my_modal_1" class="modal-open modal">
		<div class="modal-box" transition:fade>
			<figure class="mx-auto mb-[7px] flex h-[50px] w-[45px] items-center justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					id="Layer_1"
					data-name="Layer 1"
					width="262.5019"
					height="300"
					viewBox="0 0 262.5019 300"
				>
					<defs>
						<style>
							.cls-1 {
								fill: #21235f;
							}
						</style>
					</defs>
					<path
						class="cls-1"
						d="M256.9172,57.3047c-4.4709-2.0745-9.7811-.8148-12.8438,3.0469-.2519,.334-26.2559,36.0879-112.8223,36.0879-86.0625-.0117-112.2656-35.3789-112.8164-36.0879-3.0011-3.8982-8.2987-5.2038-12.7676-3.1465-4.5469,2.0684-6.7441,6.9375-5.1504,11.3906,.2051,.5859,14.4492,38.6719,55.7461,62.5195v.1348c.0101,41.4214,33.597,74.9918,75.0183,74.9817,41.4071-.0101,74.9716-33.5746,74.9817-74.9817v-.1289c41.2793-23.8945,55.5176-61.9805,55.7285-62.5254,1.5762-4.418-.6035-9.1934-5.0742-11.291Zm-73.1719,167.6953h-9.7793c-27.1069,12.4998-58.3286,12.4998-85.4355,0h-9.7793c-32.438,.0115-61.5201,19.9958-73.1602,50.2734-4.6172,11.9473,4.998,24.7266,17.8125,24.7266H239.0929c12.8145,0,22.4297-12.7793,17.8125-24.7266-11.6401-30.2776-40.7221-50.2619-73.1601-50.2734Zm16.9336-158.4551C194.2043,37.5293,182.1457,0,162.9504,0c-6.0527,0-11.4551,2.6074-15.9961,6.1348-8.9748,6.979-21.5408,6.979-30.5156,0-4.5234-3.5273-9.9434-6.1348-15.9961-6.1348-19.2598,0-31.3359,37.7871-37.7988,66.8438,15.2871,5.8125,37.4063,10.834,68.6074,10.834,31.7402,0,54.1172-5.1797,69.4277-11.1328Z"
					/>
				</svg>
			</figure>
			<h4 class=" text-center text-3xl font-bold text-primary">User Profile Details</h4>
			<p class=" text-center text-2xl text-[#7f7f7f]">successfully saved.</p>
			<div class="modal-action justify-center">
				<button
					type="button"
					onclick={() => {
						invalidate('supabase:health_metrics').then(() => goto('/metrics'));
					}}
					class="btn btn-wide max-w-[150px] btn-lg btn-primary">Continue</button
				>
			</div>
		</div>
	</dialog>
{/if}
