<script>
	import '../app.css';
	import { themeState } from '$lib/theme.svelte.js';
	import ThemeSwitcher from '$lib/ThemeSwitcher.svelte';

	let { children } = $props();
</script>

<!-- Clean global background -->
<div class="theme-bg"></div>

<div class="relative min-h-screen">
	<!-- Global Top-Right Header -->
	<header class="fixed right-0 top-0 z-[100] p-4 sm:p-6 pointer-events-none">
		<div class="pointer-events-auto">
			<ThemeSwitcher />
		</div>
	</header>

	<main>
		{@render children()}
	</main>
</div>
