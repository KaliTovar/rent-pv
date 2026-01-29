# RentPV - Prioritized Task List

Based on the technical audit completed 2026-01-24.

---

## P0 - Critical (Completed)

- [x] **Input Validation** - Added Zod schemas for login, signup, property, image upload (`lib/validation/schemas.ts`)
- [x] **Validation Enforcement** - Applied validation at all UI mutation points:
  - `app/(auth)/login/page.tsx` - loginSchema
  - `app/(auth)/signup/page.tsx` - signupSchema
  - `app/dashboard/properties/new/PropertyForm.tsx` - propertySchema
  - `app/dashboard/properties/[id]/edit/PhotoManager.tsx` - imageUploadSchema
  - `app/dashboard/properties/[id]/edit/EditPropertyClient.tsx` - imageUploadSchema
- [x] **Middleware Security** - Switched from `getSession()` to `getUser()`, fixed cookie handling, excluded api routes from matcher
- [x] **Debug Logging** - Added `lib/logger.ts`, replaced all `console.*` with environment-aware logging
- [x] **Broken Navigation** - Fixed `/auth/login` → `/login` redirects in 4 dashboard pages
- [x] **RLS Documentation** - Created `docs/security/rls.md` with explicit table/policy mapping

**Important:** If API routes (`/api/*`) are added later, they MUST:
1. Import and use the same Zod schemas
2. Call `safeParse()` before any database mutations
3. Return proper error responses for validation failures

---

## P1 - High Priority (Next Sprint)

### Security

| Task | File(s) | Effort | Notes |
|------|---------|--------|-------|
| Add rate limiting to auth endpoints | `middleware.ts` or API routes | M | Prevent brute force attacks |
| Implement CSRF protection | Forms | S | Next.js handles most, verify tokens |
| Add Content Security Policy headers | `next.config.js` | S | Prevent XSS |
| Audit storage bucket policies | Supabase dashboard | S | Verify upload restrictions |

### Error Handling

| Task | File(s) | Effort | Notes |
|------|---------|--------|-------|
| Add error boundary component | `app/error.tsx` | S | Graceful error UI |
| Add not-found page | `app/not-found.tsx` | S | Better 404 experience |
| Improve API error responses | All components | M | Consistent error messages |
| Add loading states | Dashboard pages | S | Skeleton loaders |

### Type Safety

| Task | File(s) | Effort | Notes |
|------|---------|--------|-------|
| Remove `any` types | `PropertyForm.tsx` | S | Use proper types |
| Add database types from Supabase | `lib/database.types.ts` | M | `supabase gen types` |
| Type the agent/property responses | Dashboard pages | S | Replace inline types |

---

## P2 - Medium Priority (Sprint 2)

### Performance

| Task | File(s) | Effort | Notes |
|------|---------|--------|-------|
| Optimize image loading | `EditPropertyClient.tsx` | M | Add blur placeholders, lazy loading |
| Add pagination to properties list | `properties/page.tsx` | M | Avoid loading all properties |
| Implement caching strategy | Server components | M | Use React cache/unstable_cache |

### UX Improvements

| Task | File(s) | Effort | Notes |
|------|---------|--------|-------|
| Add form field validation UI | `PropertyForm.tsx` | S | Show field-level errors |
| Add success toast notifications | All mutation points | M | User feedback |
| Improve mobile responsiveness | Dashboard layout | M | Test on mobile |
| Add image compression on upload | `PhotoManager.tsx` | M | Reduce storage costs |

### Code Quality

| Task | File(s) | Effort | Notes |
|------|---------|--------|-------|
| Remove legacy `price_monthly` field | DB + forms | M | Migrate to `price_amount` only |
| Consolidate photo management | Merge `PhotoManager` + `EditPropertyClient` | M | DRY principle |
| Add unit tests | `lib/validation/schemas.ts` | S | Test Zod schemas |
| Add E2E tests | Playwright/Cypress | L | Critical flows |

---

## P3 - Low Priority (Backlog)

| Task | Effort | Notes |
|------|--------|-------|
| Add leads management page | L | `/dashboard/leads` |
| Add settings page | M | `/dashboard/settings` |
| Add public property listing page | L | SEO + public search |
| Implement subscription tiers | L | Feature gating |
| Add email notifications | M | Lead alerts |
| Add analytics dashboard | M | Views, leads stats |
| Multi-language support (i18n) | L | English/Spanish |

---

## Migration: Next.js Middleware → Proxy

Next.js 16 deprecated `middleware.ts` in favor of `proxy`. Plan migration:

1. Read: https://nextjs.org/docs/messages/middleware-to-proxy
2. Convert auth logic to new proxy pattern
3. Test thoroughly before deploy

**Effort:** M | **Priority:** P1 (will become required)

---

## Effort Key

- **S** = Small (< 2 hours)
- **M** = Medium (2-8 hours)
- **L** = Large (> 1 day)

---

## Progress Tracking

Update this file as tasks are completed. Move completed items to the "Completed" section with date.

### Completed

| Date | Task | PR |
|------|------|-----|
| 2026-01-24 | P0 Critical Fixes | Initial commit |
