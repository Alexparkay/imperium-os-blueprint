# Phase 6 - Cadence + memory bootstrap

**Goal:** decide what runs when, and seed the memory system.

1. For each new skill - built OR pack-installed - ask (can be one combined question): **"Should this run on a schedule, like every weekday morning, or only when you ask?"** Record the answer at the bottom of each skill file under a `## Cadence` heading. Be upfront about the trade-off: scheduled runs need the machine on and the app open. Suggest starting everything on-demand for week one, then scheduling the proven ones.

2. Seed the task board. Ask: **"What are the top 3 things on your plate this week?"** → write to `memory/kanban.md` (This Week column). Any dates or deadlines mentioned → `memory/calendar.md`. If the operator sub-onboarding is pending, it goes on the board too.

3. Explain the memory system in 4 sentences: everything they say gets filed immediately; people go to the people file, money to finances, ideas to the ideas backlog, commitments to the task board. They never file anything themselves. They can say "remember this:" to be explicit. They can ask "what do you know about X" anytime.

4. Run `node scripts/generate-registry.js` to build the registry of every skill and rule. Report in plain English: "I've built an index of everything the system can do: [N] skills, [N] rules. This is what keeps it self-aware as it grows."

5. Update state file and status page (Phase 6 done, Phase 7 current, overall 88%).

**Exit criteria:** cadence recorded on each new skill, kanban + calendar seeded, registry generated without errors.
