---
name: guest-intel
description: "Top-tier podcast guest research for the owner's show. Triggers on 'research [name] before interview', 'guest intel for [name]', 'deep dive on [guest]', 'prep for [guest] podcast', or any guest research request. Orchestrates a 12-step pipeline: identity verification → LinkedIn/YouTube/Twitter/IG scrape → Wayback Machine for buried content → past podcast appearances → news + corporate filings → buried-stories extraction → 15 high-leverage questions ranked by virality potential → dossier output at memory/content/podcast/guests/{slug}/dossier.md. Implements the Hot Ones 'abandoned threads' technique, the pre-loaded big-claim protocol, Ferriss Wikipedia-citation mining, and a 3-signal identity verification gate. Costs roughly $1-2 per guest and is ~10x faster than a 6-8hr manual SOP."
type: skill
status: active
created: 2026-04-20
updated: 2026-06-11
audience: the owner (host), producer, EA
---

# Guest Intel - Top-Tier Podcast Guest Research

> **What this is.** A pipeline that produces a single `dossier.md` per podcast guest. Read time 15 min. Surfaces buried stories, deleted tweets, abandoned interview threads, and 15 high-leverage questions the owner would not find from a surface-level Google.
>
> **Why this exists.** Surface-level research is what 95% of podcasts do. This skill compresses a 6-8 hr manual research SOP into ~15 min wall-clock + 30 min review, and goes deeper than Google: archived content, deleted posts, and unfinished threads from past interviews.

---

## When to Trigger

Activate when:

- "Research [name] before interview"
- "Guest intel for [name]"
- "Deep dive on [guest]"
- "Prep for [guest] podcast"
- "Build dossier for [guest]"
- The owner confirms a recording with a new guest in `memory/content/podcast/guests.md`
- A guest is added to the podcast tracker (if one is configured) without an existing dossier

Skip when:
- Guest already has a dossier <90 days old (refresh quarterly)
- The "guest" is actually a known internal contact - use the existing dossier in `memory/people/`

---

## Tooling note (fresh install)

The pipeline below names scraper modules (LinkedIn, Twitter, Instagram, Wayback, podcast search). These are **optional automation modules** - if a module isn't installed in `automations/`, substitute the equivalent manual path: WebSearch + Firecrawl/defuddle scraping + the Wayback Machine web UI. The YouTube steps always use the Apify transcript pipeline at `automations/youtube/` (ships with the OS). The methodology is identical either way; only the speed changes.

## The 12-Step Pipeline

Run sequentially. Each step writes raw data to `memory/content/podcast/guests/{slug}/raw/`. Final synthesis at Step 12.

### Step 0 - Seed Inputs (from the owner)

Required minimum: **guest name + at least 2 of these:** LinkedIn URL, YouTube channel, Twitter handle, Instagram handle, company name, country.

If only the name is provided, ask the owner for the LinkedIn URL or company. Don't guess - wrong-person dossiers are catastrophic.

Create folder structure:

```
memory/content/podcast/guests/{slug}/
├── dossier.md              # final output
├── raw/
│   ├── identity.json       # disambiguation evidence
│   ├── linkedin.json       # full profile + posts
│   ├── youtube.json        # channel + top transcripts
│   ├── twitter.json        # current + Wayback archived
│   ├── instagram.json      # captures
│   ├── wayback.json        # historical website/profile snapshots
│   ├── podcasts.json       # past appearances
│   ├── news.json           # news, last 12 months
│   └── companies.json      # corporate filings if applicable
└── question-bank.md        # the 15 questions + customization notes
```

### Step 1 - Identity Verification Gate (HIGH confidence required)

**Block the rest of the pipeline until identity is HIGH confidence.** Wrong-person dossiers waste a recording and embarrass the host.

Cross-reference 3+ signals from:
- Headshot (LinkedIn vs. YouTube channel banner vs. Twitter pfp - all match?)
- Employer (LinkedIn current role vs. corporate registry director listings)
- Location (city/country consistent across platforms)
- Handle pattern (which variant is the right person?)
- Education/career timeline consistency
- Mutual connections (do their LinkedIn 1st-degrees include people the owner knows?)

Scoring:
- **HIGH (proceed):** 3+ signals match
- **MEDIUM (proceed with flag):** 2 signals match - write `[VERIFY]` markers throughout the dossier
- **LOW (BLOCK):** ≤1 signal - return to the owner with a disambiguation question. Never ship a LOW-confidence dossier.

Write `raw/identity.json` with the matched signals.

### Step 2 - LinkedIn Full Scrape

