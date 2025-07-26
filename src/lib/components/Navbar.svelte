<script lang="ts">
	import { page } from '$app/state';

	// console.log(page?.data?.session?.user?.id)
</script>

<header class="w-full bg-base-100 shadow-sm">
	<div class="hms-container">
		<div class="navbar">
			<div class="navbar-start">
				<a href="/" class="btn text-xl btn-ghost">HealthDash</a>
			</div>

			<div class="navbar-end">
				{#if page?.data?.session?.user?.id}
					<div class="dropdown dropdown-end">
						<div tabindex="0" role="button" class="btn avatar btn-circle btn-ghost">
							<div class="w-10 rounded-full">
								<img
									alt="Tailwind CSS Navbar component"
									src="https://ui-avatars.com/api/?name={page?.data?.session?.user?.user_metadata?.first_name}+{page?.data?.session?.user?.user_metadata?.last_name}&background=random"
								/>
							</div>
						</div>
						<ul
							class="dropdown-content menu z-1 mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow"
						>
							<li>
								<a class="justify-between"> Profile </a>
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
