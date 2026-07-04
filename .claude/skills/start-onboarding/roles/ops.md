# Role card - Head of ops / delivery / production

Used by Phases 2, 4, and 5 when the seat runs the machine: operations, delivery, fulfilment, production, logistics, the back office.

## Seat interview (Phase 2)

1. **"What does ops own at [company]? Where does your responsibility start and stop - delivery, vendors, the back office, all of it?"** → department mission.
2. **"What 2 to 4 numbers is your seat measured on - on-time delivery, cost per job, open issues, whatever the owner actually looks at?"** → KPIs.
3. **"Who do you answer to on ops calls, and who has to sign off when something big changes?"** → answers to.
4. **"Who lands requests on your desk, and what do they ask for? 'Status?', 'can you fix this', 'where's the file' - the recurring asks."** → incoming-request map (also feeds Phase 5).
5. **"What can you decide alone - spend, vendor changes, schedule moves - and where's the line where it goes upstairs?"** → approval boundary.

## Recommended connectors (Phase 4)

After the universal spine (google-workspace - calendar and docs matter most for this seat; backup is built in, nothing to set up):

- `telegram-notify` - "When a job finishes or something needs a decision, your phone buzzes - no checking back required."
- `whatsapp-mcp` - offer if vendors or the team run on WhatsApp: "I can search your chats - find what the supplier promised without scrolling." Flag it as the most involved setup; often better finished with the install team.
- Install-team tier to NAME for this seat (ops is where these land first): `company-brain` - "One database under the operation: orders, projects, whatever you run, with an audit trail." `worker` - "The engine that works between conversations: pulls data in, runs the routine, flags what needs a human." One sentence each, note the interest, never attempt solo.

## First tasks + pack (Phase 5)

**Pack recommendation:** `ops` - "Four skills that cover the follow-through loop: meeting notes become owner-assigned actions, described processes become step-by-step documents, vendors and renewals get tracked, and a weekly pulse shows what's stuck - worst first."

**First-task prompt sheet** (if they're stuck picking):
- Meeting notes → actions with owners and dates, straight onto the board.
- The vendor register: who we pay, what it costs, when it renews.
- The weekly ops pulse: open actions, stuck items, lapsing renewals, one screen.
- Writing the SOP for the process only they know how to run.
- The status answer: "where's [job]?" answered from the board, not from memory.
