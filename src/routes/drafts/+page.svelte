<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>Roughdrafts | Roughdraft Storytime</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-12">
	<a
		href="/"
		class="mb-8 inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
	>
		<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
		Back to Stories
	</a>

	<h1 class="mb-2 font-serif text-3xl font-bold text-stone-800 dark:text-stone-100">Roughdrafts</h1>
	<p class="mb-10 text-stone-500 dark:text-stone-400">
		Story seeds. Each one is a title, a premise, and an opening paragraph.
	</p>

	<div class="space-y-8">
		{#each data.drafts as draft}
			<article class="border-b border-stone-200 pb-8 last:border-0 dark:border-stone-700">
				<h2 class="mb-1 font-serif text-xl font-semibold text-stone-800 dark:text-stone-100">
					{draft.title}
				</h2>
				<div class="mb-3 flex flex-wrap gap-2 text-xs text-stone-400 dark:text-stone-500">
					<span>{draft.ageRange}</span>
					<span>&middot;</span>
					<span>{draft.genre}</span>
					{#if Array.isArray(draft.tags)}
						<span>&middot;</span>
						<span>{draft.tags.join(', ')}</span>
					{/if}
				</div>
				<p class="mb-3 text-sm italic text-stone-600 dark:text-stone-300">
					{draft.description}
				</p>
				<p class="font-serif leading-relaxed text-stone-700 dark:text-stone-200">
					{draft.body}
				</p>
			</article>
		{/each}
	</div>
</div>
