<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { metricUnits } from '$lib/json/metricUnits.json';
	import { fade } from 'svelte/transition';
	import type { ActionData } from './$types';
	import { generateGeminiReport } from '$lib/helpers/generateGeminiReport';
	import { generateHealthScore } from '$lib/helpers/generateHealthScore';
	import { createEmailHTML } from '$lib/helpers/createEmailHtml';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { page } from '$app/state';
	import { generateGeminiHealthMatic } from '$lib/helpers/generateGeminiHealthMatic';
	import { parseHealthTextToJSON } from '$lib/helpers/parseHealthTextToJSON';

	let { data, form }: { data: any; form: ActionData } = $props();

	const { user, supabase } = $derived(data);

	let systolic = $state('');
	let diastolic = $state('');
	let heart_rate = $state('');
	let blood_glucose = $state('');
	let weight = $state('');
	let temperature = $state('');
	let source = $state('manual');

	let uploaded = $state(JSON.parse(page.url.searchParams.get('upload') || 'false'));

	let customMetrics = $state([{ order: 1, key: '', value: '', unit: '' }]);

	function addMetric() {
		customMetrics.push({ order: customMetrics?.length + 1, key: '', value: '', unit: '' });
	}

	function removeMetric(index: any) {
		customMetrics.splice(index, 1);
	}

	const enhanceOptions = ({ action }: any) => {
		return async ({ result, update }: any) => {
			await update(); // Optional: update UI first

			if (result.type === 'success') {
				const { formData, metric_id: supa_metric_id } = result.data;

				console.log({
					formData,
					supa_metric_id
				});

				// Fire background-like tasks (non-blocking)
				queueMicrotask(async () => {
					try {
						const healthScore = await generateHealthScore(formData);

						// AI DOCTOR

						const patient_name = `${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}`;

						const geminiReport = await generateGeminiReport({
							formData,
							healthScore,
							patient_name
						});

						if (geminiReport) {
							// Save Report to DB
							const { error: insertError } = await data?.supabase.from('ai_reports').insert([
								{
									user_id: data?.user?.id,
									metric_id: supa_metric_id,
									health_score: healthScore,
									feedback: geminiReport
								}
							]);
							if (insertError) {
								console.error('Error saving report to Supabase:', insertError);
							}

							// Create email html
							const emailHtml = createEmailHTML(healthScore, formData, geminiReport);

							if (emailHtml) {
								// console.log({
								// 	geminiReport,
								// 	emailHtml
								// });
								// Send Email

								const emailRes = await fetch('/api/send-email', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify({
										to: user?.email,
										subject: '🩺 New Health Report Submitted',
										text: emailHtml
									})
								});

								const emailResult = await emailRes.json();

								if ((emailResult.message = 'Email sent successfully!')) {
									toastStore.add('success', 'AI Health Report emailed.');
								}
							}
						}
					} catch (error) {
						console.error('Background task error:', error);
					}
				});
			}
		};
	};

	let pdf: File | null = $state(null);
	let pdfName = $state('');
	let pdfUrl = $state('');
	let uploading = $state(false);
	let noRecordModal = $state(false);

	async function handlePdfUpload(e: Event) {
		e.preventDefault();

		if (!pdf || !user?.id) {
			alert('Missing PDF file or user ID');
			return;
		}

		uploading = true;
		try {
			// Upload PDF
			const filePath = `pdfs/${user?.id}-${Date.now()}.pdf`;
			const { error: uploadError } = await supabase.storage
				.from('health-pdfs')
				.upload(filePath, pdf, {
					upsert: true,
					contentType: 'application/pdf'
				});
			if (uploadError) {
				alert('❌ PDF Upload Failed');
				console.error(uploadError.message);
				uploading = false;
				return;
			}

			// Get Uploaded PDF
			const { data } = supabase.storage.from('health-pdfs').getPublicUrl(filePath);
			pdfUrl = data?.publicUrl || '';
			pdfName = pdf.name;
			
			// convert PDF to text
			const pdfText = await parsePDF(pdfUrl);

			// console.log(pdfText)

			//  Send Text to AI for JSON
			const aiMetric = await generateGeminiHealthMatic({ text: pdfText });

			//  AI REsponse to vaild JSON
			const aiMetricJson = parseHealthTextToJSON(aiMetric);

			console.log(aiMetricJson);

			// Update form vales
			if (aiMetricJson?.extracted) {
				systolic = aiMetricJson?.metric?.systolic || '';
				diastolic = aiMetricJson?.metric?.diastolic || '';
				heart_rate = aiMetricJson?.metric?.heart_rate || '';
				blood_glucose = aiMetricJson?.metric?.blood_glucose || '';
				weight = aiMetricJson?.metric?.weight || '';
				temperature = aiMetricJson?.metric?.temperature || '';
				source = aiMetricJson?.metric?.source || 'uploaded';
				// customMetrics = aiMetric?.metric?.custom_metrics;
			} else {
				uploading = false;

				setTimeout(() => {
					noRecordModal = true;
				}, 500);
			}
		} catch (error) {
			console.log(error);
		} finally {
			uploading = false;
		}
	}

	const parsePDF = async (url: String) => {
		const res = await fetch(`https://express-health-ai.vercel.app/api/pdf-to-text?url=${url}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		const Resdata = await res.json();

		return Resdata?.text || '';
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

	{#if uploaded}
		<!-- PDF Upload UI -->
		<form onsubmit={handlePdfUpload} class="mb-4">
			<p class=" mb-[3px] text-sm text-[#7f7f7f]">Upload Health Matric PDF</p>
			<div class="join w-full max-w-xl">
				<input
					type="file"
					accept="application/pdf"
					onchange={(e: any) => (pdf = e.target.files?.[0] ?? null)}
					class="file-input"
				/>
				<button type="submit" class="btn join-item rounded-r-full" disabled={!pdf || uploading}>
					{uploading ? 'Uploading...' : 'Upload PDF'}
				</button>
			</div>

			<!-- {#if pdfUrl}
			<div class="mt-4">
				<p class="text-green-600">✅ Uploaded: {pdfName}</p>
				<a href={pdfUrl} target="_blank" class="text-blue-500 underline">View PDF</a>
			</div>
		{/if} -->
		</form>
	{/if}
	<form
		method="post"
		enctype="multipart/form-data"
		use:enhance={enhanceOptions}
		action="?/addMetrics"
	>
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
						bind:value={systolic}
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
						bind:value={diastolic}
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
						bind:value={heart_rate}
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
						bind:value={blood_glucose}
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
						bind:value={weight}
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
						bind:value={temperature}
					/>
				</label>

				<input type="hidden" name="source" bind:value={source} />
				<input type="hidden" name="pdf_url" bind:value={pdfUrl}>
			</div>

			<div class="relative py-4">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t border-accent"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-base-100 px-2 text-[#737373]">Custom Metrics</span>
				</div>
			</div>

			{#each customMetrics as metric, i (i)}
				<div class="relative grid grid-cols-1 gap-4 pr-[50px] md:grid-cols-2 lg:grid-cols-3">
					<input type="hidden" name="order" bind:value={metric.order} />
					<label class="floating-label">
						<span>Key</span>
						<input
							name="key"
							type="text"
							placeholder="Key"
							class="input w-full"
							required
							bind:value={metric.key}
						/>
					</label>

					<label class="floating-label">
						<span>Unit</span>

						<select class="select w-full" name="unit" required bind:value={metric.unit}>
							<option value="">Select</option>
							{#each metricUnits as u}
								<option value={u}>{u}</option>
							{/each}
						</select>
					</label>

					<label class="floating-label">
						<span>Value</span>
						<input
							name="value"
							type="text"
							placeholder="Value"
							class="input w-full"
							required
							bind:value={metric.value}
						/>
					</label>

					<button
						onclick={() => removeMetric(i)}
						aria-label="delete"
						type="button"
						class=" btn absolute right-0 btn-circle btn-error"
					>
						<svg
							xmlns:xlink="http://www.w3.org/1999/xlink"
							xmlns="http://www.w3.org/2000/svg"
							version="1.1"
							width="25px"
							height="26px"
						>
							<g transform="matrix(1 0 0 1 -58 -57 )">
								<path
									d="M 8.931107954545455 21.514322916666668  C 9.037642045454545 21.412760416666668  9.090909090909092 21.28298611111111  9 21.125  L 9 9.208333333333332  C 9.090909090909092 9.050347222222223  9.037642045454545 8.920572916666668  8.931107954545455 8.819010416666668  C 8.824573863636363 8.717447916666668  8.68844696969697 8.666666666666668  8.522727272727272 8.666666666666668  L 7.386363636363637 8.666666666666668  C 7.22064393939394 8.666666666666668  7.084517045454547 8.717447916666668  6.977982954545454 8.819010416666668  C 6.871448863636363 8.920572916666668  6.8181818181818175 9.050347222222223  7 9.208333333333332  L 7 21.125  C 6.8181818181818175 21.28298611111111  6.871448863636363 21.412760416666668  6.977982954545454 21.514322916666668  C 7.084517045454547 21.615885416666668  7.22064393939394 21.666666666666668  7.386363636363637 21.666666666666668  L 8.522727272727272 21.666666666666668  C 8.68844696969697 21.666666666666668  8.824573863636363 21.615885416666668  8.931107954545455 21.514322916666668  Z M 13.4765625 21.514322916666668  C 13.583096590909092 21.412760416666668  13.636363636363635 21.28298611111111  13.636363636363635 21.125  L 13.636363636363635 9.208333333333332  C 13.636363636363635 9.050347222222223  13.583096590909092 8.920572916666668  13.4765625 8.819010416666668  C 13.370028409090908 8.717447916666668  13.233901515151517 8.666666666666668  13.068181818181818 8.666666666666668  L 11.931818181818182 8.666666666666668  C 11.766098484848486 8.666666666666668  11.629971590909092 8.717447916666668  11.5234375 8.819010416666668  C 11.416903409090908 8.920572916666668  11.363636363636363 9.050347222222223  11.363636363636363 9.208333333333332  L 11.363636363636363 21.125  C 11.363636363636363 21.28298611111111  11.416903409090908 21.412760416666668  11.5234375 21.514322916666668  C 11.629971590909092 21.615885416666668  11.766098484848486 21.666666666666668  11.931818181818182 21.666666666666668  L 13.068181818181818 21.666666666666668  C 13.233901515151517 21.666666666666668  13.370028409090908 21.615885416666668  13.4765625 21.514322916666668  Z M 18.022017045454543 21.514322916666668  C 18.128551136363637 21.412760416666668  18.181818181818183 21.28298611111111  18 21.125  L 18 9.208333333333332  C 18.181818181818183 9.050347222222223  18.128551136363637 8.920572916666668  18.022017045454543 8.819010416666668  C 17.915482954545457 8.717447916666668  17.779356060606062 8.666666666666668  17.613636363636363 8.666666666666668  L 16.477272727272727 8.666666666666668  C 16.31155303030303 8.666666666666668  16.175426136363637 8.717447916666668  16.068892045454543 8.819010416666668  C 15.962357954545455 8.920572916666668  15.909090909090908 9.050347222222223  16 9.208333333333332  L 16 21.125  C 15.909090909090908 21.28298611111111  15.962357954545455 21.412760416666668  16.068892045454543 21.514322916666668  C 16.175426136363637 21.615885416666668  16.31155303030303 21.666666666666668  16.477272727272727 21.666666666666668  L 17.613636363636363 21.666666666666668  C 17.779356060606062 21.666666666666668  17.915482954545457 21.615885416666668  18.022017045454543 21.514322916666668  Z M 9.392755681818182 2.352864583333332  L 8.522727272727272 4.333333333333332  L 16.477272727272727 4.333333333333332  L 15.625 2.352864583333332  C 15.542140151515154 2.251302083333332  15.441524621212121 2.18923611111111  15.323153409090908 2.166666666666668  L 9.694602272727272 2.166666666666668  C 9.57623106060606 2.18923611111111  9.475615530303031 2.251302083333332  9.392755681818182 2.352864583333332  Z M 24.840198863636363 4.485677083333332  C 24.946732954545457 4.587239583333332  25 4.7170138888888875  25 4.875  L 25 5.958333333333332  C 25 6.116319444444442  24.946732954545457 6.24609375  24.840198863636363 6.34765625  C 24.733664772727273 6.44921875  24.597537878787882 6.5  24.431818181818183 6.5  L 22.727272727272727 6.5  L 22.727272727272727 22.546875  C 22.727272727272727 23.483506944444443  22.449100378787882 24.29318576388889  21.892755681818183 24.975911458333332  C 21.336410984848484 25.65863715277778  20.667613636363637 26  19.886363636363637 26  L 5.113636363636364 26  C 4.332386363636364 26  3.663589015151516 25.669921875  3.107244318181818 25.009765625  C 2.5508996212121215 24.349609375  2.272727272727273 23.55121527777778  2.272727272727273 22.614583333333332  L 2.272727272727273 6.5  L 0.5681818181818182 6.5  C 0.4024621212121212 6.5  0.2663352272727273 6.44921875  0.15980113636363638 6.34765625  C 0.05326704545454545 6.24609375  0 6.116319444444442  0 5.958333333333332  L 0 4.875  C 0 4.7170138888888875  0.05326704545454545 4.587239583333332  0.15980113636363638 4.485677083333332  C 0.2663352272727273 4.384114583333332  0.4024621212121212 4.333333333333332  0.5681818181818182 4.333333333333332  L 6.0546875 4.333333333333332  L 7.2975852272727275 1.5065104166666676  C 7.475142045454547 1.0889756944444422  7.794744318181819 0.7335069444444422  8.256392045454545 0.44010416666666763  C 8.718039772727273 0.14670138888888729  9.18560606060606 0  9.659090909090908 0  L 15.340909090909092 0  C 15.814393939393941 0  16.281960227272727 0.14670138888888729  16.743607954545457 0.44010416666666763  C 17.205255681818183 0.7335069444444422  17.524857954545457 1.0889756944444422  17.702414772727273 1.5065104166666676  L 18.9453125 4.333333333333332  L 24.431818181818183 4.333333333333332  C 24.597537878787882 4.333333333333332  24.733664772727273 4.384114583333332  24.840198863636363 4.485677083333332  Z "
									fill-rule="nonzero"
									fill="#fff"
									stroke="none"
									transform="matrix(1 0 0 1 58 57 )"
								/>
							</g>
						</svg>
					</button>
				</div>
			{/each}

			<div class="w-full">
				<button type="button" class="btn btn-soft btn-secondary" onclick={addMetric}>
					➕ Add Custom Metric
				</button>
			</div>
		</div>

		<div class="mt-16 flex w-full gap-[30px]">
			<button type="submit" class="btn btn-wide max-w-[130px] btn-lg btn-primary">Save</button>
			<a href="/metrics/list" class="btn btn-wide max-w-[130px] btn-outline btn-lg btn-primary"
				>Cancel</a
			>
		</div>
	</form>
</section>

{#if form?.success}
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
					onclick={() => goto('/metrics/list')}
					class="btn btn-wide max-w-[150px] btn-lg btn-primary">Continue</button
				>
			</div>
		</div>
	</dialog>
{/if}

{#if uploading}
	<dialog id="my_modal_1" class="modal-open modal">
		<div class="modal-box" transition:fade>
			<p
				class=" mx-auto mb-[7px] flex h-[70px] w-[70px] items-center justify-center rounded-full bg-base-300 text-5xl"
			>
				📋
			</p>
			<h4 class=" text-center text-3xl font-bold text-primary">Health Metrics Report Uploading</h4>
			<p class=" text-center text-2xl text-[#7f7f7f]">Please wait...</p>

			<figure class=" mx-auto flex h-[120px] w-[120px] items-center justify-center text-secondary">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
					><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-width="2"
						d="M12 6.99998C9.1747 6.99987 6.99997 9.24998 7 12C7.00003 14.55 9.02119 17 12 17C14.7712 17 17 14.75 17 12"
						><animateTransform
							attributeName="transform"
							attributeType="XML"
							dur="560ms"
							from="0,12,12"
							repeatCount="indefinite"
							to="360,12,12"
							type="rotate"
						/></path
					></svg
				>
			</figure>
		</div>
	</dialog>
{/if}

{#if noRecordModal}
	<dialog id="my_modal_1" class="modal-open modal">
		<div class="modal-box" transition:fade>
			<p
				class=" mx-auto mb-[7px] flex h-[70px] w-[70px] items-center justify-center rounded-full bg-red-100 text-5xl"
			>
				📋
			</p>
			<h4 class=" text-center text-3xl font-bold text-error">PDF not have vaild Record</h4>
			<p class=" text-center text-2xl text-[#7f7f7f]">Please try another pdf.</p>
			<div class="modal-action justify-center">
				<button
					type="button"
					onclick={() => (noRecordModal = false)}
					class="btn btn-wide max-w-[150px] btn-lg btn-error">Continue</button
				>
			</div>
		</div>
	</dialog>
{/if}
