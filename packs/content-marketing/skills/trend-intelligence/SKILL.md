---
name: trend-intelligence
description: "Real-time trend research for content positioning. Finds what's trending RIGHT NOW, reverse-engineers WHY, and maps to content opportunities for the owner's ICP. MUST trigger when the owner says \"what's trending\", \"content ideas\", \"what should I film\", \"what's happening\", \"trend report\", \"what wave can I ride\", \"what's popping off\", \"what should my next video be about\", \"content calendar\". Also MUST auto-trigger BEFORE any content-pipeline invocation - trends inform topic selection. Triggers on any content planning, video ideation, or \"give me something to talk about\" request. Does NOT just cover the owner's core topic - also monitors ICP-relevant business news (regulation, industry shifts, economy) that can be tied back to the owner's positioning."
metadata:
  title: Trend Intelligence System
  tags:
    - "system"
  type: skill
  status: active
  created: 2026-04-02
  updated: 2026-06-11
---

# Trend Intelligence System

You are the owner's trend radar. Your job is to find what's trending in the owner's space RIGHT NOW, reverse-engineer WHY, and map it to content opportunities that serve the ICP ({{ICP}}).

## MANDATORY: Read Before Starting

1. `memory/content/` strategy docs - the owner's content rules and format guidelines (built during early content sessions)
2. `context/org/company.md` + `context/org/offers.md` - who the content serves
3. The owner's ICP profile (from `context/` or `memory/content/`)

## Step 1: Pull Real-Time Trend Data

### YouTube Trending (always run this)
Use `/yt-search` for the owner's core topic keywords, sorted by recency + views, scanning the last 14 days for outliers (videos performing 3x+ their channel's norm).

Optional build: the parent OS extends this with an Apify-backed `trends.js` helper in `automations/youtube/` (Google Trends interest-over-time, rising queries, YouTube + news in one pass). Build it when the manual flow gets repetitive.

### Web Search (supplement with current news)
Search for: "[trending topic] [current month] [current year] news" to find the root cause of any spike.

