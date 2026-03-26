# StorageOwnerAdvisor.com — Claude Code Handoff

## Project Overview
StorageOwnerAdvisor.com is a B2B internet directory for self-storage facility owners listing vendors/service providers. Users can browse categories, search/filter vendors, submit new vendors, claim listings, and contact the site.

**Live site:** https://storageowneradvisor.com
**Owner:** Brent (brfulm@gmail.com)

---

## Tech Stack
- **Framework:** Next.js 14 (App Router) with TypeScript
- **Hosting:** Vercel (auto-deploys from git push)
- **Database:** Supabase (free tier, hosted PostgreSQL)
- **Styling:** Tailwind CSS
- **Domain registrar:** Namecheap
- **Analytics:** Google Analytics 4 (measurement ID: G-XMKTCY24QK)
- **Search Console:** Verified via GA4 method

---

## Repository Structure

### Source Files (src/)

**Pages (src/app/):**
- `layout.tsx` — Root layout with GA4 tracking via raw `<script>` tags in `<head>` (NOT Next.js Script component — Search Console requires scripts in `<head>`)
- `page.tsx` — Homepage with ISR (`export const revalidate = 60`). Renders: HeroSection → CategoryGrid → FeaturedVendors → CTASection → NewsletterSignup
- `category/[slug]/page.tsx` — Category detail page with JSON-LD (CollectionPage + BreadcrumbList), ISR
- `vendor/[slug]/page.tsx` — Vendor detail page with JSON-LD (Product + BreadcrumbList + LocalBusiness for local vendors), ClaimListing component, StarRating, ISR
- `search/page.tsx` — Search page with 4 filter dropdowns: Category, Service Area (local/national), State, City (cascading). Uses `Array.from(new Set(...))` for TypeScript compatibility (NOT spread on Set)
- `submit/page.tsx` — Vendor submission form → saves to `submissions` table. Uses `type="text"` for website field with auto-prepend `https://` (NOT `type="url"` which rejects URLs without protocol)
- `contact/page.tsx` — Contact form → saves to `contact_messages` table. References support@storageowneradvisor.com
- `about/page.tsx` — About page
- `robots.ts` — Robots.txt generator
- `sitemap.ts` — Sitemap generator
- `globals.css` — Global styles

**Components (src/components/):**
- `Header.tsx` — Site header with Next.js Image for logo at `h-20` in `h-24` header. Logo at `/logo.png`
- `Footer.tsx` — Client component, fetches categories from Supabase filtered by `visible = true` AND `vendor_count > 0`. Has email forwarding links (info@ and support@storageowneradvisor.com → brfulm@gmail.com via Namecheap)
- `HeroSection.tsx` — Hero with search bar and popular category links. Padding: `py-10 sm:py-12 md:py-16`
- `CategoryGrid.tsx` — Server component, fetches categories filtered by `visible && vendor_count > 0`. Padding: `py-12 sm:py-14 md:py-16`
- `CategoryCard.tsx` — Individual category card with icon, name, description, vendor count
- `FeaturedVendors.tsx` — Server component, shows vendors where `featured = true`. Returns null if none. Padding: `py-12 sm:py-14 md:py-16`
- `VendorCard.tsx` — Individual vendor card
- `CTASection.tsx` — "Are You a Vendor?" CTA with Submit/Premium buttons. Padding: `py-12 sm:py-14 md:py-16`
- `NewsletterSignup.tsx` — Newsletter form (NOT wired to any backend yet, just shows success message). Padding: `py-12 sm:py-14 md:py-16`
- `ClaimListing.tsx` — Expandable "Is this your business?" form → saves to `claims` table
- `SearchBar.tsx` — Search bar component
- `StarRating.tsx` — Star rating display component

**Library (src/lib/):**
- `supabase.ts` — Supabase client, TypeScript interfaces (Category with `visible` field, Vendor with `city`/`state`/`service_area`), all data fetching functions
- `seo.ts` — JSON-LD generators: `generateVendorJsonLd`, `generateCategoryJsonLd`, `generateHomeJsonLd`, `generateVendorBreadcrumbJsonLd`, `generateCategoryBreadcrumbJsonLd`, `generateLocalBusinessJsonLd`

**Config:**
- `next.config.mjs` — No `output: 'export'` (removed for ISR support)
- `.env.local` — Contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Database Schema (Supabase)

All SQL migrations are in the project root as numbered files (01-08).

### Tables

**categories:**
- id, slug, name, description, icon (emoji), vendor_count (auto-updated by trigger), visible (boolean, default true), created_at
- `visible` column controls whether category appears on site (toggled from Supabase dashboard)
- Vendor count auto-maintained by trigger on vendors table (see 06-auto-vendor-counts.sql)

**vendors:**
- id, slug, name, category_slug, short_description, full_description, website, phone, email, logo, features (text array), pricing, rating, review_count, featured (boolean), tier (free/premium/featured), affiliate_url, year_founded, headquarters, city, state, service_area (local/national), created_at, updated_at
- 314 vendors imported from Outscraper CSV data
- State values are full names (e.g., "Arizona" not "AZ") — standardized via 05-fix-state-names.sql
- Management-software category vendors are marked service_area = "national", others = "local"
- No vendors are currently marked as featured or premium — all default to featured=false, tier='free'

**submissions:**
- company_name, website, category_slug, contact_email, phone, description, status (pending/approved/rejected)
- RLS with public INSERT policy

