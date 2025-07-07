// Enhanced book data with series support
export const series = {
	'silly-squirrels': {
		id: 'silly-squirrels',
		title: 'Silly Squirrels Series',
		description: 'Adventures of the silliest squirrels in the forest',
		author: 'Story Time',
		books: ['silly-squirrels', 'silly-squirrels-winter']
	}
};

// Enhanced book list with series references
export const bookList = [
	{
		id: 'silly-squirrels',
		title: 'The Silly Squirrels Adventure',
		author: 'Story Time',
		color: '#8B4513',
		leatherColor: 'hsl(25, 70%, 35%)',
		emoji: '🐿️',
		coverImage: '/covers/silly-squirrels.jpg',
		description:
			'A fun tale about three silly squirrels who discover the magic of friendship and teamwork.',
		storyId: 'silly-squirrels',
		height: 240,
		thickness: 55,
		tilt: -2,
		// New fields
		seriesId: 'silly-squirrels',
		bookNumber: 1,
		manuscriptPath: 'silly-squirrels/adventure',
		route: '/series/silly-squirrels/adventure'
	},
	{
		id: 'silly-squirrels-winter',
		title: 'Silly Squirrels: Winter Tales',
		author: 'Story Time',
		color: '#6B8E23',
		leatherColor: 'hsl(80, 60%, 40%)',
		emoji: '❄️',
		description: 'The squirrels face their biggest challenge yet: winter!',
		storyId: 'silly-squirrels-winter',
		height: 235,
		thickness: 52,
		tilt: -1,
		// New fields
		seriesId: 'silly-squirrels',
		bookNumber: 2,
		manuscriptPath: 'silly-squirrels/winter-tales',
		route: '/series/silly-squirrels/winter-tales'
	},
	{
		id: 'brave-bunny',
		title: 'The Brave Little Bunny',
		author: 'Adventure Tales',
		color: '#2F4F4F',
		leatherColor: 'hsl(180, 25%, 25%)',
		emoji: '🐰',
		description:
			'Follow a small bunny on a big adventure to save the meadow from a terrible storm.',
		storyId: 'brave-bunny',
		height: 220,
		thickness: 45,
		tilt: 1,
		// Standalone book
		manuscriptPath: 'standalone/brave-bunny',
		route: '/stories/brave-bunny'
	},
	// ... rest of your books
];

// Helper functions
export function getBook(id) {
	return bookList.find((book) => book.id === id);
}

export function getBooksBySeries(seriesId) {
	return bookList.filter((book) => book.seriesId === seriesId)
		.sort((a, b) => a.bookNumber - b.bookNumber);
}

export function getSeries(seriesId) {
	return series[seriesId];
}

export function getBookRoute(book) {
	return book.route || `/stories/${book.storyId}`;
}

export function getManuscriptPath(book) {
	return `/books/manuscripts/${book.manuscriptPath}`;
}