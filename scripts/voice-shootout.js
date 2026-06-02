#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const elevenLabsKeyPath = join(os.homedir(), '.elevenlabs', 'api_key');
const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1';

const DEFAULT_CONFIG = {
	model_id: 'eleven_multilingual_v2',
	output_format: 'mp3_44100_192',
	voice_settings: {
		stability: 0.68,
		similarity_boost: 0.88,
		style: 0.08,
		use_speaker_boost: true
	}
};

const SHOOTOUT_VOICES = [
	{
		name: 'Amelia',
		voice_id: '3CDfug1pbx1pBSfHIkPR',
		notes: 'Warm, clear British narrative voice'
	},
	{
		name: 'Emma Taylor',
		voice_id: 'S9EGwlCtMF7VXtENq79v',
		notes: 'Gentle, softer British storyteller'
	},
	{
		name: 'Johnny Kid',
		voice_id: '8JVbfL6oEdmuxKn5DK2C',
		notes: 'Calm young British male narrator'
	},
	{
		name: 'Nathaniel',
		voice_id: 'eIYyt1GDV2CYz5Ccyam2',
		notes: 'Measured deeper British male narrator'
	}
];

const DEFAULT_SNIPPET = [
	'The Nutville Library had a problem with returns. Not ordinary returns. Not one-book-under-the-couch returns. An avalanche of overdue books.',
	'Miss Maple, the librarian, had sent reminder notes to the whole town. Some books were under beds. Some were in wagons. One cookbook had somehow been borrowed by the goose.'
].join('\n\n');

function getApiKey() {
	if (process.env.ELEVENLABS_API_KEY) {
		return process.env.ELEVENLABS_API_KEY;
	}

	if (existsSync(elevenLabsKeyPath)) {
		return readFileSync(elevenLabsKeyPath, 'utf8').trim();
	}

	return null;
}

function slugify(value) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function normalizeNarrationText(text) {
	return text
		.replace(/\r\n/g, '\n')
		.split(/\n{2,}/)
		.map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim())
		.filter(Boolean)
		.join('\n\n');
}

async function synthesizeSnippet({ voice, text, outputPath, config, apiKey }) {
	const response = await fetch(`${ELEVENLABS_API_BASE}/text-to-speech/${voice.voice_id}`, {
		method: 'POST',
		headers: {
			'xi-api-key': apiKey,
			'Content-Type': 'application/json',
			Accept: 'audio/mpeg'
		},
		body: JSON.stringify({
			text,
			model_id: config.model_id,
			voice_settings: config.voice_settings,
			output_format: config.output_format
		})
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`${response.status} ${errorText}`);
	}

	const audioBuffer = Buffer.from(await response.arrayBuffer());
	writeFileSync(outputPath, audioBuffer);
}

async function listAvailableVoices(apiKey) {
	const response = await fetch(`${ELEVENLABS_API_BASE}/voices`, {
		headers: {
			'xi-api-key': apiKey,
			Accept: 'application/json'
		}
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`${response.status} ${errorText}`);
	}

	const data = await response.json();
	return data.voices || [];
}

function loadVoicesFromFile(filePath) {
	const voices = JSON.parse(readFileSync(resolve(projectRoot, filePath), 'utf8'));

	if (!Array.isArray(voices)) {
		throw new Error('Voice file must contain an array of voices');
	}

	return voices.map((voice) => ({
		name: voice.name,
		voice_id: voice.voice_id || voice.voiceId,
		notes: voice.notes || voice.description || ''
	}));
}

function getSelectedVoices(argv) {
	let voices = argv.voiceFile ? loadVoicesFromFile(argv.voiceFile) : SHOOTOUT_VOICES;

	if (argv.voiceId) {
		voices = [
			{
				name: argv.voiceName || 'Custom Voice',
				voice_id: argv.voiceId,
				notes: argv.voiceNotes || 'Custom voice supplied by CLI'
			}
		];
	}

	const selectedVoiceNames = argv.voices
		? new Set(
				argv.voices
					.split(',')
					.map((value) => value.trim().toLowerCase())
					.filter(Boolean)
			)
		: null;

	return selectedVoiceNames
		? voices.filter((voice) => selectedVoiceNames.has(voice.name.toLowerCase()))
		: voices;
}

