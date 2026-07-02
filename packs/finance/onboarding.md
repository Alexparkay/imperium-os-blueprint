---
title: Finance pack - onboarding questions
type: onboarding-branch
pack: finance
---

# Installing the finance pack: what to ask

Asked by onboarding Phase 5 (or any later session) when this pack is installed. One question at a time. Record answers in `memory/onboarding-state.md` under a `## Pack: finance` heading, and route them to the files named below.

1. **"How is the business set up legally - one company, several, sole trader? Just the shape, so money conversations use the right entities."**
   → `context/org/company.md` (entity structure section). If multiple entities: note which accounts belong to which - transfers BETWEEN them are the classic double-count trap.

2. **"Where does the truth about your money live today - accounting software, a spreadsheet, your bank apps, an accountant? If it's software, which one?"**
   → The accounting source of truth, recorded in `memory/finance/README.md` under a "Source of truth" note. If it's an unconnected tool, say so honestly per the pipe-aware rule: statements can be exported into the drop folder today; a live pipe is a build item.

3. **"Where should bank/provider statement exports land so I can audit them? A folder is fine - I'll read whatever CSVs appear there."**
   → Create the folder (default `memory/finance/statements/`, gitignored if statements are sensitive - ask), note the path in `memory/finance/README.md`.

3b. **"Which accounts will those statements come from - the bank or provider names, one per account? Just names, no numbers."** (Skip if they're not sure yet.)
   → Write the names into the wallet table in the installed `finance-audit` skill (`.claude/skills/finance-audit/SKILL.md`), replacing its bank placeholder tokens; add or delete rows to match. Leave the pack source copy (`packs/finance/skills/finance-audit/`) untouched - it's the reinstall template. **If skipped:** the tokens stay and the skill's own "fill in during first audit" step collects them on the first real run.

4. **"Who signs off on money decisions - just you, or others? And roughly where are your lines: what amount should always stop for sign-off?"**
   → Hands straight into the `approval-thresholds` skill's setup interview (it asks the precise limits). Approver names → `memory/people.md`.

After the answers: run the `approval-thresholds` setup interview to completion, and if any statement export is available, run ONE `finance-audit` pass on it so the owner sees a reconciled result (or a clean FAIL with the reason) before the session ends.
