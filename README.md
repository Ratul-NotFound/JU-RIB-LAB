# Bioresources Technology and Industrial Biotechnology Laboratory (BTIB Lab)
### Jahangirnagar University · Department of Biotechnology & Genetic Engineering

Official research laboratory web application built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Prisma ORM** connected to **Neon Serverless PostgreSQL**.

---

## 🚀 Quick Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and provide your database credentials:
```env
DATABASE_URL="your-neon-pooled-url"
DIRECT_URL="your-neon-direct-url"
AUTH_SECRET="your-auth-secret"
AUTH_URL="http://localhost:3000"
```

### 3. Setup Database Schema & Seed Data
```bash
npx prisma db push
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 🔐 Administrative Access
- **Admin Dashboard:** `/admin`
- **Default Admin Account:** `admin@btiblab.ju.edu` / `admin123`
