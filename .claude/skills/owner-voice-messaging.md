---
title: "Owner Voice Messaging - Write Texts and DMs in the Owner's Exact Tone"
tags:
  - "system"
type: skill
status: active
created: 2026-04-02
updated: 2026-06-11
name: owner-voice-messaging
description: "Write WhatsApp messages, texts, and DM replies in the owner's exact casual voice. Use when the owner says 'write me a WhatsApp message', 'message [person]', 'text [person]', 'draft a reply', 'reply to this', 'what should I say to', or 'write this in my voice'. Includes the framework for BUILDING the owner's messaging voice profile from their real message history."
---

# Owner Voice Messaging

## Skill Metadata

**Trigger phrases:** "write me a WhatsApp message", "message [person]", "text [person]", "WhatsApp to [person]", "draft a message", "how would I message", "reply to [person]", "send [person]", "what should I say to", "write this in my voice", "my texting style", "draft a reply", "respond to this", "WhatsApp reply", "how do I text", "write this for WhatsApp".

**When to activate:**
- The owner asks to compose any WhatsApp/text message
- The owner asks for help replying to a conversation
- The owner asks "what should I say to [person]"
- The owner wants a message drafted in their natural voice
- The owner provides a chat screenshot and wants a response
- Any message-drafting task where the recipient uses messaging apps

---

## PART 1 - Build the Owner's Messaging Voice Profile (one-time, then maintain)

This skill is only as good as its data. In the parent system, the profile was built from a full export of the owner's real message history (2,000+ sent messages, ~40,000 words) and the result was indistinguishable from the owner. A fresh install has NO profile. Build it before drafting anything important.

### Data collection

1. Export or query the owner's message history (WhatsApp MCP module if connected, or a chat export). Sent messages only - you are modeling the owner, not their contacts.
2. Target at least 500 sent text messages across multiple relationship types. More is better.
3. Never include the raw export in this file. The PROFILE lives here; the raw data stays private.

### Analysis dimensions (compute each, write results into Part 2 below)

| Dimension | What to extract |
|---|---|
| **Data summary** | message counts, date range, avg/median words per message, voice-note vs text ratio |
| **Overall personality** | one paragraph: default register, warmth, directness, formality, emoji stance |
| **Relationship tiers** | classify contacts into tiers (see tier framework below); per tier: opener patterns, tone, typical length, sign-offs, address terms, 5-10 real example messages kept in a PRIVATE companion file at `content-pipeline/voice-profile/messaging-examples.md` (gitignored if sensitive) |
| **Vocabulary frequency** | top 50 content words, address terms ranked by frequency |
| **Greeting patterns** | every opener with counts and contexts; what the owner NEVER opens with |
| **Sign-off patterns** | every closer with counts; the no-sign-off rate; what the owner NEVER closes with |
| **Emoji analysis** | exact counts. Many operators use near-zero emojis; never assume |
| **Punctuation patterns** | commas, periods on short messages, question marks, ellipses, exclamation marks, ALL CAPS usage, apostrophe-dropping habits |
| **Misspelling catalogue** | recurring genuine misspellings with counts. These are authenticity markers. Never invent ones the owner doesn't make |
| **Sentence length distribution** | percentage bands (1 word / 2-5 / 6-10 / 11-20 / 21-40 / 41-80 / 81+) |
| **Voice note patterns** | when the owner switches from text to voice (typical threshold: replies that would exceed ~50 words) |
| **Situational patterns** | real templates for: scheduling, following up, giving feedback, congratulating, declining, negotiating, apologising for delay, sharing links, cold messaging, re-engaging after silence |
| **Anti-patterns** | evidence-based list of things the owner NEVER does (abbreviations, "lol", emoji spam, formal closers, etc.) |

### Maintenance

Re-run the analysis quarterly or after any major life/business change. Append newly observed patterns as you draft messages and the owner corrects them - every correction is profile data.

---

## PART 2 - The Owner's Profile (filled during onboarding Phase 3)

> STATUS: {{VOICE_SAMPLE}} - messaging profile NOT YET BUILT. Until it is, draft conservatively using the universal rules in Part 3, tell the owner the profile is uncalibrated, and ask them to review every draft.

When built, this section contains:

- **A. Data Summary** - [table]
- **B. Overall Texting Personality** - [paragraph]
- **C. Relationship Tiers** - [rules + example messages per tier]
- **D. Vocabulary Frequency** - [tables]
- **E. Greeting Patterns** - [table with counts]
- **F. Sign-Off Patterns** - [table with counts]
- **G. Emoji Analysis** - [counts + rule]
- **H. Punctuation Patterns** - [table + rules]
- **I. Misspelling Catalogue** - [table + replication rules]
- **J. Sentence Length Distribution** - [table]
- **K. Voice Note Patterns** - [thresholds]
- **L. Situational Patterns** - [templates]
- **M. Anti-Patterns** - [numbered list]

---

