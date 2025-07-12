# Guide to Adding New Books

## Overview
With the new dynamic content loading system, adding books is now a simple file-based process. No code changes needed!

## Two Types of Books

### 1. Standalone Book (like "The Professional Younger Sibling")
A single story not part of a series.

### 2. Series Book (like "Silly Squirrels")
Multiple stories under one series.

## Step-by-Step Guide

### Adding a Standalone Book

1. **Create the book folder**
   ```
   src/content/books/[book-id]/
   ```

2. **Add story.json**
   ```json
   {
     "id": "book-id",
     "title": "Book Title",
     "author": "Author Name",
     "description": "Book description...",
     "coverImage": "/covers/book-id.jpg",
     "ageRange": "5-8",
     "genre": "Adventure",
     "tags": ["adventure", "friendship"],
     "chapters": [
       {
         "id": 1,
         "title": "Chapter One Title",
         "file": "chapter-1.md"
       },
       {
         "id": 2,
         "title": "Chapter Two Title",
         "file": "chapter-2.md"
       }
     ]
   }
   ```

3. **Add chapter files**
   - `chapter-1.md`
   - `chapter-2.md`
   - etc.

4. **Update books.js for the bookshelf display**
   ```javascript
   {
     id: 'book-id',
     title: 'Book Title',
     author: 'Author Name',
     color: '#HEX_COLOR',
     leatherColor: 'hsl(hue, saturation%, lightness%)',
     emoji: '📚',
     coverImage: '/covers/book-id.jpg',
     description: 'Book description...',
     seriesId: 'book-id',  // Same as book ID for standalone
     storyId: 'book-id',   // Same as book ID for standalone
     height: 240,
     thickness: 55,
     tilt: -2
   }
   ```

5. **Add cover image** (optional)
   Place in: `static/covers/book-id.jpg`

### Adding a Series Book

1. **Create series folder (if new series)**
   ```
   src/content/books/[series-id]/
   ```

2. **Add series.json (if new series)**
   ```json
   {
     "title": "Series Title",
     "description": "Series description...",
     "stories": [
       {
         "id": "story-id",
         "title": "Story Title",
         "description": "Story description...",
         "folder": "story-folder-name"
       }
     ]
   }
   ```

3. **Create story folder**
   ```
   src/content/books/[series-id]/[story-folder]/
   ```

4. **Add story.json**
   ```json
   {
     "title": "Story Title",
     "author": "Author Name",
     "description": "Story description...",
     "coverImage": "/covers/story-id.jpg",
     "ageRange": "5-8",
     "genre": "Adventure",
     "tags": ["adventure", "series"],
     "chapters": [
       {
         "id": 1,
         "title": "Chapter One Title",
         "file": "chapter-1.md"
       }
     ]
   }
   ```

5. **Add chapter files**
   Same as standalone books

6. **Update books.js**
   ```javascript
   {
     id: 'unique-book-id',
     title: 'Story Title',
     author: 'Author Name',
     color: '#HEX_COLOR',
     leatherColor: 'hsl(hue, saturation%, lightness%)',
     emoji: '📚',
     coverImage: '/covers/story-id.jpg',
     description: 'Story description...',
     seriesId: 'series-id',
     storyId: 'story-id',
     height: 240,
     thickness: 55,
     tilt: -2
   }
   ```

## Chapter Markdown Format

Each chapter should be a markdown file with this structure:

```markdown
# Chapter Title

Chapter content goes here...

You can use **bold**, *italic*, and other markdown features.

## Section headings work too

- Lists
- Are supported

> Quotes can be used for emphasis
```

## Required Fields Summary

### For books.js entry:
- `id` - Unique identifier for the book
- `title` - Book title
- `author` - Author name
- `leatherColor` - Book spine color (HSL format)
- `description` - Book description
- `seriesId` - Series ID (use book ID for standalone)
- `storyId` - Story ID (use book ID for standalone)

### For story.json:
- `title` - Story title
- `description` - Story description
- `chapters` - Array of chapter objects

### For series.json:
- `title` - Series title
- `description` - Series description
- `stories` - Array of story references

## Color Guidelines

For book spine colors (`leatherColor`), use HSL format:
- `hsl(0, 79%, 72%)` - Red
- `hsl(25, 70%, 35%)` - Brown
- `hsl(120, 61%, 34%)` - Green
- `hsl(207, 44%, 49%)` - Blue
- `hsl(275, 100%, 25%)` - Purple

## Example: Adding "The Brave Knight"

1. Create folder: `src/content/books/the-brave-knight/`

2. Add `story.json`:
   ```json
   {
     "id": "the-brave-knight",
     "title": "The Brave Knight",
     "author": "Adventure Tales",
     "description": "A young knight learns what true bravery means.",
     "coverImage": "/covers/brave-knight.jpg",
     "ageRange": "6-10",
     "genre": "Fantasy",
     "tags": ["knights", "bravery", "adventure"],
     "chapters": [
       {
         "id": 1,
         "title": "The Call to Adventure",
         "file": "chapter-1.md"
       },
       {
         "id": 2,
         "title": "The Dragon's Cave",
         "file": "chapter-2.md"
       }
     ]
   }
   ```

3. Add chapters:
   - `chapter-1.md`
   - `chapter-2.md`

4. Update `books.js`:
   ```javascript
   {
     id: 'the-brave-knight',
     title: 'The Brave Knight',
     author: 'Adventure Tales',
     color: '#4B0082',
     leatherColor: 'hsl(275, 100%, 25%)',
     emoji: '⚔️',
     coverImage: '/covers/brave-knight.jpg',
     description: 'A young knight learns what true bravery means.',
     seriesId: 'the-brave-knight',
     storyId: 'the-brave-knight',
     height: 245,
     thickness: 52,
     tilt: 1
   }
   ```

5. Add cover image: `static/covers/brave-knight.jpg`

That's it! The book will automatically appear on the bookshelf and be fully functional.