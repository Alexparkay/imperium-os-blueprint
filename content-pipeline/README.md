# Content Pipeline

The production line for everything {{COMPANY_NAME}} publishes. Flow: research → draft → voice-check → publish → repurpose.

```
content-pipeline/
├── drafts/          # work in progress, one file per piece
├── published/       # final shipped versions, the archive of record
├── research/        # research missions feeding content (dated folders)
├── templates/       # fill-in skeletons per format (blog, email, LinkedIn, YouTube...)
└── voice-profile/   # the owner's voice calibration (built in onboarding Phase 3)
```

Two rules carry the whole pipeline:

1. **Nothing ships without a voice-check** against `voice-profile/`. Content that smells like AI damages the brand more than no content.
2. **Drafts move, they don't pile up.** A draft either ships (move to `published/`), gets scheduled (note in `memory/calendar.md`), or gets killed (delete). Review the folder weekly.

Content ideas and strategy live in `memory/content/`; this folder is only for the pieces themselves.