Capture via the LinkedIn module or Playwright session:
- Full profile (current role, all past roles with dates, education, certifications)
- Last 100 posts (text + engagement)
- Recommendations given + received
- Featured section content

Write `raw/linkedin.json`.

### Step 3 - YouTube Channel + Top Transcripts (Apify pipeline)

```bash
cd automations/youtube && node transcripts.js "<video-url>"
```

Pull channel stats, then transcripts for the guest's top 5 most-viewed videos on their OWN channel. Why own-channel videos: this is where they speak unfiltered, no host steering. Pure POV.

Write `raw/youtube.json` with channel stats + 5 transcripts.

### Step 4 - Twitter/X Current + Wayback

Capture current posts (module or manual), then pull the Wayback Machine snapshots of their Twitter profile for deleted/archived tweets.

This is one of the highest-leverage steps. Deleted tweets often contain the controversial belief or the "I was wrong" admission that becomes the vulnerability doorway.

Write `raw/twitter.json` (current) and `raw/twitter-wayback.json` (archived).

### Step 5 - Instagram Capture

Capture the 30 most-recent posts + reels. Look for:
- Family / location reveals
- Causes / charities they support (often pride points)
- Travel patterns (where they actually live vs. claim)

Write `raw/instagram.json`.

### Step 6 - Wayback Machine for Personal/Company Sites

Pull historical snapshots of their personal site, company site, and LinkedIn. Look for:
- Old "About" pages (different positioning years ago)
- Deleted blog posts
- Pricing changes / pivots
- Removed team members

Write `raw/wayback.json` (merged).

### Step 7 - Past Podcast Appearances

Search podcast directories (Listen Notes, Apple Podcasts, YouTube) for every show the guest has appeared on: show name + episode title + date + URL.

For the **top 5 most-recent appearances**, pull transcripts via the Apify pipeline if YouTube versions exist. These transcripts are the source for the **abandoned-threads mining** in Step 11.

Write `raw/podcasts.json`.

### Step 8 - News + Press

Use WebSearch with year-bound queries:

```
"<guest name>" news <current year>
"<guest name>" interview <last year>
"<guest name>" controversy
"<guest name>" funding round
"<guest name>" "stepping down" OR "leaving" OR "fired"
```

Write `raw/news.json`.

### Step 9 - Corporate Filings (where applicable)

- UK guests: Companies House search
- US public-company guests: SEC EDGAR
- Elsewhere: OpenCorporates

Verify: founding-date claims, director appointments, dissolutions, prior companies.

Write `raw/companies.json`.

### Step 10 - Wikipedia Citation Mining (Ferriss technique)

If the guest has a Wikipedia page:

1. Fetch the Wikipedia URL
2. Extract every reference link (numbered citations)
3. Fetch the 5 most obscure-looking citations (academic papers, local newspaper archives, niche industry pubs)
4. Mine for bio details competitors won't have

Write findings into `raw/news.json` under `wikipedia_citations`.

### Step 11 - Abandoned Threads Mining (Hot Ones technique - THE GOLD STEP)

For each of the top 5 prior podcast appearances (transcripts captured in Step 7):

1. Read the transcript
2. Identify moments where the guest started to say something interesting and the host moved on (look for: "actually", "you know what", "this is going to sound", "the thing nobody knows", "I shouldn't say this but", followed by a topic change)
3. Log each abandoned thread as a candidate question

Format each as:
```
- Source: <podcast name>, <date>, <timestamp>
- The guest started to say: "<exact quote>"
- The host moved on without follow-up
- The owner's recovery question: "..."
```

This is the differentiator vs. surface-level Google.

### Step 12 - Synthesis → dossier.md

Read all `raw/*.json` files. Build the dossier following the template in Section 4. Generate the 15 high-leverage questions per Section 5. Run synthesis in-conversation for the first 10 dossiers (better customization), then consider scripting it.

Write to `memory/content/podcast/guests/{slug}/dossier.md`.

---

## Section 4 - Dossier Template

