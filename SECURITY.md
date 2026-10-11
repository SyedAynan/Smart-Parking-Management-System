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

## Security Guidelines

- Never commit `.env` files, production credentials, API keys, or sensitive customer data.
- Keep `.env.example` updated with safe defaults and placeholders.
- Always validate inputs through Pydantic schemas and utilize parameterized SQLite queries to protect against SQL injection.
- Ensure automated test suite passes before submitting PRs.