function getConfig(argv) {
	return {
		...DEFAULT_CONFIG,
		model_id: argv.model || DEFAULT_CONFIG.model_id
	};
}

async function main() {
	const argv = yargs(hideBin(process.argv))
		.option('file', {
			type: 'string',
			describe: 'Optional text file to use instead of the default snippet'
		})
		.option('label', {
			type: 'string',
			default: 'library-book-rocket-snippet',
			describe: 'Output folder label'
		})
		.option('model', {
			type: 'string',
			default: DEFAULT_CONFIG.model_id,
			describe: 'ElevenLabs model ID'
		})
		.option('outdir', {
			type: 'string',
			default: 'exports/audio-tests',
			describe: 'Base output directory'
		})
		.option('voices', {
			type: 'string',
			describe: 'Comma-separated subset of voices to render'
		})
		.option('voice-id', {
			type: 'string',
			describe: 'Render a single custom ElevenLabs voice ID'
		})
		.option('voice-name', {
			type: 'string',
			describe: 'Display name for --voice-id output'
		})
		.option('voice-notes', {
			type: 'string',
			describe: 'Notes for --voice-id manifest entry'
		})
		.option('voice-file', {
			type: 'string',
			describe: 'JSON array of voices with name, voice_id, and optional notes'
		})
		.option('list', {
			type: 'boolean',
			describe: 'List voices available to the configured ElevenLabs account'
		})
		.help()
		.parse();

	const apiKey = getApiKey();
	if (!apiKey) {
		console.error('❌ ElevenLabs API key is required');
		process.exit(1);
	}

	if (argv.list) {
		const voices = await listAvailableVoices(apiKey);
		for (const voice of voices) {
			const labels = [
				voice.category,
				voice.labels?.accent,
				voice.labels?.age,
				voice.labels?.gender,
				voice.labels?.use_case
			].filter(Boolean);
			console.log(`${voice.name}\t${voice.voice_id}\t${labels.join(', ')}`);
		}
		return;
	}

	const sourceText = argv.file
		? readFileSync(resolve(projectRoot, argv.file), 'utf8').trim()
		: DEFAULT_SNIPPET;
	const text = normalizeNarrationText(sourceText);

	const selectedVoices = getSelectedVoices(argv);

	if (selectedVoices.length === 0) {
		console.error('❌ No voices selected');
		process.exit(1);
	}

	const outputDir = resolve(projectRoot, argv.outdir, argv.label);
	mkdirSync(outputDir, { recursive: true });
	const config = getConfig(argv);

	console.log(`\nRendering shootout to ${outputDir}\n`);

	const results = [];
	for (const voice of selectedVoices) {
		const filename = `${slugify(voice.name)}.mp3`;
		const outputPath = join(outputDir, filename);
		console.log(`• ${voice.name}`);

		try {
			await synthesizeSnippet({
				voice,
				text,
				outputPath,
				config,
				apiKey
			});

			results.push({
				...voice,
				filename
			});
			console.log(`  saved ${filename}`);
		} catch (error) {
			results.push({
				...voice,
				error: error.message
			});
			console.log(`  failed ${error.message}`);
		}
	}

	writeFileSync(
		join(outputDir, 'manifest.json'),
		JSON.stringify(
			{
				label: argv.label,
				generatedAt: new Date().toISOString(),
				model: config.model_id,
				output_format: config.output_format,
				voice_settings: config.voice_settings,
				text,
				voices: results
			},
			null,
			2
		)
	);

	const staticOutputDir = resolve(projectRoot, 'static/audio-tests', argv.label);
	mkdirSync(staticOutputDir, { recursive: true });

	for (const result of results) {
		if (!result.filename) continue;
		copyFileSync(join(outputDir, result.filename), join(staticOutputDir, result.filename));
	}

	copyFileSync(join(outputDir, 'manifest.json'), join(staticOutputDir, 'manifest.json'));

	console.log('\nDone.');
}

main().catch((error) => {
	console.error('❌ Unhandled error:', error);
	process.exit(1);
});
