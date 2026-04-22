export const styleLanes = [
	{
		id: 'storybook-gouache',
		name: 'Storybook Gouache',
		tagline: 'Closest to the current scene art',
		description:
			'Warm painted fur, visible brush texture, soft rim light, and classic picture-book proportions.',
		promptNotes: [
			'hand-painted gouache and colored-pencil feel',
			"classic children's book illustration",
			'soft texture, readable silhouette, no text'
		],
		background: 'linear-gradient(135deg, rgba(255, 236, 201, 0.92), rgba(224, 123, 57, 0.28))'
	},
	{
		id: 'ink-wash',
		name: 'Ink + Wash',
		tagline: 'More graphic, still gentle',
		description:
			'Clean linework, flatter shapes, and watercolor wash blocks for stronger character readability.',
		promptNotes: [
			'expressive ink outlines',
			'watercolor wash fills',
			'storybook editorial style, transparent background'
		],
		background: 'linear-gradient(135deg, rgba(236, 244, 247, 0.95), rgba(87, 132, 151, 0.24))'
	},
	{
		id: 'cut-paper',
		name: 'Cut Paper',
		tagline: 'Bold shapes for strong reuse',
		description:
			'Layered paper edges, simplified facial features, and big color blocks that stay legible at small sizes.',
		promptNotes: [
			'layered cut-paper illustration',
			'big readable shapes',
			'minimal but expressive features, transparent background'
		],
		background: 'linear-gradient(135deg, rgba(253, 245, 225, 0.94), rgba(126, 185, 120, 0.25))'
	},
	{
		id: 'retro-animation',
		name: 'Retro Animation',
		tagline: 'Rounder and more character-sheet friendly',
		description:
			'Clean cel-like shading, confident outlines, and slightly exaggerated posing for reusable turnarounds.',
		promptNotes: [
			'2D animation model-sheet energy',
			'clean outlines and soft cel shading',
			'transparent background, full character pose'
		],
		background: 'linear-gradient(135deg, rgba(255, 238, 240, 0.94), rgba(145, 115, 204, 0.22))'
	}
];

export const nuttyStyleOptions = [
	{
		id: 'nutty-gouache-v2',
		name: 'Storybook Gouache',
		tagline: 'Painterly, closest to the scene-book direction',
		src: '/characters/silly-squirrels/nutty-options/nutty-gouache-v2.png'
	},
	{
		id: 'nutty-ink-wash-v2',
		name: 'Ink + Wash',
		tagline: 'Cleaner linework with lighter watercolor energy',
		src: '/characters/silly-squirrels/nutty-options/nutty-ink-wash-v2.png'
	},
	{
		id: 'nutty-cut-paper-v2',
		name: 'Cut Paper',
		tagline: 'Big graphic shapes and collage edges',
		src: '/characters/silly-squirrels/nutty-options/nutty-cut-paper-v2.png'
	},
	{
		id: 'nutty-retro-animation-v2',
		name: 'Retro Animation',
		tagline: 'Model-sheet friendly with strong silhouette clarity',
		src: '/characters/silly-squirrels/nutty-options/nutty-retro-animation-v2.png'
	},
	{
		id: 'nutty-mid-century-v2',
		name: 'Mid-Century Picture Book',
		tagline: 'Graphic and design-forward with vintage shape language',
		src: '/characters/silly-squirrels/nutty-options/nutty-mid-century-v2.png'
	},
	{
		id: 'nutty-colored-pencil-v2',
		name: 'Colored Pencil',
		tagline: 'Softer sketchbook finish with lighter mark-making',
		src: '/characters/silly-squirrels/nutty-options/nutty-colored-pencil-v2.png'
	}
];

