import { marked } from 'marked';

export function stripAudioDirectives(content) {
	return content.replace(/<tts\s+[^>]*\/?>/gi, '');
}

export function parseMarkdown(content) {
	return marked(stripAudioDirectives(content));
}

export async function loadMarkdown(path) {
	const response = await fetch(path);
	const content = await response.text();
	return parseMarkdown(content);
}
