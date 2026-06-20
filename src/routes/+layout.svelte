<script>
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400..800&family=Caprasimo&family=Caveat:wght@400..700&family=Lora:ital,wght@0,400..600;1,400..600&family=Mynerve&family=Nothing+You+Could+Do&family=Patrick+Hand&family=Patrick+Hand+SC&display=swap"
	/>
</svelte:head>

<!-- Clean global background -->
<div class="theme-bg"></div>

<div class="relative min-h-screen">
	<main>
		{@render children()}
	</main>
</div>
