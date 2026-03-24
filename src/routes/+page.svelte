<script>
	import { bookList } from '$content/books/books.js';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let animatingBook = $state(null);
	let isTransitioning = $state(false);
	let isReturning = $state(false);

	// Check if we're returning from a story page
	if (browser) {
		// Check for navigation state from back button
		const fromStory = window.history.state?.from === 'story';
		const referrer = document.referrer;
		const isStoryReferrer =
			referrer &&
			referrer.includes(window.location.origin) &&
			!referrer.endsWith('/') &&
			!referrer.includes('/#');

		if (fromStory || isStoryReferrer) {
			isReturning = true;
		}
	}

	// Calculate books per shelf based on screen size
	let booksPerShelf = $state(5);

	// Update books per shelf based on window size
	function updateBooksPerShelf() {
		if (typeof window === 'undefined') return;

		const width = window.innerWidth;
		if (width < 480) {
			booksPerShelf = 1; // Extra small phones
		} else if (width < 640) {
			booksPerShelf = 2; // Small phones
		} else if (width < 768) {
			booksPerShelf = 2; // Large phones
		} else if (width < 1024) {
			booksPerShelf = 3; // Tablets
		} else if (width < 1200) {
			booksPerShelf = 4; // Small laptops
		} else {
			booksPerShelf = 5; // Large laptops and up
		}
	}

	onMount(() => {
		updateBooksPerShelf();
		window.addEventListener('resize', updateBooksPerShelf);

		return () => {
			window.removeEventListener('resize', updateBooksPerShelf);
		};
	});

	function selectBook(book) {
		animatingBook = book.id;
		// Start page transition immediately with book animation
		setTimeout(() => {
			isTransitioning = true;
		}, 100);
		// Navigate after book animation completes
		setTimeout(() => {
			goto(`/${book.seriesId}/${book.storyId}`, { state: { from: 'bookshelf' } });
		}, 400);
	}

	function handleKeyDown(event, book) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectBook(book);
		}
	}

	function getDisplayHeight(book) {
		return Math.round(246 + (book.height - 250) * 0.3);
	}

	function getDisplayWidth(book) {
		return Math.round(getDisplayHeight(book) * 0.66);
	}

	function getDisplayDepth(book) {
		return Math.max(18, Math.round(book.thickness * 0.34));
	}

	function getDisplayTilt(book) {
		return Math.max(-1, Math.min(1, book.tilt * 0.3));
	}
</script>

<svelte:head>
	<title>Bookshelf - Kids Story Collection</title>
</svelte:head>

<div
	class="bookshelf-room {isTransitioning ? 'transitioning-out' : ''} {isReturning
		? 'returning'
		: ''}"
