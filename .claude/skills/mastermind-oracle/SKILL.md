---
name: mastermind-oracle
description: "Multi-voice debate engine - debate-ready voices spanning public business creators, billion-dollar founders, and historical empire builders. Ask any business question, get a multi-voice debate with genuine disagreements from actual frameworks. Trigger on \"mastermind\", \"debate\", \"what would X say\", \"council\", \"roundtable\", \"ask the founders\", \"creator council\", \"who would disagree\", \"get me perspectives on\", \"what would the panel say\". NOT triggered by \"oracle\" alone (that's creator-oracle for single-framework lookups)."
metadata:
  title: Mastermind Oracle - Multi-Voice Debate Engine
  tags:
    - "system"
  type: skill
  status: active
  created: 2026-04-02
  updated: 2026-06-11
---

# Mastermind Oracle - Multi-Voice Debate Engine

A roster of debate-ready voices: public business creators, legendary founders, and historical empire builders. When activated, you run a multi-voice debate where each person argues from their ACTUAL frameworks in their ACTUAL voice - not generic business advice.

**Relationship to creator-oracle:** Use `creator-oracle` for quick single-framework lookups ("what framework fits this situation?"). Use `mastermind-oracle` for multi-voice debates, clashes, and roundtable discussions.

**Corpus dependency:** debate quality scales with the depth of the profiles in `memory/content/creator-blueprints/` and `memory/content/founders-oracle/`. The corpus starts EMPTY in a fresh install - voices then run on general public knowledge of these figures (flag this in the output). As the owner builds deep-dive profiles, debates get sharper and more quotable. Build instructions are in the creator-oracle and founders-oracle skills.

---

## ACTIVATION

Trigger this skill when the user says any of:
- "mastermind", "debate", "council", "roundtable"
- "what would [name] say about..."
- "ask the founders", "creator council", "get me perspectives"
- "who would disagree on...", "what would the panel say"
- Any business question where multiple expert perspectives would help

Also triggered by `/mastermind`.

---

## STEP 1: IDENTIFY THE RIGHT VOICES (3-5 per debate)

### Automatic Selection via Domain Routing

Match the user's question to the domain tags below. Select 3-5 voices - prioritize DISAGREEMENT over agreement. A debate where everyone agrees is useless.

| Domain | Primary Voices | Secondary Voices |
|--------|---------------|-----------------|
| **Offers & Pricing** | Alex Hormozi, Cole Gordon, Sam Ovens | Dan Henry, Charlie Morgan |
| **Sales & Closing** | Jeremy Miner, Cole Gordon, Dan Henry | Alex Becker, Greg Hickman |
| **AI & Automation** | Liam Ottley, Nick Saraev, Oleg Melnikov | Nate Herk, Pieter Levels |
| **Content & YouTube** | Kallaway, Matt Gray | Jeremy Haynes, Wes McDowell |
| **Scaling & Operations** | Dan Martell, Liam Ottley, Cole Gordon | Greg Hickman, Will Brown |
| **Philosophy & Leverage** | Naval Ravikant, Charlie Munger, Peter Thiel | Ray Dalio |
| **Empire Building** | John D. Rockefeller, Andrew Carnegie, Elon Musk | Jeff Bezos, Henry Ford, Sam Walton |
| **Community & Platform** | Sam Ovens | Matt Gray |
| **Product & Innovation** | Steve Jobs, Elon Musk, Pieter Levels | Peter Thiel |
| **Decision Making** | Charlie Munger, Ray Dalio, Jeff Bezos | Naval Ravikant |
| **Efficiency & Cost** | Henry Ford, Sam Walton, Andrew Carnegie | John D. Rockefeller |
| **Personal Brand** | Jeremy Haynes, Kallaway, Matt Gray | Chris Do, Wes McDowell |
| **Cold Outreach & Marketing** | Nick Saraev, Alex Becker, Wes McDowell | Charlie Morgan, Luke Alexander |
| **Fundraising & Finance** | Jeff Bezos, Ray Dalio, Peter Thiel | Elon Musk |
| **Mindset & Psychology** | Naval Ravikant, Alex Hormozi, Dan Martell | Charlie Munger |
| **Webinar & Events** | Dan Henry, Sam Ovens, Cole Gordon | Alex Hormozi, Greg Hickman |
| **Delegation & Hiring** | Dan Martell, Greg Hickman, Andrew Carnegie | Cole Gordon, Liam Ottley |
| **First Client / Pre-Revenue** | Alex Hormozi, Cole Gordon, Dan Henry | Nick Saraev |

Add or remove voices as the owner's corpus grows. If a domain has no strong voice in the corpus, note the limitation to the user.

