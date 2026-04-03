<script>
	import { browser } from '$app/environment';

	let { onDesignChange = () => {} } = $props();

	function loadSavedDesign() {
		if (browser) {
			const savedTheme = document.cookie
				.split('; ')
				.find((row) => row.startsWith('story-theme='))
				?.split('=')[1];
			const savedFont = document.cookie
				.split('; ')
				.find((row) => row.startsWith('story-font='))
				?.split('=')[1];
			return { theme: savedTheme || 'white', fontType: savedFont || 'serif' };
		}
		return { theme: 'white', fontType: 'serif' };
	}

	let design = $state(loadSavedDesign());

	const pillStyle = $derived(
		design.theme === 'dark'
			? {
					pill: 'border-white/10 bg-white/5',
					active: 'bg-white/15 text-white',
					inactive: 'text-white/35 hover:text-white/60'
				}
			: design.theme === 'sepia'
				? {
						pill: 'border-orange-300/50 bg-orange-100/50',
						active: 'bg-white/80 text-orange-900 shadow-sm',
						inactive: 'text-orange-400/70 hover:text-orange-700'
					}
				: {
						pill: 'border-stone-200 bg-stone-100/60',
						active: 'bg-white text-stone-900 shadow-sm',
						inactive: 'text-stone-400 hover:text-stone-600'
					}
	);

	$effect(() => {
		onDesignChange(design);
	});

	function updateTheme(theme) {
		design = { ...design, theme };
		saveToCookies();
	}

	function setFontType(fontType) {
		design = { ...design, fontType };
		saveToCookies();
	}

	function saveToCookies() {
		if (browser) {
			document.cookie = `story-theme=${design.theme}; path=/; max-age=${60 * 60 * 24 * 365}`;
			document.cookie = `story-font=${design.fontType}; path=/; max-age=${60 * 60 * 24 * 365}`;
		}
	}
</script>

<div class="flex items-center gap-2">
	<!-- Theme pill -->
	<div class="inline-flex items-center gap-0.5 rounded-full border p-1 {pillStyle.pill}">
		<button
			type="button"
			onclick={() => updateTheme('white')}
			class="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors {design.theme === 'white' ? pillStyle.active : pillStyle.inactive}"
			aria-label="Light theme"
			aria-pressed={design.theme === 'white'}
		>
			<!-- Sun -->
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
			</svg>
		</button>
		<button
			type="button"
			onclick={() => updateTheme('sepia')}
			class="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors {design.theme === 'sepia' ? pillStyle.active : pillStyle.inactive}"
			aria-label="Sepia theme"
			aria-pressed={design.theme === 'sepia'}
		>
			<!-- Sunrise -->
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 4v2M5.64 6.64l1.41 1.41M18.36 6.64l-1.41 1.41M3 13h2M19 13h2" />
				<path d="M8 13a4 4 0 0 1 8 0" />
				<line x1="3" y1="17" x2="21" y2="17" />
			</svg>
		</button>
		<button
			type="button"
			onclick={() => updateTheme('dark')}
			class="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors {design.theme === 'dark' ? pillStyle.active : pillStyle.inactive}"
			aria-label="Dark theme"
			aria-pressed={design.theme === 'dark'}
		>
			<!-- Moon -->
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</svg>
		</button>
	</div>

	<!-- Font pill -->
	<div class="inline-flex items-center gap-0.5 rounded-full border p-1 {pillStyle.pill}">
		<button
			type="button"
			onclick={() => setFontType('serif')}
			class="inline-flex h-7 items-center justify-center rounded-full px-2.5 text-sm font-medium transition-colors {design.fontType === 'serif' ? pillStyle.active : pillStyle.inactive}"
			style="font-family: Georgia, serif;"
			aria-label="Serif font"
			aria-pressed={design.fontType === 'serif'}
		>
			Aa
		</button>
		<button
			type="button"
			onclick={() => setFontType('sans')}
			class="inline-flex h-7 items-center justify-center rounded-full px-2.5 text-sm font-medium transition-colors {design.fontType === 'sans' ? pillStyle.active : pillStyle.inactive}"
			style="font-family: system-ui, sans-serif;"
			aria-label="Sans-serif font"
			aria-pressed={design.fontType === 'sans'}
		>
			Aa
		</button>
	</div>
</div>
