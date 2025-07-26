<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import CustomMetricFrom from '$lib/components/CustomMetricFrom.svelte';
	import { customMetrics } from '$lib/stores/customMetricStore.svelte';
	import { onDestroy, onMount } from 'svelte';
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

	onMount(() => {
		if (!customMetrics.attributes?.length) {
			customMetrics.add({ ...newCustomMetric });
		}
	});

	onDestroy(() => {
		customMetrics.update([]);
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
				sendMail()
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

	const sendMail = async () => {
		try {
			const res = await fetch(`/api/send-email`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					to: data?.user?.email,
					subject: 'Bug Report Received - aiWritely',
					text: `<div> Email will Send</div>`
				})
			});

			// const mailRes = await res.json();
			// console.log('Email response:', mailRes);
		} catch (error) {
			console.error('Failed to send email:', error);
		}
	};
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
			<p
				class=" mx-auto mb-[7px] flex h-[70px] w-[70px] items-center justify-center rounded-full bg-base-300 text-5xl"
			>
				📋
			</p>
			<h4 class=" text-center text-3xl font-bold text-primary">Health Metrics</h4>
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
