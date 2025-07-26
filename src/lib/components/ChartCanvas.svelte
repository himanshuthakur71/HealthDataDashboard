<!-- src/lib/components/ChartCanvas.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    Chart,
    LineController,
    BarController,
    PieController,
    LineElement,
    BarElement,
    ArcElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    Filler
  } from 'chart.js';

  // Register required components
  Chart.register(
    LineController,
    BarController,
    PieController,
    LineElement,
    BarElement,
    ArcElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    Filler
  );

  export let type: 'line' | 'bar' | 'area' | 'pie' = 'line';
  export let labels: string[] = [];
  export let values: number[] = [];
  export let title: string = 'Metric Chart';

  let canvasEl: HTMLCanvasElement;
  let chart: Chart;

  const pieColors = [
    'rgba(59,130,246,0.7)',
    'rgba(96,165,250,0.7)',
    'rgba(147,197,253,0.7)',
    'rgba(191,219,254,0.7)',
    'rgba(219,234,254,0.7)',
    'rgba(244,63,94,0.7)',
    'rgba(34,197,94,0.7)'
  ];

  onMount(() => {
    const chartType = type === 'area' ? 'line' : type;

    chart = new Chart(canvasEl, {
      type: chartType,
      data: {
        labels,
        datasets: [
          {
            label: title,
            data: values,
            fill: type === 'area',
            tension: 0.4,
            backgroundColor: type === 'pie' ? pieColors : 'rgba(59,130,246,0.2)',
            borderColor: type !== 'pie' ? 'rgba(59,130,246,1)' : undefined,
            borderWidth: 1,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: type === 'pie' ? {} : {
          y: { beginAtZero: true }
        }
      }
    });
  });

  onDestroy(() => {
    chart?.destroy();
  });
</script>

<canvas bind:this={canvasEl} class="w-full h-72 max-h-full" ></canvas>
