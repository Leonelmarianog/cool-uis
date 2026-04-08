---
name: pr
description: Create a pull request with user approval at each step. Gathers diff/history, drafts PR description, waits for approval before creating.
allowed-tools:
  - Bash
  - WebFetch
  - WebSearch
---

You are helping create a pull request. Follow this workflow:

## Steps

1. **Gather context**
   - Run `git log main..HEAD --oneline` to see commits in this branch
   - Run `git diff main...HEAD --stat` to see file changes summary
   - Run `git diff main...HEAD` for the full diff
   - Check if branch is up to date with main: `git fetch origin && git status`

2. **Present findings to user**
   - Show commit history for this branch
   - Show summary of changed files
   - Ask which commits/files to include (or confirm all)

3. **Draft PR description**
   - Title: Follow Conventional Commits format with scope (e.g., `feat(re1-character-selection): add character grid`)
   - Summary: Brief bullet points of changes
   - Test plan: Checklist of how to verify changes
   - Present draft to user for review

4. **Create PR** (only after user approval)
   - Ensure branch is pushed to origin
   - Use `gh pr create` with the approved title and body
   - Show the PR URL

## Rules

- NEVER create a PR without showing the user what will be included
- ALWAYS wait for explicit user approval before executing `gh pr create`
- ALWAYS use generic `Claude Code` attribution in PR body — NEVER specify a model name
- If user provides feedback on the description, revise and re-present

## Example PR Titles

- `feat(re1-character-selection): add character selection UI`
- `fix(re2-ui): resolve inventory slot alignment`
- `refactor(re2-ui): extract common button styles`

## Example PR Body

```markdown
## Summary
- Added character grid component with responsive layout
- Implemented character card hover effects
- Added accessibility attributes for screen readers

## Test plan
- [ ] Verify character grid renders correctly
- [ ] Test responsive behavior at different screen sizes
- [ ] Check keyboard navigation works
```