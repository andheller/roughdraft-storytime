export const prerender = true;

export async function load() {
	const files = import.meta.glob('/story-time/roughdrafts/*.md', {
		query: '?raw',
		eager: true
	});

	const drafts = Object.entries(files).map(([path, mod]) => {
		const raw = mod.default;
		const slug = path.split('/').pop().replace('.md', '');
		const { frontmatter, body } = parseFrontmatter(raw);
		return { slug, ...frontmatter, body };
	});

	// Sort alphabetically by title
	drafts.sort((a, b) => a.title.localeCompare(b.title));

	return { drafts };
}

function parseFrontmatter(raw) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) return { frontmatter: {}, body: raw };

	const frontmatter = {};
	for (const line of match[1].split('\n')) {
		const idx = line.indexOf(':');
		if (idx === -1) continue;
		const key = line.slice(0, idx).trim();
		let val = line.slice(idx + 1).trim();
		// Parse simple YAML arrays like [a, b, c]
		if (val.startsWith('[') && val.endsWith(']')) {
			val = val
				.slice(1, -1)
				.split(',')
				.map((s) => s.trim());
		}
		frontmatter[key] = val;
	}

	return { frontmatter, body: match[2].trim() };
}