```markdown
---
title: Guest Dossier - {Name}
guest: {name}
podcast: {the owner's show}
status: ready / needs-pre-call / needs-verify
identity_confidence: HIGH | MEDIUM | LOW
icp_resonance: X/10
created: YYYY-MM-DD
last_refresh: YYYY-MM-DD
---

# Guest Dossier - {Name}

## 0. Identity Verification (Gate)
- **Confidence:** HIGH | MEDIUM | LOW
- **Signals matched:** [employer / location / headshot / handle / timeline / mutual connections]
- **Photo verified via:** [URL of cross-referenced image]
- **Any [VERIFY] flags:** ...

## 1. Who They Are (one paragraph, fact-only)
4-5 sentences. No fluff. No adjectives. Pure verifiable facts.

## 2. ICP Resonance Score
- **Score: X/10** (vs the owner's ICP: {{ICP}})
- **Why:** [reasoning]
- **Best angle for the show:** [the thread that fits the show's themes]

## 3. Career Timeline (verified)

| Year | Event | Source |
|---|---|---|
| ... | ... | LinkedIn / corporate registry / News |

## 4. Buried Stories (the 95% don't find)

1. **[Story 1 title]** - [1-sentence summary]
   - Source: [URL - Wayback / deleted tweet / old blog / niche article]
   - Why it matters: [the question or angle this opens]
2. ...
[Aim for 5-10 buried stories]

## 5. Past Interview Appearances

### Top 5 most-recent / most-viewed
| Show | Host | Date | URL | The clip-worthy moment |
|---|---|---|---|---|
| ... | ... | ... | ... | "[exact quote that landed]" |

### Abandoned Threads (Hot Ones gold)
For each: source + exact quote where they started → why the host dropped it → the recovery question.

[Aim for 3-5 abandoned threads]

## 6. Signature Phrases + Beliefs

### What they say repeatedly
- "[phrase 1]" - appears in [N] interviews
[Aim for 5]

### Contrarian beliefs they'd defend publicly
[Aim for 3]

### The under-discussed insight
- [The 1 claim everyone misses - the hook angle]

## 7. Public Controversies / Dead Zones

### Controversies
| When | What | Their public response | Host posture |
|---|---|---|---|
| ... | ... | ... | engage / acknowledge / steer past |

### Dead zones (DO NOT ask about)
- [Topic 1] - [why it's a dead zone]

## 8. Family / Personal Pride Points

The "how did you know that" moments. Use sparingly.

- The detail they always smile at: ...
- The achievement they're prouder of than the public-facing one: ...
- The mentor / parent / sibling they credit: ...

## 9. Emotional Hotspots (probe gently)

- Topics where they get visibly engaged: ...
- Topics where they get defensive: ...
- The vulnerability doorway candidate: [the one moment that opens them up]

## 10. The 15 High-Leverage Questions

Ranked by virality potential. Each tagged by pattern:
- **AT** = Abandoned Thread
- **OD** = Obscure-Detail-to-Character
- **PC** = Pre-loaded Claim
- **FP** = Forced Position
- **VD** = Vulnerability Doorway

| # | Q | Pattern | Virality (1-10) | Why it would resonate |
|---|---|---|---|---|
| 1 | ... | AT | 9 | Picks up a thread no host has touched in years |
| ... | | | | |
| 15 | ... | VD | 7 | Vulnerability moment, opens Act 2 |

## 11. The Locked First Question

> "[The actual question, customized with this guest's name + a specific number/belief from research]"

**Why this question for them:** [reason]

**3 follow-up branches prepared:**
- IF they answer [direction A]: ...
- IF they answer [direction B]: ...
- IF they deflect: ...

## 12. The 3 Big Claims to Pre-Agree

(Send to the guest ~5 days before recording as a Big-Claim Agreement Doc.)

1. ...
2. ...
3. ...

## 13. Story Arc Map

| Act | Time | Theme | Target claim | Peak moment target |
|---|---|---|---|---|
| 1 | 0-20 | The Hook | claim 1 | ... |
| 2 | 20-60 | The Descent | claim 2 + vulnerability | ... |
| 3 | 60-90 | The Philosophy | claim 3 | ... |

## 14. Sources + Raw Data

[List each raw/*.json file used]

---

Built by the `guest-intel` skill on {date}. Refresh quarterly or 30 days before re-interview.
```

---

## Section 5 - Question Bank Generation Patterns

When writing the 15 high-leverage questions, draw from these 5 patterns. Aim for 3 questions per pattern (15 total).

### Pattern AT - Abandoned Threads (Hot Ones)

- Take from Step 11 mining
- Format: "In your conversation with [host] in [year], you started to say [topic] but didn't finish. What were you going to say?"
- Or more subtle: "I noticed in [interview] you got close to [topic] then changed direction. Was there a reason?"

### Pattern OD - Obscure-Detail-to-Character Pivot

- State a hyper-specific fact from research
- Ask what it reveals about their thinking/operating
- Format: "You [specific obscure thing - flew 14 hours for a 30-min meeting, kept the same car for 12 years, etc.]. What does that say about how you make decisions?"

### Pattern PC - Pre-Loaded Big Claim

- From research, identify their 3 most controversial public claims
- Phrase them as recall + unpack
- Format: "You've said [X publicly]. Walk me through the moment you became willing to say that out loud."