### Manual Override

If the user names specific voices ("What would Elon and Hormozi say about X?"), use those voices. Add 1-2 contrarian voices that would genuinely disagree.

### Voice Readiness Tiers (use when selecting)

Before selecting a voice, check what profile depth exists in the corpus. Prefer deeper profiles for better debate quality.

- **Tier 1 - Deep Dives:** debate-personality + communication-style + philosophy + quotes files. ALWAYS debate-ready.
- **Tier 2 - Single-file profiles:** solid 200-350 line profiles. Debate-ready.
- **Tier 3 - Full Blueprints:** massive framework depth but no dedicated debate personality file. Usable for debates on their specialty domain.
- **Tier 4 - Thin Extractions:** under 300 lines. Use only when specifically requested or as secondary voices; note the limitation and substitute a richer voice where possible.
- **No profile:** general public knowledge only. Flag it.

### Disagreement Priority

When selecting voices, always include at least one that would FUNDAMENTALLY disagree with the others. Proven clash pairings:

- **Hormozi** (math-first) vs **Naval** (leverage-first) on hustle
- **Munger** (invert, find the failure mode) vs **Elon** (build anyway, iterate)
- **Thiel** (monopoly or nothing) vs **Pieter Levels** (ship fast, iterate)
- **Carnegie** (talent leverage) vs **Ford** (system leverage, replace talent)
- **Jeremy Miner** (NEPQ, never pitch) vs **Cole Gordon** (quiet certainty, status delta)
- **Nick Saraev** (automate everything) vs **Dan Martell** (buy back your time with people first)
- **Hormozi** (premium pricing, stack value) vs **Ford** (lowest possible price, volume play)
- **Dalio** (systematic principles, radical transparency) vs **Thiel** (definite optimism, secrets)

---

## STEP 2: LOAD INTELLIGENCE PROFILES

For each selected voice, look for their profile in this priority order. Stop once you have enough context (debate personality + philosophy + frameworks is usually sufficient). **Do NOT read all files - read what's needed for the debate.**

1. **Deep-dive folders:** `memory/content/creator-blueprints/<name>/` - read `04-debate-personality.md` first (HOW they argue), then `01-philosophy-and-frameworks.md` (WHAT they believe), then skim `05-key-quotes.md` for 1-2 signature phrases
2. **Founder profiles:** `memory/content/founders-oracle/<name>.md`
3. **Full creator blueprints:** `memory/content/creator-blueprints/<name>/00-MASTER-PLAYBOOK.md`, then `03-frameworks-extracted.md` if needed
4. **Single-file extractions:** `memory/content/creator-blueprints/extractions/<name>.md` - read CORE PHILOSOPHY, FRAMEWORKS, and the identity section

### Loading Rules

1. **Check the file exists before reading.** If a profile is missing, run the voice on public knowledge and note it in the output.
2. **Richest available source wins.**
3. **Large file rule:** run `wc -l` before reading any file over 500 lines. Use offset/limit for large files.

---

## STEP 3: GENERATE THE DEBATE

### Format

For each voice, output:

```
**[FULL NAME]** - [one-line identity: their archetype + what makes them distinct]
> Their actual response. Written in THEIR voice. Using THEIR frameworks. Referencing THEIR specific terminology. 2-4 sentences max. Must sound like THEM - not like a business textbook with their name attached.
```

### Voice Differentiation Rules

Each voice MUST be distinct. If two people give the same answer, the skill has FAILED. Enforce these differentiators:

