# Setting Up Private GitHub Repository with Cursor

## Current Setup

Your repository is currently configured as:
- **URL:** https://github.com/iamparamsoni/job-clock-sync
- **Status:** Public (can be changed to private)

## Option 1: Change Existing Repo to Private (Recommended)

### Steps:
1. Go to https://github.com/iamparamsoni/job-clock-sync
2. Click **Settings** (top right)
3. Scroll down to **Danger Zone**
4. Click **Change visibility**
5. Select **Make private**
6. Confirm the change

After making it private, you'll need to authenticate for push/pull operations.

---

## Option 2: Set Up Authentication for Private Repo

### Method A: Personal Access Token (PAT) - Recommended for HTTPS

#### Step 1: Create Personal Access Token
1. Go to GitHub: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Name it: `Cursor - Job Clock Sync`
4. Select expiration: `90 days` or `No expiration`
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (if using GitHub Actions)
6. Click **Generate token**
7. **IMPORTANT:** Copy the token immediately (you won't see it again)

#### Step 2: Update Git Remote with Token
```bash
# Remove current remote
git remote remove origin

# Add new remote with token
git remote add origin https://<YOUR_TOKEN>@github.com/iamparamsoni/job-clock-sync.git

# Or update existing remote
git remote set-url origin https://<YOUR_TOKEN>@github.com/iamparamsoni/job-clock-sync.git
```

#### Step 3: Use Credential Manager (Windows)
Instead of embedding token in URL, use Windows Credential Manager:

```bash
# Set remote to HTTPS (without token)
git remote set-url origin https://github.com/iamparamsoni/job-clock-sync.git

# When prompted, use:
# Username: iamparamsoni
# Password: <YOUR_PERSONAL_ACCESS_TOKEN>
```

Windows will store this in Credential Manager.

---

### Method B: SSH Authentication (More Secure)

#### Step 1: Generate SSH Key
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Press Enter to accept default location
# Optionally set a passphrase for extra security
```

#### Step 2: Add SSH Key to GitHub
1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   (On Windows: `type %USERPROFILE%\.ssh\id_ed25519.pub`)

2. Go to GitHub: https://github.com/settings/keys
3. Click **New SSH key**
4. Title: `Cursor - Windows`
5. Paste the public key
6. Click **Add SSH key**

#### Step 3: Update Git Remote to SSH
```bash
# Change remote to SSH
git remote set-url origin git@github.com:iamparamsoni/job-clock-sync.git

# Test connection
ssh -T git@github.com
```

---

## Option 3: Use GitHub CLI (gh) - Easiest

### Install GitHub CLI
```bash
# Download from: https://cli.github.com/
# Or use winget
winget install GitHub.cli
```

### Authenticate
```bash
gh auth login
# Follow prompts:
# - GitHub.com
# - HTTPS
# - Authenticate in browser
# - Login with GitHub account
```

### Clone/Setup Repo
```bash
# If setting up new repo
gh repo create job-clock-sync --private --source=. --remote=origin --push

# Or just authenticate and use regular git commands
```

---

## Testing Your Setup

### Test Push (after setup)
```bash
cd "D:\OneDrive - SmartDocs\Desktop\Lovable Integration\job-clock-sync"

# Make a small change
echo "# Test" >> test.txt

# Stage and commit
git add test.txt
git commit -m "test: Verify private repo access"

# Push
git push origin main

# If successful, remove test file
git rm test.txt
git commit -m "test: Remove test file"
git push origin main
```

### Test Pull
```bash
git pull origin main
```

---

## Troubleshooting

### Issue: "Authentication failed" or "403 Forbidden"
**Solution:**
- If using HTTPS: Regenerate PAT and update credentials
- If using SSH: Verify SSH key is added to GitHub
- Check token/SSH key has `repo` scope

### Issue: "Permission denied (publickey)"
**Solution:**
- Verify SSH key is added to GitHub
- Test SSH connection: `ssh -T git@github.com`
- Check SSH agent is running: `ssh-add -l`

### Issue: "Remote origin already exists"
**Solution:**
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin <NEW_URL>
```

### Issue: Windows Credential Manager Issues
**Solution:**
```bash
# Remove old credentials
cmdkey /delete:git:https://github.com

# Try again - it will prompt for new credentials
git push origin main
```

---

## Recommended Setup for Cursor

**Best Option:** **SSH Authentication**
- Most secure
- No token expiration
- Works seamlessly with Cursor
- No need to enter credentials repeatedly

**Quick Setup:**
```bash
# 1. Generate SSH key (if needed)
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. Add to GitHub (copy public key and add via web interface)

# 3. Update remote
cd "D:\OneDrive - SmartDocs\Desktop\Lovable Integration\job-clock-sync"
git remote set-url origin git@github.com:iamparamsoni/job-clock-sync.git

# 4. Test
git push origin main
```

---

## Making Repo Private (If Not Already)

1. Go to: https://github.com/iamparamsoni/job-clock-sync/settings
2. Scroll to **Danger Zone**
3. Click **Change visibility** → **Make private**
4. Confirm

---

## Security Notes

- **Never commit tokens/keys to Git**
- **Use SSH keys with passphrases for extra security**
- **Rotate PATs regularly (every 90 days)**
- **Use different PATs for different projects**
- **Revoke unused PATs immediately**

---

## Quick Reference Commands

```bash
# Check current remote
git remote -v

# Change to SSH
git remote set-url origin git@github.com:iamparamsoni/job-clock-sync.git

# Change to HTTPS
git remote set-url origin https://github.com/iamparamsoni/job-clock-sync.git

# Test SSH connection
ssh -T git@github.com

# View stored credentials (Windows)
cmdkey /list | findstr git

# Remove stored credentials
cmdkey /delete:git:https://github.com
```

---

**Need Help?** Let me know which method you prefer and I can guide you through the specific setup!

