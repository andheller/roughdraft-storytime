#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const contentRoot = path.join(projectRoot, 'src', 'content', 'books');
const defaultOutputRoot = path.join(projectRoot, 'exports', 'epub');
const defaultLanguage = 'en-US';

function slugify(value) {
	return String(value || '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 120);
}

function toTitleCase(value) {
	return String(value || '')
		.split('-')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function buildFrontmatter({ title, author, language, rights }) {
	return [
		'---',
		`title: "${String(title || '').replace(/"/g, '\\"')}"`,
		`author: "${String(author || 'Roughdraft Stories').replace(/"/g, '\\"')}"`,
		`language: ${language || defaultLanguage}`,
		`rights: "${String(rights || author || 'Roughdraft Stories').replace(/"/g, '\\"')}"`,
		'---',
		''
	].join('\n');
}

function normalizeChapterMarkdown(markdown, chapterNumber, chapterTitle) {
	const trimmed = String(markdown || '').trim();
	if (!trimmed) {
		return `# Chapter ${chapterNumber}: ${chapterTitle}\n`;
	}
	if (/^\s{0,3}#{1,6}\s+/.test(trimmed)) {
		return trimmed;
	}
	return `# Chapter ${chapterNumber}: ${chapterTitle}\n\n${trimmed}`;
}

function demoteMarkdownHeadings(markdown, levels = 1) {
	return String(markdown || '').replace(/^(\s{0,3})(#{1,6})(\s+)/gm, (_match, prefix, hashes, suffix) => {
		const nextLevel = Math.min(6, hashes.length + levels);
		return `${prefix}${'#'.repeat(nextLevel)}${suffix}`;
	});
}

async function pathExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function readJson(filePath) {
	return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function listDirectories(directoryPath) {
	const entries = await fs.readdir(directoryPath, { withFileTypes: true });
	return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

function lookupSeriesStoryMetadata(seriesData, storyFolder, storyJson) {
	if (!Array.isArray(seriesData?.stories)) return null;
	return (
		seriesData.stories.find(
			(entry) => entry?.id === storyJson?.id || entry?.folder === storyFolder || entry?.id === storyFolder
		) || null
	);
}

function sortStories(stories, seriesData) {
	if (!Array.isArray(seriesData?.stories)) {
		return [...stories].sort((left, right) => left.storyId.localeCompare(right.storyId));
	}

	const position = new Map();
	seriesData.stories.forEach((entry, index) => {
		if (entry?.id) position.set(`id:${entry.id}`, index);
		if (entry?.folder) position.set(`folder:${entry.folder}`, index);
	});

	return [...stories].sort((left, right) => {
		const leftIndex = position.get(`id:${left.storyId}`) ?? position.get(`folder:${left.storyFolder}`) ?? Number.MAX_SAFE_INTEGER;
		const rightIndex =
			position.get(`id:${right.storyId}`) ?? position.get(`folder:${right.storyFolder}`) ?? Number.MAX_SAFE_INTEGER;
		if (leftIndex !== rightIndex) return leftIndex - rightIndex;
		return left.storyId.localeCompare(right.storyId);
	});
}

async function loadStoriesForSeries(seriesId, seriesData) {
	const seriesDir = path.join(contentRoot, seriesId);
	const childDirs = await listDirectories(seriesDir);
	const stories = [];

	for (const child of childDirs) {
		const storyDir = path.join(seriesDir, child);
		const storyPath = path.join(storyDir, 'story.json');
		if (!(await pathExists(storyPath))) continue;

		const storyJson = await readJson(storyPath);
		const seriesStoryMetadata = lookupSeriesStoryMetadata(seriesData, child, storyJson);
		const storyId = storyJson.id || seriesStoryMetadata?.id || child;
		const storyTitle = storyJson.title || seriesStoryMetadata?.title || toTitleCase(storyId);
		const storyDescription = storyJson.description || seriesStoryMetadata?.description || '';

		const chapterDefinitions = Array.isArray(storyJson.chapters) ? storyJson.chapters : [];
		const chapters = [];

		if (chapterDefinitions.length > 0) {
			for (let index = 0; index < chapterDefinitions.length; index += 1) {
				const chapter = chapterDefinitions[index];
				const chapterId = chapter.id ?? index + 1;
				const chapterTitle = chapter.title || toTitleCase(path.basename(chapter.file || '', '.md'));
				const chapterFile = chapter.file || `chapter-${chapterId}.md`;
				const chapterPath = path.join(storyDir, chapterFile);
				const markdown = await fs.readFile(chapterPath, 'utf8');

				chapters.push({
					id: chapterId,
					title: chapterTitle,
					file: chapterFile,
					markdown
				});
			}
		} else {
			const files = (await fs.readdir(storyDir))
				.filter((name) => name.endsWith('.md'))
				.sort((left, right) => left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' }));
			for (let index = 0; index < files.length; index += 1) {
				const chapterFile = files[index];
				const chapterPath = path.join(storyDir, chapterFile);
				const markdown = await fs.readFile(chapterPath, 'utf8');
				const match = chapterFile.match(/chapter-(\d+)/i);
				const chapterId = match ? Number.parseInt(match[1], 10) : index + 1;
				chapters.push({
					id: chapterId,
					title: toTitleCase(path.basename(chapterFile, '.md')),
					file: chapterFile,
					markdown
				});
			}
		}

		stories.push({
			seriesId,
			seriesTitle: seriesData?.title || toTitleCase(seriesId),
			storyId,
			storyFolder: child,
			title: storyTitle,
			description: storyDescription,
			author: storyJson.author || 'Roughdraft Stories',
			language: storyJson.language || defaultLanguage,
			chapters
		});
	}

	return sortStories(stories, seriesData);
}

async function discoverSeries() {
	const seriesIds = await listDirectories(contentRoot);
	const seriesRecords = [];

	for (const seriesId of seriesIds) {
		const seriesDir = path.join(contentRoot, seriesId);
		const seriesJsonPath = path.join(seriesDir, 'series.json');
		const seriesData = (await pathExists(seriesJsonPath)) ? await readJson(seriesJsonPath) : null;
		const stories = await loadStoriesForSeries(seriesId, seriesData);
		if (stories.length === 0) continue;

		seriesRecords.push({
			seriesId,
			seriesTitle: seriesData?.title || toTitleCase(seriesId),
			seriesDescription: seriesData?.description || '',
			seriesData,
			stories
		});
	}

	return seriesRecords.sort((left, right) => left.seriesId.localeCompare(right.seriesId));
}

function renderStoryMarkdown(story, options = {}) {
	const parts = [
		buildFrontmatter({
			title: story.title,
			author: story.author,
			language: story.language,
			rights: story.author
		})
	];

	if (options.includeDescription && story.description) {
		parts.push('## Description');
		parts.push('');
		parts.push(story.description.trim());
		parts.push('');
	}

	for (const chapter of story.chapters) {
		parts.push(normalizeChapterMarkdown(chapter.markdown, chapter.id, chapter.title));
		parts.push('');
	}

	return parts.join('\n').trim() + '\n';
}

function renderSeriesCollectionMarkdown(series, options = {}) {
	const collectionTitle = `${series.seriesTitle}: Complete Collection`;
	const parts = [
		buildFrontmatter({
			title: collectionTitle,
			author: 'Roughdraft Stories',
			language: defaultLanguage,
			rights: 'Roughdraft Stories'
		})
	];

	if (options.includeDescription && series.seriesDescription) {
		parts.push('## Description');
		parts.push('');
		parts.push(series.seriesDescription.trim());
		parts.push('');
	}

	for (const story of series.stories) {
		parts.push(`# ${story.title}`);
		parts.push('');
		if (story.description) {
			parts.push(story.description.trim());
			parts.push('');
		}

		for (const chapter of story.chapters) {
			const normalizedChapter = normalizeChapterMarkdown(chapter.markdown, chapter.id, chapter.title);
			parts.push(demoteMarkdownHeadings(normalizedChapter, 1));
			parts.push('');
		}
	}

	return parts.join('\n').trim() + '\n';
}

function ensurePandocInstalled() {
	const check = spawnSync('pandoc', ['--version'], { stdio: 'ignore' });
	if (check.status !== 0) {
		throw new Error('pandoc is required but was not found on PATH.');
	}
}

function runPandoc(markdownPath, epubPath, options = {}) {
	const pandocArgs = [markdownPath, '-o', epubPath, '--split-level=1'];
	if (options.includeToc) {
		pandocArgs.push('--toc');
	}

	const result = spawnSync('pandoc', pandocArgs, {
		encoding: 'utf8'
	});

	if (result.status !== 0) {
		throw new Error(result.stderr || result.stdout || `pandoc failed for ${epubPath}`);
	}
}

async function writeEpub(markdown, epubPath, tempRoot, options = {}) {
	await fs.mkdir(path.dirname(epubPath), { recursive: true });
	await fs.mkdir(tempRoot, { recursive: true });
	const tempMarkdownPath = path.join(tempRoot, `${slugify(path.basename(epubPath, '.epub'))}.md`);
	await fs.writeFile(tempMarkdownPath, markdown, 'utf8');
	runPandoc(tempMarkdownPath, epubPath, options);
}

function selectSeries(seriesRecords, options) {
	if (options.all) return seriesRecords;
	if (options.series.length === 0) return seriesRecords;
	const targetIds = new Set(options.series);
	return seriesRecords.filter((series) => targetIds.has(series.seriesId));
}

async function generate(options) {
	ensurePandocInstalled();
	const outputRoot = path.resolve(options.output);
	const tempRoot = path.join(outputRoot, '.tmp');
	const seriesRecords = selectSeries(await discoverSeries(), options);
	const failures = [];
	const generated = [];

	if (seriesRecords.length === 0) {
		throw new Error('No matching series found.');
	}

	for (const series of seriesRecords) {
		if (!options.collectionOnly) {
			for (const story of series.stories) {
				const storyMarkdown = renderStoryMarkdown(story, options);
				const storyFileName = `${slugify(story.storyId)}.epub`;
				const storyEpubPath = path.join(outputRoot, 'stories', series.seriesId, storyFileName);
				try {
					await writeEpub(storyMarkdown, storyEpubPath, tempRoot, options);
					generated.push({
						type: 'story',
						seriesId: series.seriesId,
						storyId: story.storyId,
						file: path.relative(projectRoot, storyEpubPath)
					});
					console.log(`✓ story: ${series.seriesId}/${story.storyId}`);
				} catch (error) {
					failures.push(`${series.seriesId}/${story.storyId} -> ${error.message}`);
					console.error(`✗ story failed: ${series.seriesId}/${story.storyId}`);
				}
			}
		}

		if (options.withCollections) {
			const collectionMarkdown = renderSeriesCollectionMarkdown(series, options);
			const collectionFileName = `${slugify(series.seriesId)}-complete-collection.epub`;
			const collectionEpubPath = path.join(outputRoot, 'collections', collectionFileName);
			try {
				await writeEpub(collectionMarkdown, collectionEpubPath, tempRoot, options);
				generated.push({
					type: 'collection',
					seriesId: series.seriesId,
					storyId: null,
					file: path.relative(projectRoot, collectionEpubPath)
				});
				console.log(`✓ collection: ${series.seriesId}`);
			} catch (error) {
				failures.push(`${series.seriesId} collection -> ${error.message}`);
				console.error(`✗ collection failed: ${series.seriesId}`);
			}
		}
	}

	await fs.mkdir(outputRoot, { recursive: true });
	const manifestPath = path.join(outputRoot, 'manifest.json');
	await fs.writeFile(
		manifestPath,
		JSON.stringify(
			{
				generatedAt: new Date().toISOString(),
				totalGenerated: generated.length,
				totalFailures: failures.length,
				files: generated,
				failures
			},
			null,
			2
		),
		'utf8'
	);

	// Keep the latest markdown artifacts for troubleshooting small and contained.
	await fs.rm(tempRoot, { recursive: true, force: true });

	console.log('\nEPUB generation complete');
	console.log(`Generated: ${generated.length}`);
	console.log(`Failures: ${failures.length}`);
	console.log(`Manifest: ${path.relative(projectRoot, manifestPath)}`);

	if (failures.length > 0) {
		process.exitCode = 1;
	}
}

async function main() {
	const argv = await yargs(hideBin(process.argv))
		.scriptName('generate-epub')
		.command(
			'generate',
			'Generate EPUB files for stories and collections',
			(command) =>
				command
					.option('all', {
						type: 'boolean',
						default: true,
						describe: 'Generate for all series'
					})
					.option('series', {
						type: 'array',
						string: true,
						default: [],
						describe: 'Generate for specific series id(s), e.g. --series history-close-up'
					})
					.option('output', {
						type: 'string',
						default: defaultOutputRoot,
						describe: 'Output directory for generated EPUB files'
					})
					.option('with-collections', {
						type: 'boolean',
						default: true,
						describe: 'Also generate one combined collection EPUB per series'
					})
					.option('collection-only', {
						type: 'boolean',
						default: false,
						describe: 'Generate only series collections (skip per-story EPUBs)'
					})
					.option('include-description', {
						type: 'boolean',
						default: false,
						describe: 'Include visible description pages in generated EPUB content'
					})
					.option('include-toc', {
						type: 'boolean',
						default: false,
						describe: 'Include a generated table of contents page in the EPUB body'
					}),
			(args) => generate(args)
		)
		.demandCommand(1)
		.strict()
		.help()
		.parse();

	return argv;
}

main().catch((error) => {
	console.error(`\nEPUB generation failed: ${error.message}`);
	process.exit(1);
});
