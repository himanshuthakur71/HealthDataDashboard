<script lang="ts">
  import { onMount } from 'svelte';
  export let type: 'line' | 'bar' | 'pie' | 'area';
  export let metric: string;
  export let range: string;

  let data = [];

  onMount(() => {
    // Fetch metric data based on `metric` and `range`
    // For now, mock
    data = [
      { date: '2025-07-20', value: 72 },
      { date: '2025-07-21', value: 75 },
      { date: '2025-07-22', value: 78 },
      { date: '2025-07-23', value: 76 },
      { date: '2025-07-24', value: 74 },
      { date: '2025-07-25', value: 73 }
    ];
  });
</script>

<div class="bg-white border rounded-2xl p-4 shadow-sm">
  <p class="text-sm font-medium mb-2 capitalize text-gray-700">
    {metric.replace('_', ' ')} ({range})
  </p>

  <!-- Placeholder: You can use recharts, chart.js, ApexCharts, etc. -->
  <div class="h-40 flex items-center justify-center text-gray-400">
    <p>Chart type: {type} (implement using a chart lib)</p>
  </div>
</div>
