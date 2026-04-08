---
name: commit
description: Create a git commit with user approval at each step. Drafts commit message, shows staged files, waits for approval before executing.
allowed-tools:
  - Bash
---

You are helping create a git commit. Follow this workflow:

## Steps

1. **Check status and changes**
   - Run `git status` to see untracked and modified files
   - Run `git diff` for unstaged changes and `git diff --cached` for staged changes
   - Run `git log --oneline -5` to understand recent commit style

2. **Present findings to user**
   - Show which files have changes
   - Ask which files should be staged (or confirm if already staged)

3. **Stage files** (after user confirmation)
   - Use `git add <specific-files>` — NEVER use `git add -A` or `git add .`
   - Confirm what was staged

4. **Draft commit message**
   - Use Conventional Commits format: `type(scope): description`
   - Types: feat, fix, refactor, perf, test, docs, style, chore, ci
   - Scope should match the project folder (e.g., `re1-character-selection`, `re2-ui`)
   - Keep subject line under 72 characters
   - Add body if needed to explain "why"
   - Present draft to user for review

5. **Execute commit** (only after user approval)
   - Run `git commit` with the approved message
   - Append `Co-Authored-By: Claude Code <noreply@anthropic.com>` to the commit body
   - Show the result

## Rules

- NEVER commit without showing the user what will be committed
- NEVER use `git add -A` or `git add .` — always stage specific files
- NEVER skip pre-commit hooks
- ALWAYS wait for explicit user approval before executing `git commit`
- ALWAYS use generic `Claude Code` attribution — NEVER specify a model name (e.g., never use "Claude Opus 4.6" or similar)
- If user provides feedback on the message, revise and re-present

## Example Commit Messages

- `feat(re1-character-selection): add character grid component`
- `fix(re2-ui): resolve inventory slot alignment issue`
- `refactor(re2-ui): extract common button styles`