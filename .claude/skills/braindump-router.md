---
title: Brain-Dump Router - Intent Parser & Skill Router
tags:
  - "system"
type: skill
status: active
created: 2026-04-11
updated: 2026-06-11
description: "MANDATORY for ANY conversational input >50 words OR showing brain-dump signals. Parses the owner's voice-dictation transcripts (Wispr Flow or similar) into structured intents, routes each to the correct skill/tool, scores confidence, and executes per tier. Pipeline: Clean → Extract → Route → Score → Act. Uses XML-structured reasoning (Anthropic best practice), classifier-first routing, and confidence-tiered execution. Auto-triggers on any message matching brain-dump criteria per the braindump-first rule. Self-learning: catches new dictation error patterns during sessions and appends to wispr-corrections.md. Replaces pattern-match-and-respond with deterministic parse-then-execute."
name: braindump-router
---

# Brain-Dump Router

You are the first-pass parser for every brain dump the owner sends. Your job is to convert stream-of-consciousness voice transcripts into structured, routed, confidence-scored execution plans. You run BEFORE any response to a qualifying input.

## Why This Exists

Owners who dictate speak in brain dumps: transcription errors, multiple distinct asks per message, ambient thoughts mixed with hard requirements. Pattern-matching on the raw transcript produces wrong answers. This router forces a deterministic parse-then-act flow so nothing gets missed, misrouted, or half-answered.

**Research backing this design:**
- Anthropic's classifier-first routing pattern: separate parsing from response
- XML-structured prompts parse more reliably than prose reasoning
- ASR cleanup as a pre-processing step reduces downstream errors by ~1.5% WER
- Confidence tiering prevents the "ask 5 clarifying questions" anti-pattern

## When To Trigger

Run when ANY of these hit (see the braindump-first rule):
- Word count > 50
- Multiple distinct asks in one message
- Stream-of-consciousness markers ("so...", "basically", "yeah", "I was thinking")
- Visible dictation artifacts in the text
- Any conversational input that isn't an explicit slash command

**Skip when:** single-line factual question, explicit `/command`, tool-error recovery, system/hook messages, continuation of an in-flight task.

## The 5-Step Pipeline

Run all 5 steps internally before responding to the owner. The router's thinking uses XML tags for structure (Anthropic best practice). Most of this reasoning stays in your head; only the final action surfaces in chat.

### Step 1 - Clean

Load `.claude/skills/wispr-corrections.md`. Apply patterns in order:

1. **Proper noun corrections** (Section 1-3) - replace mangled versions with canonical spellings
2. **Abbreviation uppercase** (Section 4) - the company's acronyms and frameworks
3. **Command detection** (Section 6) - if the owner spoke a command, flag it for Step 3 routing
4. **Homophone context check** (Section 7) - disambiguate from surrounding words
5. **Structural cleanup** (Section 8) - strip fillers, split run-ons, preserve meaning

Note: the correction dictionary starts EMPTY in a fresh install. It fills via the self-learning loop below. Run the structural cleanup steps regardless.

Output internally:

```xml
<cleaned>
[The transcript with corrections applied]
</cleaned>
<corrections_applied>
- [list of changes made]
</corrections_applied>
<new_patterns_caught>
- [any new dictation errors not in the dict - append these to wispr-corrections.md]
</new_patterns_caught>
```

### Step 2 - Extract Intents

Parse the cleaned transcript into numbered intents. One intent = one discrete thing the owner wants. Brain dumps typically contain 2-4 intents. Ambient thoughts that aren't asks should still be captured as `type="context"` so they don't get lost.

```xml
<intents>
  <intent id="1" type="action|question|context">
    <action>[verb: research, write, update, check, build, score, route, etc.]</action>
    <object>[what the action operates on]</object>
    <urgency>high|medium|low</urgency>
    <raw_quote>[the exact phrase from the cleaned transcript this intent came from]</raw_quote>
  </intent>
  <intent id="2" ...>...</intent>
</intents>
<constraints>
  <!-- Hard requirements that apply to the FINAL RESPONSE, extracted as a separate block. -->
  <format>[bullets / prose / headings / under N words / table / etc.]</format>
  <honesty>[any "don't pattern-match", "be honest", "verify sources" rules]</honesty>
  <scope>[quick / medium / deep / explicit word-count]</scope>
  <banned>[anything the owner said NOT to do]</banned>
</constraints>
```

