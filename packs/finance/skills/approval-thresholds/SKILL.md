---
name: approval-thresholds
description: "Define, record, and enforce the money boundaries: which spends, refunds, discounts, and contracts the system may treat as routine and which MUST stop for human approval. Trigger on 'approval threshold', 'spending limit', 'approval limit', 'set up approval rules', 'can I approve this', 'does this need sign-off', 'who has to approve', 'is this within budget authority', or ANY task where the system is about to draft, recommend, or schedule a spend, refund, discount, or contract commitment. Once thresholds exist in memory/finance/approval-thresholds.md, every money-touching answer checks them first: under threshold → proceed and note it; over threshold → stop, name the approver, and draft the approval request instead of the action."
metadata:
  title: Approval Thresholds
  type: skill
  status: active
  created: 2026-07-02
---

# Approval Thresholds

Money decisions need a bright line between "routine, proceed" and "stop, a human decides". This skill sets those lines with the owner once, writes them to memory, and enforces them in every later answer. The failure mode it kills: the system confidently drafting a vendor contract, refund, or purchase that should have waited for sign-off.

## When to use

- The owner asks to set up, change, or review approval rules or spending limits
- ANY task is about to produce a spend, refund, discount, or contract action (draft PO, refund email, renewal confirmation, vendor agreement) - check the thresholds FIRST
- The owner asks "can this go ahead?" about anything with a money amount attached
- A pack skill (vendor-tracker, cold-email-writer offers, client-delivery scoping) surfaces a figure that commits money

## When NOT to use

- Pure reporting on past transactions (that's finance-audit territory - historical, not a decision)
- Figures with no commitment attached (estimates, research, pricing analysis)
- The owner explicitly approves the specific action in the same message ("refund them the 200, go") - that IS the approval; record it and proceed

## The pipeline

1. **Load or create the threshold file.** Read `memory/finance/approval-thresholds.md`. If it doesn't exist, run the setup interview (step 2). If it exists, skip to step 3.
2. **Setup interview (one question at a time, owner's currency throughout):**
   - a. "Up to what amount can a routine expense just happen - software, supplies, small vendor invoices?" → `spend_routine`
   - b. "And what amount should ALWAYS stop for your sign-off, no matter what it's for?" → `spend_hard_stop` (everything between a and b: proceed but flag in the same message)
   - c. "Refunds and discounts: what can be given without asking you?" → `refund_limit`, `discount_limit` (percent or amount)
   - d. "Contracts and renewals: which ever proceed without you - any? Most owners say none." → `contract_rule` (default: ALL contracts need sign-off)
   - e. "Who approves when you're unavailable, if anyone?" → `fallback_approver` (or "nobody - it waits")
   - Write the answers to `memory/finance/approval-thresholds.md` as a table with an `updated:` date, and read the table back for confirmation before saving.
3. **Classify the action at hand.** Category (spend / refund / discount / contract) + amount + counterparty. If the amount is unknown, treat it as over-threshold - unknown never defaults to "routine".
4. **Enforce:**
   - **Under threshold:** proceed with the task; append one line to the output: "Within your [category] threshold ([amount] < [limit]) - proceeding."
   - **Between routine and hard-stop:** proceed, but flag it prominently at the top of the reply with the amount and the limit it's approaching.
   - **Over threshold (or any contract):** do NOT execute. Output the block: what was requested, why it's over ([amount] vs [limit]), who approves, and a ready-to-send approval request (2-3 sentences, the approver only needs to reply yes/no). Nothing irreversible happens until the approval lands in chat.
5. **Log the decision.** Append one line to `memory/finance/approval-log.md` (create if missing): date · category · amount · under/over · outcome. Provenance discipline applies - amounts come from the source document or the owner's message, never estimated.
6. **Threshold changes need the owner verbatim.** Only the owner (or a named fallback approver, for their own scope) can change a limit, and only by stating the new number in chat. Quote the old and new value back before writing.

## Hard rules

- **Unknown amount = over threshold.** Never guess an amount to squeak under a limit (rule 31: figures need provenance).
- **Contracts default to sign-off.** Auto-renewals count as contracts.
- **Never batch to evade.** Three payments under-threshold to one counterparty in one task = treat as their sum.
- **The block message is a draft, not a nag.** Always include the ready-to-send approval request so the human decision costs one reply.

## Self-evaluation

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 9/10 | Covers spend, refund, discount, contract + unknown-amount and batching edge cases |
| Actionability | 9/10 | Binary classification, exact file targets, scripted interview |
| Specificity | 8/10 | Limits are owner-defined at install; skill can't know good defaults for every business |
| Integration | 9/10 | Enforces rule 31, writes to memory/finance/, feeds the approval-log |
| Overhead | 9/10 | One file read per money task; interview runs once |
| **Average** | **8.8/10** | |

---

## Related

- [[finance-audit]]
- `memory/finance/README.md` (provenance conventions)
- `.claude/rules/31-financial-accuracy.md`
