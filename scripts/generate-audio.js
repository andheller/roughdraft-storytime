#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const elevenLabsKeyPath = join(process.env.HOME || '', '.elevenlabs', 'api_key');

// ElevenLabs API configuration
const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1';

// Default configuration
const DEFAULT_CONFIG = {
	voice: 'Rachel',
	voice_id: 'EXAVITQu4vr4xnSDxMaL', // Rachel voice ID
	model_id: 'eleven_multilingual_v2',
	voice_settings: {
		stability: 0.42,
		similarity_boost: 0.8,
		style: 0.28,
		use_speaker_boost: true
	},
	output_format: 'mp3_44100_192'
};

// Voice ID mappings
const VOICE_IDS = {
	Rachel: 'EXAVITQu4vr4xnSDxMaL',
	Josh: 'TxGEqnHWrfWFTfGW9XjX',
	Bella: 'EXAVITQu4vr4xnSDxMaL',
	Antoni: 'ErXwobaYiN019PkySvjV'
};

function getApiKey() {
	if (process.env.ELEVENLABS_API_KEY) {
		return process.env.ELEVENLABS_API_KEY;
	}

	if (existsSync(elevenLabsKeyPath)) {
		return readFileSync(elevenLabsKeyPath, 'utf8').trim();
	}

	return null;
}

// Load audio configuration
function loadConfig(overrides = {}) {
	const configPath = join(projectRoot, 'audio.config.json');
	let config = { ...DEFAULT_CONFIG };

	if (existsSync(configPath)) {
		config = {
			...config,
			...JSON.parse(readFileSync(configPath, 'utf8'))
		};
	}

	config = {
		...config,
		...overrides
	};

	config.voice = config.voice || DEFAULT_CONFIG.voice;
	config.model_id = config.model_id || config.model || DEFAULT_CONFIG.model_id;
	config.voice_id = VOICE_IDS[config.voice] || config.voice_id || DEFAULT_CONFIG.voice_id;

	return config;
}

// Make API request to ElevenLabs
async function makeElevenLabsRequest(endpoint, options = {}) {
	const url = `${ELEVENLABS_API_BASE}${endpoint}`;
	const apiKey = getApiKey();

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'audio/mpeg',
			'Content-Type': 'application/json',
			'xi-api-key': apiKey,
			...options.headers
		},
		body: JSON.stringify(options.body)
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`ElevenLabs API error: ${response.status} ${error}`);
	}

	return response;
}

// Get all available stories
async function getAvailableStories() {
	const booksDir = join(projectRoot, 'src/content/books');
	const stories = [];

	try {
		const { readdirSync, statSync } = await import('fs');
		const seriesIds = readdirSync(booksDir).filter((item) =>
			statSync(join(booksDir, item)).isDirectory()
		);

		for (const seriesId of seriesIds) {
			const seriesPath = join(booksDir, seriesId);
			const items = readdirSync(seriesPath).filter((item) =>
				statSync(join(seriesPath, item)).isDirectory()
			);

			for (const item of items) {
				const storyPath = join(seriesPath, item, 'story.json');
				if (existsSync(storyPath)) {
					stories.push({ seriesId, storyId: item });
				}
			}
		}
	} catch (error) {
		console.error('Error reading stories:', error);
	}

	return stories;
}

// Load story content
function loadStoryContent(seriesId, storyId) {
	const storyPath = join(projectRoot, 'src/content/books', seriesId, storyId);
	const storyJsonPath = join(storyPath, 'story.json');

	if (!existsSync(storyJsonPath)) {
		throw new Error(`Story not found: ${seriesId}/${storyId}`);
	}

	const storyData = JSON.parse(readFileSync(storyJsonPath, 'utf8'));
	const chapters = [];

	// Load chapters
	for (const chapterMeta of storyData.chapters) {
		const chapterPath = join(storyPath, chapterMeta.file);
		if (existsSync(chapterPath)) {
			const content = readFileSync(chapterPath, 'utf8');
			const narrationOverridePath = join(storyPath, 'narration', `chapter-${chapterMeta.id}.txt`);
			chapters.push({
				...chapterMeta,
				content: existsSync(narrationOverridePath)
					? readFileSync(narrationOverridePath, 'utf8').trim()
					: cleanMarkdownForAudio(content)
			});
		}
	}

	return {
		...storyData,
		chapters,
		seriesId,
		storyId
	};
}

