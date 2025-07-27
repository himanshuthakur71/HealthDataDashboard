<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { form }: { form: ActionData } = $props();

	let showForm = $state(false);
	let loading = $state(false);

	$effect(() => {
		setTimeout(() => {
			showForm = true;
		}, 1);
	});
</script>

<section class="overflow-x-hidden pl-[5px]">
	{#if showForm}
		<div class="w-full">
			{#if form?.success}
				<div class="w-full" in:fly={{ x: -325, duration: 500 }}>
					<h1 class=" mb-[18px] text-3xl font-bold text-primary">Email Send</h1>
					<p class=" text-xl text-primary">
						We sent you a link to create new password. <br />
						Please check your email and follow instructions.
					</p>

					<a href="/" class=" btn mt-6 btn-wide max-w-[120px] text-lg font-bold btn-secondary">
						Close
					</a>
				</div>
			{:else}
				<div class="w-full max-w-[350px]" in:fly={{ x: -325, duration: 500 }}>
					<h1 class=" mb-[18px] text-3xl font-bold text-primary">Forgot Password.</h1>
					<p class=" text-xl text-primary">
						Don't have an account? <a
							href="/auth/signup"
							class=" font-semibold text-secondary underline hover:text-error">Sign Up</a
						>
					</p>

					<div class="mt-[33px]">
						<form
							method="POST"
							use:enhance={() => {
								if (form?.error) {
									form.error = '';
								}

								loading = true;
								return async ({ update }) => {
									await update();
									loading = false;
								};
							}}
							action="?/sendPasswordMail"
						>
							<div class="grid w-full grid-cols-1 gap-4">
								<label>
									<input
										name="email"
										type="email"
										placeholder="Email"
										class="input w-full"
										required
									/>
								</label>

								{#if form?.error}
									<div role="alert" class="alert alert-error" transition:fade>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-6 w-6 shrink-0 stroke-current"
											fill="none"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<span>Error! {form?.error}.</span>
									</div>
								{/if}
								<button type="submit" class=" btn text-lg font-bold btn-primary">
									{#if loading}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="38"
											height="38"
											viewBox="0 0 24 24"
											><path
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-width="2"
												d="M12 6.99998C9.1747 6.99987 6.99997 9.24998 7 12C7.00003 14.55 9.02119 17 12 17C14.7712 17 17 14.75 17 12"
												><animateTransform
													attributeName="transform"
													attributeType="XML"
													dur="560ms"
													from="0,12,12"
													repeatCount="indefinite"
													to="360,12,12"
													type="rotate"
												/></path
											></svg
										>
									{:else}
										Continue
									{/if}
								</button>
							</div>
						</form>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</section>
