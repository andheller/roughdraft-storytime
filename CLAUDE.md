# Project Information

## Framework

- **Svelte 5** - Using the latest version with runes ($state, $props, $effect, etc.)
- **SvelteKit** - For routing and server-side rendering
- **Tailwind CSS** - For styling
- **Vite** - Build tool with dynamic imports

## Project Structure

- `src/routes/` - SvelteKit routes (standardized to `/[seriesId]/[storyId]/` pattern)
- `src/lib/` - Reusable components and utilities
- `src/content/` - Story content and metadata
- `static/` - Static assets (covers, textures, etc.)

## Key Features

- Children's story reader with dynamic content loading
- Markdown-based chapters with live parsing
- Customizable themes and typography
- Responsive bookshelf interface
- Series and standalone story support

## Development Guidelines

### Component Patterns
- Use Svelte 5 runes: `$state()`, `$props()`, `$effect()`
- Components should be single-purpose and reusable
- Follow existing component patterns in `src/lib/`

### Routing
- All stories use `/[seriesId]/[storyId]/` pattern
- For standalone stories, seriesId equals storyId
- No other routing patterns should be used

### Content Management
- Stories are file-based in `src/content/books/`
- Use dynamic imports via `content-loader.js`
- See `/src/content/CLAUDE.md` for content-specific guidelines

### Styling
- Use Tailwind CSS utility classes
- Custom themes managed via `theme-manager.js`
- Maintain responsive design patterns

## Important Files

- `/src/lib/content-loader.js` - Dynamic content loading system
- `/src/lib/theme-manager.js` - Theme and typography management
- `/src/content/books/books.js` - Bookshelf display metadata
- `/ADDING_BOOKS.md` - Guide for adding new content

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linting
npm run format   # Format code with Prettier
```

## Deployment

- Configured for Cloudflare Pages deployment
- Uses `@sveltejs/adapter-cloudflare`
- Deploy command: `npm run cfdeploy`

## Notes

- Always maintain backwards compatibility with existing content
- Test responsive design on multiple screen sizes
- Ensure new features work with both series and standalone books
- Keep accessibility in mind (keyboard navigation, screen readers)
