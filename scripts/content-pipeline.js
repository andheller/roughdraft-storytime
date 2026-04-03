import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CONTENT_ROOT = path.resolve('src/content/books');
const STATIC_ROOT = path.resolve('static');
const GENERATED_ROOT = path.resolve('src/lib/generated');
const STORIES_OUTPUT_ROOT = path.join(GENERATED_ROOT, 'stories');
const INDEX_OUTPUT_FILE = path.join(GENERATED_ROOT, 'content-index.js');
const AUDIO_ROOT = path.join(STATIC_ROOT, 'audio');

const COVER_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
const BOOK_PALETTES = [
	{ color: '#8B4513', leatherColor: 'hsl(25, 70%, 35%)' },
	{ color: '#2E8B57', leatherColor: 'hsl(146, 50%, 36%)' },
	{ color: '#4682B4', leatherColor: 'hsl(207, 44%, 49%)' },
	{ color: '#C47A2C', leatherColor: 'hsl(32, 63%, 47%)' },
	{ color: '#7A6A4F', leatherColor: 'hsl(39, 21%, 40%)' },
	{ color: '#7FB6D6', leatherColor: 'hsl(204, 49%, 55%)' },
	{ color: '#D48B3A', leatherColor: 'hsl(32, 64%, 53%)' },
	{ color: '#4FA3D9', leatherColor: 'hsl(202, 65%, 47%)' },
	{ color: '#F28C8C', leatherColor: 'hsl(0, 76%, 75%)' },
	{ color: '#6B7280', leatherColor: 'hsl(220, 9%, 46%)' }
];

function hashString(value) {
	let hash = 0;
	for (let index = 0; index < value.length; index += 1) {
		hash = (hash << 5) - hash + value.charCodeAt(index);
		hash |= 0;
	}
	return Math.abs(hash);
}

function toTitleCase(value) {
	return value
		.split('-')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function compareNatural(left, right) {
	return left.localeCompare(right, undefined, {
		numeric: true,
		sensitivity: 'base'
	});
}

async function pathExists(targetPath) {
	try {
		await fs.access(targetPath);
		return true;
	} catch {
		return false;
	}
}

async function readJson(filePath) {
	return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function walk(directoryPath) {
	const entries = await fs.readdir(directoryPath, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const entryPath = path.join(directoryPath, entry.name);
			if (entry.isDirectory()) {
				return walk(entryPath);
			}
			return [entryPath];
		})
	);

	return files.flat();
}

async function listFiles(directoryPath, predicate) {
	if (!(await pathExists(directoryPath))) {
		return [];
	}

	const files = await walk(directoryPath);
	return files.filter(predicate).sort(compareNatural);
}

function deriveEmoji(story) {
	const haystack = `${story.genre || ''} ${(story.tags || []).join(' ')} ${story.title || ''}`.toLowerCase();

	if (haystack.includes('dragon')) return '🐉';
	if (haystack.includes('space') || haystack.includes('rocket')) return '🚀';
	if (haystack.includes('history') || haystack.includes('revolution')) return '🏛️';
	if (haystack.includes('mystery')) return '🕵️';
	if (haystack.includes('fantasy')) return '✨';
	if (haystack.includes('science')) return '🔬';
	if (haystack.includes('humor') || haystack.includes('comedy')) return '😄';
	if (haystack.includes('music')) return '🎵';
	if (haystack.includes('winter') || haystack.includes('snow')) return '❄️';
	if (haystack.includes('animal') || haystack.includes('pet')) return '🐾';
	return '📚';
}

async function resolveCoverImage(seriesId, storyId, storyData) {
	if (storyData.coverImage) {
		const coverPath = storyData.coverImage.startsWith('/')
			? path.join(STATIC_ROOT, storyData.coverImage.slice(1))
			: path.join(STATIC_ROOT, storyData.coverImage);
		if (await pathExists(coverPath)) {
			return storyData.coverImage;
		}
	}

	for (const candidate of [storyId, seriesId]) {
		for (const extension of COVER_EXTENSIONS) {
			const relativePath = `/covers/${candidate}${extension}`;
			if (await pathExists(path.join(STATIC_ROOT, 'covers', `${candidate}${extension}`))) {
				return relativePath;
			}
		}
	}

	return null;
}

