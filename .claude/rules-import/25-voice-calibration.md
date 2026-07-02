---
title: "MANDATORY: Voice Calibration Before Writing in the Owner's Voice"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Voice Calibration Before Writing In The Owner's Voice

When writing ANY document in the owner's voice (brand briefs, brand bibles, personal-brand copy, About-me copy, bios, profile copy, manifestos, newsletter intros, podcast descriptions, video scripts, anything where the prose represents the owner), you MUST calibrate against actual owner writing BEFORE drafting. This applies whether the perspective is first, second, or third person.

This rule exists because un-calibrated drafts cost rounds of feedback removing AI patterns from a doc the owner could have written themselves in one pass.

## Step 1 - Read the calibration sample (mandatory, before any writing)

Read the owner's verified writing sample at `{{VOICE_SAMPLE}}` (collected during onboarding Phase 3; lives under `content-pipeline/voice-profile/`). Use it as the gold standard for cadence, sentence shape, paragraph rhythm, and emotional register.

Pay attention to what's there: how sentences flow into one another, how beliefs are justified, the level of specificity, the confidence register.

Pay attention to what's NOT there:

- Em dashes
- Two-line empty punches
- Forced negation
- Three-word fragments stacked for rhythm
- Hype words, motivational poster lines

## Step 2 - Sample additional voice references for register

Voice ≠ register. A reflective sample doesn't fit a casual DM. Sample the relevant source for the register you're writing in:

| Register needed | Sample from |
|---|---|
| Reflective / personal-brand prose | `{{VOICE_SAMPLE}}` |
| Casual texting / DM tone | `content-pipeline/voice-profile/` (messaging samples, if collected) |
| General brand voice rules | `content-pipeline/voice-profile/` (voice guide) |
| Long-form owner speaking | `memory/transcripts/` (any recent dated transcript) |

If unsure which register fits, default to the main calibration sample plus the voice guide.

## Step 3 - Draft against the sample, not from a blank page

While drafting, keep the calibration sample in mind. After every paragraph, mentally compare cadence and shape. Specifically check for these AI patterns from rule 11:

1. Forced negation ("It's not X. It's Y.")
2. Two-line empty punches (second sentence restates first for flourish)
3. Staccato repetition (3+ same-cadence sentences in a row)
4. Over-compression (fragments that strip meaning to feel punchy)
5. Em dashes (banned by rule 15, never appear)

## Step 4 - Self-check before delivery

Before showing the owner the output, run this 30-second test:

- Open the calibration sample side-by-side with the new draft
- Read both
- Ask: "if the owner saw both side-by-side, would they be able to tell which one they wrote?" Both should sound like the SAME person. If the new draft sounds AI-y next to the calibration sample, rewrite before delivery
- Specifically scan the draft for the four patterns above

If a draft fails this check, do NOT ship it and ask the owner to flag patterns. Fix it first. The whole point of this rule is to eliminate the back-and-forth.

## What this rule does NOT mean

- Does NOT mean copy the owner's exact sentences. Calibrate cadence and tone, write fresh content.
- Does NOT mean every doc must sound reflective. Different registers exist. Use the right sample for the register.
- Does NOT mean ban all short sentences. Short sentences are fine when they ADD information. They're banned when they're rhetorical flourishes.
- Does NOT mean over-compress. If a thought needs three sentences to land in the owner's voice, write three sentences.

## When this rule applies

- Brand briefs and brand bibles (any version)
- Personal-brand copy across social platforms, podcast descriptions, newsletter intros, About pages
- Anything where the prose represents the owner talking ABOUT themselves or AS themselves
- Bios, profile copy, speaker descriptions, invitations
- Voice-of-owner sections inside larger docs
- Sub-agents writing voice-bearing copy (inject the calibration source into the agent prompt per rule 02)

## When this rule does NOT apply

- Operational outputs: code, git commits, tool commands, status updates
- Pure data: tables, file lists, technical reports
- Internal memory/ updates that aren't user-facing
- Other people's words (transcripts, quotes from guests, extracted creator content)

## Calibration sample maintenance

If the owner writes a longer, better, or more representative voice sample later, update `{{VOICE_SAMPLE}}` (and the voice-profile README) to point to it. Keep a single source of truth current.
