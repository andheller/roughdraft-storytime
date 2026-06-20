<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getBookshelfBooks } from '$lib/content-loader.js';
	import {
		absoluteUrl,
		DEFAULT_OG_IMAGE,
		HOME_DESCRIPTION,
		HOME_TITLE,
		SITE_NAME,
		SITE_URL
	} from '$lib/site.js';

	const bookList = getBookshelfBooks();
	const filterDefinitions = [
		{ id: 'all', label: 'All Stories', description: 'Everything on the shelf' },
		{ id: 'audio', label: 'Read + Listen', description: 'Stories with audio' },
		{ id: 'silly', label: 'Silly', description: 'Maximum squirrel energy' },
		{ id: 'history', label: 'History', description: 'Past worlds and real events' },
		{ id: 'funny', label: 'Funny', description: 'Comedy and chaos' },
		{ id: 'adventure', label: 'Adventure', description: 'Big journeys and big problems' },
		{ id: 'standalone', label: 'Standalone', description: 'Single-book stories' }
	];
	const FEATURED_BOOK_KEYS = [
		'dust-calloway-and-the-sky-coach-robbers/dust-calloway-and-the-sky-coach-robbers',
		'the-delivery-drone-that-wouldnt-leave/the-delivery-drone-that-wouldnt-leave',
		'the-dragon-who-breathed-bubbles/the-dragon-who-breathed-bubbles',
		'silly-squirrels/the-silly-squirrels-pizza-jetpack-delivery'
	];
	const FILTER_EMOJI = {
		all: '📚',
		audio: '♪',
		silly: '🐿️',
		history: '🏛️',
		funny: '😄',
		adventure: '🗺️',
		standalone: '📖'
	};
	const MAX_VISIBLE_PAGE_BUTTONS = 5;
	const HOME_LOGO = {
		src: '/logo-sign.webp',
		srcset:
			'/optimized/logo-sign-320.webp 320w, /optimized/logo-sign-480.webp 480w, /optimized/logo-sign-640.webp 640w, /logo-sign.webp 1536w',
		sizes: '(max-width: 480px) 92vw, 520px',
		width: 1536,
		height: 1024
	};
	const HOME_THEME_STORAGE_KEY = 'roughdraft-home-theme';
	const STAGE_RATIO_STANDARD = 1586 / 992;
	const STAGE_RATIO_PILLOW = 1606 / 979;
	const STAGE_RATIO_WIDE = 1672 / 941;

	function stageTheme({
		id,
		name,
		image,
		backdrop,
		positionMobile = '50% top',
		artRatio = STAGE_RATIO_STANDARD,
		centerWash = 'rgba(255, 248, 232, 0.66)',
		edgeWash = 'rgba(70, 54, 32, 0.08)',
		topWash = 'rgba(255, 249, 229, 0.15)',
		bottomWash = 'rgba(87, 62, 34, 0.1)',
		heading = '#352b1f',
		accent = '#b47c26',
		ink = '#324f61'
	}) {
		return {
			id,
			name,
			image,
			backdrop,
			positionDesktop: 'center top',
			positionMobile,
			artRatio,
			centerWash,
			edgeWash,
			topWash,
			bottomWash,
			ink,
			heading,
			accent
		};
	}

	const HOME_THEMES = [
		stageTheme({
			id: 'paper-stage',
			name: 'Plain Paper',
			image: null,
			backdrop: '#fffaf0',
			positionMobile: '50% top',
			artRatio: STAGE_RATIO_STANDARD,
			centerWash: 'rgba(255, 253, 246, 0.34)',
			edgeWash: 'rgba(109, 77, 35, 0.03)',
			topWash: 'rgba(255, 255, 255, 0.08)',
			bottomWash: 'rgba(116, 83, 45, 0.05)',
			ink: '#4e5d6d',
			heading: '#352b1f',
			accent: '#b47c26'
		}),
		stageTheme({
			id: 'map-world',
			name: 'Adventure Map',
			image: '/home-stages/map-world.webp',
			backdrop: '#f4dfad',
			positionMobile: '18% top',
			artRatio: STAGE_RATIO_STANDARD,
			centerWash: 'rgba(255, 249, 232, 0.64)',
			edgeWash: 'rgba(76, 56, 28, 0.07)',
			topWash: 'rgba(255, 247, 219, 0.2)',
			bottomWash: 'rgba(65, 47, 23, 0.1)',
			ink: '#324f61',
			heading: '#332a20',
			accent: '#b47c26'
		}),
		stageTheme({
			id: 'cloud-treehouse',
			name: 'Cloud Treehouse',
			image: '/home-stages/cloud-treehouse.webp',
			backdrop: '#f7ead0',
			positionMobile: '20% top',
			artRatio: STAGE_RATIO_STANDARD,
			centerWash: 'rgba(255, 249, 232, 0.66)',
			edgeWash: 'rgba(43, 71, 54, 0.08)',
			topWash: 'rgba(255, 247, 225, 0.22)',
			bottomWash: 'rgba(72, 64, 34, 0.1)',
			ink: '#3f5e68',
			heading: '#342b20',
			accent: '#a97728'
		}),
		stageTheme({
			id: 'frontier-campfire',
			name: 'Frontier Campfire',
			image: '/home-stages/frontier-campfire.webp',
			backdrop: '#3a2c34',
			positionMobile: '18% top',
			artRatio: STAGE_RATIO_STANDARD,
			centerWash: 'rgba(255, 230, 190, 0.58)',
			edgeWash: 'rgba(42, 22, 18, 0.18)',
			topWash: 'rgba(38, 31, 66, 0.08)',
			bottomWash: 'rgba(42, 22, 12, 0.2)',
			ink: '#27445b',
			heading: '#3a2d21',
			accent: '#d08b36'
		}),
		stageTheme({
			id: 'notebook-desk',
			name: 'Notebook Desk',
			image: '/home-stages/notebook-desk.webp',
			backdrop: '#f6efe1',
			positionMobile: '82% top',
			artRatio: STAGE_RATIO_STANDARD,
			centerWash: 'rgba(255, 255, 255, 0.46)',
			edgeWash: 'rgba(46, 75, 96, 0.05)',
			topWash: 'rgba(255, 255, 255, 0.08)',
			bottomWash: 'rgba(93, 70, 42, 0.08)',
			ink: '#2e526b',
			heading: '#2e2720',
			accent: '#4f91c9'
		}),
		stageTheme({
			id: 'moonlit-library',
			name: 'Moonlit Library',
			image: '/home-stages/moonlit-library.webp',
			backdrop: '#1b2731',
			positionMobile: '18% top',
			artRatio: STAGE_RATIO_STANDARD,
			centerWash: 'rgba(255, 239, 202, 0.62)',
			edgeWash: 'rgba(4, 12, 18, 0.18)',
			topWash: 'rgba(18, 28, 42, 0.08)',
			bottomWash: 'rgba(18, 10, 6, 0.22)',
			ink: '#28485d',
			heading: '#3a2d21',
			accent: '#d39b4c'
		}),
		stageTheme({
			id: 'rocket-garden',
			name: 'Rocket Garden',
			image: '/home-stages/rocket-garden.webp',
			backdrop: '#192640',
			positionMobile: '82% top',
			artRatio: STAGE_RATIO_STANDARD,
			centerWash: 'rgba(255, 236, 199, 0.54)',
			edgeWash: 'rgba(9, 17, 34, 0.17)',
			topWash: 'rgba(16, 25, 50, 0.06)',
			bottomWash: 'rgba(31, 20, 28, 0.2)',
			ink: '#284961',
			heading: '#3a2d21',
			accent: '#dca24a'
		}),
		stageTheme({
			id: 'underwater-cove',
			name: 'Underwater Cove',
			image: '/home-stages/underwater-cove.webp',
			backdrop: '#dff4ee',
			positionMobile: '18% top',
			artRatio: STAGE_RATIO_STANDARD,
			centerWash: 'rgba(255, 249, 222, 0.62)',
			edgeWash: 'rgba(18, 102, 104, 0.1)',
			topWash: 'rgba(203, 246, 244, 0.18)',
			bottomWash: 'rgba(26, 120, 120, 0.1)',
			ink: '#28556b',
			heading: '#263a36',
			accent: '#1d92a0'
		}),
		stageTheme({
			id: 'pillow-fort',
			name: 'Pillow Fort',
			image: '/home-stages/pillow-fort.webp',
			backdrop: '#f7e7c8',
			positionMobile: '82% top',
			artRatio: STAGE_RATIO_PILLOW,
			centerWash: 'rgba(255, 246, 225, 0.58)',
			edgeWash: 'rgba(107, 54, 45, 0.09)',
			topWash: 'rgba(255, 238, 198, 0.12)',
			bottomWash: 'rgba(107, 54, 45, 0.12)',
			ink: '#3c5364',
			heading: '#352b1f',
			accent: '#c1763d'
		}),
		stageTheme({
			id: 'paper-theater',
			name: 'Paper Theater',
			image: '/home-stages/paper-theater.webp',
			backdrop: '#f5dfb4',
			positionMobile: '50% top',
			artRatio: STAGE_RATIO_STANDARD,
			centerWash: 'rgba(255, 237, 196, 0.48)',
			edgeWash: 'rgba(108, 37, 28, 0.16)',
			topWash: 'rgba(137, 48, 41, 0.05)',
			bottomWash: 'rgba(100, 56, 24, 0.14)',
			ink: '#3c5364',
			heading: '#3a2a1f',
			accent: '#bf4f35'
		}),
		stageTheme({
			id: 'lighthouse-cove',
			name: 'Lighthouse Cove',
			image: '/home-stages/lighthouse-cove.webp',
			backdrop: '#e7f0e8',
			positionMobile: '82% top',
			artRatio: STAGE_RATIO_STANDARD,
			centerWash: 'rgba(255, 248, 229, 0.66)',
			edgeWash: 'rgba(40, 93, 109, 0.1)',
			topWash: 'rgba(226, 244, 248, 0.14)',
			bottomWash: 'rgba(64, 98, 83, 0.09)',
			ink: '#2d5368',
			heading: '#2f2a21',
			accent: '#c97835'
		}),
		stageTheme({
			id: 'floating-observatory',
			name: 'Floating Observatory',
			image: '/home-stages/floating-observatory.webp',
			backdrop: '#242742',
			positionMobile: '20% top',
			artRatio: STAGE_RATIO_WIDE,
			centerWash: 'rgba(255, 238, 197, 0.58)',
			edgeWash: 'rgba(18, 18, 44, 0.2)',
			topWash: 'rgba(29, 30, 70, 0.06)',
			bottomWash: 'rgba(29, 19, 39, 0.22)',
			ink: '#284961',
			heading: '#3a2d21',
			accent: '#d5a34c'
		}),
		stageTheme({
			id: 'story-train',
			name: 'Story Train',
			image: '/home-stages/story-train.webp',
			backdrop: '#ead6b4',
			positionMobile: '82% top',
			artRatio: STAGE_RATIO_WIDE,
			centerWash: 'rgba(255, 240, 205, 0.54)',
			edgeWash: 'rgba(73, 48, 32, 0.14)',
			topWash: 'rgba(255, 238, 202, 0.12)',
			bottomWash: 'rgba(86, 58, 33, 0.16)',
			ink: '#344d5c',
			heading: '#352b1f',
			accent: '#b36f2a'
		}),
		stageTheme({
			id: 'garden-maze',
			name: 'Garden Maze',
			image: '/home-stages/garden-maze.webp',
			backdrop: '#eef3d7',
			positionMobile: '20% top',
			artRatio: STAGE_RATIO_WIDE,
			centerWash: 'rgba(255, 249, 225, 0.66)',
			edgeWash: 'rgba(58, 108, 61, 0.11)',
			topWash: 'rgba(232, 249, 205, 0.12)',
			bottomWash: 'rgba(68, 100, 50, 0.09)',
			ink: '#325465',
			heading: '#2e2b20',
			accent: '#6d993f'
		}),
		stageTheme({
			id: 'snowy-village',
			name: 'Snowy Village',
			image: '/home-stages/snowy-village.webp',
			backdrop: '#edf3ec',
			positionMobile: '82% top',
			artRatio: STAGE_RATIO_WIDE,
			centerWash: 'rgba(255, 248, 225, 0.66)',
			edgeWash: 'rgba(74, 94, 111, 0.09)',
			topWash: 'rgba(235, 248, 255, 0.12)',
			bottomWash: 'rgba(62, 89, 93, 0.09)',
			ink: '#31536a',
			heading: '#302b22',
			accent: '#b8473a'
		}),
		stageTheme({
			id: 'firefly-forest',
			name: 'Firefly Forest',
			image: '/home-stages/firefly-forest.webp',
			backdrop: '#263d31',
			positionMobile: '20% top',
			artRatio: STAGE_RATIO_WIDE,
			centerWash: 'rgba(255, 236, 194, 0.58)',
			edgeWash: 'rgba(8, 32, 24, 0.2)',
			topWash: 'rgba(29, 61, 46, 0.08)',
			bottomWash: 'rgba(20, 41, 27, 0.2)',
			ink: '#284961',
			heading: '#3a2d21',
			accent: '#c4a33d'
		}),
		stageTheme({
			id: 'pirate-cove',
			name: 'Pirate Cove',
			image: '/home-stages/pirate-cove.webp',
			backdrop: '#f2dcae',
			positionMobile: '82% top',
			artRatio: STAGE_RATIO_WIDE,
			centerWash: 'rgba(255, 246, 221, 0.62)',
			edgeWash: 'rgba(57, 85, 67, 0.12)',
			topWash: 'rgba(251, 235, 191, 0.12)',
			bottomWash: 'rgba(95, 64, 33, 0.11)',
			ink: '#2d5368',
			heading: '#312a20',
			accent: '#c98229'
		}),
		stageTheme({
			id: 'kitchen-lab',
			name: 'Kitchen Lab',
			image: '/home-stages/kitchen-lab.webp',
			backdrop: '#f8eac9',
			positionMobile: '18% top',
			artRatio: STAGE_RATIO_WIDE,
			centerWash: 'rgba(255, 248, 227, 0.6)',
			edgeWash: 'rgba(132, 67, 42, 0.1)',
			topWash: 'rgba(255, 243, 214, 0.12)',
			bottomWash: 'rgba(122, 75, 46, 0.1)',
			ink: '#344d5c',
			heading: '#342b20',
			accent: '#cc6d3a'
		}),
		stageTheme({
			id: 'rainy-attic',
			name: 'Rainy Attic',
			image: '/home-stages/rainy-attic.webp',
			backdrop: '#d9c7ae',
			positionMobile: '50% top',
			artRatio: STAGE_RATIO_WIDE,
			centerWash: 'rgba(255, 235, 198, 0.5)',
			edgeWash: 'rgba(47, 48, 61, 0.16)',
			topWash: 'rgba(60, 72, 90, 0.07)',
			bottomWash: 'rgba(75, 48, 29, 0.18)',
			ink: '#344d5c',
			heading: '#3a2d21',
			accent: '#ba7442'
		}),
		stageTheme({
			id: 'castle-meadow',
			name: 'Castle Meadow',
			image: '/home-stages/castle-meadow.webp',
			backdrop: '#f0e7bd',
			positionMobile: '82% top',
			artRatio: STAGE_RATIO_WIDE,
			centerWash: 'rgba(255, 248, 223, 0.64)',
			edgeWash: 'rgba(57, 101, 59, 0.11)',
			topWash: 'rgba(240, 248, 220, 0.12)',
			bottomWash: 'rgba(77, 101, 48, 0.09)',
			ink: '#31536a',
			heading: '#332a20',
			accent: '#b64937'
		}),
		stageTheme({
			id: 'paper-portal',
			name: 'Paper Portal',
			image: '/home-stages/paper-portal.webp',
			backdrop: '#f7ead3',
			positionMobile: '18% top',
			artRatio: STAGE_RATIO_WIDE,
			centerWash: 'rgba(255, 249, 232, 0.62)',
			edgeWash: 'rgba(56, 74, 88, 0.1)',
			topWash: 'rgba(255, 248, 229, 0.12)',
			bottomWash: 'rgba(90, 67, 43, 0.1)',
			ink: '#324f61',
			heading: '#312a20',
			accent: '#4f91c9'
		})
	];
	const homeCanonicalUrl = absoluteUrl('/');
	const homeStructuredData = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: HOME_TITLE,
		description: HOME_DESCRIPTION,
		url: homeCanonicalUrl,
		isPartOf: {
			'@type': 'WebSite',
			name: SITE_NAME,
			url: SITE_URL
		},
		about: [
			'Kids stories',
			'Read aloud stories',
			'Funny stories for kids',
			'Historical stories for kids'
		]
	});
	const homeStructuredDataScript =
		`<script type="application/ld+json">${homeStructuredData}</` + 'script>';
	const COVER_IMAGE_VARIANTS = {
		'/covers/silly-squirrels.jpg': {
			src: '/optimized/silly-squirrels-160.webp',
			srcset: '/optimized/silly-squirrels-160.webp 160w, /optimized/silly-squirrels-320.webp 320w',
			sizes: '(max-width: 480px) 120px, (max-width: 768px) 136px, 160px',
			width: 160,
			height: 213
		}
	};

	let activeFilter = $state('all');
	let searchQuery = $state('');
	let currentPage = $state(1);
	let previousResultKey = $state('');
	let activeHomeThemeIndex = $state(0);

	let featuredBooksPerShelf = $state(5);
	let viewportWidth = $state(1440);

	// Update books per shelf based on window size
	function updateBooksPerShelf() {
		if (typeof window === 'undefined') return;

		const width = window.innerWidth;
		viewportWidth = width;

		if (width < 640) {
			featuredBooksPerShelf = 2;
		} else if (width < 768) {
			featuredBooksPerShelf = 3;
		} else if (width < 1024) {
			featuredBooksPerShelf = 4;
		} else if (width < 1440) {
			featuredBooksPerShelf = 5;
		} else {
			featuredBooksPerShelf = 6;
		}
	}

	function isEditableShortcutTarget(target) {
		if (!(target instanceof Element)) return false;

		return Boolean(
			target.closest(
				'input, textarea, select, [contenteditable="true"], [contenteditable=""], [role="textbox"], [role="searchbox"]'
			)
		);
	}

	function handleHomeThemeKeydown(event) {
		if (
			event.defaultPrevented ||
			event.metaKey ||
			event.ctrlKey ||
			event.altKey ||
			event.shiftKey ||
			isEditableShortcutTarget(event.target)
		) {
			return;
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			cycleHomeTheme();
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			cycleHomeThemeBackward();
		}
	}

	onMount(() => {
		const storedTheme = Number(window.localStorage.getItem(HOME_THEME_STORAGE_KEY));
		if (Number.isInteger(storedTheme) && storedTheme >= 0 && storedTheme < HOME_THEMES.length) {
			activeHomeThemeIndex = storedTheme;
		}

		updateBooksPerShelf();
		window.addEventListener('resize', updateBooksPerShelf);
		window.addEventListener('keydown', handleHomeThemeKeydown);
		preloadHomeTheme(getNextHomeThemeIndex());
		preloadHomeTheme(getPreviousHomeThemeIndex());

		return () => {
			window.removeEventListener('resize', updateBooksPerShelf);
			window.removeEventListener('keydown', handleHomeThemeKeydown);
		};
	});

	$effect(() => {
		const resultKey = `${activeFilter}|${searchQuery.trim().toLowerCase()}`;
		if (resultKey === previousResultKey) return;

		previousResultKey = resultKey;
		currentPage = 1;
	});

	$effect(() => {
		if (currentPage > pageCount) {
			currentPage = pageCount;
		}
	});

	function selectBook(book) {
		goto(getBookHref(book));
	}

	function handleKeyDown(event, book) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectBook(book);
		}
	}

	function getDisplayHeight() {
		return 238;
	}

	function getDisplayWidth() {
		// Maintain ~2/3 aspect ratio
		return Math.round(getDisplayHeight() * 0.67);
	}

	function getDisplayDepth(book) {
		return Math.max(16, Math.round(book.thickness * 0.32));
	}

	function getStoriesPerPage() {
		return viewportWidth < 768 ? 8 : 12;
	}

	function setCatalogPage(page) {
		const nextPage = Math.max(1, Math.min(pageCount, page));
		if (nextPage === currentPage) return;

		currentPage = nextPage;

		if (browser) {
			requestAnimationFrame(() => {
				document.querySelector('[data-catalog-page]')?.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			});
		}
	}

	function getNextHomeThemeIndex() {
		return (activeHomeThemeIndex + 1) % HOME_THEMES.length;
	}

	function getPreviousHomeThemeIndex() {
		return (activeHomeThemeIndex - 1 + HOME_THEMES.length) % HOME_THEMES.length;
	}

	function preloadHomeTheme(themeIndex) {
		if (!browser) return;

		if (!HOME_THEMES[themeIndex]?.image) return;

		const image = new Image();
		image.src = HOME_THEMES[themeIndex].image;
	}

	function setHomeThemeIndex(themeIndex) {
		activeHomeThemeIndex = (themeIndex + HOME_THEMES.length) % HOME_THEMES.length;

		if (browser) {
			window.localStorage.setItem(HOME_THEME_STORAGE_KEY, String(activeHomeThemeIndex));
			preloadHomeTheme(getNextHomeThemeIndex());
			preloadHomeTheme(getPreviousHomeThemeIndex());
		}
	}

	function cycleHomeTheme() {
		setHomeThemeIndex(getNextHomeThemeIndex());
	}

	function cycleHomeThemeBackward() {
		setHomeThemeIndex(getPreviousHomeThemeIndex());
	}

	function getHomeThemeStyle(theme) {
		return [
			`--home-theme-image: ${theme.image ? `url('${theme.image}')` : 'none'}`,
			`--home-theme-backdrop: ${theme.backdrop}`,
			`--home-theme-position-desktop: ${theme.positionDesktop}`,
			`--home-theme-position-mobile: ${theme.positionMobile}`,
			`--stage-art-ratio: ${theme.artRatio}`,
			`--home-theme-center-wash: ${theme.centerWash}`,
			`--home-theme-edge-wash: ${theme.edgeWash}`,
			`--home-theme-top-wash: ${theme.topWash}`,
			`--home-theme-bottom-wash: ${theme.bottomWash}`,
			`--home-theme-ink: ${theme.ink}`,
			`--home-theme-heading: ${theme.heading}`,
			`--home-theme-accent: ${theme.accent}`
		].join('; ');
	}

	function getBookHref(book) {
		return `/${book.seriesId}/${book.storyId}`;
	}

	function getCoverImageProps(book) {
		return COVER_IMAGE_VARIANTS[book.coverImage] ?? null;
	}

	function getDisplayTilt(book) {
		return Math.max(-1, Math.min(1, book.tilt * 0.3));
	}

	function matchesBook(book, keywords) {
		const haystack = [
			book.title,
			book.description,
			book.seriesTitle,
			book.genre,
			...(book.tags || [])
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();

		return keywords.some((keyword) => haystack.includes(keyword));
	}

	function getBookKey(book) {
		return `${book.seriesId}/${book.storyId}`;
	}

	function getTableDescription(book) {
		if (!book.description) return '';
		if (book.description.length <= 82) return book.description;
		return `${book.description
			.slice(0, 79)
			.trimEnd()
			.replace(/[,\s]+$/, '')}...`;
	}

	function getTagPreview(book) {
		return (book.tags || []).slice(0, 2);
	}

	function searchMatches(book, query) {
		if (!query) return true;

		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) return true;

		return matchesBook(book, [normalizedQuery]);
	}

	function filterMatches(book, filterId) {
		switch (filterId) {
			case 'audio':
				return book.hasAudio;
			case 'silly':
				return matchesBook(book, ['silly', 'squirrel', 'nutville']);
			case 'history':
				return (
					book.seriesId === 'history-close-up' ||
					matchesBook(book, ['history', 'historical', 'revolution', 'rome'])
				);
			case 'funny':
				return matchesBook(book, ['comedy', 'humor', 'funny', 'silly']);
			case 'adventure':
				return matchesBook(book, ['adventure', 'mystery', 'fantasy', 'space']);
			case 'standalone':
				return book.standalone;
			default:
				return true;
		}
	}

	const availableFilters = $derived(
		filterDefinitions
			.map((filter) => ({
				...filter,
				count: bookList.filter((book) => filterMatches(book, filter.id)).length
			}))
			.filter((filter) => filter.id === 'all' || filter.count > 0)
	);

	const featuredBooks = $derived.by(() => {
		const bookLookup = new Map(bookList.map((book) => [getBookKey(book), book]));
		return FEATURED_BOOK_KEYS.map((key) => bookLookup.get(key)).filter(Boolean);
	});

	const featuredBookShelves = $derived.by(() => {
		// Balance shelves so the last one never holds a single stranded book (6 → 3+3, not 5+1)
		const shelfCount = Math.ceil(featuredBooks.length / featuredBooksPerShelf);
		const shelfSize = Math.ceil(featuredBooks.length / shelfCount);
		return Array.from({ length: shelfCount }, (_, shelfIndex) =>
			featuredBooks.slice(shelfIndex * shelfSize, (shelfIndex + 1) * shelfSize)
		);
	});

	const filteredBookList = $derived(
		bookList.filter((book) => filterMatches(book, activeFilter) && searchMatches(book, searchQuery))
	);

	const storiesPerPage = $derived(getStoriesPerPage());
	const pageCount = $derived(Math.max(1, Math.ceil(filteredBookList.length / storiesPerPage)));
	const pageStartIndex = $derived((currentPage - 1) * storiesPerPage);
	const pageEndIndex = $derived(Math.min(filteredBookList.length, currentPage * storiesPerPage));
	const pageShowingStart = $derived(filteredBookList.length === 0 ? 0 : pageStartIndex + 1);
	const visibleBookList = $derived(filteredBookList.slice(pageStartIndex, pageEndIndex));
	const paginationPages = $derived.by(() => {
		const visibleCount = Math.min(MAX_VISIBLE_PAGE_BUTTONS, pageCount);
		const half = Math.floor(visibleCount / 2);
		let start = Math.max(1, currentPage - half);
		let end = start + visibleCount - 1;

		if (end > pageCount) {
			end = pageCount;
			start = Math.max(1, end - visibleCount + 1);
		}

		return Array.from({ length: end - start + 1 }, (_, index) => start + index);
	});
	const activeHomeTheme = $derived(HOME_THEMES[activeHomeThemeIndex] ?? HOME_THEMES[0]);
