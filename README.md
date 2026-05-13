# SponsorNepal

A production-ready MVP marketplace connecting Nepali creators with brands for sponsorships and influencer marketing campaigns.

![SponsorNepal Banner](https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200)

## Features

- **For Creators**: Build professional profiles, showcase metrics, apply to campaigns, communicate with brands, manage deals
- **For Brands**: Discover creators, post campaigns, review applications, message creators, manage workflows
- **For Admins**: Moderate users, verify creators, manage transactions, monitor platform health

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- TanStack Query
- Zustand
- React Hook Form + Zod

### Backend
- Supabase (PostgreSQL, Auth, Storage, Realtime)
- Server Actions

### Infrastructure
- Vercel (Frontend)
- Resend (Emails)

## Architecture

```
Frontend UI
    ↓
Server Actions
    ↓
Services
    ↓
Repositories
    ↓
Supabase/PostgreSQL
```

### Project Structure

```
src/
├── app/
│   ├── (public)/        # Public pages (landing, creators, campaigns)
│   ├── (auth)/          # Auth pages (login, signup)
│   ├── (dashboard)/     # Dashboard pages
│   │   ├── dashboard/creator/
│   │   ├── dashboard/brand/
│   │   └── admin/
│   └── api/             # API routes
├── components/
│   ├── ui/              # Base UI components
│   ├── shared/          # Shared components
│   └── layouts/         # Layouts (navbar, footer, sidebar)
├── features/
│   ├── auth/
│   ├── creators/
│   ├── campaigns/
│   ├── messaging/
│   ├── deals/
│   └── admin/
├── lib/
│   ├── supabase/        # Supabase clients
│   ├── validations/     # Zod schemas
│   ├── permissions/     # RBAC logic
│   └── utils/
├── actions/             # Server actions
├── services/            # Business logic
├── repositories/        # Database queries
├── hooks/
├── store/               # Zustand stores
└── types/               # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm/bun
- Supabase account

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# OAuth (Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Future Payments (Optional for MVP)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_ESEWA_MERCHANT_ID=
NEXT_PUBLIC_KHALTI_PUBLIC_KEY=
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sponsornepal.git
cd sponsornepal

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon/public key from Settings > API

### 2. Run Database Migrations

1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the contents of `database/migrations/001_initial_schema.sql`
3. Run the migration

### 3. Configure Authentication

1. Go to Authentication > Providers
2. Enable Email/Password auth
3. Configure Google OAuth:
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Add credentials to Supabase

### 4. Configure Storage

1. Go to Storage in Supabase dashboard
2. Create buckets: `avatars`, `banners`, `portfolio`, `logos`
3. Set buckets to public

### 5. Enable Realtime

1. Go to Database > Replication
2. Enable for `messages`, `notifications`, `conversations` tables

## Database Schema

### Core Tables

- `users` - User accounts with roles (creator, brand, admin)
- `creator_profiles` - Creator details, social metrics, portfolio
- `brand_profiles` - Brand/company information
- `campaigns` - Brand campaign listings
- `campaign_applications` - Creator applications to campaigns
- `conversations` - Messaging conversations
- `messages` - Individual messages
- `deals` - Finalized sponsorship deals
- `transactions` - Payment transactions
- `saved_creators` - Brands' saved creator lists
- `notifications` - User notifications
- `verification_requests` - Creator verification requests

### Row Level Security

All tables have RLS policies configured:
- Users can only view/edit their own data
- Creators can only apply once per campaign
- Brands can only manage their own campaigns
- Admins have full access

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Supabase

1. Run migrations in production
2. Update environment variables
3. Configure OAuth providers

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret to `.env.local`

In Supabase:
1. Authentication > Providers > Google
2. Enable and add Client ID and Secret

## Resend Setup (Emails)

1. Create account at [resend.com](https://resend.com)
2. Create an API key
3. Add to environment variables
4. Verify a domain (or use Resend's test domain)

## Seed Data

Run seed data for demo purposes:

```bash
# In Supabase SQL Editor
# Copy and paste contents of database/migrations/002_seed_data.sql
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

---

Built with ❤️ for the Nepali creator community