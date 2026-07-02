---
name: prospect-intel
description: "Assemble a pre-call or pre-outreach dossier on a named prospect - the person AND their company - from public sources only, saved to memory/people/ so the intelligence compounds across touches. Trigger on 'research [prospect] before the call', 'prospect intel on [name]', 'who am I meeting tomorrow', 'brief me on [company/person]', 'prep for my call with', 'what should I know about [prospect]', or BEFORE writing any cold outreach to a named prospect (cold-email-writer's personalization step consumes this dossier). Output: a one-screen brief on top of a filed dossier - who they are, what they're likely trying to fix, the 2-3 hooks, and the landmines."
metadata:
  title: Prospect Intel
  type: skill
  status: active
  created: 2026-07-02
---

# Prospect Intel

Walking into a call knowing only the prospect's name means spending the first twenty minutes on questions their website already answers. This skill front-loads that: person, company, likely problem, and the specific hooks that make outreach or an opening question land - all from public sources, all filed where the next touch can build on it.

## When to use

- A call, meeting, or demo with a named prospect is coming up
- Cold outreach to a named prospect is about to be written (run this FIRST; the email skill consumes the dossier)
- "Who am I meeting?" / "brief me on [name]" / a new inbound lead worth more than a template reply
- Refreshing a stale dossier before re-engaging an old prospect (check `memory/people/` first - never rebuild what exists, update it)

## When NOT to use

- Existing clients (their truth lives in `clients/<name>/`, not a prospect dossier)
- Podcast/content guests (that's a content-pack job with different outputs)
- Bulk list research across dozens of prospects - this is a depth tool; running it shallow across a list produces expensive mush
- Anything beyond public sources. No pretexting, no scraping behind logins, nothing that would embarrass the owner if the prospect saw the method.

## The pipeline

1. **Check memory first.** `memory/people/` and `memory/pipeline.md` - prior dossier, prior touches, prior notes. An update beats a rebuild, and referencing a forgotten prior conversation is the fastest way to lose a deal.
2. **Research the person** (parallel searches): current role and tenure, career path, public writing/talks/interviews, what they post about, shared ground with the owner (city, industry history, mutual connections the owner has mentioned). Recent posts outrank bios - a bio says what they are, posts say what they care about NOW.
3. **Research the company:** what it sells and to whom, size signals (team, locations, funding/ownership if public), recent news (launches, hires, expansion, leadership changes), how they position themselves, visible stack/vendor hints if relevant to the offer.
4. **Infer the problem - and label it as inference.** From the offer (`context/org/offers.md`) and the evidence: what is this company probably struggling with that the owner solves? Every inference cites its evidence ("hiring three ops roles → scaling pains in delivery"). Facts and inferences NEVER mix unlabelled.
5. **Extract the hooks.** 2-3 specific, recent, non-creepy openers: a talk they gave, a launch, a shared experience, a stated opinion worth engaging. A hook passes the test if it proves ten minutes of genuine attention rather than a mail-merge field.
6. **Note the landmines.** Competitors they're loyal to, public positions that clash with the pitch, recent bad press, personal topics to avoid. One line each.
7. **File the dossier** at `memory/people/<kebab-name>.md`: frontmatter (name, company, role, pipeline stage, dossier date, sources consulted), then Person / Company / Likely problem (inferences labelled) / Hooks / Landmines / Touch history. Add or update the prospect's row in `memory/pipeline.md`.
8. **Deliver the one-screen brief** in chat: who, company one-liner, likely problem, the hooks, the landmines, and ONE suggested opening question. The full dossier is linked, not pasted.

## Hard rules

- **Public sources only, cited.** Every claim in the dossier traces to a source; empirical claims get verified in-session (rule 19), not recalled.
- **Inference is labelled inference.** "Probably struggling with X (based on Y)" - never stated as fact.
- **The privacy list applies to output.** Dossiers are about prospects, but the OWNER's private items never appear in any draft the dossier feeds.
- **Stale intel is worse than none.** Dossiers older than 60 days get re-verified before use - people change jobs.

## Self-evaluation

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 9/10 | Person + company + problem + hooks + landmines + filing + brief |
| Actionability | 9/10 | Fixed dossier skeleton, fixed brief format, memory-first ordering |
| Specificity | 8/10 | Hook quality is judgment; the "ten minutes of attention" test bounds it |
| Integration | 9/10 | Feeds cold-email-writer, memory/people/, memory/pipeline.md; respects rules 19 and 13 |
| Ethics/safety | 9/10 | Public-sources-only line is explicit and binary |
| **Average** | **8.8/10** | |

---

## Related

- [[cold-email-writer]] (consumes the dossier)
- `memory/pipeline.md` · `memory/people/`
- `.claude/rules/19-research-empirical-claims.md`
