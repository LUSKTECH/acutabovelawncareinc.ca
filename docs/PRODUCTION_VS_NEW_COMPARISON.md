# Production Site vs New Site Comparison

**Date:** January 14, 2026  
**Production URL:** https://acutabovelawncareinc.ca/  
**Local Dev URL:** http://localhost:3000

## Executive Summary

Successfully analyzed the production WordPress site using browsermcp. Identified key differences in structure, navigation, and content that need to be addressed in the new Next.js version.

## Critical Findings

### 1. URL Structure - MAJOR DIFFERENCE ⚠️

**Production Site (WordPress):**
- Services organized in category folders:
  - `/landscaping-services/` (5 services)
  - `/lawn-services/` (4 services)
  - `/hardscaping/` (2 services)
  - `/other-services/` (11 services)
- Example: `/lawn-services/lawn-mowing/`

**New Site (Next.js):**
- All services flat under `/services/`:
  - `/services/lawn-mowing`
  - `/services/fertilization`
  - etc.

**Impact:** Our current redirects won't work! They redirect from root level (e.g., `/lawn-mowing`) to `/services/lawn-mowing`, but production uses category folders.

**Required Action:** Update redirects to match actual production URLs.

### 2. Navigation Structure

**Production Site:**
- Dropdown menus with categories:
  - **Landscaping** (5 sub-items)
  - **Lawn** (4 sub-items)
  - **Hardscaping** (2 sub-items)
  - **Other Services** (11 sub-items)
  - Gallery
  - Contact
  - Service Areas

**New Site:**
- Simple flat navigation:
  - Home
  - Services (links to index)
  - Gallery
  - Contact

**Required Action:** Implement dropdown navigation with service categories to match production.

### 3. Header Differences

**Production Site:**
- Logo with company name
- Tagline: "BIG ENOUGH TO SERVICE YOU, SMALL ENOUGH TO CARE"
- Weather widget integration
- Phone number: (905) 638-0884 (clickable)
- Dropdown navigation with categories

**New Site:**
- Simple logo + company name
- Flat navigation
- No tagline
- Placeholder phone: (555) 123-4567

**Required Actions:**
- Add tagline to header
- Update phone number to real: (905) 638-0884
- Implement dropdown navigation
- Consider weather widget (optional)

### 4. Homepage Differences

**Production Site:**
- Full-screen hero slider with background images
- Service carousel showing 3 services at a time
- "Specializing in Condominiums and Commercial Property Maintenance" callout
- "Drop Us A Line" CTA button
- Main content section with company description
- "Get In Touch With Us Today" CTA button

**New Site:**
- Hero section with tagline and CTAs
- Services overview (first 3 services)
- Featured gallery section
- Contact CTA section

**Required Actions:**
- Consider adding hero slider (or keep simpler version)
- Add "Specializing in..." callout
- Ensure CTAs are prominent

### 5. Footer Differences

**Production Site:**
- Business hours:
  - Monday to Friday: 8:00AM - 5:00PM
  - By Appointment Only Sat-Sun
  - During Winter: On Call 24/7
- Disclaimer text
- Credit to Lusk Technologies

**New Site:**
- Company name and description
- Contact Us heading (no details)
- Quick Links navigation
- Copyright notice

**Required Actions:**
- Add business hours to footer
- Add disclaimer text
- Consider Lusk Technologies credit

### 6. Contact Page Differences

**Production Site:**
- Contact form with fields:
  - Name*
  - Email*
  - Phone (Area Code + Number split)
  - Message*
  - Submit button
- Contact Information box:
  - Address: Burlington ON L7P 0B1
  - Tel: (905) 638-0884
  - Fax: (905) 332-0645
  - Email: info@acutabovelawncareinc.ca

**New Site:**
- Contact form with fields:
  - Name*
  - Email*
  - Phone*
  - Message*
- Business hours and contact info in text

**Required Actions:**
- Update phone number to (905) 638-0884
- Add fax number: (905) 332-0645
- Add address: Burlington ON L7P 0B1
- Consider splitting phone field (area code + number)

### 7. Service Page Structure

**Production Site:**
- Clean article layout
- H1 main heading
- H2 and H3 subheadings
- Multiple paragraphs
- Horizontal separator
- "Get In Touch With Us Today" CTA button at bottom

**New Site:**
- Service title (H1)
- Description content
- "Ready to Get Started?" CTA section
- "Back to All Services" link

