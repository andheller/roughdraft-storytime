#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

dotenv.config({ quiet: true });

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const contentRoot = join(projectRoot, 'src/content/books');
const usageRoot = join(projectRoot, 'audiobook/usage');
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-3.1-flash-tts-preview';
const DEFAULT_VOICE = 'Zephyr';
const SAMPLE_RATE = 24000;
const BYTES_PER_SAMPLE = 2;
const OUTPUT_TOKENS_PER_SECOND = 25;
const WORDS_PER_MINUTE = 150;

function getApiKey() {
	return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null;
}

function todayKey() {
	return new Date().toISOString().slice(0, 10);
}

function sleep(milliseconds) {
	return new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));
}

function readJson(filePath) {
	return JSON.parse(readFileSync(filePath, 'utf8'));
}

function resolveStoryPath(seriesId, storyId) {
	const nestedPath = join(contentRoot, seriesId, storyId);
	const standalonePath = join(contentRoot, seriesId);

	if (existsSync(join(nestedPath, 'story.json'))) {
		return nestedPath;
	}

	if (seriesId === storyId && existsSync(join(standalonePath, 'story.json'))) {
		return standalonePath;
	}

	throw new Error(`Story not found: ${seriesId}/${storyId}`);
}

function loadStory(seriesId, storyId) {
	const storyPath = resolveStoryPath(seriesId, storyId);
	const storyJson = readJson(join(storyPath, 'story.json'));

	const chapters = storyJson.chapters.map((chapter, index) => {
		const chapterId = chapter.id ?? index + 1;
		const chapterPath = join(storyPath, chapter.file);
		const narrationPath = join(storyPath, 'narration', `${chapter.file.replace(/\.md$/i, '')}.txt`);
		const fallbackNarrationPath = join(storyPath, 'narration', `chapter-${chapterId}.txt`);
		const sourcePath = existsSync(narrationPath)
			? narrationPath
			: existsSync(fallbackNarrationPath)
				? fallbackNarrationPath
				: chapterPath;

		return {
			id: chapterId,
			title: chapter.title || `Chapter ${chapterId}`,
			file: chapter.file,
			sourcePath,
			sourceKind: sourcePath.endsWith('.txt') ? 'narration' : 'markdown',
			text: prepareTextForTts(readFileSync(sourcePath, 'utf8'))
		};
	});

	return {
		...storyJson,
		seriesId,
		storyId,
		storyPath,
		chapters
	};
}

function convertTtsDirectives(content) {
	return content.replace(/<tts\s+([^>]*?)\/?>/gi, (_match, attributes) => {
		const tag = attributes.match(/\btag=["']([^"']+)["']/i)?.[1];
		const pause = attributes.match(/\bpause=["']([^"']+)["']/i)?.[1];
		const note = attributes.match(/\bnote=["']([^"']+)["']/i)?.[1];

		if (tag) return `[${tag.trim()}]`;
		if (pause) return `[${pause.trim()} pause]`;
		if (note) return `[${note.trim()}]`;
		return '';
	});
}

function prepareTextForTts(content) {
	return convertTtsDirectives(content)
		.replace(/\r\n/g, '\n')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<figure[\s\S]*?<\/figure>/gi, '')
		.replace(/<img\b[^>]*>/gi, '')
		.replace(/^#+\s*/gm, '')
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/\*\*([^*]+)\*\*/g, '$1')
		.replace(/\*([^*]+)\*/g, '$1')
		.replace(/^\s*[-*]\s+/gm, '')
		.replace(/<[^>]+>/g, '')
		.split(/\n{2,}/)
		.map((paragraph) =>
			paragraph
				.replace(/\s*\n\s*/g, ' ')
				.replace(/\s+/g, ' ')
				.trim()
		)
		.filter(Boolean)
		.join('\n\n')
		.trim();
}

function estimateChapter(chapter) {
	const words = chapter.text.split(/\s+/).filter(Boolean).length;
	const seconds = Math.ceil((words / WORDS_PER_MINUTE) * 60);
	const outputTokens = Math.ceil(seconds * OUTPUT_TOKENS_PER_SECOND);
	const inputTokens = Math.ceil(chapter.text.length / 4);

	return {
		words,
		seconds,
		outputTokens,
		inputTokens,
		totalTokens: inputTokens + outputTokens
	};
}

