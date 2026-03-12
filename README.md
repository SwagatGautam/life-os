# DevLife OS 🚀

> **Your Developer Operating System** — The ultimate dashboard for developers. Track coding activity, tasks, goals, habits, finances, gym, reading, notes, and live meetings — all in one beautiful, dark-first OS.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/devlife-os&env=DATABASE_URL,AUTH_SECRET,AUTH_GOOGLE_ID,AUTH_GOOGLE_SECRET)

---

## ✨ Features

| Module | Features |
|--------|----------|
| 💻 **Coding Activity** | GitHub heatmap, commit streaks, PR tracking, productive hours |
| ✅ **Tasks & Kanban** | Drag-drop board, GitHub Issues sync, Today's Focus |
| 🎯 **Goals** | SMART goals, progress rings, momentum score |
| 🔥 **Habits** | Heatmaps, streaks, Pomodoro timer (25/5/15) |
| 💰 **Finances** | Expense tracker, budget planner, charts |
| 🏋️ **Gym** | Workout logger, PR tracker, volume charts |
| 📚 **Reading** | Book library, yearly challenge, reading heatmap |
| 📝 **Notes** | Rich text, code snippets, searchable wiki |
| 🎥 **Meetings** | WebRTC video, screen share, chat, reactions |
| 📊 **Analytics** | Life balance radar, weekly trends, fun stats |
| 🤖 **AI Coach** | GPT-4 powered insights from all your data |

**Plus:** Dark/Light/System theme, Cmd+K command palette, PWA installable, mobile-first, drag-and-drop widgets.

---

## 🚀 Quick Start (5 seconds)

```bash
# Clone
git clone https://github.com/yourusername/devlife-os
cd devlife-os

# Install
npm install

# Copy env
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
npx prisma db push

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔧 Environment Variables

### Required
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random secret (min 32 chars) — generate: `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |

### Optional (for full features)
| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | GPT-4 for AI Coach |
| `LIVEKIT_API_KEY` | LiveKit video meetings |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `NEXT_PUBLIC_LIVEKIT_URL` | LiveKit server URL |
| `RESEND_API_KEY` | Email notifications |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase for file storage |

---

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable **Google+ API** and **OAuth consent screen**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.com/api/auth/callback/google` (prod)
6. Copy Client ID and Secret to `.env.local`

---

## 🎥 LiveKit Video Setup

### Option A: LiveKit Cloud (recommended)
1. Sign up at [livekit.io/cloud](https://livekit.io/cloud)
2. Create a project and get API Key + Secret
3. Add to `.env.local`:
```env
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

### Option B: Self-hosted
```bash
docker run --rm -p 7880:7880 -p 7881:7881 -p 7882:7882/udp \
  -e LIVEKIT_KEYS="devkey: secret" \
  livekit/livekit-server --dev
```

---

## 🗄️ Database Setup

### Supabase (recommended)
1. Create project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database** and copy the connection string
3. Set `DATABASE_URL` in `.env.local`
4. Run `npx prisma db push`

### Local PostgreSQL
```bash
docker run -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:16
```
Set: `DATABASE_URL=postgresql://postgres:password@localhost:5432/devlife_os`

---

## 🐳 Docker Deployment

```bash
# Start with Docker Compose (app + postgres)
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma db push

# View logs
docker-compose logs -f app
```

---

## ▲ Vercel Deployment

1. Click the Deploy button above or go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Add all environment variables from `.env.example`
4. Deploy!

For the database, use **Supabase** or **Vercel Postgres**.

---

## 🚂 Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Add PostgreSQL plugin in Railway dashboard
# Set environment variables in Railway settings
```

---

## 🤖 Adding Your AI API Key

1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Add to `.env.local`:
```env
OPENAI_API_KEY=sk-...
```
3. The AI Coach widget uses `gpt-4o-mini` by default (cheapest + fast)
4. To use GPT-4, change the model in `src/app/api/ai/insights/route.ts`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth handlers
│   │   ├── tasks/        # Tasks CRUD
│   │   ├── goals/        # Goals CRUD
│   │   ├── ai/           # OpenAI integration
│   │   └── meetings/     # LiveKit tokens
│   ├── auth/             # Auth pages (sign-in, register)
│   └── dashboard/        # All dashboard pages
│       ├── page.tsx      # Main dashboard
│       ├── tasks/
│       ├── goals/
│       ├── habits/
│       ├── finances/
│       ├── gym/
│       ├── reading/
│       ├── notes/
│       ├── meetings/
│       └── analytics/
├── components/
│   ├── layout/           # Sidebar, TopNav, CommandPalette
│   ├── dashboard/        # Dashboard grid, header
│   └── widgets/          # All 10 dashboard widgets
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Utilities
└── store/
    └── dashboard-store.ts # Zustand state
```

---

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Auth**: NextAuth.js v5 (Google OAuth + Credentials)
- **Database**: Prisma + PostgreSQL
- **UI**: Tailwind CSS + Radix UI + Framer Motion
- **Charts**: Recharts
- **Video**: LiveKit SDK (WebRTC)
- **State**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **Emails**: Resend
- **AI**: OpenAI GPT-4o-mini

---

## 📄 License

MIT — feel free to fork, star, and ship your own version!

---

Made with ❤️ for developers who want to own their productivity.
