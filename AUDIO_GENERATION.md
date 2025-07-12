# Audio Generation with ElevenLabs

This project includes an audio generation system using ElevenLabs API to create narrated versions of stories.

## Setup

1. **Get ElevenLabs API Key**
   - Sign up at [ElevenLabs](https://elevenlabs.io/)
   - Copy your API key from the dashboard

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your API key:
   # ELEVENLABS_API_KEY=your_api_key_here
   ```

3. **Install Dependencies**
   ```bash
   pnpm install
   ```

## Usage

### Generate Audio for a Story

```bash
# Generate audio for a specific story
pnpm run audio:generate silly-squirrels/the-great-acorn-hunt

# Generate audio for a single chapter
pnpm run audio:generate silly-squirrels/the-great-acorn-hunt --chapter 1

# Generate audio for all stories
pnpm run audio:generate --all

# Force regeneration of existing files
pnpm run audio:generate silly-squirrels/the-great-acorn-hunt --force
```

### Check Audio Status

```bash
# See which stories have audio available
pnpm run audio:check
```

### Clean Up Audio Files

```bash
# Remove audio files for a specific story
pnpm run audio:clean silly-squirrels/the-great-acorn-hunt

# Remove all audio files
pnpm run audio:clean
```

## Configuration

Edit `audio.config.json` to customize:

- **Voice**: Choose from available ElevenLabs voices
- **Quality**: Set output format and bitrate
- **Voice Settings**: Adjust stability, similarity, and style

### Available Voices

- **Rachel**: Warm, friendly female voice (default)
- **Josh**: Clear, energetic male voice
- **Bella**: Gentle, soothing female voice
- **Antoni**: Expressive male voice with character variations

## File Structure

Generated audio files are stored in:
```
static/audio/
├── [seriesId]/
│   ├── [storyId]/
│   │   ├── chapter-1.mp3
│   │   ├── chapter-2.mp3
│   │   ├── ...
│   │   └── audio-manifest.json
```

## Audio Player Integration

The audio player is automatically integrated into the StoryReader component when audio files are available:

- **Play/Pause**: Control audio playback
- **Progress Bar**: Seek to specific positions
- **Speed Control**: Adjust playback speed (0.75x, 1x, 1.5x)
- **Chapter Navigation**: Auto-advance to next chapter
- **Manual Navigation**: Previous/Next chapter buttons

## Development vs Production

- **Development**: Uses lower quality settings for faster generation
- **Production**: Uses higher quality settings for better audio

Set `AUDIO_QUALITY_PROFILE=production` in your `.env` for production builds.

## Cost Considerations

ElevenLabs charges based on character count. A typical chapter (1000-1500 words) costs approximately:
- **Development quality**: ~$0.22
- **Production quality**: ~$0.33

Monitor your usage in the ElevenLabs dashboard.

## Troubleshooting

### Common Issues

1. **"API key not found"**
   - Ensure `ELEVENLABS_API_KEY` is set in your `.env` file

2. **"Voice not found"**
   - Check available voices in your ElevenLabs account
   - Update `audio.config.json` with valid voice names

3. **"Rate limit exceeded"**
   - The script includes automatic delays between requests
   - For large batches, consider running smaller chunks

4. **Audio not playing**
   - Check that files exist in `static/audio/`
   - Verify the audio manifest is correctly generated
   - Check browser console for errors

### Debug Mode

Add `DEBUG=true` to your environment for verbose logging:

```bash
DEBUG=true pnpm run audio:generate story-id
```

## Best Practices

1. **Test with single chapters first** before generating full stories
2. **Use development quality** for testing, production for final builds
3. **Monitor API usage** to avoid unexpected charges
4. **Keep audio manifests** in version control for deployment
5. **Consider voice consistency** across series/characters

## Deployment

Audio files are static assets and should be deployed with your site:

1. Generate audio files locally or in CI/CD
2. Commit audio manifests to version control
3. Deploy audio files to your static hosting
4. Audio player will automatically detect available files

## Future Enhancements

- Multiple voice support for different characters
- Bulk voice assignment based on story metadata
- Audio waveform visualization
- Bookmark/resume functionality
- Offline audio caching