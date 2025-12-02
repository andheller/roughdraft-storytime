<script>
	import { bookList } from '$content/books/books.js';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

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
			booksPerShelf = 1;  // Extra small phones
		} else if (width < 640) {
			booksPerShelf = 2;  // Small phones
		} else if (width < 768) {
			booksPerShelf = 2;  // Large phones
		} else if (width < 1024) {
			booksPerShelf = 3;  // Tablets
		} else if (width < 1200) {
			booksPerShelf = 4;  // Small laptops
		} else {
			booksPerShelf = 5;  // Large laptops and up
		}
	}

	// Initialize and listen for resize
	if (typeof window !== 'undefined') {
		updateBooksPerShelf();
		window.addEventListener('resize', updateBooksPerShelf);
	}

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

	<div class="container">
		<header class="bookshelf-header">
			<h1>Roughdraft Storytime</h1>
			<p>Where stories come to life, one draft at a time</p>
		</header>

		<!-- Bookshelf with Shelves -->
		<div class="bookshelf-container">
			<!-- Create shelves dynamically based on number of books -->
			{#each Array(Math.ceil(bookList.length / booksPerShelf)) as _, shelfIndex}
				<div class="shelf-row">
					<!-- Wooden shelf -->
					<div class="wooden-shelf">
						<div class="shelf-surface"></div>
						<div class="shelf-edge"></div>
						<div class="shelf-shadow"></div>
					</div>

					<!-- Books on this shelf -->
					<div class="shelf-books">
						{#each bookList.slice(shelfIndex * booksPerShelf, (shelfIndex + 1) * booksPerShelf) as book, bookIndex (book.id)}
							<button
								class="book-card {animatingBook === book.id ? 'selected' : ''}"
								style="--book-color: {book.leatherColor};"
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
													<h3 class="book-title">{book.title}</h3>
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
									<!-- Page edges (side) - rotated 90deg -->
									<div class="book-pages" aria-hidden="true"></div>
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
	}

	.bookshelf-room {
		min-height: 100vh;
		background: #8b4513;
		position: relative;
		overflow-x: hidden;
	}

	.wood-background {
		position: absolute;
		inset: 0;
		background-image: url('/grain-options/2.jpg');
		background-size: 256px 256px;
		background-repeat: repeat;
		background-position: 0 0;
		opacity: 0.9;
		z-index: 0;
	}

	.wood-background::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				45deg,
				rgba(139, 69, 19, 0.1) 0%,
				transparent 50%,
				rgba(101, 67, 33, 0.1) 100%
			),
			linear-gradient(
				135deg,
				rgba(160, 82, 45, 0.05) 0%,
				transparent 50%,
				rgba(139, 69, 19, 0.05) 100%
			);
		box-shadow:
			inset 0 0 200px rgba(101, 67, 33, 0.3),
			inset 0 0 100px rgba(139, 69, 19, 0.2);
	}

	.lighting-overlay {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse at 50% 20%, rgba(255, 220, 150, 0.15), transparent 70%),
			linear-gradient(to bottom, rgba(0, 0, 0, 0.05), transparent 30%, rgba(0, 0, 0, 0.1));
		pointer-events: none;
		z-index: 1;
	}

	.container {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 3rem 2rem;
	}

	.bookshelf-header {
		text-align: center;
		margin-bottom: 4rem;
		position: relative;
	}

	.bookshelf-header h1 {
		font-size: clamp(2.5rem, 5vw, 4rem);
		color: #1a0f0a;
		text-shadow:
			0 1px 0 rgba(255, 255, 255, 0.1),
			0 -1px 0 rgba(0, 0, 0, 0.8),
			inset 0 1px 2px rgba(0, 0, 0, 0.5);
		font-family: Georgia, serif;
		margin-bottom: 1rem;
		font-weight: bold;
	}

	.bookshelf-header p {
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		color: #2c1810;
		font-style: italic;
		text-shadow:
			0 1px 0 rgba(255, 255, 255, 0.08),
			0 -1px 0 rgba(0, 0, 0, 0.6);
		font-weight: 500;
	}

	.bookshelf-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 0;
	}

	.shelf-row {
		position: relative;
		margin-bottom: 3rem;
		height: 280px;
		overflow: visible;
	}

	.wooden-shelf {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 60px;
		z-index: 1;
	}

	.shelf-surface {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 40px;
		background: linear-gradient(to bottom, #ffffff 0%, #f5f5f5 100%);
		border-radius: 4px 4px 0 0;
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
	}

	.shelf-surface::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.1),
			transparent 50%,
			rgba(0, 0, 0, 0.1)
		);
		border-radius: 4px 4px 0 0;
	}

	.shelf-edge {
		position: absolute;
		top: 40px;
		left: 0;
		right: 0;
		height: 20px;
		background: linear-gradient(to bottom, #f5f5f5 0%, #e8e8e8 100%);
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}

	.shelf-shadow {
		position: absolute;
		top: 60px;
		left: 10px;
		right: 10px;
		height: 20px;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), transparent);
		border-radius: 50%;
		z-index: -1;
	}

	.shelf-books {
		position: absolute;
		bottom: 20px;
		left: 0;
		right: 0;
		height: 220px;
		display: flex;
		justify-content: space-evenly;
		align-items: flex-end;
		gap: 1rem;
		padding: 0 3rem;
		z-index: 2;
		overflow: visible;
		max-width: 100%;
	}

	.book-card {
		--book-width: 180px;
		--book-height: 240px;
		--book-depth: 25px;
		--book-border-radius: 0 4px 4px 0;

		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		perspective: 1200px;
		flex: 0 0 auto;
		position: relative;
	}

	.book-card:hover {
		z-index: 10;
	}

	.book-card.selected {
		z-index: 10;
	}

	.book-card.selected .book-3d-wrapper {
		animation: bookOpenAnimation 0.4s ease-out forwards;
	}

	.book-3d-wrapper {
		width: var(--book-width);
		height: var(--book-height);
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.book-card:hover .book-3d-wrapper {
		transform: translateY(-5px) rotateY(-15deg);
	}

	.book-card.selected .book-3d-wrapper {
		transform: translateY(-20px) rotateY(-25deg) scale(1.05);
	}

	.book-cover-front {
		width: var(--book-width);
		height: var(--book-height);
		position: absolute;
		top: 0;
		left: 0;
		border-radius: var(--book-border-radius);
		overflow: hidden;
		transform-style: preserve-3d;
		box-shadow:
			2px 2px 8px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(255, 255, 255, 0.1);
		z-index: 2;
	}

	.cover-texture {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		/* Darker color with subtle texture */
		background:
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--book-color) 80%, #000000 20%),
				color-mix(in srgb, var(--book-color) 70%, #000000 30%)
			),
			url('/texture/fabric.jpg');
		background-size: 100%, 300px;
		background-repeat: no-repeat, repeat;
		background-blend-mode: normal, soft-light;
	}

	.cover-texture::before {
		content: '';
		position: absolute;
		inset: 0;
		background: 
			/* Blur effect in the middle */
			radial-gradient(ellipse 60% 40% at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%),
			/* Subtle edge darkening */
				linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent 30%, rgba(0, 0, 0, 0.2));
		backdrop-filter: blur(0.5px);
	}

	.cover-content {
		position: absolute;
		inset: 0;
		padding: 20px 15px;
	}

	.cover-content.no-padding {
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cover-border {
		width: 100%;
		height: 100%;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 4px;
		padding: 15px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		transition: all 0.3s ease;
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(1px);
	}

	/* Typography */
	.book-title {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 8px;
		font-family: Georgia, serif;
		line-height: 1.2;
		color: #ffffff;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
	}

	.book-cover-image-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		z-index: -1;
	}

	.book-cover-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.4);
	}

	/* Page edges - rotated 90deg to face right */
	.book-pages {
		position: absolute;
		top: 3px;
		height: calc(var(--book-height) - 6px);
		width: var(--book-depth);
		/* Position at right edge, rotate 90deg, then translate to correct position */
		transform:
			translateX(calc(var(--book-width) - var(--book-depth) / 2 - 1px))
			rotateY(90deg)
			translateX(calc(var(--book-depth) / 2));
		background:
			/* Page edge gradient - light to dark from front to back */
			linear-gradient(90deg, #f5f3ed 0%, #faf8f2 30%, #eae8e2 100%),
			/* Subtle horizontal lines to suggest pages */
			repeating-linear-gradient(
				to bottom,
				transparent 0px,
				transparent 3px,
				rgba(0, 0, 0, 0.02) 3px,
				rgba(0, 0, 0, 0.02) 4px
			);
		background-blend-mode: normal, overlay;
		z-index: 1;
	}


	/* Spine - rotated 90deg to face left */
	.book-spine {
		position: absolute;
		top: 0;
		left: 0;
		height: var(--book-height);
		width: var(--book-depth);
		transform-origin: left center;
		transform: rotateY(90deg);
		background:
			linear-gradient(90deg, rgba(0, 0, 0, 0.1) 0%, transparent 50%, rgba(0, 0, 0, 0.15) 100%),
			color-mix(in srgb, var(--book-color) 85%, #000000 15%);
		border-radius: 4px 0 0 4px;
		z-index: 1;
	}

	/* Back cover - pushed back in Z-space */
	.book-back {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--book-width);
		height: var(--book-height);
		transform: translateZ(calc(-1 * var(--book-depth)));
		background: color-mix(in srgb, var(--book-color) 70%, #000000 30%);
		border-radius: 4px 0 0 4px;
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
	@media (max-width: 768px) {
		.shelf-books {
			gap: 0.75rem;
			padding: 0 1.5rem;
			bottom: 20px;
			height: 220px;
		}

		.book-card {
			--book-width: 140px;
			--book-height: 220px;
			--book-depth: 20px;
		}

		.shelf-row {
			height: 280px;
		}

		.book-title {
			font-size: 16px;
		}

	}

	@media (max-width: 480px) {
		.container {
			padding: 2rem 1rem;
		}

		.shelf-books {
			gap: 0.5rem;
			padding: 0 1rem;
			bottom: 20px;
			height: 190px;
		}

		.book-card {
			--book-width: 120px;
			--book-height: 190px;
			--book-depth: 18px;
		}

		.shelf-row {
			height: 250px;
		}

		.book-title {
			font-size: 14px;
		}

	}

	@media (min-width: 1200px) {
		.shelf-books {
			gap: 1.5rem;
			padding: 0 4rem;
			bottom: 20px;
			height: 260px;
		}

		.book-card {
			--book-width: 200px;
			--book-height: 260px;
			--book-depth: 30px;
		}

		.shelf-row {
			height: 320px;
		}

		.book-title {
			font-size: 22px;
		}

	}
</style>
