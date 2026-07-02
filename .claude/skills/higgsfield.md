---
title: Higgsfield AI - Creative Asset Generation
tags:
  - "system"
type: skill
status: active
created: 2026-04-02
updated: 2026-06-11
name: higgsfield
description: "Generate AI image/video prompts for the Higgsfield web app, or use the CLI API for quick iterations. Primary workflow is prompt generation - Claude crafts well-engineered prompts, the owner pastes them into cloud.higgsfield.ai for best quality. Also supports CLI for Soul (text-to-image), DoP (image-to-video), Speak (speech-to-video), Flux Pro Kontext, Seedream, Kling, Seedance, character consistency (Soul ID), styles, and more. Use when the owner says 'generate image', 'generate video', 'Higgsfield', 'Soul model', 'create a prompt', 'image prompt', 'DoP video', 'image to video', 'AI video', 'create character', 'creative asset', 'website video', 'hero video', 'cinematic video', or any request involving visual/video asset creation. OPTIONAL MODULE - requires a Higgsfield account; CLI use requires API keys in the root .env."
---

# Higgsfield AI - Creative Asset Generation

> **OPTIONAL MODULE.** Requires a Higgsfield account (cloud.higgsfield.ai). The prompt-generation workflow works with just an account; the CLI workflow additionally needs `HF_API_KEY` and `HF_API_SECRET` in the root `.env`. Skip this skill entirely if the owner doesn't use Higgsfield.

You are a creative director who generates Higgsfield prompts for the owner. Your PRIMARY workflow is crafting well-engineered prompts that the owner pastes into the Higgsfield web app. The CLI API is available for quick iterations but historically produces lower quality.

## CRITICAL: Web App > API

**The Higgsfield web app has consistently produced significantly higher quality than the API** (the API appears to lag on model versions - re-verify periodically). For any image that matters (hero shots, portraits, brand assets), generate a PROMPT for the owner to paste into the web app - do NOT use the CLI.

**Prompt-generation workflow:**
1. Read the owner's character prompting guide at `assets/higgsfield/` (created when the owner trains their Soul ID - see Character Consistency below)
2. Generate a prompt specifying: **model**, **preset** (if Soul), **size**, **enhance prompt: OFF**
3. Present the prompt in a copy-paste-ready code block
4. Iterate based on the owner's feedback from the web app results

**When to use the CLI API instead:**
- Quick test iterations where quality doesn't matter
- Batch generation for mood boarding
- Video generation (DoP, Kling) where the CLI is adequate
- Character training (Soul ID creation)

## CLI Tool

The CLI lives wherever the module was installed (default: `tools/higgsfield/higgsfield-cli.mjs`). It requires `HF_API_KEY` and `HF_API_SECRET` environment variables.

```
node tools/higgsfield/higgsfield-cli.mjs <command> [options]
```

## Available Commands

### Image Generation

#### Soul (Higgsfield's flagship image model)
```bash
node tools/higgsfield/higgsfield-cli.mjs soul-image \
  --prompt "A luxury villa overlooking the Mediterranean at golden hour, architectural photography" \
  --size 2048x1152 \
  --quality 1080p \
  --batch 1 \
  --enhance-prompt false
```

**Soul Image Options:**
| Option | Values | Default | Notes |
|--------|--------|---------|-------|
| `--prompt` | text | required | Describe the image |
| `--size` | See sizes below | 1536x1536 | Width x Height |
| `--quality` | `720p`, `1080p` | 1080p | Resolution tier |
| `--batch` | `1`, `4` | 1 | Number of images |
| `--style` | UUID | none | From `styles` command |
| `--style-strength` | 0.0-1.0 | 1.0 | How strongly to apply style |
| `--character-id` | UUID | none | Soul ID for character consistency |
| `--character-strength` | 0.0-1.0 | 0.8 | Character likeness strength |
| `--reference-image` | path or URL | none | Reference image for guidance |
| `--enhance-prompt` | true/false | false | AI prompt enhancement |
| `--seed` | 0-1000000 | random | Reproducibility seed |

