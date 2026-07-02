# Role card - Head of finance / money

Used by Phases 2, 4, and 5 when the seat owns the money: finance, accounts, bookkeeping oversight, financial planning.

One rule shadows everything on this seat: **figures come from source files and scripts, never from the model's memory** (the always-on financial-accuracy rule). Set that expectation early - it reads as rigour, because it is.

## Seat interview (Phase 2)

1. **"What does finance own at [company] - bookkeeping oversight, cash planning, invoicing, payroll, all of it? And what's handled outside, by an accountant?"** → department mission.
2. **"What 2 to 4 numbers is your seat measured on - cash on hand, runway, receivables, margin?"** → KPIs.
3. **"Who do you answer to on money calls, and who besides you can approve a payment?"** → answers to.
4. **"Who lands requests on your desk, and what do they ask for? 'Can we afford this', 'chase that invoice', 'what did we spend on X'?"** → incoming-request map (also feeds Phase 5).
5. **"Where are the lines: what amount can you approve alone, what stops for the owner, and what should NEVER move without a human - payments, refunds, contracts?"** → approval boundary. This answer feeds straight into the finance pack's thresholds setup if they install it.

## Recommended connectors (Phase 4)

After the universal spine (github-backup → google-workspace - Sheets is this seat's workbench, so Workspace is near-mandatory):

- `telegram-notify` - "When an audit finishes or something needs your sign-off, your phone buzzes."
- Not a connector, but set it up in this phase: a **statements drop folder** - "One folder where your bank and provider exports land; I read whatever appears there." (Default `memory/finance/statements/` once the finance pack is in; keep it out of the cloud backup if statements are sensitive - ask.)
- Install-team tier to name if it comes up: `company-brain` - "Live financial dashboards need a database under them; that's a build-team conversation." Point at `docs/connectors/not-yet.md` for accounting-tool feeds (QuickBooks-style pipes are full-build scope; exports work today).

## First tasks + pack (Phase 5)

**Pack recommendation:** `finance` - "Two skills and a discipline: penny-accurate statement audits where every figure traces to a source row, and spend/refund/contract thresholds so 'does this need sign-off' always has an answer." The pack's setup asks the entity-structure and source-of-truth questions; the approval lines from the seat interview hand straight into it.

**First-task prompt sheet** (if they're stuck picking):
- One real statement export → one reconciled, categorised audit (the pack's first win).
- The weekly cash note: in, out, balance, anything odd - one screen.
- The receivables chase list: who owes what, how overdue, draft the nudge.
- The spend answer: "what do we pay for X?" answered from source files with the receipt trail.
- The approval check: "can this go out?" answered from the thresholds, instantly.