### Reddit Pulse Check (early signal - trends surface here 3-7 days before YouTube)
Web search for trending posts in the subreddits where the ICP (or the ICP's world) lives. Examples for a business-owner ICP:
- r/smallbusiness - what business owners are discussing
- r/entrepreneur - owner pain points
- topic-specific subs relevant to the owner's space

### Non-Core Business News (the ICP cares about more than the owner's topic)
Search for trending news in the ICP's world:
- Regulation changes in the ICP's industries
- Industry-specific news per vertical the owner serves
- Policy affecting the ICP (tax, regulation, hiring)
- Interest rates, economic shifts affecting the ICP's businesses

**Why:** If a regulation changes in the ICP's industry, that's a video: "What the New [Regulation] Means for [Vertical] (And How [Owner's Solution Category] Helps You Adapt Faster)." The owner's topic is the differentiator, but the HOOK is the news the ICP already cares about.

### "About to Trend" Detection (Early-Mover Signal)
Cross-reference these signals to find trends BEFORE they peak:
1. Google Trends "rising queries" for ICP keywords - look for queries with "Breakout" status
2. YouTube search: if a topic has high Google Trends interest but <10 YouTube videos = opportunity window
3. Reddit posts with 500+ upvotes in ICP subreddits that haven't been covered on YouTube yet
4. Mainstream news stories about the owner's topic that haven't been YouTubed yet

The sweet spot: **trending on Google/news, not yet on YouTube.** That's your 3-7 day window to be first.

## Step 2: Reverse-Engineer WHY It's Trending

For every trending topic, answer:

1. **What triggered it?** (News event, company announcement, report release, layoffs, viral video)
2. **Who's driving the conversation?** (Mainstream media, tech media, business media, YouTube creators)
3. **What's the emotional driver?** (Fear, opportunity, curiosity, FOMO, outrage)
4. **How long will it trend?** (24-hour news cycle, week-long wave, multi-month shift)
5. **What angle is MISSING?** (Everyone covers X, nobody covers Y - that's the owner's angle)

### Worked example: "AI Replacing Jobs" (March 2026)

**What triggered it:**
- Anthropic released the Economic Index (Mar 5) mapping which jobs AI can replace
- Multiple large tech companies announced layoffs citing AI within weeks of each other
- Mainstream headlines: "A Great Recession for white-collar workers is absolutely possible"
- 45,000 tech layoffs in March alone, 20.4% explicitly AI-driven

**Who's driving it:**
- Mainstream: CNN, CNBC, Fortune, CBS News, NBC (massive reach)
- YouTube: 1.78M views on "AI Won't Replace These Jobs", 407K on an Anthropic-map video
- Business media: HBR article "Companies Are Laying Off Because of AI's Potential - Not Its Performance"

**Emotional driver:** FEAR. Business owners watching this think "Am I next? Is MY team at risk? What do I do?"

**Duration:** Multi-month. Not a news cycle - a structural shift. New announcements every week keep it alive.

**Missing angle:** Everyone talks about WHICH jobs are at risk. Nobody tells business owners HOW to use AI to make their existing team more effective instead of firing them. That becomes the owner's angle: "AI Won't Replace Your Team. But a Company Using AI Will Replace YOURS."

## Step 3: Map Trends to the Owner's Content Strategy

For each trending topic, produce:

### Content Opportunity Card

```
TREND: [Name]
SEARCH INTEREST: [Google Trends data - rising/falling/exploding]
YOUTUBE PROOF: [Top performing videos on this topic with view counts]
ROOT CAUSE: [What triggered the trend]
EMOTIONAL DRIVER: [Fear / Opportunity / FOMO / Curiosity]
WAVE DURATION: [24hr / 1 week / 1 month / structural shift]

THE OWNER'S ANGLE: [How does this relate to the ICP? What's the unique take?]
CONTENT FORMAT: [the owner's format types]

TITLE OPTIONS (must pass the owner's content checklist):
1. "[Title option 1]"
2. "[Title option 2]"
3. "[Title option 3]"

WHY THE ICP CLICKS: [What makes a typical ICP member watch this?]
URGENCY: [Film this week / This month / Evergreen]
```

### Title Rules (sensible defaults - calibrate to the owner's checklist)
- Name the industry where possible
- Odd specific numbers (2.7x, not 3x)
- No em dashes
- Brackets that signal format: (Calculated Audit) (Live Demo)
- Capitalise ONE word for emphasis
- Under 60 visible characters / 10 words
- Must pass: text test ("would the ICP click if this were texted to them?") and share test ("would they forward it?")

## Step 4: Deliver the Report

Output a structured report with:

1. **TRENDING NOW** - Top 3-5 trends with data
2. **REVERSE ENGINEERED** - Why each is trending (triggers, drivers, duration)
3. **CONTENT OPPORTUNITIES** - Content Opportunity Cards for each, mapped to the owner's formats
4. **RECOMMENDED NEXT VIDEO** - The single best video to film this week based on trend timing
5. **WAVE CALENDAR** - Which trends to ride when (this week / next week / this month)

## Step 5: Update Memory

After completing trend research:
- Save the full report to `content-pipeline/research/trends/trend-report-YYYY-MM-DD.md`
- Update `memory/content/ideas_backlog.md` with any new video ideas
- If a trend reveals new ICP-relevant data, update the owner's content strategy docs in `memory/content/`

## ICP-Relevant Keyword Clusters to Always Monitor

Build these clusters from `{{ICP}}` + the owner's topic during first use, then keep them in this file. Template (with examples for an AI-for-business owner):

### Tier 1: Direct ICP Pain (always search these)
- "[owner's topic] replacing jobs" / "[owner's topic] for small business"
- "[owner's topic] for [ICP vertical 1]" / "[owner's topic] for [ICP vertical 2]"

### Tier 2: Business Outcome Keywords
- "[owner's topic] business transformation" / "[owner's topic] results"
- "[owner's topic] saving money" / "[owner's topic] reducing costs"

### Tier 3: Fear/FOMO Keywords (ride the wave)
- "[owner's topic] replacing employees" / "businesses falling behind [owner's topic]"
- "[owner's topic] competitors" / "[owner's topic] disruption"

### Tier 4: Industry Verticals (zero competition)
- "[owner's topic] for [each vertical the owner serves]"

## Anti-Patterns (Don't Chase These Trends)

Calibrate to the ICP. For a buyer-side (non-practitioner) audience, these are usually wrong:

- **Tool launches** (new feature announcements) - attracts DIYers, not the ICP
- **Industry drama** (founder feuds, safety debates) - entertainment, not business
- **Technical deep-dives** (new models, benchmarks, developer tools) - wrong audience
- **Adjacent-but-different ICP trends** - a trend can be hot AND irrelevant to the people who buy from the owner

## Integration With Content Pipeline

This skill runs BEFORE the content-pipeline skill. The flow is:

```
trend-intelligence (what's trending + why + content opportunities)
    ↓
content strategy checklist (evaluate against ICP, title rules)
    ↓
content-pipeline (research → ideate → draft → voice-check → publish)
```

When the owner says "what should I film this week" or "create content" - run trend-intelligence FIRST to inform the topic selection.

---

## Related

- [[competitive-ideation]]
- [[fountain-head-engine]]
- [[content-cascade]]
- [[video-score]]
