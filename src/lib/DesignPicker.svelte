<script>
	import { browser } from '$app/environment';
	
	let { onDesignChange = () => {} } = $props();
	
	// Load saved design from cookies
	function loadSavedDesign() {
		if (browser) {
			const savedTheme = document.cookie
				.split('; ')
				.find(row => row.startsWith('story-theme='))
				?.split('=')[1];
			
			const savedFont = document.cookie
				.split('; ')
				.find(row => row.startsWith('story-font='))
				?.split('=')[1];
			
			return {
				theme: savedTheme || 'white',
				fontType: savedFont || 'serif'
			};
		}
		return { theme: 'white', fontType: 'serif' };
	}
	
	let design = $state(loadSavedDesign());

	const themes = {
		white: {
			name: 'White',
			bgColor: 'bg-white',
			textColor: 'text-gray-900',
			mutedColor: 'text-gray-600'
		},
		dark: {
			name: 'Dark', 
			bgColor: 'bg-gray-900',
			textColor: 'text-white',
			mutedColor: 'text-gray-300'
		},
		sepia: {
			name: 'Sepia',
			bgColor: 'bg-orange-50',
			textColor: 'text-orange-900',
			mutedColor: 'text-orange-700'
		}
	};

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
			document.cookie = `story-theme=${design.theme}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
			document.cookie = `story-font=${design.fontType}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
		}
	}
</script>

<div class="flex items-center gap-2">
	<!-- Color Theme Buttons -->
	<div class="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-lg p-1">
		{#each Object.entries(themes) as [key, theme]}
			<button
				on:click={() => updateTheme(key)}
				class="w-8 h-8 rounded {theme.bgColor} border-2 transition-all {design.theme === key ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300'}"
				title={theme.name}
			></button>
		{/each}
	</div>

	<!-- Font Type Buttons -->
	<div class="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-lg p-1">
		<button
			on:click={() => setFontType('serif')}
			class="w-8 h-8 flex items-center justify-center rounded font-serif text-lg transition-all {design.fontType === 'serif' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-800'}"
			title="Serif font"
		>
			A
		</button>
		<button
			on:click={() => setFontType('sans')}
			class="w-8 h-8 flex items-center justify-center rounded font-sans text-lg transition-all {design.fontType === 'sans' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-800'}"
			title="Sans-serif font"
		>
			A
		</button>
	</div>
</div>