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
								<div class="book-cover">
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
										<div class="book-pages"></div>
									</div>
									<div class="book-spine"></div>
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
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transform-style: preserve-3d;
		perspective: 1000px;
		flex: 0 0 auto;
		position: relative;
	}

	.book-card:hover {
		z-index: 10;
	}

	.book-card.selected {
		transform: scale(1.02) translateZ(30px);
		z-index: 10;
	}

	.book-card.selected .book-cover {
		animation: bookOpenAnimation 0.4s ease-out forwards;
	}

	.book-cover {
		width: 180px;
		height: 240px;
		position: relative;
		transform-style: preserve-3d;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: visible;
	}


	.book-card:hover .book-cover {
		transform: translateY(-3px) rotateY(-8deg);
		z-index: 10;
	}

	.book-card.selected .book-cover {
		transform: translateY(-20px) rotateY(15deg) scale(1.05);
	}

	.book-cover-front {
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 0 6px 6px 0;
		overflow: visible;
		transform-style: preserve-3d;
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(255, 255, 255, 0.1);
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

	.book-pages {
		position: absolute;
		top: 2px;
		right: -3px;
		bottom: 3px;
		width: 2px;
		background: 
			linear-gradient(to right, #fefcf8 0%, #fdfbf7 50%, #fcfaf6 100%),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, transparent 20%, rgba(0, 0, 0, 0.02) 80%, rgba(0, 0, 0, 0.04) 100%);
		border-radius: 0 1px 1px 0;
		box-shadow: 
			0 3px 8px rgba(0, 0, 0, 0.15),
			inset -0.5px 0 1px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		overflow: visible;
		transition: all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
		transform-origin: left center;
		opacity: 0;
		z-index: 1;
	}

	.book-pages::before {
		content: '';
		position: absolute;
		top: 0;
		right: -4px;
		bottom: 0;
		width: 2px;
		background: 
			linear-gradient(to right, #faf8f2 0%, #f9f7f1 50%, #f8f6f0 100%),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 0%, transparent 25%, rgba(0, 0, 0, 0.03) 75%, rgba(0, 0, 0, 0.05) 100%);
		border-radius: 0 1px 1px 0;
		box-shadow: 
			0 2px 6px rgba(0, 0, 0, 0.12),
			inset -0.5px 0 1px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.25);
		opacity: 0;
		transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) 0.02s;
		transform-origin: left center;
		z-index: 0;
	}

	.book-pages::after {
		content: '';
		position: absolute;
		top: 0;
		right: -8px;
		bottom: 0;
		width: 2px;
		background: 
			linear-gradient(to right, #f5f3eb 0%, #f4f2ea 50%, #f3f1e9 100%),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 0%, transparent 30%, rgba(0, 0, 0, 0.04) 70%, rgba(0, 0, 0, 0.06) 100%);
		border-radius: 0 1px 1px 0;
		box-shadow: 
			0 2px 5px rgba(0, 0, 0, 0.1),
			inset -0.5px 0 1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		opacity: 0;
		transition: all 0.35s cubic-bezier(0.25, 0.1, 0.25, 1) 0.05s;
		transform-origin: left center;
		z-index: -1;
	}

	.book-card:hover .book-pages {
		opacity: 0.95;
		transform: rotateY(3deg) translateY(-1px);
		width: 2.5px;
		right: -3px;
		z-index: 1;
	}

	.book-card:hover .book-pages::before {
		opacity: 0.9;
		transform: rotateY(5deg) translateY(-2px);
		right: -2px;
		width: 2px;
		z-index: 0;
	}

	.book-card:hover .book-pages::after {
		opacity: 0.85;
		transform: rotateY(7deg) translateY(-3px);
		right: -4px;
		width: 1.5px;
		z-index: -1;
	}


	.book-spine {
		position: absolute;
		top: 0;
		left: -8px;
		bottom: 0;
		width: 8px;
		background:
			linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1) 50%, transparent),
			var(--book-color);
		border-radius: 3px 0 0 3px;
		box-shadow: -2px 0 6px rgba(0, 0, 0, 0.3);
		overflow: hidden;
		z-index: 2;
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
			transform: translateY(-10px) rotateY(-15deg) scale(1.1);
		}
		100% {
			transform: translateY(-5px) rotateY(-10deg) scale(1.05);
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

		.book-cover {
			width: 140px;
			height: 220px;
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

		.book-cover {
			width: 120px;
			height: 190px;
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

		.book-cover {
			width: 200px;
			height: 260px;
		}

		.shelf-row {
			height: 320px;
		}

		.book-title {
			font-size: 22px;
		}

	}
</style>
