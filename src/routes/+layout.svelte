<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import 'nprogress/nprogress.css';
	import '../app.css';
	import NProgress from 'nprogress';
	import { navigating } from '$app/state';

	let { children } = $props();

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
</script>

<Navbar />

<main>
	{@render children()}
</main>
