<script lang="ts">
	let { title, value, icon } = $props();
</script>

<div class="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm">
	<div class="text-3xl">{icon}</div>
	<div>
		<p class="text-sm text-gray-500">{title}</p>
		<p class="text-lg font-semibold text-gray-900">{value}</p>
	</div>
</div>
