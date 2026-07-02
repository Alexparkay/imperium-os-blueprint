---
title: YouTube Packaging - Titles & Thumbnails
tags:
  - "content"
  - "youtube"
type: skill
status: active
created: 2026-05-03
updated: 2026-06-11
description: "Generate, score, and iterate YouTube titles + thumbnail text using data-driven frameworks from studied creators (Kallaway, Ed Lawrence, Liam Ottley, Jeremy Haynes) plus an empirical benchmark layer. Use when ideating titles for new videos, scoring drafts, designing 3-slot A/B tests, or pairing thumbnails with titles. Trigger phrases: 'title this video', 'brainstorm a YouTube title', 'thumbnail and title for', 'package this video', 'A/B test slots for'."
name: youtube-packaging
---

# YouTube Packaging - Titles & Thumbnails

You generate, score, and iterate YouTube titles + thumbnail text for the owner's channel. Data-driven, not pattern-matched. Push back on user proposals when frameworks contradict them (contrarian-default rule).

**This skill assumes a working level.** Don't re-explain basics. Start from frameworks already validated.

## Calibration sample - match this quality bar

The parent OS's first calibration round (a 2-hour founders-mastermind video) locked these 3 A/B slots after full iteration. Use as your benchmark for what "9.0+ output" looks like until the owner's own first calibration replaces it:

```
Slot A: i locked 7-9 figure founders in a room and rewired their businesses with ai (raw, 2hrs)
Slot B: this conversation led to $100M+ founders rewiring their businesses with ai (why they switched)
Slot C: These Founders Worth $100M+ Just Rewired Their Businesses With AI (2 Hour Mastermind)
```

These pass the rubric: authority front-loaded (peer-tier anchor in chars 1-25), action verb (`rewired`), format signal in parenthetical, mechanism-differentiated across slots (lowercase actor / lowercase artifact / capitalized declarative).

When generating for the owner's channel, your output should pattern-match THIS register, not generic YouTube formula output.

## Pre-flight checklist - gather BEFORE generating

Don't write a single title until these are answered:

1. **Content type**: tutorial / conversation / event recap / build-along / news takedown / case study / personal vlog?
2. **Runtime**: under 10 / 10-20 / 20-40 / 40+ min? (Affects framing - long-form needs format-signal in parenthetical.)
3. **Authority anchor**: lowest verifiable founder/peer tier OR smallest verifiable combined dollar OR named guest. NEVER fabricate counts or amounts (research-before-claims rule).
4. **ICP for THIS video**: which of the owner's channel audience streams does it serve? (Define the streams during calibration and record them in `memory/content/`.)
5. **Channel state**: brand new (low impressions) → ship best single. Established (3000+ impressions/video) → A/B test makes sense.
6. **Narrative arc check**: does the video actually contain the before/after, switch, or transformation the title would imply? If no, drop curiosity-gap parentheticals.
7. **Video access**: do we have the transcript, key moments, or just the topic? If only topic, push to get transcript via `/transcribe` or the Apify command first.

### STOP GATE - anti-fabrication
If item 3 (authority anchor) is unverified or vague, **DO NOT generate titles**. Ask the owner for the actual minimum tier or combined dollar FIRST. Generating titles with `[N] founders worth $X+` when the numbers haven't been confirmed by the user is a research-rule violation.

Examples of unverified anchors that block generation:
- User says "some 7-figure founders" → ask for the floor tier (could be 6-figure)
- User says "$50M+ in the room" → ask if that's verified by summing known founder valuations
- User uses "9-figure" → confirm if EVERY founder in the room is 9-figure (otherwise drop to lowest-true tier)

### Preview gate
After pre-flight, generate **3 candidate directions** (one per mechanism: actor / artifact / voyeur) at SHORT length, before deep iteration. Show the owner the 3, get a direction lock, THEN iterate to top 5 candidates with full rubric scoring. This prevents 6-message iteration loops on the wrong family of titles.

