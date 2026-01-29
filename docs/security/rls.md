# Row Level Security (RLS) Policies - RentPV

This document describes the Row Level Security policies implemented in the Supabase database for RentPV.

## Overview

RLS is **enabled** on all user-data tables: `agents`, `properties`, `property_photos`.

**Enforcement status:**
- `agents` - RLS enabled, policies active
- `properties` - RLS enabled, policies active
- `property_photos` - RLS enabled, policies active
- `leads` - RLS enabled (if table exists)

RLS ensures that authenticated users can only access data they own.

---

## Tables & Policies

### `agents`

| Policy Name | Operation | Definition |
|-------------|-----------|------------|
| `agents_select_own` | SELECT | `auth.uid() = id` |
| `agents_update_own` | UPDATE | `auth.uid() = id` |
| `agents_insert_own` | INSERT | `auth.uid() = id` |

**Notes:**
- Agents can only read/update their own profile
- Insert is typically done via trigger on auth.users creation

---

### `properties`

| Policy Name | Operation | Definition |
|-------------|-----------|------------|
| `properties_select_own` | SELECT | `auth.uid() = agent_id` |
| `properties_insert_own` | INSERT | `auth.uid() = agent_id` |
| `properties_update_own` | UPDATE | `auth.uid() = agent_id` |
| `properties_delete_own` | DELETE | `auth.uid() = agent_id` |
| `properties_select_public` | SELECT | `status = 'active'` (for public listing page, if applicable) |

**Notes:**
- Agents can only CRUD their own properties
- Public users may view active properties (if public listing is enabled)

---

### `property_photos`

| Policy Name | Operation | Definition |
|-------------|-----------|------------|
| `photos_select_own` | SELECT | `EXISTS (SELECT 1 FROM properties WHERE properties.id = property_photos.property_id AND properties.agent_id = auth.uid())` |
| `photos_insert_own` | INSERT | `EXISTS (SELECT 1 FROM properties WHERE properties.id = property_photos.property_id AND properties.agent_id = auth.uid())` |
| `photos_update_own` | UPDATE | `EXISTS (SELECT 1 FROM properties WHERE properties.id = property_photos.property_id AND properties.agent_id = auth.uid())` |
| `photos_delete_own` | DELETE | `EXISTS (SELECT 1 FROM properties WHERE properties.id = property_photos.property_id AND properties.agent_id = auth.uid())` |

**Notes:**
- Photos are linked to properties; ownership is checked via the parent property
- RLS ensures only the property owner can manage photos

---

### `leads` (if applicable)

| Policy Name | Operation | Definition |
|-------------|-----------|------------|
| `leads_select_own` | SELECT | `auth.uid() = agent_id` |
| `leads_insert_public` | INSERT | `true` (anyone can submit a lead) |
| `leads_update_own` | UPDATE | `auth.uid() = agent_id` |

**Notes:**
- Public users can create leads (contact requests)
- Only the receiving agent can view/update their leads

---

## Storage Bucket Policies

### `property-images` bucket

**Status:** Public bucket with authenticated upload/delete restrictions.

| Policy Name | Operation | Definition | Status |
|-------------|-----------|------------|--------|
| Public read | SELECT | `true` (public URLs) | Active |
| Users can upload to own folder | INSERT | `auth.uid()::text = (storage.foldername(name))[1]` | Active |
| Users can delete from own folder | DELETE | `auth.uid()::text = (storage.foldername(name))[1]` | Active |

**Folder structure:** `{user_id}/{property_id}/{filename}`

**Enforcement:**
- Upload path MUST start with the authenticated user's UUID
- Supabase storage policies enforce folder ownership
- Public can view all images (required for property listings)
- Only the owning agent can upload/delete images in their folder

**Client-side validation (defense in depth):**
- File type: JPG, PNG, WebP only
- Max size: 10MB
- Enforced in `lib/validation/schemas.ts` via `imageUploadSchema`

---

## Best Practices

1. **Always test RLS policies** after changes using the Supabase SQL editor with `SET ROLE authenticated; SET request.jwt.claims = '{"sub": "user-uuid"}';`

2. **Never bypass RLS** in client code. Use service role only in secure server contexts.

3. **Document policy changes** in this file and in migration files.

4. **Audit regularly** - Review policies quarterly or after major schema changes.

---

## Verification Commands

```sql
-- Check if RLS is enabled on a table
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';

-- Test a policy (as a specific user)
SET ROLE authenticated;
SET request.jwt.claims = '{"sub": "your-user-uuid-here"}';
SELECT * FROM properties; -- Should only return owned properties
RESET ROLE;
```

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-24 | Initial RLS documentation | Claude Code |

---

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
