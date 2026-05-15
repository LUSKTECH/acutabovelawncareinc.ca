# Sanity CMS Setup Guide

This document provides instructions for setting up Sanity Studio and defining the content models for the A Cut Above Lawn Care website.

## Prerequisites

- Node.js 18+ installed
- A Sanity account (sign up at https://www.sanity.io)

## Step 1: Create Sanity Project

1. Go to https://www.sanity.io/manage
2. Click "Create new project"
3. Choose a project name (e.g., "acutabove-landscaping")
4. Select a dataset name (use "production")
5. Copy your Project ID

## Step 2: Configure Environment Variables

Create a `.env.local` file in the `landscaping-site` directory:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token_here
```

To get an API token:
1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to "API" → "Tokens"
4. Create a new token with "Editor" permissions
5. Copy the token to your `.env.local` file

## Step 3: Install Sanity Studio (Optional)

If you want to run Sanity Studio locally for content management:

```bash
npm install -g @sanity/cli
sanity init
```

Follow the prompts and select your existing project.

## Step 4: Define Content Models

Below are the schema definitions for all content types. These should be added to your Sanity Studio.

### Service Schema

```javascript
export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'additionalImages',
      title: 'Additional Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: Rule => Rule.required()
            }
          ]
        }
      ]
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'SEO Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'SEO Description',
          type: 'text'
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}]
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image'
        },
        {
          name: 'noIndex',
          title: 'No Index',
          type: 'boolean',
          description: 'Prevent search engines from indexing this page'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'featuredImage'
    }
  }
}
```

### Gallery Image Schema

```javascript
export default {
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Lawn Care', value: 'lawn-care'},
          {title: 'Landscaping', value: 'landscaping'},
          {title: 'Garden Design', value: 'garden-design'},
          {title: 'Maintenance', value: 'maintenance'}
        ]
      }
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image'
    }
  }
}
```

### Page Schema

```javascript
export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'SEO Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'SEO Description',
          type: 'text'
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}]
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image'
        },
        {
          name: 'noIndex',
          title: 'No Index',
          type: 'boolean'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title'
    }
  }
}
```

### Site Settings Schema

```javascript
export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      fields: [
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url'
        },
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url'
        }
      ]
    },
    {
      name: 'footerText',
      title: 'Footer Text',
      type: 'text'
    }
  ],
  preview: {
    select: {
      title: 'siteName'
    }
  }
}
```

## Step 5: Add Schemas to Sanity Studio

If using Sanity Studio locally:

1. Create files in `schemas/` directory for each content type
2. Import them in `schemas/index.js`:

```javascript
import service from './service'
import galleryImage from './galleryImage'
import page from './page'
import siteSettings from './siteSettings'

export const schemaTypes = [service, galleryImage, page, siteSettings]
```

3. Deploy the schema:

```bash
sanity deploy
```

## Step 6: Add Initial Content

1. Open Sanity Studio (locally or at your-project.sanity.studio)
2. Create at least one Site Settings document
3. Add services with images
4. Add gallery images
5. Publish all content

## Step 7: Test the Integration

Run the Next.js development server:

```bash
npm run dev
```

The CMS client should now be able to fetch content from Sanity.

## Troubleshooting

### CORS Errors

If you encounter CORS errors:
1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to "API" → "CORS Origins"
4. Add your development URL (e.g., `http://localhost:3000`)

### Missing Content

If content doesn't appear:
1. Verify your Project ID and Dataset in `.env.local`
2. Check that content is published in Sanity Studio
3. Verify API token has correct permissions

### Image Loading Issues

If images don't load:
1. Verify images have alt text in Sanity
2. Check that images are published
3. Verify the image URL builder is working correctly

## Next Steps

After completing this setup:
- Proceed to Task 2.2: Create CMS client interface (already implemented)
- Proceed to Task 2.3: Write unit tests for CMS client
