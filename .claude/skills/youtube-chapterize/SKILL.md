---
name: youtube-chapterize
description: Use this skill when transcribing a long-form video (podcast, mastermind, talk, interview, livestream) and generating YouTube chapter timestamps. Triggers on phrases like "chapterize this video", "create YouTube chapters for X", "transcribe and chapter", "make chapters for the [podcast/mastermind/talk]", "analyze the transcript and turn it into chapters", "analyze this transcript", "do the whole thing - transcribe and chapter", "transcribe and give me chapters", "turn this video into chapters", "give me chapters for X", "I want to upload X to YouTube - chapter it", or after any video transcription where the output is destined for YouTube. Produces a paste-ready chapter block tuned to the owner's chaptering style - the curiosity-first, declarative-noun-phrase, no-question-mark defaults below are the starting calibration; refine them with the owner during first use. Iteration is mandatory - never deliver the first draft as final.
metadata:
  type: pipeline
  status: active
  created: 2026-05-03
  updated: 2026-06-11
---

# youtube-chapterize

End-to-end skill: transcribe a long-form video, then chapter it for YouTube to the owner's standard.

**Calibration note (first use):** the style rules below are proven defaults inherited from the parent OS. They were derived from a real multi-round calibration with that system's owner. Treat them as the starting point: run the full iteration loop with THIS owner on the first video, capture their preferences, and update this skill where their taste differs. Save the first locked chapter set as the owner's gold-standard reference (see Step 8).

---

## QUICK REFERENCE CARD (read this first)

