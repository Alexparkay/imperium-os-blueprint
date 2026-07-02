# Phase 3 - Voice

**Goal:** everything the system drafts sounds like the person in the chair, not like AI.

Voice belongs to the DAILY OPERATOR. If Phase 1 recorded a real operator other than the seat holder and that person is present, capture their voice here; if they're not present, capture the seat holder's voice now and note that the operator's voice sample is part of the pending operator sub-onboarding.

1. Explain why in two sentences: "Anything I write for you should sound like you wrote it. For that I need to see real examples of your writing, the more unfiltered the better."

2. First ask: **"When your words go out in public - posts, captions, client emails - do they go out as YOU, or as the company / someone else?"** → `voice_split`. If split (their words publish under a brand or another person's name), capture THEIR personal voice now and create `content-pipeline/voice-profile/brand-voice.md` as an explicit TODO slot ("brand voice not captured yet - collect from published posts before drafting public content"). Every content skill must check WHICH voice a draft needs; a WhatsApp voice on an Instagram caption is how trust dies.

3. Ask: **"Paste 2 or 3 things you've written that sound like you. Sent emails are perfect. A LinkedIn post, a proposal paragraph, a long WhatsApp message all work. Paste them straight into this chat, or tell me where a file lives and I'll read it."**

4. Save each sample to `content-pipeline/voice-profile/sample-01.md`, `sample-02.md`, etc. (with a one-line source note at the top of each).

5. Build `content-pipeline/voice-profile/voice-guide.md` from the samples: typical sentence length and rhythm, greetings and sign-offs, words and phrases they actually use, words they'd never use, formality level, punctuation habits. Quote 2 or 3 short fragments from their samples as calibration anchors.

6. Replace the `{{VOICE_SAMPLE}}` token across the project with `content-pipeline/voice-profile/sample-01.md` (pass procedure in SKILL.md).

7. One more quick ask while you work: **"Do you have brand colours and fonts written down anywhere?"** If yes → replace `{{BRAND_PRIMARY}}`, `{{BRAND_NEUTRALS}}`, `{{BRAND_FONTS}}` with the real values; if no → replace them with `not set - ask the owner before any branded deliverable`, so a literal token can never reach a presentation. (Org-joining seats: check whether the org context already carries brand values before asking.)

8. **Run a live test.** Draft a 3-line email in their voice about something real from Phase 2. Ask: **"Does this sound like you? What's off?"** Apply their corrections to the voice guide. One iteration is usually enough; offer a second if they're not happy.

9. Update state file and status page (Phase 3 done, Phase 4 current, overall 50%).

**Exit criteria:** 2+ samples saved, voice guide written, `{{VOICE_SAMPLE}}` replaced, live test approved.
