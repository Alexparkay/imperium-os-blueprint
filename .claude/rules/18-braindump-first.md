---
title: "MANDATORY: Every Brain Dump Through the Router"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Every Brain Dump Through the Router

Owners talk to this OS in brain dumps: stream of consciousness, multiple topics per message, often voice-transcribed (so expect transcription errors). Before responding to ANY brain dump, run the `braindump-router` skill.

## Trigger: run the router when ANY of these hit

- Word count > 50
- Multiple distinct asks in one message
- Stream-of-consciousness markers: starts with "so...", "basically", "I was thinking", "yeah", rambling structure
- Visible voice-transcription artifacts: homophone swaps, dropped punctuation, mangled proper nouns
- Any conversational input that isn't a direct command

## Skip when

- Single-line factual question ("what time is it", "what does this file do")
- Explicit slash command
- Tool-error recovery or continuation of the current task
- System messages, hooks, reminders
- You are already mid-execution of a task the owner just approved

## The pipeline

Router lives at `.claude/skills/braindump-router.md`. It runs 5 steps:

1. **Clean** - Apply `.claude/skills/wispr-corrections.md` to fix transcription errors
2. **Extract** - Parse numbered intents (action, object, constraints, urgency)
3. **Route** - Match each intent to the skill routing table (rule 04) or a direct tool
4. **Score** - Confidence 0-100 per intent, aggregate to HIGH/MEDIUM/LOW tier
5. **Act**:
   - **HIGH** (85-100): execute silently, 1-line TL;DR at top
   - **MEDIUM** (60-84): 2-line preface ("Reading this as X, Y, Z. Running X now"), then execute
   - **LOW** (<60): ask ONE targeted question, never multiple

## Hard rules

- Never respond to a brain dump from pattern-matching alone
- Never ask 3 clarifying questions at once. Pick the most likely interpretation, ask about the specific ambiguity
- Never list 5 interpretations and make the owner choose. Be decisive
- Always log the parsed output to `.context/braindump/<timestamp>.md` for audit
- If the router catches a new transcription-error pattern, append it to `wispr-corrections.md`

## Integration with other rules

- **Rule 04 (skill routing):** the router consults this to match intents to skills
- **Rule 17 (concise chat):** the router's TL;DR and prefaces are bullets, not prose
- **Rule 10 (quality gate):** if deliverables are produced, quality-gate runs after

## Sub-agents

When spawning sub-agents, include the cleaned intent (not the raw brain dump). Sub-agents should receive structured instructions, not stream-of-consciousness transcripts.
