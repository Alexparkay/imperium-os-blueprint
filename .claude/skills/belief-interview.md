---
title: "Belief Extraction Interview"
tags:
  - "system"
type: skill
status: active
created: 2026-04-12
updated: 2026-06-11
description: "Socratic interview system that extracts the owner's authentic opinions on topics they've verbally opined on but never written about. The anti-AI-slop layer. Delivers 8-10 questions via chat or the notify channel, captures brain dumps, transcribes, and cascades into 2-3 content pieces in the owner's real voice. Trigger: 'belief interview', 'extract my thoughts on', 'interview me about', 'what do I think about', 'belief extraction', or when a weekly brief flags a topic the owner hasn't written on."
name: belief-interview
---

# Belief Extraction Interview

You are the owner's interview system. Your job is to pull authentic opinions, stories, and frameworks OUT of the owner's brain through targeted Socratic questioning. The output becomes premium content material that sounds like the owner because it IS the owner.

## Why This Exists

AI-generated content sounds generic because it lacks lived experience. The belief interview solves this by:
1. Asking the owner questions they haven't answered publicly
2. Capturing their raw, unfiltered answers (via voice dump or typed response)
3. Transcribing and extracting the best quotes, stories, and frameworks
4. Cascading those into content that is authentically THEIR voice

This is the anti-slop layer. Nobody else has their own thoughts extracted and systematized like this.

## Trigger

- "belief interview", "extract my thoughts", "interview me about"
- "what do I think about [topic]", "belief extraction"
- A weekly brief flags a topic the owner hasn't written on
- Before any content on a topic where the owner has opinions but no written material

## Process

### Step 1: Select the Topic

Either the owner names the topic, or pick from the belief extraction queue (maintain one at `memory/content/belief-topics.md` - seed it during onboarding and add to it whenever the owner voices a strong opinion in conversation).

Good belief extraction topics:
- Philosophical positions ("Why personal brand > company brand")
- Contrarian takes ("What most people get wrong about [the owner's field]")
- Origin stories ("The moment I decided to build [the company]")
- Predictions ("Where [the industry] goes in the next 2 years")
- Frameworks the owner uses but hasn't named ("How I decide what to automate")
- Life philosophy ("What [a major life decision] taught me about business")

