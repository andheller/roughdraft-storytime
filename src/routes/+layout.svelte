<script>
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
</svelte:head>

<!-- Clean global background -->
<div class="theme-bg"></div>

<div class="relative min-h-screen">
	<main>
		{@render children()}
	</main>
</div>
