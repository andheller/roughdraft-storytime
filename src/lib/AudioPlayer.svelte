<script>
	// Props
	const {
		audioUrl = $bindable(),
		title = '',
		autoplay = false,
		onEnded = () => {},
		onPlayingChange = () => {},
		className = '',
		currentChapter = 1,
		story = null,
		goToNextChapter = () => {},
		goToPreviousChapter = () => {}
	} = $props();

	// State
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let isLoaded = $state(false);
	let audioElement = $state(null);
	let playbackRate = $state(1);
	let shouldContinuePlayback = $state(false);
	let isAdvancingWithPlayback = $state(false);
	let previousAudioUrl = $state(audioUrl);

	async function playAudio() {
		if (!audioElement) return;

		audioElement.playbackRate = playbackRate;

		try {
			await audioElement.play();
		} catch {
			isPlaying = false;
			shouldContinuePlayback = false;
			isAdvancingWithPlayback = false;
			onPlayingChange(false);
		}
	}

	// Audio control functions
	function togglePlay() {
		if (!audioElement || !isLoaded) return;

		if (isPlaying) {
			shouldContinuePlayback = false;
			isAdvancingWithPlayback = false;
			audioElement.pause();
		} else {
			shouldContinuePlayback = true;
			playAudio();
		}
	}

	function prepareForChapterChange() {
		if (isPlaying || shouldContinuePlayback) {
			shouldContinuePlayback = true;
			isAdvancingWithPlayback = true;
		}
	}

	function handleNextChapterClick() {
		prepareForChapterChange();
		goToNextChapter();
	}

	function handlePreviousChapterClick() {
		prepareForChapterChange();
		goToPreviousChapter();
	}

	function seek(event) {
		if (!audioElement || !isLoaded) return;

		const rect = event.currentTarget.getBoundingClientRect();
		const percentage = (event.clientX - rect.left) / rect.width;
		audioElement.currentTime = percentage * duration;
	}

	function handleSliderKeydown(event) {
		if (!audioElement || !isLoaded) return;

		const step = duration * 0.05; // 5% of duration
		if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
			audioElement.currentTime = Math.min(currentTime + step, duration);
			event.preventDefault();
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
			audioElement.currentTime = Math.max(currentTime - step, 0);
			event.preventDefault();
		}
	}

	function setPlaybackRate(rate) {
		playbackRate = rate;
		if (audioElement) {
			audioElement.playbackRate = rate;
		}
	}

	function formatTime(seconds) {
		if (isNaN(seconds)) return '0:00';

		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	// Audio event handlers
	function resetAudioState() {
		isLoaded = false;
		isPlaying = false;
		currentTime = 0;
		duration = 0;
	}

	async function handleLoadedMetadata() {
		isLoaded = true;
		duration = audioElement.duration;
		audioElement.playbackRate = playbackRate;

		if (autoplay || shouldContinuePlayback || isAdvancingWithPlayback) {
			await playAudio();
		}

		isAdvancingWithPlayback = false;
	}

	function handleTimeUpdate() {
		currentTime = audioElement.currentTime;
	}

	function handlePlay() {
		isPlaying = true;
		shouldContinuePlayback = true;
		onPlayingChange(true);
	}

	function handlePause() {
		isPlaying = false;
		if (!audioElement?.ended && !isAdvancingWithPlayback) {
			shouldContinuePlayback = false;
			onPlayingChange(false);
		}
	}

	function handleEnded() {
		isPlaying = false;
		currentTime = 0;
		if (story && currentChapter >= story.chapters.length) {
			shouldContinuePlayback = false;
			isAdvancingWithPlayback = false;
			onPlayingChange(false);
		} else {
			shouldContinuePlayback = true;
			isAdvancingWithPlayback = true;
			onPlayingChange(true);
		}
		onEnded();
	}

	// Reset loading state when chapter audio changes; metadata will trigger playback if needed.
	$effect(() => {
		if (audioUrl !== previousAudioUrl) {
			const wasContinuing = isPlaying || shouldContinuePlayback || isAdvancingWithPlayback;
			previousAudioUrl = audioUrl;
			resetAudioState();
			if (wasContinuing) {
				shouldContinuePlayback = true;
				isAdvancingWithPlayback = true;
			}
		}
	});
</script>

{#if audioUrl}
	<div
		class="audio-player no-lift rounded-lg border border-stone-200/90 bg-white/72 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-stone-900/72 {className}"
	>
		<audio
			bind:this={audioElement}
			src={audioUrl}
			preload="metadata"
			onloadstart={resetAudioState}
			onloadedmetadata={handleLoadedMetadata}
			ontimeupdate={handleTimeUpdate}
			onplay={handlePlay}
			onpause={handlePause}
			onended={handleEnded}
		></audio>

		<div class="flex items-center gap-4">
			<!-- Play/Pause Button -->
			<button
				type="button"
				onclick={togglePlay}
				disabled={!isLoaded}
				class="audio-play-button flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
				aria-label={isPlaying ? 'Pause' : 'Play'}
			>
				{#if isPlaying}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
					</svg>
				{:else}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path d="M8 5v14l11-7z" />
					</svg>
				{/if}
			</button>

			<!-- Progress Bar -->
			<div class="flex min-w-0 flex-1 flex-col gap-1.5">
				<div
					class="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase dark:text-stone-500"
				>
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
				<div
					class="group h-3 flex-1 cursor-pointer overflow-hidden rounded-full bg-stone-200 focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:outline-none dark:bg-stone-800"
					onclick={seek}
					onkeydown={handleSliderKeydown}
					role="slider"
					tabindex="0"
					aria-label="Audio progress"
					aria-valuemin="0"
					aria-valuemax={duration}
					aria-valuenow={currentTime}
				>
					<div
						class="audio-progress-fill h-full transition-all duration-200 ease-out"
						style="width: {duration ? (currentTime / duration) * 100 : 0}%"
					></div>
				</div>
			</div>

			<!-- Speed Control -->
			<div class="flex items-center">
				<button
					type="button"
					onclick={() =>
						setPlaybackRate(playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 0.75 : 1)}
					class="h-10 min-w-12 rounded-lg border border-stone-200 bg-stone-100 px-3 text-sm font-bold text-stone-600 transition-colors hover:bg-stone-200 dark:border-white/5 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
					aria-label="Playback speed"
				>
					{playbackRate}x
				</button>
			</div>
		</div>

		{#if title}
			<div class="mt-3 px-1 text-sm font-medium text-stone-600 dark:text-stone-400">{title}</div>
		{/if}

		<!-- Chapter Navigation -->
		{#if story}
			<div
				class="mt-4 flex items-center justify-between border-t border-stone-200 pt-4 dark:border-white/10"
			>
				<button
					type="button"
					onclick={handlePreviousChapterClick}
					disabled={currentChapter === 1}
					class="flex items-center gap-2 rounded-lg bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-600 transition-all hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Prev
				</button>
				<span class="text-xs font-bold text-stone-400 uppercase dark:text-stone-500">
					{currentChapter} / {story.chapters.length}
				</span>
				<button
					type="button"
					onclick={handleNextChapterClick}
					disabled={currentChapter === story.chapters.length}
					class="flex items-center gap-2 rounded-lg bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-600 transition-all hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
				>
					Next
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.audio-player {
		--audio-accent: var(--story-accent, #2688dd);
	}

	.audio-play-button {
		background: var(--audio-accent);
		color: white;
	}

	.audio-play-button:disabled {
		background: #e7e5e4;
		color: #78716c;
		opacity: 0.78;
		transform: none;
	}

	:global(.dark) .audio-play-button:disabled {
		background: #292524;
		color: #a8a29e;
	}

	.audio-progress-fill {
		background: var(--audio-accent);
	}
</style>