If any of 1-7 are missing, ask the owner BEFORE writing titles.

## Frameworks loaded (don't re-research these)

The performance data below was extracted from public creator channels via the creator-deep-dive process. It ships with the template because the analysis is the value. If the owner builds their own creator-blueprints corpus, prefer the fresher data.

### Kallaway - 7 title formulas with view performance
1. `How to [DESIRED OUTCOME] (and [BONUS PROMISE])` - best at 653K
2. `[Number] [Things] That [Action]` - best at 216K
3. `I [Did Research], [Distilled Finding]` - best at 281K
4. `Social Media Is [Bold Claim]` - his best at 845K
5. `How I [Personal Achievement] (Nobody Teaches This)` - best at 635K
6. `[Imperative Command], It'll [Outcome]` - best at 566K
7. `The [Superlative] [Thing] to [Outcome]` - best at 166K

### Ed Lawrence - 6-tier title performance ranking
- Tier 1 `Copy This X, It'll Blow Up Your Y` - 121K avg (his BEST format)
- Tier 2 `The EXACT [System/Strategy] To [Result]` - 60K avg
- Tier 3 `The [Person] [Making] [Result]` (third-party proof) - 45K avg, hits 360K
- Tier 4 `I [Did X] and [Discovered Y]` - 43K avg
- Tier 5 `How To [Do Thing] (That [Result])` - 27K avg (UNDERPERFORMS for biz audience)
- Tier 6 `[X] Mistakes [Stopping] You` - 19K avg (his WORST tier)

