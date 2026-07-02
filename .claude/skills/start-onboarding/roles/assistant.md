# Role card - Operator / assistant running it for someone

Used by Phases 2, 4, and 5 when the person in the chat runs the day-to-day for someone else: an executive assistant, a chief of staff, a right hand, a family-office operator. This seat is common, valuable, and historically under-served - in one real install the daily operator had been scoped out entirely, and it nearly cost the whole adoption. Treat this person as the primary user, because they are.

Two calibrations shadow this seat:

- **Relayed instructions:** "[the principal] wants X" is treated as the principal's call on brand, strategy, and money questions - recorded as such, not as the operator's own decision.
- **Unconfirmed facts:** company-level answers the operator is unsure of (revenue, ICP, pricing) get stored as "best guess - unconfirmed, verify with [principal]", never as facts.

## Seat interview (Phase 2)

1. **"Describe your job the way you'd describe it to a friend: what do you actually keep moving for [principal] every week?"** → seat mission.
2. **"How does [principal] judge whether things are going well? What 2 to 4 things do they check or ask about?"** → KPIs (the principal's priorities ARE this seat's numbers).
3. **"Besides [principal], is there anyone else whose asks you have to serve - a co-owner, a client, family?"** → answers to / stakeholder map.
4. **"What lands on your desk in a normal week? The recurring asks, the fire drills, the 'can you just' requests."** → incoming-request map (also feeds Phase 5).
5. **"What can you handle completely alone, what do you do in [principal]'s name, and what always waits for them personally? Be precise - I'll respect these lines to the letter."** → approval boundary. Push for precision here; this seat's boundary is the most load-bearing in the whole system.

## Recommended connectors (Phase 4)

After the universal spine (github-backup → google-workspace - calendar and inbox are this seat's home ground):

- `telegram-notify` - "Your phone buzzes when a task finishes - and [principal]'s can too, if you want results landing with both of you."
- `whatsapp-mcp` - offer if the principal's world runs on WhatsApp: "I can search the chats - find what was promised, when, by whom, without scrolling." Flag it as the most involved setup; often better finished with the install team.
- `apify-youtube` - offer only if research or content prep is part of the job.
- Install-team tier to name if it comes up: `org-sync` if the principal or other staff will get their own seat later.

## First tasks + pack (Phase 5)

**Pack recommendation:** `ops` - "Four skills built for follow-through: meeting notes become actions with owners, processes become documents, renewals get tracked, and a weekly pulse shows what's stuck." It fits this seat's reality: keeping many threads moving. If the job is mostly sales support or content support instead, offer `sales-crm` or `content-marketing` using the owner card's one-line pitches.

**First-task prompt sheet** (if they're stuck picking):
- The daily brief for [principal]: today's calendar, open items, what needs their word - one screen.
- Meeting notes → actions, with who-owns-what, straight onto the board.
- Draft replies in [principal]'s voice for the routine inbox (always drafts, never sends).
- The chase list: everything promised TO [principal] that hasn't arrived, with polite nudges drafted.
- The travel/logistics pack: one message in, a checklist and calendar entries out.
