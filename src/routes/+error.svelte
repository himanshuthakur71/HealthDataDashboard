<script lang="ts">
	import { page } from '$app/state';
</script>

<section class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
	<h1 class="text-[16rem] leading-52 font-bold text-error">{page.status}</h1>
	<h2 class="mt-4 text-3xl font-semibold">
		{#if page.status == 404}
			Page Not Found
		{:else if page.state == 422}
			Access Denied
		{:else if page.state == 500}
			Internal Server Error
		{/if}
	</h2>
	<p class="mt-2 text-lg text-gray-500">
		{#if page.status == 404}
			The page you are looking for does not exist.
		{:else if page.state == 422}
			You do not have authorization to access this page.
		{:else if page.state == 500}
			Something went wrong on our end.
		{/if}
	</p>

	<div class="mt-8">
		<a href="/" class="btn btn-primary">Back to Home</a>
	</div>
</section>
