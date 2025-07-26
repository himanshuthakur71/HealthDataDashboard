<script lang="ts">
	import { page } from '$app/state';

	// console.log(page?.data?.session?.user?.id)
</script>

<header class="w-full bg-base-100 shadow-sm">
	<div class="hms-container">
		<div class="navbar px-0">
			<div class="navbar-start">
				<a href="/" class="btn text-xl btn-ghost">HealthDash</a>
			</div>

			<div class="navbar-end flex items-center gap-4">
				{#if page?.data?.session?.user?.id}

				<p><a href="/dashboard/profile" class=" text-lg font-semibold text-secondary hover:underline">{page?.data?.session?.user?.user_metadata?.first_name} {page?.data?.session?.user?.user_metadata?.last_name}</a></p>
					<div class="dropdown dropdown-end">
						<div tabindex="0" role="button" class="btn avatar btn-circle btn-ghost">
							<div class="w-10 rounded-full">
								
								<img
									alt="xxUserName"
									src="{page?.data?.session?.user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${page?.data?.session?.user?.user_metadata?.first_name}+${page?.data?.session?.user?.user_metadata?.last_name}&background=random`}"
								/>
							</div>
						</div>
						<ul
							class="dropdown-content menu z-1 mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow"
						>
							<li>
								<a href="/dashboard/profile" class="justify-between"> Profile </a>
							</li>
							<li>
								<a href="/metrics" class="justify-between">My Metrics</a>
							</li>
							<li>
								<a href="/metrics/new" class="justify-between">Create Metrics</a>
							</li>
							<li><a href="/auth/logout">Logout</a></li>
						</ul>
					</div>
				{:else}
					<a href="/auth/login" class="btn btn-primary">Login</a>
				{/if}
			</div>
		</div>
	</div>
</header>
