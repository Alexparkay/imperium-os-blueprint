---
name: video-score
description: "Pre-publish YouTube video concept scorer. Takes a video idea (topic, title, hook, thumbnail description) and scores it against title/hook frameworks, the owner's content rules, ICP profiles, trend data, and competitor outlier analysis. Returns a 0-100 composite score with category breakdowns and specific improvement suggestions. Iterates until score exceeds 80. Trigger on \"score this video\", \"would this perform\", \"rate this concept\", \"video score\", \"evaluate this idea\", \"is this a good video\", \"score this title\", \"title score\", \"how would this perform\", \"concept check\", \"pre-publish check\". Also auto-triggers when content-pipeline produces a video concept - score it before moving to scripting."
metadata:
  title: Video Concept Scorer - Pre-Publish Evaluation System
  tags:
    - "system"
  type: skill
  status: active
  created: 2026-04-02
  updated: 2026-06-11
---

# Video Concept Scorer - Pre-Publish Evaluation System

You are the quality gate between ideation and production. NO video concept moves to scripting without passing this scorer. Evaluate concepts against proven frameworks and real data, then iterate until the concept exceeds 80/100.

## MANDATORY: Read Before Scoring

1. `memory/content/` strategy docs - the owner's content rules, title checklist, format guidelines
2. `memory/content/creator-blueprints/` - title formulas, hook frameworks, thumbnail principles from studied creators
3. The owner's ICP profiles (from `context/` or `memory/content/`)

**Building your corpus:** creator-blueprints/ starts empty in a fresh install. Run `creator-deep-dive` on 2-3 creators in the owner's space to extract title formulas and hook templates - the scorer gets sharper with them. It works without them using the generic criteria below.

## ICP segments (calibrate during onboarding)

This scorer assumes two common segments. Rename/redefine for the owner:
- **Segment A - the buyer:** senior decision-makers who delegate (no tutorials, no tool names, outcome language)
- **Segment B - the operator:** hands-on practitioners who implement (tools and how-to are fine)

## Input: What You Need From the Owner

At minimum:
- **Topic/idea** - What the video is about
- **Target ICP segment** (A, B, or both)

Optional (you generate if missing):
- Working title candidates
- Hook concept
- Thumbnail concept
- Target format

---

## The Scoring Rubric (100 Points Total)

### Category 1: ICP Resonance (25 points) - "Would MY audience click this?"

This is the north star. Views from the wrong audience are worthless.

| Check | Points | Pass Criteria |
|-------|--------|---------------|
| Self-selection | 0-5 | ICP immediately thinks "this is for me." Industry named OR revenue/team size signalled? |
| Pain/desire hit | 0-5 | Addresses one of the Big 5: revenue, costs, competitors, time, risk? |
| Language match | 0-5 | Their language, not yours. No jargon or tool names the segment doesn't use? |
| Share test | 0-5 | Would a typical ICP member forward this in their peer group chat to a business partner? |
| Sales alignment | 0-5 | Could you SEND this to a specific prospect and have it make the next conversation warmer? |

**Auto-fail (entire category = 0) when targeting Segment A (the buyer):**
- [ ] Title contains tool names (e.g. Claude, n8n, ChatGPT)
- [ ] Title uses "How to" framing (tutorial signal)
- [ ] Title uses "I built" framing (self-focused)
- [ ] Content is about YOUR systems, not THEIR business
- [ ] Zero industry specificity

**Segment B modifier:** If targeting operators, the rules shift:
- Tool names are acceptable (they want to know the stack)
- "How to" is acceptable (they want implementation)
- Builder positioning works (they ARE builders)
- Share test = "Would an operator send this to their team Slack?"
- Language match = technical is fine, vague is not

### Category 2: Packaging (25 points) - "Would they CLICK this?"

Title and thumbnail scored as a UNIT. They must complement, not repeat.

**Title sub-score (15 points):**