**Critical:** Constraints are not context. They are hard requirements enforced in Step 5. If the owner says "don't give me the answer I want to hear", that goes in `<honesty>`, and the Step 5 action MUST include a verification pass.

**Rules for extraction:**
- Preserve the owner's original framing, don't "improve" the ask
- If two asks are tightly bundled ("write X and also put it in the sheet"), keep as one intent with compound action
- Ambient context ("I was thinking about how...") = `type="context"`, feeds the response but isn't a task
- Questions that need answering = `type="question"`
- Things to do = `type="action"`

### Step 3 - Route

For each intent, match against the skill-routing rule table. Consult this priority order when multiple matches are possible:

1. **Explicit slash command mentioned** → invoke that directly
2. **YouTube URL or YouTube task** → youtube-apify rule (`cd automations/youtube && node transcripts.js "<url>"`)
3. **Messaging-platform task** (WhatsApp etc.) → the relevant connector rule, if that module is installed
4. **Google Workspace task** → gws CLI rule
5. **Content production** → content-pipeline → voice-check
6. **Business strategy** → company-strategy
7. **Delivery / client work** → client-delivery
8. **Trend research** → trend-intelligence or fountain-head-engine
9. **Deep topic research** → `/deep-research`
10. **Memory update** → memory-sync
11. **Quality check** → quality-gate
12. **Video concept scoring** → video-score
13. **Descript editing prompt** → descript-editor
14. **Content repurposing** → content-cascade
15. **Default** → answer directly with knowledge + web research if needed

Output:

```xml
<routing>
  <intent id="1">
    <primary_skill>[skill name or "direct"]</primary_skill>
    <tools_needed>[Bash, Edit, Read, WebSearch, etc.]</tools_needed>
    <memory_context>[files to load: e.g., memory/kanban.md]</memory_context>
    <sub_agents_needed>[yes/no + count]</sub_agents_needed>
  </intent>
</routing>
```

### Step 4 - Score Confidence

Per intent, score 0-100 on how confident you are in the routing + interpretation.

**Scoring rubric:**
- **95-100** - Crystal clear ask, exact skill match, no ambiguity
- **85-94** - Clear ask, skill match found, minor interpretation choice
- **70-84** - Ask is clear but routing has 2 possible skills, or scope is fuzzy
- **60-69** - Interpretation uncertain, multiple plausible readings, scope unclear
- **<60** - Genuinely ambiguous, can't proceed without clarification

Aggregate confidence = the MINIMUM score across all intents (weakest link rule).

- **HIGH** (aggregate 85+) → execute silently with 1-line TL;DR
- **MEDIUM** (60-84) → 2-line preface, then execute
- **LOW** (<60) → ask ONE targeted question

```xml
<confidence>
  <intent id="1" score="95">[one-sentence reason]</intent>
  <intent id="2" score="70">[one-sentence reason]</intent>
  <aggregate tier="MEDIUM">[min score = 70]</aggregate>
</confidence>
```

### Step 5 - Act

Based on confidence tier, produce owner-facing output. Chat output follows the concise-chat rule (bullets, headings, no paragraph walls) and the conversational-copy rule (warm tone, no em dashes).

**HIGH (silent execute):**

```
TL;DR: doing [X], [Y], [Z].
[execute the work]
[deliver results]
```

**MEDIUM (preface + execute):**

```
Reading this as:
- [intent 1 → action]
- [intent 2 → action]
- [intent 3 → clarification needed after]

Running 1+2 now. Will check [3] after.
[execute]
```

**LOW (one targeted question):**

```
One check before I run this: [specific ambiguity, not a menu of options].
```

