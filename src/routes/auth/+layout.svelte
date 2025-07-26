<script lang="ts">
	let { children } = $props();
</script>

<section class="">
	<div class="hms-container relative">
		<header class=" flex justify-end  relative -top-1">
			<a href="/" class="flex h-[130px] w-auto">
				<img src="/images/blue-stethoscope.png" alt="icon" class=" h-full w-auto" />
			</a>
		</header>
		<div class="flex w-full items-center">
			<div class=" border-r-[2px] border-[#d7d7d7] py-[87px] pr-[22px]">
				<figure class="flex h-[342px] w-[427px] items-center justify-center">
					<img src="/images/normal_u63.jpg" alt="box" class="h-full w-full" />
				</figure>
			</div>

			<div class="lg:pl-[100px] w-full">
				{@render children()}
			</div>
		</div>
	</div>
</section>
