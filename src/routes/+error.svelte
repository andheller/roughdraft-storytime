<script>
	import { page } from '$app/state';
	import { getBookshelfBooks } from '$lib/content-loader.js';
	import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '$lib/site.js';

	const HOME_LOGO = {
		src: '/optimized/logo-sign-480.webp',
		srcset:
			'/optimized/logo-sign-320.webp 320w, /optimized/logo-sign-480.webp 480w, /optimized/logo-sign-640.webp 640w',
		sizes: '(max-width: 480px) 78vw, 360px'
	};

	const suggestedBooks = getBookshelfBooks()
		.filter((book) => book.coverImage)
		.slice(0, 5);

	const status = $derived(page.status);
	const isNotFound = $derived(status === 404);
	const title = $derived(isNotFound ? 'This shelf is empty' : 'The lamp flickered');
	const description = $derived(
		isNotFound
			? 'The page you asked for is not in the catalog. Head back to the library or choose a story from the shelf below.'
			: 'Something interrupted this page. The library is still open, and these stories are ready to read.'
	);
	const canonicalUrl = $derived(absoluteUrl(page.url?.pathname ?? '/'));

	function getBookHref(book) {
		return `/${book.seriesId}/${book.storyId}`;
	}

	function getBookWidth(index) {
		return 118 + (index % 3) * 12;
	}

	function getBookHeight(index) {
		return 176 + (index % 4) * 12;
	}
</script>

