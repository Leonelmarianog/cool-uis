# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo containing UI recreation projects. Each project is independent with its own build process and README.md.

## Custom Skills

Available via slash commands:

- `/commit` - Create git commit with approval gates (conventional commits)
- `/pr` - Create pull request with approval gates

## Git Workflow

**Branch naming:** `<project>/<type>/<description>`
- Example: `re1-character-selection/feat/setup`
- Example: `re2-ui/fix/alignment`

**Commit format:** Conventional Commits
- `feat(project): description`
- `fix(project): description`
- `refactor(project): description`
- `chore(project): description`

**Scope** should match the project folder being modified.

## Claude Code Configuration

Custom skills are defined in `.claude/skills/`:
- `commit/SKILL.md` - Commit workflow with verification
- `pr/SKILL.md` - PR workflow with human-in-the-loop approval

These enforce conventional commits and require explicit user approval at each step.
