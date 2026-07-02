---
title: "MANDATORY: Always Push to GitHub After Work"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Always Push to GitHub (and Deploy, if Configured)

After completing ANY task (code, memory updates, features, fixes):

**STEP 1:** Commit and push to GitHub:

```bash
cd {{REPO_PATH}} && git add -A && git commit -m "description" && git push origin main
```

**STEP 2:** If a deploy target is configured (none configured (local only) - onboarding Phase 4 or the build team sets a real target, set during onboarding Phase 4 if the owner runs always-on services), deploy any changed service code per the deploy command documented in `docs/connectors/`.

**WHY:** The owner may access this OS from multiple machines and devices. All must see the latest version. If always-on services exist, stale deploys mean stale behavior.

Never leave uncommitted changes. Never leave service code un-deployed.
