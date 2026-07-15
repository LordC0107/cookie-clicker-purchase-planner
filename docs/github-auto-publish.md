# Automatic GitHub Publishing

Use this when a local project already has a Git commit and you want GitHub CLI to create the remote repository and push it automatically.

## One-Time Setup

Install GitHub CLI:

```powershell
winget install --id GitHub.cli
```

Open a new PowerShell window and log in:

```powershell
gh auth login
gh auth status
```

If `gh auth status` says you are logged in, no GitHub webpage repository creation is needed.

## Publish This Project

From the repository folder:

```powershell
cd D:\Working_Study\04AiWorkbench\cookie-clicker-purchase-planner
.\scripts\publish-github.ps1
```

The script will:

- verify GitHub CLI is installed and logged in;
- verify the working tree is clean;
- create the GitHub repository if needed;
- attach or reuse the `origin` remote;
- push the current branch;
- print the jsDelivr mod URL.

## Reusable Pattern

For a future project, copy `scripts/publish-github.ps1` into the new repository and run:

```powershell
.\scripts\publish-github.ps1 -RepoName your-repository-name -Visibility public
```

Supported visibility values are `public`, `private`, and `internal`.

## Why Codex May Still Need This Script

Sometimes Codex can see `gh.exe` but cannot read the Windows keyring token that your normal PowerShell can read. In that case, run the script from your own PowerShell window. It still avoids manual GitHub webpage repository creation.
