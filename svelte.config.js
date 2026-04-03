import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$content: 'src/content'
		}
	},
	extensions: ['.svelte']
};

export default config;
