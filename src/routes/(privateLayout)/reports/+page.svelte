<script lang="ts">
	import { page } from '$app/state';
	import { marked } from 'marked';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();

	// console.log(data.reports)

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString();
	}
</script>

<section class="hms-container py-6">
	<div class="mb-8 flex items-center justify-between">
		<h2 class="text-3xl font-semibold text-gray-800">📋 Your Health Reports</h2>
	</div>

	<div class="w-full">
		{#if data?.reports?.length}
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th class="w-[45px]"></th>
							<th class="w-[152px]">Date</th>
							<th class="w-[152px]">Health Score</th>
							<th class="">Metric Id</th>
							<th class="w-[152px]">feedback</th>
						</tr>
					</thead>
					<tbody>
						{#each data?.reports as report, index (report.id)}
							<tr
								class=" cursor-pointer hover:bg-base-300"
								onclick={() => goto(`/reports/${report.id}`)}
							>
								<td>{index + 1}</td>
								<td>{formatDate(report?.created_at)}</td>
								<td>{report?.health_score}</td>
								<td>{report?.metric_id}</td>
								<td>
									{#if report.feedback}
										<span class=" badge badge-success">Yes</span>
									{:else}
										<span class=" badge badge-error">No</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="w-full">
				<p class="mt-4 text-lg text-gray-500">
					No reports found. Start by adding your first record. <span class=" text-secondary">|</span
					> <a href="/metrics/new" class=" font-semibold text-secondary hover:underline">New</a>
				</p>
			</div>
		{/if}
	</div>

	<div class="mt-16 w-full">
		<a href="/dashboard" class=" btn btn-outline btn-lg btn-primary">Back</a>
	</div>
</section>
