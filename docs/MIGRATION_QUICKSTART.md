# Migration Quick Start

## Prerequisites

1. Create `.env.local` with Sanity credentials:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token
REVALIDATE_SECRET=your_webhook_secret
```

2. Ensure SSH access to server:
```bash
ssh rouge
```

## One-Command Migration

```bash
npm run migrate:all
```

This will:
1. ✅ Export WordPress content using wp-cli
2. ✅ Download all media files via rsync
3. ✅ Import content to Sanity CMS
4. ✅ Configure URL redirects in next.config.ts

## Step-by-Step (Alternative)

```bash
# Step 1: Export WordPress content
npm run migrate:export

# Step 2: Download media files
npm run migrate:download

# Step 3: Import to Sanity
npm run migrate:import

# Step 4: Configure redirects
npm run migrate:configure-redirects
```

## Verify Migration

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000
# Check:
# - All pages load
# - Images display
# - Services work
# - Gallery works
# - Contact form works
# - Old URLs redirect (e.g., /wp-admin → /)
```

## Troubleshooting

**SSH fails:**
```bash
# Test connection
ssh rouge "echo 'Connection OK'"
```

**wp-cli not found:**
```bash
# Check wp-cli
ssh rouge "wp --version --allow-root"
```

**Sanity import fails:**
- Verify `SANITY_API_TOKEN` has write permissions
- Check project ID and dataset are correct

## What Gets Migrated

✅ All posts and pages  
✅ All media files  
✅ Service content  
✅ Categories and tags  
✅ URL structure  
✅ Site metadata  

## Output Files

- `wordpress-export/latest/` - Exported WordPress data
- `wordpress-export/latest/media-files/` - Downloaded media
- `redirects.json` - URL redirect mappings
- `next.config.ts.backup` - Backup of original config

## Next Steps After Migration

1. Review content in Sanity Studio
2. Test site locally
3. Deploy to production (Vercel/Netlify)
4. Update DNS
5. Set up Sanity webhook

## Full Documentation

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for complete documentation.
