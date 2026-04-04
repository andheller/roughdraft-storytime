<script>
	import StoryReader from '$lib/StoryReader.svelte';
	import ThemeSwitcher from '$lib/ThemeSwitcher.svelte';
	import { page } from '$app/stores';

	let { data } = $props();

	let seriesId = data.seriesId;
	let story = data.story;

	const seoTitle = `${story.title} | ${story.author} | Roughdraft Storytime`;
	const seoKeywords = [
		story.title,
		seriesId.replaceAll('-', ' '),
		story.genre,
		story.ageRange,
		story.author,
		...(story.tags || []),
		'kids story',
		"children's book",
		'read aloud',
		'storytime'
	].join(', ');
	const canonicalPath = $derived($page.url.pathname);

</script>

<svelte:head>
	<title>{seoTitle}</title>
	<meta name="description" content={story.description} />
	<meta name="keywords" content={seoKeywords} />
	<meta name="author" content={story.author} />
	<meta name="robots" content="index,follow,max-image-preview:large" />
	<link rel="canonical" href={canonicalPath} />
	<meta property="og:title" content={seoTitle} />
	<meta property="og:description" content={story.description} />
	<meta property="og:type" content="book" />
	<meta property="og:url" content={canonicalPath} />
	<meta property="og:site_name" content="Roughdraft Storytime" />
	<meta property="book:author" content={story.author} />
	<meta property="book:tag" content={(story.tags || []).join(', ')} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={seoTitle} />
	<meta name="twitter:description" content={story.description} />
</svelte:head>

<div class="story-page min-h-screen">
	<div class="container mx-auto px-4 py-6">
		<div class="mb-8 flex items-center justify-between">
			<a
				href="/"
				class="inline-flex items-center gap-2 px-4 py-2 text-stone-600 opacity-80 transition-opacity hover:opacity-100 dark:text-stone-200"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"
					></path>
				</svg>
				<span class="font-medium">Back to Stories</span>
			</a>

			<div class="shrink-0">
				<ThemeSwitcher />
			</div>
		</div>

		<StoryReader {story} />
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');

	.story-page {
		transform: translateX(0);
		color: #1c1917;
	}

	:global(.dark) .story-page {
		color: #f5f5f4;
	}

	:global(.font-crimson) {
		font-family: 'Crimson Text', serif;
	}

	:global(.font-merriweather) {
		font-family: 'Merriweather', serif;
	}

	:global(.font-lora) {
		font-family: 'Lora', serif;
	}

	:global(.font-inter) {
		font-family: 'Inter', sans-serif;
	}

	:global(.font-georgia) {
		font-family: 'Georgia', serif;
	}
</style>
