<script lang="ts">
	import SummaryCard from '$lib/components/SummaryCard.svelte';
	import HealthScore from '$lib/components/HealthScore.svelte';
	import MetricChart from '$lib/components/MetricChart.svelte';
	import { onMount } from 'svelte';

	let summary = {
		heart_rate: 72,
		blood_pressure: { systolic: 120, diastolic: 80 },
		blood_glucose: 95,
		temperature: 36.8,
		weight: 70
	};

	let healthScore = 82;

	let selectedRange = '7d';
	const ranges = ['7d', '30d', 'custom'];
</script>

<section class="mx-auto max-w-7xl px-4 py-6">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-800">Welcome Back 👋</h1>

		<select bind:value={selectedRange} class="rounded-md border px-3 py-1 text-sm text-gray-700">
			{#each ranges as r}
				<option value={r}
					>{r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Custom'}</option
				>
			{/each}
		</select>
	</div>

	<!-- Summary Cards -->
	<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<MetricChart type="line" metric="heart_rate" range={selectedRange} />
		<MetricChart type="bar" metric="blood_glucose" range={selectedRange} />
		<MetricChart type="area" metric="weight" range={selectedRange} />
		<MetricChart type="pie" metric="custom_distribution" range={selectedRange} />
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
</section>
