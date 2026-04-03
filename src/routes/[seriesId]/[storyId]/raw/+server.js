import { error } from '@sveltejs/kit';
import { getAvailableStories, loadStory, storyExists } from '$lib/content-loader.js';

export const prerender = true;

export async function entries() {
	const stories = await getAvailableStories();

	return stories.map((story) => ({
		seriesId: story.seriesId,
		storyId: story.storyId
	}));
}

function formatStoryAsMarkdown(story) {
	const quote = (value) => `"${String(value ?? '').replaceAll('"', '\\"')}"`;

	const frontmatter = [
		'---',
		`title: ${quote(story.title)}`,
		`series: ${quote(story.seriesTitle)}`,
		`storyId: ${quote(story.storyId)}`,
		`seriesId: ${quote(story.seriesId)}`,
		`author: ${quote(story.author)}`,
		`genre: ${quote(story.genre)}`,
		`ageRange: ${quote(story.ageRange)}`,
		`chapterCount: ${story.chapters.length}`,
		'---',
		''
	].join('\n');

	const body = [
		`# ${story.title}`,
		'',
		story.description,
		'',
		...story.chapters.flatMap((chapter) => [chapter.markdown, ''])
	].join('\n');

	return `${frontmatter}${body}`.trimEnd() + '\n';
}

export async function GET({ params }) {
	const { seriesId, storyId } = params;

	if (!storyExists(seriesId, storyId)) {
		throw error(404, `Story not found: ${seriesId}/${storyId}`);
	}

	const story = await loadStory(seriesId, storyId);

	return new Response(formatStoryAsMarkdown(story), {
		headers: {
			'content-type': 'text/markdown; charset=utf-8',
			'cache-control': 'public, max-age=0, must-revalidate'
		}
	});
}
