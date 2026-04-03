<script>
	import StoryReader from '$lib/StoryReader.svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
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

	let isTransitioningBack = $state(false);

	// Only show slide-in animation if navigating from bookshelf
	let shouldSlideIn = $state(false);

	// Check if we came from the bookshelf page
	if (browser) {
		// Check navigation state first (most reliable)
		const fromBookshelf = window.history.state?.from === 'bookshelf';

		// Fallback to referrer check
		const referrer = document.referrer;
		const isFromBookshelfReferrer =
			referrer &&
			referrer.includes(window.location.origin) &&
			(referrer.endsWith('/') || referrer.includes('/#'));

		if (fromBookshelf || isFromBookshelfReferrer) {
			shouldSlideIn = true;
		}
	}

	function handleBackNavigation() {
		isTransitioningBack = true;
		setTimeout(() => {
			goto('/', { state: { from: 'story' } });
		}, 250);
	}

	function handleBackClick(event) {
		if (!browser) return;

		event.preventDefault();
		handleBackNavigation();
	}
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

<div
	class="story-page min-h-screen {shouldSlideIn ? 'slide-in' : ''} {isTransitioningBack
		? 'transitioning-back'
		: ''}"
>
	<div class="container mx-auto px-4 py-6">
		<div class="mb-8 flex items-center justify-between">
			<a
				href="/"
				onclick={handleBackClick}
				class="inline-flex items-center gap-2 px-4 py-2 text-stone-600 opacity-80 transition-opacity hover:opacity-100 dark:text-stone-200"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"
					></path>
				</svg>
				<span class="font-medium">Back to Stories</span>
			</a>
		</div>

		<StoryReader {story} />
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');

	/* Page Transition - Slide from Right (only when navigating from bookshelf) */
	.story-page {
		/* Default: no transition, page loads normally */
		transform: translateX(0);
		color: #1c1917;
	}

	:global(.dark) .story-page {
		color: #f5f5f4;
	}

	.story-page.slide-in {
		/* Initial state when navigating from bookshelf */
		transform: translateX(100%);
		animation: slideInFromRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	/* Back Navigation - Slide to Right */
	.story-page.transitioning-back {
		transform: translateX(100%);
		transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes slideInFromRight {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
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
