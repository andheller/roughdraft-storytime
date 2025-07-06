import { marked } from 'marked';

export function parseMarkdown(content) {
	return marked(content);
}

export async function loadMarkdown(path) {
	const response = await fetch(path);
	const content = await response.text();
	return parseMarkdown(content);
}
