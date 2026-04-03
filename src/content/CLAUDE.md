# Content Management Guide

## Canonical Source

`/src/content/books` is now the only authored content source.

- Write series metadata in `series.json`
- Write story metadata in `story.json`
- Write chapter content in markdown files referenced by `story.json`
- Optional per-story extras:
  - `narration/*.txt`
  - `assets.json`
  - `assets/`
- Optional audio manifests live under `/static/audio/[series-id]/[story-id]/audio-manifest.json`

The app does not use a hand-maintained `books.js` anymore. Bookshelf data, routes, and story manifests are generated from the content tree.

## Directory Shapes

Series:

```text
src/content/books/[series-id]/
  series.json
  [story-id]/
    story.json
    chapter-1.md
    chapter-2.md
    narration/
    assets.json
    assets/
```

Standalone story:

```text
src/content/books/[story-id]/
  story.json
  chapter-1.md
  chapter-2.md
  narration/
  assets.json
  assets/
```

## Required Files

### `story.json`

```json
{
  "id": "optional-for-standalone-stories",
  "title": "Story Title",
  "author": "Author Name",
  "description": "Story description",
  "coverImage": "/covers/story-id.jpg",
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

`file` may point to any markdown filename, not just `chapter-<n>.md`.

### `series.json`

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

## Generated Outputs

The content pipeline writes:

- `/src/lib/generated/content-index.js`
- `/src/lib/generated/stories/*.js`

That manifest contains:

- normalized series metadata
- normalized story metadata
- full chapter markdown content
- optional narration payloads
- optional audio payloads
- derived bookshelf metadata
- prerender route entries

The generator runs automatically in `vite dev` and `vite build`. Manual generation is available with `pnpm content:generate`.

## Notes

- Cover images are optional. If `coverImage` points at a missing file under `/static`, it will be ignored.
- Narration is first-class content, but normal reader builds can ignore it unless a target needs it.
- Future publishing/export targets should derive from the generated manifest, not from separate handwritten metadata.
