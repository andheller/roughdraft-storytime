// Unified book data - everything is a "series" (series of 1 or more)
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
		// Series info (even standalone books have this)
		seriesTitle: 'Silly Squirrels Series',
		seriesPosition: 1,
		seriesTotal: 2,
		manuscriptPath: 'silly-squirrels/adventure'
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
		// Part of series
		seriesTitle: 'Silly Squirrels Series',
		seriesPosition: 2,
		seriesTotal: 2,
		manuscriptPath: 'silly-squirrels/winter-tales'
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
		// Standalone (series of 1)
		seriesTitle: 'The Brave Little Bunny',
		seriesPosition: 1,
		seriesTotal: 1,
		manuscriptPath: 'brave-bunny/book'
	},
	// ... rest of your books with similar structure
];

// Helper functions
export function getBook(id) {
	return bookList.find((book) => book.id === id);
}

export function getSeriesBooks(seriesTitle) {
	return bookList
		.filter((book) => book.seriesTitle === seriesTitle)
		.sort((a, b) => a.seriesPosition - b.seriesPosition);
}

export function getAllSeries() {
	// Group books by series
	const seriesMap = new Map();
	
	bookList.forEach(book => {
		if (!seriesMap.has(book.seriesTitle)) {
			seriesMap.set(book.seriesTitle, {
				title: book.seriesTitle,
				author: book.author,
				books: [],
				firstBookId: book.id
			});
		}
		seriesMap.get(book.seriesTitle).books.push(book);
	});
	
	return Array.from(seriesMap.values());
}

export function getBookRoute(book) {
	// All books use same route pattern
	return `/${book.storyId}`;
}

export function getSeriesRoute(seriesTitle) {
	// Get the first book in the series for the series page
	const firstBook = bookList.find(book => book.seriesTitle === seriesTitle);
	return `/series/${firstBook.storyId}`;
}

export function getManuscriptPath(book) {
	return `/books/manuscripts/${book.manuscriptPath}`;
}