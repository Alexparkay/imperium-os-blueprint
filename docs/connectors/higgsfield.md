---
title: Higgsfield (AI Images of You)
product: Imperium OS
type: connector-guide
status: optional
created: 2026-06-11
---

# Higgsfield: AI images of you (optional)

Higgsfield is an AI image and video service. Connected, it lets the system generate professional-grade pictures of **you**: headshots, social post visuals, thumbnails, "you on stage", "you in the office", all from a one-time training step where the service learns your face from real photos. If you publish content with your face on it, this quietly replaces a lot of photo shoots.

**Skip if:** you don't publish face-forward content. Connect any time later with "set up Higgsfield".

**Time:** 15 minutes of setup, then up to an hour of waiting while your likeness trains (you don't have to watch it).
**Cost:** paid service with subscription tiers; check current pricing at higgsfield.ai.

## Step 1: Create an account

1. Go to **https://higgsfield.ai** and sign up.
2. Pick a plan that includes character creation (their "Soul" feature). Plans change; the chat can check the current options with you.

## Step 2: Train your likeness ("Soul")

This is the one-time step that teaches the service your face.

1. In the Higgsfield app, find the character / Soul creation flow.
2. Upload the photos it asks for. Quality rules that make a real difference:
   - 15 to 30 photos of you, different angles, different lighting, different outfits.
   - Sharp, well-lit, recent. Your face clearly visible.
   - No sunglasses, no heavy filters, no group shots, no hats in most of them.
3. Name it clearly, e.g. "[Your name], primary".
4. Start the training and walk away. It typically takes a while; the app notifies you when done.

## Step 3: Connect it to the system

1. In your Higgsfield account settings, find your API access key (if your plan includes API access) and paste it into the chat: "Here's my Higgsfield key: ...". The system stores it in the local settings file.
2. Tell the chat: **"My Higgsfield likeness is trained, connect it."**
3. The system looks up your trained character, confirms with you which one is yours, and saves its ID as your default likeness (this fills the `{{OWNER_SOUL_ID}}` setting across the system). From then on, "make an image of me presenting to a room" just works.

## Step 4: Set your look rules (recommended)

Two minutes that pay off forever. Tell the chat how you want to appear by default: wardrobe style, what to never show, settings you like. For example: "always business casual, never logos, prefer natural light." The system saves this as your likeness style guide and applies it to every future image without you repeating it.

## Step 5: Verify

Ask the chat:

```
Generate a test image of me: professional headshot, plain background
```

Check the result in the Higgsfield app. If the face looks like you, the connector is live. If it's off, the usual cause is training photos (too few, too similar, or low quality); retraining with a better set fixes it.

## What can go wrong

- **The face doesn't look like me.** Retrain with more varied, higher-quality photos. This is nearly always a training-set problem, not a settings problem.
- **Multiple characters exist and the wrong one is used.** Tell the chat "you're using the wrong likeness" and it will list what it can see and re-save the right ID.
- **Generations fail at certain image shapes.** Some models reject specific aspect ratios. The system knows to generate at a working ratio and crop afterwards; if a request fails, it will route around it and tell you.
- **Costs creeping up.** Image generation spends credits per image. Ask "how many images have we generated this month?" and set a soft budget with the chat.
