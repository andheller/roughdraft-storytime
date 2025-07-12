# Content Management Guide

## Overview

This directory contains all story content for the Roughdraft Storytime application. Content is organized in a file-based structure that supports both standalone stories and story series.

## Directory Structure

```
/src/content/
├── books/
│   ├── books.js                          # Bookshelf display metadata
│   ├── [series-id]/                      # Series folder
│   │   ├── series.json                   # Series metadata
│   │   └── [story-id]/                   # Story folder
│   │       ├── story.json                # Story metadata
│   │       ├── chapter-1.md              # Chapter content
│   │       ├── chapter-2.md
│   │       └── ...
│   └── [standalone-story-id]/            # Standalone story folder
│       ├── story.json                    # Story metadata
│       ├── chapter-1.md                  # Chapter content
│       └── ...
└── stories/
    └── index.js                          # Legacy file (to be removed)
```

## Content Types

### 1. Series Stories
Stories that are part of a collection (e.g., "Silly Squirrels" series)

### 2. Standalone Stories
Individual stories not part of a series (e.g., "The Professional Younger Sibling")

## Required Files

### books.js
Controls how books appear on the bookshelf. Each book needs an entry:

```javascript
{
  id: 'unique-id',                    // Unique identifier
  title: 'Book Title',                // Display title
  author: 'Author Name',              // Author
  leatherColor: 'hsl(25, 70%, 35%)', // Book spine color
  emoji: '📚',                        // Optional emoji
  coverImage: '/covers/book.jpg',     // Optional cover (ONLY if image exists)
  description: 'Book description',    // Short description
  seriesId: 'series-id',             // Series ID (or same as id)
  storyId: 'story-id',               // Story ID (or same as id)
  height: 240,                       // Visual height
  thickness: 55,                     // Visual thickness
  tilt: -2                          // Visual tilt angle
}
```

**IMPORTANT**: Do NOT include coverImage field if no actual image exists. Only add coverImage when a real image file is present in `/static/covers/`.

### story.json
Story metadata and chapter listing:

```json
{
  "title": "Story Title",
  "author": "Author Name",
  "description": "Story description",
  "coverImage": "/covers/story.jpg",
  "ageRange": "5-8",
  "genre": "Adventure",
  "tags": ["adventure", "friendship"],
  "chapters": [
    {
      "id": 1,
      "title": "Chapter Title",
      "file": "chapter-1.md"
    }
  ]
}
```

### series.json
Required only for series:

```json
{
  "title": "Series Title",
  "description": "Series description",
  "stories": [
    {
      "id": "story-id",
      "title": "Story Title",
      "description": "Story description",
      "folder": "story-folder-name"
    }
  ]
}
```

## Chapter Format

Chapters are written in Markdown:

```markdown
# Chapter Title

Story content begins here...

**Bold text** for emphasis.
*Italic text* for thoughts.

## Section Heading

More content...

> "Dialogue can be in quotes"

- Lists are supported
- For various uses
```

## Adding New Content

### Quick Checklist

1. ✅ Create folder structure
2. ✅ Add story.json (and series.json if needed)
3. ✅ Add chapter markdown files
4. ✅ Update books.js
5. ✅ Add cover image to /static/covers/ (optional)

### Naming Conventions

- **Folder names**: Use kebab-case (e.g., `the-great-adventure`)
- **File names**: `chapter-1.md`, `chapter-2.md`, etc.
- **IDs**: Must be unique, use kebab-case
- **Cover images**: Match the story ID (e.g., `story-id.jpg`)

## Content Guidelines

### Writing Style
- Age-appropriate language
- Clear, engaging narrative
- Short paragraphs for readability
- Use markdown formatting sparingly

### Chapter Length
- Aim for 500-1500 words per chapter
- Break longer content into multiple chapters
- Each chapter should have a clear beginning and end

### Metadata Best Practices
- Accurate age ranges help parents choose appropriate content
- Use descriptive tags for searchability
- Keep descriptions concise but informative
- Always include author attribution

## Dynamic Loading

The system uses `import.meta.glob()` to automatically discover content:
- No manual imports needed
- Just add files following the structure
- Content loads on-demand for performance

## Important Notes

1. **File paths are case-sensitive** - Be consistent
2. **Chapter files must match story.json references** exactly
3. **Test locally** before deploying new content
4. **Backup content** before major changes
5. **Follow existing patterns** for consistency

## Troubleshooting

### Book doesn't appear on shelf
- Check books.js entry
- Verify seriesId and storyId match folder structure
- Ensure all required fields are present

### Chapters not loading
- Verify file names match story.json
- Check for typos in file paths
- Ensure markdown files are valid

### Images not showing
- Place images in /static/covers/
- Use absolute paths starting with /
- Check file extensions (.jpg, .png)

## Future Improvements

- Audio narration support
- Interactive elements
- Reading progress tracking
- Multi-language support

For technical implementation details, see `/src/lib/content-loader.js`