function deriveBookshelfData(story, position) {
	const hash = hashString(`${story.seriesId}/${story.storyId}`);
	const palette = BOOK_PALETTES[hash % BOOK_PALETTES.length];

	return {
		id: `${story.seriesId}--${story.storyId}`,
		title: story.title,
		author: story.author,
		description: story.description,
		seriesId: story.seriesId,
		seriesTitle: story.seriesTitle,
		storyId: story.storyId,
		genre: story.genre,
		tags: story.tags,
		hasAudio: Boolean(story.audio?.available),
		standalone: story.standalone,
		color: palette.color,
		leatherColor: palette.leatherColor,
		emoji: deriveEmoji(story),
		coverImage: story.coverImage,
		height: 236 + (hash % 28),
		thickness: 48 + (story.chapters.length % 8) * 3 + (hash % 4),
		tilt: (hash % 7) - 3,
		sortKey: `${String(position).padStart(4, '0')}-${story.seriesId}-${story.storyId}`
	};
}

async function loadNarration(storyDirectory, chapterId, chapterFile) {
	const narrationDirectory = path.join(storyDirectory, 'narration');
	if (!(await pathExists(narrationDirectory))) {
		return null;
	}

	const basename = path.basename(chapterFile, path.extname(chapterFile));
	const candidates = [`${basename}.txt`];

	if (typeof chapterId === 'number') {
		candidates.push(`chapter-${chapterId}.txt`);
	}

	for (const filename of candidates) {
		const narrationPath = path.join(narrationDirectory, filename);
		if (await pathExists(narrationPath)) {
			return {
				file: path.posix.join('narration', filename),
				text: await fs.readFile(narrationPath, 'utf8')
			};
		}
	}

	return null;
}

async function loadAssets(storyDirectory) {
	const manifestPath = path.join(storyDirectory, 'assets.json');
	if (await pathExists(manifestPath)) {
		return readJson(manifestPath);
	}

	const assetDirectory = path.join(storyDirectory, 'assets');
	if (!(await pathExists(assetDirectory))) {
		return [];
	}

	const files = await listFiles(assetDirectory, () => true);
	return files.map((filePath) => ({
		id: path.basename(filePath, path.extname(filePath)),
		path: path.posix.join(
			'/content-assets',
			path.relative(path.resolve('src/content/books'), filePath).split(path.sep).join('/')
		)
	}));
}

async function loadAudioManifestMap() {
	const audioManifestFiles = await listFiles(
		AUDIO_ROOT,
		(filePath) => path.basename(filePath) === 'audio-manifest.json'
	);

	return new Map(
		await Promise.all(
			audioManifestFiles.map(async (manifestPath) => {
				const relativeParts = path.relative(AUDIO_ROOT, manifestPath).split(path.sep);
				if (relativeParts.length < 3) {
					return null;
				}

				const [seriesId, storyId] = relativeParts;
				const manifest = await readJson(manifestPath);

				return [
					`${seriesId}/${storyId}`,
					{
						available: true,
						voice: manifest.voice,
						model: manifest.model,
						generatedAt: manifest.generatedAt,
						chapters: (manifest.chapters || []).map((chapter) => ({
							id: chapter.id,
							audioUrl: `/audio/${seriesId}/${storyId}/${chapter.filename}`
						}))
					}
				];
			})
		).then((entries) => entries.filter(Boolean))
	);
}

function getStoryModuleFileName(story) {
	return `${story.seriesId}__${story.storyId}.js`;
}

function toStorySummary(story) {
	return {
		seriesId: story.seriesId,
		storyId: story.storyId,
		storyKey: story.storyKey,
		seriesTitle: story.seriesTitle,
		seriesDescription: story.seriesDescription,
		title: story.title,
		author: story.author,
		description: story.description,
		ageRange: story.ageRange,
		genre: story.genre,
		tags: story.tags,
		coverImage: story.coverImage,
		chapterCount: story.chapterCount,
		audio: story.audio,
		hasAudio: Boolean(story.audio?.available),
		standalone: story.standalone,
		hasNarration: story.narration.hasNarration,
		assets: Array.isArray(story.assets) ? story.assets : []
	};
}

