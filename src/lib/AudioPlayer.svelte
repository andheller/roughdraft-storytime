<script>
import { onMount } from 'svelte';

// Props
const { 
  audioUrl = $bindable(), 
  title = '', 
  autoplay = false,
  onEnded = () => {},
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

// Audio control functions
function togglePlay() {
  if (!audioElement || !isLoaded) return;
  
  if (isPlaying) {
    audioElement.pause();
  } else {
    audioElement.play();
  }
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
function handleLoadedMetadata() {
  isLoaded = true;
  duration = audioElement.duration;
}

function handleTimeUpdate() {
  currentTime = audioElement.currentTime;
}

function handlePlay() {
  isPlaying = true;
}

function handlePause() {
  isPlaying = false;
}

function handleEnded() {
  isPlaying = false;
  currentTime = 0;
  onEnded();
}

// Auto-play when URL changes
$effect(() => {
  if (audioUrl && autoplay && isLoaded) {
    audioElement?.play();
  }
});
</script>

{#if audioUrl}
  <div class="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200 dark:border-white/10 rounded-2xl p-4 shadow-lg {className}">
    <audio
      bind:this={audioElement}
      src={audioUrl}
      preload="metadata"
      onloadedmetadata={handleLoadedMetadata}
      ontimeupdate={handleTimeUpdate}
      onplay={handlePlay}
      onpause={handlePause}
      onended={handleEnded}
    ></audio>
    
    <div class="flex items-center gap-4">
      <!-- Play/Pause Button -->
      <button 
        onclick={togglePlay}
        disabled={!isLoaded}
        class="flex items-center justify-center w-12 h-12 shadow-md hover:scale-105 active:scale-95 disabled:bg-stone-300 dark:disabled:bg-stone-800 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200"
        style="background-color: var(--accent-color)"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {#if isPlaying}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        {:else}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        {/if}
      </button>
      
      <!-- Progress Bar -->
      <div class="flex-1 flex flex-col gap-1.5">
        <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
           <span>{formatTime(currentTime)}</span>
           <span>{formatTime(duration)}</span>
        </div>
        <div
          class="flex-1 h-3 bg-stone-200 dark:bg-stone-800 rounded-full cursor-pointer overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400"
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
            class="h-full transition-all duration-200 ease-out"
            style="width: {duration ? (currentTime / duration) * 100 : 0}%; background-color: var(--accent-color)"
          ></div>
        </div>
      </div>
      
      <!-- Speed Control -->
      <div class="flex items-center">
        <button 
          onclick={() => setPlaybackRate(playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 0.75 : 1)}
          class="h-10 px-3 text-sm font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl border border-stone-200 dark:border-white/5 text-stone-600 dark:text-stone-300 transition-colors"
          aria-label="Playback speed"
        >
          {playbackRate}x
        </button>
      </div>
    </div>
    
    {#if title}
      <div class="mt-3 text-sm text-stone-600 dark:text-stone-400 font-medium px-1">{title}</div>
    {/if}
    
    <!-- Chapter Navigation -->
    {#if story}
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-stone-200 dark:border-white/10">
        <button
          onclick={goToPreviousChapter}
          disabled={currentChapter === 1}
          class="flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-all text-sm font-semibold text-stone-600 dark:text-stone-300"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Prev
        </button>
        <span class="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
          {currentChapter} / {story.chapters.length}
        </span>
        <button
          onclick={goToNextChapter}
          disabled={currentChapter === story.chapters.length}
          class="flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-all text-sm font-semibold text-stone-600 dark:text-stone-300"
        >
          Next
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    {/if}
  </div>
{/if}