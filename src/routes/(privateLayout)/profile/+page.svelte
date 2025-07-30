<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';
	import { countries } from '$lib/json/countries.json';
	import { fade } from 'svelte/transition';
	import type { ActionData } from './$types';
	import { uploadAvatarWithProgress } from '$lib/helpers/uploadAvatar';
	import { deleteAvatar } from '$lib/helpers/deleteAvatar';

	let { data, form }: { data: any; form: ActionData } = $props();

	const { user, supabase } = $derived(data);

	let file: File | null = $state(null);
	let previewUrl: string | null = $state(null);
	let progress = $state(0);

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const selected = input.files?.[0];

		if (!selected) return;

		const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
		if (!validTypes.includes(selected.type)) {
			alert('Only PNG, JPG, JPEG, and SVG images are allowed.');
			file = null;
			previewUrl = null;
			return;
		}

		file = selected;
		previewUrl = URL.createObjectURL(file);
		if (file) {
			handleUpload();
		}
	}

	async function handleUpload() {
		if (!file) return;

		const { data: userData } = await supabase.auth.getUser();
		const user = userData?.user;

		if (!user) {
			alert('Not logged in');
			return;
		}

		try {
			progress = 0;

			const avatarUrl = await uploadAvatarWithProgress({
				supabase,
				file,
				userId: user.id,
				onProgress: (p) => (progress = p)
			});

			await supabase.auth.updateUser({
				data: { avatar_url: avatarUrl }
			});

			await supabase.rpc('sync_user_profile', { user_id: user.id });
			invalidate('supabase:auth');
			alert('Upload complete!');
		} catch (e) {
			console.error(e);
			alert('Upload failed');
		} finally {
			progress = 0;
		}
	}

	async function handleDelete() {
		const { data: userData } = await supabase.auth.getUser();
		const user = userData?.user;

		if (!user) return;

		const avatarUrl = user.user_metadata?.avatar_url;
		const userId = user.id;

		if (!avatarUrl) {
			alert('No avatar to delete.');
			return;
		}

		try {
			await deleteAvatar(avatarUrl, userId, supabase);
			invalidate('supabase:auth');
			alert('Avatar deleted');
		} catch (e) {
			console.error(e);
			alert('Failed to delete avatar');
		}
	}
</script>

