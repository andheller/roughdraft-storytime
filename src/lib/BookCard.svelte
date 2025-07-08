<script>
	let { book, isSelected = false, onSelect } = $props();

	function handleKeyDown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect(book);
		}
	}
</script>

<button
	class="book-card {isSelected ? 'selected' : ''}"
	style="--book-color: {book.leatherColor};"
	onclick={() => onSelect(book)}
	onkeydown={handleKeyDown}
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

<style>
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

	.book-cover::before {
		content: '';
		position: absolute;
		top: 0;
		right: -4px;
		bottom: 4px;
		width: 4px;
		background: linear-gradient(
			to right,
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
			radial-gradient(ellipse 60% 40% at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%),
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
		background: #ffffff !important;
		background-image: repeating-linear-gradient(
			to bottom,
			var(--book-color) 0px,
			var(--book-color) 0.05px,
			#ffffff 0.05px,
			#ffffff 1px
		) !important;
		border-radius: 0 2px 2px 0;
		box-shadow:
			0 0 0 0.5px var(--book-color),
			0 2px 4px rgba(0, 0, 0, 0.2);
		overflow: visible;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
		background: #ffffff !important;
		background-image: repeating-linear-gradient(
			to bottom,
			var(--book-color) 0px,
			var(--book-color) 0.05px,
			#ffffff 0.05px,
			#ffffff 1px
		) !important;
		border-radius: 0 2px 2px 0;
		box-shadow:
			0 0 0 1px var(--book-color),
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
		width: 2px;
		background: #ffffff !important;
		background-image: repeating-linear-gradient(
			to bottom,
			var(--book-color) 0px,
			var(--book-color) 0.05px,
			#ffffff 0.05px,
			#ffffff 1px
		) !important;
		border-radius: 0 2px 2px 0;
		box-shadow:
			0 0 0 1px var(--book-color),
			0 2px 3px rgba(0, 0, 0, 0.12);
		opacity: 0;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: left center;
		z-index: -1;
	}

	.book-card:hover .book-pages {
		opacity: 1;
		transform: rotateY(1deg);
		width: 2px;
		right: -3px;
		z-index: 1;
	}

	.book-card:hover .book-pages::before {
		opacity: 1;
		transform: rotateY(2deg);
		right: -2px;
		width: 2px;
		z-index: 0;
	}

	.book-card:hover .book-pages::after {
		opacity: 1;
		transform: rotateY(3deg);
		right: -4px;
		width: 2px;
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

	/* Responsive Design */
	@media (max-width: 768px) {
		.book-cover {
			width: 140px;
			height: 220px;
		}

		.book-title {
			font-size: 16px;
		}
	}

	@media (max-width: 480px) {
		.book-cover {
			width: 120px;
			height: 190px;
		}

		.book-title {
			font-size: 14px;
		}
	}

	@media (min-width: 1200px) {
		.book-cover {
			width: 200px;
			height: 260px;
		}

		.book-title {
			font-size: 22px;
		}
	}
</style>