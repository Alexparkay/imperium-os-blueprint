---
name: vendor-tracker
description: "Maintain the vendor register - every supplier, subscription, and service provider with contact, cost, renewal date, and notice period - in memory/vendors.md. Trigger on 'add a vendor', 'vendor list', 'when does [vendor] renew', 'what are we paying [vendor]', 'what subscriptions do we have', 'cancel [vendor]', 'who's our contact at [vendor]', 'update the vendor register', or any mention of a new supplier, tool subscription, contract renewal, or notice period. Renewal and notice dates also land in memory/calendar.md so nothing lapses (or auto-renews) silently."
metadata:
  title: Vendor Tracker
  type: skill
  status: active
  created: 2026-07-02
---

# Vendor Tracker

Auto-renewals are the quietest leak in a business: nobody chose to keep paying, nobody chose to stop. This skill keeps one register of every vendor with the four facts that matter - what it costs, when it renews, how long the notice period is, and who to talk to - and puts the dates on the calendar where they can interrupt.

## When to use

- A new vendor, tool, subscription, or service provider is mentioned as in use or being signed
- Any question about what a vendor costs, when it renews, or who the contact is
- "What are we paying for?" / subscription audits / cost-cutting passes
- A cancellation or renegotiation intent ("we should drop X") - record intent AND the notice window
- After finance-audit runs (if the finance pack is installed): recurring charges with no register entry are unregistered vendors - offer to add them

## When NOT to use

- One-off purchases with no ongoing relationship (they're transactions, not vendors)
- Deep contract review or negotiation strategy - the register points at the contract, it doesn't interpret it
- Client relationships (clients live in `clients/`, people in `memory/people.md` - a vendor row can cross-link, never duplicate)

## The register schema

`memory/vendors.md` - create on first use with this exact structure:

```markdown
# Vendor register

Updated: YYYY-MM-DD · Dates also live in memory/calendar.md · Costs follow provenance (rule 31): from an invoice/statement or marked [UNVERIFIED]

| Vendor | What for | Cost | Billing | Renewal date | Notice period | Contact | Status |
|---|---|---|---|---|---|---|---|

## Watchlist
(vendors flagged for cancellation/renegotiation: vendor · intent · decide-by date)

## Log
(dated one-liners: added/changed/cancelled what, and why)
```

Status values: `active` · `watch` · `cancelling` · `ended`.

## The pipeline

1. **Read the register.** `memory/vendors.md`; create from the schema above if missing.
2. **Capture/update the row.** Fill what's known; missing renewal date or notice period gets `?` - never a guess. Cost figures follow provenance: from an invoice, statement, or the owner's explicit statement, else `[UNVERIFIED]`.
3. **Calendar the dates.** Renewal date → `memory/calendar.md`. If there's a notice period, ALSO calendar the last-safe-cancel date (renewal minus notice, minus 7 days buffer) - that's the date that matters, labelled: "Last safe day to cancel [vendor]".
4. **Cross-link, don't duplicate.** Contact person → one entry in `memory/people.md`, referenced by name from the register row.
5. **Log the change.** One dated line in the register's Log section.
6. **Answer queries from the register only.** If the register lacks the answer, say exactly which field is missing and ask for the source (invoice, contract) - never fill gaps from memory of "typical" pricing.

## Hard rules

- **`?` beats a guess.** An unknown notice period marked `?` triggers a follow-up; a guessed one triggers a missed cancellation.
- **The last-safe-cancel date is the real deadline.** A renewal reminder ON the renewal date is a bill, not a reminder.
- **Watchlist items need a decide-by date.** "We should probably drop X" without a date is how X renews again.

## Self-evaluation

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 9/10 | Register + watchlist + log; capture, query, cancel, and audit-reconcile paths |
| Actionability | 9/10 | Exact schema shipped in the skill; fixed status vocabulary; calendar mechanics spelled out |
| Specificity | 9/10 | Last-safe-cancel arithmetic is deterministic; provenance rule for costs is binary |
| Integration | 9/10 | calendar.md, people.md, finances via rule 31, finance-audit handshake when present |
| Overhead | 8/10 | One extra calendar write per vendor; worth it, but it is bookkeeping |
| **Average** | **8.8/10** | |

---

## Related

- [[process-health]] (flags lapsing renewals weekly)
- `memory/vendors.md` · `memory/calendar.md`
- `.claude/rules/31-financial-accuracy.md`
