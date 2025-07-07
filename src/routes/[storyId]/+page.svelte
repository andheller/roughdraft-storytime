<script>
	import StoryReader from '$lib/StoryReader.svelte';
	import DesignPicker from '$lib/DesignPicker.svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data } = $props();

	let storyId = data.story.id;
	
	// Start with server-side theme data (defaults for prerendered pages)
	let currentDesign = $state(data.theme);
	let isTransitioningBack = $state(false);
	
	// Load actual theme from cookies after hydration
	if (browser) {
		const savedTheme = document.cookie
			.split('; ')
			.find(row => row.startsWith('story-theme='))
			?.split('=')[1];
		
		const savedFont = document.cookie
			.split('; ')
			.find(row => row.startsWith('story-font='))
			?.split('=')[1];
		
		if (savedTheme || savedFont) {
			currentDesign = {
				theme: savedTheme || 'white',
				fontType: savedFont || 'serif'
			};
		}
		
		// Apply theme class to document for CSS custom properties
		updateThemeClass();
	}
	
	function updateThemeClass() {
		if (browser) {
			// Remove existing theme classes
			document.documentElement.classList.remove('theme-white', 'theme-dark', 'theme-sepia');
			// Add current theme class
			document.documentElement.classList.add(`theme-${currentDesign.theme}`);
		}
	}

	// Only show slide-in animation if navigating from bookshelf
	let shouldSlideIn = $state(false);
	
	// Check if we came from the bookshelf page
	if (browser) {
		// Check navigation state first (most reliable)
		const fromBookshelf = window.history.state?.from === 'bookshelf';
		
		// Fallback to referrer check
		const referrer = document.referrer;
		const isFromBookshelfReferrer = referrer && referrer.includes(window.location.origin) && 
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

	function handleDesignChange(design) {
		currentDesign = design;
		
		// Save to cookies
		if (browser) {
			document.cookie = `story-theme=${design.theme}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
			document.cookie = `story-font=${design.fontType}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
			// Update theme class for immediate visual feedback
			updateThemeClass();
		}
	}

	const currentTheme = $derived(themes[currentDesign.theme]);
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

<div class="min-h-screen {currentTheme.bgColor} story-page {shouldSlideIn ? 'slide-in' : ''} {isTransitioningBack ? 'transitioning-back' : ''}">
	<div class="container mx-auto px-4 py-6">
		<div class="flex items-center justify-between mb-8">
			<button onclick={handleBackNavigation} class="inline-flex items-center gap-2 px-4 py-2 {currentTheme.mutedColor} hover:{currentTheme.textColor} transition-colors">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
				</svg>
				<span class="font-medium">Back to Stories</span>
			</button>
			
			<DesignPicker onDesignChange={handleDesignChange} />
		</div>

		<StoryReader {storyId} {currentDesign} {currentTheme} />
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');
	
	/* CSS Custom Properties for Theme Switching */
	:root {
		--theme-bg: white;
		--theme-text: #111827;
		--theme-muted: #6b7280;
	}
	
	/* Theme variations */
	:global(.theme-dark) {
		--theme-bg: #111827;
		--theme-text: white;
		--theme-muted: #d1d5db;
	}
	
	:global(.theme-sepia) {
		--theme-bg: #fef7ed;
		--theme-text: #9a3412;
		--theme-muted: #c2410c;
	}
	
	/* Page Transition - Slide from Right (only when navigating from bookshelf) */
	.story-page {
		/* Default: no transition, page loads normally */
		transform: translateX(0);
		opacity: 1;
	}

	.story-page.slide-in {
		/* Initial state when navigating from bookshelf */
		transform: translateX(100%);
		opacity: 0;
		animation: slideInFromRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	/* Back Navigation - Slide to Right */
	.story-page.transitioning-back {
		transform: translateX(100%);
		opacity: 0;
		transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
	}

	@keyframes slideInFromRight {
		from { transform: translateX(100%); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
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