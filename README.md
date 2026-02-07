# Point2PV — Business Plan & Technical Roadmap

**Tagline:** Smart rentals. Real data.

**Vision:** Become the leading residential rental platform in Puerto Vallarta, with planned expansion to key Mexican tourist destinations (Nayarit, Los Cabos, Tulum).

**Mission:** Provide property owners and agents with a modern, transparent, and efficient tool to list, promote, and rent properties, while offering renters a superior search experience with real-time market data.

---

## Table of Contents

1. [Market Context](#market-context)
2. [Business Model](#business-model)
3. [Technical Architecture](#technical-architecture)
4. [Product Roadmap](#product-roadmap)
5. [Brand Strategy](#brand-strategy)
6. [Financial Projection](#financial-projection)
7. [Go-to-Market Strategy](#go-to-market-strategy)
8. [Geographic Expansion](#geographic-expansion)
9. [Trust & Safety System](#trust-and-safety-system)

---

## Market Context

### Opportunity

**Point2Homes exited Mexico in May 2024**, leaving a vacuum in the modern real estate listing platform market. Local competition (Vivanuncios, Inmuebles24) has outdated UX and limited technical innovation.

**Puerto Vallarta specifically:**
- ~350K population + metropolitan area
- High flow of expatriates (US/Canada) seeking long-term rentals
- Fragmented vacation rental market (Airbnb, VRBO, local agents)
- Growing demand from post-pandemic digital nomads
- Lack of transparent market pricing data
- **Critical pain point:** High incidence of rental fraud (fake listings, deposit scams, non-existent properties)

### Direct Competition

| Platform | Strengths | Weaknesses |
|----------|-----------|------------|
| Vivanuncios | High traffic, broad inventory | Outdated UI, poor moderation, invasive ads |
| Inmuebles24 | Regional presence | Weak freemium model, little innovation |
| Airbnb/VRBO | Short-term dominance | Don't serve long-term rentals, high fees (14-17%) |
| Local agents | Market knowledge | No centralized platform, manual processes, trust issues |

### Competitive Advantage

**Point2PV** differentiates through:

1. **Tech-first**: Modern stack (Next.js + Supabase) enables features competitors can't replicate quickly
2. **Bilingual native**: Seamless experience in English and Spanish
3. **Data transparency**: Real-time market analytics (price/m², days on market, occupancy rates)
4. **Fair pricing model**: Predictable subscription vs. hidden commissions
5. **Trust & Safety**: First platform in Mexico with serious property ownership verification
6. **Mobile-first**: True responsive design, not forced adaptation

---

## Business Model

### Revenue Streams

#### 1. SaaS Subscriptions (Primary)

| Plan | Price | Limits | Target |
|------|-------|--------|--------|
| **Basic** | Free | 1 active property, 10 photos/property | Casual owner, validation |
| **Premium** | $49 USD/mo | 10 active properties, 10 photos/property, featured listings, basic analytics, verified badge | Individual agent (3-10 properties) |
| **Elite** | $99 USD/mo | 50 active properties, 10 photos/property, all Premium + priority support, market reports | Brokerage/Property Manager (10+) |

**Pricing justification:**
- **Competitive vs. Airbnb**: Airbnb charges 3% host + 14% guest = ~17% total. For $1,500/mo rent, that's $255. Premium at $49/mo = saving $206/month.
- **Premium vs. pain point**: Agent with 5 properties invoices ~$10K/mo in commissions. $49 is 0.5% of revenue, negligible.
- **Elite justified**: Virtual tours cost $150-300 if outsourced. Including at $99/mo = ROI in 1 month.

**Key changes from original model:**
- ✅ **Property limits enforced across all tiers** (1 / 10 / 50) — not "unlimited"
- ✅ **Standardized photos: 10 per property** across ALL plans
- ❌ **Removed: Virtual tours** from Elite tier (offered as add-on service instead)
- ❌ **Removed: API access** (not a differentiator for current target market)

**Rationale:**
- Property count is the #1 differentiator in real estate SaaS
- Standardized photo limit simplifies UX and reduces management complexity
- Virtual tours require subcontracting photographers — better as optional service

#### 2. Featured Listings (Secondary)

- $25 USD/mo per featured property in search results
- Geographic targeting (e.g., only Conchas Chinas zone)
- Estimated: 20% of Premium users use this = $10/user additional revenue

#### 3. Add-On Services (Phase 2)

**Verification Services:**
- **Property Verification Tier 3**: $50 USD (personal call verification + documentation review)
- **Background check tenants**: $15 USD
- **Contract generation**: $50 USD

**Virtual Tours (Outsourced):**
- $150 USD/property (Point2PV coordinates with local photographer, charges coordination fee)

**Property Management Referrals:**
- 10% revenue share with PM companies

#### 4. Data Products (Phase 3, Data Moat)

- Monthly market reports: $50 USD
- Pricing data API: $500 USD/mo (for developers/PMs)
- Comparative Market Analysis (CMA): $25 USD/report

---

### Financial Projection Year 1

#### Monthly Operating Expenses

**Infrastructure:**
- Vercel Pro: $20
- Supabase Pro: $25
- Cloudinary: $50
- Google Maps API: $100
- Stripe fees: variable (2.9% + $0.30)
- Domain + SSL: $5
- **Subtotal: ~$200/mo**

**Marketing:**
- Google Ads (local): $500/mo
- Meta Ads (expats): $300/mo
- SEO content: $400/mo
- **Subtotal: $1,200/mo**

**Operations:**
- VA for verification/support: $600/mo
- Legal/accounting: $200/mo
- **Subtotal: $800/mo**

**Total monthly: $2,200 USD**

#### Revenue Projection (Conservative)

**Q1 (Months 1-3): Validation**
- 5 Premium: $245/mo
- 1 Elite: $99/mo
- MRR: $344

**Q2 (Months 4-6): Traction**
- 15 Premium: $735/mo
- 3 Elite: $297/mo
- MRR: $1,032

**Q3-Q4 (Months 7-12): Agents enter**
- 40 Premium: $1,960/mo
- 8 Elite: $792/mo
- 5 Featured listings: $125/mo
- MRR: $2,877

**Break-even: Month 5**
**Net profit Year 1: ~$18,000 USD**
**ARR: $34,524**

---

## Technical Architecture

### Technology Stack

```
Frontend:    Next.js 14+ (App Router)
Backend:     Next.js API Routes + Supabase Functions
Database:    PostgreSQL (Supabase)
Auth:        Supabase Auth
Storage:     Supabase Storage (photos/videos)
Payments:    Stripe Billing
Hosting:     Vercel
CDN:         Cloudinary (image optimization)
Analytics:   Vercel Analytics + Supabase Realtime
Search:      PostgreSQL Full-Text Search (tsvector)
Maps:        Google Maps JavaScript API
```

### Core Database Schemas

**agents**
- `id` (UUID, PK, = auth.users.id)
- `full_name` (text)
- `email` (text, unique)
- `phone` (text)
- `bio` (text)
- `photo_url` (text)
- `verification_status` (enum: unverified, tier1, tier2, tier3)
- `created_at` (timestamptz)

**subscriptions**
- `id` (UUID, PK)
- `agent_id` (UUID, FK → agents)
- `stripe_customer_id` (text, unique)
- `stripe_subscription_id` (text, unique)
- `plan_tier` (enum: free, premium, elite)
- `status` (enum: active, canceled, past_due, trialing)
- `current_period_start/end` (timestamptz)
- `cancel_at_period_end` (boolean)

**plan_limits**
- `plan_tier` (enum, PK)
- `max_properties` (int: 1, 10, 50)
- `max_photos_per_property` (int: 10 across all tiers)
- `can_feature_listings` (bool)
- `can_use_analytics` (bool)
- `monthly_price_usd_cents` (int)

**properties**
- `id` (UUID, PK)
- `agent_id` (UUID, FK → agents)
- `slug` (text, unique, SEO-friendly)
- `status` (enum: draft, published, archived)
- `title` (text)
- `description` (text)
- `neighborhood` (text)
- `address` (text)
- `latitude/longitude` (decimal, for maps)
- `bedrooms/bathrooms` (int)
- `square_meters` (int)
- `max_guests` (int)
- `furnished` (bool)
- `pets_allowed` (bool)
- `available_from/to` (date)
- `price_amount` (decimal)
- `price_unit` (enum: monthly, nightly)
- `price_monthly` (decimal, normalized)
- `photo_url` (text, thumbnail)
- `search_vector` (tsvector, full-text search)
- `created_at/updated_at` (timestamptz)

**property_photos**
- `id` (UUID, PK)
- `property_id` (UUID, FK → properties)
- `photo_url` (text)
- `storage_path` (text)
- `display_order` (int)
- `created_at` (timestamptz)

**property_reviews** (NEW)
- `id` (UUID, PK)
- `property_id` (UUID, FK → properties)
- `reviewer_id` (UUID, FK → users)
- `rating` (int, 1-5)
- `comment` (text)
- `verification_proof` (text, path to uploaded contract/receipt)
- `verified` (boolean, manually approved initially)
- `flags` (jsonb: {deposit_not_returned, photos_mismatch, etc.})
- `created_at` (timestamptz)

**verification_documents** (NEW)
- `id` (UUID, PK)
- `agent_id` (UUID, FK → agents)
- `document_type` (enum: id_card, selfie_with_id, property_deed, tax_receipt, rental_contract)
- `file_path` (text)
- `verification_tier` (enum: tier1, tier2, tier3)
- `status` (enum: pending, approved, rejected)
- `reviewed_by` (UUID, nullable, FK → admin users)
- `reviewed_at` (timestamptz)
- `created_at` (timestamptz)

### Security (RLS)

**Row Level Security Policies:**

```sql
-- agents: only can view/edit own profile
CREATE POLICY "Users can view own profile"
  ON agents FOR SELECT
  USING (auth.uid() = id);

-- properties: agents only see their properties in dashboard
CREATE POLICY "Agents can view own properties"
  ON properties FOR SELECT
  USING (auth.uid() = agent_id);

-- properties: public only sees published
CREATE POLICY "Public can view published properties"
  ON properties FOR SELECT
  USING (status = 'published');

-- property_reviews: only verified renters can create
CREATE POLICY "Verified users can create reviews"
  ON property_reviews FOR INSERT
  WITH CHECK (verified = false); -- admin approval required

-- property_reviews: public can read approved reviews
CREATE POLICY "Public can view verified reviews"
  ON property_reviews FOR SELECT
  USING (verified = true);

-- verification_documents: only owner can view
CREATE POLICY "Agents can view own documents"
  ON verification_documents FOR SELECT
  USING (auth.uid() = agent_id);

-- property_photos: upload only in own folder
CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND 
              (storage.foldername(name))[1] = auth.uid()::text);

-- property_photos: public read
CREATE POLICY "Public can view property photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');
```

---

## Product Roadmap

### MVP Status (50% complete)

✅ **Implemented:**
- Authentication (Supabase Auth)
- CRUD properties (private dashboard)
- Photo system with display_order
- Public page by slug
- RLS on Storage
- Multi-tenant by agent_id

❌ **Missing for monetization:**
- Stripe Billing integration
- Plan limit enforcement
- Status workflow (draft/published/archived)
- Search + functional filters
- Lead capture system
- Analytics dashboard
- Pagination
- Email notifications
- Review system
- Verification system

---

### Phase 1: Monetization Core (Weeks 1-3)

**Objective:** Enable payment collection and deliver differentiated value

**Sprint 1.1 — Stripe Billing (Week 1)**
- [ ] Create products in Stripe Dashboard (Premium $49, Elite $99)
- [ ] Migrations: `subscriptions`, `plan_limits`
- [ ] API Routes:
  - `POST /api/stripe/checkout` (create session)
  - `POST /api/stripe/webhook` (handle events)
  - `POST /api/stripe/portal` (customer portal)
- [ ] Page `/pricing` with interactive cards
- [ ] Page `/dashboard/billing` with current status

**Sprint 1.2 — Limit Enforcement (Week 1-2)**
- [ ] Helpers: `getAgentLimits()`, `canCreateProperty()`, `canAddPhoto()`
- [ ] Guard at `/dashboard/properties/new` (blocks if limit reached)
- [ ] Guard in create property action/route (backend validation)
- [ ] Guard in photo upload (backend validation)
- [ ] UI: show "X/Y properties used" with CTA to upgrade
- [ ] UI: disable "New Property" button if limit reached

**Sprint 1.3 — Status Workflow (Week 2)**
- [ ] Migration: `ALTER TABLE properties` with enum status
- [ ] RLS: only `published` visible publicly
- [ ] UI: toggle Publish/Unpublish in dashboard
- [ ] Validation: can't publish without title, price, at least one photo
- [ ] Visual badge: Draft (gray), Published (green), Archived (red)

**Phase 1 Success Criteria:**
- Can create free account
- Can subscribe to Premium/Elite via Stripe
- Limits effectively enforced
- Draft properties don't appear in public search

---

### Phase 2: Conversion & Capture (Weeks 3-4)

**Objective:** Capture leads and convert visitors into paying customers

**Sprint 2.1 — Lead Capture (Week 3)**
- [ ] Migration: table `property_inquiries`
- [ ] Server Action: `submitInquiry()`
- [ ] Component: `<ContactForm>` on public property page
- [ ] Dashboard: `/dashboard/inquiries` (list of received leads)
- [ ] Email notification: send to agent when receiving inquiry
- [ ] Tracking: source field (contact_form, whatsapp_click, phone_click)

**Sprint 2.2 — Pricing Page + Onboarding (Week 3)**
- [ ] Public `/pricing` page with plan comparison
- [ ] Highlight recommended plan (Premium)
- [ ] FAQ section (answer common objections)
- [ ] Testimonials (when available)
- [ ] CTA: "Start free" → `/signup`
- [ ] Post-signup: redirect to `/dashboard/properties/new` with tooltip

**Sprint 2.3 — Basic Analytics (Week 4)**
- [ ] Dashboard widget: views per property (Supabase Realtime + custom events)
- [ ] Dashboard widget: inquiries per month (chart)
- [ ] Dashboard widget: price comparison vs. market (neighborhood median)
- [ ] Restriction: only visible in Premium/Elite

**Phase 2 Success Criteria:**
- Lead capture works end-to-end
- Email notifications arrive
- Pricing page converts >5% of visitors to signup
- Analytics dashboard shows real data

---

### Phase 3: Search & Discoverability (Weeks 4-5)

**Objective:** Make inventory discoverable and useful for renters

**Sprint 3.1 — Full-Text Search (Week 4)**
- [ ] Migration: add `search_vector` column (tsvector generated)
- [ ] GIN index on `search_vector`
- [ ] API Route: `GET /api/search?q=...`
- [ ] UI: search bar on homepage
- [ ] Term highlighting in results
- [ ] Pagination (20 results per page)

**Sprint 3.2 — Basic Filters (Week 5)**
- [ ] Indexes on: `price_monthly`, `bedrooms`, `neighborhood`, `furnished`, `pets_allowed`
- [ ] UI: filter sidebar with:
  - Price range (slider)
  - # bedrooms (radio buttons)
  - Neighborhood (dropdown, dynamically loaded)
  - Furnished (checkbox)
  - Pets allowed (checkbox)
- [ ] Query builder: combine filters + search
- [ ] URL persistence: `?q=...&minPrice=...&bedrooms=...`
- [ ] Clear filters button

**Sprint 3.3 — Sorting (Week 5)**
- [ ] Options: Newest, Price (low-high), Price (high-low), Relevance
- [ ] Default: Relevance if query exists, Newest if not

**Phase 3 Success Criteria:**
- Search finds relevant properties
- Filters correctly reduce results
- Performance <500ms on search with 1000+ properties
- Intuitive UX (no confusion)

---

### Phase 4: Trust & Safety (Week 6-7)

**Objective:** Establish Point2PV as the most trustworthy rental platform in Mexico

**Sprint 4.1 — Verification System**
- [ ] Migration: `verification_documents` table
- [ ] Upload flow for Tier 1 (ID + selfie) — MANDATORY for all users
- [ ] Upload flow for Tier 2 (property documents) — OPTIONAL, highly incentivized
- [ ] Admin dashboard: `/admin/verifications` to review documents
- [ ] Automated email: "Your verification is pending review"
- [ ] Badge system: "ID Verified", "Property Verified", "Point2PV Verified"

**Verification Tiers:**

**Tier 1: Basic Verification (Required for all)**
- Upload government ID (INE/passport)
- Selfie holding ID
- Email + phone confirmation
- **Result:** "ID Verified" badge

**Tier 2: Property Verification (Optional, recommended)**
- Everything in Tier 1 +
- Property deed (first 5 pages) OR tax receipt (predial) OR rental contract (if subleasing legally)
- **Result:** "Property Verified" badge + 30% boost in search ranking

**Tier 3: Premium Verification (Add-on service $50)**
- Everything in Tier 2 +
- Personal verification call with Point2PV team
- Identity verification via video call
- Property existence check (Google Street View or in-person visit if PV)
- **Result:** "Point2PV Verified" badge + top search placement

**Sprint 4.2 — Review System**
- [ ] Migration: `property_reviews` table
- [ ] Review submission form (only logged-in users)
- [ ] Upload proof of rental (contract/receipt) — required for verification
- [ ] Admin moderation queue: `/admin/reviews`
- [ ] Public display of verified reviews on property page
- [ ] Flag system: "Deposit not returned", "Photos don't match", "Property doesn't exist"
- [ ] Agent response feature: allow property owners to respond to reviews

**Review Rules:**
- Only users who can prove they rented can leave reviews
- First 6 months: manual approval of all reviews
- After: automated with flag system for suspicious reviews
- Properties with 3+ verified reviews: "Reviewed by Renters" badge + ranking boost

**Phase 4 Success Criteria:**
- 80% of new signups complete Tier 1 verification
- 30% of Premium users complete Tier 2 verification
- Zero fraudulent listings make it past verification
- Review system active with first 10 verified reviews

---

### Phase 5: Polish & Optimization (Weeks 8-10)

**Sprint 5.1 — SEO**
- [ ] Dynamic metadata per page (title, description, og:image)
- [ ] Automatically generated sitemap.xml
- [ ] Optimized robots.txt
- [ ] Schema.org markup (Product, RealEstateAgent)
- [ ] Canonical URLs
- [ ] Blog: 5 initial posts ("Long-term rental guide PV", "Best neighborhoods", etc.)

**Sprint 5.2 — Performance**
- [ ] Image optimization: Cloudinary auto-transform
- [ ] Lazy loading of photos
- [ ] Infinite scroll on listings (vs. pagination)
- [ ] Caching: revalidate static pages every 1hr
- [ ] Database query optimization (explain analyze)

**Sprint 5.3 — Mobile UX**
- [ ] Touch-friendly filters (drawer on mobile)
- [ ] Swipeable photo galleries
- [ ] Click-to-call / click-to-WhatsApp buttons
- [ ] Bottom sheet for contact form
- [ ] PWA manifest (installable)

**Phase 5 Success Criteria:**
- Lighthouse score >90 in all aspects
- Load time <2s on 3G
- SEO: appear in top 10 for "rentas puerto vallarta"

---

## Brand Strategy

### Naming System: Point2[Destination]

**Launch brand:** **Point2PV** (Puerto Vallarta)

**Future expansion:**
- Point2Nayarit
- Point2LosCabos
- Point2Tulum
- Point2PlayaDelCarmen
- Point2Cancun

**Logic:**
- "Point2" = "point to", "head to" (semantically powerful)
- SEO: "Point2PV rentals" has zero competition
- Scalable: same logo, only changes destination text
- Inspired by Vallarta Adventures → Cabo Adventures model

---

### Visual Identity

**Color palette:**

```css
/* Primary */
--navy:        #001F3F  /* Professional, trustworthy, oceanic */
--sunset:      #FF6B35  /* Energy, vacation, tropical */

/* Neutrals */
--white:       #FFFFFF
--background:  #FAFAFA
--text:        #1F2937
--text-muted:  #6B7280
--border:      #E5E7EB
```

**Typography:**
- Display: Montserrat Bold (modern, geometric)
- Body: Inter (readability, professional)

**Logo concept:**

```
┌────────────────────────┐
│   Point2               │  ← Navy, Montserrat Bold 24px
│      PV                │  ← Sunset Orange, Montserrat Regular 20px
│   [location pin]       │  ← Minimalist pin with palapa roof
└────────────────────────┘
```

**Tagline:** "Smart rentals. Real data."

**Color application by destination:**

| Destination | Primary | Accent |
|-------------|---------|--------|
| Point2PV | Navy #001F3F | Sunset Orange #FF6B35 |
| Point2Nayarit | Navy #001F3F | Coral #FF7F50 |
| Point2LosCabos | Navy #001F3F | Desert Gold #D4A574 |
| Point2Tulum | Navy #001F3F | Jungle Green #2D5F3F |

**Logic:** Navy unifies brand. Accent color localizes destination.

---

### Key Differentiators (Messaging)

1. **"Real-time market analytics"**
   - Average price per m² updated daily
   - Average days on market
   - Automatic comparison vs. similar properties

2. **"Bilingual from DNA"**
   - Not automatic translation
   - Content created natively in English and Spanish
   - Support in both languages

3. **"Total pricing transparency"**
   - No surprises
   - Fixed subscription, no hidden commissions
   - Visible cost breakdown (rent + utilities + fees)

4. **"Verified properties, verified peace of mind"**
   - First platform in Mexico with serious ownership verification
   - Three-tier verification system
   - Review system by verified renters

5. **"Technology that works"**
   - Mobile-first (not "responsive as afterthought")
   - Intelligent search
   - Real-time notifications

---

## Go-to-Market Strategy

### Pre-Launch (4 weeks before)

**Week -4 to -3: Landing Page + Waitlist**
- Simple landing page with:
  - Hero: "The first modern rental platform in Puerto Vallarta"
  - 3 value props with icons
  - Email capture: "Be among the first to list for free"
  - Secondary CTA: "Are you an agent? Schedule demo"
- Initial traffic:
  - Posts in Facebook expat groups (PV Talk, PV Expats, 30K+ members)
  - LinkedIn outreach to PV brokers
  - Hyperlocal Google Ads ($10/day): "Rent your Vallarta house"
- **Goal: 100 emails on waitlist**

**Week -2 to -1: Seed Properties**
- Direct outreach to:
  - 3 Coldwell Banker colleagues with rentals
  - 5 direct owners (FB groups "casa en renta Vallarta")
  - 2 small property managers
- Offer:
  - Free listing for 6 months
  - Guaranteed featured placement
  - Direct feedback on product development
- **Goal: 10 properties listed before public launch**

---

### Public Launch (Month 1)

**Week 1: Soft Launch**
- Email to waitlist: "We're live now 🎉"
- Press release to local media:
  - Vallarta Daily News
  - Vallarta Tribune
  - PV Mirror
- Partnership with 1-2 local influencers (property tours + promo)
- Aggressive ads ($1,500 budget):
  - Google Ads: "rentas puerto vallarta", "apartments PV"
  - Meta Ads: target expats 30-55 years, interest in "real estate investing"

**Week 2-4: Iteration + Feedback Loop**
- Daily standup with early adopters
- Fix critical bugs in <24hr
- Add quick features they request (e.g., WhatsApp button)
- Publish case study: "How [Agent X] rented 3 properties in 2 weeks with Point2PV"

**Month 1 Goals:**
- 50 active properties
- 500 registered users
- 10 paid subscriptions ($500 MRR)
- Appear on Google first page for "rentas vallarta"

---

### Months 2-6: Growth Loop

**Content Marketing:**
- 2 blog posts/week about:
  - Neighborhood guides ("Zona Romántica vs. Versalles: where to live")
  - Rental tips ("Checklist before signing contract")
  - Data reports ("Rental market state Q1 2025")
- Guest posts on expat blogs
- YouTube: featured property tours

**Partnerships:**
- Cross-promo with:
  - Moving services
  - Furniture stores
  - Utilities setup (CFE, Telmex)
  - Condo administrators
- Revenue share: 10% of referrals

**Community Building:**
- Private Facebook group for property owners
- Monthly webinar: "Office hours with Point2PV"
- Weekly property spotlight on Instagram

**Month 6 Goals:**
- 200 active properties
- 30 paid subscriptions ($1,500 MRR)
- Operational break-even

---

## Geographic Expansion

### Expansion Criteria

**Only expand when Point2PV reaches:**
- ✅ 200+ active properties
- ✅ 30+ paid subscriptions
- ✅ $5K+ MRR
- ✅ 80% of automated processes (doesn't require full-time attention)
- ✅ NPS >50

**3x Rule:** New destination can't consume >33% of resources (time/money).

---

### Expansion Sequence

**Destination 2: Point2Nayarit (Months 12-18)**
- **Rationale:** Geographic adjacency (can serve personally), similar market
- **Strategy:** Same playbook, same technical instance (filter by region), local marketing
- **Investment:** $2K in local ads
- **Goal:** 100 properties in 6 months, $2K additional MRR

**Destination 3: Point2LosCabos (Months 18-24)**
- **Rationale:** Larger market than PV, similar demographics
- **Strategy:** Requires hiring local community manager (part-time)
- **Investment:** $5K (marketing + first month CM salary)
- **Goal:** 200 properties in 6 months, $5K additional MRR

**Destination 4: Point2Tulum (Months 24-36)**
- **Rationale:** Premium market, high foreign investment
- **Strategy:** Partnership with established local broker (20% revenue share)
- **Investment:** $10K (marketing + tech customization)
- **Goal:** 150 properties in 6 months, $4K additional MRR

**Year 3 ARR projection (4 destinations):** $180K

---

### Multi-Destination Risk Mitigation

**Risk: Focus dilution**
- Mitigation: Don't expand until dominating current market (criteria above)

**Risk: Operational complexity**
- Mitigation: Documented playbook + local hiring before launch

**Risk: Capital intensive**
- Mitigation: Finance expansion with revenue from previous destination (bootstrapped)

**Risk: Brand inconsistency**
- Mitigation: Strict brand guidelines + QA checklist pre-launch

**Risk: Legal/regulations**
- Mitigation: Lawyer review of terms per destination + liability disclaimer

---

## Trust & Safety System

### Why This Matters

**Mexico rental market has HIGH fraud incidence:**
- Fake listings (property doesn't exist)
- Deposit scams (collect deposit, disappear)
- Misrepresentation (photos don't match reality)
- Non-refunded deposits (legitimate property but dishonest landlord)

**Point2PV's opportunity:** Be the **first platform** to seriously verify ownership = MASSIVE differentiator

---

### Three-Tier Verification System

#### Tier 1: Basic Verification (REQUIRED for all users)

**Process:**
1. Upload government ID (INE/passport)
2. Take selfie holding ID
3. Confirm email + phone number

**Backend validation:**
- ID photo quality check
- Face matching (selfie vs. ID photo)
- Phone number verification via SMS code

**Result:**
- "ID Verified" badge on profile
- Can list properties
- Appears in search results

**Timeline:** Automated, ~5 minutes

---

#### Tier 2: Property Verification (OPTIONAL, highly incentivized)

**Process:**
1. Everything in Tier 1 +
2. Upload ONE of:
   - Property deed (escritura) — first 5 pages showing owner name
   - Tax receipt (predial) — current year
   - Rental contract — if legally subleasing

**Backend validation:**
- Document quality check
- Name matching (document vs. user profile)
- Manual review (first 6 months)

**Result:**
- "Property Verified" badge on listing
- 30% boost in search ranking
- Higher conversion rate (renters trust verified listings)

**Timeline:** 24-48hr manual review

**Incentive for users:**
- Free for Premium/Elite subscribers
- $25 for Basic users (creates upgrade pressure)

---

#### Tier 3: Premium Verification (ADD-ON SERVICE $50)

**Process:**
1. Everything in Tier 2 +
2. Personal verification call with Point2PV team (you or VA)
3. Video call identity verification
4. Property existence check:
   - Google Street View verification
   - In-person visit (if PV area)
   - Request photo of property with today's newspaper (if remote)

**Backend validation:**
- Call notes recorded
- Property photos cross-referenced with listing
- Manual approval by founder

**Result:**
- "Point2PV Verified" badge (highest trust level)
- Top placement in search results
- Featured in "Verified Properties" section on homepage
- Priority customer support

**Timeline:** 3-5 days (scheduled call + review)

**Incentive for users:**
- Renters specifically filter for "Point2PV Verified"
- Higher rental price achievable (trust premium)
- Faster booking rate

---

### Review System Architecture

#### Who Can Review

**Only verified renters:**
- Must prove they rented the property
- Upload ONE of:
  - Signed rental contract
  - Receipt of rent payment
  - Bank transfer confirmation

**Verification process:**
1. User submits review + proof document
2. Document goes to moderation queue
3. Admin approves/rejects (first 6 months manual)
4. Approved reviews display publicly

---

#### Review Structure

**Rating:** 1-5 stars

**Categories:**
- Accuracy (listing vs. reality)
- Communication (landlord responsiveness)
- Cleanliness
- Location
- Value for money

**Written review:** Required, minimum 50 characters

**Flags (checkboxes):**
- ☑️ Deposit not returned
- ☑️ Photos don't match reality
- ☑️ Hidden fees charged
- ☑️ Property condition issues
- ☑️ Landlord unresponsive

**Photos:** Optional (renters can upload proof photos)

---

#### Property Owner Response

- Owners can respond to reviews (appears below review)
- Must remain professional (moderation for abusive responses)
- Can upload counter-evidence (e.g., signed damage report)

---

#### Review Incentives

**For renters:**
- Public reputation (review count visible on profile)
- Early access to new listings (reviewers get 24hr priority)

**For properties:**
- "Reviewed by Renters" badge after 3+ verified reviews
- Search ranking boost
- Higher click-through rate (social proof)

---

### Fraud Prevention Measures

**Automated detection:**
- Duplicate listings (same photos, different addresses)
- Suspiciously low prices (>40% below neighborhood average)
- Multiple accounts from same IP

**Manual review triggers:**
- First-time user with expensive property (>$3K/mo)
- Property in high-fraud zone
- User uploads low-quality verification documents

**User reporting:**
- "Report listing" button on every property
- Reasons: Fraud, Duplicate, Inappropriate photos, Wrong location
- 3+ reports = automatic delisting pending review

---

### Comparison: Point2PV vs. Competitors

| Feature | Point2PV | Airbnb | VRBO | Vivanuncios |
|---------|----------|--------|------|-------------|
| ID verification | ✅ Required | ✅ Required | ⚠️ Optional | ❌ None |
| Property ownership verification | ✅ 3-tier system | ❌ None | ❌ None | ❌ None |
| Verified renter reviews | ✅ Proof required | ⚠️ Only if booked | ⚠️ Only if booked | ❌ Anyone can review |
| Fraud protection | ✅ Multi-layer | ⚠️ Payment escrow only | ⚠️ Payment escrow only | ❌ None |
| Local presence | ✅ PV-based team | ❌ Global support | ❌ Global support | ⚠️ Mexico but low touch |

---

## Success Metrics

### North Star Metric

**MRR (Monthly Recurring Revenue)**

Reason: reflects SaaS business health, predicts ARR, guides product decisions.

---

### KPIs by Phase

**Phase 1 (Months 1-6): Validation**
- Primary: MRR ($0 → $1,500)
- Secondary: # active properties (0 → 200)
- Tertiary: Signup → paid conversion rate (target: 10%)

**Phase 2 (Months 7-12): Growth**
- Primary: MRR ($1,500 → $5,000)
- Secondary: CAC (Cost to Acquire Customer) <$50
- Tertiary: Churn rate <5%/month

**Phase 3 (Months 13-24): Expansion**
- Primary: Multi-destination MRR ($5K → $15K)
- Secondary: NPS (Net Promoter Score) >50
- Tertiary: Organic traffic % (target: 40% of total)

---

### Metrics Dashboard (to build in Phase 2)

**Revenue:**
- MRR, ARR
- ARPU (Average Revenue Per User)
- LTV (Lifetime Value)
- LTV:CAC ratio (target: >3:1)

**Growth:**
- New signups/month
- Paid conversions/month
- Churn rate
- Reactivation rate

**Engagement:**
- Properties published/month
- Inquiries generated/month
- Avg. time to first inquiry
- Photos uploaded/month

**Trust & Safety:**
- % users completing Tier 1 verification
- % users completing Tier 2 verification
- # verified reviews submitted
- Fraud reports / total listings ratio (target: <1%)

**Marketing:**
- CAC by channel
- Organic vs. paid traffic
- Top landing pages
- Conversion funnel (view → signup → paid)

---

## Appendices

### A. Technologies Evaluated (and why not)

**Firebase vs. Supabase:**
- Chose Supabase: PostgreSQL > Firestore for complex queries, native RLS, predictable pricing.

**Prisma vs. Query Builder:**
- Chose Supabase Query Builder: less overhead, auto-generated types, integrated realtime.

**Tailwind vs. CSS-in-JS:**
- Chose Tailwind: development velocity, small bundle size, utility-first.

**Vercel vs. Railway/Render:**
- Chose Vercel: perfect Next.js integration, edge functions, included analytics.

---

### B. Contingencies

**What if we don't reach 10 subscriptions in Month 1?**
- Pivot: offer 1 free month of Premium to first 20 agents
- Intensify direct outreach (calls, not just ads)
- Temporarily reduce Premium price to $39/mo

**What if Stripe rejects our account?**
- Backup: PayPal Subscriptions (higher fees but functional)
- Long-term: incorporate in Delaware for better banking access

**What if a funded competitor appears?**
- Defense: execution speed + local knowledge + relationships in PV
- Offense: lock-in with data moat (analytics) and annual contracts with discount

---

### C. Exit Strategy (optional, for investors)

**Potential acquirers:**
- Zillow/Trulia (expanding to Mexico)
- Compass (international expansion)
- CoStar Group (commercial + residential)
- Large local brokerages (consolidation)

**Expected valuation Year 3:**
- $180K ARR × 5-8x SaaS multiple = $900K - $1.4M

**Exit trigger:**
- Offer >$1M
- Reach $20K MRR without clear path to $50K (plateau)
- Opportunity to join competitor as acqui-hire

## Contacto

**Founder:** Kali Tovar  
**Email:** kali.tovar@cblacosta.com 
**Location:** Puerto Vallarta, Jalisco, México  
**LinkedIn:** https://www.linkedin.com/in/kalitovar 

---

**Última actualización:** Febrero 2025  
**Versión:** 1.0  
**Status:** Pre-launch (Fase de desarrollo técnico)

---

## Licencia

Este documento es confidencial y propietario. No distribuir sin autorización.
