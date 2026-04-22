<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { tick } from 'svelte';
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
		'the-wrong-pet-club/the-wrong-pet-club',
		'the-eastern-valleys/the-eastern-valleys',
		'the-kingdom-of-pillow-fort/the-kingdom-of-pillow-fort',
		'one-wild-day-in-punsburg/one-wild-day-in-punsburg',
		'downriver/downriver',
		'history-close-up/daniel-morgan-and-the-trap-at-cowpens'
	];
	const BACKGROUND_PATTERNS = [
		{
			id: 'diagonal-thread',
			label: 'Diagonal Thread',
			size: '100 199',
			buildPath: (color, opacity) => `
				<g fill="${color}" fill-opacity="${opacity}">
					<path d="M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z"></path>
				</g>
			`
		},
		{
			id: 'graph-paper',
			label: 'Graph Paper',
			size: '100 100',
			buildPath: (color, opacity) => `
				<g fill-rule="evenodd">
					<g fill="${color}" fill-opacity="${opacity}">
						<path opacity=".5" d="M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z"></path>
						<path d="M6 5V0H5v5H0v1h5v94h1V6h94V5H6z"></path>
					</g>
				</g>
			`
		},
		{
			id: 'jupiter',
			label: 'Jupiter',
			size: '52 52',
			buildPath: (color, opacity) => `
				<path fill="${color}" fill-opacity="${opacity}" d="M0 17.83V0h17.83a3 3 0 0 1-5.66 2H5.9A5 5 0 0 1 2 5.9v6.27a3 3 0 0 1-2 5.66zm0 18.34a3 3 0 0 1 2 5.66v6.27A5 5 0 0 1 5.9 52h6.27a3 3 0 0 1 5.66 0H0V36.17zM36.17 52a3 3 0 0 1 5.66 0h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 0 1 0-5.66V52H36.17zM0 31.93v-9.78a5 5 0 0 1 3.8.72l4.43-4.43a3 3 0 1 1 1.42 1.41L5.2 24.28a5 5 0 0 1 0 5.52l4.44 4.43a3 3 0 1 1-1.42 1.42L3.8 31.2a5 5 0 0 1-3.8.72zm52-14.1a3 3 0 0 1 0-5.66V5.9A5 5 0 0 1 48.1 2h-6.27a3 3 0 0 1-5.66-2H52v17.83zm0 14.1a4.97 4.97 0 0 1-1.72-.72l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1 0-5.52l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43c.53-.35 1.12-.6 1.72-.72v9.78zM22.15 0h9.78a5 5 0 0 1-.72 3.8l4.44 4.43a3 3 0 1 1-1.42 1.42L29.8 5.2a5 5 0 0 1-5.52 0l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1-.72-3.8zm0 52c.13-.6.37-1.19.72-1.72l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43a5 5 0 0 1 5.52 0l4.43-4.43a3 3 0 1 1 1.42 1.41l-4.44 4.43c.36.53.6 1.12.72 1.72h-9.78zm9.75-24a5 5 0 0 1-3.9 3.9v6.27a3 3 0 1 1-2 0V31.9a5 5 0 0 1-3.9-3.9h-6.27a3 3 0 1 1 0-2h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 1 1 2 0v6.27a5 5 0 0 1 3.9 3.9h6.27a3 3 0 1 1 0 2H31.9z"></path>
			`
		},
		{
			id: 'texture',
			label: 'Texture',
			size: '4 4',
			buildPath: (color, opacity) => `
				<path fill="${color}" fill-opacity="${opacity}" d="M1 3h1v1H1V3zm2-2h1v1H3V1z"></path>
			`
		},
		{
			id: 'hexagons',
			label: 'Hexagons',
			size: '28 49',
			buildPath: (color, opacity) => `
				<g fill-rule="evenodd">
					<g id="hexagons" fill="${color}" fill-opacity="${opacity}" fill-rule="nonzero">
						<path d="M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z"></path>
					</g>
				</g>
			`
		},
		{
			id: 'star',
			label: 'Star',
			size: '24 24',
			buildPath: (color, opacity) => `
				<g fill="${color}" fill-opacity="${opacity}">
					<polygon fill-rule="evenodd" points="8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4"></polygon>
				</g>
			`
		},
		{
			id: 'brick',
			label: 'Brick',
			size: '42 44',
			buildPath: (color, opacity) => `
				<g id="Page-1" fill="none" fill-rule="evenodd">
					<g id="brick-wall" fill="${color}" fill-opacity="${opacity}">
						<path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"></path>
					</g>
				</g>
			`
		},
		{
			id: 'volcano-lamp',
			label: 'Volcano Lamp',
			size: '48 32',
			buildPath: (color, opacity) => `
				<g fill="none" fill-rule="evenodd">
					<g fill="${color}" fill-opacity="${opacity}">
						<path d="M27 32c0-3.314 2.686-6 6-6 5.523 0 10-4.477 10-10S38.523 6 33 6c-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 6.627 0 12 5.373 12 12s-5.373 12-12 12c-2.21 0-4 1.79-4 4h-2zm-6 0c0-3.314-2.686-6-6-6-5.523 0-10-4.477-10-10S9.477 6 15 6c3.314 0 6-2.686 6-6h-2c0 2.21-1.79 4-4 4C8.373 4 3 9.373 3 16s5.373 12 12 12c2.21 0 4 1.79 4 4h2z"></path>
					</g>
				</g>
			`
		},
		{
			id: 'stripes',
			label: 'Stripes',
			size: '40 1',
			buildPath: (color, opacity) => `
				<path d="M0 0h20v1H0z" fill="${color}" fill-opacity="${opacity}" fill-rule="evenodd"></path>
			`
		},
		{
			id: 'curtain',
			label: 'Curtain',
			size: '44 12',
			buildPath: (color, opacity) => `
				<path d="M20 12v-2L0 0v10l4 2h16zm18 0l4-2V0L22 10v2h16zM20 0v8L4 0h16zm18 0L22 8V0h16z" fill="${color}" fill-opacity="${opacity}" fill-rule="evenodd"></path>
			`
		},
		{
			id: 'melt',
			label: 'Melt',
			size: '24 20',
			buildPath: (color, opacity) => `
				<path d="M20 18c0-1.105.887-2 1.998-2 1.104 0 2-.895 2.002-1.994V14v6h-4v-2zM0 13.998C0 12.895.888 12 2 12c1.105 0 2 .888 2 2 0 1.105.888 2 2 2 1.105 0 2 .888 2 2v2H0v-6.002zm16 4.004A1.994 1.994 0 0 1 14 20c-1.105 0-2-.887-2-1.998v-4.004A1.994 1.994 0 0 0 10 12c-1.105 0-2-.888-2-2 0-1.105-.888-2-2-2-1.105 0-2-.887-2-1.998V1.998A1.994 1.994 0 0 0 2 0a2 2 0 0 0-2 2V0h8v2c0 1.105.888 2 2 2 1.105 0 2 .888 2 2 0 1.105.888 2 2 2 1.105 0 2-.888 2-2 0-1.105.888-2 2-2 1.105 0 2-.888 2-2V0h4v6.002A1.994 1.994 0 0 1 22 8c-1.105 0-2 .888-2 2 0 1.105-.888 2-2 2-1.105 0-2 .887-2 1.998v4.004z" fill="${color}" fill-opacity="${opacity}" fill-rule="evenodd"></path>
			`
		},
		{
			id: 'dots',
			label: 'Dots',
			size: '20 20',
			buildPath: (color, opacity) => `
				<g fill="${color}" fill-opacity="${opacity}" fill-rule="evenodd">
					<circle cx="3" cy="3" r="3"></circle>
					<circle cx="13" cy="13" r="3"></circle>
				</g>
			`
		}
	];
	const HOME_LOGO = {
		src: '/optimized/logo-sign-480.webp',
		srcset:
			'/optimized/logo-sign-320.webp 320w, /optimized/logo-sign-480.webp 480w, /optimized/logo-sign-640.webp 640w',
		sizes: '(max-width: 480px) 88vw, (max-width: 1024px) 480px, 640px',
		width: 480,
		height: 320
	};
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
	let displayMode = $state('table');
	let hoveredBook = $state(null);
	let hoveredBookPopupPlacement = $state('above');
	// Wallpaper: study green + hexagons
	const backgroundForegroundColor = '#1a3020';
	const backgroundColor = '#0f1a12';
	const backgroundForegroundOpacity = 0.4;
	const selectedBackgroundPattern = 'hexagons';

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

	onMount(() => {
		const storedDisplayMode = window.localStorage.getItem('roughdraft-home-view');
		if (storedDisplayMode === 'table' || storedDisplayMode === 'spines') {
			displayMode = storedDisplayMode;
		}

		updateBooksPerShelf();
		window.addEventListener('resize', updateBooksPerShelf);

		return () => {
			window.removeEventListener('resize', updateBooksPerShelf);
		};
	});

	$effect(() => {
		// Re-calculate when mode changes
		displayMode;
		updateBooksPerShelf();
	});

	$effect(() => {
		if (!browser) return;
		window.localStorage.setItem('roughdraft-home-view', displayMode);
	});

	function selectBook(book) {
		goto(`/${book.seriesId}/${book.storyId}`);
	}

	function handleKeyDown(event, book) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectBook(book);
		}
	}

	async function updateHoveredBook(book, event) {
		hoveredBook = book.id;
		hoveredBookPopupPlacement = 'above';

		if (!browser) return;

		await tick();

		const buttonRect = event.currentTarget?.getBoundingClientRect?.();
		const popup = event.currentTarget?.parentElement?.querySelector?.('.book-info-popup');
		const popupRect = popup?.getBoundingClientRect?.();
		if (!buttonRect || !popupRect) return;

		const gap = 18;
		const spaceAbove = buttonRect.top;
		const spaceBelow = window.innerHeight - buttonRect.bottom;

		if (spaceAbove < popupRect.height + gap && spaceBelow > spaceAbove) {
			hoveredBookPopupPlacement = 'below';
		}
	}

	function clearHoveredBook() {
		hoveredBook = null;
		hoveredBookPopupPlacement = 'above';
	}

	function getDisplayHeight(book) {
		// Minimum ~220, Maximum ~270. book.height ranges 237-259
		// Height already has hash-based jitter from the content pipeline
		return Math.round(210 + (book.height - 230) * 1.8);
	}

	function getDisplayWidth(book) {
		// Maintain ~2/3 aspect ratio
		return Math.round(getDisplayHeight(book) * 0.67);
	}

	function getDisplayDepth(book) {
		return Math.max(16, Math.round(book.thickness * 0.32));
	}

	function setDisplayMode(mode) {
		displayMode = mode;
	}

	function getCoverImageProps(book) {
		return COVER_IMAGE_VARIANTS[book.coverImage] ?? null;
	}

	function getSpineWidth(book) {
		const spineTitle = getSpineTitle(book);
		const titleLength = spineTitle.length;
		const baseWidth = getDisplayDepth(book) * 1.5;

		// Titles over ~14 chars will wrap to 2 lines — give them more width
		const needsTwoLines = titleLength > 14;
		const minWidth = needsTwoLines ? 32 : 24;
		const maxWidth = needsTwoLines ? 52 : 40;
		const titleAllowance = Math.min(16, Math.floor(titleLength / 3));

		return Math.max(minWidth, Math.min(maxWidth, Math.round(baseWidth + titleAllowance)));
	}

	function getSpineFontSize(book) {
		const titleLength = book.title.length;

		if (titleLength > 34) return 0.68;
		if (titleLength > 26) return 0.72;
		if (titleLength > 18) return 0.76;
		return 0.82;
	}

	function getSpineLetterSpacing(book) {
		const titleLength = book.title.length;

		if (titleLength > 30) return 0.5;
		if (titleLength > 22) return 0.75;
		return 1;
	}

	function getSpineTitle(book) {
		const title = book.title.trim();
		if (title.length <= 24) return title;

		const colonTitle = title.split(':')[0]?.trim();
		if (colonTitle && colonTitle.length >= 8 && colonTitle.length <= 24) {
			return colonTitle;
		}

		const andTheIndex = title.toLowerCase().indexOf(' and the ');
		if (andTheIndex > 8) {
			const truncated = title.slice(0, andTheIndex).trim();
			if (truncated.length <= 24) return truncated;
		}

		const words = title.split(/\s+/);
		if (words.length >= 3) {
			const compact = words.slice(0, 3).join(' ');
			if (compact.length <= 24) return compact;
		}

		return title;
	}

	function getDisplayTilt(book) {
		return Math.max(-1, Math.min(1, book.tilt * 0.3));
	}

	function getSpineTilt(book) {
		return Math.max(-0.15, Math.min(0.15, book.tilt * 0.06));
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
		if (book.description.length <= 120) return book.description;
		return `${book.description.slice(0, 117).trimEnd()}...`;
	}

	function getTagPreview(book) {
		return (book.tags || []).slice(0, 3);
	}

	function getCoverFallbackLabel(book) {
		return book.title
			.split(/\s+/)
			.slice(0, 2)
			.map((word) => word[0])
			.join('')
			.toUpperCase();
	}

	function getBackgroundPattern(patternId) {
		return (
			BACKGROUND_PATTERNS.find((pattern) => pattern.id === patternId) ?? BACKGROUND_PATTERNS[0]
		);
	}

	function buildPatternSvg(pattern, color, opacity) {
		const [width, height] = pattern.size.split(' ');
		return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${pattern.buildPath(color, opacity)}</svg>`;
	}

	function createSvgDataUrl(svg) {
		return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
	}

	function searchMatches(book, query) {
		if (!query) return true;

		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) return true;

		return matchesBook(book, [normalizedQuery]);
	}

	function getMainShelfWidth() {
		if (viewportWidth < 480) return Math.max(280, viewportWidth - 28);
		if (viewportWidth < 768) return Math.max(340, viewportWidth - 38);
		if (viewportWidth < 1024) return Math.min(736, viewportWidth - 44);
		return Math.min(1088, viewportWidth - 64);
	}

	function getShelfGap() {
		return displayMode === 'spines' ? 2 : viewportWidth < 480 ? 9 : 16;
	}

	function getBookFootprint(book) {
		return displayMode === 'spines' ? getSpineWidth(book) : getDisplayWidth(book);
	}

	function packBooksIntoShelves(books) {
		if (!books.length) return [];

		const rows = [];
		const maxWidth = getMainShelfWidth();
		const gap = getShelfGap();
		let currentRow = [];
		let currentWidth = 0;

		for (const book of books) {
			const bookWidth = getBookFootprint(book);
			const nextWidth = currentRow.length === 0 ? bookWidth : currentWidth + gap + bookWidth;

			if (currentRow.length > 0 && nextWidth > maxWidth) {
				rows.push(currentRow);
				currentRow = [book];
				currentWidth = bookWidth;
				continue;
			}

			currentRow.push(book);
			currentWidth = nextWidth;
		}

		if (currentRow.length > 0) {
			rows.push(currentRow);
		}

		return rows;
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

	const featuredBookShelves = $derived.by(() =>
		Array.from(
			{ length: Math.ceil(featuredBooks.length / featuredBooksPerShelf) },
			(_, shelfIndex) =>
				featuredBooks.slice(
					shelfIndex * featuredBooksPerShelf,
					(shelfIndex + 1) * featuredBooksPerShelf
				)
		)
	);

	const filteredBookList = $derived(
		bookList.filter((book) => filterMatches(book, activeFilter) && searchMatches(book, searchQuery))
	);

	const mainBookShelves = $derived.by(() => packBooksIntoShelves(filteredBookList));
	const wallpaperStyle = $derived.by(() => {
		const pattern = getBackgroundPattern(selectedBackgroundPattern);
		const svg = buildPatternSvg(
			pattern,
			backgroundForegroundColor,
			Number(backgroundForegroundOpacity).toFixed(2)
		);

		return `background-color: ${backgroundColor}; background-image: ${createSvgDataUrl(svg)};`;
	});
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
	{@html `<script type="application/ld+json">${homeStructuredData}</script>`}
</svelte:head>

<div class="bookshelf-room">
	<!-- Subtle Background Pattern -->
	<div class="wallpaper-background" style={wallpaperStyle}></div>

	<!-- Vignette overlay -->
	<div class="room-vignette"></div>

	<!-- Dust Particles for Atmosphere -->
	<div class="dust-container">
		{#each Array(20) as _, i}
			<div
				class="dust"
				style="
				--duration: {15 + (i % 10)}s;
				--opacity: {0.1 + (i % 5) * 0.1};
				--left: {i * 5}%;
				--top: {(i * 7) % 100}%;
				--x: {(i % 2 === 0 ? 1 : -1) * (50 + (i % 50))}px;
				--y: {-100 - (i % 100)}px;
				"
			></div>
		{/each}
	</div>

	<div class="container">
		<header class="bookshelf-header">
			<div class="logo-container">
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
				/>
			</div>
			<div class="hero-copy">
				<h1>{SITE_NAME}</h1>
				<p>
					Online kids stories for read-aloud time, bedtime, and independent readers, from silly
					adventures to narrative history.
				</p>
				<div class="hero-links">
					<a href="/characters" class="hero-link">Character Lab</a>
				</div>
			</div>
		</header>

		{#if featuredBooks.length > 0}
			<section class="featured-shelf-section" aria-labelledby="featured-shelf-heading">
				<div class="featured-copy">
					<h2 id="featured-shelf-heading">Featured Books</h2>
				</div>

				{#each featuredBookShelves as featuredShelf, shelfIndex}
					<div class="shelf-row featured-shelf-row">
						<div class="shelf-back-glow" aria-hidden="true"></div>

						<div class="wooden-shelf">
							<div class="shelf-surface"></div>
							<div class="shelf-lip"></div>
							<div class="shelf-bracket shelf-bracket-left"></div>
							<div class="shelf-bracket shelf-bracket-right"></div>
							<div class="shelf-shadow"></div>
						</div>

						<div class="shelf-books covers-mode featured-shelf-books">
							{#each featuredShelf as book (book.id)}
								<div class="book-item">
									<button
										class="book-card featured-book-card covers"
										style="--book-color: {book.leatherColor}; --book-width: {getDisplayWidth(
											book
										)}px; --book-height: {getDisplayHeight(book)}px; --book-depth: {getDisplayDepth(
											book
										)}px; --book-lean: {getDisplayTilt(book)}deg;"
										onclick={() => selectBook(book)}
										onkeydown={(e) => handleKeyDown(e, book)}
										aria-label="Select featured book {book.title}"
									>
										<div class="book-3d-wrapper">
											<div class="book-cover-front">
												<div class="cover-texture">
													<div class="cover-content {book.coverImage ? 'no-padding' : ''}">
														<div class="cover-border">
															<h3
																class="book-title {book.id.length % 7 === 0 ? 'gold-embossed' : ''}"
															>
																{book.title}
															</h3>
															{#if book.coverImage}
																{@const coverImageProps = getCoverImageProps(book)}
																<div class="book-cover-image-container">
																	<img
																		src={coverImageProps?.src ?? book.coverImage}
																		srcset={coverImageProps?.srcset}
																		sizes={coverImageProps?.sizes}
																		alt={book.title}
																		class="book-cover-image"
																		width={coverImageProps?.width}
																		height={coverImageProps?.height}
																		loading="lazy"
																		decoding="async"
																	/>
																</div>
															{/if}
														</div>
													</div>
												</div>
												<div class="cover-edge-right"></div>
												<div class="cover-edge-bottom"></div>
											</div>
											<div class="book-pages-top" aria-hidden="true"></div>
											<div class="book-pages-right" aria-hidden="true"></div>
											<div class="book-pages-bottom" aria-hidden="true"></div>
											<div class="book-spine" aria-hidden="true"></div>
											<div class="book-back" aria-hidden="true"></div>
										</div>
									</button>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</section>
		{/if}

		<section class="bookshelf-controls" aria-label="Story filters">
			<div class="control-group">
				<label class="control-label" for="story-filter">Filter</label>
				<select id="story-filter" class="control-select" bind:value={activeFilter}>
					{#each availableFilters as filter (filter.id)}
						<option value={filter.id}>{filter.label} ({filter.count})</option>
					{/each}
				</select>
			</div>

			<div class="control-group control-group-search">
				<label class="control-label" for="story-search">Search</label>
				<div class="control-search-row">
					<input
						id="story-search"
						class="control-input"
						type="search"
						bind:value={searchQuery}
						placeholder="Search titles, genres, tags, and descriptions"
						autocomplete="off"
					/>
					<div class="view-toggle" role="tablist" aria-label="Choose story view">
						<button
							type="button"
							class:active={displayMode === 'table'}
							class="view-toggle-button"
							role="tab"
							aria-selected={displayMode === 'table'}
							aria-controls="story-table-view"
							onclick={() => setDisplayMode('table')}
						>
							Table
						</button>
						<button
							type="button"
							class:active={displayMode === 'spines'}
							class="view-toggle-button"
							role="tab"
							aria-selected={displayMode === 'spines'}
							aria-controls="story-spine-view"
							onclick={() => setDisplayMode('spines')}
						>
							Spines
						</button>
					</div>
				</div>
			</div>
		</section>

		{#if displayMode === 'table'}
			<section class="story-table-shell" id="story-table-view" aria-label="Story table view">
				<div class="story-table-header">
					<div>
						<h2>Browse the catalog</h2>
						<p>{filteredBookList.length} stories ready to open.</p>
					</div>
				</div>

				<div class="story-table-scroll">
					<table class="story-table">
						<thead>
							<tr>
								<th scope="col">Story</th>
								<th scope="col">Series</th>
								<th scope="col">Genre</th>
								<th scope="col">Tags</th>
								<th scope="col" class="table-action-heading">Open</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredBookList as book (book.id)}
								<tr>
									<td>
										<div class="story-cell">
											<div
												class="story-cover-preview"
												style={`--cover-color: ${book.leatherColor};`}
											>
												<div class="story-mini-book">
													<div class="story-mini-cover">
														<div class="story-mini-cover-texture">
															<div class="story-mini-cover-border">
																{#if book.coverImage}
																	{@const coverImageProps = getCoverImageProps(book)}
																	<img
																		src={coverImageProps?.src ?? book.coverImage}
																		srcset={coverImageProps?.srcset}
																		sizes="44px"
																		alt=""
																		class="story-cover-image"
																		width="44"
																		height="58"
																		loading="lazy"
																		decoding="async"
																	/>
																{:else}
																	<div class="story-cover-fallback">
																		<span>{getCoverFallbackLabel(book)}</span>
																	</div>
																{/if}
																<div class="story-mini-title">
																	{getSpineTitle(book)}
																</div>
															</div>
														</div>
													</div>
													<div class="story-mini-pages" aria-hidden="true"></div>
													<div class="story-mini-spine" aria-hidden="true"></div>
												</div>
											</div>
											<div class="story-meta">
												<div class="story-title-line">{book.title}</div>
												<div class="story-subline">{getTableDescription(book)}</div>
											</div>
										</div>
									</td>
									<td>
										<div class="series-chip">{book.seriesTitle}</div>
									</td>
									<td>
										<div class="genre-copy">{book.genre}</div>
									</td>
									<td>
										<div class="tag-list" aria-label={`Tags for ${book.title}`}>
											{#each getTagPreview(book) as tag}
												<span class="tag-pill">{tag}</span>
											{/each}
										</div>
									</td>
									<td class="table-action-cell">
										<button type="button" class="read-book-button" onclick={() => selectBook(book)}>
											Read book
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				{#if filteredBookList.length === 0}
					<div class="empty-filter-state table-empty-state">
						<p>No stories match that shelf yet.</p>
					</div>
				{/if}
			</section>
		{:else}
			<!-- Bookshelf with Shelves -->
			<div class="bookshelf-container" id="story-spine-view">
				{#each mainBookShelves as shelfBooks, shelfIndex}
					<div class="shelf-row">
						<div class="shelf-back-glow" aria-hidden="true"></div>

						<!-- Wooden shelf -->
						<div class="wooden-shelf">
							<div class="shelf-surface"></div>
							<div class="shelf-lip"></div>
							<div class="shelf-bracket shelf-bracket-left"></div>
							<div class="shelf-bracket shelf-bracket-right"></div>
							<div class="shelf-shadow"></div>
						</div>

						<!-- Books on this shelf -->
						<div class="shelf-books spines-mode">
							{#each shelfBooks as book (book.id)}
								<div class="book-item">
									{#if hoveredBook === book.id}
										<div
											class:below={hoveredBookPopupPlacement === 'below'}
											class="book-info-popup"
										>
											<div class="popup-content">
												<h4>{book.title}</h4>
												<p class="popup-description">{book.description?.slice(0, 100)}...</p>
												{#if book.hasAudio}
													<span class="popup-tag">🎧 Audio</span>
												{/if}
											</div>
											<div class="popup-arrow"></div>
										</div>
									{/if}

									<button
										class="book-card spines"
										style="--book-color: {book.leatherColor}; --book-width: {getSpineWidth(
											book
										)}px; --book-height: {getDisplayHeight(book)}px; --book-depth: {getDisplayWidth(
											book
										)}px; --book-lean: {getSpineTilt(
											book
										)}deg; --spine-font-size: {getSpineFontSize(
											book
										)}rem; --spine-letter-spacing: {getSpineLetterSpacing(book)}px;"
										onclick={() => selectBook(book)}
										onkeydown={(e) => handleKeyDown(e, book)}
										onmouseenter={(event) => updateHoveredBook(book, event)}
										onmouseleave={clearHoveredBook}
										aria-label="Select {book.title}"
									>
										<div class="book-3d-wrapper">
											<div
												class="spine-front-view"
												style="background-color: var(--book-color); --band-offset: {book.bandOffset}%;"
											>
												<div class="spine-title-container">
													<span class="spine-title-text">{getSpineTitle(book)}</span>
												</div>
												{#if book.accentMetal !== 'none'}
													{#if book.bandStyle === 'double'}
														<div class="spine-accents top {book.accentMetal}"></div>
														<div class="spine-accents bottom {book.accentMetal}"></div>
													{:else if book.bandStyle === 'single-top'}
														<div class="spine-accents top {book.accentMetal}"></div>
													{:else if book.bandStyle === 'triple'}
														<div class="spine-accents top {book.accentMetal}"></div>
														<div class="spine-accents mid {book.accentMetal}"></div>
														<div class="spine-accents bottom {book.accentMetal}"></div>
													{/if}
												{/if}
											</div>
											<div class="book-cover-side-view">
												<div class="cover-texture"></div>
											</div>
											<div class="book-pages-top" aria-hidden="true"></div>
											<div class="book-pages-bottom" aria-hidden="true"></div>
											<div class="book-pages-right-view" aria-hidden="true"></div>
										</div>
									</button>
								</div>
							{/each}
						</div>
					</div>
				{/each}

				{#if filteredBookList.length === 0}
					<div class="empty-filter-state">
						<p>No stories match that shelf yet.</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}

	.bookshelf-room {
		font-family:
			'Inter',
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		--book-scale: 1;
		min-height: 100vh;
		background: #0f172a; /* Base color for both */
		position: relative;
		overflow-x: hidden;
		transition: filter 0.3s ease-out;
	}

	:global(.light) .bookshelf-room {
		filter: brightness(1.1) contrast(0.95); /* A 'little lighter' */
	}

	.wallpaper-background {
		position: absolute;
		inset: 0;
		background-position: top left;
		background-repeat: repeat;
		transition:
			background-color 0.2s ease,
			background-image 0.2s ease;
		z-index: 1;
	}

	.room-vignette {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.05) 100%);
		pointer-events: none;
		z-index: 2;
	}

	:global(.dark) .room-vignette {
		background: radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.4) 100%);
	}

	.container {
		position: relative;
		z-index: 12;
		width: 100%;
		max-width: 1380px;
		margin: 0 auto;
		padding: 5rem 1.5rem 5rem;
	}

	.bookshelf-header {
		text-align: center;
		margin-bottom: 4rem;
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2.5rem;
	}

	.logo-container {
		position: relative;
		width: min(700px, 95vw);
		margin: 0 auto;
		overflow: visible; /* Fix clipping */
	}

	.logo {
		width: 100%;
		height: auto;
		display: block;
		aspect-ratio: 3 / 2;
		filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
	}

	.hero-copy {
		max-width: 42rem;
		text-align: center;
	}

	.hero-copy h1 {
		margin: 0 0 0.8rem;
		font-size: clamp(2.1rem, 4vw, 3.25rem);
		line-height: 1.02;
		font-weight: 700;
		letter-spacing: -0.035em;
		color: #fff8ef;
		text-wrap: balance;
	}

	.hero-copy p {
		margin: 0;
		max-width: 38rem;
		font-size: clamp(1.02rem, 1.45vw, 1.14rem);
		line-height: 1.68;
		color: rgba(255, 248, 237, 0.78);
		text-wrap: pretty;
	}

	.hero-links {
		margin-top: 1.25rem;
		display: flex;
		justify-content: center;
	}

	.hero-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.8rem 1.15rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 248, 237, 0.16);
		background: rgba(255, 248, 237, 0.08);
		color: #fff8ef;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-decoration: none;
		backdrop-filter: blur(8px);
		transition:
			transform 0.2s ease,
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.hero-link:hover {
		transform: translateY(-1px);
		background: rgba(255, 248, 237, 0.14);
		border-color: rgba(255, 248, 237, 0.28);
	}

	.featured-shelf-section {
		margin: 0 auto 3.25rem;
		max-width: 1240px;
	}

	.featured-copy {
		margin-bottom: 0.95rem;
		padding: 0 0.75rem;
		text-align: left;
	}

	.featured-kicker {
		margin: 0 0 0.35rem;
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(255, 241, 214, 0.72);
	}

	.featured-copy h2 {
		margin: 0;
		font-size: clamp(1.3rem, 2.2vw, 1.9rem);
		font-weight: 650;
		line-height: 1.08;
		letter-spacing: -0.02em;
		color: #fff8ef;
		text-wrap: balance;
	}

	.bookshelf-controls {
		display: grid;
		grid-template-columns: minmax(12rem, 18rem) minmax(0, 1fr);
		gap: 1.1rem;
		align-items: end;
		width: 100%;
		max-width: 1240px;
		margin: 0 auto 2.25rem;
		padding: 0 0.75rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.control-group-search {
		min-width: 0;
	}

	.control-search-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.9rem;
		align-items: center;
	}

	.control-label {
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: rgba(255, 241, 214, 0.72);
	}

	.control-select,
	.control-input {
		width: 100%;
		height: 3.1rem;
		padding: 0.85rem 1rem;
		border-radius: 1rem;
		border: 1px solid rgba(255, 248, 237, 0.12);
		background: rgba(255, 248, 237, 0.07);
		color: #fff8ef;
		font-size: 1rem;
		font-weight: 500;
		backdrop-filter: blur(10px);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			box-shadow 0.2s ease;
	}

	.control-select {
		appearance: none;
	}

	.control-select option {
		background: #1e293b;
		color: #fff8ef;
	}

	.control-input::placeholder {
		color: rgba(255, 248, 237, 0.5);
	}

	.control-select:focus,
	.control-input:focus {
		outline: none;
		border-color: rgba(255, 244, 224, 0.4);
		background: rgba(255, 248, 237, 0.12);
		box-shadow: 0 0 0 4px rgba(255, 248, 237, 0.08);
	}

	.view-toggle {
		display: inline-grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		padding: 0.22rem;
		border: 1px solid rgba(255, 248, 237, 0.14);
		border-radius: 1rem;
		background: rgba(9, 18, 14, 0.42);
		backdrop-filter: blur(14px);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}

	.view-toggle-button {
		min-width: 6rem;
		height: 2.6rem;
		padding: 0 1rem;
		border: none;
		border-radius: 0.8rem;
		background: transparent;
		color: rgba(255, 248, 237, 0.72);
		font-size: 0.92rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.view-toggle-button:hover {
		color: #fff8ef;
	}

	.view-toggle-button.active {
		background:
			linear-gradient(180deg, rgba(161, 116, 54, 0.92), rgba(117, 72, 29, 0.96)),
			rgba(117, 72, 29, 0.96);
		color: #fff8ef;
		box-shadow:
			inset 0 1px 0 rgba(255, 240, 209, 0.35),
			0 0.45rem 1rem rgba(46, 24, 8, 0.32);
	}

	.story-table-shell {
		width: 100%;
		max-width: 1240px;
		margin: 0 auto;
		padding: 0.35rem 0 0;
	}

	.story-table-header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
		padding: 0 0.75rem 1.15rem;
	}

	.story-table-header h2 {
		margin: 0;
		font-size: clamp(1.2rem, 1.8vw, 1.55rem);
		font-weight: 650;
		letter-spacing: -0.02em;
		color: #fff8ef;
	}

	.story-table-header p {
		margin: 0.4rem 0 0;
		color: rgba(255, 244, 224, 0.68);
		font-size: 0.96rem;
		line-height: 1.55;
	}

	.story-table-scroll {
		overflow-x: auto;
		padding: 0 0.75rem;
	}

	.story-table {
		width: 100%;
		min-width: 900px;
		border-collapse: separate;
		border-spacing: 0;
		background: transparent;
	}

	.story-table thead th {
		padding: 0.85rem 1.1rem 0.95rem;
		text-align: left;
		font-size: 0.84rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		white-space: nowrap;
		color: rgba(255, 244, 224, 0.64);
		border-bottom: 1px solid rgba(255, 248, 237, 0.12);
	}

	.story-table tbody tr {
		transition:
			background 0.2s ease,
			transform 0.2s ease;
	}

	.story-table tbody tr:hover {
		background: rgba(255, 248, 237, 0.035);
	}

	.story-table tbody td {
		padding: 1rem 1.1rem 1.05rem;
		vertical-align: middle;
		border-bottom: 1px solid rgba(255, 248, 237, 0.08);
	}

	.story-table tbody tr:last-child td {
		border-bottom: none;
	}

	.story-cell {
		display: grid;
		grid-template-columns: 2.75rem minmax(0, 1fr);
		gap: 0.95rem;
		align-items: start;
	}

	.story-cover-preview {
		width: 2.75rem;
		height: 3.65rem;
		perspective: 800px;
	}

	.story-mini-book {
		position: relative;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transform: rotateY(-16deg) rotateX(6deg);
		filter: drop-shadow(0 0.65rem 1rem rgba(0, 0, 0, 0.24));
	}

	.story-mini-cover {
		position: absolute;
		inset: 0;
		border-radius: 0.38rem 0.5rem 0.5rem 0.38rem;
		background: var(--cover-color);
		transform: translateZ(2px);
		overflow: hidden;
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.08),
			2px 0 5px rgba(0, 0, 0, 0.22);
	}

	.story-mini-cover-texture {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(
			to right,
			rgba(0, 0, 0, 0.12),
			transparent 12%,
			transparent 88%,
			rgba(0, 0, 0, 0.08)
		);
	}

	.story-mini-cover-border {
		position: absolute;
		inset: 0;
		overflow: hidden;
		background: radial-gradient(circle at center, transparent 32%, rgba(0, 0, 0, 0.34) 112%);
	}

	.story-mini-title {
		position: absolute;
		left: 0.32rem;
		right: 0.32rem;
		top: 0.36rem;
		color: rgba(255, 248, 237, 0.94);
		font-size: 0.4rem;
		font-weight: 800;
		line-height: 1.1;
		text-align: center;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
		text-wrap: balance;
		z-index: 2;
	}

	.story-mini-pages {
		position: absolute;
		top: 2px;
		bottom: 2px;
		right: -4px;
		width: 0.38rem;
		background:
			linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent 40%),
			url('/optimized/paper-texture.webp');
		background-size: cover;
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
			url('/optimized/leather-texture.webp'), var(--cover-color);
		background-size: cover;
		transform: rotateY(90deg);
		transform-origin: left center;
	}

	.story-cover-image,
	.story-cover-fallback {
		width: 100%;
		height: 100%;
		display: block;
	}

	.story-cover-image {
		object-fit: cover;
		opacity: 0.82;
		mix-blend-mode: multiply;
		filter: contrast(1.08) saturate(0.92) brightness(0.9);
	}

	.story-cover-fallback {
		position: relative;
		background:
			linear-gradient(
				90deg,
				rgba(0, 0, 0, 0.22),
				transparent 18%,
				transparent 82%,
				rgba(0, 0, 0, 0.18)
			),
			url('/optimized/leather-texture.webp');
		background-size: cover;
	}

	.story-cover-fallback::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.2));
	}

	.story-cover-fallback span {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		color: rgba(255, 248, 237, 0.88);
		font-size: 0.64rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		z-index: 1;
	}

	.story-meta {
		min-width: 0;
	}

	.story-title-line {
		color: #fff8ef;
		font-size: 1rem;
		font-weight: 650;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}

	.story-subline {
		margin-top: 0.3rem;
		max-width: 48ch;
		color: rgba(255, 244, 224, 0.62);
		font-size: 0.92rem;
		line-height: 1.52;
	}

	.series-chip,
	.tag-pill {
		display: inline-flex;
		align-items: center;
		border-radius: 999px;
	}

	.series-chip {
		padding: 0.42rem 0.78rem;
		background: rgba(31, 58, 41, 0.68);
		border: 1px solid rgba(129, 168, 143, 0.16);
		color: #ddefdf;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.genre-copy {
		color: rgba(255, 248, 237, 0.86);
		font-size: 0.94rem;
		font-weight: 500;
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.tag-pill {
		padding: 0.34rem 0.62rem;
		background: rgba(255, 248, 237, 0.06);
		border: 1px solid rgba(255, 248, 237, 0.08);
		color: rgba(255, 244, 224, 0.82);
		font-size: 0.8rem;
		font-weight: 500;
	}

	.table-action-heading,
	.table-action-cell {
		text-align: right;
	}

	.read-book-button {
		height: 2.55rem;
		padding: 0 0.95rem;
		border: 1px solid rgba(255, 231, 177, 0.18);
		border-radius: 0.85rem;
		background:
			linear-gradient(180deg, rgba(156, 112, 53, 0.94), rgba(117, 72, 29, 0.98)),
			rgba(117, 72, 29, 0.98);
		color: #fff8ef;
		font-size: 0.88rem;
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
		box-shadow:
			inset 0 1px 0 rgba(255, 240, 209, 0.3),
			0 0.7rem 1.2rem rgba(45, 26, 10, 0.22);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			filter 0.2s ease;
	}

	.read-book-button:hover {
		transform: translateY(-1px);
		filter: brightness(1.05);
		box-shadow:
			inset 0 1px 0 rgba(255, 240, 209, 0.34),
			0 0.9rem 1.5rem rgba(45, 26, 10, 0.28);
	}

	.bookshelf-container {
		width: 100%;
		max-width: 1240px;
		margin: 0 auto;
		padding: 0.75rem 0 0;
	}

	.empty-filter-state {
		margin: 2rem auto 0;
		max-width: 26rem;
		padding: 1rem 1.25rem;
		border-radius: 1rem;
		text-align: center;
		background: rgba(255, 246, 233, 0.88);
		color: #6b3f1b;
		box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.14);
	}

	.table-empty-state {
		margin-top: 1rem;
	}

	.shelf-row {
		--shelf-offset: 1.4rem;
		--shelf-height: 3.45rem;
		--shelf-seam-from-top: 1.42rem;
		position: relative;
		margin-bottom: 2.5rem;
		height: 24rem;
		overflow: visible;
	}

	.featured-shelf-row {
		--book-scale: 0.9;
		margin-bottom: 3.5rem;
		height: 22.5rem;
	}

	.featured-shelf-books {
		width: min(74rem, calc(100% - 1rem));
		height: 18.75rem;
		justify-content: center;
		gap: clamp(0.75rem, 2vw, 1.5rem);
	}

	.shelf-back-glow {
		position: absolute;
		left: 50%;
		bottom: 3.8rem;
		width: min(72rem, 100%);
		height: 12rem;
		transform: translateX(-50%);
		border-radius: 2rem;
		background: radial-gradient(ellipse at center, rgba(255, 250, 230, 0.08), transparent 70%);
		filter: blur(15px);
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
		width: min(72rem, calc(100% - 2rem));
		height: var(--shelf-height);
		transform: translateX(-50%);
		z-index: 1;
	}

	.shelf-surface {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1.65rem;
		border-radius: 0.25rem 0.25rem 0.15rem 0.15rem;
		background:
			linear-gradient(
				90deg,
				rgba(0, 0, 0, 0.15),
				transparent 15%,
				transparent 85%,
				rgba(0, 0, 0, 0.15)
			),
			linear-gradient(
				180deg,
				rgba(255, 255, 255, 0.1) 0%,
				transparent 40%,
				rgba(0, 0, 0, 0.2) 100%
			),
			#63432a;
		background-image:
			linear-gradient(
				90deg,
				rgba(0, 0, 0, 0.15),
				transparent 15%,
				transparent 85%,
				rgba(0, 0, 0, 0.15)
			),
			linear-gradient(
				180deg,
				rgba(255, 255, 255, 0.1) 0%,
				transparent 40%,
				rgba(0, 0, 0, 0.2) 100%
			),
			url('/optimized/shelf-wood-texture.webp');
		background-size: cover;
		background-blend-mode: multiply, normal, overlay;
		box-shadow:
			0 0.5rem 1.5rem rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.15),
			inset 0 -0.2rem 0.5rem rgba(0, 0, 0, 0.3);
	}

	.shelf-surface::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: rgba(255, 255, 255, 0.08);
		box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.2);
	}

	.shelf-lip {
		position: absolute;
		top: 1.55rem;
		left: 0.25rem;
		right: 0.25rem;
		height: 1.45rem;
		border-radius: 0 0 0.8rem 0.8rem;
		background:
			linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 20%, rgba(0, 0, 0, 0.4) 100%),
			#4d3321;
		background-image:
			linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 20%, rgba(0, 0, 0, 0.4) 100%),
			url('/optimized/shelf-wood-texture.webp');
		background-size: cover;
		background-blend-mode: normal, overlay;
		box-shadow:
			0 1.2rem 2.5rem rgba(0, 0, 0, 0.5),
			inset 0 1px 1px rgba(255, 255, 255, 0.1),
			inset 0 -0.2rem 0.4rem rgba(0, 0, 0, 0.4);
	}

	.shelf-bracket {
		position: absolute;
		top: 1.25rem;
		width: 3.5rem;
		height: 2.75rem;
		border-radius: 0.2rem 0.2rem 1.5rem 1.5rem;
		background: #3a2619;
		background-image:
			linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.28)),
			url('/optimized/shelf-bracket-texture.webp');
		background-size:
			cover,
			96px 96px;
		box-shadow:
			0 0.8rem 1.5rem rgba(0, 0, 0, 0.6),
			inset 0 1px 1px rgba(255, 255, 255, 0.05);
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
		top: 2.85rem;
		left: 2.25rem;
		right: 2.25rem;
		height: 1rem;
		background: radial-gradient(ellipse at center, rgba(92, 92, 92, 0.16), transparent 72%);
		border-radius: 999px;
		z-index: -1;
		filter: blur(6px);
	}

	.shelf-books {
		position: absolute;
		bottom: calc(var(--shelf-offset) + var(--shelf-height) - var(--shelf-seam-from-top));
		left: 50%;
		width: min(68rem, calc(100% - 2rem));
		height: 20rem;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		padding: 0 1rem;
		z-index: 5;
		overflow: visible;
	}

	.book-item {
		position: relative;
		display: flex;
		align-items: flex-end;
	}

	.book-info-popup {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%) translateY(-20px);
		width: 240px;
		max-width: min(240px, calc(100vw - 24px));
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-radius: 12px;
		padding: 15px;
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.2),
			inset 0 0 0 1px rgba(255, 255, 255, 0.5);
		z-index: 2000;
		pointer-events: none;
		animation: popupFadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.book-info-popup.below {
		bottom: auto;
		top: 100%;
		transform: translateX(-50%) translateY(16px);
	}

	:global(.dark) .book-info-popup {
		background: rgba(30, 41, 59, 0.9);
		color: #fff;
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
	}

	@keyframes popupFadeIn {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-10px) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(-20px) scale(1);
		}
	}

	.popup-content h4 {
		margin: 0 0 8px 0;
		font-size: 1.05rem;
		font-weight: 650;
		line-height: 1.2;
		color: #1a1a1a;
	}

	:global(.dark) .popup-content h4 {
		color: #fff;
	}

	.popup-description {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.5;
		color: #4b5563;
		opacity: 0.9;
	}

	:global(.dark) .popup-description {
		color: #cbd5e1;
	}

	.popup-tag {
		display: inline-block;
		margin-top: 10px;
		font-size: 0.8rem;
		font-weight: 600;
		color: #2563eb;
	}

	.popup-arrow {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-top: 10px solid rgba(255, 255, 255, 0.95);
	}

	.book-info-popup.below .popup-arrow {
		top: auto;
		bottom: 100%;
		border-top: none;
		border-bottom: 10px solid rgba(255, 255, 255, 0.95);
	}

	:global(.dark) .popup-arrow {
		border-top-color: rgba(30, 41, 59, 0.9);
	}

	:global(.dark) .book-info-popup.below .popup-arrow {
		border-bottom-color: rgba(30, 41, 59, 0.9);
	}

	.covers-mode {
		gap: clamp(0.75rem, 2vw, 1.75rem);
	}

	.spines-mode {
		gap: 2px;
	}

	.book-card.spines .book-3d-wrapper {
		transform: rotateY(0deg) rotateX(0deg);
	}

	.book-card.spines {
		transform: translateY(0) rotateZ(var(--book-lean));
	}

	/* Hide white page edges in spine mode — they peek through as white lines */
	.book-card.spines .book-pages-top,
	.book-card.spines .book-pages-bottom,
	.book-card.spines .book-pages-right-view {
		background: var(--book-color);
		background-image: none;
	}

	.book-card.spines:hover .book-3d-wrapper {
		/* NO TILT for spines anymore - stay clean on shelf */
		transform: translateZ(0) translateY(0) rotateY(0deg);
	}

	.book-card {
		--book-width: 176px;
		--book-height: 248px;
		--book-depth: 24px;
		--book-lean: 0deg;
		--book-border-radius: 2px 4px 4px 2px;

		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		perspective: 1500px;
		flex: 0 0 auto;
		position: relative;
		width: calc(var(--book-width) * var(--book-scale));
		height: calc(var(--book-height) * var(--book-scale));
		transform: translateY(0) rotateZ(var(--book-lean));
		transform-origin: center bottom;
		transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.book-card:hover {
		z-index: 20;
	}

	.book-3d-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
		/* Initial tilt to show bottom-right side slightly */
		transform: rotateY(-12deg) rotateX(4deg);
	}

	.book-card:hover .book-3d-wrapper {
		/* 'Grabbed' look: scaled up, lifted, and rotated to show more side/bottom */
		transform: translateY(-20px) scale(1.12) rotateY(-28deg) rotateX(10deg);
	}

	.book-cover-front {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: var(--book-border-radius);
		overflow: visible; /* Changed from hidden to show edge planes */
		transform-style: preserve-3d;
		z-index: 2;
		background-color: var(--book-color);
		/* Move front cover forward by 3px */
		transform: translateZ(3px);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.1),
			2px 0 5px rgba(0, 0, 0, 0.2);
	}

	.cover-edge-right {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 3px;
		background: var(--book-color);
		transform: rotateY(90deg);
		transform-origin: right;
		filter: brightness(0.8);
	}

	.cover-edge-bottom {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3px;
		background: var(--book-color);
		transform: rotateX(-90deg);
		transform-origin: bottom;
		filter: brightness(0.7);
	}

	.cover-texture {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		background-image: linear-gradient(
			to right,
			rgba(0, 0, 0, 0.1),
			transparent 10%,
			transparent 90%,
			rgba(0, 0, 0, 0.05)
		);
	}

	.cover-texture::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: url('/optimized/paper-texture.webp');
		background-size: 160px;
		opacity: 0.05;
		z-index: 1;
		mix-blend-mode: overlay;
	}

	.cover-content {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		z-index: 2;
	}

	.cover-content.no-padding {
		width: 100%;
		height: 100%;
	}

	.cover-border {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.8rem 1rem;
		position: absolute;
		inset: 0;
		z-index: 5;
		background: radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.4) 110%);
	}

	/* Typography */
	.book-title {
		font-size: clamp(0.9rem, 1.8vw, 1.25rem);
		font-weight: 800;
		margin: 0;
		line-height: 1.1;
		color: rgba(255, 255, 255, 0.9);
		text-align: center;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
		text-wrap: balance;
		z-index: 2;
	}

	.book-title.gold-embossed {
		background: linear-gradient(
			135deg,
			#ffd700 0%,
			#f1c40f 25%,
			#fff 50%,
			#f1c40f 75%,
			#ffd700 100%
		);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
		animation: shine 6s linear infinite;
	}

	@keyframes shine {
		to {
			background-position: 200% center;
		}
	}

	.book-cover-image-container {
		position: absolute;
		inset: 0;
		z-index: 1;
	}

	.book-cover-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.8;
		mix-blend-mode: multiply;
		filter: contrast(1.1) brightness(0.9);
	}

	/* Page edges - Recessed from covers for hardback look */
	.book-pages-right {
		position: absolute;
		top: 2px;
		bottom: 2px;
		width: calc(var(--book-depth) * var(--book-scale));
		right: 1px; /* Tucked slightly in */
		transform-origin: right center;
		transform: rotateY(-90deg);
		background: #fff;
		background-image:
			linear-gradient(to right, rgba(0, 0, 0, 0.1), transparent 20%),
			url('/optimized/paper-texture.webp');
		background-size: cover, 160px;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
	}

	.book-pages-top {
		position: absolute;
		top: 1px; /* Tucked slightly in */
		left: 2px;
		width: calc(var(--book-width) * var(--book-scale) - 4px);
		height: calc(var(--book-depth) * var(--book-scale));
		transform-origin: center top;
		transform: rotateX(-90deg);
		background: #fafafa;
		background-image: url('/optimized/paper-texture.webp');
		background-size: 160px;
	}

	.book-pages-bottom {
		position: absolute;
		bottom: 1px; /* Tucked slightly in */
		left: 2px;
		width: calc(var(--book-width) * var(--book-scale) - 4px);
		height: calc(var(--book-depth) * var(--book-scale));
		transform-origin: center bottom;
		transform: rotateX(90deg);
		background: #fafafa;
		background-image:
			linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent 20%),
			url('/optimized/paper-texture.webp');
		background-size: cover, 160px;
	}

	/* Spine - rotated 90deg to face left */
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
	}

	/* Back cover - pushed back in Z-space */
	.book-back {
		position: absolute;
		inset: 0;
		transform: translateZ(calc(-1 * var(--book-depth) * var(--book-scale)));
		background-color: var(--book-color);
		background-image: url('/optimized/leather-texture.webp');
		background-size: cover;
		background-blend-mode: multiply;
		border-radius: 0.15rem 0.45rem 0.45rem 0.15rem;
		opacity: 1;
		box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
	}

	/* Spines Mode Specific Styles */
	.spine-front-view {
		position: absolute;
		inset: 0;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		box-shadow:
			inset 0 0 10px rgba(0, 0, 0, 0.3),
			2px 0 5px rgba(0, 0, 0, 0.2);
		background-image: linear-gradient(
			to right,
			rgba(0, 0, 0, 0.25),
			transparent 25%,
			transparent 75%,
			rgba(0, 0, 0, 0.25)
		);
	}

	.spine-title-container {
		position: absolute;
		top: 50%;
		left: 50%;
		/* Leave room for accent bands: 10% + 10px band + gap on each side */
		width: calc(var(--book-height) * 0.72);
		max-width: calc(var(--book-height) * 0.72);
		padding: 0 0.1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: translate(-50%, -50%) rotate(90deg);
	}

	.spine-title-text {
		color: rgba(255, 255, 255, 0.75);
		font-size: var(--spine-font-size, 0.8rem);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: var(--spine-letter-spacing, 1px);
		line-height: 1.05;
		text-align: center;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		max-width: 100%;
		text-wrap: balance;
	}

	.spine-accents {
		position: absolute;
		left: 0;
		right: 0;
		height: 7px;
	}

	.spine-accents.gold {
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(255, 215, 0, 0.2) 30%,
			rgba(255, 215, 0, 0.25) 50%,
			rgba(255, 215, 0, 0.2) 70%,
			transparent 100%
		);
	}

	.spine-accents.silver {
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(200, 210, 225, 0.22) 30%,
			rgba(220, 225, 235, 0.28) 50%,
			rgba(200, 210, 225, 0.22) 70%,
			transparent 100%
		);
	}

	.spine-accents.copper {
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(200, 130, 60, 0.22) 30%,
			rgba(210, 140, 70, 0.28) 50%,
			rgba(200, 130, 60, 0.22) 70%,
			transparent 100%
		);
	}

	.spine-accents.top {
		top: var(--band-offset, 10%);
	}
	.spine-accents.mid {
		top: 50%;
		transform: translateY(-50%);
		height: 4px;
		opacity: 0.6;
	}
	.spine-accents.bottom {
		bottom: var(--band-offset, 10%);
	}

	.book-cover-side-view {
		position: absolute;
		top: 0;
		bottom: 0;
		width: var(--book-depth);
		right: 0;
		transform-origin: right center;
		transform: rotateY(-90deg);
		background-color: var(--book-color);
		z-index: 5;
	}

	.book-pages-right-view {
		position: absolute;
		top: 2px;
		bottom: 2px;
		width: calc(var(--book-depth) - 4px);
		right: 4px;
		transform-origin: right center;
		transform: rotateY(-90deg);
		background: #fff;
		background-image: repeating-linear-gradient(
			to right,
			transparent,
			transparent 2px,
			rgba(0, 0, 0, 0.05) 2px,
			rgba(0, 0, 0, 0.05) 3px
		);
	}

	/* Dust particles */
	.dust-container {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 15;
		overflow: hidden;
	}

	.dust {
		position: absolute;
		width: 2px;
		height: 2px;
		background: rgba(255, 255, 255, 0.4);
		border-radius: 50%;
		filter: blur(1px);
		animation: float-dust var(--duration) infinite linear;
		opacity: 0;
		left: var(--left);
		top: var(--top);
	}

	@keyframes float-dust {
		0% {
			transform: translate(0, 0) scale(1);
			opacity: 0;
		}
		20% {
			opacity: var(--opacity);
		}
		80% {
			opacity: var(--opacity);
		}
		100% {
			transform: translate(var(--x), var(--y)) scale(1.5);
			opacity: 0;
		}
	}

	/* Animations */

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideFromRight {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes bookOpenAnimation {
		0% {
			transform: translateY(0) rotateY(0deg) scale(1);
		}
		50% {
			transform: translateY(-15px) rotateY(-30deg) scale(1.08);
		}
		100% {
			transform: translateY(-10px) rotateY(-25deg) scale(1.05);
		}
	}

	@keyframes slideFromLeft {
		from {
			transform: translateX(-100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	/* Responsive Design */
	@media (max-width: 1024px) {
		.bookshelf-room {
			--book-scale: 0.86;
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
			width: min(60rem, calc(100% - 2rem));
		}

		.featured-shelf-books {
			height: 16rem;
			width: min(60rem, calc(100% - 0.8rem));
		}

		.wooden-shelf {
			width: min(62rem, calc(100% - 1.25rem));
		}
	}

	@media (max-width: 768px) {
		.shelf-row {
			--shelf-offset: 1.1rem;
			--shelf-height: 3.15rem;
			--shelf-seam-from-top: 1.32rem;
		}

		.bookshelf-room {
			--book-scale: 0.76;
		}

		.featured-copy {
			padding: 0 0.35rem;
		}

		.bookshelf-controls {
			grid-template-columns: 1fr;
			padding: 0 0.35rem;
		}

		.control-search-row {
			grid-template-columns: 1fr;
		}

		.view-toggle {
			width: 100%;
		}

		.view-toggle-button {
			min-width: 0;
		}

		.story-table-header {
			padding: 0 0.35rem 0.9rem;
		}

		.story-table-scroll {
			padding: 0 0.35rem;
		}

		.shelf-books {
			height: 14rem;
			width: min(46rem, calc(100% - 1.4rem));
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
			width: calc(100% - 0.4rem);
			gap: 0.75rem;
		}

		.wooden-shelf {
			width: calc(100% - 0.9rem);
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
			--shelf-height: 2.85rem;
			--shelf-seam-from-top: 1.18rem;
		}

		.bookshelf-room {
			--book-scale: 0.7;
		}

		.container {
			padding: 1.75rem 0.7rem 3.5rem;
		}

		.bookshelf-header {
			margin-bottom: 1.5rem;
		}

		.featured-shelf-section {
			margin-bottom: 2rem;
		}

		.bookshelf-controls {
			margin-bottom: 1.5rem;
			padding: 0;
		}

		.story-table thead th,
		.story-table tbody td {
			padding: 0.85rem 0.8rem;
		}

		.story-cell {
			grid-template-columns: 2.35rem minmax(0, 1fr);
			gap: 0.7rem;
		}

		.story-cover-preview {
			width: 2.35rem;
			height: 3.1rem;
		}

		.story-mini-title {
			left: 0.24rem;
			right: 0.24rem;
			top: 0.28rem;
			font-size: 0.34rem;
		}

		.shelf-row {
			height: 15rem;
		}

		.featured-shelf-row {
			--book-scale: 0.62;
			height: 14rem;
		}

		.shelf-books {
			width: calc(100% - 0.8rem);
			height: 12.4rem;
			gap: 0.55rem;
		}

		.featured-shelf-books {
			width: calc(100% - 0.2rem);
			height: 11.4rem;
			gap: 0.55rem;
		}

		.wooden-shelf {
		}

		.shelf-surface {
			height: 1.28rem;
		}

		.shelf-lip {
			top: 1.18rem;
			height: 0.98rem;
		}

		.shelf-bracket {
			top: 0.98rem;
			width: 2.5rem;
			height: 1.95rem;
		}
	}
</style>
