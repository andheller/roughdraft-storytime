<script>
	import { page } from '$app/state';
	import { getBookshelfBooks } from '$lib/content-loader.js';
	import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '$lib/site.js';

	const HOME_LOGO = {
		src: '/logo-sign.webp',
		srcset:
			'/optimized/logo-sign-320.webp 320w, /optimized/logo-sign-480.webp 480w, /optimized/logo-sign-640.webp 640w, /logo-sign.webp 1536w',
		sizes: '(max-width: 640px) 70vw, 280px',
		width: 1536,
		height: 1024
	};

	const suggestedBooks = getBookshelfBooks()
		.filter((book) => book.coverImage)
		.slice(0, 4);

	const status = $derived(page.status);
	const isNotFound = $derived(status === 404);
	const title = $derived(isNotFound ? 'This shelf is empty' : 'Something slipped off the shelf');
	const description = $derived(
		isNotFound
			? 'That page is not in the catalog yet. The main shelf is still ready.'
			: 'This page hit a snag. Head back to the library while we sort it out.'
	);
	const canonicalUrl = $derived(absoluteUrl(page.url?.pathname ?? '/'));

	function getBookHref(book) {
		return `/${book.seriesId}/${book.storyId}`;
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

<main class="error-page">
	<div class="error-shell">
		<a class="home-mark" href="/" aria-label="Back to the Roughdraft library">
			<img
				src={HOME_LOGO.src}
				srcset={HOME_LOGO.srcset}
				sizes={HOME_LOGO.sizes}
				alt="Roughdraft Storytime"
				width={HOME_LOGO.width}
				height={HOME_LOGO.height}
				fetchpriority="high"
				decoding="async"
			/>
		</a>

		<section class="error-panel" aria-labelledby="error-heading">
			<div class="status-plaque" aria-hidden="true">{status}</div>

			<div class="error-copy">
				<p class="eyebrow">{SITE_NAME}</p>
				<h1 id="error-heading">{title}</h1>
				<p>{description}</p>

				<div class="actions">
					<a class="primary-action" href="/">Browse stories</a>
				</div>
			</div>
		</section>

		{#if suggestedBooks.length}
			<section class="suggested-area" aria-labelledby="suggested-stories-heading">
				<div class="suggested-heading">
					<h2 id="suggested-stories-heading">Open a story from the shelf</h2>
				</div>

				<div class="mini-shelf">
					<div class="mini-books">
						{#each suggestedBooks as book (book.id)}
							<a
								href={getBookHref(book)}
								class="mini-book"
								style={`--book-color: ${book.leatherColor};`}
								aria-label={`Read ${book.title}`}
							>
								<span class="mini-cover">
									<img src={book.coverImage} alt="" loading="lazy" decoding="async" />
									<span class="mini-shine" aria-hidden="true"></span>
								</span>
							</a>
						{/each}
					</div>

					<div class="wooden-shelf" aria-hidden="true">
						<div class="shelf-surface"></div>
						<div class="shelf-lip"></div>
						<div class="shelf-shadow"></div>
					</div>
				</div>
			</section>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		overflow-x: hidden;
	}

	.error-page {
		--font-display: 'Caprasimo', 'Baloo 2', 'Lora', Georgia, serif;
		--font-round: 'Baloo 2', 'Trebuchet MS', system-ui, sans-serif;
		--font-book: 'Lora', Georgia, serif;
		--ink: #352b1f;
		--ink-soft: #6c5a43;
		--paper: #fffaf0;
		--honey: #f7ad45;
		--honey-strong: #b87a1c;

		min-height: 100vh;
		color: var(--ink);
		font-family: var(--font-round);
		background:
			linear-gradient(rgba(84, 72, 52, 0.055) 1px, transparent 1px),
			linear-gradient(90deg, rgba(84, 72, 52, 0.055) 1px, transparent 1px),
			url('/optimized/paper-texture.webp'),
			linear-gradient(180deg, #fdfbf5 0%, #f6f0e4 58%, #efe5d6 100%) #f7f1e7;
		background-size:
			1.35rem 4.2rem,
			1.35rem 4.2rem,
			360px 360px,
			auto;
		overflow-x: hidden;
	}

	.error-shell {
		width: min(1080px, calc(100% - 32px));
		min-height: 100vh;
		margin: 0 auto;
		padding: clamp(1rem, 3vw, 2rem) 0 3rem;
	}

	.home-mark {
		display: block;
		width: min(14rem, 64vw);
		margin: 0 auto clamp(0.7rem, 2.5vw, 1.2rem);
		filter: drop-shadow(0 14px 20px rgba(82, 57, 25, 0.16));
		transition: transform 180ms ease;
	}

	.home-mark:hover {
		transform: translateY(-2px);
	}

	.home-mark:focus-visible,
	.primary-action:focus-visible,
	.mini-book:focus-visible {
		outline: 3px solid rgba(247, 173, 69, 0.45);
		outline-offset: 4px;
	}

	.home-mark img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 3 / 2;
	}

	.error-panel {
		display: grid;
		grid-template-columns: minmax(7.5rem, 10.5rem) minmax(0, 1fr);
		align-items: center;
		gap: clamp(1.1rem, 3.5vw, 2.4rem);
		width: min(720px, 100%);
		margin: 0 auto;
		padding: clamp(1rem, 3vw, 1.55rem);
		border: 1px solid rgba(108, 86, 52, 0.18);
		border-radius: 0.7rem;
		background: rgba(255, 252, 245, 0.78);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.78),
			0 1.4rem 2.8rem rgba(92, 69, 39, 0.12);
		backdrop-filter: blur(8px);
	}

	.status-plaque {
		display: grid;
		place-items: center;
		aspect-ratio: 1;
		border: 1px solid rgba(112, 72, 31, 0.28);
		border-radius: 0.45rem;
		color: #fff5d8;
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 5vw, 3.5rem);
		line-height: 1;
		text-shadow: 0 2px 0 rgba(75, 42, 16, 0.34);
		background:
			linear-gradient(135deg, rgba(255, 243, 211, 0.24), transparent 34%),
			linear-gradient(180deg, rgba(159, 103, 43, 0.86), rgba(97, 54, 22, 0.92)),
			url('/optimized/shelf-wood-texture.webp');
		background-size:
			100% 100%,
			100% 100%,
			380px 150px;
		box-shadow:
			inset 0 1px 0 rgba(255, 241, 203, 0.32),
			inset 0 -8px 18px rgba(51, 24, 7, 0.28),
			0 1rem 1.8rem rgba(88, 59, 26, 0.18);
	}

	.error-copy {
		max-width: 32rem;
	}

	.eyebrow {
		margin: 0 0 0.45rem;
		color: var(--honey-strong);
		font-size: 0.78rem;
		font-weight: 900;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.error-copy h1 {
		margin: 0;
		color: var(--ink);
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 4.8vw, 3.4rem);
		font-weight: 400;
		line-height: 0.98;
		text-wrap: balance;
	}

	.error-copy p:not(.eyebrow) {
		margin: 0.75rem 0 0;
		color: var(--ink-soft);
		font-family: var(--font-book);
		font-size: clamp(0.96rem, 1.8vw, 1.08rem);
		line-height: 1.55;
		text-wrap: pretty;
	}

	.actions {
		display: flex;
		margin-top: 1rem;
	}

	.primary-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.7rem;
		padding: 0 1.15rem;
		border: 1px solid rgba(156, 100, 24, 0.32);
		border-radius: 0.45rem;
		background: linear-gradient(180deg, #ffe2a3, #ffc45f);
		color: #5b3408;
		font-size: 0.92rem;
		font-weight: 900;
		text-decoration: none;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.5),
			0 0.7rem 1.2rem rgba(131, 83, 20, 0.14);
		transition:
			transform 180ms ease,
			box-shadow 180ms ease;
	}

	.primary-action:hover {
		transform: translateY(-1px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.56),
			0 0.9rem 1.45rem rgba(131, 83, 20, 0.18);
	}

	.suggested-area {
		width: min(860px, 100%);
		margin: clamp(1.35rem, 4vw, 2.1rem) auto 0;
	}

	.suggested-heading {
		margin-bottom: 0.8rem;
		padding: 0 0.4rem;
	}

	.suggested-heading h2 {
		margin: 0;
		color: var(--ink);
		font-family: var(--font-display);
		font-size: clamp(1.35rem, 3vw, 2rem);
		font-weight: 400;
		line-height: 1.05;
	}

	.mini-shelf {
		position: relative;
		min-height: 12.2rem;
		padding: 0 1rem 2.8rem;
	}

	.mini-books {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: clamp(0.75rem, 3vw, 1.35rem);
		min-height: 10.2rem;
	}

	.mini-book {
		display: block;
		width: clamp(5.4rem, 14vw, 6.8rem);
		color: var(--ink);
		text-decoration: none;
		transform-origin: center bottom;
		transition:
			transform 180ms ease,
			filter 180ms ease;
	}

	.mini-book:hover {
		transform: translateY(-5px);
		filter: saturate(1.04);
	}

	.mini-cover {
		position: relative;
		display: block;
		aspect-ratio: 2 / 3;
		overflow: hidden;
		border-radius: 0.25rem 0.55rem 0.55rem 0.25rem;
		background: var(--book-color);
		box-shadow:
			0 0.8rem 1.2rem rgba(72, 49, 28, 0.15),
			inset 4px 0 7px rgba(0, 0, 0, 0.24),
			inset -3px 0 5px rgba(255, 255, 255, 0.14);
	}

	.mini-cover img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(1.03) contrast(1.02);
	}

	.mini-shine {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				106deg,
				transparent 42%,
				rgba(255, 255, 255, 0.15) 48%,
				rgba(255, 255, 255, 0.04) 54%,
				transparent 59%
			),
			linear-gradient(90deg, rgba(0, 0, 0, 0.25), transparent 9%);
		pointer-events: none;
	}

	.wooden-shelf {
		position: absolute;
		right: 0;
		bottom: 0.6rem;
		left: 0;
		z-index: 1;
		height: 3.6rem;
		pointer-events: none;
	}

	.shelf-surface {
		position: absolute;
		top: 0.32rem;
		right: 0.2rem;
		left: 0.2rem;
		height: 2.2rem;
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
			0 0.85rem 1.7rem rgba(84, 54, 24, 0.16),
			inset 0 1px 0 rgba(255, 243, 214, 0.5),
			inset 0 -2px 0 rgba(74, 43, 18, 0.28);
	}

	.shelf-lip {
		position: absolute;
		top: 2.2rem;
		right: 0.75rem;
		left: 0.75rem;
		height: 0.9rem;
		border: 1px solid rgba(83, 49, 21, 0.28);
		border-top: none;
		border-radius: 0 0 0.55rem 0.55rem;
		background:
			linear-gradient(180deg, rgba(111, 66, 27, 0.12), rgba(64, 35, 14, 0.36)),
			url('/optimized/shelf-wood-texture.webp');
		background-size:
			100% 100%,
			360px 130px;
		background-position: center 60%;
		background-blend-mode: multiply, normal;
		box-shadow:
			0 0.9rem 1.5rem rgba(84, 54, 24, 0.16),
			inset 0 -1px 0 rgba(49, 25, 8, 0.22);
	}

	.shelf-shadow {
		position: absolute;
		top: 2.85rem;
		right: 2rem;
		left: 2rem;
		height: 0.9rem;
		border-radius: 999px;
		background: radial-gradient(ellipse at center, rgba(107, 88, 58, 0.14), transparent 72%);
		filter: blur(6px);
	}

	@media (max-width: 700px) {
		.error-shell {
			width: min(100% - 24px, 34rem);
			padding-bottom: 2.5rem;
		}

		.error-panel {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.status-plaque {
			width: min(9rem, 52vw);
			justify-self: center;
		}

		.actions {
			justify-content: center;
		}

		.suggested-heading {
			text-align: center;
		}

		.mini-shelf {
			padding-inline: 0.25rem;
		}

		.mini-books {
			flex-wrap: wrap;
			min-height: 0;
			padding-bottom: 1.4rem;
		}

		.mini-book {
			width: clamp(5.8rem, 34vw, 7rem);
		}
	}
</style>
