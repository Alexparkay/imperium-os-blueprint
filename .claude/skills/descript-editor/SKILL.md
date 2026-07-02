---
name: descript-editor
description: Generate Descript Underlord prompts for podcast/video editing. Covers full editing workflows, clip creation, audio cleanup, captions, and credit-efficient prompt strategies. Trigger on any Descript editing request.
---

# Descript Editor Skill

Generate production-ready Underlord prompts for the owner's podcast and video editing workflow in Descript.

## When to Trigger

- "Give me a prompt for Descript"
- "Edit the [name] podcast in Descript"
- "Descript prompt for [task]"
- "Clean up the podcast"
- "Create clips from [episode]"
- "Underlord prompt"
- Any mention of Descript editing

## Context

Record the owner's Descript plan and credit allowance here during first use. The reference numbers below assume the **Business plan** (2,500 AI credits/month, 50 media hours/month). Large files (25-60GB) are imported manually into Descript - too large for API. The owner reviews and exports manually. This skill generates the PROMPTS the owner pastes into Underlord's chat sidebar.

## Credit Costs Reference

| Operation | Credits |
|-----------|---------|
| Filler word removal | FREE (no credits) |
| Studio Sound | ~10 |
| Remove retakes | ~10 |
| Eye Contact | ~10 |
| Green Screen | ~15 |
| Create clips | ~30 |
| Each Underlord chat message | ~2-5 (reasoning overhead) |
| VeO 3 video (fast, 8s) | ~24 |
| VeO 3 video (standard, 8s) | ~64 |

