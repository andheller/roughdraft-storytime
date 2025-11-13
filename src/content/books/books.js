// Sample book data for the interactive bookshelf
export const bookList = [
	{
		id: 'silly-squirrels',
		title: 'The Great Acorn Hunt',
		author: 'Story Time',
		color: '#8B4513',
		leatherColor: 'hsl(25, 70%, 35%)',
		emoji: '🐿️',
		coverImage: '/covers/silly-squirrels.jpg',
		description:
			'A fun tale about a squirrel family - Mama, Papa, and Nutty - who discover the magic of teamwork.',
		seriesId: 'silly-squirrels',
		storyId: 'the-great-acorn-hunt',
		height: 240,
		thickness: 55,
		tilt: -2
	},
	{
		id: 'silly-squirrels-power-up',
		title: 'The Silly Squirrels Power Up!',
		author: 'Story Time',
		color: '#2E8B57',
		leatherColor: 'hsl(146, 50%, 36%)',
		emoji: '🚀',
		description:
			'Join Mama, Papa, and Nutty as they discover the amazing power of steam engines and learn how rockets and submarines work! A fun adventure full of science and silly jokes.',
		seriesId: 'silly-squirrels',
		storyId: 'the-silly-squirrels-power-up',
		height: 250,
		thickness: 60,
		tilt: 3
	},
	{
		id: 'silly-squirrels-sub-marine-adventure',
		title: 'The Silly Squirrels Sub-Marine Adventure',
		author: 'Story Time',
		color: '#4682B4',
		leatherColor: 'hsl(207, 44%, 49%)',
		emoji: '🚢',
		description:
			'Join Mama, Papa, and Nutty as they build submarine after submarine, each one better than the last, on their quest to find the legendary golden acorn hidden deep in the river!',
		seriesId: 'silly-squirrels',
		storyId: 'the-silly-squirrels-sub-marine-adventure',
		height: 255,
		thickness: 65,
		tilt: -1
	},
	{
		id: 'silly-squirrels-pizza-jetpack-delivery',
		title: 'The Silly Squirrels Pizza Jetpack Delivery Service',
		author: 'Claude',
		color: '#FF8C00',
		leatherColor: 'hsl(33, 100%, 50%)',
		emoji: '🍕',
		description:
			'When the town needs faster pizza delivery, Nutkin and friends build jetpacks from soda bottles and don goofy hats as helmets! Join their hilarious adventure as they learn to fly and deliver pizzas with water gun wake-up calls and plenty of crashes along the way!',
		seriesId: 'silly-squirrels',
		storyId: 'the-silly-squirrels-pizza-jetpack-delivery',
		height: 235,
		thickness: 50,
		tilt: 2
	},
	{
		id: 'silly-squirrels-space-adventure',
		title: 'The Silly Squirrels Space Adventure',
		author: 'Claude',
		color: '#8A2BE2',
		leatherColor: 'hsl(271, 76%, 53%)',
		emoji: '🚀',
		description:
			'Join Nutty, Mama, and Papa as they build a 4-stage rocket to solve Nutville\'s satellite problem and blast off on the most epic space adventure ever! But will their crash landing bring them back down to earth?',
		seriesId: 'silly-squirrels',
		storyId: 'the-silly-squirrels-space-adventure',
		height: 260,
		thickness: 68,
		tilt: -3
	},
	{
		id: 'silly-squirrels-backwards-tuesday',
		title: 'The Backwards Tuesday Machine',
		author: 'Claude',
		color: '#FF1493',
		leatherColor: 'hsl(328, 100%, 54%)',
		emoji: '⏰',
		description:
			'Pure chaos! When time starts running backwards in Nutville, Nutty and family build a machine with disco balls, jellybeans, and fizzy cola. Features: talking disco balls, time-traveling cows, and the most spectacular explosion ever!',
		seriesId: 'silly-squirrels',
		storyId: 'the-silly-squirrels-backwards-tuesday',
		height: 265,
		thickness: 70,
		tilt: 4
	},
	{
		id: 'professional-younger-sibling',
		title: 'The Professional Younger Sibling',
		author: 'Riley Thompson',
		color: '#FF6B6B',
		leatherColor: 'hsl(0, 79%, 72%)',
		emoji: '👶',
		description:
			'Riley has the best job in the world: being a professional younger sibling. But when older siblings stage a convention against her, she discovers there might be more to family life than getting away with things.',
		seriesId: 'the-professional-younger-sibling',
		storyId: 'the-professional-younger-sibling',
		height: 245,
		thickness: 58,
		tilt: 1
	}
];

// Helper function to get a book by ID
export function getBook(id) {
	return bookList.find((book) => book.id === id);
}

// Helper function to get all books
export function getAllBooks() {
	return bookList;
}

// Helper function to get books by author
export function getBooksByAuthor(author) {
	return bookList.filter((book) => book.author === author);
}
