import { stories } from '../../../content/stories/index.js';
import { error } from '@sveltejs/kit';

// Enable prerendering for all story pages
export const prerender = true;

// Generate all possible story routes for prerendering
export async function entries() {
	const entries = [];
	
	// Generate entries for all series and stories
	Object.keys(stories).forEach(seriesId => {
		const series = stories[seriesId];
		series.stories.forEach(story => {
			entries.push({
				seriesId: seriesId,
				storyId: story.id
			});
		});
	});
	
	return entries;
}

// Load story data for the page
export async function load({ params }) {
	const { seriesId, storyId } = params;

	// Find the series
	const series = stories[seriesId];
	if (!series) {
		throw error(404, `Series not found: ${seriesId}`);
	}

	// Find the story within the series
	const story = series.stories.find((s) => s.id === storyId);
	if (!story) {
		throw error(404, `Story not found: ${storyId} in series ${seriesId}`);
	}

	return {
		story,
		theme: {
			theme: 'white',
			fontType: 'serif'
		}
	};
}