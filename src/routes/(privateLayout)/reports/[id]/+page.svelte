<script lang="ts">
	import { marked } from 'marked';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<section class="hms-container py-6">
	<div class="mb-8">
		<h2 class="mb-2 text-3xl font-semibold text-gray-800">🩺 Doctor's AI Report</h2>
		<p class="text-gray-600">Generated on {new Date(data?.report.created_at).toLocaleString()}</p>
		<p><strong>Health Score:</strong> {data?.report.health_score}</p>
	</div>

	<div class="w-full">
		{@html marked(data?.report.feedback)}
	</div>

	<div class="mt-16 w-full">
		<a href="/reports" class=" btn btn-outline btn-lg btn-primary">Back</a>
	</div>
</section>
