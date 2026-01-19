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

- Node.js 18+
- PostgreSQL database (Supabase, Neon, or local)
- Redis instance (Upstash recommended)
- Roblox OAuth credentials

### 1. Clone and Install

```bash
git clone <repository-url>
cd bloxstyleworking
npm install
```

### 2. Environment Setup

Create a `.env.local` file based on `.env.local.example`:

```bash
# Roblox OAuth (https://create.roblox.com/dashboard/credentials)
ROBLOX_CLIENT_ID=your_client_id
ROBLOX_CLIENT_SECRET=your_client_secret

# Database
DATABASE_URL="postgresql://user:password@host:5432/bloxstyle"

# Redis (https://upstash.com)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_min_32_chars
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

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
