---
title: "OPTIONAL MODULE: Owner Likeness Generation - Configured Soul ID, On-Brand"
type: rule
status: optional
created: 2026-06-11
---

# OPTIONAL MODULE: Owner Likeness Generation (Higgsfield)

**This rule only applies if the Higgsfield module is configured** (onboarding Phase 4, optional connector; guide: `docs/connectors/higgsfield.md`). It governs ANY request for an AI-generated image, picture, portrait, photo, headshot, thumbnail, render, or video of **the owner**.

## The one ID rule

All owner imagery MUST use the owner's trained Higgsfield Soul character:

- **Stills (DEFAULT):** Soul V2, reference ID `{{OWNER_SOUL_ID}}` (model `soul_2`)
- **Video / cinematic:** Soul Cinematic, reference ID `{{OWNER_SOUL_CINEMATIC_ID}}` (model `soul_cinematic`)

Never use any other Soul ID, even if `soul-id list` returns multiple entries with the owner's name. Stale or duplicate IDs produce a different face. If duplicates exist, flag them to the owner for deletion.

## Trigger phrases

Any of these (or close paraphrases) route to the configured Soul ID: "generate an image of [owner]", "headshot of [owner]", "thumbnail of [owner]", "[owner] in [setting]", "photoshoot of [owner]", "AI image of me" / "image of myself" (when the owner is the speaker).

## Hard workflow rules

1. **Generate natively in Higgsfield via the MCP/CLI.** NO Python compositing, masking, rembg, or external editing unless the owner explicitly says so.
2. **Speed first, hands off the output.** Fire the generation immediately. Do NOT download it, save it to Drive, or analyze/inspect it UNLESS the owner explicitly asks. The owner views results in the Higgsfield app. (This overrides rules-import/07 auto-save for owner likeness generations.)
3. **Text goes in the prompt, exact.** Quote the literal strings with position + style. Soul V2 text won't always be perfect; the owner fixes small errors with Higgsfield inpaint. Keep text short and use real high-frequency words.
4. **Standard settings:** quality 2k, count 2-4 new / 1 refine, Enhance Prompt OFF.
5. **Known model issue:** Soul V2 `--aspect_ratio 16:9` can fail server-side. If 16:9 is requested, generate at 4:3 or 1:1 and tell the owner the post-production crop/outpaint step. Verify against current Higgsfield behavior before relying on this (rule 19).

## Owner aesthetic (EDITABLE TEMPLATE BLOCK - fill during onboarding)

Apply these defaults even when the prompt or a reference image says otherwise. The onboarding skill fills this block from the owner's answers; edit freely afterwards.

```
OWNER AESTHETIC - configure me
- Wardrobe style: {{OWNER_WARDROBE_STYLE}}        (e.g. "smart-casual, plain fitted basics, no graphic logos")
- Color palette: {{OWNER_COLOR_PALETTE}}          (e.g. "black, charcoal, navy, white, cream")
- Accessories: {{OWNER_ACCESSORIES}}              (e.g. "minimal; specific watch when wrist visible")
- Physique notes: {{OWNER_PHYSIQUE_NOTES}}        (how the owner wants to be rendered)
- Always avoid: {{OWNER_AESTHETIC_AVOID}}         (e.g. "graphic logos, hype props, anything on the privacy list")
- On-image text defaults: {{OWNER_TEXT_DEFAULTS}} (role, company, tagline to use when text is unspecified)
```

Rules for the aesthetic block:

- Unspecified on-image text derives from the owner's identity and goals (`context/org/company.md`), never fabricated numbers, never anything on the privacy list (rule 13).
- Remove third-party logos by default.

## Reference images

When the owner provides a reference image: dissect intent. **Keep** composition/lighting/mood. **Change by default:** the person → the owner (the Soul ID owns the face), off-aesthetic clothing → the owner aesthetic block, third-party text → on-brand copy. Declare kept-vs-changed in one line, then generate.

## Single source of truth

The Soul IDs live in three places that must agree: this rule, the higgsfield skill config, and `.env` / onboarding answers. If they disagree, the most recently updated wins and the others must be updated to match.

## Sub-agents

When spawning sub-agents to generate owner imagery, inject: "Use Higgsfield Soul V2 ID `{{OWNER_SOUL_ID}}` for any image of the owner. Generate natively in Higgsfield. No compositing. No download, no Drive, no analysis unless asked. Apply the owner aesthetic block from rules-import/26. Never include anything on the owner's privacy list."

## When this rule does NOT apply

- Images of other named people (use their reference images, not the owner's Soul)
- Img2img with an existing photo of the owner provided as the source image (Soul still RECOMMENDED for face stability but not strictly required)
- Stylization where the owner explicitly says "use this photo, don't use Soul"