async function loadChapters(storyDirectory, chapterDefinitions = []) {
	if (chapterDefinitions.length > 0) {
		return Promise.all(
			chapterDefinitions.map(async (chapterDefinition, index) => {
				const chapterFile = chapterDefinition.file;
				const chapterPath = path.join(storyDirectory, chapterFile);
				const markdown = await fs.readFile(chapterPath, 'utf8');
				const chapterId = chapterDefinition.id ?? index + 1;

				return {
					id: chapterId,
					number: typeof chapterId === 'number' ? chapterId : index + 1,
					title: chapterDefinition.title || toTitleCase(path.basename(chapterFile, '.md')),
					file: chapterFile,
					markdown,
					narration: await loadNarration(storyDirectory, chapterId, chapterFile)
				};
			})
		);
	}

	const markdownFiles = await listFiles(
		storyDirectory,
		(filePath) => filePath.endsWith('.md') && !filePath.includes(`${path.sep}narration${path.sep}`)
	);

	return Promise.all(
		markdownFiles.map(async (chapterPath, index) => {
			const chapterFile = path.basename(chapterPath);
			const markdown = await fs.readFile(chapterPath, 'utf8');
			const match = chapterFile.match(/chapter-(\d+)/i);
			const chapterId = match ? Number.parseInt(match[1], 10) : index + 1;

			return {
				id: chapterId,
				number: typeof chapterId === 'number' ? chapterId : index + 1,
				title: toTitleCase(path.basename(chapterFile, '.md')),
				file: chapterFile,
				markdown,
				narration: await loadNarration(storyDirectory, chapterId, chapterFile)
			};
		})
	);
}

async function buildContentGraph() {
	const storyFiles = await listFiles(CONTENT_ROOT, (filePath) => path.basename(filePath) === 'story.json');
	const seriesFiles = await listFiles(CONTENT_ROOT, (filePath) => path.basename(filePath) === 'series.json');
	const audioManifestMap = await loadAudioManifestMap();

	const seriesMetadata = new Map(
		await Promise.all(
			seriesFiles.map(async (filePath) => {
				const relativeParts = path.relative(CONTENT_ROOT, filePath).split(path.sep);
				const seriesId = relativeParts[0];
				return [seriesId, await readJson(filePath)];
			})
		)
	);

	const stories = [];

	for (const storyFile of storyFiles) {
		const relativeParts = path.relative(CONTENT_ROOT, storyFile).split(path.sep);
		const storyData = await readJson(storyFile);

		if (relativeParts.length < 2 || relativeParts.length > 3) {
			continue;
		}

		const standalone = relativeParts.length === 2;
		const seriesId = relativeParts[0];
		const storyFolder = standalone ? relativeParts[0] : relativeParts[1];
		const storyDirectory = path.dirname(storyFile);
		const seriesData = seriesMetadata.get(seriesId);
		const seriesStoryData = seriesData?.stories?.find(
			(entry) => entry.id === storyData.id || entry.id === storyFolder || entry.folder === storyFolder
		);
		const storyId = storyData.id || seriesStoryData?.id || storyFolder;
		const title = storyData.title || seriesStoryData?.title || toTitleCase(storyId);
		const description = storyData.description || seriesStoryData?.description || seriesData?.description || '';
		const chapters = await loadChapters(storyDirectory, storyData.chapters || []);
		const assets = await loadAssets(storyDirectory);
		const audio = audioManifestMap.get(`${seriesId}/${storyId}`) || null;

		stories.push({
			seriesId,
			storyId,
			storyKey: `${seriesId}/${storyId}`,
			seriesTitle: seriesData?.title || title,
			seriesDescription: seriesData?.description || description,
			title,
			author: storyData.author || 'Roughdraft Stories',
			description,
			ageRange: storyData.ageRange || null,
			genre: storyData.genre || null,
			tags: storyData.tags || [],
			coverImage: await resolveCoverImage(seriesId, storyId, storyData),
			chapters,
			chapterCount: chapters.length,
			audio,
			narration: {
				hasNarration: chapters.some((chapter) => chapter.narration),
				chapters: chapters
					.filter((chapter) => chapter.narration)
					.map((chapter) => ({
						id: chapter.id,
						title: chapter.title,
						file: chapter.narration.file,
						text: chapter.narration.text
					}))
			},
			assets,
			standalone
		});
	}

	stories.sort((left, right) => {
		const seriesCompare = compareNatural(left.seriesId, right.seriesId);
		if (seriesCompare !== 0) return seriesCompare;

		const leftSeries = seriesMetadata.get(left.seriesId);
		const rightSeries = seriesMetadata.get(right.seriesId);
		const leftIndex =
			leftSeries?.stories?.findIndex((entry) => entry.id === left.storyId || entry.folder === left.storyId) ?? -1;
		const rightIndex =
			rightSeries?.stories?.findIndex((entry) => entry.id === right.storyId || entry.folder === right.storyId) ?? -1;

		if (leftIndex !== rightIndex && leftIndex !== -1 && rightIndex !== -1) {
			return leftIndex - rightIndex;
		}

		return compareNatural(left.storyId, right.storyId);
	});

	const series = Array.from(
		stories.reduce((accumulator, story) => {
			if (!accumulator.has(story.seriesId)) {
				accumulator.set(story.seriesId, {
					id: story.seriesId,
					title: story.seriesTitle,
					description: story.seriesDescription,
					stories: []
				});
			}

			accumulator.get(story.seriesId).stories.push({
				storyId: story.storyId,
				title: story.title,
				description: story.description,
				author: story.author,
				coverImage: story.coverImage,
				chapterCount: story.chapterCount,
				tags: story.tags
			});

			return accumulator;
		}, new Map()).values()
	).map((seriesEntry) => ({
		...seriesEntry,
		storyCount: seriesEntry.stories.length
	}));

	const books = stories.map((story, index) => deriveBookshelfData(story, index)).sort((a, b) => compareNatural(a.sortKey, b.sortKey));

	const routes = stories.map((story) => ({
		seriesId: story.seriesId,
		storyId: story.storyId
	}));

	return {
		generatedAt: new Date().toISOString(),
		stats: {
			seriesCount: series.length,
			storyCount: stories.length,
			chapterCount: stories.reduce((total, story) => total + story.chapterCount, 0)
		},
		series,
		stories,
		books,
		routes
	};
}

