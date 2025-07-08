// Import series configurations
import sillySquirrelsSeriesConfig from '../books/silly-squirrels/series.json';
import sillySquirrelsStoryConfig from '../books/silly-squirrels/the-great-acorn-hunt/story.json';
import professionalYoungerSiblingStoryConfig from '../books/the-professional-younger-sibling/story.json';

// Import all chapters for each story
import sillySquirrelsChapter1 from '../books/silly-squirrels/the-great-acorn-hunt/chapter-1.md?raw';
import sillySquirrelsChapter2 from '../books/silly-squirrels/the-great-acorn-hunt/chapter-2.md?raw';
import sillySquirrelsChapter3 from '../books/silly-squirrels/the-great-acorn-hunt/chapter-3.md?raw';
import sillySquirrelsChapter4 from '../books/silly-squirrels/the-great-acorn-hunt/chapter-4.md?raw';

import professionalYoungerSiblingChapter1 from '../books/the-professional-younger-sibling/chapter-1.md?raw';
import professionalYoungerSiblingChapter2 from '../books/the-professional-younger-sibling/chapter-2.md?raw';
import professionalYoungerSiblingChapter3 from '../books/the-professional-younger-sibling/chapter-3.md?raw';
import professionalYoungerSiblingChapter4 from '../books/the-professional-younger-sibling/chapter-4.md?raw';
import professionalYoungerSiblingChapter5 from '../books/the-professional-younger-sibling/chapter-5.md?raw';
import professionalYoungerSiblingChapter6 from '../books/the-professional-younger-sibling/chapter-6.md?raw';
import professionalYoungerSiblingChapter7 from '../books/the-professional-younger-sibling/chapter-7.md?raw';
import professionalYoungerSiblingChapter8 from '../books/the-professional-younger-sibling/chapter-8.md?raw';
import professionalYoungerSiblingChapter9 from '../books/the-professional-younger-sibling/chapter-9.md?raw';
import professionalYoungerSiblingChapter10 from '../books/the-professional-younger-sibling/chapter-10.md?raw';

// Map chapter files to their content
const sillySquirrelsChapters = {
	'chapter-1.md': sillySquirrelsChapter1,
	'chapter-2.md': sillySquirrelsChapter2,
	'chapter-3.md': sillySquirrelsChapter3,
	'chapter-4.md': sillySquirrelsChapter4
};

const professionalYoungerSiblingChapters = {
	'chapter-1.md': professionalYoungerSiblingChapter1,
	'chapter-2.md': professionalYoungerSiblingChapter2,
	'chapter-3.md': professionalYoungerSiblingChapter3,
	'chapter-4.md': professionalYoungerSiblingChapter4,
	'chapter-5.md': professionalYoungerSiblingChapter5,
	'chapter-6.md': professionalYoungerSiblingChapter6,
	'chapter-7.md': professionalYoungerSiblingChapter7,
	'chapter-8.md': professionalYoungerSiblingChapter8,
	'chapter-9.md': professionalYoungerSiblingChapter9,
	'chapter-10.md': professionalYoungerSiblingChapter10
};

// Complete story data with content
const stories = {
	'silly-squirrels': {
		...sillySquirrelsSeriesConfig,
		id: 'silly-squirrels',
		stories: sillySquirrelsSeriesConfig.stories.map((seriesStory) => ({
			...sillySquirrelsStoryConfig,
			id: seriesStory.id,
			seriesId: 'silly-squirrels',
			chapters: sillySquirrelsStoryConfig.chapters.map((chapter) => ({
				...chapter,
				content: sillySquirrelsChapters[chapter.file]
			}))
		}))
	},
	'the-professional-younger-sibling': {
		id: 'the-professional-younger-sibling',
		title: 'The Professional Younger Sibling',
		stories: [{
			...professionalYoungerSiblingStoryConfig,
			id: 'the-professional-younger-sibling',
			seriesId: 'the-professional-younger-sibling',
			chapters: professionalYoungerSiblingStoryConfig.chapters.map((chapter) => ({
				...chapter,
				content: professionalYoungerSiblingChapters[chapter.file]
			}))
		}]
	}
};

// Export individual stories and full collection
export { stories };
export const storyList = Object.values(stories);
export const getStory = (seriesId, storyId) => {
	const series = stories[seriesId];
	if (!series) return null;
	return series.stories.find((story) => story.id === storyId);
};
export const getChapter = (seriesId, storyId, chapterId) => {
	const story = getStory(seriesId, storyId);
	if (!story) return null;
	return story.chapters.find((ch) => ch.id === chapterId);
};
