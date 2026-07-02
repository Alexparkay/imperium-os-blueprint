---
name: meeting-notes-to-actions
description: "Turn a meeting transcript, voice-note dump, or raw notes into a clean action list - each action with an owner, a deadline, and a source line - and land it on memory/kanban.md. Trigger on 'process these meeting notes', 'actions from this meeting', 'what did we agree', 'extract action items', 'turn this call into tasks', 'here are my notes from the call with', or whenever the owner pastes a transcript or notes from any call, meeting, or working session. Also catches decisions and open questions, not just tasks - decisions go to the right memory file, open questions get parked visibly instead of silently dropped."
metadata:
  title: Meeting Notes to Actions
  type: skill
  status: active
  created: 2026-07-02
---

# Meeting Notes to Actions

The most expensive sentence in operations is "I thought YOU were doing that". This skill turns messy meeting output into an unambiguous list: every action has one owner, one deadline, and a pointer back to the line that created it - then it lands on the kanban where the weekly pulse can see it.

## When to use

- The owner pastes a transcript, notes, or a voice-note dump from any meeting or call
- "What did we agree with [vendor/candidate/partner]?" right after a meeting
- End of a working session in chat where 3+ commitments were made and nothing was filed yet

## When NOT to use

- A single task stated directly ("add X to the board") - just write it to the kanban, no pipeline needed
- Transcripts processed for CONTENT (quotes, clips, chapters) - that's a content-pack job
- Historical meetings already processed (check `memory/kanban.md` for the meeting's actions before re-extracting; duplicates poison the board)

## The pipeline

1. **Ingest.** Take the pasted text or read the file. If it's voice-transcribed, apply the base transcription-correction pass first (proper nouns, homophones) - a misheard name becomes a mis-assigned action.
2. **Extract three streams**, tagging each item with the source line/timestamp:
   - **Actions:** anything someone committed to do. Verb-first, one owner each. "We should look into X" with no owner → it's an open question, not an action.
   - **Decisions:** anything agreed as settled ("we're going with the monthly plan"). These are memory, not tasks.
   - **Open questions:** raised but unresolved. Park them; don't invent owners.
3. **Assign owners and dates.** Use names from the transcript. Unnamed but clearly the owner's → owner. Genuinely unclear → mark `owner: UNASSIGNED` and list it FIRST in the output (unassigned actions are the ones that die). Dates: explicit dates as stated; "next week" style → concrete date from meeting date; none → `no deadline stated`. Never invent a deadline.
4. **Confirm before filing.** Show the three lists (actions / decisions / open questions) in one screen. Ask ONE question max, and only if an UNASSIGNED item blocks filing. Otherwise: "Filing these - flag anything wrong."
5. **File:**
   - Actions → `memory/kanban.md` under the right column, format: `- [ ] <verb-first action> - @<owner> - due <date> (src: <meeting> <date>)`
   - Dated items → `memory/calendar.md`
   - Decisions → the relevant `memory/business/` doc (or `memory/patterns.md` for lessons); people facts → `memory/people.md`
   - Open questions → a `### Open questions - <meeting> <date>` block at the bottom of the kanban
6. **Report.** One line: "N actions filed (N unassigned), N decisions recorded, N open questions parked." List the unassigned ones explicitly.

## Hard rules

- **One owner per action.** "Both of us" → split into two actions or name the lead.
- **Never invent deadlines or owners.** Absence is information; make it visible instead of papering over it.
- **Decisions are not actions.** Filing a decision as a task creates zombie work.
- **The kanban is the single destination for actions.** No side lists, no separate action files.

## Self-evaluation

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 9/10 | Actions + decisions + open questions; unassigned handling; duplicate guard |
| Actionability | 9/10 | Exact kanban line format, fixed destinations, one-screen confirm |
| Specificity | 8/10 | Owner inference from messy transcripts stays judgment; mitigated by UNASSIGNED-first rule |
| Integration | 9/10 | Feeds kanban/calendar/people/business files the base already maintains; process-health reads the result |
| Overhead | 9/10 | One confirm step; single-task inputs bypass the pipeline entirely |
| **Average** | **8.8/10** | |

---

## Related

- [[process-health]]
- `memory/kanban.md` · `memory/calendar.md`
- `.claude/rules/16-kanban-calendar-sync.md` (via rules-import)