<svelte:head>
	<title>{status} | {title} | {SITE_NAME}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="noindex,follow" />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:title" content={`${status} | ${title} | ${SITE_NAME}`} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={DEFAULT_OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="error-room">
	<div class="wallpaper-background" aria-hidden="true"></div>
	<div class="room-vignette" aria-hidden="true"></div>

	<main class="error-container">
		<a class="library-link" href="/">Back to library</a>

		<section class="error-header" aria-labelledby="error-heading">
			<img
				src={HOME_LOGO.src}
				srcset={HOME_LOGO.srcset}
				sizes={HOME_LOGO.sizes}
				alt="Roughdraft Storytime"
				class="logo"
				width="360"
				height="240"
				fetchpriority="high"
				loading="eager"
				decoding="async"
			/>

			<div class="error-copy">
				<p class="status-kicker">{status}</p>
				<h1 id="error-heading">{title}</h1>
				<p>{description}</p>
				<div class="actions">
					<a class="primary-action" href="/">Browse stories</a>
				</div>
			</div>
		</section>

		<section class="suggested-shelf" aria-labelledby="suggested-stories-heading">
			<div class="shelf-copy">
				<h2 id="suggested-stories-heading">Try one from this shelf</h2>
			</div>

			<div class="shelf-row">
				<div class="shelf-back-glow" aria-hidden="true"></div>

				<div class="shelf-books">
					{#each suggestedBooks as book, index (book.id)}
						<a
							href={getBookHref(book)}
							class="book-card"
							style={`--book-color: ${book.leatherColor}; --book-width: ${getBookWidth(index)}px; --book-height: ${getBookHeight(index)}px; --book-lean: ${(index - 2) * 0.45}deg;`}
							aria-label={`Read ${book.title}`}
						>
							<div class="book-cover">
								<div class="cover-border">
									<img src={book.coverImage} alt="" loading="lazy" decoding="async" />
								</div>
							</div>
							<h3>{book.title}</h3>
						</a>
					{/each}
				</div>

				<div class="wooden-shelf" aria-hidden="true">
					<div class="shelf-surface"></div>
					<div class="shelf-lip"></div>
					<div class="shelf-bracket shelf-bracket-left"></div>
					<div class="shelf-bracket shelf-bracket-right"></div>
				</div>
			</div>
		</section>
	</main>
</div>

<style>
	.error-room {
		position: relative;
		min-height: 100vh;
		overflow: hidden;
		color: #f9f5e8;
		background: #0f1a12;
	}

	.wallpaper-background {
		position: absolute;
		inset: 0;
		background-color: #0f1a12;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%231a3020' fill-opacity='0.4' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
	}

	.room-vignette {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 50% 18%, rgb(255 215 128 / 0.18), transparent 32rem),
			radial-gradient(
				circle at center,
				transparent 0%,
				rgb(0 0 0 / 0.2) 62%,
				rgb(0 0 0 / 0.58) 100%
			);
	}

	.error-container {
		position: relative;
		z-index: 1;
		width: min(1120px, calc(100% - 32px));
		min-height: 100vh;
		margin: 0 auto;
		padding: 28px 0 56px;
	}

	.library-link {
		display: inline-flex;
		align-items: center;
		min-height: 42px;
		padding: 0 18px;
		border: 1px solid rgb(246 224 178 / 0.34);
		border-radius: 999px;
		background: rgb(14 21 13 / 0.48);
		color: #ffe9b0;
		font-family: InterVariable, system-ui, sans-serif;
		font-size: 0.85rem;
		font-weight: 800;
		text-decoration: none;
		box-shadow: 0 14px 32px rgb(0 0 0 / 0.24);
		backdrop-filter: blur(8px);
	}

	.error-header {
		display: grid;
		grid-template-columns: minmax(220px, 360px) minmax(0, 1fr);
		gap: clamp(28px, 6vw, 72px);
		align-items: center;
		padding: clamp(44px, 8vw, 92px) 0 clamp(34px, 5vw, 64px);
	}

	.logo {
		width: min(360px, 100%);
		height: auto;
		filter: drop-shadow(0 26px 42px rgb(0 0 0 / 0.45));
	}

	.error-copy {
		max-width: 620px;
	}

	.status-kicker {
		margin: 0 0 10px;
		color: #f5c15a;
		font-family: InterVariable, system-ui, sans-serif;
		font-size: 0.92rem;
		font-weight: 900;
		letter-spacing: 0.22em;
		text-transform: uppercase;
	}

	.error-copy h1 {
		margin: 0;
		color: #fff7df;
		font-family: InterVariable, system-ui, sans-serif;
		font-size: clamp(3.2rem, 8vw, 6.8rem);
		font-weight: 950;
		line-height: 0.95;
		text-shadow: 0 8px 24px rgb(0 0 0 / 0.3);
	}

	.error-copy p:not(.status-kicker) {
		max-width: 560px;
		margin: 22px 0 0;
		color: #eadcc0;
		font-size: clamp(1.08rem, 2vw, 1.3rem);
		line-height: 1.65;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 28px;
	}

	.primary-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 48px;
		padding: 0 22px;
		border-radius: 6px;
		font-family: InterVariable, system-ui, sans-serif;
		font-size: 0.94rem;
		font-weight: 900;
		text-decoration: none;
		transition:
			transform 180ms ease,
			background-color 180ms ease,
			border-color 180ms ease;
	}

	.primary-action {
		background: #f2c45c;
		color: #23190b;
		box-shadow: 0 16px 30px rgb(0 0 0 / 0.28);
	}

	.library-link:hover,
	.primary-action:hover,
	.book-card:hover {
		transform: translateY(-2px);
	}

	.library-link:focus-visible,
	.primary-action:focus-visible,
	.book-card:focus-visible {
		outline: 3px solid #f4c95d;
		outline-offset: 4px;
	}

	.suggested-shelf {
		margin-top: 8px;
	}

	.shelf-copy {
		margin-bottom: 18px;
	}

	.shelf-copy h2 {
		margin: 0;
		color: #f5d58b;
		font-family: InterVariable, system-ui, sans-serif;
		font-size: clamp(1.35rem, 3vw, 2rem);
		font-weight: 950;
	}

	.shelf-row {
		position: relative;
		min-height: 270px;
		padding: 0 22px 42px;
	}

	.shelf-back-glow {
		position: absolute;
		right: 4%;
		bottom: 54px;
		left: 4%;
		height: 170px;
		border-radius: 50%;
		background: radial-gradient(ellipse, rgb(255 219 126 / 0.2), transparent 68%);
		filter: blur(18px);
	}

	.shelf-books {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: clamp(10px, 2.6vw, 22px);
		min-height: 228px;
	}

	.book-card {
		width: var(--book-width);
		color: #fff8dc;
		text-decoration: none;
		transform: rotate(var(--book-lean));
		transform-origin: bottom center;
		transition:
			transform 180ms ease,
			filter 180ms ease;
	}

	.book-cover {
		position: relative;
		height: var(--book-height);
		overflow: hidden;
		border-radius: 4px 7px 7px 4px;
		background:
			linear-gradient(
				90deg,
				rgb(0 0 0 / 0.28),
				transparent 16%,
				rgb(255 255 255 / 0.08) 42%,
				transparent 74%
			),
			var(--book-color);
		box-shadow:
			8px 14px 20px rgb(0 0 0 / 0.32),
			inset 5px 0 8px rgb(0 0 0 / 0.28),
			inset -4px 0 5px rgb(255 255 255 / 0.14);
	}

	.cover-border {
		position: absolute;
		inset: 10px;
		overflow: hidden;
		border: 1px solid rgb(245 214 128 / 0.52);
		border-radius: 3px;
	}

	.book-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.book-card h3 {
		margin: 12px 0 0;
		color: #f7e9bd;
		font-family: InterVariable, system-ui, sans-serif;
		font-size: 0.78rem;
		font-weight: 850;
		line-height: 1.25;
		text-align: center;
		text-shadow: 0 2px 8px rgb(0 0 0 / 0.4);
	}

	.wooden-shelf {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1;
		height: 72px;
	}

	.shelf-surface {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		height: 18px;
		border-radius: 5px 5px 2px 2px;
		background: linear-gradient(180deg, #8b5a2b 0%, #6f431f 48%, #492714 100%);
		box-shadow:
			0 5px 10px rgb(0 0 0 / 0.35),
			inset 0 2px 0 rgb(255 220 150 / 0.18);
	}

	.shelf-lip {
		position: absolute;
		top: 18px;
		right: 10px;
		left: 10px;
		height: 28px;
		border-radius: 0 0 7px 7px;
		background: linear-gradient(180deg, #5f3619 0%, #3a1f10 100%);
		box-shadow: 0 18px 28px rgb(0 0 0 / 0.34);
	}

	.shelf-bracket {
		position: absolute;
		top: 34px;
		width: 36px;
		height: 38px;
		background: linear-gradient(135deg, #4b2a14, #291407);
		clip-path: polygon(0 0, 100% 0, 50% 100%);
	}

	.shelf-bracket-left {
		left: 10%;
	}

	.shelf-bracket-right {
		right: 10%;
	}

	@media (max-width: 760px) {
		.error-container {
			width: min(100% - 24px, 560px);
			padding-top: 18px;
		}

		.error-header {
			grid-template-columns: 1fr;
			gap: 22px;
			text-align: center;
		}

		.logo {
			justify-self: center;
			width: min(280px, 82vw);
		}

		.actions {
			justify-content: center;
		}

		.shelf-row {
			padding-inline: 8px;
			overflow-x: auto;
			scrollbar-width: none;
		}

		.shelf-row::-webkit-scrollbar {
			display: none;
		}

		.shelf-books {
			justify-content: flex-start;
			min-width: 640px;
		}
	}
</style>
