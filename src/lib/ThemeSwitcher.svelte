<script>
	import { themeState, PALETTES } from './theme.svelte.js';

	let isOpen = $state(false);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}
</script>

<svelte:window
	onclick={(event) => {
		if (!event.target.closest('[data-theme-switcher]')) {
			closeMenu();
		}
	}}
	onkeydown={(event) => {
		if (event.key === 'Escape') {
			closeMenu();
		}
	}}
/>

<div class="relative" data-theme-switcher>
	<button
		type="button"
		class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/70 bg-white/82 text-stone-600 shadow-[0_12px_28px_rgba(15,23,42,0.08)] ring-1 ring-white/75 backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-stone-900 dark:border-white/10 dark:bg-white/6 dark:text-stone-300 dark:ring-white/5 dark:hover:bg-white/10 dark:hover:text-stone-100"
		aria-label="Reader appearance settings"
		aria-expanded={isOpen}
		aria-haspopup="true"
		onclick={toggleMenu}
	>
		<svg
			class="h-5 w-5"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="5" cy="12" r="1.5" />
			<circle cx="12" cy="12" r="1.5" />
			<circle cx="19" cy="12" r="1.5" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 top-full z-20 mt-2 rounded-2xl border border-stone-200/80 bg-white/95 p-3 shadow-[0_22px_50px_rgba(15,23,42,0.18)] ring-1 ring-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-stone-950/90 dark:ring-white/5"
			role="menu"
			aria-label="Reader appearance settings"
		>
			<!-- Palette swatches -->
			<div class="flex items-center gap-2.5 px-1">
				{#each Object.values(PALETTES) as palette (palette.id)}
					<button
						type="button"
						onclick={() => {
							themeState.setPalette(palette.id);
							closeMenu();
						}}
						class="relative h-5 w-5 shrink-0 rounded-full transition-transform duration-150 hover:scale-110 focus:outline-none"
						style="background: {palette.swatch};"
						aria-label={palette.label}
						aria-pressed={themeState.palette === palette.id}
					>
						{#if themeState.palette === palette.id}
							<span
								class="pointer-events-none absolute -inset-[3px] rounded-full ring-2 ring-stone-500 dark:ring-stone-300"
							></span>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Divider -->
			<div class="my-2.5 border-t border-stone-200/70 dark:border-white/8"></div>

			<!-- Font toggle -->
			<div class="flex items-center gap-1">
				<button
					type="button"
					onclick={() => {
						themeState.setFont('serif');
						closeMenu();
					}}
					class="flex-1 rounded-xl py-1.5 text-sm font-medium transition-all duration-200 {themeState.font ===
					'serif'
						? 'bg-stone-950 text-white dark:bg-white dark:text-stone-950'
						: 'text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-white/45 dark:hover:bg-white/8 dark:hover:text-white/80'}"
					style="font-family: Lora, Georgia, serif"
					aria-pressed={themeState.font === 'serif'}
				>
					Aa
				</button>
				<button
					type="button"
					onclick={() => {
						themeState.setFont('sans');
						closeMenu();
					}}
					class="flex-1 rounded-xl py-1.5 text-sm font-medium transition-all duration-200 {themeState.font ===
					'sans'
						? 'bg-stone-950 text-white dark:bg-white dark:text-stone-950'
						: 'text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-white/45 dark:hover:bg-white/8 dark:hover:text-white/80'}"
					style="font-family: Inter, system-ui, sans-serif"
					aria-pressed={themeState.font === 'sans'}
				>
					Aa
				</button>
			</div>
		</div>
	{/if}
</div>
