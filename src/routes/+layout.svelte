<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import 'nprogress/nprogress.css';
	import '../app.css';
	import NProgress from 'nprogress';
	import { navigating, page } from '$app/state';
	import Toast from '$lib/components/Toast.svelte';
	

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	// Initialize NProgress configuration
	NProgress.configure({
		minimum: 0.16,
		showSpinner: true
	});

	$effect(() => {
		// Start NProgress when navigating starts
		if (navigating?.to) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	});

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<div>
	{#if !page.url.pathname.startsWith('/auth') && page.url.pathname !== '/signout'}
		<Navbar />
	{/if}
</div>

<main>
	{@render children()}
</main>


	
		<Toast />