## PART 3 - The Generation Framework (universal, works with any profile)

### The Relationship Tier Framework

Classify every recipient into exactly ONE tier before writing. Typical tier set (adapt to the owner's life):

| Tier | Who | Register |
|---|---|---|
| 1. Business Casual | friends, acquaintances, networking contacts | warm, direct, action-oriented |
| 2. Business Formal | clients, staff, service providers | structured, polite, exhaustive detail when delegating |
| 3. Business Partner | co-founder / closest collaborator | extremely clipped, zero pleasantries, total shared context |
| 4. Close Friends | inner circle | banter, inside jokes, casual address terms |
| 5. Personal / Romantic | partners, dates | playful, register the owner defines; never mix with business |
| 6. Family | parents, siblings, relatives | tender, brief, practical |

### The Tier Firewall (the most important rule)

Cross-contamination is the #1 failure mode. Enforce hard boundaries:

- **Never use personal/romantic language in business tiers** (pet names, playful ellipses, poetic closers)
- **Never use operational language in personal tiers** ("any updates on X", numbered lists, "let me know" closers)
- **Never use banter or sarcasm with family** (unless the profile shows the owner does)
- **Never add greetings or pleasantries to the business-partner tier** (shared-context relationships skip them)

Get the tier wrong and the entire message sounds wrong, no matter how good the wording is.

### Message Generation: 9-Step Process

**Step 0: TIER FIREWALL** - classify the recipient, load that tier's rules from Part 2. If unsure, default to Tier 1 (Business Casual) - the safest register.

**Step 1: Determine the tier** - dictates tone, length, vocabulary, and sign-off.

**Step 2: Choose the opener** - from the profile's greeting table for this tier. Never use openers the profile marks as never-used.

**Step 3: State the purpose in the first sentence** - most operators never bury the lead. Bad: "Hey Mark, how are you doing? I was thinking the other day..." Good: "Hey Mark, any updates on the access?"

**Step 4: Keep it short** - target the profile's median length (often 10-20 words). Go longer only for: detailed instructions, feedback, SOPs, negotiations, invitations. If the message would exceed ~50 words, suggest the owner send a voice note instead.

**Step 5: Use the owner's vocabulary** - reactions, request forms, scheduling phrases, follow-up phrases, and address terms from the profile tables. Never substitute synonyms the owner doesn't use.

**Step 6: Apply the punctuation rules** - from the profile (comma chaining, dropped periods on short messages, apostrophe habits, exclamation policy).

**Step 7: Add authenticity markers (longer messages only)** - include one of the owner's genuine recurring misspellings in 30+ word messages if the profile documents them. Keep short messages clean. NEVER invent misspellings.

**Step 8: Choose the sign-off** - most messages in most profiles have NO sign-off. Use the profile's closer table; never use formal email closers ("Best regards", "Kind regards") in texts.

**Step 9: Final check** - run the AI Slop Detection Checklist below.

### AI Slop Detection Checklist (run on EVERY generated message)

1. **Would the owner actually type this?** Read it out loud in a casual voice. If it sounds like a LinkedIn post, rewrite.
2. **Is any word longer than necessary?** "great" not "wonderful", "all good" not "absolutely no problem at all".
3. **Does it contain banned words?** Check the profile's anti-pattern list plus the universal set: "just wanted to", "hope this finds you", "touching base", "circle back", "leverage", "synergy", "unlock", "game-changer".
4. **Is there a forced negation?** ("It's not about X, it's about Y") - cut it.
5. **Are there 3+ sentences with the same cadence?** Break the rhythm.
6. **Could this paragraph be one sentence?** If yes, use the sentence.
7. **Is there an emoji the profile doesn't justify?** Remove it.
8. **Is there an exclamation mark the profile doesn't justify?** Remove it.
9. **Does the message start with the purpose?** If not, cut the preamble.
10. **Does the tier firewall hold?** No cross-tier vocabulary.

### Universal situational templates (calibrate wording to the profile)

```
Post-meeting follow-up:  Hey [Name], great meeting you [today/yesterday]. [Specific reference]. Would be great to [next step].
Open-item follow-up:     Hey [Name], hope you're well, any updates on [thing]
Scheduling:              How's [Day] at [Time] for [activity]?
Declining:               Would be good [man/mate], but [brief reason]. [Alternative]
Apology for delay:       Hey [Name], apologies for the delay, been busy. [Immediate pivot to action]
Feedback:                Hey [Name], went through [thing] and really like [specific positive]. [Constructive input framed as a question]
Favour ask:              Hey [Name], any chance you [specific ask]? Would really appreciate it
Cold outreach:           Hey [Name], [how you're connected]. [One sentence on why you're reaching out]. Would be great to [specific next step].
Re-engagement:           Hey [Name], hope you're well. [Context/update]. Would be great to [catch up / next step].
```

---

## Related

- [[voice-check]]
- [[content-pipeline]]
- [[braindump-router]]
