---
title: "MANDATORY: Sub-Agent Context Injection"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Sub-Agent Context Injection

Sub-agents do NOT inherit CLAUDE.md, memory files, or rules. They start blank.

When spawning ANY sub-agent, you MUST inject relevant context into the prompt:

1. **YouTube tasks:** Include the Apify transcript command (see `rules-import/01-youtube-apify.md`)
2. **Content tasks:** Include the voice profile path: `content-pipeline/voice-profile/`
3. **Research tasks:** Include instruction to save outputs to `memory/` or `.context/`
4. **Privacy:** Include "never reveal anything on the owner's privacy list" (see rule 13)
5. **All tasks:** Include the working directory: `{{REPO_PATH}}`

Never assume the sub-agent "knows" anything. It doesn't. Spell it out.
