# Guide To Adding Books

## Overview

Books are now file-based. You only author content under `src/content/books/`. The bookshelf and route data are generated automatically.

## Standalone Story

1. Create `src/content/books/[story-id]/`
2. Add `story.json`
3. Add chapter markdown files referenced by `story.json`
4. Optionally add `/static/covers/[story-id].jpg`
5. Optionally add `narration/*.txt` or `assets.json`
6. Optionally add `/static/audio/[story-id]/[story-id]/audio-manifest.json` if you have generated audio

Example:

```json
{
  "id": "the-brave-knight",
  "title": "The Brave Knight",
  "author": "Adventure Tales",
  "description": "A young knight learns what true bravery means.",
  "coverImage": "/covers/the-brave-knight.jpg",
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

## Series Story

1. Create `src/content/books/[series-id]/` if it does not exist
2. Add or update `series.json`
3. Create `src/content/books/[series-id]/[story-folder]/`
4. Add `story.json`
5. Add chapter markdown files referenced by `story.json`
6. Optionally add `/static/covers/[story-id].jpg`
7. Optionally add `narration/*.txt` or `assets.json`
8. Optionally add `/static/audio/[series-id]/[story-id]/audio-manifest.json` if you have generated audio

Example `series.json`:

```json
{
  "title": "Series Title",
  "description": "Series description",
  "stories": [
    {
      "id": "story-id",
      "title": "Story Title",
      "description": "Story description",
      "folder": "story-folder"
    }
  ]
}
```

## Notes

- There is no `books.js` step anymore.
- The content pipeline derives bookshelf styling and route metadata automatically.
- `story.json` chapter entries can point to any markdown filename, including things like `epilogue.md`.
- If you add or change content while the dev server is running, the generated manifest will be rebuilt automatically.
- You can also regenerate manually with `pnpm content:generate`.
