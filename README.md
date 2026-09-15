# JobTrackr

Starter dashboard for a daily job-application habit, built with Next.js, TypeScript, Tailwind CSS, and Supabase/PostgreSQL.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Database

Run `supabase/migrations/20260914000000_initial_schema.sql` in the Supabase SQL Editor, or use the Supabase CLI:

```bash
supabase db push
```

Run both migrations in filename order. Authentication uses Supabase email/password with email verification, plus optional Google OAuth. Password hashes remain securely managed by Supabase Auth and are never stored in application tables. Add `http://localhost:3000/auth/callback` to Authentication → URL Configuration → Redirect URLs, enable **Confirm email**, and enable/configure the Google provider in Authentication → Providers.

The `registration_completed` flag prevents a brand-new Google identity from entering the app. Users register with email/password first; Supabase can then link the verified Google identity that uses the same email.

The migrations include UUID keys, ownership via `auth.users`, a user `profiles` table, foreign keys, indexes, validation constraints, `updated_at` triggers, and row-level security policies. UI data is currently sourced from `lib/mock-data.ts`; replace it with Supabase queries when authentication is connected.
