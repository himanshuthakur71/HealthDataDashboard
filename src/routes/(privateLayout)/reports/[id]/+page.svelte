<script lang="ts">
	import { marked } from 'marked';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function printReport() {
		window.print();
	}
</script>

<section class="hms-container py-6">
	<div class="mb-8">
		<h2 class="mb-2 text-3xl font-semibold text-gray-800">🩺 Doctor's AI Report</h2>
		<p class="text-gray-600">Generated on {new Date(data?.report.created_at).toLocaleString()}</p>
		<p><strong>Health Score:</strong> {data?.report.health_score}</p>
	</div>

	<div class="w-full mb-6 flex justify-end md:mt-[-60px] print:hidden">
		<button
			onclick={printReport}
			class=" btn btn-secondary btn-sm "
		>
			Print as PDF
		</button>
	</div>

	<div class="w-full border-t border-[#d7d7d7] pt-4">
		{@html marked(data?.report.feedback)}
	</div>

	<div class="mt-16 w-full print:hidden">
		<a href="/reports" class=" btn btn-outline btn-lg btn-primary">Back</a>
	</div>
</section>
