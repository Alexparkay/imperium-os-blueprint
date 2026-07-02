---
name: podcast-intro-production
description: |
  ONE-CALL podcast intro production framework for the owner's show. A single trigger phrase
  produces the complete editor-ready intro pack: deep guest research → identity verification (transcript
  vs internet presence) → diarized transcript with timestamps → hook + cliffhanger + narration extraction
  → VO draft generation in the proven viral-intro style → editor one-pager (PDF, landscape A4) + master
  pack (PDF) → rubric self-scoring → iteration loop until ≥9/10 → media-store + tracker sync.

  Triggers: "analyze the [X] podcast and give me the intro one-pager for the editor",
  "produce the intro for [guest]", "build the intro for [episode]", "run the intro pipeline for
  [guest]", "intro one-pager for [guest]", "editor pack for [guest]", "intro for [guest]'s episode",
  or any variant requesting the full pipeline.
metadata:
  type: skill
  status: active
  created: 2026-04-21
  updated: 2026-06-11
---

# Podcast Intro Production Skill

Single-call framework that takes a podcast episode (in the media store) plus a guest name and produces the full editor-ready intro pack: hooks, cliffhangers, narration script, one-pager PDF, and a rubric scorecard with iteration until the quality threshold passes.

**Core design decisions (learned from real pilot runs):**

1. **Single trigger phrase** - "analyze the [X] podcast and give me the intro one-pager for the editor"
2. **Three pre-check gates** - Identity (dossier vs transcript reconciliation), Speaker (sample-quote verification, never trust a small model alone), Transcript-claim (every concrete claim in VO must hit the transcript via grep)
3. **Voice & taste filters** - codified from real incidents (em dashes, fabricated qualifiers, tasteless dollar mentions, niche-narrowing, show-name dependence, word overuse)
4. **Rubric scorer** - 1-10 per beat, iteration loop until avg ≥9, no dimension <7
5. **Media-store-canonical sources** - resolve episode files from {{MEDIA_STORE}} first
6. **Editor one-pager as the primary deliverable** - landscape A4, 3-column variations grid

## When to trigger

**Primary canonical phrase:**
- "Analyze the [X] podcast and give me the intro one-pager for the editor"
- "Run the [X] podcast intro pipeline"
- "Intro one-pager for [guest]"

**Other supported phrases (full pipeline):**
- "Produce the intro for [guest]" / "Build the intro for the [episode] episode"
- "Generate hook sequence for [guest]" / "Editor pack for [guest]"
- "Find the [guest] podcast and give me the intro pack"
- Any request for the FULL intro production pipeline on a specific episode

**BACKFILL MODE phrases (tracker-only, no intro production):**
- "Backfill [guest]'s row in the tracker" / "Research [guest] and update the tracker"
- "Update [guest]'s socials in the tracker" / "Add [guest] to the tracker"

## When NOT to trigger

- The owner wants to ANALYZE another channel's intros (not produce their own) → use `intro-forensics`
- The owner wants hooks from an episode without building an intro → use the podcast intel extraction alone
- The owner wants to research a guest (no recording yet) → use `guest-intel`
- The owner wants a cheat-sheet or framework reference, not execution → point to the reference sections below

---

# MASTER FLOW - what happens on the trigger phrase

