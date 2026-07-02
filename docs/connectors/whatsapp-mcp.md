---
title: WhatsApp (MCP)
product: Imperium OS
type: connector-guide
status: optional
created: 2026-06-11
---

# WhatsApp (optional, advanced)

This connector lets the system search your WhatsApp: find a contact, pull up what someone said last week, list your recent chats, locate that voice note from a client. It's one of the highest-value connectors for owners who run their business over WhatsApp, and also the most involved to set up, which is why it's optional and last.

**Know what this is before you start:** it uses an open-source community project, not an official WhatsApp product. It works by pairing a companion app to your WhatsApp account, the same way WhatsApp Web pairs your browser. It's read-focused by design here; the system treats sending messages as something that always needs your explicit go-ahead.

**Skip if:** WhatsApp isn't central to your business, or you're not comfortable pairing a third-party tool to your account. Nothing else in the OS depends on this.

## How it works, in one paragraph

A small bridge program runs quietly on your computer, paired to your WhatsApp via a QR code (exactly like WhatsApp Web). It keeps a private, local copy of your message history on your machine. The system reads that local copy when you ask questions. Nothing is uploaded anywhere; the data never leaves your computer.

## The setup, at a high level

The system does all of the technical work. Your part is scanning one QR code with your phone.

1. **Tell the chat:** `Set up the WhatsApp connection`.
2. The system fetches the open-source WhatsApp MCP project (the widely used community pattern is the `whatsapp-mcp` project by lharries on GitHub: https://github.com/lharries/whatsapp-mcp), installs its two parts (the bridge and the connector), and starts the bridge.
3. **You scan the QR code.** The system shows you a QR code. On your phone: WhatsApp, then Settings, then **Linked Devices**, then **Link a Device**, and scan it. This is the same flow as WhatsApp Web.
4. The bridge syncs your history to a local file on your machine. First sync can take several minutes for big accounts.
5. The system wires the connector in and sets it to start automatically with your computer.

## Verify

Ask the chat:

```
Search my WhatsApp for the last message from [a real contact]
```

If it returns the real message, you're live. Try one more: "which group chats were active this week?"

## Things to know

- **Re-pairing is periodic.** WhatsApp expires linked devices after a few weeks of inactivity, and sometimes regardless. When queries start coming back stale, say "re-pair WhatsApp" and scan a fresh QR code. Two minutes.
- **Unknown group members can show as codes, not numbers.** That's a WhatsApp privacy feature for people not saved in your contacts. Saving them in your phone fixes it.
- **Sending stays manual.** The system can draft replies for you, but the rule baked into this OS is that it never sends a WhatsApp message without your explicit approval, message by message.
- **Your account, your rules.** Linking third-party tools is at your own judgment; if your business has compliance constraints around message data, check them before connecting this.

## What can go wrong

- **The QR code expires before you scan.** They rotate every minute or so. Say "show me a fresh QR" and scan faster this time.
- **Queries return nothing after working before.** The bridge stopped or the pairing expired. Say "check the WhatsApp bridge" and the system will diagnose, restart, or re-pair as needed.
- **First sync seems stuck.** Large accounts take a while. The system can show you sync progress; ask "how's the WhatsApp sync going?"
