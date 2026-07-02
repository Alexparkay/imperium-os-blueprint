---
title: Dictation Correction Dictionary
tags:
  - "system"
type: reference
status: active
created: 2026-04-11
updated: 2026-06-11
description: "Transcription error correction dictionary for voice-to-text input (Wispr Flow or similar). Used by braindump-router skill during Step 1 (Clean). Contains proper nouns, abbreviations, homophone rules, and owner-specific vocabulary. Self-updating: new patterns caught during sessions get appended here. Pruned weekly by /dream cycle."
name: wispr-corrections
---

# Dictation Correction Dictionary

Apply these corrections in order during Step 1 of the braindump-router pipeline. Patterns are case-insensitive unless specified.

**Fresh install note:** Sections 1-5 start EMPTY. Every owner's dictation errors are different (their tools, their people, their company's acronyms). The dictionary fills itself via the self-learning loop in Section 9: the braindump-router catches errors live, logs them, and the `/dream` cycle promotes recurring patterns into the tables below. Sections 7 and 8 ship pre-populated because they are universal to all dictation tools.

## Section 1: Proper nouns (brands, tools, products)

The owner's commonly-mangled tool and brand names. Populate as patterns emerge.

| Dictation output | Correct |
|---|---|
| _(empty - populated by self-learning loop)_ | |

## Section 2: AI models and products

AI model names the owner mentions that the dictation tool mangles.

| Dictation output | Correct |
|---|---|
| _(empty - populated by self-learning loop)_ | |

## Section 3: The owner's network (people)

Names of people the owner mentions often (team, clients, partners, creators they follow).

| Dictation output | Correct |
|---|---|
| _(empty - populated by self-learning loop)_ | |

## Section 4: Business abbreviations (uppercase them)

The company's acronyms that dictation renders as lowercase letters with spaces ("i c p" → ICP). Common universal ones are pre-seeded; add the company's own.

| Dictation output | Correct |
|---|---|
| i c p / I.C.P. | ICP |
| s o p / S.O.P. | SOP |
| d f y / D.F.Y. | DFY |
| d w y / D.W.Y. | DWY |
| l t v / L.T.V. | LTV |
| c a c / C.A.C. | CAC |
| r o a s / row as | ROAS |
| b 2 b / b to b | B2B |
| s a a s / sas | SaaS |
| a p i | API |
| c l i | CLI |
| s d k | SDK |

## Section 5: Places

Locations the owner mentions that get mis-transcribed.

| Dictation output | Correct |
|---|---|
| _(empty - populated by self-learning loop)_ | |

## Section 6: Commands transcribed as speech

These are slash commands or skills the owner may have spoken. Router should detect intent and consider invoking the matching skill. Pre-seeded with template skills; extend as the owner's vocabulary emerges.

| Dictation output | Likely command |
|---|---|
| commit and push / push it up | `/commit` + git push |
| do a dream / dream cycle / run dream | `/dream` |
| quality check / score this / rate this | `quality-gate` skill |
| what's trending / trend check | `trend-intelligence` skill |
| brain storm / lets brainstorm | `/brainstorm` |
| deep research this | `/deep-research` |
| content cascade / cascade this | `content-cascade` skill |
| voice check this | `voice-check` skill |

## Section 7: Homophone fallbacks (context-dependent, flag if ambiguous)

These require context to disambiguate. Router should pick based on surrounding words, not auto-replace.

- their / there / they're
- to / too / two
- your / you're
- its / it's
- then / than
- accept / except
- affect / effect
- site / sight / cite
- peak / peek / pique
- weather / whether
- loose / lose
- principal / principle

## Section 8: Common dictation structural quirks

- **Run-on sentences** - dictation tools rarely add periods mid-thought. Split at natural breaks: "so", "and also", "but then", "the other thing is".
- **Dropped conjunctions** - "Going to X" may mean "I'm going to X". Don't add words, just flag for context.
- **Filler words** - "um", "uh", "like" (non-comparative), "you know" - strip these silently.
- **Number rendering** - "three million" vs "3M" vs "3 million" - keep whichever the dictation output, don't reformat unless the owner asks.
- **Apostrophes sometimes dropped** - "dont", "wont", "cant" - fix silently.
- **Repetition for emphasis** - "like, like really important" - many people speak this way; keep one, drop the dup.

## Section 9: Self-learning log (append-only)

New patterns caught during live sessions get appended here by the router. Format:

```
- YYYY-MM-DD: [dictation output] → [correct] (context: <where caught>)
```

### Log

<!-- New entries go here. /dream reviews this section weekly and promotes recurring patterns to Sections 1-6. -->

---

## Maintenance

- **Added to**: automatically by braindump-router when new patterns are detected
- **Pruned by**: `/dream` skill weekly (removes entries unused for 30+ days, merges duplicates)
- **Verified by**: the owner can manually edit this file any time to add/remove patterns

## Related

- [[braindump-router]]
- [[memory-dream]]
