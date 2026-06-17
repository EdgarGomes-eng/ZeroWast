# 🌿 ZeroWaste Connect — MVP (National Sustainable Impact Competition)

> **ZeroWaste Connect** is a dynamic, georeferenced social logistics platform designed to bridge the gap in real-time between commercial food waste (restaurants, bakeries, cafes) and social organizations supporting vulnerable individuals.

This repository hosts the clean, highly-responsive, production-ready frontend and mock-ready architecture submission for evaluation by the Grand Jury.

---

## 🗺️ Quick Navigation

1. [Value Proposition & Core Vision](#-value-proposition--core-vision)
2. [Sustainable Impact Indicators](#-sustainable-impact)
3. [Local Setup (How to Run)](#-local-setup-how-to-run)
4. [Environment Variables](#-environment-variables)
5. [Hybrid Database Strategy (Supabase + LocalStorage Fallback)](#-hybrid-database-strategy-supabase--localstorage-fallback)
6. [Supabase SQL Schema Seed](#-supabase-sql-schema-seed)

---

## 💡 Value Proposition & Core Vision

- 🗺️ **Georeferenced Live Mapping:** Responsive Leaflet.js embedding displaying active surplus donations with absolute real-time proximity feedback inside Lisbon Central and surroundings.
- ⚙️ **Dual-Database Active Layer:** Built under an offline-first resilient concept, permitting instant fallback to fully persistent `localStorage` when credentials aren't declared, transitioning seamlessly to a secure PostgreSQL Supabase.
- 🇺🇳 **Targeting UN SDGs (SDG 2 & SDG 12):** Directly links local business surpluses with institutional demands, tackling zero-hunger goals and responsible food consumption.
- 🌐 **Seamless Native i18n:** Built-in translation layers dynamically switching interface translations between **English**, **Portuguese**, **Spanish**, and **French**.
- 💫 **Humane Visual Design (framer-motion):** Smooth organic ripples, custom loading shimmers, tactile scale changes, spring-damper interactions, and custom modal exits.

---

## 📊 Sustainable Impact

Every single year, millions of tons of pristine commercial surplus are discarded due to minor demand fluctuations. Conversely, local charities struggle with logistical timing. ZeroWaste Connect bridges this exact communication gap.
- **Goal #1 (Fome Zero):** Divert healthy food from landfills straight into social soup kitchens within minutes of restaurant closing.
- **Goal #12 (Consumo Responsável):** Provide an active, transparent record of carbon offset metrics and zero-waste badges for local commercial sponsors.

---

## 🚀 Local Setup (How to Run)

Execute these simple steps to spin up the local development instance:

### 1. Install Dependencies
Open your terminal inside the project directory and run:
```bash
npm install
```

### 2. Start the Hot-Reload Dev Server
```bash
npm run dev
```
The site will run on the default port: [http://localhost:3000](http://localhost:3000)

### 3. Build for Production Compilation
```bash
npm run build
```
This outputs fully optimized, compressed assets inside the client static folder `dist/`.

---

## 🔑 Environment Variables

To bind this application directly to your production cloud instance of PostgreSQL (Supabase), declare the following environmental keys inside your `.env` or apply them through the live gear settings modal inside the preview top-right panel:

```env
# The secure end-point coordinates to your Supabase project instance
VITE_SUPABASE_URL="https://your-custom-subdomain.supabase.co"

# The publicly accessible non-privileged client API key
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here"
```

*Note: ZeroWaste Connect implements high fault-tolerance. If keys are absent, it operates in **Simulation mode** with full reactivity and pre-loaded mock donations so judges can trial CRUD actions without complex installations.*

---

## 🗄️ Hybrid Database Strategy (Supabase + LocalStorage Fallback)

1. **Connected Mode:** When API keys are valid, donor listings, status changes, and dynamic updates are dispatched directly to the Supabase cloud tables.
2. **Autonomous Sandbox:** On local/offline testing, state remains active through rehydrate hooks via local browser storage, offering judges a frictionless sandbox.

---

## ⚡ Supabase SQL Schema Seed

If hosting on your custom Supabase client to test, execute the following script through your Supabase SQL Editor:

```sql
-- Create user profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('DONOR', 'RECIPIENT')) NOT NULL,
    phone TEXT,
    address TEXT,
    avatar_url TEXT
);

-- Create active food donations table
CREATE TABLE public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    quantity TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    expiry_time TIMESTAMPTZ NOT NULL,
    status TEXT CHECK (status IN ('AVAILABLE', 'RESERVED', 'COMPLETED')) DEFAULT 'AVAILABLE' NOT NULL,
    donor_id TEXT NOT NULL,
    donor_name TEXT NOT NULL,
    donor_phone TEXT,
    pickup_instructions TEXT,
    recipient_id TEXT
);
```

---

🌿 **ZeroWaste Connect** — *Transforming surplus into warm, purposeful support.*
🏆 *Strategic MVP Candidacy Proposal for the National Sustainable Impact Award.*
