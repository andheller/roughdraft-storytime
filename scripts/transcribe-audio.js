#!/usr/bin/env node
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'fs';
import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { basename, dirname, extname, join, relative, resolve } from 'path';
import { spawnSync } from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const projectRoot = join(dirname(new URL(import.meta.url).pathname), '..');
const defaultAudioRoot = join(projectRoot, 'static/audio');
const defaultWhisperKitRoot = join(
	process.env.HOME || '',
	'Library/Application Support/WhisperKit'
);
const whisperDictateConfigRoot = join(
	process.env.HOME || '',
	'Library/Application Support/WhisperDictate'
);
const DEFAULT_WHISPERKIT_MODEL = 'small.en';
const DEFAULT_GROQ_MODEL = 'whisper-large-v3-turbo';

function round(value, digits = 3) {
	if (!Number.isFinite(value)) return null;
	return Number(value.toFixed(digits));
}

function readJson(filePath) {
	return JSON.parse(readFileSync(filePath, 'utf8'));
}

async function writeJson(filePath, data) {
	await mkdir(dirname(filePath), { recursive: true });
	await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function runCommand(command, args, options = {}) {
	const result = spawnSync(command, args, {
		encoding: options.encoding ?? 'utf8',
		maxBuffer: options.maxBuffer ?? 1024 * 1024 * 200,
		env: { ...process.env, ...(options.env || {}) }
	});

	if (result.error) {
		throw result.error;
	}

	if (result.status !== 0) {
		const stderr = Buffer.isBuffer(result.stderr)
			? result.stderr.toString('utf8')
			: result.stderr || '';
		const stdout = Buffer.isBuffer(result.stdout)
			? result.stdout.toString('utf8')
			: result.stdout || '';
		throw new Error(`${command} failed with exit ${result.status}\n${stderr || stdout}`.trim());
	}

	return result;
}

function ffprobeDuration(audioPath) {
	const result = runCommand('ffprobe', [
		'-v',
		'error',
		'-show_entries',
		'format=duration',
		'-of',
		'default=noprint_wrappers=1:nokey=1',
		audioPath
	]);

	const duration = Number(String(result.stdout).trim());
	return Number.isFinite(duration) ? duration : null;
}

function generateLevelData(audioPath, { sampleRate, binSizeSeconds }) {
	const result = runCommand(
		'ffmpeg',
		[
			'-hide_banner',
			'-loglevel',
			'error',
			'-i',
			audioPath,
			'-ac',
			'1',
			'-ar',
			String(sampleRate),
			'-f',
			'f32le',
			'pipe:1'
		],
		{ encoding: 'buffer' }
	);

	const buffer = result.stdout;
	const sampleCount = Math.floor(buffer.length / 4);
	const samplesPerBin = Math.max(1, Math.round(sampleRate * binSizeSeconds));
	const bins = [];

	for (let offset = 0; offset < sampleCount; offset += samplesPerBin) {
		const endOffset = Math.min(sampleCount, offset + samplesPerBin);
		let sumSquares = 0;
		let peak = 0;

		for (let sampleIndex = offset; sampleIndex < endOffset; sampleIndex += 1) {
			const sample = buffer.readFloatLE(sampleIndex * 4);
			const abs = Math.abs(sample);
			sumSquares += sample * sample;
			if (abs > peak) peak = abs;
		}

		const count = endOffset - offset;
		const start = offset / sampleRate;
		const end = endOffset / sampleRate;

		bins.push({
			start: round(start),
			end: round(end),
			rms: round(Math.sqrt(sumSquares / count), 5),
			peak: round(Math.min(1, peak), 5)
		});
	}

	return {
		sampleRate,
		binSizeSeconds,
		durationSeconds: round(sampleCount / sampleRate),
		bins
	};
}

function cleanWord(word) {
	return String(word || '').trim();
}

function wordsToText(words = []) {
	return words
		.map((word) => cleanWord(word.word || word.text))
		.filter(Boolean)
		.join(' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function normalizeWords(words = []) {
	return words
		.map((word) => ({
			word: cleanWord(word.word || word.text),
			start: round(word.start),
			end: round(word.end),
			probability: round(word.probability, 4)
		}))
		.filter((word) => word.word && word.start !== null && word.end !== null);
}

function normalizeWhisperKitReport(report, metadata) {
	const segments = (report.segments || []).map((segment, index) => {
		const words = normalizeWords(segment.words || []);
		return {
			id: segment.id ?? index,
			start: round(segment.start),
			end: round(segment.end),
			text: words.length ? wordsToText(words) : String(segment.text || '').trim(),
			avgLogprob: round(segment.avgLogprob, 5),
			noSpeechProb: round(segment.noSpeechProb, 5),
			compressionRatio: round(segment.compressionRatio, 5),
			words
		};
	});

	return {
		schemaVersion: 1,
		provider: 'whisperkit',
		model: metadata.model,
		generatedAt: new Date().toISOString(),
		audioFile: metadata.audioFile,
		durationSeconds: metadata.durationSeconds,
		language: report.language || metadata.language || 'en',
		text: String(report.text || wordsToText(segments.flatMap((segment) => segment.words))).trim(),
		segments,
		words: segments.flatMap((segment) => segment.words)
	};
}

function normalizeGroqReport(report, metadata) {
	const topLevelWords = normalizeWords(report.words || []);
	const segments = (report.segments || []).map((segment, index) => {
		const words = normalizeWords(segment.words || []);
		return {
			id: segment.id ?? index,
			start: round(segment.start),
			end: round(segment.end),
			text: String(segment.text || wordsToText(words)).trim(),
			avgLogprob: round(segment.avg_logprob ?? segment.avgLogprob, 5),
			noSpeechProb: round(segment.no_speech_prob ?? segment.noSpeechProb, 5),
			compressionRatio: round(segment.compression_ratio ?? segment.compressionRatio, 5),
			words
		};
	});

	return {
		schemaVersion: 1,
		provider: 'groq',
		model: metadata.model,
		generatedAt: new Date().toISOString(),
		audioFile: metadata.audioFile,
		durationSeconds: metadata.durationSeconds ?? round(report.duration),
		language: report.language || metadata.language || 'en',
		text: String(report.text || wordsToText(topLevelWords)).trim(),
		segments,
		words: topLevelWords.length ? topLevelWords : segments.flatMap((segment) => segment.words)
	};
}

function formatSrtTimestamp(seconds) {
	const safeSeconds = Math.max(0, Number(seconds) || 0);
	const hours = Math.floor(safeSeconds / 3600);
	const minutes = Math.floor((safeSeconds % 3600) / 60);
	const wholeSeconds = Math.floor(safeSeconds % 60);
	const milliseconds = Math.round((safeSeconds - Math.floor(safeSeconds)) * 1000);

	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
		wholeSeconds
	).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
}

function buildCaptionEntriesFromWords(words = []) {
	const entries = [];
	let current = [];
	const maxWords = 8;
	const maxDurationSeconds = 4;

	function flush() {
		if (!current.length) return;
		entries.push({
			start: current[0].start,
			end: current[current.length - 1].end,
			text: current.map((word) => word.word).join(' ')
		});
		current = [];
	}

	for (const word of words) {
		if (!word.word || word.start === null || word.end === null) continue;
		const nextDuration = current.length ? word.end - current[0].start : 0;
		if (current.length >= maxWords || nextDuration > maxDurationSeconds) {
			flush();
		}

		current.push(word);

		if (/[.!?]$/.test(word.word)) {
			flush();
		}
	}

	flush();
	return entries;
}

function buildSrt(transcript) {
	const entries = transcript.words?.length
		? buildCaptionEntriesFromWords(transcript.words)
		: (transcript.segments || []).map((segment) => ({
				start: segment.start,
				end: segment.end,
				text: segment.text
			}));

	return entries
		.filter((entry) => entry.text && entry.start !== null && entry.end !== null)
		.map(
			(entry, index) =>
				`${index + 1}\n${formatSrtTimestamp(entry.start)} --> ${formatSrtTimestamp(
					entry.end
				)}\n${entry.text}`
		)
		.join('\n\n');
}

function whisperKitExecutable(configuredPath) {
	const candidates = [
		configuredPath,
		'/opt/homebrew/bin/whisperkit-cli',
		'/usr/local/bin/whisperkit-cli',
		'whisperkit-cli'
	].filter(Boolean);

	for (const candidate of candidates) {
		const result = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
		if (!result.error && result.status === 0) {
			return candidate;
		}
	}

	throw new Error('whisperkit-cli was not found. Install WhisperKit CLI or pass --cli-path.');
}

function transcribeWithWhisperKit(audioPath, options) {
	const tempDir = mkdtempSync(join(tmpdir(), 'roughdraft-whisperkit-'));
	const audioBase = basename(audioPath, extname(audioPath));
	const cli = whisperKitExecutable(options.cliPath);

	try {
		const args = [
			'transcribe',
			'--audio-path',
			audioPath,
			'--model',
			options.model,
			'--download-model-path',
			options.modelDirectory,
			'--download-tokenizer-path',
			options.tokenizerDirectory,
			'--language',
			options.language,
			'--temperature',
			'0',
			'--use-prefill-prompt',
			'--use-prefill-cache',
			'--word-timestamps',
			'--chunking-strategy',
			options.chunkingStrategy,
			'--report',
			'--report-path',
			tempDir
		];

		if (options.prompt) {
			args.push('--prompt', options.prompt);
		}

		runCommand(cli, args, { maxBuffer: 1024 * 1024 * 100 });

		const reportPath = join(tempDir, `${audioBase}.json`);
		const srtPath = join(tempDir, `${audioBase}.srt`);
		if (!existsSync(reportPath)) {
			throw new Error(`WhisperKit did not write expected report: ${reportPath}`);
		}

		return {
			report: readJson(reportPath),
			srt: existsSync(srtPath) ? readFileSync(srtPath, 'utf8') : null
		};
	} finally {
		rmSync(tempDir, { recursive: true, force: true });
	}
}

function groqApiKey() {
	if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY;

	const keyPath = join(whisperDictateConfigRoot, 'groq_api_key.txt');
	if (existsSync(keyPath)) {
		return readFileSync(keyPath, 'utf8').trim();
	}

	throw new Error('GROQ_API_KEY is required, or configure WhisperDictate/groq_api_key.txt.');
}

function transcribeWithGroq(audioPath, options) {
	const apiKey = groqApiKey();
	const args = [
		'-sS',
		'--fail-with-body',
		'https://api.groq.com/openai/v1/audio/transcriptions',
		'-H',
		`Authorization: Bearer ${apiKey}`,
		'-F',
		`file=@${audioPath}`,
		'-F',
		`model=${options.model}`,
		'-F',
		`language=${options.language}`,
		'-F',
		'temperature=0',
		'-F',
		'response_format=verbose_json',
		'-F',
		'timestamp_granularities[]=segment',
		'-F',
		'timestamp_granularities[]=word'
	];

	if (options.prompt) {
		args.push('-F', `prompt=${options.prompt}`);
	}

	const result = runCommand('curl', args, { maxBuffer: 1024 * 1024 * 100 });
	return JSON.parse(result.stdout);
}

async function findAudioManifestPaths(audioRoot) {
	const paths = [];

	async function walk(directory) {
		if (!existsSync(directory)) return;

		const entries = await readdir(directory, { withFileTypes: true });
		for (const entry of entries) {
			const entryPath = join(directory, entry.name);
			if (entry.isDirectory()) {
				await walk(entryPath);
			} else if (entry.name === 'audio-manifest.json') {
				paths.push(entryPath);
			}
		}
	}

	await walk(audioRoot);
	return paths.sort();
}

function manifestPathForStory(audioRoot, storyArg) {
	const [seriesId, storyId] = String(storyArg).split('/');
	if (!seriesId || !storyId) {
		throw new Error('Story must use seriesId/storyId format.');
	}

	return join(audioRoot, seriesId, storyId, 'audio-manifest.json');
}

async function updateManifest(manifestPath, updates) {
	const manifest = readJson(manifestPath);
	const chapterUpdates = new Map(updates.map((update) => [Number(update.id), update]));

	manifest.chapters = (manifest.chapters || []).map((chapter) => {
		const update = chapterUpdates.get(Number(chapter.id));
		return update ? { ...chapter, ...update } : chapter;
	});

	await writeJson(manifestPath, manifest);
}

async function processChapter({ manifestPath, chapter, argv }) {
	const manifestDirectory = dirname(manifestPath);
	const audioPath = join(manifestDirectory, chapter.filename);
	if (!existsSync(audioPath)) {
		throw new Error(`Audio file does not exist: ${audioPath}`);
	}

	const audioBase = basename(chapter.filename, extname(chapter.filename));
	const transcriptFile = `${audioBase}.transcript.json`;
	const captionsFile = `${audioBase}.srt`;
	const levelsFile = `${audioBase}.levels.json`;
	const transcriptPath = join(manifestDirectory, transcriptFile);
	const captionsPath = join(manifestDirectory, captionsFile);
	const levelsPath = join(manifestDirectory, levelsFile);
	const durationSeconds = round(ffprobeDuration(audioPath) ?? chapter.durationSeconds);

	if (!argv.levelsOnly && (argv.force || !existsSync(transcriptPath))) {
		console.log(`Transcribing ${relative(projectRoot, audioPath)} with ${argv.engine}...`);
		const prompt = argv.promptFile
			? await readFile(resolve(projectRoot, argv.promptFile), 'utf8')
			: argv.prompt;
		const metadata = {
			audioFile: chapter.filename,
			durationSeconds,
			language: argv.language,
			model: argv.model
		};
		let transcript;

		if (argv.engine === 'whisperkit') {
			const result = transcribeWithWhisperKit(audioPath, {
				...argv,
				prompt,
				modelDirectory: resolve(projectRoot, argv.modelDirectory),
				tokenizerDirectory: resolve(projectRoot, argv.tokenizerDirectory)
			});
			transcript = normalizeWhisperKitReport(result.report, metadata);
		} else {
			const result = transcribeWithGroq(audioPath, { ...argv, prompt });
			transcript = normalizeGroqReport(result, metadata);
		}

		await writeJson(transcriptPath, transcript);
		await writeFile(captionsPath, buildSrt(transcript).trimEnd() + '\n');
	} else if (!argv.levelsOnly) {
		console.log(`Skipping existing transcript ${relative(projectRoot, transcriptPath)}`);
	}

	if (!argv.transcriptOnly && (argv.force || !existsSync(levelsPath))) {
		console.log(`Extracting levels for ${relative(projectRoot, audioPath)}...`);
		const levelData = {
			schemaVersion: 1,
			generatedAt: new Date().toISOString(),
			audioFile: chapter.filename,
			...generateLevelData(audioPath, {
				sampleRate: argv.levelSampleRate,
				binSizeSeconds: argv.levelBinSizeSeconds
			})
		};
		await writeJson(levelsPath, levelData);
	} else if (!argv.transcriptOnly) {
		console.log(`Skipping existing levels ${relative(projectRoot, levelsPath)}`);
	}

	return {
		id: chapter.id,
		durationSeconds,
		transcriptFile,
		captionsFile: existsSync(captionsPath) ? captionsFile : undefined,
		levelsFile,
		levelBinSizeSeconds: argv.levelBinSizeSeconds
	};
}

async function processManifest(manifestPath, argv) {
	if (!existsSync(manifestPath)) {
		throw new Error(`Audio manifest not found: ${manifestPath}`);
	}

	const manifest = readJson(manifestPath);
	const chapters = (manifest.chapters || []).filter((chapter) =>
		argv.chapter ? Number(chapter.id) === Number(argv.chapter) : true
	);

	if (!chapters.length) {
		console.warn(`No matching chapters in ${relative(projectRoot, manifestPath)}`);
		return [];
	}

	const updates = [];
	for (const chapter of chapters) {
		updates.push(await processChapter({ manifestPath, chapter, argv }));
	}

	await updateManifest(manifestPath, updates);
	return updates;
}

async function main() {
	const rawArgs = hideBin(process.argv);
	if (rawArgs[0] === '--') {
		rawArgs.shift();
	}

	const argv = await yargs(rawArgs)
		.usage('Usage: $0 <story|all> [story] [options]')
		.command('story <story>', 'Generate timestamp and level sidecars for one story')
		.command('all', 'Generate timestamp and level sidecars for every audio manifest')
		.option('chapter', {
			alias: 'c',
			type: 'number',
			describe: 'Only process one chapter id'
		})
		.option('engine', {
			type: 'string',
			choices: ['whisperkit', 'groq'],
			default: 'whisperkit',
			describe: 'Transcription engine'
		})
		.option('model', {
			type: 'string',
			describe: 'Transcription model'
		})
		.option('language', {
			type: 'string',
			default: 'en',
			describe: 'Spoken language code'
		})
		.option('audio-root', {
			type: 'string',
			default: defaultAudioRoot,
			describe: 'Audio manifest root'
		})
		.option('model-directory', {
			type: 'string',
			default: join(defaultWhisperKitRoot, 'models'),
			describe: 'WhisperKit model download/cache directory'
		})
		.option('tokenizer-directory', {
			type: 'string',
			default: join(defaultWhisperKitRoot, 'tokenizers'),
			describe: 'WhisperKit tokenizer download/cache directory'
		})
		.option('cli-path', {
			type: 'string',
			describe: 'Path to whisperkit-cli'
		})
		.option('chunking-strategy', {
			type: 'string',
			default: 'vad',
			describe: 'WhisperKit chunking strategy'
		})
		.option('prompt', {
			type: 'string',
			default: '',
			describe: 'Optional transcription prompt'
		})
		.option('prompt-file', {
			type: 'string',
			describe: 'Optional transcription prompt file'
		})
		.option('level-sample-rate', {
			type: 'number',
			default: 1000,
			describe: 'PCM sample rate used for level extraction'
		})
		.option('level-bin-size-seconds', {
			type: 'number',
			default: 0.1,
			describe: 'Seconds per RMS/peak level bin'
		})
		.option('force', {
			alias: 'f',
			type: 'boolean',
			default: false,
			describe: 'Regenerate existing sidecars'
		})
		.option('transcript-only', {
			type: 'boolean',
			default: false,
			describe: 'Only write transcript/caption sidecars'
		})
		.option('levels-only', {
			type: 'boolean',
			default: false,
			describe: 'Only write level sidecars'
		})
		.demandCommand(1)
		.help()
		.parse();

	argv.model =
		argv.model || (argv.engine === 'groq' ? DEFAULT_GROQ_MODEL : DEFAULT_WHISPERKIT_MODEL);
	argv.audioRoot = resolve(projectRoot, argv.audioRoot);

	const command = argv._[0];
	const manifestPaths =
		command === 'all'
			? await findAudioManifestPaths(argv.audioRoot)
			: [manifestPathForStory(argv.audioRoot, argv.story || argv._[1])];

	let processed = 0;
	for (const manifestPath of manifestPaths) {
		const updates = await processManifest(manifestPath, argv);
		processed += updates.length;
	}

	console.log(`Done. Processed ${processed} chapter${processed === 1 ? '' : 's'}.`);
}

process.on('unhandledRejection', (error) => {
	console.error(error);
	process.exit(1);
});

if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}
