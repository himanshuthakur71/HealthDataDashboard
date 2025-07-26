<script lang="ts">
	import { marked } from 'marked';
	import { goto, invalidate } from '$app/navigation';
	import CustomMetricFrom from '$lib/components/CustomMetricFrom.svelte';
	import { customMetrics } from '$lib/stores/customMetricStore.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import HealthScore from '$lib/components/HealthScore.svelte';

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
	let modalDelete = $state(false);
	let deleteText = $state('');
	let successDeleteModal = $state(false);

	// console.log(data.metric)

	onMount(() => {
		formData = data.metric;
		customMetrics.update(data.metric.custom_metrics);
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
			const res = await fetch(`/api/metrics/${page.params.id}`, {
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

	let deleting = $state(false);

	const deleteMetric = async (e: Event) => {
		e.preventDefault();

		if (deleteText === 'delete metric') {
			deleting = true;
			try {
				const res = await fetch(`/api/metrics/${page.params.id}/delete`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData)
				});

				const result = await res.json();
				if (result.success) {
					modalDelete = false;
					setTimeout(() => {
						successDeleteModal = true;
					}, 500);
				} else {
					alert(`❌ Error: ${result.error}`);
				}
			} catch (err) {
				console.error(err);
				alert('Something went wrong while submitting!');
			} finally {
				deleting = false;
			}
		} else {
			alert('Please type "delete metric" to confirm deletion.');
		}
	};

	let sending = $state(false);

	const summary: any = $derived({
		heart_rate: formData?.heart_rate ?? 0,
		blood_pressure: {
			systolic: formData?.systolic ?? 0,
			diastolic: formData?.diastolic ?? 0
		},
		blood_glucose: formData?.blood_glucose ?? 0,
		temperature: formData?.temperature ?? 0,
		weight: formData?.weight ?? 0
	});

	// Basic score example — customize as needed
	let healthScore = $derived(
		Math.min(
			100,
			Math.round(
				100 -
					Math.abs(120 - summary.blood_pressure.systolic) -
					Math.abs(80 - summary.blood_pressure.diastolic) -
					Math.abs(72 - summary.heart_rate)
			)
		)
	);

	const sendHealthReport = async () => {
		sending = true;

		const res = await fetch('c', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				formData,
				healthScore
			})
		});
		const { generatedText } = await res.json();
		// console.log(generatedText);

		let healthColor = '#198754'; // green
		if (healthScore < 40)
			healthColor = '#dc3545'; // red
		else if (healthScore < 70) healthColor = '#ffc107'; // yellow

		try {
			const res = await fetch('/api/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					to: data?.user?.email,
					subject: '🩺 New Health Report Submitted',
					text: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
  <div style="background-color: ${healthColor}; padding: 20px; text-align: center;">
    <h1 style="color: #ffffff;">Health Report Summary</h1>
  </div>

  <div style="padding: 20px; background-color: #ffffff;">
    <p><strong>A new health report has been submitted.</strong></p>

    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px; font-weight: bold;">Systolic</td><td>${formData.systolic} mmHg</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Diastolic</td><td>${formData.diastolic} mmHg</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Heart Rate</td><td>${formData.heart_rate} bpm</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Blood Glucose</td><td>${formData.blood_glucose} mg/dL</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Weight</td><td>${formData.weight} kg</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Temperature</td><td>${formData.temperature} °C</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Source</td><td>${formData.source}</td></tr>
    </table>

    ${
			formData.custom_metrics?.length
				? `
    <h3 style="margin-top: 20px;">Custom Metrics:</h3>
    <table style="width: 100%; border-collapse: collapse;">
      ${formData.custom_metrics
				.map(
					(m: any) =>
						`<tr><td style="padding: 8px; font-weight: bold;">${m.key}</td><td>${m.value} ${m.unit}</td></tr>`
				)
				.join('')}
    </table>
    `
				: ''
		}

    <div style="background-color: #f8f9fa; padding: 15px; margin-top: 25px; border-radius: 6px;">
      <strong style="display: block; margin-bottom: 8px;">Health Score: ${healthScore} / 100</strong>
      <div style="width: 100%; background: #dee2e6; border-radius: 4px; height: 16px; overflow: hidden;">
        <div style="width: ${healthScore}%; background: ${healthColor}; height: 100%;"></div>
      </div>
    </div>

    <div style="background-color: #fff3cd; padding: 15px; margin-top: 25px; border-radius: 6px;">
      <strong>AI Doctor's Feedback:</strong>
      <div style="margin: 10px 0 0;">
				${marked(generatedText)}
	  </div>
    </div>

    <p style="margin-top: 20px;">This summary can be shared with your healthcare provider for review.</p>
  </div>

  <div style="text-align: center; padding: 10px; font-size: 12px; color: #777;">
    <p>Stay healthy,<br>Your Health App Team</p>
    <p>© ${new Date().getFullYear()} Health Tracker. All rights reserved.</p>
  </div>
</div>`
				})
			});
		} catch (error) {
			console.error('Failed to send health report email:', error);
		} finally {
			sending = false;
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
			<span class=" text-[#7f7f7f]">{data?.metric?.id}</span>
		</h1>
		<p class=" text-lg text-[#7f7f7f]">Edit your metrics here.</p>
	</div>

	<div class="mb-6 w-full">
		<HealthScore score={healthScore} />
	</div>
	<div class="relative w-full">
		<div class=" absolute top-0 right-0 flex flex-col gap-2">
			<button onclick={() => (modalDelete = true)} type="button" class=" btn btn-error"
				>Delete Metrics</button
			>
			<button onclick={sendHealthReport} type="button" class=" btn btn-success"
				>Email Metrics</button
			>
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
				<a href="/metrics" class="btn btn-wide max-w-[130px] btn-outline btn-lg btn-primary"
					>Cancel</a
				>
			</div>
		</form>
	</div>
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

{#if modalDelete}
	<dialog id="my_modal_1" class="modal-open modal">
		<div class="relative modal-box" transition:fade>
			<button
				onclick={() => (modalDelete = false)}
				type="button"
				aria-label="close"
				class=" absolute top-[15px] right-[15px] cursor-pointer"
			>
				<svg
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					width="20px"
					height="20px"
				>
					<g transform="matrix(1 0 0 1 -644 -848 )">
						<path
							d="M 12.021428571428569 10  L 20 2.0214285714285714  L 17.97857142857143 0  L 10 7.9785714285714295  L 2.0214285714285714 0  L 0 2.0214285714285714  L 7.9785714285714295 10  L 0 17.97857142857143  L 2.0214285714285714 20  L 10 12.021428571428569  L 17.97857142857143 20  L 20 17.97857142857143  L 12.021428571428569 10  Z "
							fill-rule="nonzero"
							fill="#1e98d7"
							stroke="none"
							transform="matrix(1 0 0 1 644 848 )"
						/>
					</g>
				</svg>
			</button>
			<figure class="flex h-[40px] w-[38px] items-center justify-center">
				<svg
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					width="38px"
					height="40px"
				>
					<g transform="matrix(1 0 0 1 -268 -856 )">
						<path
							d="M 13.57528409090909 33.098958333333336  C 13.73721590909091 32.942708333333336  13.818181818181818 32.74305555555556  14 32.5  L 14 14.166666666666664  C 13.818181818181818 13.92361111111111  13.73721590909091 13.723958333333336  13.57528409090909 13.567708333333336  C 13.413352272727272 13.411458333333336  13.206439393939396 13.333333333333336  12.954545454545453 13.333333333333336  L 11.227272727272728 13.333333333333336  C 10.975378787878789 13.333333333333336  10.768465909090912 13.411458333333336  10.60653409090909 13.567708333333336  C 10.444602272727272 13.723958333333336  10.363636363636363 13.92361111111111  11 14.166666666666664  L 11 32.5  C 10.363636363636363 32.74305555555556  10.444602272727272 32.942708333333336  10.60653409090909 33.098958333333336  C 10.768465909090912 33.255208333333336  10.975378787878789 33.333333333333336  11.227272727272728 33.333333333333336  L 12.954545454545453 33.333333333333336  C 13.206439393939396 33.333333333333336  13.413352272727272 33.255208333333336  13.57528409090909 33.098958333333336  Z M 20.484375 33.098958333333336  C 20.64630681818182 32.942708333333336  20.727272727272727 32.74305555555556  20 32.5  L 20 14.166666666666664  C 20.727272727272727 13.92361111111111  20.64630681818182 13.723958333333336  20.484375 13.567708333333336  C 20.32244318181818 13.411458333333336  20.115530303030305 13.333333333333336  19.863636363636363 13.333333333333336  L 18.136363636363637 13.333333333333336  C 17.8844696969697 13.333333333333336  17.67755681818182 13.411458333333336  17.515625 13.567708333333336  C 17.35369318181818 13.723958333333336  17.272727272727273 13.92361111111111  18 14.166666666666664  L 18 32.5  C 17.272727272727273 32.74305555555556  17.35369318181818 32.942708333333336  17.515625 33.098958333333336  C 17.67755681818182 33.255208333333336  17.8844696969697 33.333333333333336  18.136363636363637 33.333333333333336  L 19.863636363636363 33.333333333333336  C 20.115530303030305 33.333333333333336  20.32244318181818 33.255208333333336  20.484375 33.098958333333336  Z M 27.393465909090907 33.098958333333336  C 27.555397727272727 32.942708333333336  27.636363636363637 32.74305555555556  27 32.5  L 27 14.166666666666664  C 27.636363636363637 13.92361111111111  27.555397727272727 13.723958333333336  27.393465909090907 13.567708333333336  C 27.231534090909093 13.411458333333336  27.02462121212121 13.333333333333336  26.772727272727273 13.333333333333336  L 25.045454545454543 13.333333333333336  C 24.793560606060606 13.333333333333336  24.586647727272727 13.411458333333336  24.424715909090907 13.567708333333336  C 24.262784090909093 13.723958333333336  24.18181818181818 13.92361111111111  24 14.166666666666664  L 24 32.5  C 24.18181818181818 32.74305555555556  24.262784090909093 32.942708333333336  24.424715909090907 33.098958333333336  C 24.586647727272727 33.255208333333336  24.793560606060606 33.333333333333336  25.045454545454543 33.333333333333336  L 26.772727272727273 33.333333333333336  C 27.02462121212121 33.333333333333336  27.231534090909093 33.255208333333336  27.393465909090907 33.098958333333336  Z M 14.276988636363637 3.619791666666665  L 12.954545454545453 7  L 25.045454545454543 7  L 23.75 3.619791666666665  C 23.624053030303035 3.463541666666665  23.471117424242426 3.3680555555555536  23.29119318181818 3.333333333333335  L 14.735795454545453 3.333333333333335  C 14.555871212121213 3.3680555555555536  14.402935606060609 3.463541666666665  14.276988636363637 3.619791666666665  Z M 37.75710227272727 6.901041666666665  C 37.91903409090909 7.057291666666665  38 7.256944444444442  38 7.5  L 38 9.166666666666664  C 38 9.409722222222218  37.91903409090909 9.609375  37.75710227272727 9.765625  C 37.59517045454545 9.921875  37.38825757575758 10  37.13636363636364 10  L 34 10  L 34 34.6875  C 34.54545454545455 36.12847222222222  34.12263257575758 37.37413194444444  33.27698863636364 38.424479166666664  C 32.4313446969697 39.474826388888886  31.414772727272727 40  30.227272727272727 40  L 7.772727272727273 40  C 6.585227272727273 40  5.5686553030303045 39.4921875  4.723011363636363 38.4765625  C 3.8773674242424248 37.4609375  3.4545454545454546 36.232638888888886  4 34.791666666666664  L 4 10  L 0.8636363636363636 10  C 0.6117424242424242 10  0.40482954545454547 9.921875  0.2428977272727273 9.765625  C 0.08096590909090909 9.609375  0 9.409722222222218  0 9.166666666666664  L 0 7.5  C 0 7.256944444444442  0.08096590909090909 7.057291666666665  0.2428977272727273 6.901041666666665  C 0.40482954545454547 6.744791666666665  0.6117424242424242 6.666666666666665  0.8636363636363636 6.666666666666665  L 9.203125 6.666666666666665  L 11.092329545454547 2.317708333333335  C 11.362215909090912 1.6753472222222188  11.848011363636365 1.1284722222222188  12.54971590909091 0.6770833333333348  C 13.251420454545455 0.22569444444444198  13.962121212121213 0  14.681818181818182 0  L 23.31818181818182 0  C 24.037878787878793 0  24.748579545454543 0.22569444444444198  25.450284090909093 0.6770833333333348  C 26.151988636363637 1.1284722222222188  26.637784090909093 1.6753472222222188  26.907670454545457 2.317708333333335  L 28.796875 6.666666666666665  L 37.13636363636364 6.666666666666665  C 37.38825757575758 6.666666666666665  37.59517045454545 6.744791666666665  37.75710227272727 6.901041666666665  Z "
							fill-rule="nonzero"
							fill="#21235f"
							stroke="none"
							transform="matrix(1 0 0 1 268 856 )"
						/>
					</g>
				</svg>
			</figure>
			<h4 class=" mb-[20px] text-2xl font-bold text-primary">Delete Metric</h4>

			<p class=" mb-[29px] text-lg text-primary">
				You're about to permanently delete this metric and all of its data. If you're not sure,
				please press cancel.
			</p>

			<form onsubmit={deleteMetric}>
				<p
					class=" mb-[20px] border-b-[3px] border-[#d7d7d7] pb-[7px] text-lg font-bold text-primary"
				>
					Type "delete metric" and submit.
				</p>

				<input
					type="text"
					placeholder="Type Here"
					class="input input-lg w-full max-w-[203px]"
					bind:value={deleteText}
				/>

				<div class="mt-[45px] flex w-full gap-[26px]">
					<button
						onclick={() => (modalDelete = false)}
						type="button"
						class=" btn btn-outline btn-lg btn-primary">Cancel</button
					>
					<button type="submit" class=" btn btn-lg btn-primary">Delete</button>
				</div>
			</form>
		</div>
	</dialog>
{/if}

{#if successDeleteModal}
	<dialog id="my_modal_1" class="modal-open modal">
		<div class="modal-box" transition:fade>
			<figure class="mx-auto flex h-[48px] w-[50px] items-center justify-center">
				<svg
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					width="48px"
					height="50px"
					class="h-full w-full"
				>
					<g transform="matrix(1 0 0 1 -268 -856 )">
						<path
							d="M 13.57528409090909 33.098958333333336  C 13.73721590909091 32.942708333333336  13.818181818181818 32.74305555555556  14 32.5  L 14 14.166666666666664  C 13.818181818181818 13.92361111111111  13.73721590909091 13.723958333333336  13.57528409090909 13.567708333333336  C 13.413352272727272 13.411458333333336  13.206439393939396 13.333333333333336  12.954545454545453 13.333333333333336  L 11.227272727272728 13.333333333333336  C 10.975378787878789 13.333333333333336  10.768465909090912 13.411458333333336  10.60653409090909 13.567708333333336  C 10.444602272727272 13.723958333333336  10.363636363636363 13.92361111111111  11 14.166666666666664  L 11 32.5  C 10.363636363636363 32.74305555555556  10.444602272727272 32.942708333333336  10.60653409090909 33.098958333333336  C 10.768465909090912 33.255208333333336  10.975378787878789 33.333333333333336  11.227272727272728 33.333333333333336  L 12.954545454545453 33.333333333333336  C 13.206439393939396 33.333333333333336  13.413352272727272 33.255208333333336  13.57528409090909 33.098958333333336  Z M 20.484375 33.098958333333336  C 20.64630681818182 32.942708333333336  20.727272727272727 32.74305555555556  20 32.5  L 20 14.166666666666664  C 20.727272727272727 13.92361111111111  20.64630681818182 13.723958333333336  20.484375 13.567708333333336  C 20.32244318181818 13.411458333333336  20.115530303030305 13.333333333333336  19.863636363636363 13.333333333333336  L 18.136363636363637 13.333333333333336  C 17.8844696969697 13.333333333333336  17.67755681818182 13.411458333333336  17.515625 13.567708333333336  C 17.35369318181818 13.723958333333336  17.272727272727273 13.92361111111111  18 14.166666666666664  L 18 32.5  C 17.272727272727273 32.74305555555556  17.35369318181818 32.942708333333336  17.515625 33.098958333333336  C 17.67755681818182 33.255208333333336  17.8844696969697 33.333333333333336  18.136363636363637 33.333333333333336  L 19.863636363636363 33.333333333333336  C 20.115530303030305 33.333333333333336  20.32244318181818 33.255208333333336  20.484375 33.098958333333336  Z M 27.393465909090907 33.098958333333336  C 27.555397727272727 32.942708333333336  27.636363636363637 32.74305555555556  27 32.5  L 27 14.166666666666664  C 27.636363636363637 13.92361111111111  27.555397727272727 13.723958333333336  27.393465909090907 13.567708333333336  C 27.231534090909093 13.411458333333336  27.02462121212121 13.333333333333336  26.772727272727273 13.333333333333336  L 25.045454545454543 13.333333333333336  C 24.793560606060606 13.333333333333336  24.586647727272727 13.411458333333336  24.424715909090907 13.567708333333336  C 24.262784090909093 13.723958333333336  24.18181818181818 13.92361111111111  24 14.166666666666664  L 24 32.5  C 24.18181818181818 32.74305555555556  24.262784090909093 32.942708333333336  24.424715909090907 33.098958333333336  C 24.586647727272727 33.255208333333336  24.793560606060606 33.333333333333336  25.045454545454543 33.333333333333336  L 26.772727272727273 33.333333333333336  C 27.02462121212121 33.333333333333336  27.231534090909093 33.255208333333336  27.393465909090907 33.098958333333336  Z M 14.276988636363637 3.619791666666665  L 12.954545454545453 7  L 25.045454545454543 7  L 23.75 3.619791666666665  C 23.624053030303035 3.463541666666665  23.471117424242426 3.3680555555555536  23.29119318181818 3.333333333333335  L 14.735795454545453 3.333333333333335  C 14.555871212121213 3.3680555555555536  14.402935606060609 3.463541666666665  14.276988636363637 3.619791666666665  Z M 37.75710227272727 6.901041666666665  C 37.91903409090909 7.057291666666665  38 7.256944444444442  38 7.5  L 38 9.166666666666664  C 38 9.409722222222218  37.91903409090909 9.609375  37.75710227272727 9.765625  C 37.59517045454545 9.921875  37.38825757575758 10  37.13636363636364 10  L 34 10  L 34 34.6875  C 34.54545454545455 36.12847222222222  34.12263257575758 37.37413194444444  33.27698863636364 38.424479166666664  C 32.4313446969697 39.474826388888886  31.414772727272727 40  30.227272727272727 40  L 7.772727272727273 40  C 6.585227272727273 40  5.5686553030303045 39.4921875  4.723011363636363 38.4765625  C 3.8773674242424248 37.4609375  3.4545454545454546 36.232638888888886  4 34.791666666666664  L 4 10  L 0.8636363636363636 10  C 0.6117424242424242 10  0.40482954545454547 9.921875  0.2428977272727273 9.765625  C 0.08096590909090909 9.609375  0 9.409722222222218  0 9.166666666666664  L 0 7.5  C 0 7.256944444444442  0.08096590909090909 7.057291666666665  0.2428977272727273 6.901041666666665  C 0.40482954545454547 6.744791666666665  0.6117424242424242 6.666666666666665  0.8636363636363636 6.666666666666665  L 9.203125 6.666666666666665  L 11.092329545454547 2.317708333333335  C 11.362215909090912 1.6753472222222188  11.848011363636365 1.1284722222222188  12.54971590909091 0.6770833333333348  C 13.251420454545455 0.22569444444444198  13.962121212121213 0  14.681818181818182 0  L 23.31818181818182 0  C 24.037878787878793 0  24.748579545454543 0.22569444444444198  25.450284090909093 0.6770833333333348  C 26.151988636363637 1.1284722222222188  26.637784090909093 1.6753472222222188  26.907670454545457 2.317708333333335  L 28.796875 6.666666666666665  L 37.13636363636364 6.666666666666665  C 37.38825757575758 6.666666666666665  37.59517045454545 6.744791666666665  37.75710227272727 6.901041666666665  Z "
							fill-rule="nonzero"
							fill="#21235f"
							stroke="none"
							transform="matrix(1 0 0 1 268 856 )"
						/>
					</g>
				</svg>
			</figure>
			<h4 class=" text-center text-3xl font-bold text-primary">Health Metrics been</h4>
			<p class=" text-center text-2xl text-[#7f7f7f]">successfully deleted.</p>
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
