import { storyList } from '../../../content/stories/index.js';
import { error } from '@sveltejs/kit';

// Enable prerendering for all story pages
export const prerender = true;

// Generate all possible story routes for prerendering
export async function entries() {
	return storyList.map((story) => ({
		storyId: story.id
	}));
}

// Load story data for the page
export async function load({ params }) {
	const { storyId } = params;

	// Find the story
	const story = storyList.find((s) => s.id === storyId);

	if (!story) {
		throw error(404, `Story not found: ${storyId}`);
	}

	return {
		story,
		theme: {
			theme: 'white',
			fontType: 'serif'
		}
	};
}