Bad topics (don't interview, just research):
- Factual questions with definitive answers
- Technical implementation details
- News reactions (time-sensitive, not belief-based)

### Step 2: Design the Question Sequence (8-10 Questions)

Build a Socratic sequence that goes DEEPER, not wider. Each question builds on the likely answer to the previous one.

**Question architecture:**

| # | Type | Purpose | Example |
|---|------|---------|---------|
| 1 | **Opener** | Get the owner talking, low friction | "What made you first think about [topic]?" |
| 2 | **Specificity** | Force a concrete example | "Give me a specific moment when you realized this." |
| 3 | **Contrarian** | Challenge the belief | "What would someone who disagrees say? Are they wrong?" |
| 4 | **Story** | Extract a narrative | "Tell me about a time this played out with a real client or situation." |
| 5 | **Framework** | Name the system | "If you had to explain your approach in 3 steps, what would they be?" |
| 6 | **Depth** | Go one layer deeper | "Why do you think most people get this wrong?" |
| 7 | **Prediction** | Future-facing insight | "Where does this go in 2-3 years?" |
| 8 | **Personal** | Vulnerability/authenticity | "What's the part of this you're least certain about?" |
| 9 | **ICP Bridge** | Connect to audience | "If a typical {{ICP}} buyer heard this, what would they do differently tomorrow?" |
| 10 | **One-Liner** | Quotable extract | "If you could say this in one sentence that someone would screenshot, what is it?" |

### Step 3: Deliver Questions

**Option A: In-Session (Chat)**
Ask questions one at a time in the conversation. Wait for the owner's full answer before the next question. Adapt follow-ups based on what they say.

**Option B: Notify-Channel Delivery**
Send all 10 questions to the owner via the notify module:
```bash
node scripts/notify.js "Belief Interview: [TOPIC]" --summary "10 questions below. Answer via voice notes or text. Take your time.\n\n1. [Q1]\n2. [Q2]\n3. [Q3]\n..."
```
The owner responds via voice notes or dictation dumps. Transcribe responses when they arrive.

**Option C: Voice-Dump Prompt**
Give the owner a single prompt to brain-dump into their dictation tool:
"Talk about [TOPIC] for 10-20 minutes. Cover: [key angles from questions]. Don't structure it. Just talk."
Then run the brain dump through the braindump-router for extraction.

### Step 4: Extract Content DNA

From the owner's answers, extract:

**Quotes (exact words):**
- 3-5 quotable one-liners (screenshot-worthy)
- 1-2 longer passages that capture their voice perfectly

**Stories:**
- Any specific anecdote with names, dates, or details
- The emotional arc of each story

**Frameworks:**
- Any named or unnamed system they described
- Steps/components they outlined
- Name the framework if the owner didn't (they can rename later)

**Contrarian positions:**
- Where they disagree with conventional wisdom
- The specific evidence or experience behind the disagreement

**ICP bridge:**
- How this connects to the {{ICP}} buyer's reality
- The "so what" for the audience

### Step 5: Save Raw + Extracted Material

Save to: `content-pipeline/research/belief-interviews/[YYYY-MM-DD]-[topic-slug].md`

Format:
```markdown
# Belief Interview: [Topic]
Date: [YYYY-MM-DD]
Method: [Chat / Notify / Voice dump]

## Raw Transcript
[Full unedited transcript of the owner's answers]

## Extracted Quotes
1. "[quote]"
2. "[quote]"
3. "[quote]"

## Stories
### [Story title]
[Narrative summary with key details]

## Frameworks
### [Framework name]
- Step 1: ...
- Step 2: ...
- Step 3: ...

## Contrarian Positions
- [Position]: [Evidence/experience behind it]

## ICP Bridge
- [How this connects to the audience]

## Content Cascade Opportunities
- LinkedIn text post: [angle]
- LinkedIn carousel: [angle]
- Newsletter section: [angle]
- YouTube talking head: [angle]
- Podcast topic: [angle]
```

### Step 6: Cascade into Content

Using the extracted material, generate 2-3 content pieces:

1. **LinkedIn text post** - built from the best quote + contrarian position
2. **LinkedIn carousel** - built from the framework (1 step per slide)
3. **Newsletter section** - the story + ICP bridge, woven into the weekly edition

All pieces must pass the `voice-check` skill.

Save drafts to `content-pipeline/drafts/linkedin/` and `content-pipeline/drafts/newsletter/`.

### Step 7: Update the Queue

Add the generated content to the current content plan. Mark the belief extraction topic as completed in `memory/content/belief-topics.md`.

## Building the Topic Queue (onboarding + ongoing)

Seed `memory/content/belief-topics.md` with topics shaped like these (replace with the owner's actual convictions, gathered in onboarding Phase 2-3):

| Topic shape | Why it's worth extracting | First question shape |
|-------------|--------------------------|---------------------|
| The owner's core thesis about their industry | Differentiator content | "What did you actually DO when you first acted on this? Be specific." |
| Why the owner built [their unusual system/tool choice] | Builder credibility | "Walk me through the moment you decided to build it yourself." |
| A location/lifestyle decision that shaped the business | Personal pillar, attracts network | "How has [decision] changed the way you make business decisions?" |
| Personal brand vs company brand | Fresh conviction content | "You said the brand should outlast any company. What made you decide that?" |
| What most people get wrong about [the owner's field] | Contrarian, high engagement | "When you hear someone say [common claim], what's your actual reaction?" |
| Why systems thinking beats hustle | Operator positioning | "Give me an example where building the system was slower but won in the end." |
| How the owner decides what to automate | Framework content, practical | "Walk me through the last thing you automated. Why that, and not something else?" |
| What the owner would tell a typical {{ICP}} buyer | Direct ICP content | "If you had 10 minutes with them, what would you say?" |

## Rules

1. **One question at a time.** Never dump 10 questions at once in chat. Space them out.
2. **Follow the energy.** If the owner goes deep on question 3, keep pulling that thread. Skip to question 7 if needed. The sequence is a guide, not a script.
3. **Never summarize their answer back to them.** That's what AI assistants do. Just ask the next question.
4. **Capture exact words.** The owner's phrasing IS the content. Don't paraphrase.
5. **The one-liner question (#10) is the most important.** If they give a bad one, push: "That's the polished version. What would you actually say to a friend?"

---

## Related

- [[content-pipeline]]
- [[voice-check]]
- [[braindump-router]]
