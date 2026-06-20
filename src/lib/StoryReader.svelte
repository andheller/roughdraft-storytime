<script>
	import { browser } from '$app/environment';
	import { parseMarkdown } from './markdown.js';
	import AudioPlayer from './AudioPlayer.svelte';
	import { themeState } from './theme.svelte.js';

	let { story } = $props();

	let currentChapter = $state(1);
	let isAudioPlaying = $state(false);
	let audioChapterTrailElement = $state(null);
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
	const shouldShowAudioSidebar = $derived(Boolean(story?.audio?.available && isAudioPlaying));

	function handleAudioPlayingChange(nextIsPlaying) {
		isAudioPlaying = Boolean(story?.audio?.available && nextIsPlaying);
	}

	function scrollActiveAudioChapterIntoView(chapterNumber) {
		const container = audioChapterTrailElement;
		const activeLink = container?.querySelector(`[data-audio-chapter-link="${chapterNumber}"]`);
		if (!container || !activeLink) return;

		const targetScrollTop =
			activeLink.offsetTop - container.clientHeight / 2 + activeLink.offsetHeight / 2;

		container.scrollTo({
			top: Math.max(0, targetScrollTop),
			behavior: 'smooth'
		});
	}

	$effect(() => {
		if (!browser || !shouldShowAudioSidebar || !audioChapterTrailElement) return;

		const chapterNumber = currentChapter;
		const frameId = requestAnimationFrame(() => scrollActiveAudioChapterIntoView(chapterNumber));

		return () => cancelAnimationFrame(frameId);
	});

	function scrollToChapter(chapterNumber) {
		const element = document.getElementById(`chapter-${chapterNumber}`);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
		currentChapter = chapterNumber;
	}

	function handleChapterLinkClick(event, chapterNumber) {
		event.preventDefault();
		scrollToChapter(chapterNumber);
		history.replaceState(null, '', `#chapter-${chapterNumber}`);
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
	<div class="story-container mx-auto max-w-[760px] px-4 py-2 sm:px-6">
		<header class="story-masthead mb-8 pt-5 pb-8 sm:pt-8 sm:pb-10">
			<div class="mb-7">
				<h1
					class="mb-5 {fontClass} text-5xl leading-[1.02] font-semibold text-pretty text-stone-950 sm:text-6xl dark:text-stone-50"
				>
					{story.title}
				</h1>
				<p class="max-w-[44rem] text-lg leading-8 text-pretty text-stone-600 dark:text-stone-400">
					{story.description}
				</p>
			</div>

			<!-- Metadata pills -->
			<div class="story-metadata mb-6 flex flex-wrap gap-2">
				<span
					class="rounded-full border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-600 tabular-nums dark:border-stone-700 dark:text-stone-400"
				>
					{story.chapters.length} chapters
				</span>
				<span
					class="rounded-full border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-600 tabular-nums dark:border-stone-700 dark:text-stone-400"
				>
					~{Math.ceil(story.chapters.length * 3)} min read
				</span>
				{#if story.audio?.available}
					<span
						class="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-600 dark:border-stone-700 dark:text-stone-400"
					>
						<svg
							class="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M3 18v-6a9 9 0 0 1 18 0v6" />
							<path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5Z" />
							<path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5Z" />
						</svg>
						Audio
					</span>
				{/if}
			</div>

			<!-- Audio Player -->
			{#if story.audio?.available}
				<div class="mb-6">
					{#if browser && currentAudioUrl}
						<AudioPlayer
							audioUrl={currentAudioUrl}
							title={`Chapter ${currentChapter}: ${currentAudioTitle}`}
							onEnded={goToNextChapter}
							onPlayingChange={handleAudioPlayingChange}
							className="story-audio"
							{currentChapter}
							{story}
							{goToNextChapter}
							{goToPreviousChapter}
						/>
					{:else if browser}
						<div class="max-w-2xl rounded border border-stone-200 p-4 dark:border-white/10">
							<p class="text-sm text-stone-500">Audio not available for Chapter {currentChapter}</p>
						</div>
					{:else}
						<div class="max-w-2xl rounded border border-stone-200 p-5 dark:border-white/10">
							<p class="mb-3 text-sm font-medium text-stone-500 dark:text-stone-400">
								Chapter audio
							</p>
							<div class="space-y-3">
								{#each story.audio.chapters as audioChapter (audioChapter.id)}
									<div>
										<p class="mb-1 text-sm font-medium text-stone-700 dark:text-stone-300">
											{story.chapters.find((ch) => ch.id === audioChapter.id)?.title ||
												`Chapter ${audioChapter.id}`}
										</p>
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
			<div class="no-lift story-contents">
				<p class="mb-4 text-sm font-medium text-stone-500 dark:text-stone-400">Contents</p>
				<div role="list" class="chapter-trail">
					{#each story.chapters as chapter (chapter.number)}
						<div role="listitem">
							<a
								href="#chapter-{chapter.number}"
								class:active={currentChapter === chapter.number}
								class="group flex items-baseline justify-between py-2.5"
								title="Jump to {chapter.title}"
								onclick={(event) => handleChapterLinkClick(event, chapter.number)}
							>
								<span aria-hidden="true" class="chapter-dot"></span>
								<span
									class="chapter-link-title text-sm font-medium text-stone-800 transition-colors group-hover:text-stone-950 dark:text-stone-300 dark:group-hover:text-stone-50"
								>
									{chapter.title}
								</span>
								<span
									class="chapter-number ml-4 shrink-0 text-sm text-stone-400 tabular-nums dark:text-stone-600"
								>
									{chapter.number}
								</span>
							</a>
						</div>
					{/each}
				</div>
			</div>
		</header>

		{#if shouldShowAudioSidebar}
			<aside class="audio-follow-sidebar no-lift" aria-label="Audio chapter progress">
				<p class="mb-3 text-xs font-semibold text-stone-500 uppercase dark:text-stone-400">
					Listening
				</p>
				<div
					bind:this={audioChapterTrailElement}
					role="list"
					class="chapter-trail audio-follow-trail"
				>
					{#each story.chapters as chapter (chapter.number)}
						<div role="listitem">
							<a
								href="#chapter-{chapter.number}"
								class:active={currentChapter === chapter.number}
								aria-current={currentChapter === chapter.number ? 'true' : undefined}
								data-audio-chapter-link={chapter.number}
								class="group flex items-baseline justify-between py-2.5"
								title="Jump to {chapter.title}"
								onclick={(event) => handleChapterLinkClick(event, chapter.number)}
							>
								<span aria-hidden="true" class="chapter-dot"></span>
								<span
									class="chapter-link-title text-sm font-medium text-stone-800 transition-colors group-hover:text-stone-950 dark:text-stone-300 dark:group-hover:text-stone-50"
								>
									{chapter.title}
								</span>
								<span
									class="chapter-number ml-4 shrink-0 text-sm text-stone-400 tabular-nums dark:text-stone-600"
								>
									{chapter.number}
								</span>
							</a>
						</div>
					{/each}
				</div>
			</aside>
		{/if}

		<!-- All Chapters -->
		<main
			class="prose prose-lg prose-stone dark:prose-invert max-w-none text-stone-900 {fontClass} story-content dark:text-stone-100"
		>
			{#each chaptersWithContent as chapter (chapter.number)}
				<section
					id="chapter-{chapter.number}"
					class="story-chapter mb-4 scroll-mt-24"
					style="--chapter-number: '{chapter.number}'"
				>
					<div class="chapter-content py-8">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html chapter.html}
					</div>
				</section>
			{/each}
		</main>

		<!-- Story End -->
		<div class="not-prose story-end mt-20 py-12 text-center">
			<div class="mb-6 text-4xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
				🎉 The End! 🎉
			</div>
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

	:global(.story-container) {
		--story-accent: #2688dd;
		--story-accent-soft: rgba(38, 136, 221, 0.16);
		--story-paper: rgba(255, 255, 255, 0.62);
		--story-ink-soft: rgba(41, 37, 36, 0.5);
		--story-frame: rgba(242, 242, 237, 0.32);
		--story-frame-border: rgba(232, 231, 230, 0.96);
		--chapter-surface: #faf8f5;
	}

	:global(.dark .story-container) {
		--story-accent: #7cc7ff;
		--story-accent-soft: rgba(124, 199, 255, 0.16);
		--story-paper: rgba(255, 255, 255, 0.04);
		--story-ink-soft: rgba(245, 245, 244, 0.38);
		--story-frame: rgba(255, 255, 255, 0.05);
		--story-frame-border: rgba(255, 255, 255, 0.1);
		--chapter-surface: #161412;
	}

	.story-masthead {
		position: relative;
		border-bottom: 1px solid color-mix(in srgb, currentColor 9%, transparent);
	}

	:global(.story-metadata > span) {
		background: var(--story-paper);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.56);
	}

	:global(.dark .story-metadata > span) {
		background: var(--story-paper);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 1px 2px rgba(0, 0, 0, 0.18);
	}

	.story-contents {
		--chapter-dot-size: 1rem;
		--chapter-link-pad-x: 0.875rem;
		--chapter-line-x: calc(var(--chapter-link-pad-x) + (var(--chapter-dot-size) / 2));
		position: relative;
		border-radius: 0.5rem;
		padding: 0.875rem;
		background: color-mix(in srgb, var(--story-paper) 88%, transparent);
		box-shadow:
			inset 0 0 0 1px rgba(120, 113, 108, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.46);
	}

	:global(.dark .story-contents) {
		background: var(--story-paper);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.06);
	}

	.audio-follow-sidebar {
		display: none;
	}

	.chapter-trail {
		position: relative;
	}

	.chapter-trail::before {
		content: '';
		position: absolute;
		top: 1.55rem;
		bottom: 1.55rem;
		left: calc(var(--chapter-line-x) - 0.5px);
		width: 1px;
		background: linear-gradient(180deg, transparent, rgba(120, 113, 108, 0.28), transparent);
	}

	:global(.story-contents a),
	.audio-follow-sidebar a {
		position: relative;
		align-items: center;
		min-height: 2.75rem;
		gap: 0.85rem;
		border-radius: 0.5rem;
		padding-inline: var(--chapter-link-pad-x, 0.875rem) 0.375rem;
	}

	:global(.story-contents a:hover),
	:global(.story-contents a.active),
	.audio-follow-sidebar a:hover,
	.audio-follow-sidebar a.active {
		background: var(--story-accent-soft);
	}

	.chapter-dot {
		position: relative;
		z-index: 1;
		display: inline-grid;
		width: var(--chapter-dot-size, 1rem);
		height: var(--chapter-dot-size, 1rem);
		flex: 0 0 auto;
		place-items: center;
		border-radius: 999px;
		border: 2px solid rgba(120, 113, 108, 0.2);
		background: var(--chapter-surface);
		box-shadow: 0 0 0 4px var(--chapter-surface);
	}

	.chapter-dot::after {
		content: '';
		width: 0.45rem;
		height: 0.45rem;
		border-radius: inherit;
		background: transparent;
	}

	:global(.story-contents a:hover .chapter-dot),
	:global(.story-contents a.active .chapter-dot),
	.audio-follow-sidebar a:hover .chapter-dot,
	.audio-follow-sidebar a.active .chapter-dot {
		border-color: color-mix(in srgb, var(--story-accent) 60%, white);
		background: color-mix(in srgb, var(--story-accent) 14%, var(--chapter-surface));
	}

	:global(.story-contents a.active .chapter-dot::after),
	.audio-follow-sidebar a.active .chapter-dot::after {
		background: var(--story-accent);
	}

	.chapter-link-title {
		flex: 1;
	}

	.chapter-number {
		display: inline-grid;
		width: 2rem;
		height: 2rem;
		place-items: center;
		border-radius: 999px;
		border: 1px solid rgba(120, 113, 108, 0.08);
		padding: 0;
		background: rgba(120, 113, 108, 0.06);
		font-weight: 600;
	}

	:global(.story-contents a.active .chapter-number),
	.audio-follow-sidebar a.active .chapter-number {
		border-color: color-mix(in srgb, var(--story-accent) 22%, transparent);
		background: color-mix(in srgb, var(--story-accent) 16%, white);
		color: color-mix(in srgb, var(--story-accent) 70%, #1c1917) !important;
	}

	:global(.dark .story-contents a.active .chapter-number),
	:global(.dark .audio-follow-sidebar a.active .chapter-number) {
		background: color-mix(in srgb, var(--story-accent) 24%, #111113);
		color: color-mix(in srgb, var(--story-accent) 74%, white) !important;
	}

	/* Better spacing between chapters */
	:global(.chapter-content) {
		margin-bottom: 1rem;
	}

	:global(.story-container a),
	:global(.story-container button) {
		font-weight: 500;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			color 0.2s ease;
	}

	/* Ensure all story content inherits the text color */
	:global(.story-content *) {
		color: inherit !important;
	}

	/* Typography styles that adapt to current design */
	:global(.story-container .prose h1) {
		font-weight: 700;
		margin: 0 0 2rem;
		padding-top: 0.4rem;
		line-height: 1.2;
		font-size: 2.35rem;
		text-wrap: pretty;
	}

	:global(.story-container .prose h2) {
		font-weight: 600;
		margin-bottom: 1rem;
		font-size: 2rem;
		text-wrap: pretty;
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

	:global(.story-container .prose .story-illustration-wrap) {
		position: relative;
		margin: 1rem 0 2.75rem;
		border: 1.5px solid var(--story-frame-border);
		border-radius: 0.75rem;
		overflow: hidden;
		padding: 0.5rem;
		background: var(--story-frame);
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.72),
			inset 2px 3px 4px 0 rgba(152, 146, 140, 0.16),
			0 12px 28px rgba(41, 37, 36, 0.09);
		line-height: 0;
	}

	:global(.story-container .prose .story-illustration) {
		display: block;
		width: 100%;
		height: auto;
		margin: 0 !important;
		border-radius: 0.5rem;
		background: transparent;
	}

	:global(.dark .story-container .prose .story-illustration-wrap) {
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.28),
			0 18px 36px rgba(0, 0, 0, 0.34),
			inset 2px 3px 4px rgba(255, 255, 255, 0.04);
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

	.story-end {
		position: relative;
		border-radius: 1rem;
		background:
			linear-gradient(180deg, var(--story-paper), rgba(255, 255, 255, 0)),
			repeating-linear-gradient(
				90deg,
				transparent 0 0.85rem,
				color-mix(in srgb, var(--story-accent) 18%, transparent) 0.85rem 0.9rem
			);
		box-shadow:
			inset 0 0 0 1px rgba(120, 113, 108, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	@media (min-width: 1180px) {
		.audio-follow-sidebar {
			position: fixed;
			top: 7rem;
			right: max(1.25rem, calc((100vw - 1080px) / 2));
			z-index: 20;
			display: block;
			width: 14rem;
			max-height: calc(100vh - 8rem);
			border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
			border-radius: 0.65rem;
			padding: 0.875rem;
			background: color-mix(in srgb, var(--story-paper) 92%, transparent);
			box-shadow:
				inset 0 1px 0 rgba(255, 255, 255, 0.5),
				0 12px 32px rgba(41, 37, 36, 0.1);
			backdrop-filter: blur(18px);
		}

		:global(.dark) .audio-follow-sidebar {
			border-color: rgba(255, 255, 255, 0.1);
			background: color-mix(in srgb, #1c1917 84%, transparent);
			box-shadow:
				inset 0 1px 0 rgba(255, 255, 255, 0.06),
				0 16px 38px rgba(0, 0, 0, 0.34);
		}

		.audio-follow-trail {
			max-height: calc(100vh - 12rem);
			overflow-y: auto;
			padding-right: 0.25rem;
			scrollbar-width: thin;
			scrollbar-color: color-mix(in srgb, var(--story-accent) 45%, transparent) transparent;
		}
	}

	@media (max-width: 640px) {
		.story-masthead {
			padding-bottom: 2rem;
		}

		:global(.story-container .prose h1) {
			font-size: 2.1rem;
		}

		:global(.story-container .prose p) {
			font-size: 1.2rem;
		}

		:global(.story-container .prose .story-illustration-wrap) {
			padding: 0.375rem;
		}

		.story-contents {
			margin-inline: -0.25rem;
			padding: 0.75rem;
		}
	}
</style>
