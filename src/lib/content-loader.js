/**
 * Dynamic content loader using Vite's import.meta.glob
 * This replaces the manual imports in /src/content/stories/index.js
 */

// Dynamically import all story metadata
const storyMetadata = import.meta.glob('/src/content/books/*/*/story.json');
const seriesMetadata = import.meta.glob('/src/content/books/*/series.json');

// Dynamically import all chapter markdown files
const chapterFiles = import.meta.glob('/src/content/books/*/*/*.md', { 
  query: '?raw',
  import: 'default'
});

// Note: Audio manifests are loaded dynamically via fetch since they're in static/

/**
 * Load all available series
 */
export async function loadAllSeries() {
  const series = {};
  
  for (const [path, loader] of Object.entries(seriesMetadata)) {
    const seriesId = path.split('/')[4]; // Extract series ID from path
    try {
      const data = await loader();
      series[seriesId] = data.default || data;
    } catch (error) {
      console.error(`Failed to load series ${seriesId}:`, error);
    }
  }
  
  return series;
}

/**
 * Load a specific story's metadata and chapters
 */
export async function loadStory(seriesId, storyId) {
  const storyPath = `/src/content/books/${seriesId}/${storyId}/story.json`;
  const storyLoader = storyMetadata[storyPath];
  
  if (!storyLoader) {
    throw new Error(`Story not found: ${seriesId}/${storyId}`);
  }
  
  try {
    // Load story metadata
    const storyData = await storyLoader();
    const story = storyData.default || storyData;
    
    // Load all chapters for this story
    const chapters = await loadChapters(seriesId, storyId, story.chapters);
    
    // Load audio information if available
    const audioInfo = await loadAudioInfo(seriesId, storyId);
    
    return {
      ...story,
      chapters,
      audio: audioInfo
    };
  } catch (error) {
    console.error(`Failed to load story ${seriesId}/${storyId}:`, error);
    throw error;
  }
}

/**
 * Load all chapters for a specific story
 */
export async function loadChapters(seriesId, storyId, chapterMetadata = []) {
  const chapters = [];
  const chapterPattern = `/src/content/books/${seriesId}/${storyId}/chapter-`;
  
  // Find all chapter files for this story
  const chapterPaths = Object.keys(chapterFiles)
    .filter(path => path.startsWith(chapterPattern))
    .sort(); // Ensure chapters are in order
  
  for (const path of chapterPaths) {
    try {
      const content = await chapterFiles[path]();
      const chapterNum = parseInt(path.match(/chapter-(\d+)\.md$/)?.[1] || '0');
      
      // Find matching metadata from story.json
      const metadata = chapterMetadata.find(meta => meta.id === chapterNum) || {};
      
      chapters.push({
        id: chapterNum,
        number: chapterNum,
        title: metadata.title || `Chapter ${chapterNum}`,
        content,
        path
      });
    } catch (error) {
      console.error(`Failed to load chapter ${path}:`, error);
    }
  }
  
  return chapters;
}

/**
 * Load a single chapter
 */
export async function loadChapter(seriesId, storyId, chapterNum) {
  const chapterPath = `/src/content/books/${seriesId}/${storyId}/chapter-${chapterNum}.md`;
  const loader = chapterFiles[chapterPath];
  
  if (!loader) {
    throw new Error(`Chapter not found: ${seriesId}/${storyId}/chapter-${chapterNum}`);
  }
  
  try {
    const content = await loader();
    return {
      id: `chapter-${chapterNum}`,
      number: chapterNum,
      content
    };
  } catch (error) {
    console.error(`Failed to load chapter ${chapterPath}:`, error);
    throw error;
  }
}

/**
 * Get available stories (for navigation, search, etc.)
 */
export async function getAvailableStories() {
  const stories = [];
  
  for (const [path, loader] of Object.entries(storyMetadata)) {
    const matches = path.match(/\/src\/content\/books\/([^\/]+)\/([^\/]+)\/story\.json$/);
    if (matches) {
      const [, seriesId, storyId] = matches;
      try {
        const data = await loader();
        const story = data.default || data;
        stories.push({
          seriesId,
          storyId,
          ...story
        });
      } catch (error) {
        console.error(`Failed to load story metadata ${path}:`, error);
      }
    }
  }
  
  return stories;
}

/**
 * Check if a story exists
 */
export function storyExists(seriesId, storyId) {
  const storyPath = `/src/content/books/${seriesId}/${storyId}/story.json`;
  return storyPath in storyMetadata;
}

/**
 * Load audio information for a story
 */
export async function loadAudioInfo(seriesId, storyId) {
  const manifestUrl = `/audio/${seriesId}/${storyId}/audio-manifest.json`;
  
  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) {
      return null; // No audio available
    }
    
    const manifest = await response.json();
    
    return {
      available: true,
      voice: manifest.voice,
      model: manifest.model,
      generatedAt: manifest.generatedAt,
      chapters: manifest.chapters.map(ch => ({
        id: ch.id,
        audioUrl: `/audio/${seriesId}/${storyId}/${ch.filename}`
      }))
    };
  } catch (error) {
    console.error(`Failed to load audio manifest for ${seriesId}/${storyId}:`, error);
    return null;
  }
}

/**
 * Check if audio is available for a story
 */
export async function hasAudio(seriesId, storyId) {
  try {
    const response = await fetch(`/audio/${seriesId}/${storyId}/audio-manifest.json`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get audio URL for a specific chapter
 */
export function getChapterAudioUrl(seriesId, storyId, chapterId) {
  return `/audio/${seriesId}/${storyId}/chapter-${chapterId}.mp3`;
}