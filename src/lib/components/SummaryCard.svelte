<script lang="ts">
	let { title, value, icon } = $props();
</script>


<div class=" bg-base-100 w-full p-4 shadow-md rounded-xs flex items-center gap-4">
    <div class="text-3xl">{icon}</div>
    <div>
		<p class="text-sm text-gray-500">{title}</p>
		<p class="text-lg font-semibold text-gray-900">{value}</p>
	</div>
</div>