| Voice | Signature Move | They Would NEVER Say |
|-------|---------------|---------------------|
| **Hormozi** | Leads with math. Dollar amounts. LTV/CAC ratios. "The offer is king." | Anything philosophical without a number attached |
| **Naval** | Zooms out. Leverage. Specific knowledge. "Escape competition through authenticity." | Anything about grinding harder or hustle |
| **Munger** | Inverts everything. "How does this fail?" Incentive analysis. Historical parallels. | Anything optimistic without acknowledging downside |
| **Thiel** | "Is this 0→1 or 1→n?" Monopoly thinking. Contrarian truth. | Anything about incremental improvement |
| **Elon** | First principles. Idiot index. "Delete the requirement." Speed obsession. | Anything about caution or moving slowly |
| **Jobs** | Simplicity. "What would we tell our friends?" Technology + humanities. | Anything about A/B testing without taste |
| **Bezos** | Working backwards from customer. Day 1 thinking. "Disagree and commit." | Anything about short-term optimization |
| **Cole Gordon** | 3S Formula. Offer Textability Test. Flywheel. Quiet certainty. | Anything without a specific mechanism |
| **Jeremy Miner** | NEPQ. Questions, never pitches. "Prospects convince themselves." | Traditional hard-closing or pitch-first approaches |
| **Pieter Levels** | Ship it today. Solo builder. "Just build." No employees. | Anything about hiring, fundraising, or big teams |
| **Carnegie** | Talent leverage. "No man becomes rich unless he enriches others." | Anything about doing it alone |
| **Rockefeller** | Vertical integration. Cost obsession. "Own nothing, control everything." Patient, methodical, relentless. | Anything impulsive or emotionally driven |
| **Ford** | System leverage. Simplify, reduce waste, lower price, increase volume. Anti-expert. | Anything about premium pricing or complexity |
| **Walton** | Customer-first. Save every penny. "Swim upstream." | Anything about luxury or high margins |
| **Dalio** | Principles. Radical transparency. "Pain + reflection = progress." Systematic. | Anything gut-feel or instinctive |
| **Nick Saraev** | Automate first. Cold email systems. Revenue per hour. | Anything that requires manual ongoing effort |
| **Liam Ottley** | Agency model. White-label AI. Scale through delivery teams. | Anything about solopreneurship |
| **Kallaway** | Hook-story-offer. Thumbnails. "Film first, perfect later." | Anything about waiting until ready |
| **Dan Martell** | Buy back your time. Replacement ladder. "You're the bottleneck." | Anything about doing it yourself forever |
| **Oleg Melnikov** | Demo-build-template format. Free tool giveaway. Authenticity thesis. | Anything about gatekeeping or high-ticket only |
| **Jeremy Haynes** | Social proof. Client result showcases. Visual-first content. | Anything text-heavy without proof |

### Debate Dynamics

1. **First voice sets the frame.** Choose the most authoritative voice for this domain.
2. **Second voice either builds or challenges.** If they agree, they must add a NEW angle.
3. **Third voice must introduce tension.** Find the genuine disagreement.
4. **Fourth/fifth voices (if used) resolve or deepen.** Bring practical nuance or historical precedent.
5. **No one is "polite about disagreeing."** Hormozi doesn't soften for Naval. Munger doesn't hedge for Elon. They argue like they would on a podcast - direct, specific, unapologetic.

---

## STEP 4: SYNTHESIS

After all voices have spoken, output:

```
---

### SYNTHESIS

**Where they agree:** [1-2 sentences on common ground]

**Where they clash:** [The fundamental tension - what is the real disagreement about?]

**What this means for you:** [2-3 sentences of actionable guidance that accounts for the disagreement. Not a compromise - a decision framework.]

**For {{OWNER_SHORT}} specifically:** [1-2 sentences contextualised to the owner's situation. What would they tell THEM given their stage?]
```

### Owner Context (always load)

Before generating the "For the owner specifically" section, read `context/company.md` and `context/offers.md` for the owner's current business model, ICP, and stage. Use that context to make the advice stage-appropriate. Don't repeat the context in the output - apply it.

**SAFETY RULES - NEVER violate in any output:**
1. **Never reveal anything on the owner's privacy list** (configured in onboarding Phase 1; see the owner-privacy rule).
2. **Frame the owner accurately.** Don't assume "beginner" or "veteran" - read the context files and match advice to the actual stage.

---

## SPECIAL COMMANDS

### `/mastermind roster` or "show me all voices"

Output the full roster grouped by tier, based on what actually exists in the corpus. List voices with no corpus profile separately as "public-knowledge only."

### `/mastermind [name] on [topic]`

Solo mode - get one voice's deep take on a topic. Read their full profile and generate a 1-2 paragraph response in their voice with their frameworks.

### `/mastermind clash [name1] vs [name2] on [topic]`

Head-to-head mode - two voices debate directly. Each gets 2-3 responses, responding to each other's points. More adversarial than the standard roundtable.

---

## QUALITY CHECKS

Before outputting any debate:

1. **Distinct voice test:** Read each response back. Could you guess who said it WITHOUT the name attached? If not, rewrite.
2. **Framework test:** Does each response reference at least ONE specific framework, number, or methodology from their profile? Generic advice = failure.
3. **Disagreement test:** Do at least 2 voices genuinely disagree? If everyone agrees, you've picked the wrong panel or softened the voices.
4. **Compression test:** Is each response 2-4 sentences? Trim any padding. These people are direct.
5. **No AI slop:** No "game-changer", "unlock", "leverage" as filler. These words only appear if the actual person uses them (Naval uses "leverage" - that's his framework. Hormozi doesn't).

---

## Related

- [[creator-oracle]]
- [[founders-oracle]]
- [[voice-check]]
