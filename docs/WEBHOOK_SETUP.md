# Webhook Setup for Content Updates

This document explains how to configure webhooks in Sanity CMS to trigger automatic rebuilds when content is updated.

## Overview

When content is published in Sanity CMS, a webhook will trigger the Next.js revalidation API to update the static pages without requiring a full rebuild.

## Setup Steps

### 1. Generate a Secret Token

Generate a secure random token for webhook authentication:

```bash
openssl rand -base64 32
```

Add this to your `.env.local` file:

```env
REVALIDATE_SECRET=your_generated_secret_here
```

### 2. Configure Sanity Webhook

1. Go to your Sanity project dashboard: https://www.sanity.io/manage
2. Navigate to **API** → **Webhooks**
3. Click **Add Webhook**
4. Configure the webhook:
   - **Name**: Next.js Revalidation
   - **URL**: `https://your-domain.com/api/revalidate?secret=your_generated_secret_here`
   - **Dataset**: production
   - **Trigger on**: Create, Update, Delete
   - **Filter**: Leave empty to trigger on all document types
   - **HTTP method**: POST
   - **API version**: v2021-06-07 (or latest)
   - **Include drafts**: No

### 3. Webhook Payload

The webhook will send a payload like:

```json
{
  "_type": "service",
  "_id": "abc123",
  "slug": {
    "current": "lawn-mowing"
  }
}
```

### 4. Revalidation Logic

The `/api/revalidate` endpoint handles different content types:

- **Service**: Revalidates `/services/[slug]`, `/services`, and `/` (homepage)
- **Gallery Image**: Revalidates `/gallery` and `/` (homepage)
- **Page**: Revalidates `/{slug}`
- **Site Settings**: Revalidates entire site layout

## Testing the Webhook

### Local Testing

Use curl to test the webhook locally:

```bash
curl -X POST "http://localhost:3000/api/revalidate?secret=your_secret" \
  -H "Content-Type: application/json" \
  -d '{"type":"service","slug":"lawn-mowing"}'
```

### Production Testing

1. Publish or update a document in Sanity
2. Check the webhook logs in Sanity dashboard
3. Verify the page updates on your site

## Webhook Response

Successful response:
```json
{
  "revalidated": true,
  "now": 1234567890
}
```

Error response:
```json
{
  "message": "Invalid secret"
}
```

## Troubleshooting

### Webhook Not Triggering

1. Check webhook is enabled in Sanity dashboard
2. Verify the URL is correct and accessible
3. Check webhook logs in Sanity for error messages

### Revalidation Not Working

1. Verify `REVALIDATE_SECRET` environment variable is set
2. Check Next.js logs for revalidation errors
3. Ensure the paths being revalidated are correct

### Security

- Never commit the `REVALIDATE_SECRET` to version control
- Use different secrets for staging and production
- Rotate the secret periodically
- Monitor webhook logs for suspicious activity

## Advanced Configuration

### Custom Revalidation Logic

Edit `/app/api/revalidate/route.ts` to customize which paths are revalidated for each content type.

### Revalidation Tags

Use `revalidateTag()` instead of `revalidatePath()` for more granular control:

```typescript
// In your data fetching
fetch(url, { next: { tags: ['services'] } });

// In webhook handler
revalidateTag('services');
```

### Rate Limiting

Consider adding rate limiting to prevent abuse:

```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});
```

## Monitoring

Monitor webhook activity:

1. Sanity webhook logs: https://www.sanity.io/manage
2. Next.js logs: Check your hosting platform (Vercel, Netlify, etc.)
3. Set up alerts for failed webhooks

## References

- [Next.js On-Demand Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating)
- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