export async function generateContentArtifacts() {
	const manifest = await buildContentGraph();
	const storySummaries = manifest.stories.map(toStorySummary);
	const storyModuleMap = Object.fromEntries(
		manifest.stories.map((story) => [story.storyKey, `./stories/${getStoryModuleFileName(story)}`])
	);
	const indexManifest = {
		generatedAt: manifest.generatedAt,
		stats: manifest.stats,
		series: manifest.series,
		stories: storySummaries,
		books: manifest.books,
		routes: manifest.routes
	};
	const indexContents =
		`// This file is auto-generated by scripts/content-pipeline.js.\n` +
		`// Do not edit by hand.\n\n` +
		`export const contentIndex = ${JSON.stringify(indexManifest)};\n` +
		`export const bookshelfBooks = contentIndex.books;\n` +
		`export const routeEntries = contentIndex.routes;\n` +
		`export const storySummaries = contentIndex.stories;\n` +
		`export const storyModules = {\n` +
		Object.entries(storyModuleMap)
			.map(
				([storyKey, relativePath]) =>
					`  ${JSON.stringify(storyKey)}: () => import(${JSON.stringify(relativePath)})`
			)
			.join(',\n') +
		`\n};\n`;

	await fs.mkdir(GENERATED_ROOT, { recursive: true });
	await fs.rm(STORIES_OUTPUT_ROOT, { recursive: true, force: true });
	await fs.mkdir(STORIES_OUTPUT_ROOT, { recursive: true });
	await fs.writeFile(INDEX_OUTPUT_FILE, indexContents, 'utf8');

	await Promise.all(
		manifest.stories.map(async (story) => {
			const moduleContents =
				`// This file is auto-generated by scripts/content-pipeline.js.\n` +
				`// Do not edit by hand.\n\n` +
				`export const story = ${JSON.stringify(story)};\n`;

			await fs.writeFile(
				path.join(STORIES_OUTPUT_ROOT, getStoryModuleFileName(story)),
				moduleContents,
				'utf8'
			);
		})
	);

	return manifest;
}

export function contentPipelinePlugin() {
	const watchedRoots = [CONTENT_ROOT, path.join(STATIC_ROOT, 'covers'), AUDIO_ROOT];

	return {
		name: 'roughdraft-content-pipeline',
		async buildStart() {
			await generateContentArtifacts();
		},
		configureServer(server) {
			for (const watchedRoot of watchedRoots) {
				server.watcher.add(watchedRoot);
			}

			const regenerate = async (changedPath) => {
				if (!changedPath.includes(`${path.sep}src${path.sep}content${path.sep}books${path.sep}`) &&
					!changedPath.includes(`${path.sep}static${path.sep}covers${path.sep}`) &&
					!changedPath.includes(`${path.sep}static${path.sep}audio${path.sep}`)) {
					return;
				}

				await generateContentArtifacts();
				server.ws.send({ type: 'full-reload' });
			};

			server.watcher.on('add', regenerate);
			server.watcher.on('change', regenerate);
			server.watcher.on('unlink', regenerate);
		}
	};
}

const thisFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(thisFilePath)) {
	await generateContentArtifacts();
}
