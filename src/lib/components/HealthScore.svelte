<script lang="ts">
  export let score: number;
  $: color = score > 80 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500';
</script>

<div class="col-span-1 sm:col-span-2 lg:col-span-3 bg-white border shadow-sm rounded-2xl p-4">
  <p class="text-sm text-gray-600 mb-2">Overall Health Score</p>
  <div class="flex items-center gap-4">
    <div class="text-3xl font-bold">{score}/100</div>
    <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
      <div class={`h-full ${color}`} style={`width: ${score}%`} ></div>
    </div>
  </div>
</div>