export const characterCast = [
	{
		id: 'nutty',
		name: 'Nutty Nutwobble',
		role: 'Inventor lead',
		render: '/characters/silly-squirrels/nutty-v1.png',
		options: nuttyStyleOptions,
		vibe: 'Fast-brained squirrel kid who treats every inconvenience like a machine-shaped opportunity.',
		species: 'Young squirrel',
		lockedTraits: [
			'blue overalls',
			'aviator goggles on forehead',
			'eager grin and bright eyes',
			'compact builder pouch or notebook when useful'
		],
		reuseTargets: ['hero pose', 'thinking pose', 'running pose', 'pointing pose'],
		stories: [
			'Bouncy Bridge',
			'Ice Cream Catapult',
			'Pancake Parade',
			'Weather Wobble Machine',
			'Super Secure Snack Safe'
		],
		references: [
			{
				label: 'Bridge opening',
				src: '/story-art/silly-squirrels/the-silly-squirrels-bouncy-bridge/opening.webp'
			},
			{
				label: 'Ice cream opening',
				src: '/story-art/silly-squirrels/the-silly-squirrels-ice-cream-catapult/opening.webp'
			},
			{
				label: 'Weather chapter 2',
				src: '/story-art/silly-squirrels/the-silly-squirrels-weather-wobble-machine/chapter-2.png'
			}
		]
	},
	{
		id: 'mama',
		name: 'Mama Nutwobble',
		role: 'Speed specialist',
		render: '/characters/silly-squirrels/mama-nutwobble-v1.png',
		vibe: 'Athletic, delighted by chaos, and usually the first one willing to test a dangerous idea.',
		species: 'Adult squirrel',
		lockedTraits: [
			'lean runner silhouette',
			'quick energetic posture',
			'sporty scarf or fitted top',
			'confident smile rather than sternness'
		],
		reuseTargets: ['sprinter pose', 'jump pose', 'catching pose', 'hands-on-hips pose'],
		stories: ['Bouncy Bridge', 'Ice Cream Catapult', 'Weather Wobble Machine'],
		references: [
			{
				label: 'Bridge chapter 2',
				src: '/story-art/silly-squirrels/the-silly-squirrels-bouncy-bridge/chapter-2.png'
			},
			{
				label: 'Ice cream chapter 2',
				src: '/story-art/silly-squirrels/the-silly-squirrels-ice-cream-catapult/chapter-2.png'
			},
			{
				label: 'Weather chapter 3',
				src: '/story-art/silly-squirrels/the-silly-squirrels-weather-wobble-machine/chapter-3.png'
			}
		]
	},
	{
		id: 'papa',
		name: 'Papa Nutwobble',
		role: 'Snack logistics',
		render: '/characters/silly-squirrels/papa-nutwobble-v1.png',
		vibe: 'Soft, food-motivated, and emotionally committed to emergency preparedness.',
		species: 'Adult squirrel',
		lockedTraits: [
			'rounder build',
			'warm sweater or work shirt',
			'gentle expression',
			'snack crate, cone, or cookie tin often nearby'
		],
		reuseTargets: [
			'holding snack crate',
			'quality-control tasting pose',
			'surprised pose',
			'sleepy pose'
		],
		stories: ['Bouncy Bridge', 'Ice Cream Catapult', 'Pancake Parade', 'Super Secure Snack Safe'],
		references: [
			{
				label: 'Snack Safe opening',
				src: '/story-art/silly-squirrels/the-super-secure-snack-safe/opening.webp'
			},
			{
				label: 'Ice cream opening',
				src: '/story-art/silly-squirrels/the-silly-squirrels-ice-cream-catapult/opening.webp'
			},
			{
				label: 'Snack Safe chapter 4',
				src: '/story-art/silly-squirrels/the-super-secure-snack-safe/chapter-4.png'
			}
		]
	},
	{
		id: 'grandma',
		name: 'Grandma Nutwobble',
		role: 'Reality check',
		render: '/characters/silly-squirrels/grandma-nutwobble-v1.png',
		vibe: 'Practical, composed, and almost always the only one in the room who predicted the exact disaster.',
		species: 'Older squirrel',
		lockedTraits: [
			'practical dress or cardigan',
			'stern but not mean expression',
			'tool belt or cane when useful',
			'stillness and competence in the pose'
		],
		reuseTargets: [
			'arms-folded pose',
			'tool-belt pose',
			'catching-disaster pose',
			'approving nod pose'
		],
		stories: [
			'Bouncy Bridge',
			'Ice Cream Catapult',
			'Pancake Parade',
			'Weather Wobble Machine',
			'Super Secure Snack Safe'
		],
		references: [
			{
				label: 'Bridge opening',
				src: '/story-art/silly-squirrels/the-silly-squirrels-bouncy-bridge/opening.webp'
			},
			{
				label: 'Ice cream opening',
				src: '/story-art/silly-squirrels/the-silly-squirrels-ice-cream-catapult/opening.webp'
			},
			{
				label: 'Snack Safe chapter 5',
				src: '/story-art/silly-squirrels/the-super-secure-snack-safe/chapter-5.png'
			}
		]
	},
	{
		id: 'tony',
		name: 'Tony the Delivery Fox',
		role: 'Townside utility character',
		render: '/characters/silly-squirrels/tony-the-delivery-fox-v1.png',
		vibe: 'Helpful, overbooked, and perpetually one bad invention away from airborne cargo.',
		species: 'Fox',
		lockedTraits: [
			'orange fox with messenger energy',
			'delivery satchel or cart harness',
			'alert but agreeable face',
			'leaner body shape than the squirrels'
		],
		reuseTargets: [
			'cart-pulling pose',
			'clipboard pose',
			'catcher glove pose',
			'running delivery pose'
		],
		stories: ['Bouncy Bridge', 'Ice Cream Catapult', 'Pancake Parade', 'Weather Wobble Machine'],
		references: [
			{
				label: 'Bridge chapter 3',
				src: '/story-art/silly-squirrels/the-silly-squirrels-bouncy-bridge/chapter-3.png'
			},
			{
				label: 'Ice cream chapter 3',
				src: '/story-art/silly-squirrels/the-silly-squirrels-ice-cream-catapult/chapter-3.png'
			},
			{
				label: 'Weather chapter 4',
				src: '/story-art/silly-squirrels/the-silly-squirrels-weather-wobble-machine/chapter-4.png'
			}
		]
	},
	{
		id: 'mayor',
		name: 'Mayor Buttersworth',
		role: 'Ceremonial chaos magnet',
		render: '/characters/silly-squirrels/mayor-buttersworth-v1.png',
		vibe: 'Very official, very flustered, and somehow always standing exactly where the accident lands.',
		species: 'Owl',
		lockedTraits: [
			'owl shape with mayor hat',
			'formal sash or bow tie',
			'concerned round-eyed expression',
			'compact dignified stance'
		],
		reuseTargets: ['announcement pose', 'flustered pose', 'hat-grab pose', 'ribbon pose'],
		stories: ['Bouncy Bridge', 'Ice Cream Catapult', 'Pancake Parade', 'Weather Wobble Machine'],
		references: [
			{
				label: 'Bridge opening',
				src: '/story-art/silly-squirrels/the-silly-squirrels-bouncy-bridge/opening.webp'
			},
			{
				label: 'Pancake chapter 3',
				src: '/story-art/silly-squirrels/the-silly-squirrels-pancake-parade/chapter-3.png'
			},
			{
				label: 'Weather chapter 2',
				src: '/story-art/silly-squirrels/the-silly-squirrels-weather-wobble-machine/chapter-2.png'
			}
		]
	},
	{
		id: 'mrs-hedgehog',
		name: 'Mrs. Hedgehog',
		role: 'Clipboard skeptic',
		render: '/characters/silly-squirrels/mrs-hedgehog-v1.png',
		vibe: 'Orderly, dry, and permanently ready to document how an experiment failed.',
		species: 'Hedgehog',
		lockedTraits: [
			'hedgehog silhouette with apron or sensible dress',
			'clipboard or basket',
			'measured posture',
			'glasses optional but useful'
		],
		reuseTargets: ['clipboard pose', 'arms-folded pose', 'market basket pose', 'side-eye pose'],
		stories: ['Bouncy Bridge', 'Weather Wobble Machine', 'Super Secure Snack Safe'],
		references: [
			{
				label: 'Bridge opening',
				src: '/story-art/silly-squirrels/the-silly-squirrels-bouncy-bridge/opening.webp'
			},
			{
				label: 'Weather chapter 2',
				src: '/story-art/silly-squirrels/the-silly-squirrels-weather-wobble-machine/chapter-2.png'
			},
			{
				label: 'Snack Safe chapter 3',
				src: '/story-art/silly-squirrels/the-super-secure-snack-safe/chapter-3.png'
			}
		]
	}
];

export const generationWorkflow = [
	{
		title: 'Lock one anchor image',
		description:
			'Pick the best existing scene image per character, then use it as the visual reference input for every new render.'
	},
	{
		title: 'Render transparent character sheets',
		description:
			'Generate full-body character art on transparent background in 3-4 style lanes before choosing a final lane.'
	},
	{
		title: 'Freeze reusable prompts',
		description:
			'Once a lane wins, keep the locked traits, pose language, and anchor inputs stable for future scene art.'
	}
];
