<script>
	import '../app.css';

	let { children } = $props();
</script>

<!-- Clean global background -->
<div class="theme-bg"></div>

<div class="relative min-h-screen">
	<main>
		{@render children()}
	</main>
</div>
