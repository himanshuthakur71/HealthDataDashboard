<script lang="ts">
	import { page } from '$app/state';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// console.log(data)

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString();
	}

	function formatCustomMetrics(json: any[] = []) {
		return json.map((m) => `${m.key}: ${m.value} ${m.unit}`).join(', ');
	}
</script>

<section class="hms-container py-6">
	<div class="mb-8 flex items-center justify-between">
		<h2 class="text-3xl font-semibold text-gray-800">📊 Your Health Metrics</h2>
		<a href="/metrics/new" class="btn btn-lg btn-primary">➕ Add Metric</a>
	</div>

	<div class="w-full">
		<form method="GET">
			<div class="flex w-full gap-[20px]">
				<label class="w-full max-w-[132px]">
					<span class=" label-text">Date</span>
					<select class="select w-full"  name="range">
						<option value="">Select</option>
						{#each [7, 30, 60, 90, 120] as r}
							<option value={r}>Last {r} Days</option>
						{/each}
					</select>
				</label>

				{#each ['bp', 'hr', 'glucose', 'weight', 'temp', 'source'] as filter}
					<label class="w-full max-w-[132px]">
						<span class="label-text">{filter.toUpperCase()}</span>
						<input
							type="text"
							name={filter}
							placeholder="Search"
							class="input w-full"
							value={page.url.searchParams.get(filter) ?? ''}
						/>
					</label>
				{/each}

				<div class="flex w-full max-w-[132px] items-end justify-end">
					<button type="submit" class=" btn btn-primary">Search</button>
				</div>
			</div>
		</form>
	</div>

	{#if data?.metrics?.length}
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th class="w-[152px]"></th>
						<th class="w-[152px]"></th>
						<th class="w-[152px]"></th>
						<th class="w-[152px]"></th>
						<th class="w-[152px]"></th>
						<th class="w-[152px]"></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each data?.metrics as m}
						<tr class="hover:bg-base-300">
							<td class="border-r border-[#f1eeef]">{formatDate(m.created_at)}</td>
							<td class="border-r border-[#f1eeef]">{m.systolic}/{m.diastolic}</td>
							<td class="border-r border-[#f1eeef]">{m.heart_rate} bpm</td>
							<td class="border-r border-[#f1eeef]">{m.blood_glucose} mg/dL</td>
							<td class="border-r border-[#f1eeef]">{m.weight} kg</td>
							<td class="border-r border-[#f1eeef]">{m.temperature} °C</td>
							<td class="border-r border-[#f1eeef]">
								<span class="badge badge-outline badge-sm capitalize">{m.source}</span>
							</td>
							<td>{formatCustomMetrics(m.custom_metrics)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="mt-4 text-sm text-gray-500">No metrics found. Start by adding your first record.</p>
	{/if}
</section>
