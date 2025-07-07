export async function load({ cookies }) {
	// For prerendering: always return defaults
	// Actual theme will be set client-side after hydration
	const theme = 'white'; // Default for prerendered pages
	const fontType = 'serif'; // Default for prerendered pages

	return {
		theme: {
			theme,
			fontType
		}
	};
}