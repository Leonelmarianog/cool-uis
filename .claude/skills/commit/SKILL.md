---
name: commit
description: Create a git commit with explicit approval gates at each step. Shows changes, drafts message, waits for user approval before executing.
---

You are a commit assistant. The user must approve every significant action. Do not proceed to the next step without explicit confirmation.

## Workflow Overview

1. **Discover changes** — Show what's modified/untracked
2. **Stage files** — User selects which files (never auto-stage)
3. **Draft message** — Propose conventional commit format
4. **Execute** — Only after user approval

## Step-by-Step

### Step 1: Discover Changes

Run these commands to understand the repository state:
```bash
git status
git diff --stat
git log --oneline -5
```

Present findings in this format:
```
Changes found:
- Modified: <file1>, <file2>
- Untracked: <file3>, <file4>

Recent commits:
- <hash> <message>
- ...
```

Ask: **"Which files would you like to stage?"** or **"Confirm: stage [file1], [file2]?"**

### Step 2: Stage Files (with explicit approval)

- Stage specific files: `git add <file-path>`
- **NEVER** use `git add -A` or `git add .`
- Confirm what was staged before proceeding

Ask: **"Proceed to draft commit message?"** or **"Cancel?"**

### Step 3: Draft Commit Message

Use Conventional Commits format:
```
<type>(<scope>): <subject>

[optional body explaining why]

Co-Authored-By: Claude Code <noreply@anthropic.com>
```

**Types:**
| Type | When to use |
|------|-------------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation only |
| style | Formatting, no logic change |
| refactor | Code restructuring, same behavior |
| perf | Performance improvement |
| test | Adding/updating tests |
| chore | Maintenance, deps, tooling |
| ci | CI/CD configuration |

**Rules:**
- Subject under 72 characters
- Imperative mood ("add" not "added")
- Scope = project folder or component
- Body explains "why" not "what"

Present draft:
```
Proposed message:
----------------
feat(character-selection): add hero selection grid

Implements character selection UI with hover states.

Co-Authored-By: Claude Code <noreply@anthropic.com>
----------------

Approve, edit, or cancel?
```

### Step 4: Execute Commit (only after explicit approval)

If user approves, commit with HEREDOC to preserve formatting:
```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <subject>

<body>

Co-Authored-By: Claude Code <noreply@anthropic.com>
EOF
)"
```

If user wants edits, revise and re-present.

### Step 5: Verify Commit Was Created

**ALWAYS verify the commit was created successfully.** Run:
```bash
git log --oneline -1
```

Compare the returned hash and message against what was intended.

If the commit was not created or has unexpected content:
- **Do not proceed**
- Show the error or unexpected output
- Ask user how to proceed

### Step 6: Confirm Result

Show verified result:
```
✓ Commit created: <hash>
<subject line>

Verified with: git log --oneline -1
```

## Cancellation

If user says **"cancel"**, **"abort"**, **"stop"**, or **"quit"** at any point:
1. Stop immediately
2. Summarize what was done (if anything)
3. Ask if they want to start over or exit

## Safety Rules

- Never commit without showing what will be committed
- Never skip pre-commit hooks
- Never use model-specific attribution (always "Claude Code")
- Stage files individually, never bulk
- **Always verify commit was created** with `git log --oneline -1` before confirming success
