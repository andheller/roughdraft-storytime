import { browser } from '$app/environment';

// Default values
const DEFAULT_APPEARANCE = 'system';
const DEFAULT_FONT = 'serif';
const ACCENT_COLOR = '#2563eb';

const APPEARANCE_OPTIONS = new Set(['system', 'light', 'dark']);
const FONT_OPTIONS = new Set(['serif', 'sans']);

function sanitizeAppearance(value) {
	return APPEARANCE_OPTIONS.has(value) ? value : DEFAULT_APPEARANCE;
}

function sanitizeFont(value) {
	return FONT_OPTIONS.has(value) ? value : DEFAULT_FONT;
}

class ThemeState {
	appearance = $state(DEFAULT_APPEARANCE);
	font = $state(DEFAULT_FONT);

	constructor() {
		if (browser) {
			this.load();

			// Listen for system theme changes
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
				if (this.appearance === 'system') {
					this.apply();
				}
			});
		}
	}

	load() {
		const saved = localStorage.getItem('theme-settings');
		if (saved) {
			try {
				const settings = JSON.parse(saved);
				this.appearance = sanitizeAppearance(settings.appearance);
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
				JSON.stringify({
					appearance: this.appearance,
					font: this.font
				})
			);
			this.apply();
		}
	}

	setAppearance(val) {
		this.appearance = sanitizeAppearance(val);
		this.save();
	}

	setFont(val) {
		this.font = sanitizeFont(val);
		this.save();
	}

	apply() {
		if (!browser) return;

		const root = document.documentElement;

		// Handle appearance (light/dark/system)
		const isDark =
			this.appearance === 'dark' ||
			(this.appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

		if (isDark) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}

		// Accent is fixed to blue across the app.
		root.style.setProperty('--accent-color', ACCENT_COLOR);

		if (this.font === 'serif') {
			root.style.setProperty('--font-family', 'Georgia, serif');
			root.classList.add('font-serif');
			root.classList.remove('font-sans');
		} else {
			root.style.setProperty('--font-family', 'system-ui, sans-serif');
			root.classList.add('font-sans');
			root.classList.remove('font-serif');
		}
	}
}

export const themeState = new ThemeState();
