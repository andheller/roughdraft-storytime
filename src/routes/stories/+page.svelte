<script>
	import { storyList } from '../../content/stories/index.js';

	// Get all stories from our content
	let stories = $state(
		storyList.map((story) => ({
			...story,
			chapters: story.chapters.length
		}))
	);
</script>

<svelte:head>
	<title>Stories - Kids Story Collection</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<header class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-800">📚 Story Collection</h1>
		<p class="text-lg text-gray-600">Discover magical adventures and learn valuable lessons!</p>
	</header>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each stories as story (story.id)}
			<div class="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
				<div
					class="flex h-48 items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500"
				>
					<span class="text-6xl">🐿️</span>
				</div>
				<div class="p-6">
					<h3 class="mb-2 text-xl font-semibold text-gray-800">{story.title}</h3>
					<p class="mb-4 text-gray-600">{story.description}</p>
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-500">{story.chapters} chapters</span>
						<a
							href="/stories/{story.id}"
							class="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
						>
							Read Story
						</a>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if stories.length === 0}
		<div class="py-12 text-center">
			<p class="text-lg text-gray-500">No stories available yet. Check back soon!</p>
		</div>
	{/if}
</div>
