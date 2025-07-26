<script lang="ts">
	import { goto, invalidate } from '$app/navigation';

	let { data } = $props();
	let { supabase } = $derived(data);

	let modalSucess = $state(false);

	let formFields = $state({
		first_name: data?.session?.user?.user_metadata?.first_name || '',
		last_name: data?.session?.user?.user_metadata?.last_name || '',
		email: data?.session?.user?.user_metadata?.email || '',
		gender: data?.session?.user?.user_metadata?.gender || '',
		dob: data?.session?.user?.user_metadata?.dob || ''
	});

	const updateUser = async () => {
		// 1. Update auth.users metadata
		const { data: userData, error: updateError } = await supabase.auth.updateUser({
			data: formFields
		});

		if (updateError) {
			console.error('Update error:', updateError);
			return;
		}

		// 2. Call the sync_user_profile RPC function
		const user = userData?.user;

		if (!user) {
			console.error('No user returned from update');
			return;
		}

		const { error: rpcError } = await supabase.rpc('sync_user_profile', {
			user_id: user.id
		});

		if (rpcError) {
			console.error('RPC sync error:', rpcError);
		} else {
			modalSucess = true;
			// console.log('Profile synced to `profiles` table.');
		}
	};
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
					<span class=" text-[#7f7f7f]">xxNamexx</span>
				</h1>
				<p class=" text-lg text-[#7f7f7f]">Manage your profile details here.</p>
			</div>

			<form onsubmit={updateUser}>
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
				<div class="grid w-full max-w-[820px] grid-cols-[1fr_auto] gap-x-[45px]">
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
										bind:value={formFields.first_name}
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
										bind:value={formFields.last_name}
									/>
								</label>
							</div>
							<label class="floating-label">
								<span>Email</span>
								<input
									disabled
									name="email"
									type="email"
									placeholder="Email"
									class="input w-full"
									required
									bind:value={formFields.email}
								/>
							</label>
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<label class="floating-label">
									<span>Gender</span>
									<select
										class="select w-full"
										name="gender"
										required
										bind:value={formFields.gender}
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
										bind:value={formFields.dob}
									/>
								</label>
							</div>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<label
							class="flex h-[140px] w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-base-300 shadow hover:bg-base-200"
						>
							<input type="file" class="hidden h-0 w-0 opacity-0" />
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
						<p class=" text-lg font-bold text-primary">
							Profile <br />
							photo
						</p>
					</div>
				</div>

				<div class="mt-16 flex w-full gap-4">
					<button type="submit" class=" btn btn-lg btn-primary  btn-wide max-w-[110px]">Save</button>
					<a href="/dashboard" class=" btn btn-soft btn-lg btn-primary btn-wide max-w-[110px]">Cancel</a>
				</div>
			</form>
		</div>
	</div>
</section>

{#if modalSucess}
	<dialog id="my_modal_1" class="modal-open modal">
		<div class="modal-box">
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