**claims:**
- vendor_slug, vendor_name, contact_name, contact_email, contact_phone, job_title, message, status (pending/contacted/verified/rejected)
- RLS with public INSERT policy

**contact_messages:**
- name, email, subject, message, submitted_at
- RLS with public INSERT policy

### Important DB Notes
- RLS (Row Level Security) is enabled on all tables with public INSERT policies for form submissions
- The `update_vendor_count()` trigger fires AFTER INSERT/UPDATE/DELETE on vendors to auto-recalculate category vendor_count
- Supabase uses the anon public key (safe to expose client-side)

---

## Key Design Decisions & Gotchas

1. **GA4 uses raw script tags**, NOT Next.js `<Script>` component — because Google Search Console verification requires the GA script in `<head>`, and Next.js Script with `strategy="afterInteractive"` puts it in `<body>`

2. **TypeScript: Use `Array.from(new Set(...))` not `[...new Set(...)]`** — the spread syntax causes "can only be iterated through with --downlevelIteration" error on Vercel builds

3. **ISR with `export const revalidate = 60`** on all data-driven pages — without this, Vercel caches pages indefinitely and database changes don't appear

4. **Submit form uses `type="text"` not `type="url"`** for the website field, with manual `https://` prepend in the submit handler

5. **Snake_case database columns** (category_slug, short_description, review_count, etc.)

6. **Single category per vendor** — each vendor has one `category_slug`. Multi-category support would require a junction table (not implemented)

7. **All section padding is standardized** to `py-12 sm:py-14 md:py-16` across homepage components

8. **PowerShell on Windows** — user runs PowerShell, so use `;` not `&&` to chain git commands

---

## What Has Been Completed
- Full Next.js 14 site with Supabase backend
- 314 vendors imported from Outscraper scraping
- Search with filtering by category, service area, state, city (cascading)
- Submit vendor form → Supabase
- Contact form → Supabase
- Claim listing form → Supabase
- Google Analytics 4 integration
- Google Search Console verified
- JSON-LD structured data on vendor and category pages
- Auto-updating vendor counts via database trigger
- Category visibility toggle (visible column in Supabase)
- Logo in header, favicon setup
- Email forwarding: info@ and support@ → brfulm@gmail.com via Namecheap
- Homepage cleanup (removed duplicate sections, tightened spacing)

---

## Known Issues & Incomplete Items

1. **Favicon** — User was told to save as `src/app/icon.png` for Next.js auto-detection but may still have it at `public/favicon.png`. Verify placement.

2. **Homepage JSON-LD was removed** — The generateHomeJsonLd import was added to page.tsx but got reverted (linter/user modification). May need re-adding.

3. **Newsletter signup is not wired to anything** — just shows a success message, doesn't save emails anywhere

4. **Footer links to non-existent pages** — Blog (/blog), Guides (/guides), FAQ (/faq), Privacy Policy (/privacy), Terms of Service (/terms) all likely 404

5. **No vendors marked as featured** — FeaturedVendors section returns null because no vendors have `featured = true`. Need to manually set some in Supabase.

6. **Empty categories** — Cleaning & Maintenance, Signage & Lighting, Moving & Packing Supplies, Consulting & Brokerage, Marketing & Web, Payment Processing have 0-1 vendors. Currently hidden via `visible = false` but need more vendors.

7. **Copyright year** in footer says 2024, should be updated

8. **Phone number** in footer (1-800-STORAGE) may be placeholder

---

## Planned Next Steps

1. **Scrape more vendors** — Month 2 Outscraper queries ready in `Month2-Outscraper-Queries.md` (~500 more vendors across 16 queries). Remember to normalize state abbreviations to full names in the Python transformation script.

2. **Monetization setup:**
   - Premium listings: Use existing `tier` and `featured` fields. Premium vendors sort to top of category pages with visual badge. Featured vendors appear on homepage.
   - Affiliate marketing: Populate `affiliate_url` field for vendors with referral programs. Use `affiliate_url || website` for outbound links with `rel="sponsored noopener"`.
   - Display ads: Hold off until 1,000+ monthly visitors.

3. **Content & SEO:** Add unique editorial intros to category pages. Start a blog. Add meta descriptions to all pages. Verify sitemap includes all vendor/category URLs.

4. **Fix broken pages:** Create or remove links to /blog, /guides, /faq, /privacy, /terms

5. **Wire up newsletter** to actually save subscriber emails (Supabase table or email service)

6. **Mark 3-6 vendors as featured** in Supabase to populate the homepage Featured Vendors section

---

## File Paths Quick Reference

```
Project root (in user's git repo):
├── .env.local                          # Supabase credentials (DO NOT COMMIT)
├── next.config.mjs
├── 01-schema.sql through 08-*.sql      # DB migration files (reference only)
├── public/
│   └── logo.png                        # Site logo
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout + GA4
│   │   ├── page.tsx                    # Homepage
│   │   ├── globals.css
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── icon.png                    # Favicon (if correctly placed)
│   │   ├── about/page.tsx
│   │   ├── category/[slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── search/page.tsx
│   │   ├── submit/page.tsx
│   │   └── vendor/[slug]/page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── FeaturedVendors.tsx
│   │   ├── VendorCard.tsx
│   │   ├── CTASection.tsx
│   │   ├── NewsletterSignup.tsx
│   │   ├── ClaimListing.tsx
│   │   ├── SearchBar.tsx
│   │   └── StarRating.tsx
│   └── lib/
│       ├── supabase.ts                 # Client + types + data functions
│       └── seo.ts                      # JSON-LD generators
```
