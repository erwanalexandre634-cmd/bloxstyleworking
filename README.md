# BLOXSTYLE — Roblox Fashion Hub

> The ultimate fashion platform for Roblox avatars. Create, share, and discover amazing outfits.

## 🎯 Features

- **Roblox OAuth Authentication** - Secure login with official Roblox accounts
- **Outfit Creation & Sharing** - Create and publish your best avatar looks
- **Social Features** - Like, follow, and discover trending outfits
- **Look Battles** - Vote on outfit matchups and earn battle rankings
- **Leaderboards** - Track top outfits by likes and battle wins
- **Mobile-First Design** - Optimized experience on all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with Roblox Provider
- **Cache**: Redis (Upstash)
- **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/download/win)
- **PostgreSQL database** (choose one):
  - [Supabase](https://supabase.com) (recommended, free tier)
  - [Neon](https://neon.tech) (recommended, free tier)
  - Local PostgreSQL installation
- **Redis instance** - [Upstash](https://upstash.com) (recommended, free tier)
- **Roblox OAuth credentials** - [Create at Roblox Creator Hub](https://create.roblox.com/dashboard/credentials)

### Step-by-Step Setup (Windows)

#### 1. Clone and Install

```cmd
# Clone the repository
git clone https://github.com/erwanalexandre634-cmd/bloxstyleworking.git
cd bloxstyleworking

# Install dependencies
npm install
```

#### 2. Set Up Database (Supabase - Recommended)

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the database to be provisioned (~2 minutes)
4. Go to **Project Settings** > **Database**
5. Copy the **Connection String** (URI format, not session pooler)
6. Replace `[YOUR-PASSWORD]` in the connection string with your actual password

#### 3. Set Up Redis (Upstash)

1. Go to [Upstash](https://upstash.com) and create a free account
2. Create a new Redis database (select any region)
3. Go to **Details** tab
4. Copy the **REST API URL** and **REST API Token**

#### 4. Set Up Roblox OAuth

1. Go to [Roblox Creator Hub](https://create.roblox.com/dashboard/credentials)
2. Click **Create OAuth2 App**
3. Fill in:
   - **Name**: Bloxstyle (or any name)
   - **Redirect URIs**: `http://localhost:3000/api/auth/callback/roblox`
   - **Scope**: `openid`, `profile`
4. Click **Create** and copy the **Client ID** and **Client Secret**

#### 5. Environment Configuration

Copy `.env.local.example` to `.env.local`:

```cmd
copy .env.local.example .env.local
```

Then edit `.env.local` with your actual credentials:

```env
# Roblox OAuth
ROBLOX_CLIENT_ID=your_actual_client_id
ROBLOX_CLIENT_SECRET=your_actual_client_secret

# Database (paste your Supabase connection string)
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# Redis (paste your Upstash credentials)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
```

**Generate NEXTAUTH_SECRET:**

```cmd
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste it as the `NEXTAUTH_SECRET` value.

#### 6. Initialize Database

```cmd
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push
```

You should see: `✔ Generated Prisma Client` and `Your database is now in sync with your Prisma schema.`

#### 7. Run Development Server

```cmd
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Troubleshooting

**"Cannot find module '@prisma/client'"**
- Run: `npx prisma generate`

**"PrismaClientInitializationError"**
- Check that `DATABASE_URL` in `.env.local` is correct
- Verify database is accessible (check Supabase dashboard)

**"Failed to fetch" on login**
- Verify `ROBLOX_CLIENT_ID` and `ROBLOX_CLIENT_SECRET` are correct
- Check redirect URI in Roblox OAuth app matches exactly: `http://localhost:3000/api/auth/callback/roblox`

**Turbopack workspace root warning**
- Remove any `package-lock.json` files outside the project directory
- Or the warning is harmless and can be ignored

**Tailwind CSS not working**
- Ensure you ran `npm install` after cloning
- Delete `.next` folder and restart dev server: `npm run dev`

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Authentication pages
│   ├── (main)/                # Main app pages
│   │   ├── page.tsx           # Home feed
│   │   ├── explore/           # Discover outfits
│   │   ├── battles/           # Look battles
│   │   ├── rankings/          # Leaderboards
│   │   └── profile/           # User profile
│   └── api/                   # API routes
│       ├── auth/              # NextAuth handlers
│       ├── outfits/           # Outfit CRUD + likes
│       └── battles/           # Battle voting
├── components/
│   ├── layout/                # Nav, footer
│   ├── outfit/                # Outfit cards, like button
│   ├── battle/                # Battle arena
│   ├── feed/                  # Infinite scroll feed
│   └── ui/                    # shadcn components
├── lib/
│   ├── auth.ts                # NextAuth config
│   ├── db.ts                  # Prisma client
│   ├── redis.ts               # Redis client
│   ├── validations.ts         # Zod schemas
│   └── roblox/                # Roblox API clients
│       ├── avatar.ts
│       ├── thumbnails.ts
│       └── catalog.ts
└── types/                     # TypeScript definitions
```

## 🔐 Roblox OAuth Setup

1. Go to [Roblox Creator Hub](https://create.roblox.com/dashboard/credentials)
2. Create a new OAuth2 application
3. Set redirect URI to: `http://localhost:3000/api/auth/callback/roblox`
4. Copy Client ID and Client Secret to `.env.local`

## 📝 API Routes

### Outfits

- `GET /api/outfits` - List outfits (supports filters: recent, trending, top, following)
- `POST /api/outfits` - Create outfit (authenticated)
- `POST /api/outfits/[id]/like` - Like outfit
- `DELETE /api/outfits/[id]/like` - Unlike outfit

### Battles

- `GET /api/battles` - Get random outfit pair
- `POST /api/battles` - Record vote (authenticated)

## 🎨 Key Components

### OutfitCard
Displays outfit thumbnail, creator info, tags, and like button.

### InfiniteFeed
Infinite scroll gallery with React Query and Intersection Observer.

### BattleArena
Side-by-side outfit comparison with voting and animations.

### LikeButton
Optimistic UI updates for instant feedback.

## 📱 Mobile Navigation

The app features a bottom navigation bar on mobile devices with quick access to:
- Home
- Explore
- Battles
- Rankings
- Profile

## 🚫 Constraints

- ❌ No AI generation
- ❌ No 3D rendering (2D thumbnails only via Roblox API)
- ❌ No marketplace/purchases/Robux
- ✅ Official Roblox OAuth only
- ✅ Public Roblox data only
- ✅ Strict ToS compliance

## 📄 License

This project is not affiliated with Roblox Corporation.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 🐛 Issues

Report issues at the GitHub repository.
