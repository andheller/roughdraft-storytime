<script>
	import { bookList } from '$lib/books.js';

	let selectedBook = $state(null);
	let showBookModal = $state(false);
	let animatingBook = $state(null);
	let coverStyle = $state('fabric'); // Only using fabric now
	let woodGrain = $state('2.png'); // Default wood grain set to wood 2
	
	// Calculate books per shelf based on screen size
	let booksPerShelf = $state(5);
	
	// Update books per shelf based on window size and available space
	function updateBooksPerShelf() {
		if (typeof window !== 'undefined') {
			if (window.innerWidth < 480) {
				// Book width: 120px, gap: 8px, padding: 2rem total = 32px
				// Available: 480px - 32px = 448px
				booksPerShelf = 2; // 2 books × 120px + 1 gap × 8px = 248px
			} else if (window.innerWidth < 768) {
				// Book width: 140px, gap: 12px, padding: 3rem total = 48px
				// Available: 768px - 48px = 720px
				booksPerShelf = 2; // 2 books × 140px + 1 gap × 12px = 292px
			} else if (window.innerWidth < 1000) {
				// Book width: 180px, gap: 16px, padding: 6rem total = 96px
				booksPerShelf = 4; // 4 books × 180px + 3 gaps × 16px = 768px
			} else if (window.innerWidth < 1400) {
				// Book width: 180px, gap: 16px, container max 1200px
				booksPerShelf = 5; // 5 books × 180px + 4 gaps × 16px = 964px
			} else {
				// Book width: 200px, gap: 24px, container max 1200px
				booksPerShelf = 5; // Keep at 5 to avoid overflow
			}
		}
	}
	
	// Initialize and listen for resize
	if (typeof window !== 'undefined') {
		updateBooksPerShelf();
		window.addEventListener('resize', updateBooksPerShelf);
	}

	function selectBook(book) {
		if (selectedBook === book) {
			closeBook();
		} else {
			selectedBook = book;
			animatingBook = book.id;
			// Add slight delay for animation, then navigate directly to story
			setTimeout(() => {
				window.location.href = `/${book.storyId}`;
			}, 300);
		}
	}

	function closeBook() {
		showBookModal = false;
		setTimeout(() => {
			selectedBook = null;
			animatingBook = null;
		}, 300);
	}

	function openBook(book) {
		// Navigate to the story
		window.location.href = `/${book.storyId}`;
	}

	function handleKeyDown(event, book) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectBook(book);
		}
	}

	function getBookCoverStyle(book, index) {
		if (coverStyle === 'mixed') {
			const styles = ['fabric', 'plain', 'vintage'];
			return styles[index % styles.length];
		}
		return coverStyle;
	}

</script>

<svelte:head>
	<title>Bookshelf - Kids Story Collection</title>
</svelte:head>

