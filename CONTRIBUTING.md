# Contributing to Smart Parking Management System

Thanks for contributing! The repo is currently a placeholder — the most useful
contributions right now are scope discussion via issues.

## Workflow (once code work starts)

1. Branch from `main`: `feat/<short-name>` or `fix/<short-name>`
2. One feature or fix per PR; keep the README's scope section in sync
3. Fill in the PR template (what / why / how tested)

## Conventional commits

```
feat: add slot reservation endpoint
fix: release expired reservation holds
docs: confirm stack choice
chore: scaffold project layout
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

## Standing rules (from day one)

- Validate at boundaries; return actionable errors.
- Never commit secrets, credentials, or real personal data.
- Add tests alongside features; do not declare done until they pass.
- Match the surrounding code's naming and formatting.

## What not to commit

`.env`, credentials, dumps, build outputs, IDE configs, OS files.
