# Project Information

## Framework
- **Svelte 5** - Using the latest version with runes ($state, $props, $effect, etc.)
- **SvelteKit** - For routing and server-side rendering
- **Tailwind CSS** - For styling

## Project Structure
- `src/routes/` - SvelteKit routes
- `src/lib/` - Reusable components and utilities
- `src/content/` - Story content and data
- `static/` - Static assets

## Key Features
- Children's story reader with markdown parsing
- Design picker with customizable themes and typography
- Responsive design with multiple reading modes

## Development Notes
- Uses Svelte 5 runes instead of legacy stores
- Components use `$props()` for prop destructuring
- State management with `$state()` and `$effect()`