function splitIntoChunks(text, maxSeconds) {
	const maxWords = Math.max(80, Math.floor((maxSeconds / 60) * WORDS_PER_MINUTE));
	const paragraphs = text.split(/\n{2,}/).filter(Boolean);
	const chunks = [];
	let current = [];
	let currentWords = 0;

	for (const paragraph of paragraphs) {
		const paragraphWords = paragraph.split(/\s+/).filter(Boolean).length;
		if (current.length && currentWords + paragraphWords > maxWords) {
			chunks.push(current.join('\n\n'));
			current = [];
			currentWords = 0;
		}

		current.push(paragraph);
		currentWords += paragraphWords;
	}

	if (current.length) {
		chunks.push(current.join('\n\n'));
	}

	return chunks;
}

function estimateTextOutputTokens(text) {
	const words = text.split(/\s+/).filter(Boolean).length;
	const seconds = Math.ceil((words / WORDS_PER_MINUTE) * 60);
	return Math.ceil(seconds * OUTPUT_TOKENS_PER_SECOND);
}

function buildPrompt({ story, chapter, chunkText, chunkIndex, chunkCount, style }) {
	const partLine =
		chunkCount > 1 ? `This is part ${chunkIndex + 1} of ${chunkCount} for the chapter.` : '';

	return [
		'Create audiobook narration from the transcript only.',
		"Use a warm, clear children's story narrator voice with natural pacing.",
		'Respect square-bracket audio tags as delivery direction. Do not speak the tags aloud.',
		style ? `Additional style: ${style}` : '',
		partLine,
		`Story: ${story.title}`,
		`Chapter ${chapter.id}: ${chapter.title}`,
		'',
		'Transcript:',
		chunkText
	]
		.filter(Boolean)
		.join('\n');
}

function pcmDurationSeconds(pcmBuffer) {
	return pcmBuffer.length / (SAMPLE_RATE * BYTES_PER_SAMPLE);
}

function wavHeader(pcmByteLength) {
	const header = Buffer.alloc(44);
	const byteRate = SAMPLE_RATE * BYTES_PER_SAMPLE;
	const blockAlign = BYTES_PER_SAMPLE;

	header.write('RIFF', 0);
	header.writeUInt32LE(36 + pcmByteLength, 4);
	header.write('WAVE', 8);
	header.write('fmt ', 12);
	header.writeUInt32LE(16, 16);
	header.writeUInt16LE(1, 20);
	header.writeUInt16LE(1, 22);
	header.writeUInt32LE(SAMPLE_RATE, 24);
	header.writeUInt32LE(byteRate, 28);
	header.writeUInt16LE(blockAlign, 32);
	header.writeUInt16LE(16, 34);
	header.write('data', 36);
	header.writeUInt32LE(pcmByteLength, 40);

	return header;
}

function writeWav(outputPath, pcmBuffers) {
	const pcmBuffer = Buffer.concat(pcmBuffers);
	writeFileSync(outputPath, Buffer.concat([wavHeader(pcmBuffer.length), pcmBuffer]));
	return pcmDurationSeconds(pcmBuffer);
}

function readWavDurationSeconds(filePath) {
	const buffer = readFileSync(filePath);
	if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') {
		return null;
	}

	let offset = 12;
	let byteRate = null;
	let dataByteLength = null;

	while (offset + 8 <= buffer.length) {
		const chunkId = buffer.toString('ascii', offset, offset + 4);
		const chunkSize = buffer.readUInt32LE(offset + 4);
		const chunkDataOffset = offset + 8;

		if (chunkId === 'fmt ') {
			byteRate = buffer.readUInt32LE(chunkDataOffset + 8);
		}

		if (chunkId === 'data') {
			dataByteLength = chunkSize;
			break;
		}

		offset = chunkDataOffset + chunkSize + (chunkSize % 2);
	}

	if (!byteRate || !dataByteLength) {
		return null;
	}

	return dataByteLength / byteRate;
}