// Clean markdown content for audio generation
function cleanMarkdownForAudio(content) {
	return (
		content
			// Remove markdown headers
			.replace(/^#+\s*/gm, '')
			// Convert list items to spoken lines
			.replace(/^\s*-\s+/gm, '')
			// Remove markdown emphasis
			.replace(/\*\*(.*?)\*\*/g, '$1')
			.replace(/\*(.*?)\*/g, '$1')
			// Remove markdown links
			.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
			// Clean up extra whitespace
			.replace(/\n\s*\n/g, '\n\n')
			.trim()
	);
}

// Generate audio for a single chapter
async function generateChapterAudio(chapter, config, outputPath) {
	try {
		console.log(`Generating audio for Chapter ${chapter.id}: ${chapter.title}`);

		const response = await makeElevenLabsRequest(`/text-to-speech/${config.voice_id}`, {
			body: {
				text: chapter.content,
				model_id: config.model_id,
				voice_settings: config.voice_settings,
				output_format: config.output_format
			}
		});

		// Create output directory if it doesn't exist
		mkdirSync(dirname(outputPath), { recursive: true });

		// Write audio file
		const audioBuffer = Buffer.from(await response.arrayBuffer());
		writeFileSync(outputPath, audioBuffer);

		console.log(`✓ Generated: ${outputPath}`);
		return true;
	} catch (error) {
		console.error(`✗ Failed to generate audio for Chapter ${chapter.id}:`, error.message);
		return false;
	}
}

// Generate audio for entire story
async function generateStoryAudio(seriesId, storyId, options = {}) {
	const config = loadConfig({
		voice: options.voice
	});
	const story = loadStoryContent(seriesId, storyId);

	console.log(`\nGenerating audio for "${story.title}" (${seriesId}/${storyId})`);
	console.log(`Voice: ${config.voice}`);
	console.log(`Chapters: ${story.chapters.length}\n`);

	const audioDir = join(projectRoot, 'static/audio', seriesId, storyId);
	const results = [];
	mkdirSync(audioDir, { recursive: true });

	// Filter chapters if specific chapter requested
	const chaptersToGenerate = options.chapter
		? story.chapters.filter((ch) => ch.id === parseInt(options.chapter))
		: story.chapters;

	if (chaptersToGenerate.length === 0) {
		console.error(`Chapter ${options.chapter} not found in story ${seriesId}/${storyId}`);
		return;
	}

	// Generate audio for each chapter
	for (const chapter of chaptersToGenerate) {
		const outputPath = join(audioDir, `chapter-${chapter.id}.mp3`);

		// Skip if file exists and not forcing regeneration
		if (existsSync(outputPath) && !options.force) {
			console.log(`⏭ Skipping existing: chapter-${chapter.id}.mp3`);
			continue;
		}

		const success = await generateChapterAudio(chapter, config, outputPath);
		results.push({ chapter: chapter.id, success });

		// Add delay to avoid rate limiting
		if (chaptersToGenerate.length > 1) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	// Generate manifest
	const successfulResults = results.filter((r) => r.success);
	const successful = successfulResults.length;

	if (successful === 0) {
		console.log('\n⚠️ No audio files were generated, so no manifest was written.');
		return;
	}

	const manifest = {
		seriesId,
		storyId,
		title: story.title,
		generatedAt: new Date().toISOString(),
		voice: config.voice || 'Rachel',
		voice_id: config.voice_id,
		model: config.model_id,
		chapters: successfulResults.map((r) => ({
			id: r.chapter,
			filename: `chapter-${r.chapter}.mp3`
		}))
	};

	writeFileSync(join(audioDir, 'audio-manifest.json'), JSON.stringify(manifest, null, 2));

	console.log(`\n✅ Generated ${successful}/${results.length} audio files`);

	if (successful > 0) {
		console.log(`📁 Audio files saved to: static/audio/${seriesId}/${storyId}/`);
	}
}

// Check which stories have audio available
async function checkAudioAvailability() {
	const stories = await getAvailableStories();
	const audioDir = join(projectRoot, 'static/audio');

	console.log('\n📊 Audio Availability Status:\n');

	for (const { seriesId, storyId } of stories) {
		const storyAudioDir = join(audioDir, seriesId, storyId);
		const manifestPath = join(storyAudioDir, 'audio-manifest.json');

		if (existsSync(manifestPath)) {
			const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
			console.log(
				`✅ ${seriesId}/${storyId} - ${manifest.chapters.length} chapters (${manifest.voice || 'Unknown Voice'})`
			);
		} else {
			console.log(`❌ ${seriesId}/${storyId} - No audio available`);
		}
	}
}

// Clean up generated audio files
async function cleanAudioFiles(seriesId, storyId) {
	const audioDir =
		seriesId && storyId
			? join(projectRoot, 'static/audio', seriesId, storyId)
			: join(projectRoot, 'static/audio');

	try {
		const { rmSync } = await import('fs');
		if (existsSync(audioDir)) {
			rmSync(audioDir, { recursive: true, force: true });
			console.log(`🗑️  Cleaned audio files from: ${audioDir}`);
		} else {
			console.log('No audio files to clean');
		}
	} catch (error) {
		console.error('Error cleaning audio files:', error);
	}
}

// Main CLI handler
async function main() {
	const argv = yargs(hideBin(process.argv))
		.usage('Usage: $0 <command> [options]')
		.command('generate [story]', 'Generate audio for a story', (yargs) => {
			yargs
				.positional('story', {
					describe: 'Story ID in format seriesId/storyId',
					type: 'string'
				})
				.option('chapter', {
					alias: 'c',
					describe: 'Generate audio for specific chapter only',
					type: 'number'
				})
				.option('voice', {
					alias: 'v',
					describe: 'Voice to use for generation',
					type: 'string'
				})
				.option('all', {
					alias: 'a',
					describe: 'Generate audio for all stories',
					type: 'boolean'
				})
				.option('force', {
					alias: 'f',
					describe: 'Force regeneration of existing files',
					type: 'boolean'
				});
		})
		.command('check', 'Check audio availability for all stories')
		.command('clean [story]', 'Clean generated audio files', (yargs) => {
			yargs.positional('story', {
				describe: 'Story ID in format seriesId/storyId (optional)',
				type: 'string'
			});
		})
		.demandCommand(1, 'You need to specify a command')
		.help()
		.alias('help', 'h')
		.parse();

	if (!getApiKey()) {
		console.error('❌ ElevenLabs API key is required');
		console.error('   Set ELEVENLABS_API_KEY or login with `elevenlabs auth login`');
		process.exit(1);
	}

	const command = argv._[0];

	switch (command) {
		case 'generate':
			if (argv.all) {
				const stories = await getAvailableStories();
				for (const { seriesId, storyId } of stories) {
					await generateStoryAudio(seriesId, storyId, argv);
				}
			} else if (argv.story) {
				const [seriesId, storyId] = argv.story.split('/');
				if (!seriesId || !storyId) {
					console.error('❌ Story format should be: seriesId/storyId');
					process.exit(1);
				}
				await generateStoryAudio(seriesId, storyId, argv);
			} else {
				console.error('❌ Please specify a story or use --all flag');
				process.exit(1);
			}
			break;

		case 'check':
			await checkAudioAvailability();
			break;

		case 'clean':
			if (argv.story) {
				const [seriesId, storyId] = argv.story.split('/');
				await cleanAudioFiles(seriesId, storyId);
			} else {
				await cleanAudioFiles();
			}
			break;

		default:
			console.error('❌ Unknown command');
			process.exit(1);
	}
}

// Error handling
process.on('unhandledRejection', (error) => {
	console.error('❌ Unhandled error:', error);
	process.exit(1);
});

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}
