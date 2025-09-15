# DigitalOcean Container Registry Setup Guide

## The Error Explained

The error you're seeing:
```
failed to fetch oauth token: unexpected status from GET request to https://api.digitalocean.com/v2/registry/auth?scope=repository%3Aasset-tracker-backend%3Apull%2Cpush&service=registry.digitalocean.com: 400 Bad Request
```

This happens because:
1. **Registry doesn't exist** - You need to create the registry first
2. **Wrong registry name format** - DigitalOcean uses `username/registry-name` format
3. **Missing permissions** - Your API token needs registry access

## Step-by-Step Setup

### 1. Create DigitalOcean Container Registry

```bash
# Install doctl CLI
snap install doctl

# Login to DigitalOcean
doctl auth init

# Create container registry (replace 'your-username' with your actual DO username)
doctl registry create your-username-asset-tracker --region nyc1
```

### 2. Get Your Registry Information

```bash
# List your registries
doctl registry list

# Get registry login command
doctl registry login
```

The registry name format should be: `your-username-asset-tracker`

### 3. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `DO_KEY`: Your DigitalOcean API token
- `DO_REGISTRY_NAME`: Your registry name (e.g., `your-username-asset-tracker`)

### 4. Test Registry Access

```bash
# Login to registry
doctl registry login

# Test push (create a test image)
docker tag hello-world registry.digitalocean.com/your-username-asset-tracker/test:latest
docker push registry.digitalocean.com/your-username-asset-tracker/test:latest

# List images in registry
doctl registry repository list-tags your-username-asset-tracker/test
```

## Common Issues & Solutions

### Issue 1: Registry Not Found
**Error**: `repository not found`
**Solution**: 
```bash
# Create the registry first
doctl registry create your-username-asset-tracker --region nyc1
```

### Issue 2: Authentication Failed
**Error**: `401 Unauthorized`
**Solution**:
```bash
# Regenerate API token with registry permissions
# Go to DigitalOcean → API → Personal Access Tokens
# Create new token with "Read" and "Write" permissions
```

### Issue 3: Wrong Registry Name Format
**Error**: `400 Bad Request`
**Solution**: Use the correct format:
- ✅ Correct: `your-username-asset-tracker`
- ❌ Wrong: `asset-tracker-backend`
- ❌ Wrong: `asset-tracker`

### Issue 4: Region Mismatch
**Error**: `repository not found in region`
**Solution**:
```bash
# Check available regions
doctl registry list

# Create registry in correct region
doctl registry create your-username-asset-tracker --region nyc1
```

## Environment Variables for Deployment

Create `.env` file on your droplet:
```bash
# DigitalOcean Registry
DO_REGISTRY_NAME=your-username-asset-tracker
DIGITALOCEAN_ACCESS_TOKEN=your_do_token_here

# Database
DATABASE_URL=mysql://username:password@your-mysql-host:3306/database_name
```

## Verification Steps

1. **Check Registry Exists**:
   ```bash
   doctl registry list
   ```

2. **Test Authentication**:
   ```bash
   doctl registry login
   docker pull registry.digitalocean.com/your-username-asset-tracker/test:latest
   ```

3. **Test GitHub Actions**:
   - Push to main branch
   - Check Actions tab for build logs
   - Verify images are pushed to registry

4. **Test Deployment**:
   ```bash
   # On your droplet
   ./deploy.sh
   ```

## Registry Management

### List Images
```bash
doctl registry repository list-tags your-username-asset-tracker/asset-tracker-backend
doctl registry repository list-tags your-username-asset-tracker/asset-tracker-frontend
```

### Delete Old Images
```bash
doctl registry repository delete-tag your-username-asset-tracker/asset-tracker-backend old-tag
```

### Clean Up Registry
```bash
# List all repositories
doctl registry repository list

# Delete unused repositories
doctl registry repository delete your-username-asset-tracker/unused-repo
```

## Cost Optimization

- **Storage**: Monitor registry storage usage
- **Bandwidth**: Be aware of pull/push bandwidth costs
- **Cleanup**: Regularly delete old/unused images
- **Regions**: Choose the region closest to your deployment

## Security Best Practices

1. **API Token**: Use minimal required permissions
2. **Registry Access**: Limit who can push to registry
3. **Image Scanning**: Enable vulnerability scanning if available
4. **Secrets**: Never commit API tokens to code
5. **Rotation**: Regularly rotate API tokens
