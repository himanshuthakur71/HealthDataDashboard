<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { fade, fly } from 'svelte/transition';
	let toasts: any = $state(null);

	$effect(() => {
		toasts = toastStore.toasts;
	});
</script>

<div class="fixed top-[70px] right-2 z-50 w-full max-w-[350px] space-y-2">
	{#each toasts as toast, index (toast.id)}
		<div
			role="alert"
			class="alert transition-all duration-300
				{toast.type === 'success' ? 'alert-success' : ''}
				{toast.type === 'error' ? 'alert-error' : ''}
				{toast.type === 'info' ? 'alert-info' : ''}
				{toast.type === 'warning' ? 'alert-warning' : ''}"
			in:fly={{ x: 350, opacity: 0, duration: 300 * index }}
            out:fade
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mt-1 h-5 w-5 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d={toast.type === 'success'
						? 'M5 13l4 4L19 7'
						: toast.type === 'error'
							? 'M6 18L18 6M6 6l12 12'
							: toast.type === 'info'
								? 'M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z'
								: 'M13 16h-1v-4h-1m1-4h.01'}
				/>
			</svg>
			<span class="flex-1 text-sm">{toast.message}</span>
			<button
				class="ml-auto text-xs text-gray-600 hover:text-black"
				onclick={() => toastStore.remove(toast.id)}
			>
				×
			</button>
		</div>
	{/each}
</div>