**Available Sizes:**
- **Landscape:** 2048x1152, 2048x1536, 2016x1344, 1696x960, 1632x1088
- **Portrait:** 1152x2048, 1536x2048, 1344x2016, 960x1696, 1088x1632
- **Square:** 1536x1536
- **Mixed:** 1536x1152, 1152x1536

#### Flux Pro Kontext Max
```bash
node tools/higgsfield/higgsfield-cli.mjs flux-image \
  --prompt "Modern penthouse apartment with city skyline view" \
  --aspect-ratio 16:9
```

#### ByteDance Seedream
```bash
node tools/higgsfield/higgsfield-cli.mjs seedream-image \
  --prompt "Tropical beachfront property at sunset" \
  --aspect-ratio 16:9
```

### Video Generation

#### DoP (Director of Photography) - Image-to-Video
```bash
node tools/higgsfield/higgsfield-cli.mjs dop-video \
  --prompt "Slow cinematic dolly forward through the entrance, revealing the interior" \
  --image ./start-frame.jpg \
  --model dop-standard \
  --motion <motion-uuid> \
  --motion-strength 0.7
```

**DoP Models:**
| Model | Quality | Speed | Credits |
|-------|---------|-------|---------|
| `dop-lite` | Good | Fast | 2 |
| `dop-turbo` | Better | Medium (2x faster) | 6.5 |
| `dop-standard` | Best | Standard | 9 |

**Start + End Frame (transition video):**
```bash
node tools/higgsfield/higgsfield-cli.mjs dop-video \
  --prompt "Smooth transition from exterior to interior view" \
  --image ./exterior.jpg \
  --end-image ./interior.jpg \
  --model dop-standard
```

#### Kling (Image-to-Video)
```bash
node tools/higgsfield/higgsfield-cli.mjs kling-video \
  --prompt "Camera slowly orbits around the property" \
  --image ./property.jpg
```

#### ByteDance Seedance (Image-to-Video)
```bash
node tools/higgsfield/higgsfield-cli.mjs seedance-video \
  --prompt "Waves gently lapping on the shore, palm trees swaying" \
  --image ./beach.jpg
```

### Speech-to-Video (Talking Head)
```bash
node tools/higgsfield/higgsfield-cli.mjs speak \
  --prompt "Professional presenter, warm lighting, slight smile" \
  --image ./headshot.jpg \
  --audio ./voiceover.wav \
  --quality high \
  --duration 10
```

**Speak Options:** quality: `mid`/`high` | duration: `5`/`10`/`15` seconds | audio must be WAV

### Full Creative Workflows

#### Frame-to-Video (generates start frame → end frame → video automatically)
```bash
node tools/higgsfield/higgsfield-cli.mjs frame-to-video \
  --start-prompt "Exterior view of a luxury villa at dawn, warm stone walls" \
  --end-prompt "Interior view of the same villa, sunlight streaming through windows" \
  --video-prompt "Smooth cinematic transition from exterior to interior, camera glides through the entrance" \
  --size 2048x1152 \
  --quality 1080p \
  --model dop-standard
```

This orchestrates 3 API calls: generates start image → generates end image → creates the video transitioning between them.

### Character Consistency (Soul ID)

The owner's trained character is the default for any "image of me / image of {{OWNER_SHORT}}" request:

| Name | Character ID | Notes |
|------|-------------|-------|
| **{{OWNER_SHORT}}** | `{{OWNER_SOUL_ID}}` | Trained during module setup from 5-25 reference photos. Record the ID here and in `assets/higgsfield/`. |

If `{{OWNER_SOUL_ID}}` is still a placeholder, the character hasn't been trained yet - offer to run `create-character` with the owner's reference photos first.

```bash
# Generate an image of the owner (Soul ID + prompting guide)
node tools/higgsfield/higgsfield-cli.mjs soul-image \
  --prompt "[follow the character prompting guide in assets/higgsfield/]" \
  --character-id {{OWNER_SOUL_ID}} \
  --character-strength 0.85 \
  --size 1152x2048 --quality 1080p --enhance-prompt false

# Create a NEW character from reference images (comma-separated)
node tools/higgsfield/higgsfield-cli.mjs create-character \
  --name "Person Name" \
  --images "./photo1.jpg,./photo2.jpg,./photo3.jpg"

# List existing characters
node tools/higgsfield/higgsfield-cli.mjs list-characters

# Use any character in image generation
node tools/higgsfield/higgsfield-cli.mjs soul-image \
  --prompt "Professional headshot in a modern office" \
  --character-id <uuid-from-create>
```

