import { readdir, readFile } from 'fs/promises';
import path from 'path';

export const prerender = true;

const AUDIO_TESTS_ROOT = path.resolve('static/audio-tests');

export async function load() {
	const labels = await listDirectories(AUDIO_TESTS_ROOT);
	const shootouts = [];

	for (const label of labels) {
		const manifestPath = path.join(AUDIO_TESTS_ROOT, label, 'manifest.json');

		try {
			const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
			shootouts.push({
				label,
				generatedAt: manifest.generatedAt,
				model: manifest.model,
				outputFormat: manifest.output_format,
				voiceSettings: manifest.voice_settings,
				text: manifest.text,
				voices: (manifest.voices || [])
					.filter((voice) => voice.filename)
					.map((voice) => ({
						...voice,
						audioUrl: `/audio-tests/${label}/${voice.filename}`
					}))
			});
		} catch {
			// Ignore malformed or partial directories.
		}
	}

	shootouts.sort((a, b) => new Date(b.generatedAt || 0) - new Date(a.generatedAt || 0));

	return {
		shootouts
	};
}

async function listDirectories(root) {
	try {
		const entries = await readdir(root, { withFileTypes: true });
		return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
	} catch {
		return [];
	}
}