function extractInlineAudio(responseJson) {
	const parts = responseJson?.candidates?.[0]?.content?.parts || [];
	const audioPart = parts.find((part) => part.inlineData?.data || part.inline_data?.data);
	const inlineData = audioPart?.inlineData || audioPart?.inline_data;

	if (!inlineData?.data) {
		throw new Error(
			`Gemini response did not include inline audio: ${JSON.stringify(responseJson).slice(0, 500)}`
		);
	}

	return Buffer.from(inlineData.data, 'base64');
}

async function callGeminiTts({ apiKey, model, voice, prompt }) {
	const response = await fetch(`${GEMINI_API_BASE}/models/${model}:generateContent`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-goog-api-key': apiKey
		},
		body: JSON.stringify({
			contents: [
				{
					parts: [{ text: prompt }]
				}
			],
			generationConfig: {
				responseModalities: ['AUDIO'],
				speechConfig: {
					voiceConfig: {
						prebuiltVoiceConfig: {
							voiceName: voice
						}
					}
				}
			}
		})
	});

	if (!response.ok) {
		const errorText = await response.text();
		const error = new Error(`Gemini API error ${response.status}: ${errorText}`);
		error.status = response.status;
		throw error;
	}

	return extractInlineAudio(await response.json());
}

async function callWithRetries(options, retries) {
	let attempt = 0;

	while (true) {
		try {
			return await callGeminiTts(options);
		} catch (error) {
			const retryableNetworkError =
				!error.status &&
				/(ETIMEDOUT|ECONNRESET|EAI_AGAIN|ENOTFOUND|fetch failed|HeadersTimeoutError)/i.test(
					`${error.message || ''} ${error.cause?.message || ''} ${error.cause?.code || ''}`
				);
			const retryableStatus = [429, 500, 502, 503, 504].includes(error.status);

			if (attempt >= retries || (!retryableStatus && !retryableNetworkError)) {
				throw error;
			}

			const delay = Math.min(120000, 15000 * 2 ** attempt);
			const reason = retryableStatus ? `Gemini returned ${error.status}` : 'Gemini request failed';
			console.warn(`${reason}; waiting ${Math.round(delay / 1000)}s before retry.`);
			await sleep(delay);
			attempt += 1;
		}
	}
}

function loadUsage() {
	const usagePath = join(usageRoot, `gemini-tts-${todayKey()}.json`);
	if (!existsSync(usagePath)) {
		return {
			path: usagePath,
			date: todayKey(),
			requests: 0,
			estimatedOutputTokens: 0,
			items: []
		};
	}

	return {
		path: usagePath,
		...readJson(usagePath)
	};
}

function saveUsage(usage) {
	mkdirSync(dirname(usage.path), { recursive: true });
	writeFileSync(usage.path, JSON.stringify(usage, null, 2));
}

function printPlan(story, chapters, maxSecondsPerRequest) {
	console.log(`\nGemini TTS plan for "${story.title}" (${story.seriesId}/${story.storyId})\n`);
	let totalSeconds = 0;
	let totalOutputTokens = 0;
	let totalRequests = 0;

	for (const chapter of chapters) {
		const estimate = estimateChapter(chapter);
		const chunks = splitIntoChunks(chapter.text, maxSecondsPerRequest);
		totalSeconds += estimate.seconds;
		totalOutputTokens += estimate.outputTokens;
		totalRequests += chunks.length;

		console.log(
			`Chapter ${chapter.id}: ${chapter.title} - ${estimate.words} words, ~${Math.ceil(
				estimate.seconds / 60
			)} min, ~${estimate.outputTokens} output tokens, ${chunks.length} request(s)`
		);
	}

	console.log(
		`\nEstimated total: ~${Math.ceil(totalSeconds / 60)} min, ~${totalOutputTokens} output tokens, ${totalRequests} request(s)`
	);
	console.log('Free-tier guardrail target: 10 requests/day, 10k tokens/minute, 3 requests/minute.');
}