**Similarity:** Content structure is similar, both work well.

### 8. Real Business Information

**From Production Site:**
- **Phone:** (905) 638-0884
- **Fax:** (905) 332-0645
- **Email:** info@acutabovelawncareinc.ca
- **Address:** Burlington ON L7P 0B1
- **Service Areas:** Burlington, Oakville, Milton
- **Hours:**
  - Monday-Friday: 8:00AM - 5:00PM
  - Saturday-Sunday: By Appointment Only
  - Winter: On Call 24/7

## Required Changes Summary

### HIGH PRIORITY (Must Fix Before Deployment)

1. **Fix URL Redirects** ⚠️
   - Update `next.config.ts` redirects to match production category structure
   - Example: `/lawn-services/lawn-mowing/` → `/services/lawn-mowing`
   - Need redirects for all 4 categories

2. **Update Contact Information**
   - Phone: (905) 638-0884 (replace placeholder)
   - Fax: (905) 332-0645 (add)
   - Address: Burlington ON L7P 0B1 (add)
   - Email: info@acutabovelawncareinc.ca (verify)

3. **Implement Dropdown Navigation**
   - Add service categories to navigation
   - Match production structure (4 categories)
   - Ensure mobile menu works with dropdowns

4. **Add Business Hours to Footer**
   - Monday-Friday: 8:00AM - 5:00PM
   - Saturday-Sunday: By Appointment Only
   - Winter: On Call 24/7

### MEDIUM PRIORITY (Should Fix)

5. **Add Header Tagline**
   - "BIG ENOUGH TO SERVICE YOU, SMALL ENOUGH TO CARE"

6. **Add Footer Disclaimer**
   - Legal disclaimer text from production
   - Lusk Technologies credit (optional)

7. **Update Homepage**
   - Add "Specializing in Condominiums and Commercial Property Maintenance" callout
   - Ensure CTAs are prominent

### LOW PRIORITY (Nice to Have)

8. **Weather Widget** (Optional)
   - Production has weather integration
   - May not be necessary for new site

9. **Hero Slider** (Optional)
   - Production has full-screen background slider
   - New site has simpler hero section
   - Current approach is more modern

## Service Categories Breakdown

### Landscaping Services (5)
1. Commercial Garden Design
2. Commercial Landscaping
3. Landscape Construction
4. Landscape Design
5. Landscaping

### Lawn Services (4)
1. Aeration
2. Commercial Lawn Mowing
3. Lawn Mowing
4. Lawn Care

### Hardscaping (2)
1. Hardscapes
2. Retaining Walls

### Other Services (11)
1. Commercial Property Maintenance
2. Fertilization
3. Lawn Pest Control
4. Mulching
5. Shrubs and Hedges
6. Sodding
7. Sprinklers
8. Xeriscaping
9. Irrigation
10. Tree Removal
11. Commercial Snow Removal

**Total:** 22 services (vs 35 imported from WordPress)

**Note:** We imported 35 services, but production only shows 22 in navigation. The extra 13 are likely:
- Privacy Policy
- Home
- About Us
- Service Areas
- Header
- Footer
- CSS
- Gallery
- Contact
- And duplicates

## Next Steps

### 1. Fix Redirects (Critical)
```typescript
// Update next.config.ts with correct category redirects
{
  source: '/landscaping-services/:slug',
  destination: '/services/:slug',
  permanent: true,
},
{
  source: '/lawn-services/:slug',
  destination: '/services/:slug',
  permanent: true,
},
{
  source: '/hardscaping/:slug',
  destination: '/services/:slug',
  permanent: true,
},
{
  source: '/other-services/:slug',
  destination: '/services/:slug',
  permanent: true,
}
```

### 2. Update Components
- Header: Add tagline, update phone, implement dropdowns
- Footer: Add business hours, disclaimer
- Contact: Update all contact information

### 3. Test Thoroughly
- Test all redirects work
- Test navigation dropdowns
- Test contact form
- Test mobile responsiveness

## Conclusion

The new site has clean content and good structure, but needs several adjustments to match the production site:

**Critical:** URL redirects and contact information  
**Important:** Navigation structure and business hours  
**Nice to have:** Tagline, disclaimer, and visual polish

Once these changes are made, the site will be ready for deployment.

---

**Prepared by:** Kiro AI  
**Date:** January 14, 2026  
**Status:** 🔧 CHANGES REQUIRED BEFORE DEPLOYMENT
