---
name: content-marketing
description: The full content production department. Everything for making, packaging, and repurposing content - YouTube strategy/packaging/chapters, podcast production and transcription, LinkedIn production and creator analysis, trend and competitive intelligence, AI media prompting, and the content templates. Install for any seat that produces public content; skip it for seats that only consume research (the base youtube-research skill covers that).
skills:
  - 3d-website-enhancer
  - competitive-ideation
  - content-cascade
  - content-pipeline
  - creator-oracle
  - descript-editor
  - dropbox-transcribe
  - fountain-head-engine
  - guest-intel
  - higgsfield
  - intro-forensics
  - linkedin-content
  - linkedin-dna
  - owner-voice-messaging
  - podcast-intro-production
  - podcast-transcribe
  - trend-intelligence
  - video-score
  - youtube-algorithm
  - youtube-chapterize
  - youtube-packaging
connectors:
  - video-platform research tooling (transcript-pull service; the base automations/youtube/ module provides the runtime)
  - transcription service for audio/video files (API key in the root .env)
  - cloud media storage for footage and generated assets (an rclone-compatible remote; fills the {{MEDIA_STORE}} answer)
  - optional AI image/video generation service (the media-prompt skills are prompt-first and work without a CLI)
rules_import: []
memory: []
templates:
  - blog-brief.md
  - content-repurposing.md
  - email-nurture.md
  - linkedin-post.md
  - newsletter.md
  - youtube-script.md
onboarding: onboarding.md
---

# Content & Marketing pack

The production side of content. The base keeps research universal (`youtube-research`, `deep-research`, voice-check, the voice profile); this pack adds everything needed to actually SHIP: packaging, scoring, repurposing, podcast production, LinkedIn, trend intel, and media prompting. The six content templates arrive with this pack into `content-pipeline/templates/`.

Install: `node scripts/install-pack.js content-marketing` · Questions the install asks: `onboarding.md`

## Routing rows

Appended verbatim to `.claude/reference/skills-routing-index.md` on install; removed on uninstall.

| `3d-website-enhancer` | Analyze any existing website and generate a prioritized plan to transform it into a premium 3D animated experience. Produces Nano Banana Pro image prompts, Kling video prompts, and Claude Code implementation instructions |
| `competitive-ideation` | Competitive landscape analysis before scripting any video. Searches existing content on the topic, identifies saturated angles vs open gaps, suggests positioning angles ranked by opportunity score. Use when the owner say |
| `content-cascade` | One-command repurposing - takes a published YouTube video (or any long-form content) and cascades it into blog post, LinkedIn post, X/Twitter thread, newsletter edition, and 3 short-form scripts. All in the owner's voice |
| `content-pipeline` | Full content orchestration - research, ideate, draft, voice-check, and prepare for publishing across YouTube, newsletter, LinkedIn, and short-form. Use when the owner says \"create content\", \"write a newsletter\", \"sc |
| `creator-oracle` | Surface the right creator frameworks for any business situation. Queries the creator intelligence corpus (built by the owner from YouTube transcripts and creator deep dives) to find who to channel for offers, content, sa |
| `descript-editor` | Generate Descript Underlord prompts for podcast/video editing. Covers full editing workflows, clip creation, audio cleanup, captions, and credit-efficient prompt strategies. Trigger on any Descript editing request. |
| `dropbox-transcribe` | On-demand transcription of any media-store folder of videos. Triggers on 'transcribe [date] daily footage', 'transcribe daily footage for [day]', 'transcribe folder [path]', 'mass transcribe daily footage', 'transcribe a |
| `fountain-head-engine` | Research and surface ICP-relevant news, industry adoption stories, and report data the owner can turn into content. Monitors the sources where the owner's ICP's world intersects with the owner's topic. Use when the owner |
| `guest-intel` | Top-tier podcast guest research for the owner's show. Triggers on 'research [name] before interview', 'guest intel for [name]', 'deep dive on [guest]', 'prep for [guest] podcast', or any guest research request. Orchestra |
| `higgsfield` | Generate AI image/video prompts for the Higgsfield web app, or use the CLI API for quick iterations. Primary workflow is prompt generation - Claude crafts well-engineered prompts, the owner pastes them into cloud.higgsfi |
| `intro-forensics` | Forensic frame-by-frame analysis of podcast intros/hooks. Deconstructs what makes a hook retain viewers, extracts a replication formula, ranks clippable soundbites, produces an editor-ready brief + full breakdown with sc |
| `linkedin-content` | LinkedIn post production - research proven patterns from LinkedIn DNA profiles, draft posts in the owner's voice, suggest visuals, score quality. Use when the owner says \"LinkedIn post\", \"write for LinkedIn\", \"post  |
| `linkedin-dna` | Comprehensive LinkedIn creator DNA analysis - scrapes a creator's full profile, 50+ posts, comments, engagement, funnel, and audience demographics via Playwright, then produces a 1,000+ line intelligence profile mapping  |
| `owner-voice-messaging` | Write WhatsApp messages, texts, and DM replies in the owner's exact casual voice. Use when the owner says 'write me a WhatsApp message', 'message [person]', 'text [person]', 'draft a reply', 'reply to this', 'what should |
| `podcast-intro-production` | ONE-CALL podcast intro production framework for the owner's show. A single trigger phrase |
| `podcast-transcribe` | Transcribe a podcast episode in the media store into a speaker-mapped .txt file with timestamps, dropped into the same folder. Trigger phrases include 'transcribe the [guest] podcast', 'run the transcriber on [guest]', ' |
| `trend-intelligence` | Real-time trend research for content positioning. Finds what's trending RIGHT NOW, reverse-engineers WHY, and maps to content opportunities for the owner's ICP. MUST trigger when the owner says \"what's trending\", \"con |
| `video-score` | Pre-publish YouTube video concept scorer. Takes a video idea (topic, title, hook, thumbnail description) and scores it against title/hook frameworks, the owner's content rules, ICP profiles, trend data, and competitor ou |
| `youtube-algorithm` | Authoritative answer engine for YouTube algorithm and strategy questions. Use when the owner asks ANY technical question about how YouTube works - algorithm mechanics, posting strategy, title/thumbnail timing, A/B testin |
| `youtube-chapterize` | Use this skill when transcribing a long-form video (podcast, mastermind, talk, interview, livestream) and generating YouTube chapter timestamps. Triggers on phrases like "chapterize this video", "create YouTube chapters  |
| `youtube-packaging` | Generate, score, and iterate YouTube titles + thumbnail text using data-driven frameworks from studied creators (Kallaway, Ed Lawrence, Liam Ottley, Jeremy Haynes) plus an empirical benchmark layer. Use when ideating tit |
