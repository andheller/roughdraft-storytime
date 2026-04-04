import { browser } from '$app/environment';

const DEFAULT_PALETTE = 'daylight';
const DEFAULT_FONT = 'serif';

export const PALETTES = {
	paper: {
		id: 'paper',
		label: 'Paper',
		dark: false,
		swatch: '#d9c9a8'
	},
	daylight: {
		id: 'daylight',
		label: 'Daylight',
		dark: false,
		swatch: '#c4c0b8'
	},
	dusk: {
		id: 'dusk',
		label: 'Dusk',
		dark: false,
		swatch: '#e0a83c'
	},
	night: {
		id: 'night',
		label: 'Night',
		dark: true,
		swatch: '#2d4a6e'
	},
	midnight: {
		id: 'midnight',
		label: 'Midnight',
		dark: true,
		swatch: '#2a2a2c'
	}
};

const PALETTE_KEYS = new Set(Object.keys(PALETTES));
const FONT_OPTIONS = new Set(['serif', 'sans']);

function sanitizePalette(value) {
	return PALETTE_KEYS.has(value) ? value : DEFAULT_PALETTE;
}

function sanitizeFont(value) {
	return FONT_OPTIONS.has(value) ? value : DEFAULT_FONT;
}

class ThemeState {
	palette = $state(DEFAULT_PALETTE);
	font = $state(DEFAULT_FONT);

	constructor() {
		if (browser) {
			this.load();
		}
	}

	load() {
		const saved = localStorage.getItem('theme-settings');
		if (saved) {
			try {
				const settings = JSON.parse(saved);
				// Migrate from old appearance system
				let palette = settings.palette;
				if (!palette && settings.appearance) {
					palette = settings.appearance === 'dark' ? 'midnight' : DEFAULT_PALETTE;
				}
				this.palette = sanitizePalette(palette);
				this.font = sanitizeFont(settings.font);
			} catch (e) {
				console.error('Failed to parse theme settings', e);
			}
		}
		this.apply();
	}

	save() {
		if (browser) {
			localStorage.setItem(
				'theme-settings',
				JSON.stringify({ palette: this.palette, font: this.font })
			);
			this.apply();
		}
	}

	setPalette(val) {
		this.palette = sanitizePalette(val);
		this.save();
	}

	setFont(val) {
		this.font = sanitizeFont(val);
		this.save();
	}

	apply() {
		if (!browser) return;
		const root = document.documentElement;
		const paletteConfig = PALETTES[this.palette];

		// Set dark class for Tailwind dark: variants
		if (paletteConfig.dark) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}

		// Set data attribute for palette-specific CSS
		root.setAttribute('data-palette', this.palette);

		// Font
		if (this.font === 'serif') {
			root.style.setProperty('--font-family', '"Lora", Georgia, serif');
			root.classList.add('font-serif');
			root.classList.remove('font-sans');
		} else {
			root.style.setProperty('--font-family', '"Inter", system-ui, sans-serif');
			root.classList.add('font-sans');
			root.classList.remove('font-serif');
		}
	}
}

export const themeState = new ThemeState();
