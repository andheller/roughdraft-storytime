// Import all story configurations
import sillySquirrelsConfig from './silly-squirrels/story.json';

// Import all chapters for each story
import sillySquirrelsChapter1 from './silly-squirrels/chapter-1.md?raw';
import sillySquirrelsChapter2 from './silly-squirrels/chapter-2.md?raw';
import sillySquirrelsChapter3 from './silly-squirrels/chapter-3.md?raw';
import sillySquirrelsChapter4 from './silly-squirrels/chapter-4.md?raw';

// Map chapter files to their content
const sillySquirrelsChapters = {
	'chapter-1.md': sillySquirrelsChapter1,
	'chapter-2.md': sillySquirrelsChapter2,
	'chapter-3.md': sillySquirrelsChapter3,
	'chapter-4.md': sillySquirrelsChapter4
};

// Complete story data with content
const stories = {
	'silly-squirrels': {
		...sillySquirrelsConfig,
		id: 'silly-squirrels',
		chapters: sillySquirrelsConfig.chapters.map((chapter) => ({
			...chapter,
			content: sillySquirrelsChapters[chapter.file]
		}))
	}
};

// Export individual stories and full collection
export { stories };
export const storyList = Object.values(stories);
export const getStory = (id) => stories[id];
export const getChapter = (storyId, chapterId) => {
	const story = stories[storyId];
	if (!story) return null;
	return story.chapters.find((ch) => ch.id === chapterId);
};
