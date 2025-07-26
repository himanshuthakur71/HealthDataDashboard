<script lang="ts">
	import SummaryCard from '$lib/components/SummaryCard.svelte';
	import HealthScore from '$lib/components/HealthScore.svelte';
	import ChartCanvas from '$lib/components/ChartCanvas.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data } = $props();
	const metric = data.latestMetric;

	const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']; // Static for demo
	const values = [metric?.heart_rate, 74, 71, 70, 69]; // Simulated weekly values

	let summary = {
		heart_rate: metric?.heart_rate ?? 0,
		blood_pressure: {
			systolic: metric?.systolic ?? 0,
			diastolic: metric?.diastolic ?? 0
		},
		blood_glucose: metric?.blood_glucose ?? 0,
		temperature: metric?.temperature ?? 0,
		weight: metric?.weight ?? 0
	};

	// Basic score example — customize as needed
	let healthScore = Math.min(
		100,
		Math.round(
			100 -
				Math.abs(120 - summary.blood_pressure.systolic) -
				Math.abs(80 - summary.blood_pressure.diastolic) -
				Math.abs(72 - summary.heart_rate)
		)
	);

	let selectedRange = $state(page.url.searchParams.get('range') || '7');
	const ranges = ['7', '30', '60', '90', '120'];
</script>

<section class="w-full">
	<div class="hms-container">
		<div class="my-6 flex items-center justify-between">
			<h1 class="text-3xl font-semibold text-gray-800">
				Welcome Back,
				<span class="font-bold text-secondary">{data?.user?.user_metadata?.last_name}</span> 👋
			</h1>

			<select
				bind:value={selectedRange}
				class="rounded-md border px-3 py-1 text-sm text-gray-700"
				onchange={() => goto(`/dashboard?range=${selectedRange}`)}
			>
				{#each ranges as r}
					<option value={r}>Last {r} Days</option>
				{/each}
			</select>
		</div>

		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<SummaryCard title="Heart Rate" value="{summary.heart_rate} bpm" icon="💓" />
			<SummaryCard
				title="Blood Pressure"
				value="{summary.blood_pressure.systolic}/{summary.blood_pressure.diastolic} mmHg"
				icon="🩸"
			/>
			<SummaryCard title="Blood Glucose" value="{summary.blood_glucose} mg/dL" icon="🧪" />
			<SummaryCard title="Temperature" value="{summary.temperature} °C" icon="🌡️" />
			<SummaryCard title="Weight" value="{summary.weight} kg" icon="⚖️" />

			<HealthScore score={healthScore} />
		</div>

		<!-- Charts -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="rounded-xl bg-white p-4 shadow-md">
				<ChartCanvas title="Heart Rate (Line)" type="line" {labels} {values} />
			</div>
			<div class="rounded-xl bg-white p-4 shadow-md">
				<ChartCanvas title="Heart Rate (Area)" type="area" {labels} {values} />
			</div>
			<div class="rounded-xl bg-white p-4 shadow-md">
				<ChartCanvas title="Heart Rate (Bar)" type="bar" {labels} {values} />
			</div>
			<div class="rounded-xl bg-white p-4 shadow-md">
				<ChartCanvas
					title="Metric Distribution (Pie)"
					type="pie"
					labels={['Heart Rate', 'Glucose', 'BP']}
					values={[
						summary.heart_rate ?? 0,
						summary.blood_glucose ?? 0,
						(summary.blood_pressure.systolic + summary.blood_pressure.diastolic) / 2
					]}
				/>
			</div>
		</div>

		<!-- Print Friendly -->
		<div class="mt-10 text-right">
			<a
				href="/dashboard/reports"
				class="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
			>
				🧾 View/Print Doctor Report
			</a>
		</div>
	</div>
</section>
