export const SITE_NAME = 'Roughdraft Storytime';
export const SITE_URL = 'https://roughdraftstorytime.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/optimized/logo-sign-640.webp`;
export const HOME_TITLE = `${SITE_NAME} | Kids Stories to Read Online`;
export const HOME_DESCRIPTION =
	'Read funny, adventurous, and historical stories for kids online at Roughdraft Storytime. Browse read-aloud friendly chapter books, featured picks, and family storytime favorites.';

export function absoluteUrl(path = '/') {
	return new URL(path, SITE_URL).toString();
}
