---
title: Seat
type: context
status: template
---

<!--
TEMPLATE: seat truth - who sits at THIS install. Org truth (the company-wide
facts) lives in context/org/; this file is local, per-seat, and never synced.
Filled during onboarding. In a single-seat install the seat is simply the
owner; fill it anyway - the approval boundary section earns its keep the
first time the system drafts something irreversible.
A fully worked FICTIONAL example follows the template.
-->

# This seat

## Who sits here

- **Seat holder:** {{OWNER_NAME}} ({{OWNER_SHORT}})
- **Role:** {{OWNER_ROLE}}
- **Department:** which department in `context/org/departments.md` this seat belongs to
- **Manager:** who this seat reports to (or "nobody - this is the owner's seat")
- **Direct reports:** names, or "none"

## The real operator

Who actually sits in this chat day to day. Often the seat holder; sometimes an assistant, a deputy, or a shared login - and possibly NOT the person who signed the contract. Name them. The system calibrates trust to the operator: instructions relayed on someone else's behalf ("[the owner] wants X") are treated as that person's call, not the operator's.

- **Daily operator:** name (and relationship to the seat holder if different)

## Approval boundary

What this seat signs off itself vs escalates upward. Mirror the "who approves what" table in `context/org/departments.md` from this seat's side.

- **This seat decides:** e.g. drafts, department spend under a threshold, scheduling
- **This seat escalates:** e.g. pricing, public statements, anything cross-department
- **Never without a human:** sending, posting, invoicing, deleting (house default)

## Department KPIs

The 2-4 numbers this seat is measured on. The system biases its briefings and weekly reviews toward these.

## Key stakeholders

Who this seat serves and answers to, inside and outside the company. One line each: name, why they matter to this seat. (Detail on the people themselves: `context/org/people-roster.md`, dossiers in `memory/people/`.)

---

## Worked example (FICTIONAL, for shape only, delete after filling in)

# This seat

## Who sits here

- **Seat holder:** Sam Okafor (Sam)
- **Role:** senior consultant, delivery lead
- **Department:** Delivery
- **Manager:** Dana Reyes
- **Direct reports:** 2 analysts

## The real operator

- **Daily operator:** Sam, plus his coordinator Lena on Fridays (Lena preps the weekly client updates; anything she relays as "Sam wants" is treated as Sam's call on delivery matters only)

## Approval boundary

- **This seat decides:** engagement schedules, analyst task allocation, client status updates, spend under £2,000
- **This seat escalates:** scope or price changes (Dana), anything published publicly (Dana), invoicing disputes (Ravi)
- **Never without a human:** sending client emails, committing dates in writing

## Department KPIs

- Engagements delivered on time (target: 100%)
- Diagnostic-to-retainer conversion (target: 60%)
- Analyst utilisation

## Key stakeholders

- Dana Reyes - owner; sets pricing and takes escalations
- Priya Shah - ops director at Northgate, the flagship account
- Ravi Nair - internal ops; invoices only after Sam confirms scope shipped