async function generateStoryAudio(story, chapters, argv) {
	const apiKey = getApiKey();
	if (!apiKey) {
		throw new Error('GEMINI_API_KEY is required. Add it to .env or your shell environment.');
	}

	const usage = loadUsage();
	const outputDir = resolve(projectRoot, argv.outdir, story.seriesId, story.storyId);
	const manifestPath = join(outputDir, 'audio-manifest.json');
	const existingManifest = existsSync(manifestPath) ? readJson(manifestPath) : null;
	const reusableExistingManifest =
		existingManifest?.provider === 'google-gemini' &&
		existingManifest?.model === argv.model &&
		existingManifest?.voice === argv.voice &&
		existingManifest?.format === 'wav';
	const manifestChapters = new Map(
		(reusableExistingManifest ? existingManifest.chapters || [] : [])
			.filter((chapter) => chapter.filename?.endsWith('.wav'))
			.map((chapter) => [chapter.id, chapter])
	);
	const generatedChapters = [];
	let lastRequestAt = 0;

	mkdirSync(outputDir, { recursive: true });

	for (const chapter of chapters) {
		const outputPath = join(outputDir, `chapter-${chapter.id}.wav`);
		if (existsSync(outputPath) && !argv.force) {
			console.log(`Skipping existing chapter-${chapter.id}.wav`);
			const existingChapter = manifestChapters.get(chapter.id);
			const durationSeconds =
				existingChapter?.durationSeconds ?? Number(readWavDurationSeconds(outputPath)?.toFixed(2));
			generatedChapters.push({
				...(existingChapter || {
					id: chapter.id,
					filename: `chapter-${chapter.id}.wav`,
					title: chapter.title
				}),
				durationSeconds
			});
			continue;
		}

		const chunks = splitIntoChunks(chapter.text, argv.maxSecondsPerRequest);
		const pcmBuffers = [];

		for (let index = 0; index < chunks.length; index += 1) {
			const estimatedChunkOutputTokens = estimateTextOutputTokens(chunks[index]);

			if (usage.requests >= argv.dailyRequestBudget) {
				console.warn(
					`Daily request budget reached (${usage.requests}/${argv.dailyRequestBudget}). Stopping here.`
				);
				saveUsage(usage);
				return writeManifest({
					story,
					outputDir,
					voice: argv.voice,
					model: argv.model,
					chapters: [...manifestChapters.values(), ...generatedChapters]
				});
			}

			if (usage.estimatedOutputTokens + estimatedChunkOutputTokens > argv.dailyOutputTokenBudget) {
				console.warn(
					`Daily output-token budget would be exceeded (~${usage.estimatedOutputTokens + estimatedChunkOutputTokens}/${argv.dailyOutputTokenBudget}). Stopping here.`
				);
				saveUsage(usage);
				return writeManifest({
					story,
					outputDir,
					voice: argv.voice,
					model: argv.model,
					chapters: [...manifestChapters.values(), ...generatedChapters]
				});
			}

			const elapsed = Date.now() - lastRequestAt;
			if (lastRequestAt && elapsed < argv.minDelayMs) {
				await sleep(argv.minDelayMs - elapsed);
			}

			const prompt = buildPrompt({
				story,
				chapter,
				chunkText: chunks[index],
				chunkIndex: index,
				chunkCount: chunks.length,
				style: argv.style
			});

			console.log(`Generating chapter ${chapter.id}, chunk ${index + 1}/${chunks.length}...`);
			const pcmBuffer = await callWithRetries(
				{
					apiKey,
					model: argv.model,
					voice: argv.voice,
					prompt
				},
				argv.retries
			);
			lastRequestAt = Date.now();
			pcmBuffers.push(pcmBuffer);

			const seconds = pcmDurationSeconds(pcmBuffer);
			usage.requests += 1;
			usage.estimatedOutputTokens += Math.ceil(seconds * OUTPUT_TOKENS_PER_SECOND);
			usage.items.push({
				at: new Date().toISOString(),
				story: `${story.seriesId}/${story.storyId}`,
				chapter: chapter.id,
				chunk: index + 1,
				durationSeconds: Number(seconds.toFixed(2)),
				estimatedOutputTokens: Math.ceil(seconds * OUTPUT_TOKENS_PER_SECOND)
			});
			saveUsage(usage);
		}

		const durationSeconds = writeWav(outputPath, pcmBuffers);
		console.log(`Wrote ${outputPath} (${Math.round(durationSeconds)}s)`);
		generatedChapters.push({
			id: chapter.id,
			filename: `chapter-${chapter.id}.wav`,
			title: chapter.title,
			durationSeconds: Number(durationSeconds.toFixed(2))
		});
	}

	writeManifest({
		story,
		outputDir,
		voice: argv.voice,
		model: argv.model,
		chapters: [...manifestChapters.values(), ...generatedChapters]
	});
}

