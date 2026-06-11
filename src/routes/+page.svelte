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
		'dust-calloway-and-the-sky-coach-robbers/dust-calloway-and-the-sky-coach-robbers',
		'the-delivery-drone-that-wouldnt-leave/the-delivery-drone-that-wouldnt-leave',
		'the-dragon-who-breathed-bubbles/the-dragon-who-breathed-bubbles',
		'silly-squirrels/the-silly-squirrels-pizza-jetpack-delivery',
		'silly-squirrels/the-silly-squirrels-pancake-parade',
		'silly-squirrels/the-super-secure-snack-safe'
	];
	const FILTER_EMOJI = {
		all: '📚',
		audio: '🎧',
		silly: '🐿️',
		history: '🏛️',
		funny: '😄',
		adventure: '🗺️',
		standalone: '📖'
	};
	const HERO_SPARKS = [
		{ left: '14%', top: '12%', size: '1.05rem', delay: '0s' },
		{ left: '7%', top: '52%', size: '0.8rem', delay: '1.4s' },
		{ left: '88%', top: '18%', size: '0.95rem', delay: '0.7s' },
		{ left: '93%', top: '58%', size: '0.7rem', delay: '2.1s' },
		{ left: '22%', top: '86%', size: '0.75rem', delay: '2.8s' },
		{ left: '79%', top: '88%', size: '1rem', delay: '1.9s' }
	];
	const FIREFLIES = [
		{ left: '8%', bottom: '34%', duration: '11s', delay: '0s' },
		{ left: '24%', bottom: '20%', duration: '14s', delay: '2.5s' },
		{ left: '47%', bottom: '42%', duration: '12s', delay: '5s' },
		{ left: '68%', bottom: '16%', duration: '15s', delay: '1.2s' },
		{ left: '86%', bottom: '38%', duration: '13s', delay: '3.8s' },
		{ left: '37%', bottom: '60%', duration: '16s', delay: '6.4s' }
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
		if (
			storedDisplayMode === 'table' ||
			storedDisplayMode === 'covers' ||
			storedDisplayMode === 'spines'
		) {
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
		goto(getBookHref(book));
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

	function getBookHref(book) {
		return `/${book.seriesId}/${book.storyId}`;
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

	const mainBookShelves = $derived.by(() => packBooksIntoShelves(filteredBookList));
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
	<div class="star-layer" aria-hidden="true"></div>
	<div class="star-layer late" aria-hidden="true"></div>
	<div class="room-vignette" aria-hidden="true"></div>

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
							{#if book.hasAudio}
								<span class="cover-audio-badge" title="Read + Listen">🎧</span>
							{/if}
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
			</a>
		</div>
	{/snippet}

	{#snippet woodenShelf()}
		<div class="wooden-shelf">
			<div class="shelf-surface"></div>
			<div class="shelf-lip"></div>
			<div class="shelf-bracket shelf-bracket-left"></div>
			<div class="shelf-bracket shelf-bracket-right"></div>
			<div class="shelf-shadow"></div>
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
				}}
			>
				Show every story
			</button>
		</div>
	{/snippet}

	<div class="container">
		<header class="bookshelf-header">
			<div class="logo-container">
				<div class="logo-glow" aria-hidden="true"></div>
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
				{#each HERO_SPARKS as spark (spark.left + spark.top)}
					<span
						class="hero-spark"
						aria-hidden="true"
						style="left: {spark.left}; top: {spark.top}; font-size: {spark.size}; animation-delay: {spark.delay};"
						>✦</span
					>
				{/each}
			</div>
			<div class="hero-copy">
				<h1 class="sr-only">{SITE_NAME}</h1>
				<p class="hero-tagline">
					Online kids stories for read-aloud time, bedtime, and independent readers, from silly
					adventures to narrative history.
				</p>
			</div>
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
						{#each FIREFLIES as fly (fly.left)}
							<span
								class="firefly"
								aria-hidden="true"
								style="left: {fly.left}; bottom: {fly.bottom}; animation-duration: {fly.duration}; animation-delay: {fly.delay};"
							></span>
						{/each}

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
						<svg class="view-icon" viewBox="0 0 16 16" aria-hidden="true">
							<path
								d="M2.5 3.5h11M2.5 8h11M2.5 12.5h7"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								fill="none"
							/>
						</svg>
						List
					</button>
					<button
						type="button"
						class:active={displayMode === 'covers'}
						class="view-toggle-button"
						role="tab"
						aria-selected={displayMode === 'covers'}
						aria-controls="story-cover-view"
						onclick={() => setDisplayMode('covers')}
					>
						<svg class="view-icon" viewBox="0 0 16 16" aria-hidden="true">
							<rect
								x="3"
								y="2"
								width="10"
								height="12"
								rx="1.6"
								stroke="currentColor"
								stroke-width="2"
								fill="none"
							/>
							<path d="M5.9 2.4v11.2" stroke="currentColor" stroke-width="1.6" fill="none" />
						</svg>
						Covers
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
						<svg class="view-icon" viewBox="0 0 16 16" aria-hidden="true">
							<path
								d="M3.5 2.5v11M8 2.5v11M12.5 4.5v9"
								stroke="currentColor"
								stroke-width="2.2"
								stroke-linecap="round"
								fill="none"
							/>
						</svg>
						Spines
					</button>
				</div>
			</div>
		</section>

		{#if displayMode === 'table'}
			<section class="story-table-shell" id="story-table-view" aria-label="Story list view">
				<div class="ledger-paper">
					<div class="story-table-header">
						<div>
							<h2>Browse the catalog</h2>
							<p>
								{filteredBookList.length}
								{filteredBookList.length === 1 ? 'story' : 'stories'} ready to open.
							</p>
						</div>
						<div class="catalog-stamp" aria-hidden="true">
							<span class="stamp-count">{filteredBookList.length}</span>
							<span class="stamp-label">{filteredBookList.length === 1 ? 'story' : 'stories'}</span>
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
														{#if book.hasAudio}
															<span class="audio-note" title="Read + Listen">🎧</span>
														{/if}
													</div>
													<div class="story-subline">{getTableDescription(book)}</div>
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
											<a class="read-book-button" href={getBookHref(book)}>
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
			</section>
		{:else if displayMode === 'covers'}
			<section class="bookshelf-container" id="story-cover-view" aria-label="Story cover view">
				{#each mainBookShelves as shelfBooks, shelfIndex (shelfIndex)}
					<div class="shelf-row">
						<div class="shelf-back-glow" aria-hidden="true"></div>

						{@render woodenShelf()}

						<div class="shelf-books covers-mode">
							{#each shelfBooks as book (book.id)}
								{@render coverBook(book, '')}
							{/each}
						</div>
					</div>
				{/each}

				{#if filteredBookList.length === 0}
					{@render emptyShelf()}
				{/if}
			</section>
		{:else}
			<!-- Bookshelf with spines -->
			<div class="bookshelf-container" id="story-spine-view">
				{#each mainBookShelves as shelfBooks, shelfIndex (shelfIndex)}
					<div class="shelf-row">
						<div class="shelf-back-glow" aria-hidden="true"></div>

						{@render woodenShelf()}

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
													<span class="popup-tag">🎧 Read + Listen</span>
												{/if}
											</div>
											<div class="popup-arrow"></div>
										</div>
									{/if}

									<a
										href={getBookHref(book)}
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
												<span class="spine-emoji" aria-hidden="true">{book.emoji}</span>
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
									</a>
								</div>
							{/each}
						</div>
					</div>
				{/each}

				{#if filteredBookList.length === 0}
					{@render emptyShelf()}
				{/if}
			</div>
		{/if}

		<footer class="the-end">
			<div class="end-ornament" aria-hidden="true">
				<span class="end-rule"></span>
				<span class="end-moon">🌙</span>
				<span class="end-rule"></span>
			</div>
			<p>The end of the shelf — new stories are always on the way.</p>
		</footer>
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

		--cream: #fdf3dd;
		--cream-soft: rgba(253, 243, 221, 0.78);
		--cream-faint: rgba(253, 243, 221, 0.52);
		--honey-100: #ffe9bd;
		--honey-300: #ffd98c;
		--honey-400: #f7ad45;
		--honey-600: #b87a1c;
		--honey-ink: #5b3408;
		--paper: #faf0d7;
		--ink: #3b2a16;
		--ink-soft: #6f5a3e;
		--ink-faint: rgba(111, 90, 62, 0.6);
		--rule: rgba(141, 110, 68, 0.42);
		--margin-red: rgba(208, 100, 84, 0.55);

		font-family: var(--font-round);
		--book-scale: 1;
		min-height: 100vh;
		background:
			radial-gradient(58rem 30rem at 50% -8rem, rgba(255, 192, 105, 0.13), transparent 62%),
			radial-gradient(95rem 55rem at 50% 22rem, rgba(94, 148, 96, 0.1), transparent 65%),
			linear-gradient(180deg, #12251a 0%, #0d1c12 36%, #07120b 100%) #0a160e;
		position: relative;
		overflow-x: hidden;
		transition: filter 0.3s ease-out;
	}

	:global(.light) .bookshelf-room {
		filter: brightness(1.1) contrast(0.95);
	}

	/* ============ Night-time library backdrop ============ */

	.star-layer {
		position: fixed;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 260 260'%3E%3Cg fill='%23ffeac1'%3E%3Cpath opacity='.55' d='M30 34 Q30 41 37 41 Q30 41 30 48 Q30 41 23 41 Q30 41 30 34 Z'/%3E%3Cpath opacity='.4' d='M140 21 Q140 25 144 25 Q140 25 140 29 Q140 25 136 25 Q140 25 140 21 Z'/%3E%3Cpath opacity='.5' d='M224 62 Q224 70 232 70 Q224 70 224 78 Q224 70 216 70 Q224 70 224 62 Z'/%3E%3Cpath opacity='.35' d='M75 117.5 Q75 122 79.5 122 Q75 122 75 126.5 Q75 122 70.5 122 Q75 122 75 117.5 Z'/%3E%3Cpath opacity='.45' d='M181 146.5 Q181 152 186.5 152 Q181 152 181 157.5 Q181 152 175.5 152 Q181 152 181 146.5 Z'/%3E%3Cpath opacity='.4' d='M26 201 Q26 206 31 206 Q26 206 26 211 Q26 206 21 206 Q26 206 26 201 Z'/%3E%3Cpath opacity='.5' d='M122 231 Q122 237 128 237 Q122 237 122 243 Q122 237 116 237 Q122 237 122 231 Z'/%3E%3Cpath opacity='.35' d='M237 208 Q237 212 241 212 Q237 212 237 216 Q237 212 233 212 Q237 212 237 208 Z'/%3E%3Cpath opacity='.3' d='M95 67.5 Q95 70 97.5 70 Q95 70 95 72.5 Q95 70 92.5 70 Q95 70 95 67.5 Z'/%3E%3Cpath opacity='.3' d='M200 107 Q200 110 203 110 Q200 110 200 113 Q200 110 197 110 Q200 110 200 107 Z'/%3E%3Ccircle cx='60' cy='14' r='1.1' opacity='.35'/%3E%3Ccircle cx='110' cy='95' r='1.1' opacity='.3'/%3E%3Ccircle cx='15' cy='150' r='1.1' opacity='.3'/%3E%3Ccircle cx='160' cy='200' r='1.1' opacity='.35'/%3E%3Ccircle cx='250' cy='150' r='1.1' opacity='.25'/%3E%3Ccircle cx='45' cy='252' r='1.1' opacity='.3'/%3E%3Ccircle cx='205' cy='15' r='1.1' opacity='.3'/%3E%3C/g%3E%3C/svg%3E");
		background-size: 270px 270px;
		opacity: 0.55;
		animation: starTwinkle 9s ease-in-out infinite alternate;
	}

	.star-layer.late {
		background-position: 135px 110px;
		background-size: 385px 385px;
		opacity: 0.3;
		animation-duration: 13s;
		animation-delay: -5s;
	}

	@keyframes starTwinkle {
		from {
			opacity: 0.2;
		}
		to {
			opacity: 0.6;
		}
	}

	.room-vignette {
		position: fixed;
		inset: 0;
		background: radial-gradient(circle at center, transparent 30%, rgba(2, 7, 4, 0.34) 100%);
		pointer-events: none;
		z-index: 3;
	}

	:global(.dark) .room-vignette {
		background: radial-gradient(circle at center, transparent 22%, rgba(0, 0, 0, 0.45) 100%);
	}

	.container {
		position: relative;
		z-index: 12;
		width: 100%;
		max-width: 1380px;
		margin: 0 auto;
		padding: 4.25rem 1.5rem 4rem;
	}

	/* ============ Hero ============ */

	.bookshelf-header {
		text-align: center;
		margin-bottom: 3.5rem;
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.9rem;
	}

	.logo-container {
		position: relative;
		width: min(700px, 95vw);
		margin: 0 auto;
		overflow: visible;
	}

	.logo-glow {
		position: absolute;
		inset: 6% 10%;
		border-radius: 50%;
		background: radial-gradient(
			ellipse at center,
			rgba(255, 196, 110, 0.3),
			rgba(255, 170, 70, 0.12) 48%,
			transparent 72%
		);
		filter: blur(30px);
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
		filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
	}

	.hero-spark {
		position: absolute;
		z-index: 2;
		color: #ffe2a0;
		text-shadow: 0 0 12px rgba(255, 205, 110, 0.9);
		animation: sparkTwinkle 3.8s ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes sparkTwinkle {
		0%,
		100% {
			opacity: 0.08;
			transform: scale(0.7) rotate(-8deg);
		}
		50% {
			opacity: 0.9;
			transform: scale(1.15) rotate(10deg);
		}
	}

	.hero-copy {
		max-width: 44rem;
		text-align: center;
	}

	.hero-tagline {
		margin: 0 auto;
		max-width: 40rem;
		font-family: var(--font-book);
		font-style: italic;
		font-size: clamp(1.08rem, 1.6vw, 1.32rem);
		line-height: 1.75;
		color: var(--cream-soft);
		text-wrap: pretty;
	}

	.hero-tagline::before,
	.hero-tagline::after {
		content: '✦';
		font-style: normal;
		font-size: 0.72em;
		color: rgba(247, 173, 69, 0.85);
		vertical-align: 0.18em;
	}

	.hero-tagline::before {
		margin-right: 0.75rem;
	}

	.hero-tagline::after {
		margin-left: 0.75rem;
	}

	/* ============ Featured shelf ============ */

	.featured-shelf-section {
		margin: 0 auto 3rem;
		max-width: 1240px;
	}

	.featured-copy {
		margin-bottom: 1.1rem;
		padding: 0 0.75rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
	}

	.featured-copy h2 {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 400;
		font-size: clamp(1.6rem, 2.7vw, 2.2rem);
		line-height: 1.08;
		letter-spacing: 0.01em;
		color: var(--cream);
		text-shadow:
			0 2px 0 rgba(56, 28, 5, 0.45),
			0 8px 20px rgba(0, 0, 0, 0.35);
		text-wrap: balance;
	}

	.head-doodle {
		width: 8.75rem;
		height: 0.8rem;
		color: #f0a83c;
		opacity: 0.9;
		margin-left: 0.15rem;
	}

	.firefly {
		position: absolute;
		z-index: 4;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #ffd98a;
		box-shadow: 0 0 9px 3px rgba(255, 205, 110, 0.45);
		opacity: 0;
		animation: fireflyDrift 12s ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes fireflyDrift {
		0% {
			transform: translate(0, 0);
			opacity: 0;
		}
		12% {
			opacity: 0.75;
		}
		38% {
			opacity: 0.25;
		}
		55% {
			transform: translate(42px, -48px);
			opacity: 0.7;
		}
		78% {
			opacity: 0.2;
		}
		100% {
			transform: translate(-16px, -88px);
			opacity: 0;
		}
	}

	/* ============ Controls: chips, search, view toggle ============ */

	.bookshelf-controls {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		width: 100%;
		max-width: 1240px;
		margin: 0 auto 2.4rem;
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
		border: 1.5px solid rgba(253, 243, 221, 0.2);
		background: rgba(253, 243, 221, 0.07);
		color: var(--cream-soft);
		font-family: var(--font-round);
		font-size: 0.92rem;
		font-weight: 700;
		cursor: pointer;
		backdrop-filter: blur(8px);
		transition:
			transform 0.18s ease,
			background 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease,
			box-shadow 0.18s ease;
	}

	.filter-chip:hover {
		color: var(--cream);
		border-color: rgba(253, 243, 221, 0.45);
		transform: translateY(-1px);
	}

	.filter-chip.active {
		background: linear-gradient(180deg, var(--honey-300), var(--honey-400));
		border-color: rgba(184, 122, 28, 0.9);
		color: var(--honey-ink);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.5),
			0 3px 0 #9c6418,
			0 0.5rem 1rem rgba(0, 0, 0, 0.28);
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
		background: rgba(253, 243, 221, 0.14);
	}

	.filter-chip.active .chip-count {
		background: rgba(91, 52, 8, 0.16);
	}

	.control-search-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
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
		color: var(--cream-faint);
		pointer-events: none;
	}

	.control-input {
		width: 100%;
		height: 3.05rem;
		padding: 0.8rem 1.1rem 0.8rem 2.8rem;
		border-radius: 999px;
		border: 1.5px solid rgba(253, 243, 221, 0.18);
		background: rgba(253, 243, 221, 0.07);
		color: var(--cream);
		font-family: var(--font-round);
		font-size: 1rem;
		font-weight: 600;
		backdrop-filter: blur(10px);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			box-shadow 0.2s ease;
	}

	.control-input::placeholder {
		color: var(--cream-faint);
		font-weight: 500;
	}

	.control-input:focus {
		outline: none;
		border-color: rgba(247, 173, 69, 0.75);
		background: rgba(253, 243, 221, 0.11);
		box-shadow: 0 0 0 4px rgba(247, 173, 69, 0.18);
	}

	.view-toggle {
		display: inline-grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.18rem;
		padding: 0.26rem;
		border: 1.5px solid rgba(253, 243, 221, 0.16);
		border-radius: 999px;
		background: rgba(6, 14, 9, 0.5);
		backdrop-filter: blur(14px);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}

	.view-toggle-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.42rem;
		min-width: 6.1rem;
		height: 2.5rem;
		padding: 0 0.95rem;
		border: none;
		border-radius: 999px;
		background: transparent;
		color: var(--cream-soft);
		font-family: var(--font-round);
		font-size: 0.92rem;
		font-weight: 700;
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.view-icon {
		width: 0.95rem;
		height: 0.95rem;
	}

	.view-toggle-button:hover {
		color: var(--cream);
	}

	.view-toggle-button.active {
		background: linear-gradient(180deg, var(--honey-300), var(--honey-400));
		color: var(--honey-ink);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.5),
			0 2px 0 #9c6418,
			0 0.4rem 0.9rem rgba(0, 0, 0, 0.3);
	}

	/* ============ Catalog ledger (table view) ============ */

	.story-table-shell {
		width: 100%;
		max-width: 1240px;
		margin: 0 auto;
		padding: 0.5rem 0.75rem 0;
	}

	.ledger-paper {
		position: relative;
		border-radius: 1.1rem 1.4rem 1.2rem 1rem / 1.4rem 1.1rem 1rem 1.3rem;
		border: 1px solid rgba(105, 78, 38, 0.55);
		background:
			radial-gradient(120% 55% at 50% 0%, rgba(255, 255, 255, 0.5), transparent 60%),
			linear-gradient(180deg, #fbf2dc, #f4e7c6);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.65),
			0 0.5rem 1.2rem rgba(3, 9, 5, 0.35),
			0 2.4rem 4rem rgba(3, 9, 5, 0.5);
		padding: 1.9rem 0 1.1rem;
		overflow: hidden;
	}

	.ledger-paper::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: url('/optimized/paper-texture.webp');
		background-size: 300px;
		opacity: 0.35;
		mix-blend-mode: multiply;
		pointer-events: none;
	}

	.ledger-paper::after {
		content: '';
		position: absolute;
		top: 1.1rem;
		bottom: 1.1rem;
		left: 4.4rem;
		width: 2px;
		background: var(--margin-red);
		opacity: 0.55;
		pointer-events: none;
	}

	.story-table-header {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0 2rem 1.1rem 5.6rem;
	}

	.story-table-header h2 {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 400;
		font-size: clamp(1.45rem, 2.2vw, 1.95rem);
		letter-spacing: 0.01em;
		color: var(--ink);
	}

	.story-table-header p {
		margin: 0.35rem 0 0;
		font-family: var(--font-book);
		font-style: italic;
		color: var(--ink-soft);
		font-size: 0.98rem;
		line-height: 1.5;
	}

	.catalog-stamp {
		--stamp-ink: #c25f4e;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.1rem;
		width: 5.4rem;
		height: 5.4rem;
		border-radius: 50%;
		border: 3px double var(--stamp-ink);
		color: var(--stamp-ink);
		transform: rotate(-12deg);
		font-family: var(--font-round);
		text-transform: uppercase;
		opacity: 0.68;
		flex-shrink: 0;
	}

	.stamp-count {
		font-size: 1.5rem;
		font-weight: 800;
		line-height: 1;
	}

	.stamp-label {
		font-size: 0.58rem;
		font-weight: 800;
		letter-spacing: 0.2em;
		line-height: 1;
	}

	.story-table-scroll {
		position: relative;
		z-index: 1;
		overflow-x: auto;
		padding: 0 1.4rem;
	}

	.story-table {
		width: 100%;
		min-width: 660px;
		border-collapse: separate;
		border-spacing: 0;
		background: transparent;
	}

	.story-table thead th {
		padding: 0.7rem 1rem 0.6rem;
		text-align: left;
		font-family: var(--font-round);
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		white-space: nowrap;
		color: var(--ink-faint);
		border-bottom: 3px double rgba(141, 110, 68, 0.55);
	}

	.story-table tbody tr {
		transition: background 0.18s ease;
	}

	.story-table tbody tr:hover {
		background: rgba(141, 110, 68, 0.09);
	}

	.story-table tbody td {
		padding: 1.05rem 1rem;
		vertical-align: middle;
		border-bottom: 1px dashed var(--rule);
	}

	.story-table tbody tr:last-child td {
		border-bottom: none;
	}

	.story-cell {
		display: grid;
		grid-template-columns: 2.75rem minmax(0, 1fr);
		gap: 1rem;
		align-items: center;
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
		transform: rotateY(-16deg) rotateX(5deg);
		filter: drop-shadow(0 0.5rem 0.65rem rgba(59, 42, 22, 0.35));
		transition: transform 0.3s ease;
	}

	.story-table tbody tr:hover .story-mini-book {
		transform: rotateY(-26deg) rotateX(6deg) translateY(-2px);
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
		min-width: 0;
	}

	.story-title-line {
		color: var(--ink);
		font-family: var(--font-round);
		font-size: 1.04rem;
		font-weight: 700;
		line-height: 1.25;
	}

	.audio-note {
		display: inline-block;
		margin-left: 0.3rem;
		font-size: 0.82rem;
		vertical-align: 0.05em;
	}

	.story-subline {
		margin-top: 0.28rem;
		max-width: 48ch;
		color: var(--ink-soft);
		font-family: var(--font-book);
		font-size: 0.92rem;
		line-height: 1.55;
	}

	.table-book-details {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.55rem;
		max-width: 34rem;
	}

	.series-chip {
		display: inline-flex;
		align-items: center;
		padding: 0.4rem 0.75rem;
		border-radius: 0.65rem;
		background: var(--chip-color, #4a5d4e);
		border: 1px solid rgba(255, 255, 255, 0.22);
		color: var(--cream);
		font-size: 0.82rem;
		font-weight: 700;
		transform: rotate(-1.6deg);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.18),
			0 2px 3px rgba(59, 42, 22, 0.28);
	}

	.story-table tbody tr:nth-child(even) .series-chip {
		transform: rotate(1.2deg);
	}

	.genre-copy {
		color: #8a6a3a;
		font-size: 0.88rem;
		font-weight: 700;
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.tag-pill {
		display: inline-flex;
		align-items: center;
		border-radius: 999px;
		padding: 0.28rem 0.62rem;
		background: rgba(255, 255, 255, 0.32);
		border: 1.5px dashed rgba(141, 110, 68, 0.5);
		color: #7a5b32;
		font-size: 0.78rem;
		font-weight: 600;
		text-transform: lowercase;
	}

	.table-action-heading,
	.table-action-cell {
		text-align: right;
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

	.button-arrow {
		width: 0.85rem;
		height: 0.85rem;
		transition: transform 0.2s ease;
	}

	.read-book-button:hover .button-arrow {
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
		border-radius: 1.2rem 1.4rem 1.1rem 1.3rem / 1.3rem 1.1rem 1.4rem 1.2rem;
		text-align: center;
		background: linear-gradient(180deg, #fbf2dc, #f4e7c6);
		border: 1px solid rgba(105, 78, 38, 0.5);
		box-shadow: 0 1.4rem 2.6rem rgba(0, 0, 0, 0.35);
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
		background: radial-gradient(ellipse at center, rgba(255, 214, 150, 0.1), transparent 70%);
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

	/* ============ Spine-hover popup ============ */

	.book-info-popup {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%) translateY(-20px);
		width: 250px;
		max-width: min(250px, calc(100vw - 24px));
		background: linear-gradient(180deg, #fdf5e0, #f7ebcd);
		border: 1px solid rgba(105, 78, 38, 0.45);
		border-radius: 0.9rem 1.1rem 0.95rem 1.05rem / 1.05rem 0.95rem 1.1rem 0.9rem;
		padding: 15px 16px;
		box-shadow:
			0 14px 32px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		z-index: 2000;
		pointer-events: none;
		animation: popupFadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.book-info-popup.below {
		bottom: auto;
		top: 100%;
		transform: translateX(-50%) translateY(16px);
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
		margin: 0 0 7px 0;
		font-family: var(--font-round);
		font-size: 1.02rem;
		font-weight: 800;
		line-height: 1.22;
		color: var(--ink);
	}

	.popup-description {
		margin: 0;
		font-family: var(--font-book);
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--ink-soft);
	}

	.popup-tag {
		display: inline-block;
		margin-top: 9px;
		font-size: 0.78rem;
		font-weight: 800;
		color: #a8632c;
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
		border-top: 10px solid #f7ebcd;
	}

	.book-info-popup.below .popup-arrow {
		top: auto;
		bottom: 100%;
		border-top: none;
		border-bottom: 10px solid #fdf5e0;
	}

	/* ============ 3D books ============ */

	.covers-mode {
		gap: clamp(0.75rem, 2vw, 1.75rem);
	}

	.spines-mode {
		gap: 2px;
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

	.book-card:hover {
		z-index: 20;
	}

	.book-contact-shadow {
		position: absolute;
		left: 3%;
		right: 3%;
		bottom: -9px;
		height: 18px;
		border-radius: 50%;
		background: radial-gradient(ellipse at center, rgba(2, 7, 4, 0.55), transparent 68%);
		filter: blur(5px);
		transition:
			transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.5s ease;
	}

	.book-card:hover .book-contact-shadow {
		transform: translateY(8px) scale(1.06, 1.5);
		opacity: 0.8;
	}

	.book-3d-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
		transform: rotateY(-12deg) rotateX(4deg);
	}

	.book-card:hover .book-3d-wrapper {
		transform: translateY(-20px) scale(1.1) rotateY(-26deg) rotateX(8deg);
	}

	.book-cover-front {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: var(--book-border-radius);
		overflow: visible;
		transform-style: preserve-3d;
		z-index: 2;
		background-color: var(--book-color);
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
		filter: saturate(1.05) contrast(1.03);
	}

	.cover-scrim {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(26, 15, 5, 0.66) 0%, rgba(26, 15, 5, 0.3) 26%, transparent 46%),
			linear-gradient(0deg, rgba(26, 15, 5, 0.3), transparent 26%);
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

	.cover-audio-badge {
		position: absolute;
		right: 7px;
		bottom: 7px;
		z-index: 7;
		width: 1.95rem;
		height: 1.95rem;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: 0.95rem;
		background: linear-gradient(180deg, var(--honey-300), var(--honey-400));
		border: 1px solid rgba(255, 243, 214, 0.7);
		box-shadow:
			0 2px 0 rgba(122, 73, 9, 0.85),
			0 4px 10px rgba(0, 0, 0, 0.35);
	}

	/* --- page block --- */

	.book-pages-right {
		position: absolute;
		top: 2px;
		bottom: 2px;
		width: calc(var(--book-depth) * var(--book-scale));
		right: 1px;
		transform-origin: right center;
		transform: rotateY(-90deg);
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
		top: 1px;
		left: 2px;
		width: calc(var(--book-width) * var(--book-scale) - 4px);
		height: calc(var(--book-depth) * var(--book-scale));
		transform-origin: center top;
		transform: rotateX(-90deg);
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
		bottom: 1px;
		left: 2px;
		width: calc(var(--book-width) * var(--book-scale) - 4px);
		height: calc(var(--book-depth) * var(--book-scale));
		transform-origin: center bottom;
		transform: rotateX(90deg);
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
	}

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

	/* ============ Spines mode ============ */

	.book-card.spines .book-3d-wrapper {
		transform: rotateY(0deg) rotateX(0deg);
	}

	.book-card.spines {
		transform: translateY(0) rotateZ(var(--book-lean));
	}

	.book-card.spines .book-pages-top,
	.book-card.spines .book-pages-bottom,
	.book-card.spines .book-pages-right-view {
		background: var(--book-color);
		background-image: none;
	}

	.book-card.spines:hover .book-3d-wrapper {
		transform: translateZ(0) translateY(-6px) rotateY(0deg);
	}

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
		width: calc(var(--book-height) * 0.72);
		max-width: calc(var(--book-height) * 0.72);
		padding: 0 0.1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: translate(-50%, -50%) rotate(90deg);
	}

	.spine-title-text {
		color: rgba(255, 248, 237, 0.8);
		font-family: var(--font-round);
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

	.spine-emoji {
		position: absolute;
		bottom: 7px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.74rem;
		line-height: 1;
		filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.5));
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

	/* ============ Sign-off ============ */

	.the-end {
		margin: 3.75rem auto 0;
		text-align: center;
		color: var(--cream-faint);
	}

	.end-ornament {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.85rem;
		margin-bottom: 0.85rem;
	}

	.end-rule {
		width: 5.5rem;
		height: 2px;
		border-radius: 999px;
		background: linear-gradient(90deg, transparent, rgba(253, 243, 221, 0.35));
	}

	.end-rule:last-child {
		transform: scaleX(-1);
	}

	.end-moon {
		font-size: 1.15rem;
		filter: drop-shadow(0 0 8px rgba(255, 220, 140, 0.4));
		animation: moonBob 5.5s ease-in-out infinite;
	}

	@keyframes moonBob {
		0%,
		100% {
			transform: translateY(0) rotate(-6deg);
		}
		50% {
			transform: translateY(-4px) rotate(7deg);
		}
	}

	.the-end p {
		margin: 0;
		font-family: var(--font-book);
		font-style: italic;
		font-size: 0.95rem;
	}

	/* ============ Responsive ============ */

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

		.story-table-shell {
			padding: 0.5rem 0.35rem 0;
		}

		.ledger-paper::after {
			display: none;
		}

		.story-table-header {
			padding: 0 1.4rem 1rem;
		}

		.catalog-stamp {
			width: 4.6rem;
			height: 4.6rem;
		}

		.story-table-scroll {
			padding: 0 0.9rem;
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
			padding: 1.75rem 0.7rem 3.25rem;
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

		.catalog-stamp {
			display: none;
		}

		.story-table thead th,
		.story-table tbody td {
			padding: 0.85rem 0.7rem;
		}

		.story-cell {
			grid-template-columns: 2.35rem minmax(0, 1fr);
			gap: 0.7rem;
		}

		.story-cover-preview {
			width: 2.35rem;
			height: 3.1rem;
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

		.the-end {
			margin-top: 2.5rem;
		}
	}
</style>