>
	<!-- Wood background with depth -->
	<div class="wood-background"></div>

	<!-- Warm lighting overlay -->
	<div class="lighting-overlay"></div>

	<!-- Dust Particles for Atmosphere -->
	<div class="dust-container">
		{#each Array(20) as _, i}
			<div
				class="dust"
				style="
				--duration: {15 + i % 10}s;
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
			<div class="header-plaque">
				<p class="eyebrow">Choose A Story</p>
				<h1>Roughdraft Storytime</h1>
				<p class="tagline">Pick a book off the shelf and step straight into it.</p>
			</div>
		</header>

		<!-- Bookshelf with Shelves -->
		<div class="bookshelf-container">
			<!-- Create shelves dynamically based on number of books -->
			{#each Array(Math.ceil(bookList.length / booksPerShelf)) as _, shelfIndex}
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
					<div class="shelf-books">
						{#each bookList.slice(shelfIndex * booksPerShelf, (shelfIndex + 1) * booksPerShelf) as book (book.id)}
							<button
								class="book-card {animatingBook === book.id ? 'selected' : ''}"
								style="--book-color: {book.leatherColor}; --book-width: {getDisplayWidth(
									book
								)}px; --book-height: {getDisplayHeight(book)}px; --book-depth: {getDisplayDepth(
									book
								)}px; --book-lean: {getDisplayTilt(book)}deg;"
								onclick={() => selectBook(book)}
								onkeydown={(e) => handleKeyDown(e, book)}
								aria-label="Select {book.title}"
							>
								<div class="book-3d-wrapper">
									<!-- Front cover -->
									<div class="book-cover-front">
										<div class="cover-texture">
											<div class="cover-content {book.coverImage ? 'no-padding' : ''}">
												<div class="cover-border">
													<h3 class="book-title {book.id.length % 7 === 0 ? 'gold-embossed' : ''}">{book.title}</h3>
													{#if book.coverImage}
														<div class="book-cover-image-container">
															<img
																src={book.coverImage}
																alt={book.title}
																class="book-cover-image"
															/>
														</div>
													{/if}
												</div>
											</div>
										</div>
									</div>
									<!-- Page edges (top, right, bottom) -->
									<div class="book-pages-top" aria-hidden="true"></div>
									<div class="book-pages-right" aria-hidden="true"></div>
									<div class="book-pages-bottom" aria-hidden="true"></div>
									<!-- Spine -->
									<div class="book-spine" aria-hidden="true"></div>
									<!-- Back cover -->
									<div class="book-back" aria-hidden="true"></div>
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
		background: #a77149;
	}

	.bookshelf-room {
		--book-scale: 1;
		min-height: 100vh;
		background:
			radial-gradient(circle at top, rgba(255, 245, 221, 0.34), transparent 34%),
			linear-gradient(180deg, rgba(120, 79, 42, 0.1), rgba(71, 41, 18, 0.2)), #d5b48a;
		position: relative;
		overflow-x: hidden;
	}

	.wood-background {
		position: absolute;
		inset: 0;
		background-image: url('/moroccan-flower-dark.webp');
		background-size: 400px 400px;
		background-repeat: repeat;
		opacity: 1;
		z-index: 0;
	}

	.wood-background::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.4) 100%);
		z-index: 1;
		pointer-events: none;
	}

	.lighting-overlay {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 50% 0%, rgba(255, 252, 243, 0.1), transparent 40%),
			linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.2) 100%);
		pointer-events: none;
		z-index: 10;
	}

	.bookshelf-room::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.03) 40%, rgba(255, 255, 255, 0.03) 42%, transparent 47%),
			linear-gradient(125deg, transparent 55%, rgba(255, 255, 255, 0.02) 60%, rgba(255, 255, 255, 0.02) 63%, transparent 68%);
		pointer-events: none;
		z-index: 11;
	}

	.container {
		position: relative;
		z-index: 12;
		width: 100%;
		max-width: 1380px;
		margin: 0 auto;
		padding: 2.75rem 1.5rem 5rem;
	}

	.bookshelf-header {
		text-align: center;
		margin-bottom: 3.5rem;
		position: relative;
	}

	.header-plaque {
		display: inline-flex;
		flex-direction: column;
		gap: 0.65rem;
		padding: 1.25rem 2.5rem 1.5rem;
		border-radius: 1rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(245, 240, 225, 0.9)),
			url('/texture/paper.png');
		background-size: cover;
		box-shadow:
			0 1.5rem 3rem rgba(0, 0, 0, 0.3),
			0 0.5rem 1rem rgba(0, 0, 0, 0.1),
			inset 0 0 0 1px rgba(255, 255, 255, 0.8),
			inset 0 0 40px rgba(139, 69, 19, 0.05);
		border: 1px solid rgba(139, 69, 19, 0.2);
		max-width: min(42rem, calc(100vw - 3rem));
		position: relative;
	}

	.header-plaque::before {
		content: '';
		position: absolute;
		inset: 4px;
		border: 1px solid rgba(139, 69, 19, 0.1);
		border-radius: 0.8rem;
		pointer-events: none;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.72rem;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: #8b4513;
		font-weight: 800;
		opacity: 0.8;
	}

	.bookshelf-header h1 {
		font-size: clamp(2.5rem, 5vw, 4.25rem);
		color: #2c1810;
		font-family: Georgia, serif;
		margin: 0;
		font-weight: 900;
		line-height: 0.9;
		letter-spacing: -0.02em;
		text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
	}

	.tagline {
		margin: 0.5rem 0 0;
		font-size: clamp(1rem, 1.6vw, 1.25rem);
		color: #5d4037;
		font-style: italic;
		font-family: Georgia, serif;
	}

	.bookshelf-container {
		width: 100%;
		max-width: 1240px;
		margin: 0 auto;
		padding: 0.75rem 0 0;
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
			linear-gradient(90deg, rgba(0, 0, 0, 0.15), transparent 15%, transparent 85%, rgba(0, 0, 0, 0.15)),
			linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 40%, rgba(0, 0, 0, 0.2) 100%),
			#63432a;
		background-image:
			linear-gradient(90deg, rgba(0, 0, 0, 0.15), transparent 15%, transparent 85%, rgba(0, 0, 0, 0.15)),
			linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 40%, rgba(0, 0, 0, 0.2) 100%),
			url('/grain-options/2.jpg');
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
			url('/grain-options/2.jpg');
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
		background-image: url('/grain-options/4.png');
		background-size: cover;
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
		gap: clamp(0.75rem, 2vw, 1.75rem);
		padding: 0 1rem;
		z-index: 5;
		overflow: visible;
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

	.book-card.selected {
		z-index: 30;
	}

	.book-3d-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
		/* Initial slight rotation to show depth */
		transform: rotateY(-8deg);
	}

	.book-card:hover .book-3d-wrapper {
		transform: rotateY(-25deg) rotateX(2deg);
	}

	.book-card.selected .book-3d-wrapper {
		transform: translateY(-1rem) rotateY(-25deg) scale(1.05);
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
		z-index: 2;
		background-color: var(--book-color);
		box-shadow: 
			inset 0 0 0 1px rgba(255, 255, 255, 0.1),
			2px 0 5px rgba(0, 0, 0, 0.2);
	}

	.cover-texture {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		background-image: linear-gradient(to right, rgba(0, 0, 0, 0.1), transparent 10%, transparent 90%, rgba(0, 0, 0, 0.05));
	}

	.cover-texture::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: url('/texture/paper.png');
		background-size: 200px;
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
		font-family: Georgia, serif;
		line-height: 1.1;
		color: rgba(255, 255, 255, 0.9);
		text-align: center;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
		text-wrap: balance;
		z-index: 2;
	}

	.book-title.gold-embossed {
		background: linear-gradient(135deg, #ffd700 0%, #f1c40f 25%, #fff 50%, #f1c40f 75%, #ffd700 100%);
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
		right: 0;
		transform-origin: right center;
		transform: rotateY(-90deg);
		background: #fff;
		background-image: 
			linear-gradient(to right, rgba(0,0,0,0.1), transparent 20%),
			url('/texture/paper.png');
		background-size: cover, 100px;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
	}

	.book-pages-top {
		position: absolute;
		top: 0;
		left: 2px;
		width: calc(var(--book-width) * var(--book-scale) - 4px);
		height: calc(var(--book-depth) * var(--book-scale));
		transform-origin: center top;
		transform: rotateX(-90deg);
		background: #fafafa;
		background-image: url('/texture/paper.png');
		background-size: 100px;
	}

	.book-pages-bottom {
		position: absolute;
		bottom: 0;
		left: 2px;
		width: calc(var(--book-width) * var(--book-scale) - 4px);
		height: calc(var(--book-depth) * var(--book-scale));
		transform-origin: center bottom;
		transform: rotateX(90deg);
		background: #fafafa;
		background-image: url('/texture/paper.png');
		background-size: 100px;
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
			linear-gradient(to right, rgba(0, 0, 0, 0.2), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.2)),
			url('/texture/leather.webp');
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
		background-image: url('/texture/leather.webp');
		background-size: cover;
		background-blend-mode: multiply;
		border-radius: 0.15rem 0.45rem 0.45rem 0.15rem;
		opacity: 1;
		box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
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

	/* Page Transition Effects */
	.bookshelf-room {
		transition:
			transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.3s ease;
	}

	.bookshelf-room.transitioning-out {
		transform: translateX(-100%);
		opacity: 0.8;
	}

	/* Return from Story - Slide from Left */
	.bookshelf-room.returning {
		transform: translateX(-100%);
		opacity: 0;
		animation: slideFromLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	/* Ensure normal page loads don't have transition */
	.bookshelf-room:not(.returning):not(.transitioning-out) {
		transform: translateX(0);
		opacity: 1;
		transition: none;
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

		.shelf-books {
			height: 16rem;
			width: min(60rem, calc(100% - 2rem));
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

		.header-plaque {
			padding: 1rem 1.1rem 1.2rem;
			border-radius: 1.15rem;
		}

		.shelf-books {
			height: 14rem;
			width: min(46rem, calc(100% - 1.4rem));
		}

		.shelf-row {
			height: 17rem;
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

		.header-plaque {
			max-width: calc(100vw - 1.4rem);
			gap: 0.5rem;
		}

		.shelf-row {
			height: 15rem;
		}

		.shelf-books {
			width: calc(100% - 0.8rem);
			height: 12.4rem;
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
