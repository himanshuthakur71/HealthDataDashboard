<script lang="ts">
	let { score } = $props();

	// Determine bar color based on score
	const getColor = (score: number): string =>
		score < 40 ? 'bg-red-500' : score < 70 ? 'bg-yellow-500' : 'bg-green-500';

	let color = getColor(score);
</script>

<div class="col-span-1 rounded-2xl border bg-white p-4 shadow-sm sm:col-span-2 lg:col-span-3">
	<p class="mb-2 text-sm text-gray-600">Overall Health Score</p>
	<div class="flex items-center gap-4">
		<div class="text-3xl font-bold">{score}/100</div>
		<div class="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
			<div class={`h-full ${color}`} style={`width: ${score}%`}></div>
		</div>
	</div>
</div>
