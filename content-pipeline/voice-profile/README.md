# voice-profile/

The single source of truth for how {{OWNER_SHORT}} actually writes. Every content skill calibrates against this folder before drafting anything in the owner's voice.

## How it gets built (onboarding Phase 3)

1. **Samples in.** The owner provides 2-3 real writing samples ({{VOICE_SAMPLE}}): emails they wrote, posts they're proud of, a long message to a friend. Real writing, not polished marketing copy. Saved here as `sample-01.md`, `sample-02.md`, etc.
2. **Voice guide out.** The OS analyses the samples (sentence shape, cadence, vocabulary, what's present, what's absent) and writes `voice-guide.md`: the rules a writer would need to be mistaken for the owner. Includes a banned-words list of AI tells the owner never uses.
3. **Calibration loop.** The voice-check skill scores every draft against the guide. When the owner flags something as "I'd never say that", the guide gets updated in that session.

## Files (after Phase 3)

- `sample-*.md`: the raw calibration samples, never edited
- `voice-guide.md`: the derived rules, the living doc
- registers (optional): separate notes for distinct contexts (casual DM voice vs long-form voice) once enough samples exist

## The standing test

Put a new draft next to a sample. If a stranger could tell which one the owner wrote, the draft fails and gets rewritten before anyone sees it.