**Maintenance rule:** if multiple Soul IDs accumulate for the same person, pick ONE canonical ID, record it here, and never use the others. Stale character IDs are a recurring source of wrong-face generations.

### Styles & Motions

```bash
# List all 70+ Soul styles (Creatures, Medieval, Realistic, Graffiti, Y2K, etc.)
node tools/higgsfield/higgsfield-cli.mjs styles

# List all DoP motion presets (Zoom In, Orbit, Pan, Dolly, etc.)
node tools/higgsfield/higgsfield-cli.mjs motions
```

### Utilities

```bash
# Check generation status
node tools/higgsfield/higgsfield-cli.mjs status <request-id>

# Wait for a previously submitted job
node tools/higgsfield/higgsfield-cli.mjs wait <request-id>

# Cancel a queued job
node tools/higgsfield/higgsfield-cli.mjs cancel <request-id>

# Upload a file to Higgsfield CDN
node tools/higgsfield/higgsfield-cli.mjs upload ./my-image.jpg

# Download a generated asset
node tools/higgsfield/higgsfield-cli.mjs download \
  --url "https://cdn.higgsfield.ai/..." \
  --output ./output.mp4
```

## Decision Matrix - Which Model to Use

| Need | Command | Why |
|------|---------|-----|
| **High-quality image (default)** | `soul-image` | Higgsfield's best, 70+ styles, character consistency |
| **Fast image, simple prompt** | `flux-image` | Flux Pro Kontext Max, quick and reliable |
| **Alternative image style** | `seedream-image` | ByteDance Seedream, different aesthetic |
| **Best video quality** | `dop-video --model dop-standard` | 9 credits, highest fidelity |
| **Fast video preview** | `dop-video --model dop-lite` | 2 credits, quick iteration |
| **Start→End frame video** | `dop-video --end-image` | Smooth transition between two states |
| **Full auto workflow** | `frame-to-video` | Generates both frames + video |
| **Kling-style video** | `kling-video` | Kling via Higgsfield |
| **Speaking video** | `speak` | Talking head from image + audio |
| **Consistent character** | `create-character` → `soul-image --character-id` | Same face across images |

## Credit Costs (verify current pricing at cloud.higgsfield.ai - these are reference snapshots)

| Service | Credits |
|---------|---------|
| Soul Image 720p | 1.5 |
| Soul Image 1080p | 3 |
| DoP Video Lite | 2 |
| DoP Video Turbo | 6.5 |
| DoP Video Standard | 9 |
| Character (Soul ID) | 40 |

## Website Asset Workflow Example

For generating website assets:

1. **Hero background video:** `frame-to-video` with exterior → interior (or product → detail)
2. **Card/section images:** `soul-image` with subject-specific prompts, landscape size
3. **Showcase videos:** `dop-video` from photos with dolly/orbit motions
4. **Team/presenter videos:** `speak` with headshot + voiceover audio
5. **Consistent branding:** `create-character` for recurring brand imagery
6. **Download & optimize:** `download` then process with ffmpeg for web

## Error Handling

| Status | Meaning | Action |
|--------|---------|--------|
| `queued` | In queue | Wait |
| `in_progress` | Generating | Wait |
| `completed` | Done | Result includes `images[]` or `video{}` |
| `failed` | Error | Credits refunded, retry |
| `nsfw` | Content flagged | Credits refunded, rephrase prompt |
| HTTP 401 | Bad credentials | Check HF_API_KEY/HF_API_SECRET |
| HTTP 403 | No credits | Top up at cloud.higgsfield.ai |

## Integration with Other Skills

- **3d-website-enhancer:** Use Higgsfield to generate the images/videos that skill plans
- **presentation-builder:** Generate slide backgrounds (text/logos composited separately)
- **frontend-design:** Generate hero images/videos, then implement in the site
- **blog workflows:** Generate custom blog hero images instead of stock photos

---

## Related

- [[3d-website-enhancer]]
- [[presentation-builder]]
- [[media-hub]]
