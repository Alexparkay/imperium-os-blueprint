---
name: founders-oracle
description: "Consult history's greatest founders on any business decision. Queries extracted frameworks from Elon Musk, Steve Jobs, Jeff Bezos, Sam Walton, John D. Rockefeller, and Henry Ford (built from biography podcast transcripts). Trigger on \"what would [founder] say\", \"founders council\", \"how would Elon approach this\", \"Bezos perspective on\", \"Jobs would say\", \"Rockefeller approach\", \"founder wisdom for\", \"founders oracle\", or any strategic decision where legendary founder thinking applies. Also triggers on offer design, pricing, hiring, product, speed, simplicity, scaling, cost control, vertical integration, consolidation, or any moment where you want a perspective beyond modern creator frameworks."
metadata:
  title: Founders Oracle - Legendary Founder Intelligence System
  tags:
    - "system"
  type: skill
  status: active
  created: 2026-04-02
  updated: 2026-06-11
---

# Founders Oracle - Legendary Founder Intelligence System

## Source Files (Read When Activated)

**Founder profiles** live at `memory/content/founders-oracle/<founder-name>.md`, one file per founder, built from biography podcast transcripts (e.g. Founders Podcast episodes) or books the owner studies.

**The profile corpus starts EMPTY in a fresh install.** To add a founder:
1. Transcribe the source episodes (YouTube/Apify pipeline) into `memory/transcripts/`
2. Extract frameworks into `memory/content/founders-oracle/<founder-name>.md` using the profile structure: Core Philosophy, Frameworks, Topic Sections, Quotable Lines, Owner Applications
3. Update the Founders Council table and Quick Situation Lookup in this skill

Until profiles exist, the council table below still works as a pointer to PUBLIC, well-documented founder thinking - but flag that answers draw on general knowledge, not the extracted corpus, and verify any specific claim before citing it.

## The Founders Council

| Founder | Archetype | Best For | Key Framework |
|---------|-----------|----------|---------------|
| **Elon Musk** | The Engineer-Emperor | First principles, speed, vertical integration, audacious missions | The Algorithm (5 steps) |
| **Steve Jobs** | The Taste-Maker | Product design, simplicity, focus, saying no, marketing | The Simple Stick |
| **Jeff Bezos** | The Long-Term Builder | Customer obsession, flywheels, two-way doors, Day 1 thinking | Working Backwards |
| **Sam Walton** | The Scrappy Operator | Execution, stealing ideas shamelessly, penny-pinching, speed | The Penny Principle |
| **John D. Rockefeller** | The Discipline Compounder | Cost control, vertical integration, consolidation, emotional stoicism, systems over talent | Vertical Integration + Cost Obsession |
| **Henry Ford** | The System Builder | Manufacturing, vertical integration, pricing for the masses | System leverage |

## Quick Situation Lookup

| Situation | Consult | Why |
|-----------|---------|-----|
| **Pricing a service** | Bezos (customer obsession), Walton (penny principle), Elon (idiot index), Rockefeller (cost obsession) | Four perspectives: long-term value, cost-down, first-principles cost, penny-level tracking |
| **Designing an offer** | Jobs (simplicity), Bezos (working backwards from customer), Elon (theoretically perfect) | Start from perfect, work backwards, then simplify |
| **Hiring first team member** | Elon (attitude > skills), Jobs (A-players only), Bezos (missionaries > mercenaries) | All three agree: hire for belief, not credentials |
| **Content strategy** | Walton (steal ideas shamelessly), Jobs (marketing = values), Elon (showmanship is salesmanship) | Learn from others, lead with values, demo over pitch |
| **Facing fear / doubt** | Elon (first 50 losses), Jobs (connecting dots backwards), Walton (determination > intelligence) | All faced near-death moments. All kept going. |
| **Speed vs quality** | Elon (maniacal urgency), Jobs (ship imperfect then iterate), Walton (extreme patience + extreme speed) | Move fast on execution, be patient on strategy |
| **Scaling from zero** | Walton (small town advantage), Bezos (four characteristics of a dreamy business), Elon (burn rate thinking) | Start where competition isn't, build what scales, count every day |
| **Credibility objections** | Elon (started Zip2 at 24), Jobs (started Apple at 21), Bezos (quit D.E. Shaw at 30) | Fresh entrants carry no legacy constraints and no fear of looking stupid |
| **Building AI services** | Elon (first principles on cost), Bezos (self-service platforms), Jobs (intersection of tech + liberal arts) | Reduce delivery cost to materials, build platforms, make AI feel human |
| **Vertical integration** | Rockefeller (Standard Oil chain), Elon (SpaceX makes everything), Ford (River Rouge plant) | Own the supply chain to control cost, quality, and dependency |
| **Cutting costs ruthlessly** | Rockefeller (half-cent principle), Walton (penny principle), Elon (idiot index) | Three obsessives who found margin where others saw fixed costs |
| **Acquiring competitors** | Rockefeller (Cleveland Massacre), Bezos (acquire then integrate), Walton (copy then outprice) | Rockefeller is the master - start with the strongest, offer partnership first |
| **Emotional discipline** | Rockefeller (The Iceman), Elon (capacity to take pain), Jobs (reality distortion) | Rockefeller for cold calculation, Elon for endurance, Jobs for vision through chaos |
| **Building systems that outlast you** | Rockefeller (Standard Oil ran after breakup), Bezos (Day 1 mechanisms), Walton (Saturday meetings) | Systems over talent. Brilliance leaves. Systems compound. |

## How to Use

1. **Identify the decision** you're facing
2. **Look up the situation** in the table above
3. **Read the recommended founder profiles** from `memory/content/founders-oracle/` (if built)
4. **Find the specific framework** that applies
5. **Apply through the owner's lens** - each profile should include a "How the owner should apply this" section
6. **Cross-reference with the Creator Oracle** - modern operators (`creator-oracle` skill) for tactical execution

## Founders Oracle vs Creator Oracle

| | Founders Oracle | Creator Oracle |
|--|----------------|----------------|
| **Who** | Musk, Jobs, Bezos, Walton, Rockefeller, Ford | Modern business creators in the owner's corpus |
| **Level** | Macro strategy, mental models, life philosophy | Tactical execution, funnel design, content formats |
| **Best for** | "Should I do this at all?" | "How do I do this specifically?" |
| **Source** | Biographies, autobiographies, shareholder letters | YouTube transcripts, course content |
| **Use together** | Founders Oracle for direction → Creator Oracle for execution |

## Adding New Founders

When new biography episodes are transcribed:
1. Save the transcript to `memory/transcripts/`
2. Extract frameworks into `memory/content/founders-oracle/[founder-name].md`
3. Update the Founders Council table and Quick Situation Lookup in this skill
4. Follow the same profile structure: Core Philosophy, Frameworks, Topic Sections, Quotable Lines, Owner Applications

---

## Related

- [[creator-oracle]]
- [[mastermind-oracle]]