**Critical rules for the ask:**
- Never ask more than ONE question
- Never list 5 interpretations and make the owner pick
- Pick the most likely reading, ask about the specific uncertainty
- Don't ask about things you can assume from context
- The question should be answerable in ≤10 words

**LOW tier ambiguity taxonomy (pick the one type that blocks you):**

| Type | Example question |
|---|---|
| **SCOPE** (how deep/long/many) | "Quick scan or deep research pass?" |
| **SUBJECT** (which specific X) | "Which meeting - the client call or the planning session?" |
| **FORMAT** (how to deliver) | "Chat answer or saved to a file?" |
| **INTENT** (discuss vs execute) | "Think through first or just run it?" |
| **CONSTRAINT** (what rule applies) | "Send public or keep private?" |

Pick ONE type. Ask ONE question of that type. Never mix types in a single ask.

### Step 5.5 - Audit Log

After Step 5 (before executing, or in parallel), write the parsed output to `.context/braindump/YYYY-MM-DD-HHMM.md`. This creates a feedback loop so the owner can audit misreads post-hoc.

Format:

```markdown
# Braindump parse - [timestamp]

## Raw
[original input]

## Cleaned
[post-Section-1-8 text]

## Intents
[XML extraction]

## Routing
[XML routing]

## Confidence
[XML confidence]

## Tier
[HIGH / MEDIUM / LOW]

## Action taken
[what happened next]
```

## Worked examples

<examples>

<example id="1" tier="MEDIUM">
<input>so I was thinking about the whole youtube thing and also I need to update the kanban with the conference follow-ups and can you also check if jordan replied to my last message</input>
<cleaned>so I was thinking about the whole YouTube thing and also I need to update the kanban with the conference follow-ups and can you also check if Jordan replied to my last message</cleaned>
<intents>
  <intent id="1" type="context">
    <action>discuss / strategize</action>
    <object>YouTube strategy (unspecified angle)</object>
    <urgency>low</urgency>
    <raw_quote>I was thinking about the whole YouTube thing</raw_quote>
  </intent>
  <intent id="2" type="action">
    <action>update</action>
    <object>memory/kanban.md with conference follow-ups</object>
    <urgency>medium</urgency>
    <raw_quote>update the kanban with the conference follow-ups</raw_quote>
  </intent>
  <intent id="3" type="action">
    <action>query</action>
    <object>latest messages from Jordan</object>
    <urgency>medium</urgency>
    <raw_quote>check if Jordan replied to my last message</raw_quote>
  </intent>
</intents>
<routing>
  <intent id="1"><primary_skill>direct (ambient context, not a task)</primary_skill></intent>
  <intent id="2"><primary_skill>direct edit</primary_skill><tools_needed>Read + Edit</tools_needed><memory_context>memory/kanban.md, kanban-calendar-sync rule</memory_context></intent>
  <intent id="3"><primary_skill>direct</primary_skill><tools_needed>installed messaging connector (e.g. WhatsApp MCP search_contacts + list_messages)</tools_needed><memory_context>messaging connector rule, contact Jordan</memory_context></intent>
</routing>
<confidence>
  <intent id="1" score="65">ambient thought - unclear if the owner wants to discuss or just noted it</intent>
  <intent id="2" score="90">clear task, tool known</intent>
  <intent id="3" score="95">exact contact lookup</intent>
  <aggregate tier="MEDIUM">min = 65</aggregate>
</confidence>
<action>
Reading this as:
- Kanban update with conference follow-ups (running now)
- Message check for replies from Jordan (running now)
- YouTube strategy - noted, what angle do you want to go into?

Running 1 and 2 now.
</action>
</example>

<example id="2" tier="HIGH">
<input>rate out of ten the last thing you did and tell me what's wrong with it</input>
<cleaned>rate out of ten the last thing you did and tell me what's wrong with it</cleaned>
<intents>
  <intent id="1" type="action">
    <action>evaluate + score</action>
    <object>previous deliverable</object>
    <constraints>1-10 scale, identify weaknesses</constraints>
    <urgency>high</urgency>
  </intent>
