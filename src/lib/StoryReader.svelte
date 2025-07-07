<script>
	import { parseMarkdown } from './markdown.js';
	import { getStory } from '../content/stories/index.js';

	let { storyId, currentDesign, currentTheme } = $props();

	let story = $state(getStory(storyId));
	let chaptersWithContent = $state([]);

	$effect(() => {
		if (story) {
			// Parse all chapters at once for SEO and continuous reading
			chaptersWithContent = story.chapters.map((chapter) => ({
				...chapter,
				html: parseMarkdown(chapter.content)
			}));
		}
	});

	function scrollToChapter(chapterId) {
		const element = document.getElementById(`chapter-${chapterId}`);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	const fontClass = $derived(currentDesign.fontType === 'serif' ? 'font-serif' : 'font-sans');
</script>

{#if story && chaptersWithContent.length > 0}
	<div class="story-container mx-auto max-w-4xl">
		<!-- Story Header -->
		<header class="mb-16 py-8">
			<h1 class="mb-6 {fontClass} text-5xl font-bold {currentTheme.textColor} leading-tight">
				{story.title}
			</h1>
			
			<p class="mb-8 text-xl {currentTheme.mutedColor} leading-relaxed max-w-3xl">
				{story.description}
			</p>
			
			<div class="flex flex-wrap gap-6 mb-12 {currentTheme.mutedColor}">
				<div class="flex items-center gap-2">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
					</svg>
					<span class="font-medium">{story.chapters.length} Chapters</span>
				</div>
				<div class="flex items-center gap-2">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
					<span class="font-medium">~{Math.ceil(story.chapters.length * 3)} min read</span>
				</div>
			</div>
			
			<!-- Table of Contents -->
			<div class="mb-8">
				<h2 class="mb-6 {fontClass} text-2xl font-semibold {currentTheme.textColor}">Table of Contents</h2>
				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
					{#each story.chapters as chapter (chapter.id)}
						<button
							on:click={() => scrollToChapter(chapter.id)}
							class="group flex items-center gap-3 p-3 text-left transition-all hover:opacity-80 rounded-lg"
							title="Jump to {chapter.title}"
						>
							<div class="flex h-6 w-6 items-center justify-center text-sm font-bold {currentTheme.mutedColor}">
								{chapter.id}
							</div>
							<div class="flex-1">
								<div class="font-medium {currentTheme.textColor}">{chapter.title}</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</header>



		<!-- All Chapters -->
		<main class="prose prose-lg max-w-none {fontClass} story-content {currentTheme.textColor}">
			{#each chaptersWithContent as chapter (chapter.id)}
				<section id="chapter-{chapter.id}" class="mb-20 scroll-mt-24">
					<div class="chapter-content py-8">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html chapter.html}
					</div>
				</section>
			{/each}
		</main>
		
		<!-- Story End -->
		<div class="not-prose mt-20 py-12 text-center">
			<div class="mb-6 text-4xl font-bold {currentTheme.textColor}">🎉 The End! 🎉</div>
			<p class="mb-8 {fontClass} text-xl {currentTheme.mutedColor}">Thanks for reading "{story.title}"!</p>
			<a
				href="/"
				class="inline-block px-8 py-3 font-medium {currentTheme.mutedColor} hover:{currentTheme.textColor} transition-colors underline underline-offset-4"
			>
				Read More Stories
			</a>
		</div>
	</div>
{:else}
	<div class="flex h-64 items-center justify-center">
		<div class="rounded-xl bg-white/80 p-8 text-center shadow-lg backdrop-blur-sm">
			<div class="mb-4 text-4xl">📚</div>
			<p class="font-serif text-lg text-amber-900">Loading story...</p>
		</div>
	</div>
{/if}

<style>
	/* Smooth scrolling for the whole page */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Better spacing between chapters */
	:global(.chapter-content) {
		margin-bottom: 4rem;
	}

	/* Make continue buttons more prominent */
	:global(.story-container button) {
		font-weight: 500;
		transition: all 0.3s ease;
	}

	:global(.story-container button:hover) {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
	}

	/* Ensure all story content inherits the text color */
	:global(.story-content *) {
		color: inherit !important;
	}

	/* Typography styles that adapt to current design */
	:global(.story-container .prose h1) {
		font-weight: 700;
		margin-bottom: 1.5rem;
		line-height: 1.3;
		font-size: 2.5rem;
	}

	:global(.story-container .prose h2) {
		font-weight: 600;
		margin-bottom: 1rem;
		font-size: 2rem;
	}

	:global(.story-container .prose p) {
		margin-bottom: 1.75rem;
		text-indent: 2em;
		font-size: 1.2rem;
		line-height: 1.8;
	}

	:global(.story-container .prose p:first-of-type) {
		text-indent: 0;
		font-size: 1.3em;
		font-weight: 600;
		opacity: 0.9;
	}

	:global(.story-container .prose em) {
		font-style: italic;
		text-align: center;
		display: block;
		margin: 2rem 0;
		font-size: 0.9em;
		text-indent: 0;
		opacity: 0.8;
	}

	:global(.story-container .prose strong) {
		font-weight: 600;
		opacity: 0.9;
	}

	/* Drop caps for chapter beginnings */
	:global(.chapter-content p:first-of-type::first-letter) {
		float: left;
		font-size: 4rem;
		line-height: 3rem;
		padding-right: 0.5rem;
		padding-top: 0.25rem;
		font-weight: 700;
		opacity: 0.7;
	}

	/* Elegant quote styling */
	:global(.story-container .prose blockquote) {
		border-left: 4px solid currentColor;
		background: rgba(0, 0, 0, 0.05);
		padding: 1.5rem;
		margin: 2rem 0;
		border-radius: 0 0.5rem 0.5rem 0;
		font-style: italic;
		opacity: 0.9;
	}
</style>