**Pipeline (8 steps):**
1. Locate source video (record the owner's export folder + media store path here once known)
2. ffmpeg → mono 16 kHz 64 kbps MP3 (~64 MB for 2 hr)
3. `python tools/transcribe/transcribe_timestamped.py <audio> <output_dir>` (build this helper on first use if missing - see Step 3)
4. Web-search current YouTube specs (length sweet spot, hard cap)
5. Read full transcript + grep segment JSON for transitions
6. Draft chapter titles per **STYLE RULES** (below)
7. Verify each timestamp against segment text within ±8 sec
8. Iterate with the owner 3-5 rounds → lock → save `chapters.md` + commit + notify

**Style rules (cheat sheet - defaults, calibrate on first use):**
- 25-40 chars / 3-6 words per title
- **NO question marks** - convert to noun phrases ("Will we have jobs?" → "The future of jobs")
- Curiosity over revelation - point at territory, don't reveal lesson ("Why data is your moat" → "The real moat")
- Stranger-flicking test - outsiders must get intrigue without inside knowledge
- Cut wrap-up/goodbye chapters
- Mix three flavors: topic names + curiosity hooks + demos
- "Live:" prefix for demo chapters

**Hard fail conditions (auto-iterate, never deliver):**
- Any title with `?`
- Any title >50 chars
- Any timestamp not verified against segment text
- Wrap-up/goodbye chapter present
- 4+ consecutive titles of same flavor

**Iteration mandate:** First-draft chapters are 7/10. Never deliver as final. Budget 30-45 min for the feedback loop.

**Gold standard reference:** `memory/transcripts/<first-locked-video-slug>/chapters.md` (created during first use - point this line at it once it exists)

---

## When to use

- Long-form video (≥30 min) destined for YouTube: podcasts, masterminds, talks, interviews, livestream replays
- The owner says "chapterize this", "create YouTube chapters", "transcribe and chapter", "make chapters for the X"
- After any transcription pipeline run where chapters are the next deliverable
- Before publishing long-form content to YouTube

## When NOT to use

- Short videos (<10 min) - YouTube does not render chapters
- Videos with fewer than 3 distinct topic transitions
- Internal-only recordings not destined for public YouTube
- Pure interview content where the editor has already produced chapters

---

## The pipeline (8 steps)

### Step 1 - Locate the source video
- Record the owner's usual export location here once known (e.g. an editor-export folder, or the media store at `{{MEDIA_STORE}}`)
- File usually `.mp4` or `.mov`. Confirm duration via ffprobe before continuing.

```bash
ffprobe -v error -show_entries format=duration,size,bit_rate -of default=noprint_wrappers=1 "<video.mp4>"
```

### Step 2 - Extract audio (mono, 16 kHz, 64 kbps MP3)
- Keeps file under Whisper's 25 MB chunk limit per 10-min slice
- Audio-only re-encode is fast; 17 GB MP4 → ~64 MB MP3 in 3-5 min

```bash
ffmpeg -y -i "<video.mp4>" -vn -ac 1 -ar 16000 -b:a 64k -f mp3 "<output_dir>/audio.mp3"
```

Audio stays out of git (`.mp3` is gitignored). Output to `memory/transcripts/<slug>/audio.mp3`.

### Step 3 - Whisper transcription with absolute timestamps

```bash
python tools/transcribe/transcribe_timestamped.py "<audio.mp3>" "<output_dir>"
```

If the helper doesn't exist yet, build it on first use. Requirements:
- OpenAI Whisper API, `response_format="verbose_json"` (segment-level timestamps - NEVER `"text"`, which discards them)
- Chunk audio in 10-min slices, offset each chunk's segment times to absolute seconds
- Outputs: `transcript.txt` (plain text, chunked) + `transcript-timestamped.json` (segments with absolute `start_sec`/`end_sec`)

Cost reference: ~$0.006/min × video length. A 2hr 13min video ≈ $0.80.
Wall clock: ~10-15 min for transcription + 3-5 min audio extraction.

### Step 4 - Verify YouTube chapter rules are current

Before drafting titles, web-search the current YouTube chapter requirements. Skill files go stale. Verify in-session:

- Length sweet spot (~25-40 chars / 3-6 words per 2026 research)
- Hard cap (100 chars per title as of 2026)
- Minimum chapters (3) and minimum chapter duration (10 sec)
- First chapter must start at 00:00
- These specs may have moved - verify before claiming them

### Step 5 - Identify topic transitions

Read the full transcript end-to-end. Don't skim. The transcript file is usually 14-26 lines (one line per Whisper chunk).

Then grep the segment JSON for candidate transition phrases:

```python
import json
data = json.load(open('transcript-timestamped.json', encoding='utf-8'))
queries = ['phrase one', 'phrase two', ...]
for q in queries:
    for s in data['segments']:
        if q.lower() in s['text'].lower():
            print(f'{s["start_sec"]:.0f}s - {s["text"][:120]}')
            break
```

Aim for one chapter every ~5-8 minutes for a 2-hr talk. Fewer for shorter content. Live demos and big stories deserve their own chapters even if shorter.

### Step 6 - Draft chapter titles using the STYLE RULES (below)

Apply ALL rules. Score honestly. If a title violates the rules, fix it before delivery.

### Step 7 - Verify each timestamp matches its content

For each draft chapter, find the segment within ±8 sec of the claimed timestamp. Read what's actually said. If the title doesn't match the content, the timestamp is wrong - fix it.

```python
for t_start, title in chapters:
    matches = [s for s in data['segments'] if abs(s['start_sec'] - t_start) < 8]
    if matches:
        print(f'{t_start}s {title}\n  → {matches[0]["text"][:120]}')
```

### Step 8 - Iterate with the owner

**This is mandatory.** Never deliver first-draft chapters as final. Expect 3-5 rounds of feedback. The parent OS's first calibration set took 5 rounds to lock.

When the owner says "lock this":
1. Update `memory/transcripts/<slug>/chapters.md` with the final block + rationale
2. If this was the FIRST chapterization: mark that file as the gold-standard calibration reference and update this skill's pointer + any rules the owner overrode
3. Commit + push (always-push rule)
4. Notify the owner (notify rule)

---

## Style rules (proven defaults - calibrate to the owner)

### Length targets

| Target | Value | Why |
|---|---|---|
| Words per title | 3-6 | Best balance of intrigue + readability |
| Char count sweet spot | 25-40 chars | YouTube research shows ~12% performance edge |
| Practical max | 50 chars | Longer titles truncate in player |
| Absolute max | 100 chars | YouTube hard cap |
| Min duration | 10 sec | YouTube requirement |

### Hard rules (non-negotiable defaults)

1. **NO QUESTION MARKS.** Convert all questions to declarative noun phrases.
2. **NO interrogative starters when possible.** "What's the X" → "The X" or just "X".
3. **CURIOSITY OVER REVELATION.** Point at the territory; don't reveal the moral.
4. **STRANGER-FLICKING TEST.** Outsiders scrolling chapters must get intrigue without inside knowledge of the talk.
5. **CUT WRAP-UP / GOODBYE CHAPTERS.** Last value-bearing chapter extends to end of video.
6. **VARIETY > FORMULA.** Mix topic names, curiosity hooks, and demos. Never 4+ titles of same flavor in a row.
7. **VERIFY EACH TIMESTAMP.** Grep the segment, read what's said, confirm match.

### Soft rules (use judgment)

- Keep `Live:` prefix for demo chapters (helps visual scanning)
- Name + dollar amount = strong curiosity ("Hormozi's $6K AI", "$250K dev costs saved")
- Self-referential irony OK if the talk supports it ("Why I never watch YouTube" - said on a YouTube video)
- Don't oversell offer/sales chapters; flat is fine for high-intent viewer self-selection
- Avoid generic clickbait ("secret", "hack", "insane") unless the content actually delivers

### Three flavors to mix

| Flavor | Examples |
|---|---|
| TOPIC NAMES | "AI background", "The context document", "AI safety", "Skills, plugins, connectors" |
| CURIOSITY HOOKS | "The real moat", "Why I never watch YouTube", "Hormozi's secret AI strategy" |
| DEMOS / NAMED MOMENTS | "Live: command centre", "Live: creator research", "The mind-blown AI use case" |

---

## Good vs bad - concrete examples from the parent calibration round

| BAD | WHY IT'S BAD | GOOD |
|---|---|---|
| `Will we have jobs?` | Question mark | `The future of jobs` |
| `Is your AI safe?` | Question mark | `AI safety` |
| `What's the difference between Chat and Code` | Interrogative starter, too long | `Difference between Chat and Code` |
| `Why data is your real moat` | Reveals the lesson | `The real moat` |
| `Story: How Claude hired 25 video editors in one day` | Too long, too explicit | `Mind-blown AI use case` |
| `Skills as lead magnets` | Insider term | `Black-hat AI strategy` |
| `The Trojan Horse` | Requires inside knowledge of the talk | `Black-hat AI strategy` |
| `Wrap-up + AI club proposal` | Non-value-bearing wrap-up chapter | (cut entirely) |
| `Speed` | Too vague to standalone | `The only moat left` |
| `How not to miss AI updates` | Interrogative-style "How not to" | `Staying up to date with AI` |
| `Starting from zero` | Slightly flat | `Avoid starting from zero` |
| `Hormozi's $6K AI` | Curious but missing the angle | `Hormozi's secret AI strategy` |
| `Working with us` | Too flat for the offer chapter | `How we deliver` |

---

## Quality gate (run before delivery)

### Stage 1 - Binary pass/fail (auto-iterate, never deliver if any FAIL)

Run these checks programmatically. If ANY fails, regenerate that chapter before showing the owner:

| Check | Pass condition | How to verify |
|---|---|---|
| Question marks | Zero `?` characters in any title | grep `?` in chapter list |
| Length cap | Every title ≤ 50 chars | char count per line |
| Min length | Every title ≥ 8 chars | char count per line |
| Timestamp accuracy | Each timestamp's segment text matches the title's claim | grep ±8 sec window |
| First chapter | Starts at `00:00` exactly | string match |
| Min duration | No two chapters within 10 sec of each other | timestamp diff |
| Wrap-up cut | No "thanks", "goodbye", "wrap-up", "thank you" in last chapter title | grep title |
| Format | Each line: `H:MM:SS Title` or `MM:SS Title` | regex check |

### Stage 2 - Subjective scoring (1-10, after binary checks pass)

| Dimension | Target |
|---|---|
| Variety (no 4+ same-flavor in a row) | 9+ |
| Stranger-flicking test (outsider gets intrigue without inside knowledge) | 9+ |
| Coverage (every value-bearing moment has a chapter) | 9+ |
| Calibration vs the owner's gold standard | 9+ |

Score each 1-10 honestly. If avg < 9 or any < 7, identify the weakest 1-2 chapters and rewrite them. Re-score. Max 3 iterations before asking the owner which dimension is weakest.

---

## Caveats and edge cases

- **Calibration starts at N=0 for this owner.** The defaults are inherited from one real calibration in the parent OS. Expect drift. After every 2-3 videos, propose rule revisions if patterns repeat. After 5+ videos pass through, review and update this skill.
- **Calibrated for talks/masterminds/podcasts/interviews.** Other formats may need different rules:
  - Course modules: chapter per lesson, NOT per topic transition
  - Scripted videos / VSLs: probably don't need chapters at all (under 15 min usually)
  - Livestream replays: chapter by Q&A breakpoints, not topics
  - Solo essays: closer to talk rules - apply this skill
  - If format differs, FLAG to the owner before drafting and ask if rules should be adjusted
- **Taste evolves.** The owner's preferences in this skill are a snapshot. If the owner contradicts a rule in current feedback, defer to current feedback AND update this skill before locking the new chapter set.
- **Whisper has systematic transcription errors.** Always include a find-and-replace key in the chapters.md for terms Whisper reliably mis-transcribes:
  - "Claude" → "Cloud" (very frequent)
  - "Apify" → "Appify"
  - "ChatGPT" → "ChattyG"
  - Names of guests, the owner's products, niche terms - flag for review and add the owner's own recurring mis-transcriptions here
- **Iteration is the work.** First-draft chapters are 7/10 at best. The 7→9 iteration is where the value lives. Budget 30-45 min for the chapter feedback loop, not 5.
- **Don't ship the wrap-up chapter.** Wrap-up / goodbye / "thank you to the room" sections should be cut. Last value-bearing chapter extends to end of video.

---

## Sub-agent instructions

When spawning sub-agents for chapterization tasks, include in the prompt:
"Use the youtube-chapterize skill at `.claude/skills/youtube-chapterize/SKILL.md`. Follow the 8-step pipeline. Calibrate against the owner's gold-standard chapter set (see skill for path). Iterate with the owner 3-5 rounds before locking - never deliver the first draft as final."

---

## Related

- [[content-pipeline]] - content orchestration
- [[youtube-packaging]] - titles/thumbnails for the same upload
- `tools/transcribe/transcribe_timestamped.py` - the transcription executor (built on first use)
- The research-before-claims rule - verify YouTube specs before quoting
