# WordPress to Sanity Migration Guide

This guide walks you through migrating content from the WordPress site to the new Next.js + Sanity CMS site.

## Prerequisites

- SSH access to the server (`ssh rouge`)
- Sanity API token with write permissions
- Node.js and npm installed locally

## Environment Setup

1. Create a `.env.local` file with your Sanity credentials:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token
REVALIDATE_SECRET=your_webhook_secret
```

2. Get your Sanity API token:
   - Go to https://www.sanity.io/manage
   - Select your project
   - Go to API → Tokens
   - Create a new token with "Editor" permissions
   - Copy the token to `SANITY_API_TOKEN` in `.env.local`

## Migration Process

### Option 1: Automated Migration (Recommended)

Run the complete migration with a single command:

```bash
npm run migrate:all
```

This will:
1. Export WordPress content using wp-cli
2. Download all media files
3. Import content to Sanity CMS
4. Configure URL redirects in next.config.ts

### Option 2: Step-by-Step Migration

#### Step 1: Export WordPress Content

Export posts, pages, and metadata from WordPress:

```bash
npm run migrate:export
```

This script:
- Connects to the server via SSH
- Uses wp-cli to export all content
- Saves data to `wordpress-export/[timestamp]/`
- Creates a symlink at `wordpress-export/latest/`

**Output files:**
- `posts-detailed.json` - All posts with full content
- `media-detailed.json` - Media library information
- `categories.json` - Category taxonomy
- `tags.json` - Tag taxonomy
- `site-name.txt` - Site name
- `permalink-structure.txt` - URL structure
- `rewrite-rules.json` - WordPress rewrite rules

#### Step 2: Download Media Files

Download all images and media from the WordPress uploads directory:

```bash
npm run migrate:download
```

This script:
- Uses rsync to download media files
- Preserves directory structure
- Saves to `wordpress-export/latest/media-files/`

**Note:** This may take a while depending on the number and size of media files.

#### Step 3: Import to Sanity CMS

Import the exported content into Sanity:

```bash
npm run migrate:import
```

This script:
- Transforms WordPress posts to Sanity services
- Uploads media files to Sanity
- Creates documents in Sanity CMS
- Generates URL redirect mappings
- Validates migration completeness

**Output:**
- Content imported to Sanity CMS
- `redirects.json` - URL redirect mappings

#### Step 4: Configure URL Redirects

Add redirects to next.config.ts:

```bash
npm run migrate:configure-redirects
```

This script:
- Reads `redirects.json`
- Updates `next.config.ts` with redirect rules
- Creates a backup of the original config

## Verification

### 1. Check Sanity Studio

Visit your Sanity Studio to verify imported content:

```bash
# If you have Sanity Studio set up locally
cd sanity-studio
npm run dev
```

Or visit: https://your-project.sanity.studio

### 2. Test Locally

Start the Next.js development server:

```bash
npm run dev
```

Visit http://localhost:3000 and verify:
- All pages load correctly
- Images display properly
- Services are listed
- Gallery works
- Contact form functions

### 3. Test Redirects

Test that old WordPress URLs redirect correctly:

```bash
# Test a service URL
curl -I http://localhost:3000/services/lawn-mowing

# Test WordPress admin URL
curl -I http://localhost:3000/wp-admin

# Should return 301 redirects
```

## Troubleshooting

### Export Fails

**Problem:** SSH connection fails or wp-cli not found

**Solution:**
- Verify SSH access: `ssh rouge`
- Check wp-cli is installed: `ssh rouge "wp --version --allow-root"`
- Verify site directory: `ssh rouge "ls /var/www/acutabovelawncareinc.ca/htdocs/"`

### Media Download Fails

**Problem:** rsync fails or times out

**Solution:**
- Check SSH connection
- Try downloading in smaller batches
- Manually download from server if needed

### Import Fails

**Problem:** Sanity API errors or authentication fails

**Solution:**
- Verify `SANITY_API_TOKEN` in `.env.local`
- Check token has write permissions
- Verify project ID and dataset are correct
- Check Sanity project is not in read-only mode

### Missing Content

**Problem:** Some posts or media not imported

**Solution:**
- Check the migration summary output
- Review error messages in console
- Verify WordPress content was exported correctly
- Re-run import for failed items

## Manual Verification Checklist

After migration, verify:

- [ ] All service pages exist and display correctly
- [ ] All images are present and load properly
- [ ] Gallery displays all images
- [ ] Contact form works
- [ ] SEO metadata is correct
- [ ] Old WordPress URLs redirect properly
- [ ] No broken links
- [ ] Site navigation works
- [ ] Mobile responsive design works
- [ ] Performance is good (Lighthouse score > 90)

## Rollback

If you need to rollback:

1. **Restore next.config.ts:**
   ```bash
   cp next.config.ts.backup next.config.ts
   ```

2. **Delete imported Sanity content:**
   - Use Sanity Studio to delete documents
   - Or use Sanity CLI: `sanity dataset delete production`

3. **Keep WordPress site running** until migration is verified

## Post-Migration

After successful migration:

1. **Update DNS** to point to new hosting
2. **Set up Sanity webhook** for content updates
3. **Configure SSL certificate**
4. **Set up monitoring** (Vercel Analytics, Sentry, etc.)
5. **Train content editors** on Sanity Studio
6. **Archive WordPress site** (keep backup)

## Support

For issues or questions:
- Check the migration logs in `wordpress-export/latest/`
- Review error messages in console output
- Verify all environment variables are set correctly
- Test each step individually to isolate issues

## Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js Redirects](https://nextjs.org/docs/app/api-reference/next-config-js/redirects)
- [wp-cli Documentation](https://wp-cli.org/)
- [Migration Utilities](./lib/migration.ts)