### Pattern FP - Forced Position (Provocation Inversion)

- Take a conventional belief in their field, invert it
- Phrase so they can't give a monologue - they have to commit
- Format: "[Inversion]. So [implication that forces a choice]?"
- Example: "AI can run your business better than you can. So what is your job actually for?"

### Pattern VD - Vulnerability Doorway

- Story-shaped, low-stakes
- Specific moment, not abstract
- Format: "Tell me about the moment in [recent specific timeframe] where you [near-failure / doubt / had to swallow your ego]."

---

## Section 6 - Quality Gate

Before delivering the dossier, verify:

- [ ] Identity confidence is HIGH (or MEDIUM with explicit [VERIFY] flags)
- [ ] At least 5 buried stories sourced from non-Google sources (Wayback, deleted content, old podcast appearances, niche pubs)
- [ ] At least 3 abandoned threads from prior podcast appearances
- [ ] 15 questions generated, all 5 patterns represented
- [ ] First question customized with at least 2 specifics from research
- [ ] 3 big claims drafted, ready for pre-interview agreement
- [ ] Story arc maps to the recording structure
- [ ] All sources cited inline OR aggregated in Section 14
- [ ] No fabricated numbers - flag `[UNVERIFIED]` if not from a primary source
- [ ] Dead zones list is populated (even if empty - "no dead zones identified" is a valid entry)
- [ ] ICP resonance scored 1-10 with reasoning

If <8 of these check, iterate before shipping. Trigger the `quality-gate` skill if scoring is needed.

---

## Section 7 - Cost + Time Budget (reference, varies by configured modules)

| Step | Wall-clock | Cost |
|---|---|---|
| Identity verification | 1-2 min | Free |
| LinkedIn scrape | 2-3 min | small Apify/actor fee |
| YouTube channel + 5 transcripts | 3-5 min | small Apify fee |
| Twitter current + Wayback | 2 min | Free |
| Instagram capture | 2 min | small actor fee |
| Wayback for sites | 1-2 min | Free |
| Podcast appearances | 3-5 min | Free |
| News + WebSearch | 3 min | Free |
| Corporate filings | 2 min | Free |
| Wikipedia citations | 2 min | Free |
| Abandoned threads mining | 5-8 min | Free (transcripts already pulled) |
| Synthesis → dossier | 2-5 min | LLM cost |
| **Total** | **~30 min wall-clock** | **~$1-2 per guest** |

Active human time: ~30 min review + customization. Beats a 6-8hr manual budget by ~10x.

---

## Section 8 - Integration with the System

| System | How guest-intel interacts |
|---|---|
| Podcast tracker (sheet or file) | After the dossier ships, populate the guest row: name, dossier link, ICP score, top 3 questions, big claims |
| `media-hub` skill | Upload a PDF export of the dossier for mobile review if the owner wants it |
| `intro-forensics` skill | If the guest has prior podcast appearances on YouTube, run intro-forensics on the highest-engagement one to extract their hook style |
| `creator-deep-dive` workflow | For guests with their own large YouTube channel - adds a creator-DNA layer beyond the basic dossier |
| `quality-gate` skill | Auto-triggers post-dossier for scoring + iteration |
| notify module | One-line completion notification to the owner |

---

## Section 9 - Sub-Agent Instructions (when delegating steps)

If spawning sub-agents for parallel scraping, ALWAYS include:

```
Working dir: {{REPO_PATH}}
YouTube transcripts: cd automations/youtube && node transcripts.js "<url>" (NEVER WebFetch YouTube)
Save raw data to: memory/content/podcast/guests/{slug}/raw/
Never reveal anything on the owner's privacy list in any output
```

---

## Section 10 - Anti-Patterns (don't do)

1. **Don't skip identity verification.** A wrong-person dossier is worse than no dossier.
2. **Don't fabricate.** If a fact isn't in raw data, don't invent it. Mark `[UNVERIFIED]` and flag for the owner.
3. **Don't dump raw data into the dossier.** The dossier is a synthesis. Raw lives in `raw/`.
4. **Don't use surface-level Google as the primary source.** The whole point is the buried-content layer.
5. **Don't build the question bank without doing Step 11 (abandoned threads).** That's what separates this from a Wikipedia summary.
6. **Don't ship without the quality gate (Section 6).**
7. **Don't tell the owner to run a command.** Run it yourself.
8. **Don't WebFetch YouTube.** Apify pipeline only.
9. **Don't reveal anything on the owner's privacy list.**
10. **Don't use em dashes in the dossier prose.**

---

## Related

- [[intro-forensics]]
- [[podcast-intro-production]]
- [[quality-gate]]