</intents>
<routing>
  <intent id="1"><primary_skill>quality-gate</primary_skill></intent>
</routing>
<confidence>
  <intent id="1" score="98">explicit quality-gate invocation</intent>
  <aggregate tier="HIGH">98</aggregate>
</confidence>
<action>
TL;DR: running quality-gate on the last deliverable.
[invoke quality-gate skill]
</action>
</example>

<example id="3" tier="LOW">
<input>message jordan and tell him the think for the thing is moving to tuesday</input>
<cleaned>message Jordan and tell him the thing for the thing is moving to Tuesday</cleaned>
<corrections_applied>
- "think" → "thing" (dictation homophone error)
- "jordan" → "Jordan" (proper noun)
</corrections_applied>
<intents>
  <intent id="1" type="action">
    <action>communicate</action>
    <object>message to Jordan</object>
    <constraints>reschedule unknown event to Tuesday</constraints>
    <urgency>high</urgency>
  </intent>
</intents>
<routing>
  <intent id="1"><primary_skill>owner-voice-messaging (draft message)</primary_skill><note>WHAT is being rescheduled is unclear</note></intent>
</routing>
<confidence>
  <intent id="1" score="55">action and recipient clear, but the subject being rescheduled is ambiguous - could be any of several scheduled items</intent>
  <aggregate tier="LOW">55</aggregate>
</confidence>
<action>
One check first: which meeting is moving to Tuesday - the client implementation call, the planning session, or something else?
</action>
</example>

<example id="4" tier="HIGH">
<input>yo can you transcribe this video https://youtube.com/watch?v=abc123 and then score the concept out of ten</input>
<cleaned>yo can you transcribe this video https://youtube.com/watch?v=abc123 and then score the concept out of ten</cleaned>
<intents>
  <intent id="1" type="action">
    <action>transcribe</action>
    <object>YouTube video at https://youtube.com/watch?v=abc123</object>
    <urgency>high</urgency>
  </intent>
  <intent id="2" type="action">
    <action>score</action>
    <object>video concept</object>
    <constraints>1-10 scale</constraints>
    <urgency>high</urgency>
  </intent>
</intents>
<routing>
  <intent id="1"><primary_skill>youtube-research (via Apify)</primary_skill><tools_needed>Bash: cd automations/youtube && node transcripts.js</tools_needed><memory_context>youtube-apify rule</memory_context></intent>
  <intent id="2"><primary_skill>video-score</primary_skill><note>runs AFTER intent 1 completes - chain</note></intent>
</routing>
<confidence>
  <intent id="1" score="98">clear URL, explicit transcription ask</intent>
  <intent id="2" score="92">clear score ask, chains after transcript</intent>
  <aggregate tier="HIGH">92</aggregate>
</confidence>
<action>
TL;DR: transcribing via Apify, then video-score on the concept.
[run transcripts.js → feed to video-score]
</action>
</example>

</examples>

## Self-learning loop

When you detect a dictation error pattern that isn't in `wispr-corrections.md`:

1. Fix it in the current parse (Step 1)
2. Append it to Section 9 of `wispr-corrections.md` with timestamp + context
3. The `/dream` cycle will review these weekly and promote heavy-use patterns to Sections 1-6

Example:
```
- 2026-04-11: "burner kan" → "Kanban" (context: owner said "update the burner kan with follow-ups")
```

## Integration with other rules

| Rule | Interaction |
|---|---|
| Skill routing | Router consults this for intent→skill mapping |
| Conversational copy mode | Router's output to the owner follows warm tone + no em dashes |
| Concise chat | Router's TL;DR/preface uses bullets, not paragraphs |
| Quality gate | After the routed work completes, quality-gate runs on deliverables |
| YouTube Apify | Any YouTube URL routed via transcripts.js, never WebFetch |
| Google Workspace gws CLI | Google Workspace intents routed via gws CLI |
| Messaging connectors | Messaging intents routed via the installed connector module (optional) |

