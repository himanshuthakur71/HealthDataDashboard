<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// console.log(data);
</script>

<div class="w-full">
	<div class="hms-container">
		<h1 class="mt-6 text-3xl font-semibold text-gray-800">👩‍⚕️ Admin Dashboard</h1>

		<div class="lg: flex w-full flex-wrap gap-6 py-4">
			<a
				href="/metrics/list"
				class=" flex max-w-[260px] items-center gap-4 p-4 shadow-md hover:bg-base-300"
			>
				<div class=" text-5xl">📊</div>
				<div class=" flex flex-col items-start gap-1 text-lg">
					<span class=" font-bold text-secondary">{data.metrics?.length}</span>
					<span>Total Metrics</span>
				</div>
			</a>

			<!-- <a
				href="/reports"
				class=" flex max-w-[260px] items-center gap-4 p-4 shadow-md hover:bg-base-300"
			>
				<div class=" text-5xl">📋</div>
				<div class=" flex flex-col items-start gap-1 text-lg">
					<span class=" font-bold text-secondary">{data.reports.length}</span>
					<span>Total Reports</span>
				</div>
			</a> -->
		</div>

		<div class="w-full">
			<h2 class="mt-8 mb-4 text-xl font-bold">User Directory</h2>
			<table class="min-w-full table-auto rounded border">
				<thead class="bg-gray-100">
					<tr>
						<th class="px-4 py-2 text-left">Name</th>
						<th class="px-4 py-2 text-left">Email</th>
						<th class="px-4 py-2 text-left">Role</th>
					</tr>
				</thead>
				<tbody>
					{#each data.users as user}
						<tr class="border-t">
							<td class="px-4 py-2">{user.first_name} {user.last_name}</td>
							<td class="px-4 py-2">{user.email}</td>
							<td class="px-4 py-2">{user.role}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