```
TRIGGER: "Analyze the [Guest] podcast and give me the intro one-pager for the editor"
   │
   ▼
STAGE 0: PARSE + RESOLVE
   │   Extract guest name. Convert to slug. Decide Module 1 (no recording) or Module 2 (recording exists).
   │   Resolve the source file in {{MEDIA_STORE}}/Podcasts/<Guest>/ (latest edited version if several).
   ▼
STAGE 1: GUEST INTEL (skip if dossier <60 days old exists)
   │   Run guest-intel skill → dossier.md → memory/content/podcast/guests/{slug}/
   ▼
STAGE 2: SOURCE FETCH + TRANSCRIBE
   │   rclone serve http → ffmpeg HTTP Range → small WAV → AssemblyAI diarization → transcript.json
   ▼
GATE 1: SPEAKER VERIFICATION
   │   Fast-model speaker-ID pre-flight → SAMPLE 3 quotes per speaker → strong model confirms the
   │   mapping against the dossier. If uncertain: print mapping + sample quotes + ask the owner once.
   │   NEVER trust the fast model alone (it has mislabeled hosts in real runs - twice in one episode).
   ▼
GATE 2: IDENTITY VERIFICATION (transcript vs dossier reconciliation)
   │   Does the guest in the transcript match the guest in the dossier? Signals: name self-introduction,
   │   biographical claims, company names, geography, specific numbers. 3+ match → pass silently.
   │   <3 → discrepancy report to the owner.
   ▼
STAGE 3: SCRAPE (single-pass transcript extraction, strong model)
   │   Output: hooks (10 categories, 0-100 scored) + narration_material (Patterns A/B/C/D candidates)
   │   + other_signals (frameworks, emotional beats, abandoned threads, chapter markers).
   ▼
STAGE 4: MINIMUM INVENTORY CHECK (deterministic)
   │   Verify each beat slot has enough candidates (3-3-3-2-2). FLAG the run if any slot is empty.
   ▼
STAGE 5: VO DRAFT GENERATION
   │   3 variations × 4 narration chunks (Patterns A/B/C/D) = 80-120 words/variation.
   │   Hard constraints: rule-of-three locked, no em dashes, no banned words, no fabrication.
   ▼
GATE 3: TRANSCRIPT-CLAIM VERIFICATION
   │   For every concrete claim in EVERY VO variation (numbers, places, names, companies, frameworks):
   │   grep transcript.text. Hit → verified. Miss → REJECT and regenerate that variation with a
   │   stricter "only use what's on tape" prompt.
   ▼
GATE 4: VOICE & TASTE FILTER
   │   Scan VO drafts for: em dashes, banned words, forced negation, staccato repetition,
   │   tasteless dollar mentions, narrowing language, show-name dependence, word overuse.
   ▼
GATE 5: BRAND-DRIFT SCAN
   │   No "most cancelled / forbidden / banned" language. No CIA/FBI/military stacks. No true-crime
   │   visual signifiers. If 2+ drift signals fire: regenerate the entire VO from scratch. Don't patch.
   ▼
STAGE 6: ASSEMBLY SHEET (deterministic CSV)
   │   1 row per beat: beat, type, source, start_sec, end_sec, text, notes.
   │   The editor uses this verbatim - every cut they need with the exact second.
   ▼
STAGE 7: RUBRIC SCORING (per-beat 0-10 self-evaluation)
   │   Score each of 7 beats + cross-checks. avg ≥9 AND no dimension <7 → PASS.
   │   Else → regenerate the weakest 2 beats only, re-score. Max 3 iterations.
   ▼
STAGE 8: RENDER ARTIFACTS
   │   intro-editor-pack.md (master) + intro-editor-one-pager.md (compact)
   │   → PDF render scripts (puppeteer) → 2 PDFs
   ▼
STAGE 9: SYNC + DELIVER
   │   Upload PDFs to the media-store project folder. Update the podcast tracker rows.
   │   Notify the owner with direct links.
   ▼
DONE. Reference cost ~$2-3/episode, ~60-90 min wall-clock.
```

---

# SOURCE PATH RESOLUTION (media-store canonical)

When the owner says "the [X] podcast", resolve the file path in this order. STOP at the first hit.

| Priority | Path pattern | Use when |
|---|---|---|
| **1** | `{{MEDIA_STORE}}/Podcasts/<Guest>/` (or the project-folder convention the owner adopts) | Default |
| **2** | An alternate archive remote | ONLY if the owner explicitly names it |

```bash
rclone lsd "{{MEDIA_STORE}}/Podcasts/" | grep -i "{guest}"
rclone ls "{{MEDIA_STORE}}/Podcasts/<Guest>/"
```

**Streaming rule (no large local downloads):** NEVER `rclone copy` a video. Always:
```bash
rclone serve http --addr 127.0.0.1:{port} --read-only <remote>: &
ffmpeg -i "http://127.0.0.1:{port}/<path>/file.mp4" \
       -vn -ac 1 -ar 16000 -acodec pcm_s16le ./tmp/{slug}.wav
```
Result: a small WAV briefly on disk (well under the 500 MB threshold), no MP4 ever downloaded. Delete the WAV after the AssemblyAI upload.

**Upload destination:** deliverables go to the episode's distribution folder in the media store, e.g. `{{MEDIA_STORE}}/Podcasts/<Guest>/distribution/` (one-pager PDF, master pack PDF, assembly-sheet.csv, vo-drafts.md). If editors are granted folder access: WRITE on the editor-cuts folder, READ-ONLY on raw and distribution.

---

# THE THREE PRE-CHECK GATES (all mandatory, all hard-fail)

These gates exist because real pilot runs failed each one and the owner caught the errors manually. Codifying them means future runs catch the same patterns automatically.

## GATE 1: Speaker Verification

