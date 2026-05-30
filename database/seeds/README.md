# Seed Data

## How to use

### Step 0: Run Migrations

Make sure all migrations have been run, including the new `014_create_transactions_table.sql`.

### Step 1: Create Auth Users

The SQL seed references fixed UUIDs that must exist in `auth.users`. Use the Supabase Dashboard or the Admin API to create these users.

**Via Supabase Dashboard:**

1. Go to Authentication > Users > Invite user
2. Create each user with these emails and passwords:

| Email | Password | Role |
|-------|----------|------|
| admin@sponsornepal.com | Admin@123 | admin |
| ram@example.com | Creator@123 | creator |
| sita@example.com | Creator@123 | creator |
| bikash@example.com | Creator@123 | creator |
| anita@example.com | Creator@123 | creator |
| priya@example.com | Creator@123 | creator |
| ncell@ncell.com.np | Brand@123 | brand |
| daraz@daraz.com.np | Brand@123 | brand |
| imepay@imepay.com.np | Brand@123 | brand |
| foodmandu@foodmandu.com.np | Brand@123 | brand |

3. After creating each user, copy their UUID from the Auth > Users table
4. Update the UUIDs in `seed.sql` to match

**Via Supabase Admin API (recommended):**

```bash
npm run seed:auth
```

This runs `database/seeds/seed-auth.ts` which creates all auth users via the Admin API and reports their UUIDs.

### Step 2: Run the SQL Seed

**Option A — Supabase SQL Editor:**

1. Go to SQL Editor in your Supabase dashboard
2. Paste the contents of `seed.sql`
3. Run the query

**Option B — CLI:**

```bash
supabase db seed --db-url postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres
```

### Step 3: Verify

After seeding, you should see:

- **10 users** (1 admin, 5 creators, 4 brands)
- **9 creator profiles** with full bios, social stats, and portfolios
- **4 brand profiles** (Ncell, Daraz, IME Pay, Foodmandu)
- **9 campaigns** across various statuses
- **11 applications** with realistic proposal messages
- **6 conversations** with **28 messages**
- **6 deals** in various stages
- **10 saved creators**
- **24 notifications**
- **5 transactions** (3 escrow held, 1 released, 1 platform fee)

### Demo Login Credentials

Use these to log in after seeding:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sponsornepal.com | Admin@123 |
| Creator | ram@example.com | Creator@123 |
| Creator | sita@example.com | Creator@123 |
| Brand | ncell@ncell.com.np | Brand@123 |
| Brand | daraz@daraz.com.np | Brand@123 |
