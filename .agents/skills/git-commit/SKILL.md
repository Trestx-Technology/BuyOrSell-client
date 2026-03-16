---
name: git-commit
description: Creates feature-scoped Git commits and raises Pull Requests via GitHub CLI following standardized conventions.
---

# Git Commit Skill

## Purpose
Ensures all commits created by the agent are feature-scoped, concise (exactly one line, 150-200 characters), and formatted strictly using standard prefixes. Prevents accidental commits of unrelated files.

## When to Use
Triggered when a user requests to `commit`, `commit changes`, `commit and push`, or `save changes`.

**STRICT RULE:** The agent must **never commit changes automatically**. Completing pipelines or workflows must never trigger commits without explicit user request.
This skill executes outside the standard pipeline workflow but respects the feature-based project architecture.

## Responsibilities & Steps

### 1. Detect Modified Feature or Module
   - Analyze changed files using `git diff --name-only`.
   - Determine the affected module by matching files with:
     - `docs/features/<feature>`
     - `src/features/<feature>`
     - `.agents/progress/<feature>.md`
   - If files belong to the AI workflow system itself (e.g., changes to `.agents/`), the scope is `agent`.

### 2. Stage Relevant Files
   - Stage **only** files related to the detected module.
   - Example allowed staging:
     - `git add src/features/<feature>/*`
     - `git add docs/features/<feature>/*`
     - `git add .agents/progress/<feature>.md`
   - If scope is agent: `git add .agents/*`
   - **FORBIDDEN:** Staging unrelated modules or features.
   - **FORBIDDEN:** The agent must **never execute** `git add .`.

### 3. Commit Guard System (Safety Check)
   - Before committing, check if files from multiple distinct modules/features are about to be staged/committed.
   - If files belong to multiple modules, abort the commit and report:
     `Commit blocked: detected changes in multiple modules. Please commit each module separately.`

### 4. Commit Message Format
   - Format: `<prefix>(<scope>): <summary>`
   - Allowed prefixes: `feat`, `fix`, `refactor`, `test`, `docs`, `perf`, `chore`, `ci`
   - The message **MUST** satisfy all of these rules:
     - **Exactly one line** (no newlines).
     - Contains **between 150 and 200 characters**.
     - Starts with a valid `<prefix>(<scope>): ` format.
     - Contains no bullet points.

### 5. Validate Commit Message
   - Check the drafted message against the rules defined in Step 4.
   - If validation fails, regenerate the commit message until it complies.

### 6. Commit Preview & Execution Mode
   - Determine if the commit is **Explicit** (user requested) or **Suggested** (agent suggested).
   - **Explicit Commit Mode**:
     Display the non-blocking preview and automatically execute the commit:
     ```
     Detected scope: <scope>

     Files committed:
     <list of files>

     Commit message: <generated message>

     Commit executed successfully.
     ```
   - **Suggested Commit Mode**:
     Display the EXACT following and **WAIT** for user confirmation before executing:
     ```
     Commit Preview

     Scope: <scope>

     Files:
     <list of files>

     Commit message:
     <generated message>

     Proceed with commit? (yes/no)
     ```

### 7. Execute Commit and Push
   - Ensure the commit executes automatically in Explicit mode, or upon user 'yes' in Suggested mode, via: `git commit -m "<message>"`
   - If the user requested push, execute `git push` **only after a successful commit`.

### 8. Raise Pull Request (via GitHub CLI)
- **Requirement**: Use this when the user requests to `raise a PR`, `create pull request`, or specifies a target branch (e.g., "to staging").
- **Tooling**: Always use the GitHub CLI (`gh`) for creating PRs.
- **Title**: Follow the standard convention: `<prefix>(<scope>): <short_summary>`.
- **Body Structure**: Generate a clean, structured Markdown body:
  - **Summary**: A high-level overview of the work.
  - **Commit Report**: A detailed list of all commits included in the PR (use `git log <base_branch>..<head_branch> --oneline`).
  - **Affected Files**: A brief list of key modified files.
- **Protocol**:
  1. **Determine Base Branch**:
     - Never assume which branch to raise the PR to (e.g., do not assume `main`).
     - If the user did not specify a branch, check the base branches of the 10 most recent merged PRs using `gh pr list --state merged --limit 10 --json baseRefName`.
     - Identify the most frequent base branch from this list.
     - **MANDATORY**: Ask the user: "I've detected that `<frequent_branch>` is the most common target. Would you like to raise the PR to this branch or another one?"
  2. Verify the current branch is pushed: `git push origin <current_branch>`.
  3. Create the PR: `gh pr create --base <target_branch> --title "<title>" --body "<body>"`.
  4. Provide the user with the PR URL and a confirmation of the branches involved.

## Constraints & Safety Rules
- Unrelated files must NEVER be staged or committed. The commit must remain tightly locally scoped to the single feature detected.
- Never use multi-line commits or bullet points in the *commit message* (PR bodies should use bullets for readability).
- Enforce the 150-200 character count limit strictly for commit messages.
- **NO AUTOMATIC COMMITS or PRs** permitted without explicit user request.
- **Suggested commits REQUIRE MANDATORY user confirmation.**
- **GitHub CLI (`gh`) is the mandatory tool for PR creation.**
