<script>
	import { parseMarkdown } from './markdown.js';
	import { loadStory, getChapterAudioUrl } from './content-loader.js';
	import AudioPlayer from './AudioPlayer.svelte';

	let { seriesId, storyId, currentDesign, currentTheme } = $props();

	let story = $state(null);
	let chaptersWithContent = $state([]);
	let currentChapter = $state(1);
	let currentAudioUrl = $state(null);

	$effect(() => {
		async function loadStoryData() {
			try {
				const storyData = await loadStory(seriesId, storyId);
				story = storyData;
				
				// Parse all chapters at once for SEO and continuous reading
				chaptersWithContent = storyData.chapters.map((chapter) => ({
					...chapter,
					html: parseMarkdown(chapter.content)
				}));
				
				// Set initial audio URL if available
				if (storyData.audio?.available) {
					currentAudioUrl = getChapterAudioUrl(seriesId, storyId, currentChapter);
				}
			} catch (error) {
				console.error('Failed to load story:', error);
			}
		}
		
		loadStoryData();
	});

	// Update audio URL when chapter changes
	$effect(() => {
		if (story?.audio?.available) {
			// Check if current chapter has audio
			const chapterAudio = story.audio.chapters.find(ch => ch.id === currentChapter);
			currentAudioUrl = chapterAudio ? chapterAudio.audioUrl : null;
		}
	});

	function scrollToChapter(chapterNumber) {
		const element = document.getElementById(`chapter-${chapterNumber}`);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
		currentChapter = chapterNumber;
	}

	function goToNextChapter() {
		if (currentChapter < story.chapters.length) {
			currentChapter += 1;
			scrollToChapter(currentChapter);
		}
	}

	function goToPreviousChapter() {
		if (currentChapter > 1) {
			currentChapter -= 1;
			scrollToChapter(currentChapter);
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
				{#if story.audio?.available}
					<div class="flex items-center gap-2">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0 3 3 0 00-6 0z"/>
						</svg>
						<span class="font-medium">Audio Available ({story.audio.voice})</span>
					</div>
				{/if}
			</div>
			
			<!-- Audio Player -->
			{#if story.audio?.available}
				<div class="mb-8">
					{#if currentAudioUrl}
						<AudioPlayer 
							bind:audioUrl={currentAudioUrl}
							title="Chapter {currentChapter}"
							onEnded={goToNextChapter}
							className="max-w-2xl"
							{currentChapter}
							{story}
							{goToNextChapter}
							{goToPreviousChapter}
						/>
					{:else}
						<div class="max-w-2xl bg-gray-100 border border-gray-200 rounded-lg p-4">
							<div class="flex items-center gap-2 text-gray-600">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0 3 3 0 00-6 0z"/>
								</svg>
								<span>Audio not available for Chapter {currentChapter}</span>
							</div>
						</div>
					{/if}
				</div>
			{/if}
			
			<!-- Table of Contents -->
			<div class="mb-8">
				<h2 class="mb-6 {fontClass} text-2xl font-semibold {currentTheme.textColor}">Table of Contents</h2>
				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
					{#each story.chapters as chapter, index (chapter.number)}
						<button
							onclick={() => scrollToChapter(chapter.number)}
							class="group flex items-center gap-3 p-3 text-left transition-all hover:opacity-80 rounded-lg"
							title="Jump to {chapter.title}"
						>
							<div class="flex h-6 w-6 items-center justify-center text-sm font-bold {currentTheme.mutedColor}">
								{chapter.number}
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
			{#each chaptersWithContent as chapter (chapter.number)}
				<section id="chapter-{chapter.number}" class="mb-4 scroll-mt-24">
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
		margin-bottom: 1rem;
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
		font-size: 1.35rem;
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
		font-size: 3.5rem;
		line-height: 1;
		padding-right: 0.25rem;
		margin-top: -0.25rem;
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