**Why:** in a real pilot run, the fast speaker-ID model got the mapping wrong twice in one episode - first labeling the host as the co-host, then a "corrected" mapping that was also wrong (the co-host wasn't even in the episode). Both errors went undetected until the owner sampled the transcript himself.

**The gate:**
1. Run the fast-model speaker-ID pre-flight on the first 2 minutes
2. For each speaker label (A/B/C/...), pull 3 utterances of >10 words from across the episode (early/middle/late)
3. Run a strong-model verification: "Given the dossier, episode title, and these 3 quotes per speaker, is the mapping correct? If uncertain, list which speaker is ambiguous and why."
4. Confirmed with high confidence → lock the mapping
5. Uncertain or likely wrong → print sample quotes to the owner + ask once
6. NEVER proceed past this gate without explicit confirmation
7. If the owner confirms a different mapping → re-run with the `--speaker-map` override and lock

## GATE 2: Identity Verification (transcript vs dossier reconciliation)

**Why:** the dossier might say the guest does X, but on tape the guest reveals their actual positioning is different. Writing VO from stale dossier data produces an intro the guest will reject.

**The gate:**
1. After transcribing, scan the transcript for the guest's self-descriptions: "I do [X]" / "we run [X]" / "my company [X]"; self-stated career arc; numbers committed to on tape; geographic claims
2. Compare against the dossier's identity anchor, authority stack, and verified numbers
3. Generate a discrepancy report: Dossier Says / Transcript Says / Action
4. 0 discrepancies → silent pass. 1-2 minor → auto-update the dossier with the transcript reveals. 3+ major → flag to the owner; do not proceed without confirmation

**Real example pattern:** a guest's dossier framed them as a niche course creator; the transcript revealed a far stronger identity ("when the biggest names in the game hit [problem], they message me") plus a concrete high-value deal closed over a single chat thread. The reconciliation upgraded the identity anchor and the whole intro.

## GATE 3: Transcript-Claim Verification

**Why:** in pilot runs the VO drafts contained fabrications - a positioning claim with zero transcript hits, an invented scenic qualifier, and one false-negative caused by a truncated grep that wrongly flagged a REAL quote as fabricated. Every concrete claim in the VO must hit the transcript text. No exceptions, and always grep with full context (no output truncation).

**The gate (every VO variation, every iteration):**
1. Parse the VO draft. Extract every: number, proper noun, company/institution name, geographic claim, activity description, named framework
2. For each, grep the transcript text: substring match (case-insensitive), fuzzy match on key terms, numbers exact OR within ±10% for round numbers
3. Output `claim-verification.md`: each claim + verified (Y/N) + matching utterance + start_sec
4. If ANY claim fails → REJECT the variation entirely and regenerate with: "Re-draft using ONLY claims that appear verbatim in the transcript. Do not infer. Do not extrapolate."
5. Re-verify. Loop max 3 times. After 3 fails → escalate to the owner; the prompt template needs work.

---

# VOICE & TASTE FILTERS

Every VO variation passes through these filters. Auto-fix where possible; flag-to-owner where not.

## Hard bans (auto-reject + regenerate)

| Pattern | Why banned | Fix |
|---|---|---|
| Em dash anywhere | Immediate AI tell | Replace with comma, period, or restructure |
| `not [X], it's [Y]` (forced negation) | Hormozi rule, AI fingerprint | Just say Y |
| 3+ sentences with same length and cadence | Staccato repetition, AI fingerprint | Vary sentence structure |
| "unlock", "revolutionize", "game-changer" | Banned word list (`voice-check` skill) | Use plain language |
| "dive into", "delve", "let's explore" | AI slop openers | Cut or replace |
| "In this fast-paced world", "in today's landscape" | AI generic | Cut |
| Starting a sentence with "So," or "Now," | Lazy AI cadence | Restructure |
| Crude/vulgar qualifiers the owner has banned | Owner's explicit corrections (log them here as they happen) | Describe directly |

## Soft warnings (auto-fix preferred, flag if uncertain)

| Pattern | Why flagged | Default fix |
|---|---|---|
| Specific dollar amount in host narration | Reads as tasteless | Move dollar credibility into a guest-voice clip; the host VO uses name-drops instead |
| "Just [niche]" narrowing language | Boxes the guest in too small | Broaden to the strongest verifiable framing |
| The owner's house word appearing 3+ times in <120 words | Word overuse | Replace 1-2 with synonyms |
| Closer dependent on the show name | The show name might change | Use name-agnostic closers: "Welcome to the show" / "Ladies and gentlemen, [Name]" |
| Authority stack uses CIA/FBI/military | Brand drift for B2B | Use credible business institutions (top accelerators, funds, Fortune 500, leading labs, name-brand firms) |
| Persecution language ("most cancelled", "forbidden", "banned") | Brand drift | Use "underestimated", "missed", "under-priced", "overlooked" |

## The single test

Read the VO out loud. Does it sound like the owner talking, or like a podcast intro generator? Owner talking → ship. Generator → regenerate with a stricter owner-voice instruction.

---

# THE RUBRIC SCORER (the iteration loop heart)

Every assembled intro gets scored BEFORE shipping. Score 0-10 per beat. Average must be ≥9, no dimension <7. If fail → identify the weakest 2 dimensions, regenerate those beats, re-score. Max 3 iterations.

## The 7-beat rubric

| Beat | Score 10 (best) | Score 7 (acceptable) | Score 4 (regenerate) | Score 1 (broken) |
|---|---|---|---|---|
| **1. Opening hook (guest clip)** | THR/CON/VUL/CTI category, scored 90+, ends on a question or open loop, 5-10 sec | Score 75+, right category | Score 60-74, OR wrong category | Below 60, or wrong category and >15 sec |
| **2. VO Pattern A (host narration)** | Hyperbolic identity, contains rule-of-three OR superlative, 10-20 words, no fabrication, no banned words | Identity present, ≤25 words, claims verified | Identity vague OR 1 unverified claim | Generic ("today's guest is an entrepreneur") OR fabricated |
| **3. Second clip (guest)** | Different category from Beat 1, scored 80+, includes a specific number or proper noun, 5-12 sec | Score 70+, different category | Same category as Beat 1 OR score 60-69 | Score <60 or repeats Beat 1's content |
| **4. VO Pattern B (host authority)** | Rule-of-three locked (3 named institutions/clients/credentials), 12-18 words, all 3 verified | Rule-of-three present, claims verified | 2 of 3 institutions, or 1 unverified | Rule broken (2 or 4 items) or fabricated |
| **5. Cliffhanger (guest OPL)** | Open-loop ends mid-thought, explicit cut-off point, 8-15 sec, scored 85+, includes 2-8 sec planned silence | OPL present, scored 75+, has cut-off | OPL closes before the silence drop | No open loop or resolves on tape |
| **6. VO Pattern D (agenda preview)** | Rule-of-three with VARIED verbs, 12-18 words, 3 specific topics from this episode | Rule-of-three present, mostly varied verbs | Verbs repeat, or topics generic | Not a rule-of-three or no agenda |
| **7. Emotional beat (guest VUL)** | Personal vulnerability moment, scored 70+, brings the emotional arc, 5-12 sec | VUL category, scored 60+ | VUL but generic, scored 50-59 | No emotional beat present |

## Cross-cutting structural checks (each must be ≥7)

| Check | Score 10 | Score 7 | Score 4 |
|---|---|---|---|
| **Total duration 60-120 sec** | 70-90 sec | 60-100 sec | 50-110 sec |
| **3+ different hook categories represented** | 4-5 different | 3 different | 2 different |
| **Vacuum Drop present** | 4-8 sec dead silence before title | 2-4 sec | 1-2 sec |
| **Tonal Whiplash Bridge** | Bright studio + dry tone + cliffhanger payoff | 2 of 3 elements | 1 of 3 |
| **Rule of three locked everywhere** | Every list is exactly 3 items | 1 list breaks rule | 2+ lists break rule |
| **Zero brand-drift signals** | Zero | 1 minor | 2+ |
| **Zero banned words / em dashes** | Zero | 0 (auto-fixed) | 1+ remaining |
| **Value-in-intro (transferable insight before the title)** | Specific framework or number with utility | Insight present but generic | Mythology only |

## Scorecard output format

```yaml
scorecard:
  iteration: 1
  beats:
    1: { score: 8, note: "Hook category right (OPL), 87/100, but 18 sec - trim to 10" }
    2: { score: 9, note: "Pattern A clean, rule-of-three embedded, all claims verified" }
    ...
  cross_checks:
    duration: 9
    variety: 7
    vacuum_drop: 9
    tonal_whiplash: 9
    rule_of_three: 10
    brand_drift: 10
    banned_words: 10
    value_in_intro: 7
  beats_avg: 8.0
  overall_avg: 8.4
  min_dimension: 6
  decision: "FAIL - Beat 7 below 7. Regenerate Beat 7 with a specific moment from the transcript."
```

## Iteration rules

- **Max 3 iterations.** Still failing after 3 → escalate to the owner.
- **Only regenerate the failing beats**, not the entire intro (full regeneration is expensive; targeted patches are not).
- **Re-score only the changed dimensions** after each iteration.
- **Log every iteration** to `iteration-{N}.md` for audit.

---

# EDITOR-FACING DELIVERABLES (one-pager is primary)

Editors want a tight one-pager, not a 600-line master pack. The master pack is for the owner's review; the one-pager is for the editor at their desk during the cut.

| Artifact | Lines | Audience | Format | Use case |
|---|---|---|---|---|
| **Editor one-pager** (PRIMARY) | ≤80 | Editor | Landscape A4, 3-col grid of variations + core picks table + bonus clips inline | Print or pin on a second monitor during the cut |
| **Master pack** (DEEP REFERENCE) | 600-700 | Owner | Multi-page A4 portrait, full evidence + formula appendix + brand-drift checklist | Owner review, picking the VO variation, sanity-check |

## One-pager structure

```markdown
# [GUEST] · INTRO EDITOR ONE-PAGER
*Tagline · vN · YYYY-MM-DD · Target 60-90 sec · [Style descriptor]*

## CORE PICKS · same across all 3 variations
[Table: # | Beat | Time | Clip / action]
[Hard timestamps for: Opener, Cliffhanger, Vacuum Drop, Title Card, Studio Cut-In]

## THE 3 VARIATIONS · editor picks one (or hybrids)
[3-column grid: V1 "STYLE" default / V2 / V3 - each a beats 1-8 table with type/timestamp/clip/VO]

## BONUS CLIPS · editor discretion · swap into variations
[Inline B1...B6 with timestamp + quote, dense prose format]

## VISUAL · AUDIO · QC · AUTHORITY · LINKS
[All 5 categories collapsed into one paragraph with bold-label format]
[QC checklist: 5-7 boxes the editor checks before delivering]
**Raw episode:** [URL] · **Master pack:** [URL] · **Episode:** HH:MM:SS · Speakers: [mapping]
```

Render via the PDF scripts in `scripts/` (puppeteer-based: one for the multi-page master pack, one for the landscape one-pager). Landscape A4 + 3-column grid is the proven fix for one-pagers overflowing to 2 pages.

---

# THE PILOT INCIDENT LOG (failure modes encoded)

Every error from the real pilot runs is now an automated check. Keep extending this table as new incidents happen.

| # | Incident | Root cause | Codified check |
|---|---|---|---|
| 1 | Disk-full on rclone copy of a 37 GB episode | Default rclone copy writes locally | Streaming rule + remote audio extraction |
| 2 | AssemblyAI 502 on long stream upload | Chunked-encoding stream past ~92 MB | Upload a small WAV file body, not a stream |
| 3 | Fast-model speaker mapping wrong (labeled an absent co-host) | Model assumed "opens episode = host" | GATE 1 sample-quote verification + owner confirmation |
| 4 | The "corrected" speaker mapping was ALSO wrong | Trusted pattern-matching without grepping | GATE 1 - never trust diarization without sampling |
| 5 | False "fabrication" flag on a real quote | Truncated grep output hid the actual quote | GATE 3 with full-context grep, no truncation |
| 6 | Invented positioning claim in VO | LLM extrapolated beyond the tape | GATE 3 - every claim must hit the transcript verbatim |
| 7 | Invented scenic qualifier in VO | LLM added flavor not on tape | GATE 3 |
| 8 | Dollar amount in host narration read as tasteless | Used dollar credibility instead of name-drops | Voice & taste filter (soft warning) |
| 9 | Guest framed too narrow from stale dossier | Dossier-stale framing vs transcript reveal | GATE 2 (identity reconciliation) |
| 10 | Banned crude word in VO | Owner's explicit correction | Voice & taste filter (hard ban) |
| 11 | House word overused (5+ in 80 words) | LLM defaulted to the owner's signature word | Voice & taste filter (count >3 = warn) |
| 12 | Closer depended on the show name | Show name could change | Voice & taste filter (regex check on closer) |
| 13 | Em dashes in VO drafts | Default LLM punctuation | Voice & taste filter (hard ban regex) |
| 14 | One-pager overflowed to 2 pages | Portrait + tiny font still too tall | Landscape A4 + 3-col grid in the render script |
| 15 | Editors ignored the master pack | Too dense for live cutting | One-pager as primary deliverable |

---

# THE VIRAL-INTRO FORMULA (inline reference)

Derived from a frame-by-frame forensic analysis (via the `intro-forensics` skill) of the 10 most-viewed episodes of a top interview channel (10M+ combined views, 2,600+ frames analyzed). Re-run the same analysis on a reference channel of the owner's choice to refresh or localize the formula.

## The 4 universal mechanics (present in 10/10 analyzed episodes)

1. **Hyperbolic host VO opener:** "Today's guest is {superlative identity}"
2. **Rule-of-three authority stack:** `{INST_1}, {INST_2}, and {INST_3}` named credentials
3. **Word-by-word kinetic typography** synced to vocal cadence (hard cuts only, no fades)
4. **Vacuum Drop:** 2-8 seconds of dead silence before the title card, then a single boom

## The 10 Hook Categories (taxonomy)

| Code | Category | Definition |
|---|---|---|
| **THR** | threat_frame | states an immediate danger the viewer faces |
| **FBK** | forbidden_knowledge | promises scarce, taboo, or "they don't want you to know" information |
| **OPL** | open_loop | sets up a question whose answer is withheld |
| **IDF** | identity_frame | defines the guest as something extreme or superlative |
| **AUT** | authority_signal | establishes credibility via institution / achievement / rule-of-three credentials |
| **PIN** | pattern_interrupt | violates an expected conversational norm |
| **CTI** | counterintuitive | flips a mainstream assumption |
| **CON** | contradiction | direct denial of a public accusation with rhetorical challenge |
| **VUL** | vulnerability_reveal | pairs a mundane behavior with an extreme stake OR raw personal vulnerability |
| **NUM** | number_claim | specific number promising structured value (list, count, ratio) |

Every intro must have 3 different categories represented in the 3 guest clips used (Beats 1, 3, 5). Variety prevents the intro feeling one-note.

## The 4 VO Patterns

### Pattern A: "Today's guest is..." superlative opener (7/10 analyzed episodes)

**Template:** `"Today's guest is {IDENTITY_ANCHOR}."`

**B2B-adapted template:**
`"Today's guest has {verifiable verb} {specific number} {specific outcome} for {recognisable brand or segment}."`

Illustrative shape (always fill from the dossier's verified numbers, never invent):
- "Today's guest has deployed AI agents inside [N] of the [recognisable segment] to replace [function]."
- "Today's guest built a [verified-scale] consultancy from [a single verifiable origin point]."

**Fills from:** dossier identity anchor + verified numbers.

### Pattern B: Authority stack (rule of three credentials, sentence 2 or 3)

**Template:** `"{Verb past tense} {tenure} in {INST_PRIMARY}, he's {verb} {INST_A}, {INST_B}, and {INST_C} on {SKILL_DOMAIN}."`

OR the softer variant: `"A {subject descriptor} who {verb} {topic 1}, {topic 2}, and {topic 3}."`

**Critical:** rule of three is LOCKED. Not 2. Not 4. Three.

**Fills from:** dossier authority stack + verified numbers.

### Pattern C: Escalation ladder (use ONLY with a verified arc)

**Template:** 3-beat escalation, one beat per host VO chunk, spread across the cold open.

**B2B variant (only if independently verifiable):**
1. "First the market said it couldn't be done."
2. "Then the incumbents copied him."
3. "Then their lawyers got involved."

**Critical:** SKIP this pattern entirely if the arc's quality score is low or ANY beat is unverifiable. This is the most fabricatable pattern. The source channel uses a persecution/mortality version of this ladder; that framing is brand-drift for a B2B show - reject it.

### Pattern D: "In this episode we'll..." agenda preview (closes the cold open)

**Template:** `"In this episode, we'll {verb 1} {topic 1}, {verb 2} {topic 2}, and {verb 3} {topic 3}."`

**Critical:** action verbs MUST vary. Mix: break down / expose / uncover / reveal / explore / question / challenge. Never the same verb twice.

**Fills from:** the episode's top 3 hook categories + the guest's signature beliefs.

## Recurring authority-word substitutions for B2B

The analyzed channel leans on intrigue words (`forbidden`, `most cancelled`, `banned`, security-agency stacks). For a business show, substitute:
- `forbidden` → `under-priced` or `overlooked`
- `most cancelled` → `most replicated` or `most hired`
- `banned` → `copied` or `studied`
- security-agency / military stacks → top accelerators, name funds, Fortune 500, leading AI labs, name-brand consultancies and infrastructure companies

---

# PRODUCTION SPECS (the concrete numbers from the forensic analysis)

## Pacing profile

| Metric | Value | Range across episodes |
|---|---|---|
| Average cut interval | **~5.5 sec** | ~2.5s (fastest) to ~10s (slowest) |
| Median cut interval | **~2.4 sec** | 0.13s to 4.84s |
| Title card timing (median) | **~61 sec** | 21s (known guests) to 87s; occasionally omitted entirely |
| Cold-open duration target | **60-90 sec** | Shorter for known guests, longer for guests who need credentialising |

## Kinetic zones (cuts/10 sec)

- **Authority montage** (secs 10-30): rapid-fire credentials with B-roll, 3-5 cuts/10s
- **Evidence barrage** (secs 20-50): headlines, archival, product B-roll, 4-8 cuts/10s
- **Escalation peak** (secs 40-80): ramps to the Vacuum Drop, 5-8 cuts/10s

## Shot-type distribution (target)

| Shot type | Target % | Role |
|---|---|---|
| **MS (Medium Shot)** | 60-65% | Default interview framing |
| **CU (Close-Up)** | 15-20% | Emotional intensity during the cold open |
| **WS (Wide Shot)** | 10-15% | Establishing, resets visual fatigue post-title-card |
| **MCU** | 3-5% | Bridges MS to CU during pivots |
| **B-roll / graphics** | 2-5% | Archival, news clips, maps, data overlays |
| **ECU** | <1% | Rare, reserved for extreme moments |

Episodes that need to BUILD MYTHOLOGY skew CU-heavy (40%+). Known-persona episodes stay MS-dominant.

## Typography system (10/10 analyzed episodes)

- **Primary font:** bold geometric sans-serif (Montserrat, Helvetica, Inter, Impact, Bebas Neue, Gotham class). Exact font varies; the category is LOCKED: heavy weight, no serif, no decorative letterforms.
- **Case:** all-caps or sentence-case. No lowercase except connective words.
- **Colours:** stark white on near-black backgrounds.
- **Animation:** hard-cut, word-by-word reveal synced to vocal cadence (within ±1 frame). NO fades, NO eases, NO springs.
- **Serif usage:** accent only.

## Colour palette structure

The analyzed channel's world is monochrome with ONE metallic accent: pure black backgrounds, near-black gradients, stark white primary text, a gold accent for emphasis. **Preserve the structural roles** (dark BG, stark white primary, one metallic accent, one gradient depth) **but use the company's brand accent colour instead** - consult `assets/brand/brand-colors.md`. Notably absent: blues, greens, oranges, warm tones.

## Audio signature

- **Music bed (9/10):** driving cinematic synth-thriller with deep sub-bass pulse, layered over ticking percussion or tense strings. Builds through the escalation montage, peaks at the Vacuum Drop. (1/10 uses zero score, raw room tone only - a deliberate authenticity move.)
- **SFX library:** sub-bass booms synced to text reveals (10/10), risers bridging montage transitions (10/10), single resonant boom for the title card (9/10).
- **Vacuum Drop silence duration:** 4 seconds is the safe default. 2 sec for conversational cliffhangers, 8+ sec for existential / high-stakes questions. Never under 2 sec (reads as a glitch, not a pause).
- **VO treatment:** dry, close-mic'd, slightly compressed. No reverb. The host sounds like he's reading into the viewer's ear while cinematic music runs under.

---

# MOTION GRAPHICS VOCABULARY (17 recurring devices, with B2B keep/reject calls)

| Visual device | Prevalence | B2B call |
|---|---|---|
| Word-by-word kinetic typography synced to cadence | 10/10 | KEEP: non-negotiable |
| Hard-cut text flashes (sub-1s pop-ins) | 10/10 | KEEP |
| Heavy bass-hit / boom SFX synced to cuts | 10/10 | KEEP |
| Vacuum Drop (full audio cut to silence) | 8/10 | KEEP, 4 sec default |
| Title card smash with single resonant boom | 9/10 | KEEP |
| **Glitch / chromatic-aberration transitions** | 7/10 | **REJECT**: true-crime tell |
| **Light leaks / film burns** | 6/10 | **REJECT**: grit layer |
| HUD / data overlays (margin numbers) | 3/10 | OPTIONAL: works for metric framing |
| **Censorship warning cards** | 2/10 | **REJECT**: grifter signal |
| Map / archival B-roll graphics | 6/10 | OPTIONAL: use for macro business claims |
| News-headline montage with highlighted text | 5/10 | KEEP for the evidence-barrage zone |
| **Corkboard / true-crime overlay** | 2/10 | **REJECT** |
| **Glass-shatter visual + SFX** | 3/10 | **REJECT**: too aggressive for B2B |
| Letterboxing (2.35:1 cinematic bars) | 4/10 | OPTIONAL |
| Stylized lower-thirds / name graphics | 5/10 | KEEP for guest credentialing (post-title only) |
| Cross-dissolves / smooth fades | 0/10 | **REJECT** (never use) |
| Ken Burns / slow zoom / parallax | 0/10 | **REJECT** |

---

# BRAND-DRIFT CHECKLIST (read every invocation)

Every output must be reviewed against these 5 signals BEFORE the assembly sheet ships.

| Drift signal | Action |
|---|---|
| VO uses "most cancelled" / "forbidden" / "banned" language | REJECT. Use "underestimated" / "missed" / "under-priced" / "overlooked". |
| Escalation ladder invokes legal / prison / death stakes | REJECT unless verifiable AND business-relevant. Default: skip Pattern C entirely for B2B guests. |
| Visual treatment leans true-crime (corkboards, glass shatter, chromatic aberration, light leaks) | REJECT. Use a clean enterprise-cinematic palette. |
| Authority stack uses CIA / FBI / military | REJECT. Use credible business institutions. |
| Color accent drifts from the brand accent to thriller red | REJECT. Correct to the brand palette. |

**If 2+ drift signals fire in one intro:** regenerate the entire intro with stricter constraints. Do not patch.

## AI-to-human handoff boundaries

1. **Taste call on the single best clip:** AI produces 3 candidates scoring 85+; the owner picks the one that goes to air.
2. **Voice-edit on VO drafts:** AI generates 3 variations; the owner rewrites to their voice before recording.
3. **Freshness ceiling review every 90 days:** is retention at the 60-sec mark still above 60%? If not, the formula is going stale - re-synthesize from a newer reference channel via `intro-forensics` (candidates: top business-interview channels of the moment).

---

# THE TONAL WHIPLASH BRIDGE (post-title-card, very specific)

Immediately after the title card, the cut to the studio must do three things (verified in 9/10 analyzed episodes):

1. **Visual brightness delta:** studio LUT brighter by +20-30% vs the cold open. Contrast is the mechanic.
2. **Audio quietness delta:** music dies at the title card. The interview opens on dry room tone only.
3. **First-question rule:** the host's very first sentence is the explicit payoff to the silent cliffhanger question from Beat 5. NO "welcome to the show." NO "tell me about your background." NO pleasantries.

**Pattern:** cold-open pre-title question → post-title first question = the same core question, blunter. Example: Beat 5 asks "If you had to fire 80% of your ops team tomorrow, which 20% would you keep?" → Beat 8 (post-title) opens with: "Let's start with that 80%. Which roles are first to go?"

---

# VALUE-IN-INTRO RULE (the deciding criterion for B2B)

In the analyzed corpus, the episodes that delivered **real transferable insight before the title card** were the ones that worked for business-minded viewers; the mythology-only intros relied on celebrity. For a B2B audience: **mythology-only hooks WILL FAIL**. Always deliver one transferable insight before the title:

- A specific framework the guest teaches
- A concrete psychology/negotiation technique
- A numbered framework
- A counterintuitive business claim backed by specifics

**Fit-check rule:** if the cold open delivers zero transferable insight, the intro FAILS regardless of other metrics.

---

# ANTI-PATTERNS (14 rules the formula never breaks)

| Anti-pattern | Why it's avoided |
|---|---|
| Cross-fades, smooth dissolves, eased transitions | Fades signal "slow podcast." All transitions are hard cuts. |
| Generic upbeat podcast intro music | Every score is ominous, driving, sub-bass-heavy. |
| "Hi everyone, welcome to the show" pleasantries | Bypassed 10/10. First post-title line is always the dangerous question. |
| Slow zooms / Ken Burns / parallax | Never used in the cold open. Static framing on rapid cuts. |
| More than 3 words on screen at once | Word-by-word means 1-2 words. Phrases are the exception. |
| Bright / cheerful color palette | Monochrome + one accent only. |
| Letting music fade out | Hard cut to silence. Never a gradient. |
| Showing the answer to the cold-open question before the title | Open loops never close pre-title. |
| Standard lower-thirds during the kinetic zone | Lower-thirds appear post-title only. |
| Decorative or serif fonts as primary | Serif is accent only. Primary is heavy sans. |
| Even-paced cutting | Cut intervals oscillate. Even pacing kills the kinetic zone. |
| Title card matched in tone to the cold open | Use a SMILING photo of the guest as deliberate tonal whiplash. |
| Music continuing into the interview | Music dies at the title card. Interview is dry room tone. |
| Long descriptive captions / subtitle blocks | Captions are 1-4 words, visual rhythm not transcription. |

---

# PIPELINE MODULES (execution detail)

## Module 1: Pre-Shoot Guest Intelligence (skip if dossier exists)

Runs the `guest-intel` skill: multi-source scrape → 10-field extraction → open-loop question generation → dossier.md + tracker sync. Skip if a dossier <60 days old exists; offer to refresh if stale.

## Module 2: Post-Shoot Intro Assembly (main pipeline)

- **2.1 Transcribe with diarization** - AssemblyAI with word-level timestamps + speaker labels (the podcast-intelligence module, or the podcast-transcribe module's JSON)
- **2.2 Speaker mapping pre-flight** - fast model on the first 2 min → GATE 1 verification
- **2.3 Single-pass transcript extraction** - strong model with the transcript-scraper prompt. Inputs: TRANSCRIPT_JSON + GUEST_DOSSIER + HOST/CO-HOST/GUEST names + EPISODE_TITLE + SPEAKER_MAPPING. Output: `hooks[]` (30-60 classified phrases scored 0-100 across the 10 categories), `narration_material{}` (Patterns A/B/C/D reveals found on tape), `other_signals{}` (emotional beats, frameworks, abandoned threads, chapter markers)
- **2.4 Minimum inventory check (deterministic)** - Beat 1 opening hook (THR/CON/VUL/CTI, 80+): ≥3 · Beat 3 clips (FBK/NUM/CTI 70+ and OPL 70+): ≥3 each · Beat 5 cliffhanger (OPL with cut-off, 80+): ≥2 · Beat 7 emotional (VUL personal, 60+): ≥2. Any slot short → FLAG to the owner (lower threshold? re-record? shelve?)
- **2.5 VO draft generation** - 3 variations, each 80-120 words total in 4 chunks of 10-25 sec. Pattern C only if the verified-arc score is high.
- **2.6 Assembly sheet** - deterministic CSV, one row per beat: `beat, type, source, start_sec, end_sec, text, notes`
- **2.7 Fit-check (6 criteria, all must PASS):** duration 60-120 sec · all 5 elements present (hook/emotion/credibility/value/cliffhanger) · ≥3 hook categories · zero brand-drift signals · zero banned words · value-in-intro present. Each failure maps to re-running one sub-stage, not the whole pipeline.
- **2.8 Tracker sync** - update the podcast tracker (sheet via the gws CLI, or a markdown tracker file): episode status "Intro Ready", links to the one-pager/master pack/assembly sheet/VO drafts, top 5 unused clips routed to the short-form clip list.

## Cascade output coordination

The scraper's `other_signals` feed OTHER pipelines - don't leave them unused:

| Output | Downstream consumer |
|---|---|
| `frameworks` | LinkedIn carousel + thread cascade (content-cascade skill) |
| `chapter_markers` | YouTube episode chapter metadata at publish |
| `abandoned_threads` | Future episode prep → `memory/content/podcast/guests/{slug}/followup-questions.md` |
| unused `emotional_beats` + `hooks[]` | Short-form clip candidates in the tracker |

## Output locations

```
memory/content/podcast/guests/{slug}/
  dossier.md
  followup-questions.md
  intro-production/
    transcript.json
    speaker-mapping.json
    extraction.json
    ranked-phrases.csv
    vo-drafts.md
    assembly-sheet.csv
    fit-check.md
    claim-verification.md
    intro-editor-pack.md
    intro-editor-one-pager.md
```

Cross-sync: media-store distribution folder (PDFs + CSV) + podcast tracker + notify channel.

## Handoff checklist (before the editor assembles)

- [ ] All sub-stages completed without errors
- [ ] fit-check.md PASSES all 6 criteria
- [ ] Rubric scorecard PASSES (avg ≥9, no dimension <7)
- [ ] vo-drafts.md reviewed by the owner (they pick which variation to record)
- [ ] The owner recorded the chosen VO variation
- [ ] Tracker rows synced
- [ ] Notification sent to the editor with direct links

## Known limitations (AI cannot do these)

- Pick the single winning clip (taste call - the owner's)
- Voice-edit the VO (the owner edits drafts to their voice)
- Video assembly (the editor builds the cut)
- Auto-publish (the quality gate is human-confirmed)
- Detect the formula going stale (90-day human retention review)

---

## Related

- [[intro-forensics]]
- [[guest-intel]]
- [[podcast-transcribe]]
- [[content-cascade]]
- [[quality-gate]]
