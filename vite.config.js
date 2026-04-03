import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { contentPipelinePlugin } from './scripts/content-pipeline.js';

export default defineConfig({
	plugins: [contentPipelinePlugin(), tailwindcss(), sveltekit()]
});
