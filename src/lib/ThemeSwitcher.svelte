<script>
	import { themeState } from './theme.svelte.js';

	function toggleAppearance(val) {
		themeState.setAppearance(val);
	}

	function toggleFont(val) {
		themeState.setFont(val);
	}

	const pillClass =
		'inline-flex items-center gap-0.5 rounded-full border border-stone-300/90 bg-white/92 p-1 text-stone-700 shadow-[0_10px_30px_rgba(15,23,42,0.12)] ring-1 ring-white/80 backdrop-blur-md dark:border-white/10 dark:bg-white/6 dark:text-stone-200 dark:ring-white/5';
	const buttonClass =
		'inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200';
	const activeClass =
		'bg-stone-950 text-white shadow-sm dark:bg-white dark:text-stone-950';
	const inactiveClass =
		'text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-white/45 dark:hover:bg-white/8 dark:hover:text-white/80';
	const fontButtonClass =
		'inline-flex h-8 items-center justify-center rounded-full px-3 text-sm font-medium transition-all duration-200';
</script>

<div class="flex items-center gap-2 sm:gap-3">
	<!-- Appearance Toggle -->
	<div class={pillClass}>
		<!-- System -->
		<button
			type="button"
			onclick={() => toggleAppearance('system')}
			class="{buttonClass} {themeState.appearance === 'system' ? activeClass : inactiveClass}"
			aria-label="System theme"
		>
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
				<line x1="8" y1="21" x2="16" y2="21" />
				<line x1="12" y1="17" x2="12" y2="21" />
			</svg>
		</button>
		<!-- Light -->
		<button
			type="button"
			onclick={() => toggleAppearance('light')}
			class="{buttonClass} {themeState.appearance === 'light' ? activeClass : inactiveClass}"
			aria-label="Light theme"
		>
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="5" />
				<line x1="12" y1="1" x2="12" y2="3" />
				<line x1="12" y1="21" x2="12" y2="23" />
				<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
				<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
				<line x1="1" y1="12" x2="3" y2="12" />
				<line x1="21" y1="12" x2="23" y2="12" />
				<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
				<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
			</svg>
		</button>
		<!-- Dark -->
		<button
			type="button"
			onclick={() => toggleAppearance('dark')}
			class="{buttonClass} {themeState.appearance === 'dark' ? activeClass : inactiveClass}"
			aria-label="Dark theme"
		>
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</svg>
		</button>
	</div>

	<!-- Font Toggle -->
	<div class={pillClass}>
		<button
			type="button"
			onclick={() => toggleFont('serif')}
			class="{fontButtonClass} {themeState.font === 'serif'
				? activeClass
				: inactiveClass}"
			style="font-family: Georgia, serif;"
		>
			Aa
		</button>
		<button
			type="button"
			onclick={() => toggleFont('sans')}
			class="{fontButtonClass} {themeState.font === 'sans'
				? activeClass
				: inactiveClass}"
			style="font-family: system-ui, sans-serif;"
		>
			Aa
		</button>
	</div>
</div>