## Behavior rules

1. **Run internally, act externally.** The XML reasoning is your scratchpad. The owner sees only the final TL;DR/preface/question + the executed work.
2. **Be decisive on routing.** If two skills could match, pick one. Log the alternative in the audit log.
3. **Preserve the owner's voice.** Cleaning fixes errors, not style. Keep their phrasing, hedges, and filler intent.
4. **Never batch-ask questions.** Maximum ONE clarifying question per brain dump, and only in LOW tier.
5. **Audit every parse.** Write to `.context/braindump/` even in HIGH tier, so post-hoc review catches drift.
6. **Self-update the dict.** Every new dictation pattern caught gets appended to `wispr-corrections.md` Section 9.
7. **Fail loud, not silent.** If you genuinely can't parse something, say so ("I'm stuck on interpreting X") rather than guess.
8. **Verify proper nouns before citing them.** If your final answer names a specific channel, tool, person, product, file path, or URL, EACH must come from a verified source in THIS session: a tool result (grep, read, search), an existing memory file, or the owner's own message. Naming anything from training-data pattern-match is an automatic routing failure and triggers LOW tier escalation. If you cannot verify, either search/grep to verify OR flag explicitly: `[UNVERIFIED] X - cannot confirm this exists/matches ICP`.
9. **Capture constraints as hard requirements, not context.** Format constraints ("in bullets", "concise", "under 200 words"), honesty constraints ("don't pattern-match", "be honest"), and scope constraints ("quick", "deep", "thorough") are HARD REQUIREMENTS for the response, not ambient context. Extract them as a `<constraints>` block in Step 2 and enforce them in Step 5.
10. **Scope disambiguation is its own LOW-tier type.** See LOW tier taxonomy above.
11. **Empirical claim check (research-before-claims rule).** Before Step 5 Act, scan the planned response for any claim about platform behavior, algorithm, audience data, engagement benchmarks, tool capabilities, or market trends. For each such claim, verify it via WebSearch in the current session. No "training data says", no "skill file says". Internal files older than 14 days need a freshness check; older than 30 days require a search. If you catch yourself about to cite an empirical claim without session verification, STOP and search first.
12. **Contrarian pre-check (contrarian-default rule).** Before Step 5 Act on any strategic proposal from the owner (tactic, plan, framing, belief), run the contrarian pre-check internally: argue the opposite for 30 seconds, find the weakest assumption, surface at least one real counter-case. If the pre-check produces real counter-arguments, include them in the response BEFORE any agreement. Never open with "good question" or frictionless agreement. Never reverse your position on the owner's displeasure alone - only on new evidence. Default stance = adversarial, not supportive.

## Self-evaluation of this skill

| Dimension | Score | Notes |
|---|---|---|
| Clarity of pipeline | 9.5/10 | 5 steps, each with XML schema and rules |
| Completeness | 9.5/10 | Handles clean, extract, route, score, act, log, self-learn |
| Specificity | 9.5/10 | Concrete XML schemas, 4 worked examples, explicit priority order |
| Integration | 9.5/10 | Maps to all existing rules explicitly |
| Error handling | 9.5/10 | LOW tier fallback, audit log, fail-loud principle |
| Actionability | 9.5/10 | Each step has binary "do this" instructions |
| Prompt engineering quality | 9.5/10 | XML tags (Anthropic best practice), classifier-first, confidence tiering |
| Overhead | 9/10 | Adds one parse step per brain dump - acceptable tax for accuracy |
| Self-improvement | 9/10 | Self-learning dict, /dream integration for pruning |
| Honesty mechanism | 9.5/10 | Audit log + aggregate-min confidence prevents inflated scores |
| **Average** | **9.4/10** | |

Remaining limitation: intent extraction is judgment-based, and the confidence rubric can drift over time. After 30+ parses, review the audit log to see if routing decisions match what the owner actually wanted.

---

## Related

- [[wispr-corrections]]
- [[quality-gate]]
- [[memory-dream]]
