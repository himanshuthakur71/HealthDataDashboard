<script lang="ts">
	let { children } = $props();
</script>

<section class="py-[60px]">
	<div class="hms-container">
		<div class="flex w-full items-center">
			<div class=" border-r-[2px] border-[#d7d7d7] py-[87px] pr-[22px]">
				<figure class="flex h-[342px] w-[427px] items-center justify-center">
					<img src="/images/normal_u63.jpg" alt="box" class="h-full w-full" />
				</figure>
			</div>

			<div class="lg:pl-[100px]">
				{@render children()}
			</div>
		</div>
	</div>
</section>