**Credit-saving rule:** Use the cheapest model for simple tasks (filler removal, Studio Sound). Switch to a stronger model only for complex multi-step edits. Underlord v2 uses ~20% fewer credits than v1. (Verify current costs against Descript's docs - pricing moves.)

## The Master Editing Order (ALWAYS follow this sequence)

### Phase 1: Cleanup (do these FIRST, in order)
1. **Identify speakers** (so Underlord makes smarter cuts)
2. **Remove retakes** (delete repeated takes, keep last complete version)
3. **Remove filler words** (use Ignore mode, not Delete, for nondestructive editing)
4. **Delete unwanted material** (tangents, pre-show chatter, bad segments)
5. **Shorten word gaps** (threshold 0.7s, shorten to 0.2-0.3s)

### Phase 2: Enhancement
6. **Apply Studio Sound** at 70-85% (NEVER 100%, sounds robotic)
7. **Level audio** across tracks/speakers
8. **Fix eye contact** (video only, straight-to-camera segments only)

### Phase 3: Visual Polish (video only)
9. **Set up scenes** and multicam switching
10. **Add lower thirds** / speaker name cards
11. **Add B-roll** where needed
12. **Add music** (intro/outro at 45% volume with 1s fade)
13. **Add chapter markers**

### Phase 4: Finishing
14. **Add captions** (style to brand)
15. **Generate show notes** with timestamps
16. **Full listen-through** before export

### Phase 5: Distribution
17. **Create clips** for social (do LAST, from polished edit)
18. **Translate/dub** only after ALL edits final (irreversible, creates new composition)

## Prompt Generation Rules

1. **Lead with a strong verb:** Remove, Apply, Create, Generate, Add, Style, Turn, Cut, Trim
2. **Include context:** platform, audience, tone, duration, format
3. **Use positive direction:** Say what TO DO, not what NOT to do
4. **Add constraints:** time limits, clip counts, visual rules
5. **Be specific about Studio Sound intensity:** Always specify percentage (70-85%)
6. **For filler words:** Always specify "use Ignore mode, not Delete"
7. **For retakes:** Always specify "use the last complete take"
8. **Break complex edits into steps:** One clear instruction per line, connected with "Then"

## Prompt Templates

### FULL PODCAST EDIT (Single Monster Prompt)

Use this when the owner says "edit the podcast" or "full edit" or "clean this up":

```
Identify all speakers and label them. Remove retakes, keeping the last complete take in each case. Remove filler words using Ignore mode (not delete) so I can restore any that sound unnatural. Shorten word gaps longer than 0.7 seconds down to 0.3 seconds. Apply Studio Sound at 75%. Add chapter markers dividing the content by topic. Generate timestamped show notes.
```

**For video podcasts, append:**
```
Set up automatic multicam switching based on active speaker. Add lower thirds with each speaker's name on first appearance. Add captions in Clean style.
```

### NAMED PODCAST EDIT

When the owner says "give me a prompt for the [Guest Name] podcast":

```
Identify all speakers and label them - the host is {{OWNER_SHORT}} and the guest is [GUEST NAME]. Remove retakes, keeping the last complete take. Remove filler words using Ignore mode. Shorten word gaps longer than 0.7 seconds to 0.3 seconds. Apply Studio Sound at 75%. Add chapter markers by topic. Generate show notes with timestamps and a brief episode description.
```

### AUDIO-ONLY PODCAST (no video)

```
Identify speakers. Remove retakes using the last complete take. Remove filler words with Ignore mode. Shorten gaps longer than 0.7 seconds to 0.3 seconds. Apply Studio Sound at 80%. Add chapter markers by topic. Generate show notes with timestamps.
```

### SOCIAL CLIPS (from finished edit)

```
Create [NUMBER] clips for [PLATFORM], each [DURATION] long. Format: [ASPECT RATIO]. Add bold captions. Select the most compelling, self-contained moments - prioritize stories, insights, and surprising statements over generic advice.
```

Platform presets:
- **Instagram Reels / TikTok:** `Create 5 clips for Instagram Reels, each 30-60 seconds, vertical 9:16 format. Add bold captions. Select moments with the strongest emotional hooks or surprising insights.`
- **YouTube Shorts:** `Create 3 clips for YouTube Shorts, each 45-60 seconds, vertical 9:16 format. Add captions. Focus on the most quotable, standalone insights.`
- **LinkedIn:** `Create 3 clips for LinkedIn, each 60-90 seconds, landscape 16:9 format. Add clean captions. Select moments about business strategy, results, or frameworks.`
- **Twitter/X:** `Create 3 clips for Twitter, each 30-45 seconds, square 1:1 format. Add bold captions. Select the single most provocative or contrarian statement per clip.`

### STUDIO SOUND ONLY

```
Apply Studio Sound at [75]% intensity to all audio tracks.
```

Adjust percentage based on recording quality:
- Clean studio recording: 55-65%
- Decent room with some noise: 70-80%
- Noisy environment (cafe, outdoors): 80-90%
- NEVER use 100% (clips word endings, sounds robotic)

### FILLER WORD CLEANUP ONLY

```
Remove filler words using Ignore mode. Keep any fillers that are part of natural conversational rhythm - only remove the ones that genuinely interrupt the flow.
```

### CHAPTER MARKERS

```
Make a list of all the distinct topics covered in this conversation, then add chapter markers at each topic transition. Title each chapter with a clear, descriptive name (not just "Topic 1").
```

### CAPTIONS

```
Add captions in [STYLE] style. Use [COLOR] text on [BACKGROUND]. Position at [POSITION].
```

Style options: Classic (line-by-line), Clean (word-by-word), Karaoke (highlighted active word)
Position: bottom-center (default), top, custom

### B-ROLL GENERATION

```
Find scenes that would benefit from B-roll. Generate images in a [STYLE] style that match the topic being discussed. Place them at natural transition points.
```

### TRANSLATION/DUBBING (use last, irreversible)

```
Translate and dub this episode into [LANGUAGE] using Match Timing mode. Use recommended voices for natural pacing.
```

### ROUGH CUT (trim long recording to target length)

```
Edit this [ACTUAL LENGTH] recording down to approximately [TARGET LENGTH]. Keep the strongest insights, stories, and exchanges. Remove tangents, repetitive sections, and low-energy stretches. Maintain the natural conversation flow.
```

### CONTENT ANALYSIS (ask Underlord for advice)

```
I want to turn this into a polished [FORMAT] for [PLATFORM]. What would you suggest for the best approach? What are the strongest moments?
```

## Advanced Techniques

### Monster Prompt Pattern
Chain multiple instructions with periods or "Then":
```
[Step 1]. Then [Step 2]. Then [Step 3]. Finally, [Step 4].
```

### Iterative Refinement
After first pass, follow up with specific feedback:
```
The third chapter marker is too late - move it to where [TOPIC] starts. Also, restore the filler word at [TIMESTAMP], it sounds unnatural without it.
```

### Self-Checking Prompts
Add verification conditions:
```
Add background music but ensure the speaker remains clearly audible at all times.
```

### Credit-Efficient Batching
Combine related operations into one prompt instead of separate messages (each message costs credits for reasoning overhead):
```
Remove retakes using last complete take. Remove filler words with Ignore mode. Shorten word gaps over 0.7s to 0.3s.
```
This costs fewer credits than three separate messages.

## Things That Don't Work (Don't Waste Credits)

1. **Custom layouts** - Underlord overwrites them with defaults. Apply custom layouts MANUALLY.
2. **Exact timestamp cutting** - "Cut from 1:23 to 2:45" is unreliable. Use text-based editing (delete the transcript text) instead.
3. **Non-contiguous clip assembly** - Cannot combine segments from different parts of the transcript into one clip.
4. **Show notes for production use** - Generated notes need heavy manual editing. Use as a starting point only.
5. **100% Studio Sound** - Always sounds robotic. Cap at 85%.
6. **Eye Contact on interview shots** - Only works for straight-to-camera. Creates "dead eyes" on profile/side shots.
7. **Trusting "viral" clip flags** - Underlord hallucinates quality. Always review clip selections.
8. **Projects over 60 minutes** - Performance degrades. If a podcast is 90+ min, consider splitting into segments.

## Model Selection Guide

Access via model picker in Underlord sidebar. Pick by task weight (model lineup changes - check what's current):
- **Cheapest/fastest tier** - filler removal, Studio Sound, simple cleanup, descriptions.
- **Mid tier (best instruction follower)** - complex multi-step monster prompts, precise editing.
- **Top tier** - creative decisions, content analysis, "what should I change" queries.
- **Default model** - most tested, fewest edge cases. Safe choice.

## Keyboard Shortcuts (for manual work between prompts)

| Action | Key |
|--------|-----|
| Select tool | A |
| Range tool | R |
| Blade tool | B |
| Hand tool | H |
| Slip tool | Y |
| Add marker | M |
| Search all actions | Ctrl+K |

## Workflow Decision Tree

```
Owner says "edit podcast" →
  Audio only? → AUDIO-ONLY PODCAST prompt
  Video podcast? → FULL PODCAST EDIT + video append

Owner says "create clips" →
  Which platform? → Use platform preset
  No platform specified? → Ask, then use preset

Owner says "clean up audio" →
  Just noise? → STUDIO SOUND ONLY
  Full cleanup? → Filler words + retakes + gaps + Studio Sound (batched)

Owner says "give me a prompt for the [Name] podcast" →
  Use NAMED PODCAST EDIT template
  Fill in guest name
  Ask if audio-only or video

Owner says "make clips from [episode]" →
  Ask: which platforms, how many clips, target duration
  Use SOCIAL CLIPS template with platform preset
```

## Output Format

When generating prompts, output:
1. The ready-to-paste prompt in a code block
2. Which Underlord model to select (if not default)
3. Estimated credit cost
4. Any manual steps the owner should do before/after

## Sources

- [Descript: How to Prompt Underlord](https://help.descript.com/hc/en-us/articles/38217205340813)
- [Descript: Underlord Beta Overview](https://help.descript.com/hc/en-us/articles/36803785502221)
- [Descript: Templates Workflow](https://help.descript.com/hc/en-us/articles/38948410031245)
- [Descript: Podcast Template](https://www.descript.com/templates/edit-a-podcast)
- Community intel: Reddit, Descript Canny, G2, Facebook Users Group
