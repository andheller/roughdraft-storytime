<script>
	import { browser } from '$app/environment';
	import { parseMarkdown } from './markdown.js';
	import AudioPlayer from './AudioPlayer.svelte';
	import { themeState } from './theme.svelte.js';

	let { story } = $props();

	let currentChapter = $state(1);
	const chaptersWithContent = $derived(
		story
			? story.chapters.map((chapter) => ({
					...chapter,
					html: parseMarkdown(chapter.content)
				}))
			: []
	);

	const currentAudioUrl = $derived(
		story?.audio?.available
			? story.audio.chapters.find((ch) => ch.id === currentChapter)?.audioUrl || null
			: null
	);

	const currentAudioTitle = $derived(
		story ? story.chapters.find((chapter) => chapter.id === currentChapter)?.title || '' : ''
	);

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

	const fontClass = $derived(themeState.font === 'serif' ? 'font-serif' : 'font-sans');
</script>

{#if story && chaptersWithContent.length > 0}
	<div class="story-container mx-auto max-w-[700px] px-5 py-3 sm:px-8">
		<!-- Story Header -->
		<header class="mb-8 py-6">
			<h1
				class="mb-6 {fontClass} text-5xl leading-tight font-bold text-stone-950 dark:text-stone-100"
			>
				{story.title}
			</h1>

			<p class="mb-8 max-w-3xl text-xl leading-relaxed text-stone-700 dark:text-stone-400">
				{story.description}
			</p>

			<div class="mb-8 flex flex-wrap gap-6 text-stone-600 dark:text-stone-400">
				<div class="flex items-center gap-2">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
					<span class="font-medium">{story.chapters.length} Chapters</span>
				</div>
				<div class="flex items-center gap-2">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span class="font-medium">~{Math.ceil(story.chapters.length * 3)} min read</span>
				</div>
				{#if story.audio?.available}
					<div class="flex items-center gap-2">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0 3 3 0 00-6 0z"
							/>
						</svg>
						<span class="font-medium">Audio Available ({story.audio.voice})</span>
					</div>
				{/if}
			</div>

			<!-- Audio Player -->
			{#if story.audio?.available}
				<div class="mb-8">
					{#if browser && currentAudioUrl}
						<AudioPlayer
							audioUrl={currentAudioUrl}
							title={`Chapter ${currentChapter}: ${currentAudioTitle}`}
							onEnded={goToNextChapter}
							className="max-w-2xl"
							{currentChapter}
							{story}
							{goToNextChapter}
							{goToPreviousChapter}
						/>
					{:else if browser}
						<div
							class="max-w-2xl rounded-lg border border-stone-200 bg-stone-100 p-4 dark:border-white/10 dark:bg-white/5"
						>
							<div class="flex items-center gap-2 text-stone-600 dark:text-stone-400">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0 3 3 0 00-6 0z"
									/>
								</svg>
								<span>Audio not available for Chapter {currentChapter}</span>
							</div>
						</div>
					{:else}
						<div
							class="max-w-2xl rounded-2xl border border-stone-200 bg-white/75 p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
						>
							<h3
								class="mb-3 text-sm font-semibold tracking-widest text-stone-700 uppercase dark:text-stone-300"
							>
								Chapter Audio
							</h3>
							<div class="space-y-4">
								{#each story.audio.chapters as audioChapter (audioChapter.id)}
									<div class="rounded-xl bg-stone-50 p-3 dark:bg-stone-900/60">
										<div class="mb-2 text-sm font-medium text-stone-800 dark:text-stone-200">
											Chapter {audioChapter.id}:
											{story.chapters.find((chapter) => chapter.id === audioChapter.id)?.title ||
												`Chapter ${audioChapter.id}`}
										</div>
										<audio class="w-full" controls preload="none" src={audioChapter.audioUrl}>
											<a href={audioChapter.audioUrl}>Listen to chapter {audioChapter.id}</a>
										</audio>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Table of Contents -->
			<div class="no-lift mb-6">
				<h2
					class="mb-4 {fontClass} text-lg font-semibold tracking-widest text-stone-700 uppercase opacity-70 dark:text-stone-200 dark:opacity-80"
				>
					Contents
				</h2>
				<div class="grid gap-0.5 sm:grid-cols-2">
					{#each story.chapters as chapter (chapter.number)}
						<a
							href="#chapter-{chapter.number}"
							class="flex items-baseline gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-stone-100/90 dark:hover:bg-white/5"
							title="Jump to {chapter.title}"
						>
							<span
								class="w-5 shrink-0 text-right text-xs text-stone-500 tabular-nums dark:text-stone-100 dark:opacity-40"
								>{chapter.number}</span
							>
							<span class="font-medium text-stone-900 dark:text-stone-100">{chapter.title}</span>
						</a>
					{/each}
				</div>
			</div>
		</header>

		<!-- All Chapters -->
		<main
			class="prose prose-lg prose-stone dark:prose-invert max-w-none text-stone-900 {fontClass} story-content dark:text-stone-100"
		>
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
			<div class="mb-6 text-4xl font-bold text-stone-900 dark:text-stone-100">🎉 The End! 🎉</div>
			<p class="mb-8 {fontClass} text-xl text-stone-600 dark:text-stone-400">
				Thanks for reading "{story.title}"!
			</p>
			<a
				href="/"
				class="inline-block px-8 py-3 font-medium text-stone-600 underline underline-offset-4 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
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

	:global(.story-container a),
	:global(.story-container button) {
		font-weight: 500;
		transition: all 0.2s ease;
	}

	:global(.story-container a:not(.no-lift *):hover),
	:global(.story-container button:not(.no-lift *):hover) {
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
	}

	:global(.story-container .no-lift a:hover),
	:global(.story-container .no-lift button:hover) {
		transform: none;
		box-shadow: none;
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
		text-indent: 1em;
		font-size: 1.35rem;
		line-height: 1.8;
	}

	:global(.story-container .prose p:first-of-type) {
		text-indent: 0;
	}

	:global(.story-container .prose em) {
		font-style: italic;
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
