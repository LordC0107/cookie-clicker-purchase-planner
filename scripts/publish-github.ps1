param(
  [string]$RepoName = "cookie-clicker-purchase-planner",
  [ValidateSet("public", "private", "internal")]
  [string]$Visibility = "public",
  [string]$RemoteName = "origin"
)

$ErrorActionPreference = "Stop"

function Find-Gh {
  $command = Get-Command gh -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  $defaultPath = "C:\Program Files\GitHub CLI\gh.exe"
  if (Test-Path $defaultPath) {
    return $defaultPath
  }

  throw "GitHub CLI was not found. Install it with: winget install --id GitHub.cli"
}

function Run-Gh {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)
  & $script:GhPath @Arguments
}

$script:GhPath = Find-Gh

git rev-parse --is-inside-work-tree | Out-Null
Run-Gh auth status | Out-Null

$status = git status --porcelain
if ($status) {
  Write-Host "Working tree has uncommitted changes:"
  git status --short
  throw "Commit or stash changes before publishing."
}

$currentBranch = git branch --show-current
if (-not $currentBranch) {
  throw "Could not determine the current git branch."
}

$visibilityFlag = "--$Visibility"
$remoteExists = $false
try {
  git remote get-url $RemoteName | Out-Null
  $remoteExists = $true
} catch {
  $remoteExists = $false
}

if (-not $remoteExists) {
  Run-Gh repo create $RepoName $visibilityFlag --source "." --remote $RemoteName --push
} else {
  $repoExists = $true
  try {
    Run-Gh repo view $RepoName | Out-Null
  } catch {
    $repoExists = $false
  }

  if (-not $repoExists) {
    Run-Gh repo create $RepoName $visibilityFlag
  }

  git push -u $RemoteName $currentBranch
}

Write-Host ""
Write-Host "Published $RepoName on branch $currentBranch."
Write-Host "Mod CDN URL:"
Write-Host "https://cdn.jsdelivr.net/gh/$(Run-Gh api user --jq .login)/$RepoName@$currentBranch/purchase-planner.js"