</script>

<svelte:head>
	<title>{HOME_TITLE}</title>
	<meta name="description" content={HOME_DESCRIPTION} />
	<meta name="robots" content="index,follow,max-image-preview:large" />
	<link rel="canonical" href={homeCanonicalUrl} />
	<link
		rel="preload"
		as="image"
		href={HOME_LOGO.src}
		imagesrcset={HOME_LOGO.srcset}
		imagesizes={HOME_LOGO.sizes}
	/>
	<link rel="preload" as="image" href={HOME_THEMES[1].image} />
	<meta property="og:title" content={HOME_TITLE} />
	<meta property="og:description" content={HOME_DESCRIPTION} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={homeCanonicalUrl} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:image" content={DEFAULT_OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={HOME_TITLE} />
	<meta name="twitter:description" content={HOME_DESCRIPTION} />
	<meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html homeStructuredDataScript}
</svelte:head>

<div
	class="bookshelf-room"
	data-home-theme={activeHomeTheme.id}
	style={getHomeThemeStyle(activeHomeTheme)}
>
	{#snippet coverBook(book, variant)}
		<div class="book-item">
			<a
				href={getBookHref(book)}
				class="book-card covers {variant}"
				style="--book-color: {book.leatherColor}; --book-width: {getDisplayWidth(
					book
				)}px; --book-height: {getDisplayHeight(book)}px; --book-depth: {getDisplayDepth(
					book
				)}px; --book-lean: {getDisplayTilt(book)}deg;"
				onkeydown={(e) => handleKeyDown(e, book)}
				aria-label="Read {book.title}"
			>
				<span class="book-contact-shadow" aria-hidden="true"></span>
				<div class="book-3d-wrapper">
					<div class="book-cover-front">
						<div class="cover-texture">
							{#if book.coverImage}
								{@const coverImageProps = getCoverImageProps(book)}
								<div class="cover-art">
									<img
										src={coverImageProps?.src ?? book.coverImage}
										srcset={coverImageProps?.srcset}
										sizes={coverImageProps?.sizes}
										alt=""
										class="book-cover-image"
										width={coverImageProps?.width}
										height={coverImageProps?.height}
										loading="lazy"
										decoding="async"
									/>
									<div class="cover-scrim" aria-hidden="true"></div>
									<h3 class="book-title">{book.title}</h3>
								</div>
							{:else}
								<div class="classic-cover">
									<span class="classic-series">{book.seriesTitle}</span>
									<h3 class="book-title classic-title">{book.title}</h3>
									<span class="classic-emblem" aria-hidden="true">{book.emoji}</span>
									<span class="classic-foot">Roughdraft Storytime</span>
								</div>
							{/if}
							<div class="cover-gloss" aria-hidden="true"></div>
						</div>
					</div>
					<div class="book-pages-top" aria-hidden="true"></div>
					<div class="book-pages-right" aria-hidden="true"></div>
					<div class="book-pages-bottom" aria-hidden="true"></div>
					<div class="book-spine" aria-hidden="true"></div>
					<div class="book-back" aria-hidden="true"></div>
				</div>
			</a>
		</div>
	{/snippet}

	{#snippet woodenShelf()}
		<div class="wooden-shelf shelf-back-rail">
			<div class="shelf-surface"></div>
			<div class="shelf-bracket shelf-bracket-left"></div>
			<div class="shelf-bracket shelf-bracket-right"></div>
			<div class="shelf-shadow"></div>
		</div>
		<div class="wooden-shelf shelf-front-rail">
			<div class="shelf-lip"></div>
		</div>
	{/snippet}

	{#snippet emptyShelf()}
		<div class="empty-filter-state">
			<p class="empty-title"><span aria-hidden="true">🦉</span> Hoot — this shelf is empty.</p>
			<p class="empty-hint">No stories match right now. Try another shelf or clear your search.</p>
			<button
				type="button"
				class="read-book-button"
				onclick={() => {
					activeFilter = 'all';
					searchQuery = '';
					currentPage = 1;
				}}
			>
				Show every story
			</button>
		</div>
	{/snippet}

	{#snippet pageTurnIcon(direction)}
		<svg class="page-turn-icon" viewBox="0 0 16 16" aria-hidden="true">
			{#if direction === 'previous'}
				<path
					d="M9.8 3.2 5.1 8l4.7 4.8"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			{:else}
				<path
					d="m6.2 3.2 4.7 4.8-4.7 4.8"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			{/if}
		</svg>
	{/snippet}

	{#snippet paginationControl()}
		{#if filteredBookList.length > 0}
			<nav class="catalog-pagination" aria-label="Story catalog pages">
				<p>
					Page {currentPage} of {pageCount}
					<span aria-hidden="true">/</span>
					<span class="pagination-range">
						{pageShowingStart}-{pageEndIndex} of {filteredBookList.length}
					</span>
				</p>
				<div class="page-turn-buttons">
					<button
						type="button"
						class="page-turn-button icon-only"
						disabled={currentPage === 1}
						aria-label="Previous page"
						onclick={() => setCatalogPage(currentPage - 1)}
					>
						{@render pageTurnIcon('previous')}
					</button>
					{#each paginationPages as pageNumber (pageNumber)}
						<button
							type="button"
							class="page-turn-button page-number"
							class:active={pageNumber === currentPage}
							aria-current={pageNumber === currentPage ? 'page' : undefined}
							onclick={() => setCatalogPage(pageNumber)}
						>
							<span class="page-number-label">{pageNumber}</span>
						</button>
					{/each}
					<button
						type="button"
						class="page-turn-button icon-only"
						disabled={currentPage === pageCount}
						aria-label="Next page"
						onclick={() => setCatalogPage(currentPage + 1)}
					>
						{@render pageTurnIcon('next')}
					</button>
				</div>
			</nav>
		{/if}
	{/snippet}

	<div class="container">
		<section class="story-world-stage" aria-label="Featured story world">
			<div class="story-world-content">
				<header class="bookshelf-header">
					<div class="logo-container">
						<div class="logo-glow" aria-hidden="true"></div>
						<button
							type="button"
							class="logo-button"
							onclick={cycleHomeTheme}
							aria-label={`Try another story world. Current theme: ${activeHomeTheme.name}. Use left and right arrow keys to move through themes.`}
							title="Try another story world (Left/Right arrows)"
						>
							<img
								src={HOME_LOGO.src}
								srcset={HOME_LOGO.srcset}
								sizes={HOME_LOGO.sizes}
								width={HOME_LOGO.width}
								height={HOME_LOGO.height}
								alt="Roughdraft Storytime"
								class="logo"
								fetchpriority="high"
								loading="eager"
								decoding="async"
								draggable="false"
							/>
							<span class="logo-press-tab" aria-hidden="true">press</span>
						</button>
						<span class="sr-only" aria-live="polite">Story world: {activeHomeTheme.name}</span>
					</div>
					<h1 class="sr-only">{SITE_NAME}</h1>
				</header>

				{#if featuredBooks.length > 0}
					<section class="featured-shelf-section" aria-labelledby="featured-shelf-heading">
						<div class="featured-copy">
							<h2 id="featured-shelf-heading">Featured Favorites</h2>
							<svg class="head-doodle" viewBox="0 0 132 12" aria-hidden="true">
								<path
									d="M3 8 Q 20 3 37 7 T 70 7 T 102 6 T 129 7"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									stroke-linecap="round"
								/>
							</svg>
						</div>

						{#each featuredBookShelves as featuredShelf, shelfIndex (shelfIndex)}
							<div class="shelf-row featured-shelf-row">
								<div class="shelf-back-glow" aria-hidden="true"></div>

								{@render woodenShelf()}

								<div class="shelf-books covers-mode featured-shelf-books">
									{#each featuredShelf as book (book.id)}
										{@render coverBook(book, 'featured-book-card')}
									{/each}
								</div>
							</div>
						{/each}
					</section>
				{/if}

				<section class="bookshelf-controls" aria-label="Story filters">
					<div class="filter-chips" role="group" aria-label="Filter stories by shelf">
						{#each availableFilters as filter (filter.id)}
							<button
								type="button"
								class="filter-chip"
								class:active={activeFilter === filter.id}
								aria-pressed={activeFilter === filter.id}
								title={filter.description}
								onclick={() => (activeFilter = filter.id)}
							>
								<span class="chip-emoji" aria-hidden="true">{FILTER_EMOJI[filter.id] ?? '✨'}</span>
								<span>{filter.label}</span>
								<span class="chip-count">{filter.count}</span>
							</button>
						{/each}
					</div>

					<div class="control-search-row">
						<div class="search-box">
							<svg class="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
								<circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" stroke-width="2" />
								<path
									d="M13 13l4.5 4.5"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
							<input
								id="story-search"
								class="control-input"
								type="search"
								bind:value={searchQuery}
								placeholder="Search for a story, a place, a squirrel…"
								aria-label="Search titles, genres, tags, and descriptions"
								autocomplete="off"
							/>
						</div>
					</div>
				</section>
			</div>
		</section>

		<section
			class="story-table-shell catalog-page"
			id="story-table-view"
			data-catalog-page
			aria-label="Story list view"
		>
			<div class="ledger-paper">
				<div class="story-table-header">
					<div>
						<h2>Browse the catalog</h2>
						<p>
							Showing {pageShowingStart}-{pageEndIndex} of {filteredBookList.length}
							{filteredBookList.length === 1 ? 'story' : 'stories'}.
						</p>
					</div>
				</div>

				<div class="story-table-scroll">
					<table class="story-table">
						<thead>
							<tr>
								<th scope="col">Story</th>
								<th scope="col">Shelf</th>
								<th scope="col" class="table-action-heading">Open</th>
							</tr>
						</thead>
						<tbody>
							{#each visibleBookList as book (book.id)}
								<tr
									class="story-row-link"
									role="link"
									tabindex="0"
									aria-label={`Read ${book.title}`}
									onclick={() => selectBook(book)}
									onkeydown={(event) => handleKeyDown(event, book)}
								>
									<td>
										<div class="story-cell">
											<div
												class="story-cover-preview"
												style={`--cover-color: ${book.leatherColor};`}
											>
												<div class="story-mini-book">
													<div class="story-mini-cover">
														{#if book.coverImage}
															{@const coverImageProps = getCoverImageProps(book)}
															<img
																src={coverImageProps?.src ?? book.coverImage}
																srcset={coverImageProps?.srcset}
																sizes="62px"
																alt=""
																class="story-cover-image"
																width="62"
																height="82"
																loading="lazy"
																decoding="async"
															/>
														{:else}
															<div class="story-cover-fallback">
																<span aria-hidden="true">{book.emoji}</span>
															</div>
														{/if}
													</div>
													<div class="story-mini-pages" aria-hidden="true"></div>
													<div class="story-mini-spine" aria-hidden="true"></div>
												</div>
											</div>
											<div class="story-meta">
												<div class="story-title-line">
													{book.title}
												</div>
												<div class="story-subline">{getTableDescription(book)}</div>
												<a
													class="row-open-link story-mobile-read-link"
													href={getBookHref(book)}
													onclick={(event) => event.stopPropagation()}
												>
													Read book
													<svg class="button-arrow" viewBox="0 0 14 14" aria-hidden="true">
														<path
															d="M2.5 7h8m0 0L7 3.5M10.5 7 7 10.5"
															stroke="currentColor"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
															fill="none"
														/>
													</svg>
												</a>
											</div>
										</div>
									</td>
									<td>
										<div class="table-book-details">
											<div class="series-chip" style={`--chip-color: ${book.leatherColor};`}>
												{book.seriesTitle}
											</div>
											<div class="genre-copy">{book.genre}</div>
											<div class="tag-list" aria-label={`Tags for ${book.title}`}>
												{#each getTagPreview(book) as tag (tag)}
													<span class="tag-pill">{tag}</span>
												{/each}
											</div>
										</div>
									</td>
									<td class="table-action-cell">
										<a
											class="row-open-link"
											href={getBookHref(book)}
											onclick={(event) => event.stopPropagation()}
										>
											<span class="row-open-label row-open-label-short">Read</span>
											<span class="row-open-label row-open-label-mobile">Read book</span>
											<svg class="button-arrow" viewBox="0 0 14 14" aria-hidden="true">
												<path
													d="M2.5 7h8m0 0L7 3.5M10.5 7 7 10.5"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													fill="none"
												/>
											</svg>
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				{#if filteredBookList.length === 0}
					{@render emptyShelf()}
				{/if}
			</div>
			{@render paginationControl()}
		</section>
	</div>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}

	.bookshelf-room {
		--font-display: 'Caprasimo', 'Baloo 2', 'Lora', Georgia, serif;
		--font-round: 'Baloo 2', 'Trebuchet MS', system-ui, sans-serif;
		--font-book: 'Lora', Georgia, serif;
		--font-hand: 'Patrick Hand SC', 'Mynerve', 'Caveat', var(--font-round);
		--font-notebook: 'Caveat', 'Nothing You Could Do', 'Patrick Hand', cursive;

		--cream: #fff8ea;
		--cream-soft: rgba(70, 58, 41, 0.74);
		--cream-faint: rgba(70, 58, 41, 0.48);
		--honey-100: #ffe9bd;
		--honey-300: #ffd98c;
		--honey-400: #f7ad45;
		--honey-600: #b87a1c;
		--honey-ink: #5b3408;
		--paper: #fffefe;
		--ink: #352b1f;
		--ink-soft: #6c5a43;
		--ink-faint: rgba(85, 69, 48, 0.56);
		--rule: rgba(75, 137, 197, 0.24);
		--rule-strong: rgba(54, 126, 196, 0.58);
		--margin-red: rgba(208, 100, 84, 0.55);
		--home-theme-image: url('/home-themes/map-world.webp');
		--home-theme-backdrop: #f4dfad;
		--home-theme-position-desktop: center top;
		--home-theme-position-mobile: 50% top;
		--home-theme-center-wash: rgba(255, 249, 232, 0.64);
		--home-theme-edge-wash: rgba(76, 56, 28, 0.07);
		--home-theme-top-wash: rgba(255, 247, 219, 0.2);
		--home-theme-bottom-wash: rgba(65, 47, 23, 0.1);
		--home-theme-ink: #324f61;
		--home-theme-heading: #332a20;
		--home-theme-accent: #b47c26;
		--stage-art-ratio: 1.6;
		--story-stage-art-height: clamp(48rem, 66vw, 60rem);

		font-family: var(--font-round);
		--book-scale: 1;
		min-height: 100vh;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 250, 239, 0.55)),
			url('/optimized/paper-texture.webp'), #fffaf0;
		background-size:
			auto,
			360px 360px,
			auto;
		background-blend-mode: normal, multiply, normal;
		position: relative;
		isolation: isolate;
		overflow-x: hidden;
		transition: filter 0.3s ease-out;
	}

	.bookshelf-room::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		background:
			radial-gradient(ellipse at 12% 10%, rgba(88, 144, 165, 0.08), transparent 30rem),
			radial-gradient(ellipse at 88% 18%, rgba(226, 175, 82, 0.1), transparent 32rem),
			radial-gradient(ellipse at 20% 80%, rgba(82, 132, 100, 0.07), transparent 34rem);
		pointer-events: none;
	}

	:global(.light) .bookshelf-room {
		filter: none;
	}

	/* ============ Story room ============ */

	.container {
		position: relative;
		z-index: 12;
		width: 100%;
		max-width: 1380px;
		margin: 0 auto;
		padding: 0 1.5rem 3rem;
	}

	.story-world-stage {
		position: relative;
		width: 100vw;
		margin-left: calc(50% - 50vw);
		margin-right: calc(50% - 50vw);
		margin-bottom: 0;
		padding: clamp(1.1rem, 2.1vw, 1.9rem) 1.5rem clamp(3.55rem, 5vw, 5.15rem);
		overflow: hidden;
		background: var(--home-theme-backdrop);
		box-shadow:
			inset 0 -1px 0 rgba(91, 66, 38, 0.16),
			0 1.1rem 2rem rgba(97, 69, 36, 0.07);
	}

	.story-world-stage::before,
	.story-world-stage::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.story-world-stage::before {
		z-index: 0;
		background-image: var(--home-theme-image);
		background-position: var(--home-theme-position-desktop);
		background-repeat: no-repeat;
		background-size: max(100vw, calc(var(--story-stage-art-height) * var(--stage-art-ratio))) auto;
	}

	.bookshelf-room[data-home-theme='paper-stage'] .story-world-stage::before {
		background:
			radial-gradient(ellipse at 16% 8%, rgba(88, 144, 165, 0.08), transparent 34rem),
			radial-gradient(ellipse at 86% 16%, rgba(226, 175, 82, 0.11), transparent 32rem),
			radial-gradient(ellipse at 22% 76%, rgba(82, 132, 100, 0.08), transparent 34rem),
			linear-gradient(180deg, #fffefe 0%, #fff8ed 48%, #fffefe 100%),
			url('/optimized/paper-texture.webp');
		background-size:
			auto,
			auto,
			auto,
			auto,
			360px 360px;
		background-blend-mode: normal, normal, normal, normal, multiply;
	}

	.story-world-stage::after {
		z-index: 1;
		background:
			radial-gradient(
				ellipse at 50% 17rem,
				var(--home-theme-center-wash) 0%,
				var(--home-theme-center-wash) 20%,
				transparent 62%
			),
			radial-gradient(ellipse at 50% 56rem, rgba(255, 252, 244, 0.24) 0%, transparent 58%),
			linear-gradient(
				90deg,
				var(--home-theme-edge-wash) 0%,
				transparent 16%,
				transparent 84%,
				var(--home-theme-edge-wash) 100%
			);
	}

	.story-world-content {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1380px;
		margin: 0 auto;
	}

	/* ============ Hero ============ */

	.bookshelf-header {
		text-align: center;
		margin-bottom: clamp(0.3rem, 1.2vw, 0.85rem);
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
	}

	.logo-container {
		position: relative;
		width: min(470px, 88vw);
		margin: 0 auto;
		overflow: visible;
	}

	.logo-button {
		position: relative;
		z-index: 1;
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.logo-button:focus-visible {
		outline: 3px solid color-mix(in srgb, var(--home-theme-accent), white 22%);
		outline-offset: 0.3rem;
		border-radius: 2.5rem;
	}

	.logo-button:hover .logo {
		transform: translateY(-2px) rotate(-0.3deg);
		filter: drop-shadow(0 18px 28px rgba(82, 57, 25, 0.22))
			drop-shadow(0 0 16px rgba(255, 205, 106, 0.24));
	}

	.logo-button:active .logo {
		transform: translateY(1px) scale(0.985);
	}

	.logo-press-tab {
		position: absolute;
		right: 3.5%;
		bottom: 18%;
		z-index: 3;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 3.25rem;
		height: 1.72rem;
		padding: 0 0.58rem;
		border-radius: 0.28rem 0.2rem 0.34rem 0.2rem;
		border: 1px solid rgba(67, 36, 13, 0.34);
		background:
			linear-gradient(
				90deg,
				rgba(255, 223, 145, 0.24),
				transparent 22%,
				transparent 78%,
				rgba(58, 29, 10, 0.18)
			),
			linear-gradient(180deg, rgba(151, 86, 31, 0.98), rgba(91, 49, 19, 0.98)),
			url('/optimized/shelf-wood-texture.webp');
		background-size:
			auto,
			auto,
			180px 90px;
		background-blend-mode: soft-light, multiply, normal;
		color: #fff0bf;
		font-family: var(--font-hand);
		font-size: clamp(0.86rem, 1.5vw, 1.02rem);
		font-weight: 700;
		line-height: 1;
		text-transform: uppercase;
		box-shadow:
			inset 0 1px 0 rgba(255, 232, 176, 0.32),
			inset 0 -1px 0 rgba(44, 22, 8, 0.28),
			0 0.22rem 0 rgba(58, 29, 10, 0.28),
			0 0.7rem 1.2rem rgba(72, 45, 16, 0.22);
		text-shadow: 0 1px 0 rgba(45, 21, 6, 0.52);
		transform: rotate(-7deg);
		transition:
			transform 0.2s ease,
			filter 0.2s ease;
	}

	.logo-button:hover .logo-press-tab {
		filter: saturate(1.06);
		transform: rotate(-4deg) translateY(-2px);
	}

	.logo-glow {
		position: absolute;
		inset: 6% 10%;
		border-radius: 50%;
		background: radial-gradient(
			ellipse at center,
			rgba(255, 196, 110, 0.24),
			rgba(255, 170, 70, 0.1) 48%,
			transparent 72%
		);
		filter: blur(24px);
		animation: glowBreathe 7s ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes glowBreathe {
		0%,
		100% {
			opacity: 0.7;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.05);
		}
	}

	.logo {
		position: relative;
		z-index: 1;
		width: 100%;
		height: auto;
		display: block;
		aspect-ratio: 3 / 2;
		filter: drop-shadow(0 16px 24px rgba(82, 57, 25, 0.18));
		transition:
			transform 0.22s ease,
			filter 0.22s ease;
		user-select: none;
	}

	/* ============ Featured shelf ============ */

	.featured-shelf-section {
		margin: 0 auto clamp(0.7rem, 2vw, 1.35rem);
		max-width: 1240px;
	}

	.featured-copy {
		margin-bottom: 0.25rem;
		padding: 0 0.75rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.14rem;
		text-align: center;
	}

	.featured-copy h2 {
		margin: 0;
		font-family: var(--font-hand);
		font-weight: 400;
		font-size: clamp(2rem, 3.1vw, 2.7rem);
		line-height: 1.08;
		color: var(--home-theme-heading);
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.75);
		text-wrap: balance;
	}

	.head-doodle {
		width: 8.75rem;
		height: 0.8rem;
		color: color-mix(in srgb, var(--home-theme-accent), #2d86c8 40%);
		opacity: 1;
	}

	/* ============ Controls: chips, search, view toggle ============ */

	.bookshelf-controls {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		width: 100%;
		max-width: 1240px;
		margin: 0 auto;
		padding: 0 0.75rem;
	}

	.filter-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.filter-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.42rem;
		height: 2.55rem;
		padding: 0 0.95rem 0 0.78rem;
		border-radius: 999px;
		border: 1.5px solid rgba(84, 72, 52, 0.12);
		background: rgba(255, 255, 255, 0.66);
		color: var(--ink-soft);
		font-family: var(--font-round);
		font-size: 0.92rem;
		font-weight: 700;
		cursor: pointer;
		backdrop-filter: blur(8px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.78),
			0 0.7rem 1.4rem rgba(75, 59, 34, 0.08);
		transition:
			transform 0.18s ease,
			background 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease,
			box-shadow 0.18s ease;
	}

	.filter-chip:hover {
		color: var(--ink);
		border-color: rgba(156, 118, 56, 0.35);
		transform: translateY(-1px);
	}

	.filter-chip.active {
		background: linear-gradient(180deg, #ffe2a3, #ffc45f);
		border-color: rgba(184, 122, 28, 0.5);
		color: var(--honey-ink);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.5),
			0 2px 0 rgba(156, 100, 24, 0.42),
			0 0.6rem 1rem rgba(131, 83, 20, 0.15);
		transform: translateY(-1px);
	}

	.chip-emoji {
		font-size: 1.05rem;
		line-height: 1;
	}

	.chip-count {
		font-size: 0.72rem;
		font-weight: 800;
		line-height: 1;
		padding: 0.22rem 0.45rem;
		border-radius: 999px;
		background: rgba(116, 97, 68, 0.09);
	}

	.filter-chip.active .chip-count {
		background: rgba(91, 52, 8, 0.16);
	}

	.control-search-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.9rem;
		align-items: center;
	}

	.search-box {
		position: relative;
		min-width: 0;
	}

	.search-icon {
		position: absolute;
		left: 1.05rem;
		top: 50%;
		transform: translateY(-50%);
		width: 1.05rem;
		height: 1.05rem;
		color: var(--ink-faint);
		pointer-events: none;
	}

	.control-input {
		width: 100%;
		height: 3.05rem;
		padding: 0.8rem 1.1rem 0.8rem 2.8rem;
		border-radius: 999px;
		border: 1.5px solid rgba(84, 72, 52, 0.12);
		background: rgba(255, 255, 255, 0.68);
		color: var(--ink);
		font-family: var(--font-round);
		font-size: 1rem;
		font-weight: 600;
		backdrop-filter: blur(10px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.82),
			0 0.8rem 1.8rem rgba(75, 59, 34, 0.08);
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			box-shadow 0.2s ease;
	}

	.control-input::placeholder {
		color: var(--ink-faint);
		font-weight: 500;
	}

	.control-input:focus {
		outline: none;
		border-color: rgba(184, 122, 28, 0.55);
		background: rgba(255, 255, 255, 0.86);
		box-shadow: 0 0 0 4px rgba(247, 173, 69, 0.16);
	}

	/* ============ Notebook catalog page ============ */

	.catalog-page {
		--paper-hole-center: 1.85rem;
		--paper-hole-top: 9.65rem;
		--paper-hole-radius: 0.72rem;
		--paper-hole-rim: 0.86rem;
		--paper-hole-outer: 0.92rem;
		--paper-content-top: 2.35rem;
		--paper-first-rule: calc(var(--notebook-line) * 3);
		--paper-margin: 4.35rem;
		--notebook-line: 2.72rem;
		--rule-width: 0.055rem;
		--top-rule-width: 0.12rem;
		--catalog-table-body-height: calc(var(--notebook-line) * 24);
		--catalog-ledger-extra-space: calc(var(--notebook-line) * 1.1);
		--catalog-ledger-min-height: calc(
			(var(--paper-first-rule) - var(--paper-content-top)) + var(--notebook-line) +
				var(--catalog-table-body-height) + var(--catalog-ledger-extra-space)
		);
		position: relative;
		z-index: 2;
		width: min(72rem, calc(100vw - 2.5rem));
		max-width: 72rem;
		margin: clamp(-4.25rem, -4vw, -2.5rem) auto 0;
		padding: var(--paper-content-top) 2.1rem 1.65rem 5.35rem;
		border-radius: 0.16rem 0.62rem 0.54rem 0.18rem;
		border: 1px solid rgba(77, 98, 116, 0.12);
		min-height: clamp(42rem, 77vw, 55.6rem);
		background:
			radial-gradient(
				circle at var(--paper-hole-center) var(--paper-hole-top),
				rgba(242, 237, 226, 0.96) 0 var(--paper-hole-radius),
				rgba(85, 103, 118, 0.28) calc(var(--paper-hole-radius) + 0.03rem),
				rgba(85, 103, 118, 0.28) var(--paper-hole-rim),
				transparent var(--paper-hole-outer)
			),
			radial-gradient(
				circle at var(--paper-hole-center) 50%,
				rgba(242, 237, 226, 0.96) 0 var(--paper-hole-radius),
				rgba(85, 103, 118, 0.28) calc(var(--paper-hole-radius) + 0.03rem),
				rgba(85, 103, 118, 0.28) var(--paper-hole-rim),
				transparent var(--paper-hole-outer)
			),
			radial-gradient(
				circle at var(--paper-hole-center) calc(100% - var(--paper-hole-top)),
				rgba(242, 237, 226, 0.96) 0 var(--paper-hole-radius),
				rgba(85, 103, 118, 0.28) calc(var(--paper-hole-radius) + 0.03rem),
				rgba(85, 103, 118, 0.28) var(--paper-hole-rim),
				transparent var(--paper-hole-outer)
			),
			linear-gradient(
				90deg,
				transparent 0,
				transparent var(--paper-margin),
				var(--margin-red) var(--paper-margin),
				var(--margin-red) calc(var(--paper-margin) + 0.07rem),
				transparent calc(var(--paper-margin) + 0.07rem)
			),
			linear-gradient(
				180deg,
				transparent 0,
				transparent calc(var(--paper-first-rule) - var(--top-rule-width)),
				var(--rule-strong) calc(var(--paper-first-rule) - var(--top-rule-width)),
				var(--rule-strong) var(--paper-first-rule),
				transparent var(--paper-first-rule)
			),
			linear-gradient(
				180deg,
				#fff 0,
				#fff calc(var(--paper-first-rule) - var(--top-rule-width)),
				transparent calc(var(--paper-first-rule) - var(--top-rule-width))
			),
			repeating-linear-gradient(
				180deg,
				#fff 0,
				#fff calc(var(--notebook-line) - var(--rule-width)),
				var(--rule) calc(var(--notebook-line) - var(--rule-width)),
				var(--rule) var(--notebook-line)
			),
			url('/optimized/paper-texture.webp'), #fff;
		background-size:
			auto,
			auto,
			auto,
			auto,
			auto,
			auto,
			auto,
			360px 360px,
			auto;
		background-position:
			0 0,
			0 0,
			0 0,
			0 0,
			0 0,
			0 0,
			0 0,
			0 0,
			0 0;
		background-blend-mode: normal, normal, normal, normal, normal, normal, normal, multiply, normal;
		box-shadow:
			inset 0.28rem 0 0 rgba(210, 218, 226, 0.12),
			0 0.15rem 0 rgba(54, 77, 99, 0.08),
			0 1.35rem 3rem rgba(60, 70, 82, 0.15);
	}

	.catalog-page::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background:
			linear-gradient(90deg, rgba(255, 255, 255, 0.78), transparent 18%),
			radial-gradient(90% 38% at 50% 0%, rgba(255, 255, 255, 0.74), transparent 72%);
		pointer-events: none;
	}

	.catalog-page > * {
		position: relative;
		z-index: 1;
	}

	/* ============ Catalog ledger (table view) ============ */

	.story-table-shell {
		width: 100%;
	}

	.story-table-shell.catalog-page {
		width: min(72rem, calc(100vw - 2.5rem));
		max-width: 72rem;
		margin: clamp(-4.25rem, -4vw, -2.5rem) auto 0;
		padding: var(--paper-content-top) 2.1rem 1.65rem 5.35rem;
	}

	.ledger-paper {
		position: relative;
		z-index: 1;
		min-height: var(--catalog-ledger-min-height);
	}

	.ledger-paper::before {
		display: none;
	}

	.ledger-paper::after {
		display: none;
	}

	.story-table-header {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		min-height: calc(var(--paper-first-rule) - var(--paper-content-top));
		padding: 0;
	}

	.story-table-header > div {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.45rem 1rem;
	}

	.story-table-header h2 {
		margin: 0;
		font-family: var(--font-notebook);
		font-weight: 700;
		font-size: clamp(2.35rem, 3.6vw, 3.18rem);
		line-height: 0.84;
		color: #21486d;
	}

	.story-table-header p {
		margin: 0;
		font-family: var(--font-notebook);
		color: #506d83;
		font-size: clamp(1.18rem, 1.5vw, 1.38rem);
		font-weight: 600;
		line-height: 1;
	}

	.story-table-scroll {
		position: relative;
		z-index: 1;
		overflow-x: auto;
		padding: 0;
	}

	.story-table {
		--row-height: calc(var(--notebook-line) * 2);
		width: 100%;
		min-width: 700px;
		border-collapse: separate;
		border-spacing: 0;
		background: transparent;
	}

	.story-table thead th {
		height: var(--notebook-line);
		padding: 0.1rem 1rem 0;
		text-align: left;
		font-family: var(--font-notebook);
		font-size: 1.32rem;
		font-weight: 700;
		letter-spacing: 0;
		text-transform: none;
		white-space: nowrap;
		color: rgba(39, 91, 138, 0.78);
	}

	.story-table th:nth-child(1),
	.story-table td:nth-child(1) {
		width: 50%;
	}

	.story-table th:nth-child(2),
	.story-table td:nth-child(2) {
		width: 38%;
	}

	.story-table th:nth-child(3),
	.story-table td:nth-child(3) {
		width: 12%;
	}

	.story-table tbody tr {
		height: var(--row-height);
		cursor: pointer;
		transition:
			background 0.18s ease,
			box-shadow 0.18s ease;
	}

	.story-table tbody tr:hover,
	.story-table tbody tr:focus-visible {
		outline: none;
		background: rgba(76, 143, 207, 0.055);
		box-shadow: inset 0.28rem 0 0 rgba(73, 143, 207, 0.32);
	}

	.story-table tbody td {
		height: var(--row-height);
		padding: 0 1rem;
		vertical-align: middle;
	}

	.story-cell {
		display: grid;
		grid-template-columns: 3.65rem minmax(0, 1fr);
		gap: 1rem;
		align-items: center;
		min-height: var(--row-height);
	}

	.story-cover-preview {
		width: 3.45rem;
		height: 4.58rem;
		perspective: 800px;
	}

	.story-mini-book {
		position: relative;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transform: rotateY(-16deg) rotateX(5deg);
		filter: drop-shadow(0 0.5rem 0.65rem rgba(59, 42, 22, 0.35));
		transition: transform 0.3s ease;
	}

	.story-table tbody tr:hover .story-mini-book {
		transform: rotateY(-24deg) rotateX(6deg) translateY(-2px);
	}

	.story-mini-cover {
		position: absolute;
		inset: 0;
		border-radius: 0.18rem 0.42rem 0.42rem 0.18rem;
		background: var(--cover-color);
		transform: translateZ(2px);
		overflow: hidden;
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.12),
			2px 0 5px rgba(0, 0, 0, 0.22);
	}

	.story-cover-image {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	.story-cover-fallback {
		position: relative;
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		background:
			radial-gradient(90% 70% at 50% 20%, rgba(255, 236, 190, 0.22), transparent 60%),
			linear-gradient(
				90deg,
				rgba(0, 0, 0, 0.28),
				transparent 22%,
				transparent 78%,
				rgba(0, 0, 0, 0.22)
			),
			var(--cover-color);
	}

	.story-cover-fallback span {
		font-size: 1.15rem;
		filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4));
	}

	.story-mini-pages {
		position: absolute;
		top: 2px;
		bottom: 2px;
		right: -4px;
		width: 0.38rem;
		background:
			repeating-linear-gradient(
				to right,
				rgba(126, 96, 46, 0.25) 0,
				rgba(126, 96, 46, 0.25) 1px,
				transparent 1px,
				transparent 2.5px
			),
			#f6eed9;
		transform: rotateY(-90deg);
		transform-origin: right center;
		border-radius: 0 0.16rem 0.16rem 0;
	}

	.story-mini-spine {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 0.32rem;
		background:
			linear-gradient(
				to right,
				rgba(0, 0, 0, 0.18),
				transparent 30%,
				transparent 70%,
				rgba(0, 0, 0, 0.2)
			),
			var(--cover-color);
		transform: rotateY(90deg);
		transform-origin: left center;
	}

	.story-meta {
		display: grid;
		grid-template-rows: repeat(2, 1fr);
		align-items: center;
		height: var(--row-height);
		min-width: 0;
	}

	.story-title-line {
		color: var(--ink);
		font-family: var(--font-notebook);
		font-size: 1.54rem;
		font-weight: 700;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.story-subline {
		margin: 0;
		max-width: 48ch;
		color: #536b7d;
		font-family: var(--font-notebook);
		font-size: 1.34rem;
		font-weight: 500;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.table-book-details {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		grid-template-rows: repeat(2, 1fr);
		align-items: center;
		column-gap: 0.6rem;
		height: var(--row-height);
		max-width: 34rem;
	}

	.series-chip {
		display: inline-flex;
		align-items: center;
		grid-column: 1;
		grid-row: 1;
		width: max-content;
		max-width: 19rem;
		min-height: 1.72rem;
		padding: 0.12rem 0.65rem 0.02rem;
		border-radius: 0.32rem;
		background: var(--chip-color, #4a5d4e);
		border: 1px solid rgba(255, 255, 255, 0.22);
		color: #fffaf0;
		font-family: var(--font-notebook);
		font-size: 1.18rem;
		font-weight: 700;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		transform: rotate(-1.6deg);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.18),
			0 2px 3px rgba(59, 42, 22, 0.28);
	}

	.story-table tbody tr:nth-child(even) .series-chip {
		transform: rotate(1.2deg);
	}

	.genre-copy {
		grid-column: 2;
		grid-row: 1;
		min-width: 0;
		color: #8a6a3a;
		font-family: var(--font-notebook);
		font-size: 1.24rem;
		font-weight: 700;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.tag-list {
		grid-column: 1 / -1;
		grid-row: 2;
		display: flex;
		flex-wrap: nowrap;
		gap: 0.42rem;
		min-width: 0;
		overflow: hidden;
	}

	.tag-pill {
		display: inline-flex;
		align-items: center;
		min-height: 1.62rem;
		border-radius: 999px;
		padding: 0.08rem 0.56rem 0;
		background: rgba(255, 255, 255, 0.5);
		border: 1.5px dashed rgba(73, 143, 207, 0.28);
		color: #49677d;
		font-family: var(--font-notebook);
		font-size: 1.06rem;
		font-weight: 700;
		line-height: 1;
		text-transform: lowercase;
		white-space: nowrap;
	}

	.table-action-heading,
	.table-action-cell {
		text-align: right;
	}

	.row-open-link {
		display: inline-flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.32rem;
		color: #275b8a;
		font-family: var(--font-notebook);
		font-size: 1.38rem;
		font-weight: 700;
		line-height: 1;
		text-decoration: none;
		white-space: nowrap;
		transition:
			color 0.16s ease,
			transform 0.16s ease;
	}

	.story-row-link:hover .row-open-link,
	.story-row-link:focus-visible .row-open-link,
	.row-open-link:hover {
		color: #163f64;
		transform: translateX(2px);
	}

	.row-open-label-mobile {
		display: none;
	}

	.story-mobile-read-link {
		display: none;
	}

	/* ============ Squishy storybook button ============ */

	.read-book-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		height: 2.6rem;
		padding: 0 1.15rem;
		border: none;
		border-radius: 999px;
		background: linear-gradient(180deg, var(--honey-300) 0%, var(--honey-400) 100%);
		color: var(--honey-ink);
		font-family: var(--font-round);
		font-size: 0.94rem;
		font-weight: 800;
		text-decoration: none;
		white-space: nowrap;
		cursor: pointer;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.55),
			0 3px 0 var(--honey-600),
			0 0.65rem 1rem rgba(58, 32, 6, 0.25);
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			filter 0.15s ease;
	}

	.read-book-button:hover {
		transform: translateY(-2px);
		filter: saturate(1.06);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.55),
			0 5px 0 var(--honey-600),
			0 0.9rem 1.3rem rgba(58, 32, 6, 0.3);
	}

	.read-book-button:active {
		transform: translateY(2px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.4),
			0 1px 0 var(--honey-600),
			0 0.3rem 0.5rem rgba(58, 32, 6, 0.25);
	}

	.catalog-pagination {
		position: relative;
		z-index: 2;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin: calc(var(--notebook-line) * 0.5) 0 0;
		padding-top: 0;
	}

	.catalog-pagination p {
		margin: 0;
		color: #49677d;
		font-family: var(--font-notebook);
		font-size: clamp(1.24rem, 1.8vw, 1.55rem);
		font-weight: 700;
		line-height: 1;
	}

	.pagination-range {
		color: rgba(73, 103, 125, 0.78);
	}

	.page-turn-buttons {
		display: inline-flex;
		align-items: center;
		gap: 0.36rem;
		padding: 0.24rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.58);
		border: 1px solid rgba(76, 143, 207, 0.2);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.page-turn-button {
		display: inline-grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 999px;
		border: 1px solid transparent;
		background: transparent;
		color: #48677f;
		font-family: var(--font-notebook);
		font-size: 1.34rem;
		line-height: 1;
		cursor: pointer;
		transition:
			transform 0.16s ease,
			background 0.16s ease,
			color 0.16s ease,
			border-color 0.16s ease;
	}

	.page-turn-button:hover:not(:disabled) {
		transform: translateY(-1px);
		background: rgba(76, 143, 207, 0.12);
		border-color: rgba(76, 143, 207, 0.22);
		color: #21476b;
	}

	.page-turn-button.active {
		background: #316fa8;
		color: #fff;
		border-color: rgba(33, 71, 107, 0.25);
		box-shadow: 0 2px 0 rgba(28, 68, 105, 0.35);
	}

	.page-number-label {
		display: block;
		margin-top: -0.14rem;
		margin-left: -0.08rem;
	}

	.page-turn-button:disabled {
		cursor: not-allowed;
		opacity: 0.38;
	}

	.page-turn-icon {
		width: 1rem;
		height: 1rem;
	}

	.button-arrow {
		width: 0.85rem;
		height: 0.85rem;
		transition: transform 0.2s ease;
	}

	.row-open-link:hover .button-arrow,
	.story-row-link:hover .button-arrow,
	.story-row-link:focus-visible .button-arrow {
		transform: translateX(3px);
	}

	/* ============ Empty shelf ============ */

	.bookshelf-container {
		width: 100%;
		max-width: 1240px;
		margin: 0 auto;
		padding: 0.75rem 0 0;
	}

	.empty-filter-state {
		margin: 2rem auto 0;
		max-width: 27rem;
		padding: 1.6rem 1.5rem 1.7rem;
		border-radius: 0.9rem;
		text-align: center;
		background: rgba(255, 255, 255, 0.74);
		border: 1px solid rgba(84, 72, 52, 0.14);
		box-shadow: 0 1.4rem 2.6rem rgba(75, 59, 34, 0.12);
	}

	.empty-title {
		margin: 0;
		font-family: var(--font-round);
		font-size: 1.12rem;
		font-weight: 800;
		color: var(--ink);
	}

	.empty-hint {
		margin: 0.45rem 0 1rem;
		font-family: var(--font-book);
		font-style: italic;
		font-size: 0.95rem;
		color: var(--ink-soft);
	}

	.ledger-paper .empty-filter-state {
		background: transparent;
		border: none;
		box-shadow: none;
		margin-top: 0.5rem;
	}

	/* ============ Shelf rows & wood ============ */

	.shelf-row {
		--shelf-offset: 1.35rem;
		--shelf-height: 4.2rem;
		--shelf-seam-from-top: 2.54rem;
		position: relative;
		margin-bottom: 2.5rem;
		height: 22.8rem;
		overflow: visible;
	}

	.featured-shelf-row {
		--book-scale: 0.9;
		margin-bottom: 1.25rem;
		height: 18.6rem;
	}

	.featured-shelf-books {
		width: min(48rem, calc(100% - 1rem));
		height: 16.7rem;
		justify-content: center;
		gap: clamp(0.75rem, 2vw, 1.5rem);
	}

	.featured-shelf-row .wooden-shelf {
		width: min(51rem, calc(100% + 2rem), calc(100vw - 0.3rem));
	}

	.shelf-back-glow {
		position: absolute;
		left: 50%;
		bottom: 3.4rem;
		width: min(72rem, 100%);
		height: 10rem;
		transform: translateX(-50%);
		border-radius: 2rem;
		background: radial-gradient(ellipse at center, rgba(255, 214, 150, 0.16), transparent 70%);
		filter: blur(12px);
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	:global(.dark) .shelf-back-glow {
		opacity: 0;
	}

	.wooden-shelf {
		position: absolute;
		bottom: var(--shelf-offset);
		left: 50%;
		width: min(76rem, calc(100% + 2.5rem), calc(100vw - 0.3rem));
		height: var(--shelf-height);
		transform: translateX(-50%);
		pointer-events: none;
	}

	.shelf-back-rail {
		z-index: 5;
	}

	.shelf-front-rail {
		z-index: 8;
	}

	.shelf-surface {
		position: absolute;
		top: 0.32rem;
		left: 0.2rem;
		right: 0.2rem;
		height: 2.55rem;
		border: 1px solid rgba(108, 71, 36, 0.32);
		border-radius: 0.6rem;
		background:
			linear-gradient(
				90deg,
				rgba(255, 247, 226, 0.26),
				transparent 18%,
				transparent 82%,
				rgba(74, 42, 15, 0.12)
			),
			linear-gradient(
				180deg,
				rgba(255, 238, 193, 0.38) 0%,
				rgba(184, 126, 66, 0.18) 46%,
				rgba(82, 48, 19, 0.25) 100%
			),
			url('/optimized/shelf-wood-texture.webp');
		background-size:
			100% 100%,
			100% 100%,
			380px 150px;
		background-position: center;
		background-blend-mode: soft-light, multiply, normal;
		box-shadow:
			0 0.45rem 1.1rem rgba(84, 54, 24, 0.1),
			inset 0 1px 0 rgba(255, 243, 214, 0.5),
			inset 0 -2px 0 rgba(74, 43, 18, 0.28);
	}

	.shelf-surface::after {
		content: '';
		position: absolute;
		bottom: 0.34rem;
		left: 1.2rem;
		right: 1.2rem;
		height: 1px;
		background: rgba(73, 42, 18, 0.18);
		box-shadow: 0 -1px 1px rgba(255, 237, 201, 0.35);
	}

	.shelf-lip {
		position: absolute;
		top: 2.54rem;
		left: 0.75rem;
		right: 0.75rem;
		height: 1.08rem;
		border-radius: 0.18rem 0.18rem 0.55rem 0.55rem;
		background:
			linear-gradient(
				180deg,
				rgba(255, 231, 183, 0.22),
				rgba(111, 66, 27, 0.2) 38%,
				rgba(64, 35, 14, 0.38)
			),
			url('/optimized/shelf-wood-texture.webp');
		background-size:
			100% 100%,
			360px 130px;
		background-position: center 60%;
		background-blend-mode: multiply, normal;
		border: 1px solid rgba(83, 49, 21, 0.28);
		box-shadow:
			inset 0 1px 0 rgba(255, 238, 205, 0.34),
			0 0.9rem 1.5rem rgba(84, 54, 24, 0.16),
			inset 0 -1px 0 rgba(49, 25, 8, 0.22);
	}

	.shelf-bracket {
		display: none;
	}

	.shelf-bracket::after {
		content: '';
		position: absolute;
		top: 0.75rem;
		left: 50%;
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 999px;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.5);
		box-shadow:
			inset 0 1px 1px rgba(0, 0, 0, 0.8),
			0 1px 1px rgba(255, 255, 255, 0.1);
	}

	.shelf-bracket-left {
		left: 8%;
	}

	.shelf-bracket-right {
		right: 8%;
	}

	.shelf-shadow {
		position: absolute;
		top: 3.15rem;
		left: 2.25rem;
		right: 2.25rem;
		height: 1rem;
		background: radial-gradient(ellipse at center, rgba(107, 88, 58, 0.15), transparent 72%);
		border-radius: 999px;
		z-index: -1;
		filter: blur(6px);
	}

	.shelf-books {
		position: absolute;
		bottom: calc(var(--shelf-offset) + var(--shelf-height) - var(--shelf-seam-from-top));
		left: 50%;
		width: min(68rem, calc(100% - 1rem));
		height: 18.8rem;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		padding: 0 1rem;
		z-index: 7;
		overflow: visible;
	}

	.book-item {
		position: relative;
		display: flex;
		align-items: flex-end;
		z-index: 1;
	}

	.book-item:has(.book-card:hover),
	.book-item:has(.book-card:focus-visible) {
		z-index: 4;
	}

	/* ============ 3D books ============ */

	.covers-mode {
		gap: clamp(0.75rem, 2vw, 1.75rem);
	}

	.book-card {
		--book-width: 176px;
		--book-height: 248px;
		--book-depth: 24px;
		--book-lean: 0deg;
		--book-border-radius: 3px 9px 9px 3px;

		background: transparent;
		border: none;
		cursor: pointer;
		display: block;
		padding: 0;
		perspective: 1500px;
		flex: 0 0 auto;
		position: relative;
		width: calc(var(--book-width) * var(--book-scale));
		height: calc(var(--book-height) * var(--book-scale));
		transform: translateY(0) rotateZ(var(--book-lean));
		transform-origin: center bottom;
		transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
		text-decoration: none;
	}

	.book-card:hover,
	.book-card:focus-visible {
		transform: translateY(-14px) rotateZ(var(--book-lean));
		z-index: 20;
	}

	.book-card:focus-visible {
		outline: none;
	}

	.book-contact-shadow {
		position: absolute;
		left: 3%;
		right: 3%;
		bottom: -9px;
		height: 18px;
		border-radius: 50%;
		background: radial-gradient(ellipse at center, rgba(2, 7, 4, 0.55), transparent 68%);
		filter: blur(6px);
		opacity: 0.32;
		transition:
			transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.5s ease;
	}

	.book-card:hover .book-contact-shadow,
	.book-card:focus-visible .book-contact-shadow {
		transform: translateY(12px) scale(0.9, 1.16);
		opacity: 0.36;
	}

	.book-3d-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.42s cubic-bezier(0.2, 0.8, 0.2, 1);
		transform: rotateY(-9deg) rotateX(3deg);
	}

	.book-card.covers:hover .book-3d-wrapper,
	.book-card.covers:focus-visible .book-3d-wrapper {
		transform: rotateY(-11deg) rotateX(3deg);
	}

	.book-card:focus-visible .book-cover-front {
		box-shadow:
			0 0 0 4px rgba(247, 173, 69, 0.28),
			inset 0 0 0 1px rgba(255, 255, 255, 0.16),
			0 0.75rem 1.2rem rgba(72, 49, 28, 0.14),
			2px 0 5px rgba(0, 0, 0, 0.18);
	}

	.book-cover-front {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: var(--book-border-radius);
		overflow: hidden;
		transform-style: preserve-3d;
		backface-visibility: hidden;
		z-index: 2;
		background-color: var(--book-color);
		transform: translateZ(3px);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.16),
			0 0.75rem 1.2rem rgba(72, 49, 28, 0.14),
			2px 0 5px rgba(0, 0, 0, 0.18);
	}

	.cover-texture {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		border-radius: var(--book-border-radius);
		background-image: linear-gradient(
			to right,
			rgba(0, 0, 0, 0.1),
			transparent 10%,
			transparent 90%,
			rgba(0, 0, 0, 0.05)
		);
	}

	/* --- painted covers --- */

	.cover-art {
		position: absolute;
		inset: 0;
	}

	.cover-art .book-cover-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(1.04) contrast(1.02);
	}

	.cover-scrim {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(26, 15, 5, 0.55) 0%, rgba(26, 15, 5, 0.22) 27%, transparent 47%),
			linear-gradient(0deg, rgba(26, 15, 5, 0.25), transparent 25%);
	}

	.book-title {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 400;
		line-height: 1.12;
		color: #fff6e3;
		text-align: center;
		text-wrap: balance;
		z-index: 2;
	}

	.cover-art .book-title {
		position: absolute;
		top: 0.65rem;
		left: 0.55rem;
		right: 0.55rem;
		font-size: calc(1.06rem * var(--book-scale));
		text-shadow:
			0 1px 0 rgba(56, 28, 5, 0.6),
			0 3px 10px rgba(0, 0, 0, 0.6);
	}

	/* --- clothbound classics (no artwork) --- */

	.classic-cover {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 12% 10% 9%;
		text-align: center;
		background:
			radial-gradient(130% 80% at 50% -10%, rgba(255, 236, 190, 0.18), transparent 55%),
			linear-gradient(
				90deg,
				rgba(0, 0, 0, 0.3),
				transparent 16%,
				transparent 86%,
				rgba(0, 0, 0, 0.22)
			),
			url('/optimized/leather-texture.webp'), linear-gradient(var(--book-color), var(--book-color));
		background-size: auto, auto, cover, auto;
		background-blend-mode: normal, normal, soft-light, normal;
	}

	.classic-cover::before {
		content: '';
		position: absolute;
		inset: 5.5%;
		border: 1.5px solid rgba(240, 206, 134, 0.55);
		border-radius: 4px;
		outline: 1px solid rgba(240, 206, 134, 0.22);
		outline-offset: 3px;
		pointer-events: none;
	}

	.classic-series {
		position: relative;
		font-family: var(--font-round);
		font-weight: 700;
		font-size: calc(0.56rem * var(--book-scale));
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(244, 216, 150, 0.95);
		line-height: 1.35;
	}

	.classic-title {
		flex: 1;
		display: flex;
		align-items: center;
		font-size: calc(0.99rem * var(--book-scale));
		color: #f9eed3;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
		padding: 0.3rem 0;
	}

	.classic-emblem {
		position: relative;
		width: calc(3rem * var(--book-scale));
		height: calc(3rem * var(--book-scale));
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: calc(1.4rem * var(--book-scale));
		background: radial-gradient(
			circle at 32% 28%,
			rgba(255, 240, 200, 0.3),
			rgba(40, 20, 5, 0.22) 74%
		);
		box-shadow:
			0 0 0 1.5px rgba(240, 206, 134, 0.65),
			0 0 0 4px rgba(0, 0, 0, 0.14),
			inset 0 2px 5px rgba(0, 0, 0, 0.32);
		margin-bottom: 9%;
	}

	.classic-foot {
		position: relative;
		font-family: var(--font-round);
		font-weight: 700;
		font-size: calc(0.45rem * var(--book-scale));
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(244, 216, 150, 0.55);
		white-space: nowrap;
	}

	/* --- shared cover hardware --- */

	.cover-gloss {
		position: absolute;
		inset: 0;
		z-index: 6;
		pointer-events: none;
		border-radius: inherit;
		background:
			linear-gradient(
				106deg,
				transparent 41%,
				rgba(255, 255, 255, 0.13) 46%,
				rgba(255, 255, 255, 0.04) 53%,
				transparent 57%
			),
			linear-gradient(
				90deg,
				rgba(0, 0, 0, 0.28) 0%,
				rgba(255, 255, 255, 0.1) 3%,
				rgba(0, 0, 0, 0.18) 5.2%,
				transparent 9%
			),
			linear-gradient(180deg, rgba(255, 255, 255, 0.14), transparent 4.5%);
	}

	/* --- page block --- */

	.book-pages-right {
		position: absolute;
		top: 5px;
		bottom: 5px;
		width: calc(var(--book-depth) * var(--book-scale));
		right: 0;
		transform-origin: right center;
		transform: rotateY(-90deg);
		border-radius: 0 7px 7px 0;
		overflow: hidden;
		backface-visibility: hidden;
		background:
			linear-gradient(to right, rgba(0, 0, 0, 0.14), transparent 24%),
			repeating-linear-gradient(
				to right,
				rgba(126, 96, 46, 0.22) 0,
				rgba(126, 96, 46, 0.22) 1px,
				transparent 1px,
				transparent 3px
			),
			#f7efdc;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
	}

	.book-pages-top {
		position: absolute;
		top: 3px;
		left: 5px;
		width: calc(var(--book-width) * var(--book-scale) - 10px);
		height: calc(var(--book-depth) * var(--book-scale));
		transform-origin: center top;
		transform: rotateX(-90deg);
		border-radius: 0 6px 0 0;
		overflow: hidden;
		backface-visibility: hidden;
		background:
			repeating-linear-gradient(
				to bottom,
				rgba(126, 96, 46, 0.16) 0,
				rgba(126, 96, 46, 0.16) 1px,
				transparent 1px,
				transparent 3px
			),
			#faf3e1;
	}

	.book-pages-bottom {
		position: absolute;
		bottom: 3px;
		left: 5px;
		width: calc(var(--book-width) * var(--book-scale) - 10px);
		height: calc(var(--book-depth) * var(--book-scale));
		transform-origin: center bottom;
		transform: rotateX(90deg);
		border-radius: 0 0 6px 0;
		overflow: hidden;
		backface-visibility: hidden;
		background:
			linear-gradient(to bottom, rgba(0, 0, 0, 0.12), transparent 24%),
			repeating-linear-gradient(
				to bottom,
				rgba(126, 96, 46, 0.16) 0,
				rgba(126, 96, 46, 0.16) 1px,
				transparent 1px,
				transparent 3px
			),
			#f7efdc;
	}

	.book-spine {
		position: absolute;
		top: 0;
		bottom: 0;
		width: calc(var(--book-depth) * var(--book-scale));
		left: 0;
		transform-origin: left center;
		transform: rotateY(90deg);
		background-color: var(--book-color);
		background-image:
			linear-gradient(
				to right,
				rgba(0, 0, 0, 0.2),
				transparent 30%,
				transparent 70%,
				rgba(0, 0, 0, 0.2)
			),
			url('/optimized/leather-texture.webp');
		background-blend-mode: soft-light, overlay;
		background-size: cover;
		border-radius: 0.2rem 0 0 0.2rem;
		backface-visibility: hidden;
	}

	.book-back {
		position: absolute;
		inset: 1px 1px 1px 0;
		transform: translateZ(calc(-1 * var(--book-depth) * var(--book-scale)));
		background-color: var(--book-color);
		background-image: url('/optimized/leather-texture.webp');
		background-size: cover;
		background-blend-mode: multiply;
		border-radius: 0.15rem 0.45rem 0.45rem 0.15rem;
		opacity: 1;
		box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
		backface-visibility: hidden;
	}

	/* ============ Responsive ============ */

	@media (max-width: 1024px) {
		.bookshelf-room {
			--book-scale: 0.86;
		}

		.story-table-shell.catalog-page {
			width: min(68rem, calc(100vw - 2rem));
			padding: var(--paper-content-top) 1.55rem 1.55rem 5rem;
		}

		.container {
			padding-bottom: 4rem;
		}

		.shelf-row {
			height: 20rem;
		}

		.featured-shelf-row {
			height: 19.5rem;
		}

		.shelf-books {
			height: 16rem;
			width: min(60rem, calc(100% - 1rem));
		}

		.featured-shelf-books {
			height: 16rem;
			width: min(44rem, calc(100% - 0.4rem));
		}

		.wooden-shelf {
			width: min(65rem, calc(100% + 1.8rem), calc(100vw - 0.3rem));
		}
	}

	@media (max-width: 768px) {
		.bookshelf-room {
			--book-scale: 0.76;
			--story-stage-art-height: clamp(68rem, 300vw, 78rem);
		}

		.story-world-stage {
			padding: 1.25rem 0.7rem 3.75rem;
		}

		.story-world-stage::before {
			background-position: var(--home-theme-position-mobile);
		}

		.story-world-stage::after {
			background:
				radial-gradient(
					ellipse at 50% 10rem,
					var(--home-theme-center-wash) 0%,
					var(--home-theme-center-wash) 24%,
					transparent 68%
				),
				radial-gradient(ellipse at 50% 34rem, rgba(255, 252, 244, 0.26) 0%, transparent 62%),
				linear-gradient(
					90deg,
					color-mix(in srgb, var(--home-theme-edge-wash), transparent 28%) 0%,
					transparent 24%,
					transparent 76%,
					color-mix(in srgb, var(--home-theme-edge-wash), transparent 28%) 100%
				);
		}

		.shelf-row {
			--shelf-offset: 1.1rem;
			--shelf-height: 3.7rem;
			--shelf-seam-from-top: 2.54rem;
		}

		.catalog-page {
			--paper-hole-center: 1.4rem;
			--paper-hole-top: 9.05rem;
			--paper-hole-radius: 0.62rem;
			--paper-hole-rim: 0.74rem;
			--paper-hole-outer: 0.8rem;
			--paper-content-top: 2.55rem;
			--paper-first-rule: calc(var(--notebook-line) * 3);
			--paper-margin: 3.2rem;
			--notebook-line: 2.6rem;
			--catalog-table-body-height: calc(var(--notebook-line) * 16);
			aspect-ratio: auto;
			min-height: 34rem;
			border-radius: 0.34rem;
		}

		.story-table-shell.catalog-page {
			width: 100%;
			padding: var(--paper-content-top) 0.85rem 1.3rem 3.85rem;
		}

		.catalog-pagination {
			align-items: flex-start;
			flex-direction: column;
		}

		.featured-copy {
			padding: 0 0.35rem;
		}

		.bookshelf-controls {
			padding: 0 0.35rem;
		}

		.control-search-row {
			grid-template-columns: 1fr;
		}

		.story-table-shell {
			padding: 0.5rem 0.35rem 0;
		}

		.ledger-paper::after {
			display: none;
		}

		.story-table-header {
			padding: 0.12rem 0 0.16rem;
		}

		.story-table-scroll {
			padding: 0;
			overflow-x: visible;
		}

		.story-table {
			min-width: 0;
			table-layout: fixed;
		}

		.story-table th:nth-child(1),
		.story-table td:nth-child(1) {
			width: auto;
		}

		.story-table th:nth-child(2),
		.story-table th:nth-child(3),
		.story-table td:nth-child(2),
		.story-table td:nth-child(3) {
			display: none;
		}

		.story-table thead th {
			padding: 0.1rem 0.72rem 0;
		}

		.story-table tbody td {
			padding: 0 0.72rem;
		}

		.story-cell {
			grid-template-columns: 3.1rem minmax(0, 1fr);
			gap: 0.7rem;
			min-width: 0;
		}

		.story-cover-preview {
			width: 2.95rem;
			height: 3.92rem;
		}

		.story-meta {
			grid-template-rows: repeat(2, 1fr);
		}

		.story-title-line {
			font-size: clamp(1.18rem, 3.8vw, 1.46rem);
		}

		.story-subline {
			display: none;
		}

		.row-open-link {
			gap: 0.22rem;
			font-size: clamp(1.02rem, 2.8vw, 1.2rem);
		}

		.row-open-label-short {
			display: none;
		}

		.row-open-label-mobile {
			display: inline;
		}

		.story-mobile-read-link {
			display: inline-flex;
			grid-row: 2;
			justify-content: flex-start;
			width: max-content;
			font-size: clamp(1.02rem, 2.8vw, 1.2rem);
		}

		.shelf-books {
			height: 14rem;
			width: min(46rem, calc(100% - 0.8rem));
		}

		.shelf-row {
			height: 17rem;
		}

		.featured-shelf-row {
			--book-scale: 0.72;
			height: 16rem;
		}

		.featured-shelf-books {
			height: 13.25rem;
			width: calc(100% - 0.2rem);
			gap: 0.75rem;
		}

		.wooden-shelf {
			width: min(calc(100% + 1rem), calc(100vw - 0.3rem));
		}

		.shelf-bracket-left {
			left: 4%;
		}

		.shelf-bracket-right {
			right: 4%;
		}
	}

	@media (max-width: 480px) {
		.shelf-row {
			--shelf-offset: 1rem;
			--shelf-height: 3.35rem;
			--shelf-seam-from-top: 2.05rem;
		}

		.bookshelf-room {
			--book-scale: 0.7;
		}

		.container {
			padding: 1.75rem 0.7rem 3.25rem;
		}

		.catalog-page {
			--paper-hole-center: 1.05rem;
			--paper-hole-top: 8.55rem;
			--paper-hole-radius: 0.54rem;
			--paper-hole-rim: 0.64rem;
			--paper-hole-outer: 0.7rem;
			--paper-content-top: 2.35rem;
			--paper-first-rule: calc(var(--notebook-line) * 3);
			--paper-margin: 2.45rem;
			--notebook-line: 2.46rem;
			--catalog-table-body-height: calc(var(--notebook-line) * 16);
			width: calc(100vw - 0.8rem);
		}

		.story-table-shell.catalog-page {
			padding: var(--paper-content-top) 0.48rem 1.05rem 2.95rem;
		}

		.catalog-pagination p {
			font-size: 1.18rem;
		}

		.page-turn-buttons {
			max-width: 100%;
			overflow-x: auto;
		}

		.bookshelf-header {
			margin-bottom: 1.75rem;
			gap: 1.3rem;
		}

		.featured-shelf-section {
			margin-bottom: 2rem;
		}

		.bookshelf-controls {
			margin-bottom: 1.5rem;
			padding: 0;
		}

		.filter-chip {
			height: 2.3rem;
			padding: 0 0.78rem 0 0.62rem;
			font-size: 0.85rem;
		}

		.story-table thead th {
			padding: 0.1rem 0.62rem;
		}

		.story-table tbody td {
			padding: 0 0.62rem;
		}

		.story-cell {
			grid-template-columns: 2.95rem minmax(0, 1fr);
			gap: 0.62rem;
		}

		.story-cover-preview {
			width: 2.78rem;
			height: 3.7rem;
		}

		.shelf-row {
			height: 15rem;
		}

		.featured-shelf-row {
			--book-scale: 0.62;
			height: 14rem;
		}

		.shelf-books {
			width: calc(100% - 0.4rem);
			height: 12.4rem;
			gap: 0.55rem;
		}

		.featured-shelf-books {
			width: calc(100% - 0.2rem);
			height: 11.4rem;
			gap: 0.55rem;
		}

		.shelf-surface {
			top: 0.28rem;
			height: 2.05rem;
			border-radius: 0.7rem;
		}

		.shelf-lip {
			top: 2.05rem;
			height: 0.9rem;
			border-radius: 0 0 0.62rem 0.62rem;
		}

		.shelf-bracket {
			top: 0.98rem;
			width: 2.5rem;
			height: 1.95rem;
		}
	}
</style>
