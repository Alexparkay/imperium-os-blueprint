---
title: "MANDATORY: Anti-AI Slop"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Anti-AI Slop

Four patterns make writing detectable as AI. Detect and eliminate all of them.

## The Four Tells

### 1. Forced Negation

The "It's not X, it's Y" pattern. AI loves this rhetorical structure.

- BAD: "It's not about working harder. It's about working smarter."
- BAD: "This isn't a trend. It's a transformation."
- BAD: "Don't focus on the problem. Focus on the solution."
- GOOD: Just say the thing directly. "Work smarter." Done.

### 2. The Two-Line Empty Punch

Two short declarative sentences stacked together to "land" a rhetorical point, where the second sentence adds NO new information. It just restates the first for stylistic flourish. This is the single most AI-sounding pattern: any 2-sentence punch that exists for rhythm, not content.

- BAD: "This is not a movement. This is a way of life." (empty restatement)
- BAD: "Both serious." (orphan punch fragment with no content)
- BAD: "We don't sell hours. We install infrastructure." (sounds profound, says little)
- BAD: "It's the work. It's the life. It's the brand." (rule of three of nothing)
- GOOD: Short sentences are fine when each adds new information. Belief + justification, both load-bearing.
- TEST: If the second sentence vanished, would the meaning change? If no, the second sentence is a flourish. Cut it or expand into prose.

### 3. Staccato Repetition

Same sentence length and cadence repeated 3+ times. Reads like a LinkedIn bro-poet.

- BAD: "You need clarity. You need focus. You need discipline. You need action."
- BAD: "It starts with one step. Then another. Then another. Then momentum."
- GOOD: Vary sentence length. Mix short punches with longer thoughts. Break the rhythm.

### 4. Paragraph-to-Sentence Compression Failure

If a paragraph can be said in one sentence, it should be one sentence. AI pads everything.

- BAD: "When we think about the way that people approach their morning routines, it becomes clear that the most successful individuals have developed systems and habits that allow them to maximize their productivity in the early hours of the day."
- GOOD: "Successful people have morning systems."

**Don't over-compress either.** If a thought needs three sentences to land properly in the owner's voice, write three sentences. Compression is for clarity, not for stylistic flex.

## The Rule

Before outputting ANY content for the owner (emails, messages, captions, newsletters, scripts, testimonials, DMs, outreach, briefs, ANYTHING):

1. Scan for forced negation patterns. Remove them. Say the point directly.
2. Scan for two-line empty punches. If the second sentence only restates the first, cut it OR expand into a real continuing thought.
3. Scan for staccato repetition. Break the rhythm. Vary sentence structure.
4. Scan for bloated paragraphs. Compress. If you can say it in fewer words, do.
5. Read it back and ask: "Would the owner actually write this?" Cross-check against the calibration sample (`rules-import/25-voice-calibration.md`). If no, rewrite.

## The Test

Take any paragraph you wrote. Can you compress it to one sentence without losing meaning? If yes, the paragraph was slop. Use the sentence.

## Applies To

EVERYTHING, not just "content". Emails, chat messages, DM scripts, outreach templates, testimonial requests, captions, bios, descriptions, subject lines, code comments, commit messages. If words leave this system and a human reads them, this rule applies.