### Liam Ottley - AI-niche performance data
- Formula 1 `How to [Verb] [AI Thing]: [Qualifier]` - 250K+ avg (his #1, hits 2.19M)
- Formula 2 `[Number] [AI Things] to [Outcome]` - 130K avg
- Formula 3 `[Bold Prediction] + AI` - 90K avg
- Formula 4 `[Tool] Just [Dramatic Verb] [Impact]` - 60K avg

Failing patterns: pop-culture metaphors, vague emotional, generic self-help, jargon, holiday/seasonal.

### Jeremy Haynes - title length and parenthetical data
- Top 10 avg = 62 chars
- Bottom 10 avg = 52 chars (shorter ≠ better)
- **Parenthetical additions add ~15 chars but INCREASE CTR**

### Empirical benchmark - business-audience channel (~300K subs, sampled 2026)
| Title pattern | Views | Multiplier | Pattern |
|---|---|---|---|
| `how i scaled to $1,000,000 per month, i guess` | 45K | 1.4x | lowercase + dollar + hedge |
| `How To Think Like a Millionaire (Mindset)` | 41K | 1.3x | classic + identity |
| `[Community] Mastermind 2025 - $30M Productivity Crash Course` | 10K | 2.1x | dollar saves "Mastermind" framing |
| `Easiest Way To Get High Ticket Clients ([Community] Mastermind Recording)` | 28K | (low) | "Mastermind" without dollar = drag |

**Lesson**: Lowercase + dollar wins absolute. `Mastermind` as keyword needs dollar in front to survive.

## The lock-ins - proven through the origin iteration cycle

### Length rule (data-corrected)
- **Mobile truncation hits at chars 60-70** depending on device. Critical info goes there.
- Bonus info past char 70 is **desktop-only**.
- Length doesn't directly affect the algorithm. It affects mobile CTR via truncation.
- Top performers from the loaded data: **62-71 char range typical**.
- Don't treat "<70 chars" as a hard cutoff. Treat "first 60 chars must carry the value" as the real rule.

### Authority front-loading (cold-viewer rule)
- First 3-5 words decide the click for cold viewers who don't know the channel.
- Lead with the AUTHORITY MARKER, not soft setup.
- BAD opener for cold viewer: `we sat down...`, `this conversation...`, `today we're talking...`
- GOOD opener for cold viewer: `[N-figure] founders...`, `$X+ in founders...`, `Watch [N-figure] founders...`

### Lowercase pendulum (when to deploy)
- Real trend in creator/lifestyle niches per the empirical benchmark data
- Deploy when audience is creator/operator
- DON'T deploy for tutorial/SEO content - capitalized still wins for searchable how-to

### Parenthetical type matters
- Outcome promises (`That'll Blow Up Your Business`) and scope claims (`Step-By-Step`, `Full Course`) outperform format signals (`Raw`, `2 Hours`) on the data we have.
- Format signals (`(raw, 2hrs)`, `(no edits)`) work for raw conversation/event content where viewer expectation-matching matters.
- Curiosity-gap parentheticals (`why they switched`) only earn keep if the video pays it off. Otherwise clickbait → retention drop.

### Anti-patterns (don't ship these)
- `Mastermind` keyword without dollar anchor in front (benchmark data)
- Generic `How To` without parenthetical outcome (Ed Tier 5)
- Negative/mistake framing for biz audience (Ed Tier 6 = his worst)
- Pop-culture metaphors as title concept (Ottley failing pattern)
- Holiday/seasonal dating
- Money-only frames for craft-focused creator audience
- Repeat formats (second milestone video underperforms first by 40x in Kallaway data)
- Unknown client testimonial names (Jeremy Haynes anti-pattern, sub-1K views)
- Fabricated numbers (never invent counts or dollars)

## Decision tree - content type → format selection

```
Is the video a TUTORIAL with replicable steps?
├── YES → Liam Ottley Formula 1 / Ed Tier 1 "Copy This" / Ed Tier 2 "EXACT"
└── NO → continue

Is the video a CONVERSATION / EVENT / MASTERMIND?
├── YES → continue to sub-tree below
└── NO → continue

   Sub-tree: Was the owner the HOST/AGENT (they organized, locked, brought together)?
   ├── YES (host-as-agent) → PRIMARY: actor-led "i locked [tier] in a [setting] and [verb] their [domain] with [tool] (raw, [runtime])"
   │                       SECONDARY: lowercase pendulum "this conversation led [tier] to [verb] (why they switched)"
   │                       TERTIARY: capitalized declarative "These [Tier] Just [Verb] Their [Domain]" (Ed Tier 3)
   └── NO (the owner was a PARTICIPANT or fly-on-wall) → "Inside the room where..." / "What [tier] actually do when..."

Is the video a NEWS / TREND / PREDICTION?
├── YES → Kallaway Formula 4 "Social Media Is" / Liam Formula 3 bold prediction
└── NO → continue

Is the video a CASE STUDY / RESULT REVEAL?
├── YES → Ed Tier 3 "She Built/He Made" / Specific dollar lead
└── NO → continue

Is the video a LISTICLE / RESEARCH ROUNDUP?
├── YES → Kallaway Formula 2 / Liam Formula 2 / specific number lead
└── NO → default to Kallaway Formula 3 "I [did X], here's what" + ICP authority
```

### Templated patterns (use these as starting points, fill the brackets)

**Host-as-agent event/mastermind (the calibration sample case):**
- `i locked [peer-tier] in a [room/villa/setting] and [verb] their [domain] with [tool] (raw, [runtime])`
- `i locked [peer-tier] in a room and they [verb] [their object] (raw)`

**Tutorial / system reveal:**
- `Copy This [System], It'll [Outcome]` (Ed Tier 1, his BEST)
- `The EXACT [System] To [Result]` (Ed Tier 2)
- `How to [Verb] [AI Thing]: [Qualifier]` (Ottley Formula 1, his BEST)

**Conversation/event without the owner as agent:**
- `Inside the room where [tier] [verb] [object]`
- `What [tier] actually [verb] when [condition]`

**Trend/prediction:**
- `[Tool/Industry] Is About to [Bold Claim]`
- `[Tool/Industry] Just [Dramatic Verb] [Impact]`

**Case study / result reveal:**
- `[Person/Tier] Just [Verb] [Specific Result]`
- `These [Tier] Just [Verb] Their [Domain] With [Tool]` (Ed Tier 3 third-party)

## Generation rules

### Verb power ranking (action verbs for biz/AI content)
Strongest → weakest:
1. `rewired`, `rebuilt`, `nuked`, `scaled`, `cracked` - high CTR + technical fit
2. `transformed`, `automated`, `replaced`, `disrupted` - solid but more common
3. `changed`, `improved`, `helped`, `built` - generic, weak
4. `taught`, `discussed`, `talked about` - weakest (passive)

Avoid `brainwashed` for serious operator/professional audiences - high CTR but credibility cost. Use only for high-energy creator audience.

### Power words (verified in loaded blueprint data)
| Word | Source | Usage |
|---|---|---|
| `EXACT` / `EXACTLY` | Ed Tier 2 (60K avg) | System reveals |
| `Copy This` | Ed Tier 1 (121K avg) | Imperative |
| `Just` | Cross-creator | Recency signal |
| `Actually` | Ed contrarian | Implies common belief is wrong |
| `Quietly` | Pattern observation | Insider/forbidden frame |
| `Live` / `On Camera` | Anti-polish | Authenticity signal |
| `Raw` / `No Edits` / `Uncut` | Format signal | Filters viewers |
| `KILLING` / `BROKE` / `NUKED` | Kallaway/Ottley | Caps for emotion |
| `Nobody Teaches This` | Kallaway parenthetical | Exclusivity |

### Banned words (content-voice rule + voice-check)
Don't use in any title: `unlock`, `revolutionize`, `game-changer`, `genuinely`, `honestly`, `straightforward`. No em dashes. No emojis unless the owner uses them first. Extend with the owner's banned-word list from `voice-check`.

## Thumbnail packaging rules

The thumbnail text complements OR contradicts the title to drive curiosity. The two work as a system, not in isolation.

### Format rules (Ed + Kallaway combined)
- 2-5 words maximum
- Bold uppercase (readable at small feed size)
- High contrast against background
- 3-element rule: face + text + ONE visual element
- Squint test: legible when blurred = ship; not legible = simplify
- Match thumbnail to what actually happens in the video (clickbait destroys retention)

### Cognitive dissonance principle (Ed Lawrence's #1 thumbnail rule)
The thumbnail TEXT should contradict what the visual implies. The contradiction forces the click.

Examples that work:
- Visual: polished founders / Text: `AI BROKE THEM`
- Visual: smiling room / Text: `WE ALMOST DIDN'T POST`
- Visual: the owner looking serious / Text: `I REGRET THIS`
- Visual: $100M+ founders / Text: `EVERYONE WAS WRONG`

### Pairing strategy
- If title is action-led (`I locked...`) → thumbnail goes voyeur/forbidden (`THEY DIDN'T KNOW`)
- If title is artifact-led (`The conversation that...`) → thumbnail goes provocative (`AI BROKE THEM`)
- If title is voyeur (`Inside the room...`) → thumbnail goes outcome-tease (`$X HAPPENED HERE`)

The principle: title says one thing, thumbnail teases a related but different thing. Viewer clicks to resolve.

## A/B test design rules

### Three-slot test should isolate ONE variable
Slots must differ in MECHANISM, not in suffix:
- Declarative (`These founders did X`)
- Lowercase casual (`i locked them and they did X`)
- Imperative (`Watch founders do X`)
- Question (`Why are founders doing X?`)
- Third-party (`The founders who did X`)

If slots only differ in parenthetical, you're testing parenthetical preference (narrow learning).

### Statistical signal threshold
- Need ~1000 impressions per slot minimum for clean signal (3000+ across the test)
- New channels often don't hit this fast - test results are noise
- For new channels with low impression volume: pick best single title, ship, evaluate after 14 days

### Anchor consistency
Keep the authority anchor (dollar / tier / count) IDENTICAL across all 3 slots. Vary only the opener mechanism. Otherwise you've changed two variables.

## Self-evaluation rubric (score 1-10 per dimension, harsh)

| Dimension | What to check |
|---|---|
| Authority anchor specificity | Is the dollar/tier/count concrete and verifiable? Vague "successful founders" = 5. Specific "$100M+ in founders" = 9. |
| Verb power | "Rewired" / "Rebuilt" / "Nuked" = 9. "Talked about" / "Discussed" = 4. |
| Mechanism match | Does the opener match the content type per decision tree? |
| Cold-viewer authority load | First 3-5 words deliver credibility punch? |
| Mobile readability | Critical info in first 60 chars? |
| Pendulum fit | Lowercase fits creator/operator audience; capitalized fits tutorial/SEO. Match. |
| Curiosity-gap honesty | If parenthetical teases payoff, does video deliver? |
| Anti-pattern check | Free of fabricated numbers, banned words, generic frames? |

**Iteration rule**: avg < 8.5 → fix lowest dimensions, re-score. Max 3 iterations. Don't ship a 7/10 title.

## Workflow

### Standard flow

1. **Run pre-flight** (above). If gaps, ASK the owner.
2. **Identify content type** via decision tree.
3. **Generate 10-15 candidates** across 3-5 mechanisms.
4. **Score each** on the rubric (harsh).
5. **Pick top 5**, iterate weakest dimensions on each.
6. **Pair thumbnail text** with each top candidate (cognitive dissonance principle).
7. **Recommend ship plan**: single best (new channel) OR 3-slot test with mechanism variation.
8. **Verify honesty checks**: numbers verifiable, narrative arc real, ICP match.
9. **Output structured deliverable** (see below).

### Output format

```markdown
## Pre-flight summary
- Content type: [X]
- Runtime: [X]
- Authority anchor: [X - VERIFIED/NEEDS_VERIFICATION]
- ICP: [audience stream]
- Channel state: [new / established]
- Narrative arc: [described]

## Top 3 candidates with scores

| Slot | Title | Mechanism | Score | Char count |
|---|---|---|---|---|
| A | ... | declarative | 9.0 | 64 |
| B | ... | lowercase | 8.5 | 71 |
| C | ... | imperative | 8.5 | 66 |

## Thumbnail text pairing

| Slot | Thumbnail text | Visual concept |
|---|---|---|
| A | ... | ... |

## Ship recommendation
[Single best OR 3-slot test, justified]

## Pending verifications
[Any honesty checks user needs to confirm before publishing]
```

## Triggering this skill

User phrases that should auto-trigger this skill:
- "brainstorm a YouTube title"
- "title this video"
- "thumbnail and title for [X]"
- "package this video"
- "A/B test slots for [X]"
- "what should I call my YouTube video"
- "score these YouTube titles"
- User provides a video file/URL/transcript with publishing intent
- User mentions YouTube + title/thumbnail in the same brain dump

When triggered, run pre-flight FIRST. Don't generate titles before context is gathered.

## Related skills (use in combination)

- **voice-check** - score voice authenticity if title is in the owner's voice
- **content-pipeline** - for full content workflow (research → draft → voice-check → publish)
- **/transcribe** - if you only have a video file, transcribe first
- **YouTube-Apify rule** - if you have a YouTube URL, use the Apify command for transcript (`cd automations/youtube && node transcripts.js "<url>"`)
- **quality-gate** - auto-trigger after generating titles

## Reference data sources (load when needed, don't load all by default)

- `memory/content/creator-blueprints/` - per-creator title/thumbnail and hook files (corpus starts empty; build via `creator-deep-dive`. The framework data above is inlined so the skill works without it)
- `memory/content/youtube-title-performance-log.md` - the owner's empirical title performance log (created by the maintenance protocol below)
- `memory/content/` strategy docs - channel strategy

## What this skill enforces

- **Research-before-claims rule** - never invent counts, dollar amounts, or peer tiers. Confirm with the owner before publishing.
- **Contrarian-default rule** - push back on user proposals when frameworks contradict them. Defend reasoning. Don't fold on displeasure.
- **Concise-chat rule** - output as bullets/tables, not prose walls.
- **No em dashes, no banned words** - applies to titles too.
- **Quality-gate rule** - iterate until avg ≥ 8.5 before recommending ship.

## Defending vs conceding protocol (contrarian-default enforcement specific to this skill)

When the owner pushes back on title recommendations, run this check BEFORE responding:

| Pushback type | Action |
|---|---|
| Owner provides NEW EVIDENCE (e.g. "the room was actually 21 people, not 9") | **Concede cleanly**, fix the fabrication, no apology theater. |
| Owner POINTS OUT a real error (typo, fabrication, contradiction with their stated context) | **Concede cleanly**, fix, move on. |
| Owner EXPRESSES PREFERENCE without new evidence ("I like the lowercase one better") | **Concede only if the preference is consistent with frameworks**. If frameworks contradict the preference, defend with data. |
| Owner EXPRESSES DISPLEASURE without specific argument ("these aren't great") | **Defend the strongest title with framework data**. Show the rubric scores. Don't fold. |
| Owner QUESTIONS A RULE you cited ("are you sure length matters?") | **Show the underlying data** (top performer char counts, etc.). Cave only if data supports the cave. Frame the cave as "data-correct revision", not "I overstated". |

The failure mode this prevents: caving on displeasure looking sycophantic, or defending with bare assertions when data would actually support the cave. Show your work either way.

## When to escalate to the owner (don't iterate silently past 3 rounds)

If after 3 internal iterations the rubric average is still below 8.5:
1. Stop iterating
2. Output: "Hit 3-iteration cap at avg [X]. Lowest dimensions are [list]. This either needs a new mechanism direction or a content reframe - what's your call?"
3. Wait for the owner to redirect, don't push further

This prevents 6-message loops on the wrong family of titles.

## Maintenance protocol - keeping this skill empirically grounded

This skill MUST be updated as videos ship. Stale skill = stale advice.

### After every video ships
Within 14 days of publishing, append the following data to `memory/content/youtube-title-performance-log.md`:

| Field | What to capture |
|---|---|
| Date | Publish date |
| Title | Exact title used |
| Mechanism | actor / artifact / voyeur / declarative / question / imperative |
| Anchor type | dollar / tier / count / named guest |
| Char count | Total chars |
| Lowercase? | yes/no |
| Parenthetical | text used, if any |
| Impressions (14-day) | from YT Studio |
| CTR | from YT Studio |
| Channel avg multiplier | from YT Studio (the X.Yx badge) |
| Avg view duration | retention proxy |
| Notes | what worked, what didn't, any surprise |

### When to update this skill file
- After every 5 videos shipped → review the log, see if any framework lock-ins need revising
- If a NEW pattern emerges (e.g., a specific verb consistently outperforms `rewired`, or lowercase stops working), update the relevant section here
- If a pattern in the loaded frameworks turns out to be WRONG for the owner's audience (e.g., Ed Tier 1 "Copy This" tanks for their viewers), flag it in the framework section with a `// REVISED YYYY-MM-DD` note
- If the trigger phrases need expansion based on how the owner actually invokes the skill, update both this file and the skills routing index

### Trigger for skill update review
After any of these events, consider running quality-gate on this skill:
- 5+ videos shipped without an update
- 3+ failed first-shot title generations (the owner had to push back / iterate >5 messages)
- Major channel milestone (10K subs, first viral, format pivot)
- New high-relevance creator added to the blueprints corpus

## Related

- [[content-pipeline]]
- [[voice-check]]
- [[video-score]]
- [[youtube-algorithm]]
- [[creator-oracle]]
