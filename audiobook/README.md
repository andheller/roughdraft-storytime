# Gemini Audiobook Workflow

This folder documents the repeatable text-to-speech process for turning story markdown into audiobook audio with Gemini 3.1 Flash TTS Preview.

## Secret Setup

The script reads `GEMINI_API_KEY` from `.env` or the shell. `.env` is already ignored by git.

```bash
GEMINI_API_KEY=...
```

## Commands

Plan a story before spending quota:

```bash
pnpm run audio:gemini -- plan silly-squirrels/the-silly-squirrels-library-book-rocket
```

Generate one chapter:

```bash
pnpm run audio:gemini -- generate silly-squirrels/the-silly-squirrels-library-book-rocket --chapter 1
```

Generate a whole story, stopping when the local daily request guardrail is reached:

```bash
pnpm run audio:gemini -- generate silly-squirrels/the-silly-squirrels-library-book-rocket --daily-request-budget 6
```

Outputs go to `static/audio/[seriesId]/[storyId]/` as `.wav` files plus `audio-manifest.json`, which the existing story reader can already discover after `pnpm run content:generate`.

## Free-Tier Guardrails

The current script defaults are intentionally conservative:

- `--min-delay-ms 22000` keeps requests below 3 RPM.
- `--daily-request-budget 10` stops before exceeding 10 RPD, based on local logged usage.
- `--daily-output-token-budget` is optional and normally left unset. The 10k token limit is a per-minute rate bucket, not a daily cap.
- `--max-seconds-per-request 220` is a conservative default from the first test pass. Because requests/day is the scarce quota, test larger values before a serious batch.

Audio output is estimated at 25 tokens per second. A 10k token minute is roughly 400 seconds, or about 6.5 minutes, of audio in a one-minute window. For this project, the 10 requests/day limit is usually the practical free-tier constraint, so use `plan` first and try larger `--max-seconds-per-request` values to see whether a chapter group or whole short story can fit in one stable request.

Local usage logs are written to `audiobook/usage/gemini-tts-YYYY-MM-DD.json`.

## Markdown Audio Tags

Use this XML-style directive in story markdown or narration override text:

```md
<tts tag="whispering" />"I think the library is listening."

<tts pause="short" />

<tts tag="excited" />Nutty pressed the big red button.
```

The web reader strips these directives before rendering. The Gemini workflow converts them into square-bracket performance tags like `[whispering]` and `[short pause]`.

Keep tags short and performable: `whispering`, `excited`, `calmly`, `dramatic pause`, `softly`, `with wonder`. Future sound effects can use the same source-of-truth idea with a separate directive, for example `<sfx name="page turn" />`, but the current script only sends narration to TTS.

## Recommended Loop

1. Run `plan` for the story.
2. Generate one chapter with a daily budget that matches remaining quota.
3. Listen in the site or directly from `static/audio/...`.
4. Add or adjust `<tts ... />` tags in the markdown or `narration/chapter-X.txt`.
5. Regenerate that chapter with `--force`.
6. Run `pnpm run content:generate` so the generated content index picks up the audio manifest.

## Sources

- [Gemini API speech generation guide](https://ai.google.dev/gemini-api/docs/speech-generation)
- [Gemini 3.1 Flash TTS Preview model page](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-tts-preview)
- [Gemini TTS prompting guide](https://aistudio.google.com/learn/gemini-tts-prompt-guide-with-tags)
