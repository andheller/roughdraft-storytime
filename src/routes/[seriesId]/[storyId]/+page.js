import { getAvailableStories, storyExists } from '../../../lib/content-loader.js';
import { error } from '@sveltejs/kit';

// Enable prerendering for all story pages
export const prerender = true;

// Generate all possible story routes for prerendering
export async function entries() {
	const stories = await getAvailableStories();
	
	return stories.map(story => ({
		seriesId: story.seriesId,
		storyId: story.storyId
	}));
}

// Load story data for the page
export async function load({ params }) {
	const { seriesId, storyId } = params;

	// Check if story exists
	if (!storyExists(seriesId, storyId)) {
		throw error(404, `Story not found: ${seriesId}/${storyId}`);
	}

	return {
		seriesId,
		storyId,
		theme: {
			theme: 'white',
			fontType: 'serif'
		}
	};
}