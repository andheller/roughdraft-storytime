<script>
	import { parseMarkdown } from './markdown.js';
	import { getStory } from '../content/stories/index.js';

	let { storyId } = $props();

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
</script>

{#if story && chaptersWithContent.length > 0}
	<div class="story-container mx-auto max-w-4xl">
		<!-- Story Header -->
		<header class="mb-12 rounded-xl bg-white/90 p-8 shadow-lg backdrop-blur-sm border border-amber-200">
			<div class="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full text-amber-800 text-sm font-medium">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				Complete Story
			</div>
			
			<h1 class="mb-4 font-serif text-4xl font-bold text-amber-900">
				{story.title}
			</h1>
			
			<p class="mb-6 text-lg text-amber-700 leading-relaxed">
				{story.description}
			</p>
			
			<div class="flex flex-wrap gap-4 mb-6 text-amber-600">
				<div class="flex items-center gap-2">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
					</svg>
					<span class="font-medium">{story.chapters.length} Chapters</span>
				</div>
				<div class="flex items-center gap-2">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
					<span class="font-medium">~{Math.ceil(story.chapters.length * 3)} min read</span>
				</div>
			</div>
			
			<!-- Table of Contents -->
			<div class="rounded-lg border border-amber-200 bg-amber-50 p-6">
				<h2 class="mb-4 font-serif text-xl font-semibold text-amber-900">Table of Contents</h2>
				<div class="grid gap-3 md:grid-cols-2">
					{#each story.chapters as chapter (chapter.id)}
						<button
							on:click={() => scrollToChapter(chapter.id)}
							class="group flex items-center gap-3 rounded-lg p-3 text-left transition-all hover:bg-amber-100 hover:shadow-sm"
							title="Jump to {chapter.title}"
						>
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-sm font-medium text-amber-800 group-hover:bg-amber-300">
								{chapter.id}
							</div>
							<div class="flex-1">
								<div class="font-medium text-amber-900">{chapter.title}</div>
								<div class="text-xs text-amber-600">Chapter {chapter.id}</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</header>

		<!-- Quick Navigation (Sticky) -->
		<nav class="sticky top-4 z-10 mb-8 rounded-lg border border-amber-200 bg-white/90 p-3 shadow-sm backdrop-blur-sm">
			<div class="flex flex-wrap justify-center gap-2">
				{#each story.chapters as chapter (chapter.id)}
					<button
						on:click={() => scrollToChapter(chapter.id)}
						class="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700 transition-colors hover:bg-amber-200"
						title="Jump to Chapter {chapter.id}"
					>
						{chapter.id}
					</button>
				{/each}
			</div>
		</nav>

		<!-- All Chapters -->
		<main class="prose prose-lg max-w-none prose-amber">
			{#each chaptersWithContent as chapter (chapter.id)}
				<section id="chapter-{chapter.id}" class="mb-16 scroll-mt-24">
					<div class="chapter-content rounded-xl bg-white/60 p-8 shadow-sm backdrop-blur-sm">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html chapter.html}
					</div>
				</section>
			{/each}
		</main>
		
		<!-- Story End -->
		<div class="not-prose mt-12 rounded-xl bg-white/80 p-8 text-center shadow-lg backdrop-blur-sm">
			<div class="mb-4 text-4xl font-bold text-amber-900">🎉 The End! 🎉</div>
			<p class="mb-6 font-serif text-lg text-amber-700">Thanks for reading "{story.title}"!</p>
			<a
				href="/"
				class="inline-block rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-xl"
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
	@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap');
	
	:global(.story-container .prose) {
		font-family: 'Crimson Text', serif;
		font-size: 1.25rem;
		line-height: 1.8;
		color: #451a03;
	}

	:global(.story-container .prose h1) {
		font-family: 'Merriweather', serif;
		color: #92400e;
		margin-bottom: 1.5rem;
		line-height: 1.3;
	}

	:global(.story-container .prose h2) {
		font-family: 'Merriweather', serif;
		color: #92400e;
		margin-bottom: 1rem;
	}

	:global(.story-container .prose p) {
		margin-bottom: 1.75rem;
		text-align: justify;
		text-indent: 2em;
	}

	:global(.story-container .prose p:first-of-type) {
		text-indent: 0;
		font-size: 1.3rem;
		font-weight: 600;
		color: #78350f;
	}

	:global(.story-container .prose em) {
		font-style: italic;
		color: #a16207;
		text-align: center;
		display: block;
		margin: 2rem 0;
		font-size: 1rem;
		text-indent: 0;
	}

	:global(.story-container .prose strong) {
		color: #78350f;
		font-weight: 600;
	}

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

	/* Drop caps for chapter beginnings */
	:global(.chapter-content p:first-of-type::first-letter) {
		float: left;
		font-family: 'Merriweather', serif;
		font-size: 4rem;
		line-height: 3rem;
		padding-right: 0.5rem;
		padding-top: 0.25rem;
		color: #d97706;
		font-weight: 700;
	}

	/* Elegant quote styling */
	:global(.story-container .prose blockquote) {
		border-left: 4px solid #d97706;
		background: rgba(217, 119, 6, 0.05);
		padding: 1.5rem;
		margin: 2rem 0;
		border-radius: 0 0.5rem 0.5rem 0;
		font-style: italic;
		color: #78350f;
	}
</style>