<section>
	<div class="hms-container">
		<div class="mt-[74px] w-full">
			<div class="mb-[47px]">
				<figure class="flex h-[40px] w-[36px] items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						id="Layer_1"
						data-name="Layer 1"
						width="262.5019"
						height="300"
						viewBox="0 0 262.5019 300"
					>
						<defs>
							<style>
								.cls-1 {
									fill: #21235f;
								}
							</style>
						</defs>
						<path
							class="cls-1"
							d="M256.9172,57.3047c-4.4709-2.0745-9.7811-.8148-12.8438,3.0469-.2519,.334-26.2559,36.0879-112.8223,36.0879-86.0625-.0117-112.2656-35.3789-112.8164-36.0879-3.0011-3.8982-8.2987-5.2038-12.7676-3.1465-4.5469,2.0684-6.7441,6.9375-5.1504,11.3906,.2051,.5859,14.4492,38.6719,55.7461,62.5195v.1348c.0101,41.4214,33.597,74.9918,75.0183,74.9817,41.4071-.0101,74.9716-33.5746,74.9817-74.9817v-.1289c41.2793-23.8945,55.5176-61.9805,55.7285-62.5254,1.5762-4.418-.6035-9.1934-5.0742-11.291Zm-73.1719,167.6953h-9.7793c-27.1069,12.4998-58.3286,12.4998-85.4355,0h-9.7793c-32.438,.0115-61.5201,19.9958-73.1602,50.2734-4.6172,11.9473,4.998,24.7266,17.8125,24.7266H239.0929c12.8145,0,22.4297-12.7793,17.8125-24.7266-11.6401-30.2776-40.7221-50.2619-73.1601-50.2734Zm16.9336-158.4551C194.2043,37.5293,182.1457,0,162.9504,0c-6.0527,0-11.4551,2.6074-15.9961,6.1348-8.9748,6.979-21.5408,6.979-30.5156,0-4.5234-3.5273-9.9434-6.1348-15.9961-6.1348-19.2598,0-31.3359,37.7871-37.7988,66.8438,15.2871,5.8125,37.4063,10.834,68.6074,10.834,31.7402,0,54.1172-5.1797,69.4277-11.1328Z"
						/>
					</svg>
				</figure>
				<h1 class=" mt-[3px] border-b-[3px] border-secondary pb-[8px] text-2xl font-bold">
					<span>Profile</span>
					<span class=" text-secondary">|</span>
					<span class=" text-[#7f7f7f]"
						>{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</span
					>
				</h1>
				<p class=" text-lg text-[#7f7f7f]">Manage your profile details here.</p>
			</div>

			{#if form?.error}
				<p class="text-error">{form.error}</p>
			{/if}

			<form method="post" enctype="multipart/form-data" use:enhance action="?/update">
				<div class="mb-[41px]">
					<svg
						xmlns:xlink="http://www.w3.org/1999/xlink"
						xmlns="http://www.w3.org/2000/svg"
						version="1.1"
						width="24px"
						height="24px"
					>
						<g transform="matrix(1 0 0 1 -370 -353 )">
							<path
								d="M 24 21.42857142857144  C 24 22.848214285714295  22.848214285714295 24  21.428571428571427 24  L 2.5714285714285734 24  C 1.1517857142857202 24  0 22.848214285714295  0 21.42857142857144  L 0 2.5714285714285596  C 0 1.1517857142857064  1.1517857142857202 0  2.5714285714285734 0  L 21.428571428571427 0  C 22.848214285714295 0  24 1.1517857142857064  24 2.5714285714285596  L 24 21.42857142857144  Z M 13.216071428571428 7.82142857142856  C 13.082142857142852 7.692857142857147  12.878571428571426 7.692857142857147  12.755357142857147 7.8160714285714405  L 5.4857142857142795 15.085714285714293  L 5.14821428571428 18.144642857142852  C 5.105357142857146 18.551785714285707  5.44821428571428 18.9  5.8607142857142795 18.857142857142854  L 8.919642857142852 18.519642857142852  L 16.189285714285706 11.25  C 16.3125 11.126785714285706  16.3125 10.923214285714293  16.189285714285706 10.794642857142852  L 13.216071428571428 7.82142857142856  Z M 18.482142857142854 8.946428571428559  C 18.980357142857148 8.448214285714293  18.980357142857148 7.63392857142856  18.482142857142854 7.130357142857147  L 16.869642857142853 5.517857142857147  C 16.366071428571427 5.014285714285706  15.551785714285707 5.014285714285706  15.053571428571427 5.517857142857147  L 13.816071428571426 6.755357142857147  C 13.692857142857147 6.8785714285714405  13.692857142857147 7.082142857142854  13.816071428571426 7.210714285714293  L 16.789285714285707 10.18392857142856  C 16.9125 10.307142857142853  17.116071428571427 10.307142857142853  17.244642857142853 10.18392857142856  L 18.482142857142854 8.946428571428559  Z "
								fill-rule="nonzero"
								fill="#21235f"
								stroke="none"
								transform="matrix(1 0 0 1 370 353 )"
							/>
						</g>
					</svg>
					<p class=" text-xl font-bold text-primary">EDIT DETAILS</p>
					<span class="mt-[6px] block h-[3px] w-[48px] bg-primary"></span>
				</div>
				<div
					class="flex w-full max-w-[820px] flex-col-reverse gap-x-[45px] gap-y-8 lg:grid lg:grid-cols-[1fr_auto] lg:items-start"
				>
					<div class="w-full">
						<div class="grid grid-cols-1 gap-4">
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<label class="floating-label">
									<span>First name</span>
									<input
										name="first_name"
										type="text"
										placeholder="First name"
										class="input w-full"
										required
										value={user?.user_metadata?.first_name}
									/>
								</label>
								<label class="floating-label">
									<span>Last name</span>
									<input
										name="last_name"
										type="text"
										placeholder="last name"
										class="input w-full"
										required
										value={user?.user_metadata?.last_name}
									/>
								</label>
							</div>
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<label class="floating-label">
									<span>Email</span>
									<input
										disabled
										name="email"
										type="email"
										placeholder="Email"
										class="input w-full"
										required
										value={user?.user_metadata?.email}
									/>
								</label>

								<label class="floating-label">
									<span>Country</span>
									<select
										class="select w-full"
										name="country"
										required
										value={user?.user_metadata?.country}
									>
										<option value="">Select</option>
										{#each countries as item}
											<option value={item.code}>{item?.name}</option>
										{/each}
									</select>
								</label>
							</div>

							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<label class="floating-label">
									<span>Gender</span>
									<select
										class="select w-full"
										name="gender"
										required
										value={user?.user_metadata?.gender}
									>
										<option value="">Select</option>
										<option value="male">Male</option>
										<option value="female">Female</option>
										<option value="other">Other</option>
									</select>
								</label>

								<label class="floating-label">
									<span>Date of Birth</span>
									<input
										name="dob"
										type="date"
										placeholder="Date of birth"
										class="input w-full"
										required
										value={user?.user_metadata?.dob}
									/>
								</label>
							</div>

							<label class="floating-label">
								<span>Phone Number</span>
								<input
									name="phone_number"
									type="text"
									placeholder="Phone Number"
									class="input w-full"
									required
									value={user?.user_metadata?.phone_number}
								/>
							</label>
						</div>
					</div>
					<div class="flex items-center gap-4">
						{#if user?.user_metadata?.avatar_url || previewUrl}
							<div
								class="relative flex h-[140px] w-[140px] items-center justify-center overflow-hidden rounded-full bg-base-300 shadow hover:bg-base-200"
							>
								<img
									src={user?.user_metadata?.avatar_url || previewUrl}
									alt="Preview"
									class="h-[140px] w-[140px] rounded-full object-cover"
								/>

								{#if user?.user_metadata?.avatar_url}
									<button
									onclick="{handleDelete}"
										aria-label="delete"
										type="button"
										class=" btn absolute z-[1] btn-circle btn-lg btn-error"
									>
										<svg
											xmlns:xlink="http://www.w3.org/1999/xlink"
											xmlns="http://www.w3.org/2000/svg"
											version="1.1"
											width="25px"
											height="26px"
										>
											<g transform="matrix(1 0 0 1 -58 -57 )">
												<path
													d="M 8.931107954545455 21.514322916666668  C 9.037642045454545 21.412760416666668  9.090909090909092 21.28298611111111  9 21.125  L 9 9.208333333333332  C 9.090909090909092 9.050347222222223  9.037642045454545 8.920572916666668  8.931107954545455 8.819010416666668  C 8.824573863636363 8.717447916666668  8.68844696969697 8.666666666666668  8.522727272727272 8.666666666666668  L 7.386363636363637 8.666666666666668  C 7.22064393939394 8.666666666666668  7.084517045454547 8.717447916666668  6.977982954545454 8.819010416666668  C 6.871448863636363 8.920572916666668  6.8181818181818175 9.050347222222223  7 9.208333333333332  L 7 21.125  C 6.8181818181818175 21.28298611111111  6.871448863636363 21.412760416666668  6.977982954545454 21.514322916666668  C 7.084517045454547 21.615885416666668  7.22064393939394 21.666666666666668  7.386363636363637 21.666666666666668  L 8.522727272727272 21.666666666666668  C 8.68844696969697 21.666666666666668  8.824573863636363 21.615885416666668  8.931107954545455 21.514322916666668  Z M 13.4765625 21.514322916666668  C 13.583096590909092 21.412760416666668  13.636363636363635 21.28298611111111  13.636363636363635 21.125  L 13.636363636363635 9.208333333333332  C 13.636363636363635 9.050347222222223  13.583096590909092 8.920572916666668  13.4765625 8.819010416666668  C 13.370028409090908 8.717447916666668  13.233901515151517 8.666666666666668  13.068181818181818 8.666666666666668  L 11.931818181818182 8.666666666666668  C 11.766098484848486 8.666666666666668  11.629971590909092 8.717447916666668  11.5234375 8.819010416666668  C 11.416903409090908 8.920572916666668  11.363636363636363 9.050347222222223  11.363636363636363 9.208333333333332  L 11.363636363636363 21.125  C 11.363636363636363 21.28298611111111  11.416903409090908 21.412760416666668  11.5234375 21.514322916666668  C 11.629971590909092 21.615885416666668  11.766098484848486 21.666666666666668  11.931818181818182 21.666666666666668  L 13.068181818181818 21.666666666666668  C 13.233901515151517 21.666666666666668  13.370028409090908 21.615885416666668  13.4765625 21.514322916666668  Z M 18.022017045454543 21.514322916666668  C 18.128551136363637 21.412760416666668  18.181818181818183 21.28298611111111  18 21.125  L 18 9.208333333333332  C 18.181818181818183 9.050347222222223  18.128551136363637 8.920572916666668  18.022017045454543 8.819010416666668  C 17.915482954545457 8.717447916666668  17.779356060606062 8.666666666666668  17.613636363636363 8.666666666666668  L 16.477272727272727 8.666666666666668  C 16.31155303030303 8.666666666666668  16.175426136363637 8.717447916666668  16.068892045454543 8.819010416666668  C 15.962357954545455 8.920572916666668  15.909090909090908 9.050347222222223  16 9.208333333333332  L 16 21.125  C 15.909090909090908 21.28298611111111  15.962357954545455 21.412760416666668  16.068892045454543 21.514322916666668  C 16.175426136363637 21.615885416666668  16.31155303030303 21.666666666666668  16.477272727272727 21.666666666666668  L 17.613636363636363 21.666666666666668  C 17.779356060606062 21.666666666666668  17.915482954545457 21.615885416666668  18.022017045454543 21.514322916666668  Z M 9.392755681818182 2.352864583333332  L 8.522727272727272 4.333333333333332  L 16.477272727272727 4.333333333333332  L 15.625 2.352864583333332  C 15.542140151515154 2.251302083333332  15.441524621212121 2.18923611111111  15.323153409090908 2.166666666666668  L 9.694602272727272 2.166666666666668  C 9.57623106060606 2.18923611111111  9.475615530303031 2.251302083333332  9.392755681818182 2.352864583333332  Z M 24.840198863636363 4.485677083333332  C 24.946732954545457 4.587239583333332  25 4.7170138888888875  25 4.875  L 25 5.958333333333332  C 25 6.116319444444442  24.946732954545457 6.24609375  24.840198863636363 6.34765625  C 24.733664772727273 6.44921875  24.597537878787882 6.5  24.431818181818183 6.5  L 22.727272727272727 6.5  L 22.727272727272727 22.546875  C 22.727272727272727 23.483506944444443  22.449100378787882 24.29318576388889  21.892755681818183 24.975911458333332  C 21.336410984848484 25.65863715277778  20.667613636363637 26  19.886363636363637 26  L 5.113636363636364 26  C 4.332386363636364 26  3.663589015151516 25.669921875  3.107244318181818 25.009765625  C 2.5508996212121215 24.349609375  2.272727272727273 23.55121527777778  2.272727272727273 22.614583333333332  L 2.272727272727273 6.5  L 0.5681818181818182 6.5  C 0.4024621212121212 6.5  0.2663352272727273 6.44921875  0.15980113636363638 6.34765625  C 0.05326704545454545 6.24609375  0 6.116319444444442  0 5.958333333333332  L 0 4.875  C 0 4.7170138888888875  0.05326704545454545 4.587239583333332  0.15980113636363638 4.485677083333332  C 0.2663352272727273 4.384114583333332  0.4024621212121212 4.333333333333332  0.5681818181818182 4.333333333333332  L 6.0546875 4.333333333333332  L 7.2975852272727275 1.5065104166666676  C 7.475142045454547 1.0889756944444422  7.794744318181819 0.7335069444444422  8.256392045454545 0.44010416666666763  C 8.718039772727273 0.14670138888888729  9.18560606060606 0  9.659090909090908 0  L 15.340909090909092 0  C 15.814393939393941 0  16.281960227272727 0.14670138888888729  16.743607954545457 0.44010416666666763  C 17.205255681818183 0.7335069444444422  17.524857954545457 1.0889756944444422  17.702414772727273 1.5065104166666676  L 18.9453125 4.333333333333332  L 24.431818181818183 4.333333333333332  C 24.597537878787882 4.333333333333332  24.733664772727273 4.384114583333332  24.840198863636363 4.485677083333332  Z "
													fill-rule="nonzero"
													fill="#fff"
													stroke="none"
													transform="matrix(1 0 0 1 58 57 )"
												/>
											</g>
										</svg>
									</button>
								{/if}

								{#if progress > 0}
									<div
										class="absolute z-[2] flex h-full w-full items-center justify-center rounded-full border-[10px] border-success bg-primary/40"
									>
										<p class=" text-center text-xs font-bold text-white">Uploading: {progress}%</p>
									</div>
								{/if}
							</div>
						{:else}
							<label
								class="flex h-[140px] w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-base-300 shadow hover:bg-base-200"
							>
								<input
									type="file"
									class="hidden h-0 w-0 opacity-0"
									accept="image/png, image/jpeg, image/jpg, image/svg+xml"
									onchange={handleFileChange}
								/>
								<svg
									xmlns:xlink="http://www.w3.org/1999/xlink"
									xmlns="http://www.w3.org/2000/svg"
									version="1.1"
									width="46px"
									height="40px"
								>
									<g transform="matrix(1 0 0 1 -47 -50 )">
										<path
											d="M 41.6875 5.6818181818181825  C 44.068359375 5.6818181818181825  46 7.590553977272727  46 9.943181818181818  L 46 35.51136363636364  C 46 37.86399147727273  44.068359375 39.77272727272727  41.6875 39  L 4.3125 39  C 1.931640625 39.77272727272727  0 37.86399147727273  0 35.51136363636364  L 0 9.943181818181818  C 0 7.590553977272727  1.931640625 5.6818181818181825  4.3125 5.6818181818181825  L 12.21875 5.6818181818181825  L 13.323828125 2.761008522727273  C 13.952734375 1.1008522727272727  15.5609375 0  17.357812499999998 0  L 28.633203124999998 0  C 30.430078124999998 0  32.038281250000004 1.1008522727272727  32.667187500000004 2.761008522727273  L 33.78125 5.6818181818181825  L 41.6875 5.6818181818181825  Z M 23 33.38068181818181  C 28.947656249999998 33.38068181818181  33.78125 28.604403409090907  33.78125 22.72727272727273  C 33.78125 16.850142045454547  28.947656249999998 12.073863636363635  23 12.073863636363635  C 17.052343750000002 12.073863636363635  12.21875 16.850142045454547  12.21875 22.72727272727273  C 12.21875 28.604403409090907  17.052343750000002 33.38068181818181  23 33.38068181818181  Z M 23 14.914772727272727  C 27.357421875 14.914772727272727  30.90625 18.421519886363637  30.90625 22.72727272727273  C 30.90625 27.033025568181817  27.357421875 30.53977272727273  23 30.53977272727273  C 18.642578125 30.53977272727273  15.09375 27.033025568181817  15.09375 22.72727272727273  C 15.09375 18.421519886363637  18.642578125 14.914772727272727  23 14.914772727272727  Z "
											fill-rule="nonzero"
											fill="#1e98d7"
											stroke="none"
											transform="matrix(1 0 0 1 47 50 )"
										/>
									</g>
								</svg>
							</label>
						{/if}

						<p class=" text-lg font-bold text-primary">
							Profile <br />
							photo
						</p>
					</div>
				</div>

				<div class="mt-16 flex w-full gap-4">
					<button type="submit" class=" btn btn-wide max-w-[110px] btn-lg btn-primary">Save</button>
					<a href="/dashboard" class=" btn btn-wide max-w-[110px] btn-soft btn-lg btn-primary"
						>Cancel</a
					>
				</div>
			</form>
		</div>
	</div>
</section>

{#if form?.success}
	<dialog id="my_modal_1" class="modal-open modal">
		<div class="modal-box" transition:fade>
			<figure class="mx-auto mb-[7px] flex h-[50px] w-[45px] items-center justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					id="Layer_1"
					data-name="Layer 1"
					width="262.5019"
					height="300"
					viewBox="0 0 262.5019 300"
				>
					<defs>
						<style>
							.cls-1 {
								fill: #21235f;
							}
						</style>
					</defs>
					<path
						class="cls-1"
						d="M256.9172,57.3047c-4.4709-2.0745-9.7811-.8148-12.8438,3.0469-.2519,.334-26.2559,36.0879-112.8223,36.0879-86.0625-.0117-112.2656-35.3789-112.8164-36.0879-3.0011-3.8982-8.2987-5.2038-12.7676-3.1465-4.5469,2.0684-6.7441,6.9375-5.1504,11.3906,.2051,.5859,14.4492,38.6719,55.7461,62.5195v.1348c.0101,41.4214,33.597,74.9918,75.0183,74.9817,41.4071-.0101,74.9716-33.5746,74.9817-74.9817v-.1289c41.2793-23.8945,55.5176-61.9805,55.7285-62.5254,1.5762-4.418-.6035-9.1934-5.0742-11.291Zm-73.1719,167.6953h-9.7793c-27.1069,12.4998-58.3286,12.4998-85.4355,0h-9.7793c-32.438,.0115-61.5201,19.9958-73.1602,50.2734-4.6172,11.9473,4.998,24.7266,17.8125,24.7266H239.0929c12.8145,0,22.4297-12.7793,17.8125-24.7266-11.6401-30.2776-40.7221-50.2619-73.1601-50.2734Zm16.9336-158.4551C194.2043,37.5293,182.1457,0,162.9504,0c-6.0527,0-11.4551,2.6074-15.9961,6.1348-8.9748,6.979-21.5408,6.979-30.5156,0-4.5234-3.5273-9.9434-6.1348-15.9961-6.1348-19.2598,0-31.3359,37.7871-37.7988,66.8438,15.2871,5.8125,37.4063,10.834,68.6074,10.834,31.7402,0,54.1172-5.1797,69.4277-11.1328Z"
					/>
				</svg>
			</figure>
			<h4 class=" text-center text-3xl font-bold text-primary">User Profile Details</h4>
			<p class=" text-center text-2xl text-[#7f7f7f]">successfully saved.</p>
			<div class="modal-action justify-center">
				<button
					type="button"
					onclick={() => {
						invalidate('supabase:auth').then(() => {
							goto('/dashboard');
						});
					}}
					class="btn btn-wide max-w-[150px] btn-lg btn-primary">Continue</button
				>
			</div>
		</div>
	</dialog>
{/if}
