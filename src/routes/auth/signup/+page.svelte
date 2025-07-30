<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import type { ActionData } from './$types';
	import { countries } from '$lib/json/countries.json';

	let { form }: { form: ActionData } = $props();

	let showForm = $state(false);
	let loading = $state(false);
	let show_password = $state(false);
	let type = $derived(show_password ? 'text' : 'password');

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
					<h1 class=" mb-[18px] text-3xl font-bold text-primary">
						<span class="block">{form?.first_name} {form?.last_name},</span>
						account verification is required.
					</h1>
					<p class=" text-xl text-primary">
						We sent you a link to verify your account. <br />
						Please check your email and follow instructions.
					</p>

					<a href="/" class=" btn mt-6 btn-wide max-w-[120px] text-lg font-bold btn-secondary">
						Close
					</a>
				</div>
			{:else}
				<div class="w-full" in:fly={{ x: -325, duration: 500 }}>
					<h1 class=" mb-[18px] text-3xl font-bold text-primary">Create an account</h1>
					<p class=" text-xl text-primary">
						Have an account? <a
							href="/auth/login"
							class=" font-semibold text-secondary underline hover:text-error">Sign in</a
						>
					</p>

					<div class="mt-[33px] w-full max-w-[350px]">
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
							action="?/signup"
						>
							<div class="grid w-full grid-cols-1 gap-4">
								<div class="grid w-full grid-cols-2 gap-4">
									<label>
										<input
											name="first_name"
											type="text"
											placeholder="First name"
											class="input w-full"
											required
										/>
									</label>
									<label>
										<input
											name="last_name"
											type="text"
											placeholder="Last name"
											class="input w-full"
											required
										/>
									</label>
								</div>
								<div class="grid w-full grid-cols-2 gap-4">
									<label>
										<input
											name="email"
											type="email"
											placeholder="Email"
											class="input w-full"
											required
										/>
									</label>
									<label>
										<select class="select w-full" required name="country" value="IN">
											<option value="">Select</option>
											{#each countries as item}
												<option value={item.code}>{item?.name}</option>
											{/each}
										</select>
									</label>
								</div>
								<div class="grid w-full grid-cols-2 gap-4">
									<label>
										<input
											name="password"
											{type}
											placeholder="Password"
											class="input w-full"
											class:input-error={form?.passwordMisMatch}
											required
										/>
									</label>
									<label class=" relative">
										<input
											name="confirm_password"
											{type}
											placeholder="Password"
											class="input w-full"
											class:input-error={form?.passwordMisMatch}
											required
										/>
										<button
											type="button"
											class="absolute top-[10px] right-[10px] z-[1] cursor-pointer"
											onclick={() => (show_password = !show_password)}
										>
											{#if show_password}
												<!-- Hidden Eye (shown when password is visible) -->
												<svg
													class="h-5 w-5 fill-[#d7d7d7] transition-colors hover:fill-[#aaaaaa]"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 18 16"
												>
													<path
														d="M 7.505 3.667 C 7.967 3.482 8.47 3.368 8.998 3.368 C 11.256 3.368 13.088 5.254 13.088 7.578 C 13.088 8.122 12.982 8.64 12.798 9.116 L 15.19 11.579 C 16.425 10.518 17.399 9.145 18 7.578 C 16.581 3.882 13.092 1.263 8.998 1.263 C 7.853 1.263 6.757 1.474 5.738 1.853 L 7.505 3.667 Z M 1.861 0 L 0.818 1.074 L 2.683 2.994 L 3.055 3.377 C 1.706 4.463 0.638 5.907 0 7.578 C 1.415 11.276 4.908 13.895 8.998 13.895 C 10.266 13.895 11.476 13.642 12.585 13.183 L 12.933 13.541 L 15.317 16 L 16.36 14.931 L 1.861 0 Z M 4.908 7.578 C 4.908 6.914 5.072 6.291 5.342 5.726 L 6.606 7.027 C 6.569 7.208 6.544 7.389 6.544 7.578 C 6.544 8.973 7.644 10.105 8.998 10.105 C 9.182 10.105 9.358 10.08 9.53 10.042 L 10.794 11.343 C 10.25 11.621 9.645 11.789 8.998 11.789 C 6.74 11.789 4.908 9.903 4.908 7.578 Z M 8.998 5.053 L 8.863 5.065 L 11.44 7.718 L 11.452 7.578 C 11.452 6.185 10.352 5.053 8.998 5.053 Z"
														fill-rule="nonzero"
													/>
												</svg>
											{:else}
												<!-- Visible Eye (shown when password is hidden) -->
												<svg
													class="h-5 w-5 fill-[#d7d7d7] transition-colors hover:fill-[#aaaaaa]"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 20 14"
												>
													<path
														d="M 20 7 C 18.4 2.9 14.5 0 10 0 C 5.5 0 1.6 2.9 0 7 C 1.6 11.1 5.5 14 10 14 C 14.5 14 18.4 11.1 20 7 Z M 14.5 7 C 14.5 9.6 12.5 11.7 10 11.7 C 7.5 11.7 5.5 9.6 5.5 7 C 5.5 4.4 7.5 2.3 10 2.3 C 12.5 2.3 14.5 4.4 14.5 7 Z M 12.7 7 C 12.7 5.5 11.5 4.2 10 4.2 C 8.5 4.2 7.3 5.5 7.3 7 C 7.3 8.5 8.5 9.8 10 9.8 C 11.5 9.8 12.7 8.5 12.7 7 Z"
														fill-rule="nonzero"
													/>
												</svg>
											{/if}
										</button>
									</label>
								</div>
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

						<div class="relative py-4">
							<div class="absolute inset-0 flex items-center">
								<span class="w-full border-t border-accent"></span>
							</div>
							<div class="relative flex justify-center text-xs uppercase">
								<span class="bg-base-100 px-2 text-[#737373]">Or continue with</span>
							</div>
						</div>

						<form method="POST" action="/auth/login?/google" use:enhance>
							<button type="submit" class=" btn w-full bg-red-400">Google</button>
						</form>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</section>
