<script>
	import StoryReader from '$lib/StoryReader.svelte';

	let { data } = $props();

	let storyId = data.story.id;
	let currentDesign = data.theme;
	
	const themes = {
		white: {
			bgColor: 'bg-white',
			textColor: 'text-gray-900',
			mutedColor: 'text-gray-600'
		},
		dark: {
			bgColor: 'bg-gray-900',
			textColor: 'text-white',
			mutedColor: 'text-gray-300'
		},
		sepia: {
			bgColor: 'bg-orange-50',
			textColor: 'text-orange-900',
			mutedColor: 'text-orange-700'
		}
	};
	
	const currentTheme = themes[currentDesign.theme];
</script>

<svelte:head>
	<title>{data.story.title} - Kids Story Collection</title>
	<meta name="description" content={data.story.description} />
	<meta
		name="keywords"
		content="kids story, children's book, {data.story.title.toLowerCase()}, children's literature"
	/>
	<meta property="og:title" content={data.story.title} />
	<meta property="og:description" content={data.story.description} />
	<meta property="og:type" content="book" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
	<div class="container mx-auto px-4 py-6">
		<div class="mb-6">
			<a href="/stories" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 border border-amber-200 text-amber-700 transition-all hover:bg-white hover:text-amber-900 hover:shadow-md">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
				</svg>
				<span class="font-medium">Back to Stories</span>
			</a>
		</div>

		<StoryReader {storyId} {currentDesign} {currentTheme} />
	</div>
</div>
