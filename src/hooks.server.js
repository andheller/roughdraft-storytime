import { dev } from '$app/environment';

export async function handle({ event, resolve }) {
	const response = await resolve(event);

	if (!dev) {
		return response;
	}

	const contentType = response.headers.get('content-type') || '';

	if (contentType.includes('text/html')) {
		response.headers.set('cache-control', 'no-store, no-cache, must-revalidate, max-age=0');
		response.headers.set('pragma', 'no-cache');
		response.headers.set('expires', '0');
	}

	return response;
}
