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
  <div class="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm {className}">
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
    
    <div class="flex items-center gap-3">
      <!-- Play/Pause Button -->
      <button 
        onclick={togglePlay}
        disabled={!isLoaded}
        class="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
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
      <div class="flex-1 flex items-center gap-2">
        <div
          class="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            class="h-full bg-blue-600 rounded-full transition-all duration-200"
            style="width: {duration ? (currentTime / duration) * 100 : 0}%"
          ></div>
        </div>
        
        <!-- Time Display -->
        <div class="flex items-center gap-1 text-sm text-gray-600 font-mono">
          <span class="text-gray-800">{formatTime(currentTime)}</span>
          <span class="text-gray-500">{formatTime(duration)}</span>
        </div>
      </div>
      
      <!-- Speed Control -->
      <div class="flex items-center">
        <button 
          onclick={() => setPlaybackRate(playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 0.75 : 1)}
          class="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border text-gray-700 transition-colors"
          aria-label="Playback speed"
        >
          {playbackRate}x
        </button>
      </div>
    </div>
    
    {#if title}
      <div class="mt-2 text-sm text-gray-600 font-medium">{title}</div>
    {/if}
    
    <!-- Chapter Navigation -->
    {#if story}
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <button
          onclick={goToPreviousChapter}
          disabled={currentChapter === 1}
          class="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Previous
        </button>
        <span class="text-sm text-gray-600">
          Chapter {currentChapter} of {story.chapters.length}
        </span>
        <button
          onclick={goToNextChapter}
          disabled={currentChapter === story.chapters.length}
          class="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
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