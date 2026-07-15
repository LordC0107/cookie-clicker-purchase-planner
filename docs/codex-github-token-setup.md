# Codex GitHub Token Setup

Use this once when Codex can see `gh.exe` but cannot use the normal Windows keyring login.

## Goal

Store a GitHub token in GitHub CLI's plain configuration file so Codex can run:

```powershell
gh repo create ... --push
```

without requiring manual GitHub webpage repository creation.

## Create The Token

Create a classic personal access token:

```text
https://github.com/settings/tokens
```

Use `Generate new token (classic)`.

Recommended scopes:

```text
repo
read:org
gist
workflow
```

Do not paste the token into chat.

## Configure GitHub CLI For Codex

Run this in your own PowerShell window:

```powershell
$token = Read-Host "Paste GitHub classic PAT" -AsSecureString
$plain = (New-Object System.Net.NetworkCredential("", $token)).Password

& "C:\Program Files\GitHub CLI\gh.exe" auth logout -h github.com -u LordC0107
$plain | & "C:\Program Files\GitHub CLI\gh.exe" auth login --with-token --insecure-storage -h github.com -p https
& "C:\Program Files\GitHub CLI\gh.exe" auth setup-git -h github.com

Remove-Variable token
Remove-Variable plain
```

If logout says there is no account, continue with the remaining commands.

## Verify

Run:

```powershell
& "C:\Program Files\GitHub CLI\gh.exe" auth status
& "C:\Program Files\GitHub CLI\gh.exe" api user --jq .login
```

Both should succeed.

## Notes

- `--insecure-storage` intentionally stores the token in `C:\Users\23945\AppData\Roaming\GitHub CLI\hosts.yml`.
- This is useful for Codex automation because Codex may not be able to read the Windows keyring token used by normal PowerShell.
- Treat this machine as trusted after enabling plain token storage.
- Revoke the token from GitHub settings if it is ever exposed.
