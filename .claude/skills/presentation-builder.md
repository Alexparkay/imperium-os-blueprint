---
title: Presentation Builder - Brand-Exact Slide Production
tags:
  - "system"
type: skill
status: active
created: 2026-05-24
updated: 2026-06-11
description: Build company presentation slides using the verified hybrid workflow (AI-generated background/imagery + programmatic composite for brand-exact text/logos/elements). Triggers on "build a slide", "pitch deck", "presentation", "cover slide", "case studies slide", "stat slide", "process slide", "pricing slide", "deck for [audience]". Outputs 4K 16:9 PNG matching the company's locked brand system. Supports Dark Premium and Light Minimalism visual modes. Designed for multi-chat parallel work via a per-deck folder framework. OPTIONAL MODULE - AI backgrounds require a Higgsfield (or equivalent image-gen) account; programmatic-only slides work without it.
name: presentation-builder
---

# Presentation Builder

## Purpose

Build presentation slides FAST and consistently. The hybrid workflow (AI background + programmatic composite) packages a proven recipe so any chat can build a slide without re-deriving the process.

## When to use

- "Build the cover slide" / "intro slide"
- "Build the case studies slide" / "partners wall"
- "Build slide 03 / 04 / NN of the deck"
- "Pitch deck" / "presentation"
- Any request to produce visual brand assets for company presentations

## When NOT to use

- Logo design or brand identity work (not a slide)
- Single image generation for social/blog (use the image-generation skill)
- Video presentations (defer - looping animations are future work)

## The hybrid workflow (the core insight)

1. **AI handles atmosphere** - backgrounds, abstract imagery, photographic scenes. Use an image model with a brand palette swatch attached as a reference element so colors stay on-brand (a palette-swatch reference image measurably improves hex adherence).

2. **Programmatic composite handles brand-exact elements** - the company logo, wordmark, client logos, exact metrics, headlines. NEVER ask AI to render specific text or reproduce logos. Image generators hallucinate stylized text at roughly a 1-in-4 to 1-in-8 rate.

3. **Distribute** - master PNG to the media store, notification to the owner, composite script committed to git (PNGs stay out of git).

## Setup (one-time, during onboarding)

1. Record the brand system in `assets/brand/brand-colors.md`: primary color, 2-3 neutrals, heading font, body font, small-label font. Placeholders until then: primary `{{BRAND_PRIMARY}}`, neutrals `{{BRAND_NEUTRALS}}`, fonts `{{BRAND_FONTS}}`.
2. Create a palette swatch image (a simple grid of the brand hexes) and upload it to your image-gen tool as a reusable reference element. Record its reference ID in `assets/brand/`.
3. Create the deck folder: `presentations/<deck-name>/` with a README.md (slide index + status) and one folder per slide containing SPEC.md (copy, layout, references) and STATUS.md.

## Two visual modes

### Dark Premium (default for hero slides)

- Dominant: the brand's deepest primary color
- Atmospheric photography, dusk lighting, glass-morphic accents
- Soft accent glows in the brand neutrals, deep shadows
- Premium, restrained, expensive feel
- Used for: cover, case studies, team, CTA

### Light Minimalism (for analytical/stat slides)

- Dominant: warm off-white (NOT pure white)
- Generous negative space
- Simple geometric shapes, clean dividers
- Hero metric in the brand primary, supporting text in a dark neutral
- LESS photography, MORE graphic design
- Can be code-generated entirely (no AI image needed for simple stat slides)
- Used for: hero stats, process diagrams, pricing, methodology

A deck that is all Dark Premium gets heavy. Mix the modes.

## Workflow recipe (Dark Premium hero slide)

1. **Plan** - read the slide's SPEC.md. Confirm copy, layout, references. If SPEC.md doesn't exist, ASK the owner for copy + layout direction. Don't fabricate copy.
2. **Preflight cost** - check generation cost before running.
3. **Generate background(s)** - image model + palette swatch reference. Prompt skeleton:
   ```
   Ultra-premium [type] background, [aspect ratio] [resolution].
   Dominant color: [BRAND PRIMARY NAME + HEX] matching the reference color swatch.
   Supporting accents in [neutral hexes]. ABSOLUTELY NO other colors.
   Visual style: [aurora glass-morphic | photographic | architectural].
   Mood: timeless, restrained, expensive.
   STRICTLY NO: text, letters, numbers, logos, watermarks, UI overlays.
   The colors in the reference swatch are the ONLY colors permitted.
   ```
4. **Composite programmatically** (Python PIL or equivalent) - start from an existing template script in `scripts/slides/`. Layout patterns: logo in the header zone, wordmark beside it in the heading font, light-tint text for prominence, mid-tint for secondary, hairline dividers at low alpha.
5. **Quality gate** - score 1-10 across composition / color / brand / typography / premium feel. Iterate if avg <9 or any dimension <7.
6. **Distribute** - see checklist below.

## Workflow recipe (Light Minimalism slide)

1. **Decide if an AI background is needed at all** - many minimalist slides need ONLY the composite step (solid off-white + shapes + numbers + brand fonts).
2. **If a background is needed:** prompt "warm off-white softly textured paper, subtle warm grain, no other elements" - cheap to render and reliably consistent.
3. **Composite** - shape primitives (rectangles, circles, lines), avoid drop shadows, heading font for the hero element, body font for supporting text.

## Multi-chat parallel coordination

Each chat picks ONE slide and works it independently. The deck README.md is the source of truth.

1. **Claim a slide** - set its STATUS.md to `in-progress (chat: <name>)`
2. **Read SPEC.md** - the slide's copy, layout, references
3. **Build per recipe** above
4. **Update STATUS.md** to `shipped` and update the README.md row
5. **Don't touch other slides** unless explicitly asked

## Distribution checklist (every shipped slide)

```
1. Save master at presentations/<deck-name>/NN-slug/master.png
2. Upload to the media store ({{MEDIA_STORE}} or the configured Drive folder)
3. Notify the owner via the notify module with the file location
4. Update presentations/<deck-name>/README.md (status + link)
5. Update NN-slug/STATUS.md to "shipped"
6. Commit the SCRIPT (not the PNG - *.png is gitignored, lives in the media store)
```

For every shipped asset, give the owner clickable paths: local relative markdown link + a browser-openable URL (media-store share link or file:// path).

## Known limitations + workarounds

- **Source photos prompted dark stay dark.** Post-process tint adjustment has a floor. If a slide still reads too dark/saturated after adjustment, REGEN the source photos with brighter prompts (warmer mid-tones, lighter overall).
- **AI image models hallucinate text.** Never put critical text/numbers into AI prompts. Always render text via the composite step.
- **Multi-logo composition in one AI image is unreliable.** 4 logos in one prompt = mangled letterforms. Upload logos as separate reference elements OR composite them programmatically.
- **Brand fonts may miss unicode glyphs.** Arrows and middle dots can render as missing-glyph boxes. Use ` / ` or spaced separators and test at small render scales.

## Future directions (documented, not built)

- **React/Reveal.js/Slidev deck app** - one page per slide, AI PNG as base layer, motion library for text entry animations, keyboard navigation. Compare Reveal.js (battle-tested), Slidev (dev-friendly), and Keynote (zero dev cost) before building.
- **Looping ambient animations** - image-to-video with the same start/end frame for a seamless loop behind static elements. Cost compounds across slides; defer until layouts are locked.

## Related skills + rules

- Image-generation skill (general AI image/video)
- `media-hub` - media store auto-save
- `quality-gate` - post-deliverable iteration

---

## Related

- [[quality-gate]]
- [[media-hub]]
- [[higgsfield]]
