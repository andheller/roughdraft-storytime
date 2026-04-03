import { contentIndex, bookshelfBooks, storyModules, storySummaries } from '$lib/generated/content-index.js';

const storySummaryLookup = new Map(
	storySummaries.map((story) => [`${story.seriesId}/${story.storyId}`, story])
);
const seriesLookup = new Map(contentIndex.series.map((series) => [series.id, series]));
const storyCache = new Map();

function cloneStory(story) {
	return {
		...story,
		chapters: story.chapters.map((chapter) => ({
			...chapter,
			content: chapter.markdown,
			narration: chapter.narration ? { ...chapter.narration } : null
		})),
		narration: {
			...story.narration,
			chapters: story.narration.chapters.map((chapter) => ({ ...chapter }))
		},
		audio: story.audio
			? {
					...story.audio,
					chapters: story.audio.chapters.map((chapter) => ({ ...chapter }))
				}
			: null,
		assets: Array.isArray(story.assets) ? story.assets.map((asset) => ({ ...asset })) : []
	};
}

async function getStoryRecord(seriesId, storyId) {
	const storyKey = `${seriesId}/${storyId}`;
	if (!storyCache.has(storyKey)) {
		const loader = storyModules[storyKey];

		if (!loader) {
			return null;
		}

		storyCache.set(storyKey, loader().then((module) => module.story));
	}

	return storyCache.get(storyKey);
}

export async function loadAllSeries() {
	return Object.fromEntries(
		contentIndex.series.map((series) => [
			series.id,
			{
				...series,
				stories: series.stories.map((story) => ({ ...story }))
			}
		])
	);
}

export async function loadStory(seriesId, storyId) {
	const story = await getStoryRecord(seriesId, storyId);

	if (!story) {
		throw new Error(`Story not found: ${seriesId}/${storyId}`);
	}

	return {
		...cloneStory(story)
	};
}

export async function loadChapters(seriesId, storyId) {
	const story = await getStoryRecord(seriesId, storyId);

	if (!story) {
		throw new Error(`Story not found: ${seriesId}/${storyId}`);
	}

	return story.chapters.map((chapter) => ({
		...chapter,
		content: chapter.markdown,
		narration: chapter.narration ? { ...chapter.narration } : null
	}));
}

export async function loadChapter(seriesId, storyId, chapterId) {
	const story = await getStoryRecord(seriesId, storyId);

	if (!story) {
		throw new Error(`Story not found: ${seriesId}/${storyId}`);
	}

	const chapter = story.chapters.find(
		(entry) => entry.id === chapterId || entry.id === Number(chapterId) || entry.number === Number(chapterId)
	);

	if (!chapter) {
		throw new Error(`Chapter not found: ${seriesId}/${storyId}/${chapterId}`);
	}

	return {
		...chapter,
		content: chapter.markdown,
		narration: chapter.narration ? { ...chapter.narration } : null
	};
}

export async function getAvailableStories() {
	return storySummaries.map((story) => ({
		seriesId: story.seriesId,
		storyId: story.storyId,
		title: story.title,
		description: story.description,
		author: story.author,
		genre: story.genre,
		ageRange: story.ageRange,
		tags: [...story.tags],
		coverImage: story.coverImage,
		chapterCount: story.chapterCount,
		audio: story.audio,
		hasAudio: story.hasAudio
	}));
}

export function storyExists(seriesId, storyId) {
	return storySummaryLookup.has(`${seriesId}/${storyId}`);
}

export function getSeries(seriesId) {
	return seriesLookup.get(seriesId) || null;
}

export function getBookshelfBooks() {
	return bookshelfBooks.map((book) => ({ ...book }));
}

export async function loadAudioInfo(seriesId, storyId) {
	const story = storySummaryLookup.get(`${seriesId}/${storyId}`);
	return story?.audio || null;
}

export async function hasAudio(seriesId, storyId) {
	try {
		return Boolean(await loadAudioInfo(seriesId, storyId));
	} catch {
		return false;
	}
}

export function getChapterAudioUrl(seriesId, storyId, chapterId) {
	return `/audio/${seriesId}/${storyId}/chapter-${chapterId}.mp3`;
}