| Check | Points | Pass Criteria |
|-------|--------|---------------|
| Three Tests | 0-5 | Text Test (would the ICP click if this were texted to them) + Event Test (would it land with a room of the ICP at a business event) + Share Test (would they forward it). All three must pass. FAIL ANY = max 2/5. |
| Construction rules | 0-5 | Binary checklist - score 1 point per rule passed (max 5): |
| | | [ ] Under 60 visible characters / 10 words |
| | | [ ] Contains odd specific number (2.7x, not 3x) |
| | | [ ] Creates knowledge gap (can't answer without watching) |
| | | [ ] Industry or specific descriptor named |
| | | [ ] Format brackets that signal value: (Calculated Audit), (Live Demo) |
| | | [ ] One word CAPITALISED for emphasis |
| | | [ ] No em dashes |
| | | [ ] No round multipliers (2x, 3x, 10x) |
| | | Score: (rules passed / 8) × 5, rounded |
| Formula + power words | 0-5 | Matches a proven title formula from the creator-blueprints corpus (which one? performance data for that formula?) + contains at least one power word? Without a corpus: does it match a known high-CTR pattern (negativity bias, curiosity gap, named entity, stakes)? |

**Title anti-patterns (deduct 2 points each, min 0) - buyer segment:**
- "How to [anything]"
- "I built [anything]"
- "Top X tools / best tools"
- "[Anything] for beginners"
- Generic brackets "(Here's the Difference)"
- Naming the audience as a category ("business owners") instead of a vivid descriptor

**Thumbnail sub-score (10 points):**

| Check | Points | Pass Criteria |
|-------|--------|---------------|
| Squint test | 0-3 | Shrink to phone-size mentally. Can you understand it in 0.5 seconds? 3 elements max (face + text + one visual). Not cluttered. |
| Title-thumbnail complementarity | 0-4 | Thumbnail adds NEW information, doesn't repeat the title. Together they create more curiosity than either alone. |
| ICP aesthetic | 0-3 | Looks like a business magazine cover, not a YouTube screamer (for buyer audiences). No screaming face, no arrows, no emojis. Calm/confident expression. Industry-relevant imagery if applicable. |

**If no thumbnail concept provided:** Score based on whether the title ALLOWS for a strong thumbnail (some titles are visually dead - nothing to show). Suggest thumbnail directions.

### Category 3: Trend & Demand (20 points) - "Is anyone looking for this RIGHT NOW?"

Timing is a multiplier. A great concept at the wrong time gets 1/10th the views.

| Check | Points | Pass Criteria |
|-------|--------|---------------|
| Active demand | 0-5 | Is this topic being actively searched or discussed right now? Pull data via `/yt-search` + web search (or the trends helper if built in `automations/youtube/`). |
| Outlier proof | 0-5 | Have similar topics produced outlier videos (3x+ channel avg) on competitor channels in the last 30 days? Check the competitor list below. |
| Wave timing | 0-5 | If riding a trend: is the wave still rising, peaking, or fading? If evergreen: is there a news hook to attach it to? |
| Competition gap | 0-5 | Is THIS SPECIFIC ANGLE being covered by competitors, or is there a gap? A trending topic with a unique angle > a unique topic nobody's searching for. |

**Scoring guidance:**
- Trending topic + unique angle + rising wave = 18-20
- Trending topic + common angle = 12-14
- Evergreen topic + strong news hook = 10-14
- Evergreen topic + no hook = 6-10
- Dead/oversaturated topic = 0-5

**Competitor channels (maintain the owner's list here; check at least 3 per scoring run).** Fill-on-first-use rule: if the list below still shows unfilled double-brace placeholder tokens (the pack-install question was skipped), STOP and ask the owner now - "Which 3 to 5 YouTube channels are your closest competitors?" - write the handles into this list (edit this installed file; fewer than five is fine, delete unused lines), then continue the run. Never score Category 3 against placeholder tokens.
```
1. @{{COMPETITOR_CHANNEL_1}}   # closest ICP match
2. @{{COMPETITOR_CHANNEL_2}}
3. @{{COMPETITOR_CHANNEL_3}}
4. @{{COMPETITOR_CHANNEL_4}}
5. @{{COMPETITOR_CHANNEL_5}}
```
Check via `/yt-search` per channel (or build a `competitors.js` helper in `automations/youtube/` once the manual flow gets repetitive).

**When to skip trend check (save research time/credits):**
- If the concept is a live audit of a REAL business (the person IS the hook, not the topic)
- If it's an interview with a named guest (the guest IS the draw)
- Score Trend & Demand at 12/20 (neutral baseline) and note "trend check skipped - concept is personality-driven"

### Category 4: Hook & Retention Design (15 points) - "Would YouTube PROMOTE this?"

The first 30 seconds determine whether the algorithm gives you more impressions.

| Check | Points | Pass Criteria |
|-------|--------|---------------|
| 2-second topic clarity | 0-4 | Viewer knows EXACTLY what this video is about within 2 seconds. Zero ambiguity. |
| Click confirmation | 0-4 | First 5 seconds confirm AND exceed the title's promise. No "Hey guys," no throat-clearing, no logos. |
| Hook template match | 0-4 | Maps to a hook template from the creator-blueprints corpus (which one?). Without a corpus: open loop, stakes, or specific-number opener? |
| Hook killer check | 0-3 | Zero violations: delay (>3 sec to topic), ambiguity (unclear what video is about), mismatch (hook ≠ title), overcomplication (too many concepts in opener) |

**If no hook provided:** Draft 3 hook options, score each, recommend the best. Each hook must:
- Open with the industry or a specific number
- Create an open loop within 5 seconds
- Match the owner's format structure for the chosen video format

**Hook scoring is LIGHTER at concept stage.** Full hook evaluation happens during scripting. Here you're checking: does this concept ALLOW for a strong hook? Some topics are inherently hard to hook ("[topic] trends in [year]" - boring opener inevitable). That's a concept problem, not a hook problem.

### Category 5: Strategic Value (15 points) - "Does this build the CHANNEL?"

Individual video performance matters less than channel trajectory.

| Check | Points | Pass Criteria |
|-------|--------|---------------|
| Pillar alignment | 0-3 | Fits one of the owner's content pillars (defined in `memory/content/`). Which one? Videos that don't fit a pillar confuse the algorithm about who your audience is. |
| Authority positioning | 0-3 | Positions the owner as trusted advisor, NOT hobbyist builder? Would watching this make someone think "I should talk to this person about my business"? |
| Format match | 0-3 | Uses one of the owner's proven formats (define the mix during calibration; a working default: Audit ~60%, Interview ~25%, Big Idea ~15%). Depart only with strong justification. |
| Uniqueness | 0-3 | This specific angle isn't being done by competitors in the same way. Not "is the topic unique" (trending topics aren't unique) but "is the TAKE unique"? |
| Compound value | 0-3 | Can be repurposed to newsletter + LinkedIn + shorts? Does it strengthen the next video's positioning? Does it create a reason for the viewer to subscribe (not just watch)? |

---

## Scoring Output Format

```
═══════════════════════════════════════════════════
  VIDEO CONCEPT SCORE
═══════════════════════════════════════════════════

CONCEPT: [Topic description]
TITLE: "[Working title]"
TARGET ICP: [A / B / Both]
FORMAT: [Audit / Interview / Big Idea / Documentary]

───────────────────────────────────────────────────
  CATEGORY SCORES
───────────────────────────────────────────────────

  ICP Resonance:        XX/25  [██████░░░░]
  Packaging:            XX/25  [████████░░]  (Title: XX/15 | Thumb: XX/10)
  Trend & Demand:       XX/20  [███████░░░]
  Hook & Retention:     XX/15  [█████░░░░░]
  Strategic Value:      XX/15  [████████░░]

  ─────────────────────────────
  TOTAL:                XX/100
  VERDICT:              [SHIP / ITERATE / RETHINK / KILL]
  ─────────────────────────────

  Auto-fail triggers:   [NONE / list any triggered]
  Title anti-patterns:  [NONE / list any found, -2 each]

───────────────────────────────────────────────────
  DETAILED BREAKDOWN
───────────────────────────────────────────────────

### ICP Resonance (XX/25)
- Self-selection: X/5 - [explanation]
- Pain/desire: X/5 - [which of the Big 5?]
- Language: X/5 - [specific words flagged or approved]
- Share test: X/5 - [would they forward? why/why not?]
- Sales alignment: X/5 - [which prospect could you send this to?]

### Packaging (XX/25)
TITLE (XX/15):
- Three tests: X/5 - Text [P/F], Event [P/F], Share [P/F]
- Construction rules: X/5 - [X/8 rules passed: list each]
- Formula + power: X/5 - Formula: [name], Performance data: [X], Power words: [list]
- Anti-patterns: [deductions if any]

THUMBNAIL (XX/10):
- Squint test: X/3 - [assessment]
- Complementarity: X/4 - [what does thumb ADD beyond title?]
- ICP aesthetic: X/3 - [magazine cover or YouTube screamer?]

### Trend & Demand (XX/20)
- Active demand: X/5 - [search data or skip justification]
- Outlier proof: X/5 - [competitor videos found, with view counts]
- Wave timing: X/5 - [rising/peaking/fading/evergreen + hook]
- Competition gap: X/5 - [what angle is missing?]

### Hook & Retention (XX/15)
- 2-second clarity: X/4 - [what does viewer know immediately?]
- Click confirmation: X/4 - [does opener exceed title promise?]
- Hook template: X/4 - Template: [name]
- Hook killers: X/3 - [violations if any]

### Strategic Value (XX/15)
- Pillar: X/3 - Pillar [#]: [name]
- Authority: X/3 - [advisor or builder?]
- Format: X/3 - [format + justification]
- Uniqueness: X/3 - [what's the unique take?]
- Compound: X/3 - [repurpose paths + next-video link]

───────────────────────────────────────────────────
  IMPROVEMENTS (Ranked by Point Impact)
───────────────────────────────────────────────────

1. [+X pts] [CRITICAL] [Specific fix with estimated point gain]
2. [+X pts] [HIGH] [Next fix]
3. [+X pts] [MEDIUM] [Additional fix]

Estimated score after fixes: XX/100

───────────────────────────────────────────────────
  ALTERNATIVE TITLES (Scored)
───────────────────────────────────────────────────

1. "[Title]" - XX/15 | Formula: [name] | Rules: X/8
2. "[Title]" - XX/15 | Formula: [name] | Rules: X/8
3. "[Title]" - XX/15 | Formula: [name] | Rules: X/8

───────────────────────────────────────────────────
  THUMBNAIL DIRECTIONS
───────────────────────────────────────────────────

1. [Description] - Complements title by: [how]
2. [Description] - Complements title by: [how]

───────────────────────────────────────────────────
  HOOK OPTIONS (Scored)
───────────────────────────────────────────────────

1. "[First 2 sentences]" - XX/15 | Template: [name]
2. "[First 2 sentences]" - XX/15 | Template: [name]
```

## Verdict Thresholds

| Score | Verdict | Action |
|-------|---------|--------|
| 85-100 | **SHIP** | Move to scripting. Strong concept. |
| 70-84 | **ITERATE** | Good bones. Apply improvements, re-score. |
| 50-69 | **RETHINK** | Core angle needs work. Don't polish - reframe. |
| 0-49 | **KILL** | Wrong audience, dead topic, or fatal positioning. Start fresh. |

## Iteration Protocol

If score < 80:
1. Apply the top 3 improvements (highest point-impact first)
2. Generate 3 alternative titles with scores
3. Re-score the full concept
4. Max 3 iterations. After 3 failed attempts: "This concept needs a fundamentally different angle. Here's why: [diagnosis]"

## Integration Points

**Auto-trigger flow:**
```
trend-intelligence → content-pipeline (Stage 2: Ideate) → video-score
  → SHIP (85+)    → content-pipeline (Stage 3: Draft) → scripting
  → ITERATE (70-84) → improve + re-score (max 3 rounds)
  → RETHINK (50-69) → back to ideation with diagnosis
  → KILL (<50)      → discard, log reason to ideas_backlog.md
```

**Manual trigger:** "Score this video" / "Would this perform?" / "Rate this concept"

## Post-Publish Feedback Log

After EVERY published video, append to `content-pipeline/research/video-performance-log.md`:

```markdown
## [Title] - Published [YYYY-MM-DD]

Pre-publish score: XX/100
Category scores: ICP XX/25 | Pkg XX/25 | Trend XX/20 | Hook XX/15 | Strat XX/15
Format: [Audit / Interview / Big Idea / Documentary]
ICP target: [A / B / Both]

### Actuals
- 24h views: [X]
- 7d views: [X]
- 30d views: [X]
- CTR: [X]% (from YouTube Analytics)
- AVD: [X]% (from YouTube Analytics)
- Likes: [X] | Comments: [X]

### Score vs Reality
- Prediction accuracy: [matched / overestimated / underestimated]
- What the score missed: [specific observation]
- Rubric calibration note: [any weight adjustment needed?]
```

After 10+ entries, review this log to calibrate scoring weights. If Trend & Demand consistently predicts performance better than ICP Resonance, adjust the weights. Let the data tell you.

---

## Related

- [[competitive-ideation]]
- [[trend-intelligence]]
- [[youtube-packaging]]
- [[quality-gate]]
