# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| `main` (latest) | ✅ |
| Older commits / forks | ❌ Best-effort only |

## Reporting a vulnerability

**Do not open a public issue for security reports.** Use GitHub's
**Private vulnerability reporting** (Security tab → Report a vulnerability)
or contact the maintainer via their GitHub profile.

Include: affected file/endpoint, steps to reproduce, and impact.
Expect an acknowledgement within 7 days.

## Current state

This repo has **no implementation yet** — no secrets, credentials, or live
deployment exist. The standing rules, effective from the first code PR:

- Never commit `.env` files, credentials, API keys, or real personal data.
- Provide `.env.example` with safe placeholders when config is introduced.
- No production or payment-gateway claims until a reviewed implementation,
  tests, and this policy's deployment checklist exist.