<div class="bookshelf-room">
	<!-- Wood background with depth -->
	<div class="wood-background" style="background-image: url('/grain-options/{woodGrain}')"></div>
	
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
															<img src={book.coverImage} alt={book.title} class="book-cover-image" />
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

	<!-- Book Detail Modal -->
	{#if showBookModal && selectedBook}
		<div class="book-modal" onclick={closeBook} role="button" tabindex="-1">
			<div class="book-modal-content" onclick={(e) => e.stopPropagation()}>
				<button class="close-btn" onclick={closeBook} aria-label="Close book">×</button>
				
				<div class="book-detail">
					<div class="book-cover-large">
						<div class="book-cover-front-large" style="--book-color: {selectedBook.leatherColor};">
							<div class="cover-texture-large">
								<div class="cover-content-large {selectedBook.coverImage ? 'no-padding' : ''}">
									<div class="cover-border-large">
										<h2 class="cover-title-large">{selectedBook.title}</h2>
										<p class="cover-author-large">by {selectedBook.author}</p>
										{#if selectedBook.coverImage}
											<div class="book-cover-image-container-large">
												<img src={selectedBook.coverImage} alt={selectedBook.title} class="book-cover-image-large" />
											</div>
										{/if}
										<p class="cover-description">{selectedBook.description}</p>
									</div>
								</div>
							</div>
							<div class="book-pages-large"></div>
						</div>
					</div>
					
					<button class="open-book-btn" onclick={() => openBook(selectedBook)}>
						Open Book & Start Reading
					</button>
				</div>
			</div>
		</div>
	{/if}

</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}

	.bookshelf-room {
		min-height: 100vh;
		background: #8B4513;
		position: relative;
		overflow-x: hidden;
	}

	.wood-background {
		position: absolute;
		inset: 0;
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
			linear-gradient(45deg, rgba(139, 69, 19, 0.1) 0%, transparent 50%, rgba(101, 67, 33, 0.1) 100%),
			linear-gradient(135deg, rgba(160, 82, 45, 0.05) 0%, transparent 50%, rgba(139, 69, 19, 0.05) 100%);
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
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent 50%, rgba(0, 0, 0, 0.1));
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
		justify-content: center;
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
		transform: scale(1.05) translateZ(30px);
		z-index: 10;
	}

	.book-cover {
		width: 180px;
		height: 240px;
		position: relative;
		transform-style: preserve-3d;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: visible;
	}

	.book-cover::before {
		content: '';
		position: absolute;
		top: 0;
		right: -4px;
		bottom: 4px;
		width: 4px;
		background: 
			linear-gradient(to right, 
				color-mix(in srgb, var(--book-color) 80%, #000000 20%),
				color-mix(in srgb, var(--book-color) 70%, #000000 30%)
			);
		border-radius: 0 2px 2px 0;
		box-shadow: 
			2px 0 4px rgba(0, 0, 0, 0.3),
			inset -1px 0 2px rgba(0, 0, 0, 0.2);
		opacity: 0;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: -1;
	}

	.book-card:hover .book-cover::before {
		opacity: 1;
	}

	.book-card:hover .book-cover {
		transform: translateY(-3px) rotateY(-3deg) rotateX(1deg);
		z-index: 10;
	}

	.book-card.selected .book-cover {
		transform: translateY(-20px) rotateY(15deg) scale(1.1);
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
			linear-gradient(135deg, 
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

	.book-author {
		font-size: 14px;
		margin-bottom: 15px;
		font-style: italic;
		color: rgba(255, 255, 255, 0.9);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
	}


	.book-illustration {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.book-emoji {
		font-size: 48px;
		filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
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
		right: -6px;
		bottom: 2px;
		width: 4px;
		background: #ffffff !important;
		background-image: repeating-linear-gradient(
			to bottom,
			#ffffff 0px,
			#ffffff 0.5px,
			#f8f8f8 0.5px,
			#f8f8f8 1px
		) !important;
		border-radius: 0 2px 2px 0;
		box-shadow:
			0 0 0 1px #ffffff,
			0 2px 4px rgba(0, 0, 0, 0.2);
		overflow: visible;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: left center;
		z-index: 1;
	}

	.book-pages::before {
		content: '';
		position: absolute;
		top: 0;
		right: -4px;
		bottom: 0;
		width: 4px;
		background: #ffffff !important;
		background-image: repeating-linear-gradient(
			to bottom,
			#ffffff 0px,
			#ffffff 0.5px,
			#f5f5f5 0.5px,
			#f5f5f5 1px
		) !important;
		border-radius: 0 2px 2px 0;
		box-shadow: 
			0 0 0 1px #ffffff,
			0 2px 3px rgba(0, 0, 0, 0.15);
		opacity: 0;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: left center;
		z-index: 0;
	}

	.book-pages::after {
		content: '';
		position: absolute;
		top: 0;
		right: -8px;
		bottom: 0;
		width: 4px;
		background: #ffffff !important;
		background-image: repeating-linear-gradient(
			to bottom,
			#ffffff 0px,
			#ffffff 0.5px,
			#f2f2f2 0.5px,
			#f2f2f2 1px
		) !important;
		border-radius: 0 2px 2px 0;
		box-shadow: 
			0 0 0 1px #ffffff,
			0 2px 3px rgba(0, 0, 0, 0.12);
		opacity: 0;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: left center;
		z-index: -1;
	}

	.book-card:hover .book-pages {
		transform: rotateY(2deg);
		width: 5px;
		right: -7px;
		z-index: 5;
	}

	.book-card:hover .book-pages::before {
		opacity: 1;
		transform: rotateY(4deg);
		right: -5px;
		z-index: 4;
	}

	.book-card:hover .book-pages::after {
		opacity: 1;
		transform: rotateY(6deg);
		right: -8px;
		z-index: 3;
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
	}

	/* Modal Styles */
	.book-modal {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.9);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		animation: fadeIn 0.3s ease;
		backdrop-filter: blur(5px);
	}

	.book-modal-content {
		position: relative;
		animation: slideUp 0.4s ease;
		max-width: 90vw;
		max-height: 90vh;
		overflow: auto;
	}

	.close-btn {
		position: absolute;
		top: -50px;
		right: -50px;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.9);
		border: none;
		font-size: 28px;
		cursor: pointer;
		transition: all 0.2s ease;
		z-index: 10;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		color: #333;
		font-weight: bold;
	}

	.close-btn:hover {
		background: white;
		transform: scale(1.1);
	}

	.book-detail {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	.book-cover-large {
		width: 320px;
		height: 440px;
		transform-style: preserve-3d;
		animation: bookEntrance 0.6s ease;
	}

	.book-cover-front-large {
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 0 8px 8px 0;
		overflow: hidden;
		box-shadow: 
			0 8px 20px rgba(0, 0, 0, 0.4),
			0 0 0 1px rgba(255, 255, 255, 0.1);
	}

	.cover-texture-large {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		/* Darker color with subtle texture */
		background: 
			linear-gradient(135deg, 
				color-mix(in srgb, var(--book-color) 80%, #000000 20%),
				color-mix(in srgb, var(--book-color) 70%, #000000 30%)
			),
			url('/texture/fabric.jpg');
		background-size: 100%, 400px;
		background-repeat: no-repeat, repeat;
		background-blend-mode: normal, soft-light;
	}

	.cover-texture-large::before {
		content: '';
		position: absolute;
		inset: 0;
		background: 
			/* Blur effect in the middle */
			radial-gradient(ellipse 60% 40% at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%),
			/* Subtle edge darkening */
			linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent 30%, rgba(0, 0, 0, 0.2));
		backdrop-filter: blur(0.5px);
		pointer-events: none;
	}

	.cover-content-large {
		position: absolute;
		inset: 0;
		padding: 30px 25px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cover-content-large.no-padding {
		padding: 0;
	}

	.cover-border-large {
		width: 100%;
		height: 100%;
		border: 3px solid rgba(255, 255, 255, 0.4);
		border-radius: 6px;
		padding: 25px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(1px);
		box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
	}

	.cover-title-large {
		font-size: 28px;
		font-weight: bold;
		color: #ffffff;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
		margin-bottom: 12px;
		font-family: Georgia, serif;
		line-height: 1.2;
	}

	.cover-author-large {
		font-size: 16px;
		color: rgba(255, 255, 255, 0.9);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
		margin-bottom: 25px;
		font-style: italic;
	}

	.cover-illustration-large {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;
	}

	.cover-emoji-large {
		font-size: 100px;
		filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.4));
	}

	.book-cover-image-container-large {
		position: absolute;
		inset: 0;
		overflow: hidden;
		z-index: -1;
	}

	.book-cover-image-large {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
	}

	.cover-description {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.9);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
		line-height: 1.5;
		font-family: Georgia, serif;
	}

	.book-pages-large {
		position: absolute;
		top: 5px;
		right: -12px;
		bottom: 5px;
		width: 12px;
		background: repeating-linear-gradient(
			to bottom,
			#f5f5dc,
			#f5f5dc 1px,
			#e8e8d0 1px,
			#e8e8d0 2px
		);
		border-radius: 0 3px 3px 0;
		box-shadow:
			inset -2px 0 4px rgba(0, 0, 0, 0.2),
			2px 0 4px rgba(0, 0, 0, 0.2);
	}

	.open-book-btn {
		background: linear-gradient(135deg, #ffd700, #ffa500);
		color: #2c1810;
		border: none;
		padding: 18px 36px;
		border-radius: 50px;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow:
			0 6px 20px rgba(255, 215, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
		font-family: Georgia, serif;
	}

	.open-book-btn:hover {
		transform: translateY(-2px);
		box-shadow:
			0 8px 25px rgba(255, 215, 0, 0.6),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		background: linear-gradient(135deg, #ffdb58, #ffb84d);
	}

	/* Animations */

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideUp {
		from { transform: translateY(30px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	@keyframes bookEntrance {
		from { transform: rotateY(-30deg) scale(0.8); opacity: 0; }
		to { transform: rotateY(0deg) scale(1); opacity: 1; }
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

		.book-author {
			font-size: 12px;
		}

		.book-emoji {
			font-size: 40px;
		}

		.book-cover-large {
			width: 280px;
			height: 380px;
		}

		.cover-title-large {
			font-size: 24px;
		}

		.cover-author-large {
			font-size: 14px;
		}

		.cover-emoji-large {
			font-size: 80px;
		}

		.close-btn {
			top: -30px;
			right: -30px;
			width: 36px;
			height: 36px;
			font-size: 24px;
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

		.book-author {
			font-size: 11px;
		}

		.book-emoji {
			font-size: 36px;
		}

		.book-cover-large {
			width: 250px;
			height: 340px;
		}

		.cover-title-large {
			font-size: 22px;
		}

		.cover-emoji-large {
			font-size: 70px;
		}

		.cover-description {
			font-size: 13px;
		}

		.open-book-btn {
			padding: 14px 28px;
			font-size: 16px;
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

		.book-author {
			font-size: 16px;
		}

		.book-emoji {
			font-size: 52px;
		}
	}
</style>