function writeManifest({ story, outputDir, voice, model, chapters }) {
	const dedupedChapters = Array.from(
		chapters
			.filter(Boolean)
			.reduce((map, chapter) => map.set(chapter.id, chapter), new Map())
			.values()
	).sort((left, right) => Number(left.id) - Number(right.id));

	const manifest = {
		seriesId: story.seriesId,
		storyId: story.storyId,
		title: story.title,
		provider: 'google-gemini',
		model,
		voice,
		format: 'wav',
		sampleRate: SAMPLE_RATE,
		generatedAt: new Date().toISOString(),
		chapters: dedupedChapters.map((chapter) => ({
			id: chapter.id,
			title: chapter.title,
			filename: chapter.filename,
			durationSeconds: chapter.durationSeconds
		}))
	};

	writeFileSync(join(outputDir, 'audio-manifest.json'), JSON.stringify(manifest, null, 2));
	console.log(`Updated manifest: ${join(outputDir, 'audio-manifest.json')}`);
}

async function main() {
	const rawArgs = hideBin(process.argv);
	if (rawArgs[0] === '--') {
		rawArgs.shift();
	}

	const argv = yargs(rawArgs)
		.usage('Usage: $0 <plan|generate> <seriesId/storyId> [options]')
		.command('plan <story>', 'Estimate Gemini TTS requests and token use')
		.command('generate <story>', 'Generate Gemini TTS audiobook WAV files')
		.option('chapter', {
			alias: 'c',
			type: 'number',
			describe: 'Only process one chapter id'
		})
		.option('model', {
			type: 'string',
			default: DEFAULT_MODEL,
			describe: 'Gemini TTS model id'
		})
		.option('voice', {
			type: 'string',
			default: DEFAULT_VOICE,
			describe: 'Gemini prebuilt voice name'
		})
		.option('style', {
			type: 'string',
			default:
				'bright but not cartoonish; cozy bedtime-story clarity; light comedic timing when the text calls for it',
			describe: 'Narration style instruction added to every prompt'
		})
		.option('outdir', {
			type: 'string',
			default: 'static/audio',
			describe: 'Output root'
		})
		.option('max-seconds-per-request', {
			type: 'number',
			default: 220,
			describe: 'Approximate maximum audio length per Gemini request before chunking'
		})
		.option('daily-request-budget', {
			type: 'number',
			default: 10,
			describe: 'Local stop point to stay under the free-tier request/day limit'
		})
		.option('daily-output-token-budget', {
			type: 'number',
			default: Number.POSITIVE_INFINITY,
			describe: 'Optional local stop point for estimated audio output tokens'
		})
		.option('min-delay-ms', {
			type: 'number',
			default: 22000,
			describe: 'Delay between Gemini calls to stay below 3 RPM'
		})
		.option('retries', {
			type: 'number',
			default: 3,
			describe: 'Retries for 429/5xx responses'
		})
		.option('force', {
			alias: 'f',
			type: 'boolean',
			describe: 'Regenerate existing chapter files'
		})
		.demandCommand(2)
		.help()
		.parse();

	const command = argv._[0];
	const storyArg = argv.story || argv._[1];
	const [seriesId, storyId] = String(storyArg).split('/');
	if (!seriesId || !storyId) {
		throw new Error('Story must use seriesId/storyId format.');
	}

	const story = loadStory(seriesId, storyId);
	const chapters = argv.chapter
		? story.chapters.filter((chapter) => Number(chapter.id) === Number(argv.chapter))
		: story.chapters;

	if (chapters.length === 0) {
		throw new Error(`No matching chapters found for ${seriesId}/${storyId}.`);
	}

	if (command === 'plan') {
		printPlan(story, chapters, argv.maxSecondsPerRequest);
		return;
	}

	if (command === 'generate') {
		await generateStoryAudio(story, chapters, argv);
		return;
	}

	throw new Error(`Unknown command: ${command}`);
}

process.on('unhandledRejection', (error) => {
	console.error(error);
	process.exit(1);
});

if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}
