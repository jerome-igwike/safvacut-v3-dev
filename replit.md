# Safvacut V3 - Modern Web3 Wallet (Replit Project)

## Overview
Safvacut V3 is a cryptocurrency wallet and trading platform being transformed from vanilla JS + Firebase into a modern React + TypeScript + Supabase production PWA.

## Tech Stack (Phase 1 & 2 Complete)
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **State**: TanStack Query
- **Web3**: wagmi + viem + RainbowKit 2.3
- **Backend**: Supabase (schema + edge functions ready)
- **UI Components**: Framer Motion, Sonner, Lucide React, Recharts
- **Build**: Vite 7 with Hot Module Replacement

## Project Structure
```
/
├── src/
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   ├── index.css            # Tailwind + global styles
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn, etc.)
│   └── components/
│       └── ui/              # shadcn components (to be added)
├── supabase/
│   ├── migrations/
│   │   └── 001_init.sql     # Database schema with RLS
│   └── functions/
│       ├── credit_deposit/  # Admin deposit crediting
│       └── approve_withdrawal/ # Admin withdrawal approval
├── public/
│   ├── logo.png             # Safvacut logo
│   └── images/              # Crypto images (BTC, ETH, etc.)
├── vite.config.ts           # Vite config with aliases & port 5000
├── tailwind.config.js       # Tailwind config
├── components.json          # shadcn/ui config
└── package.json             # All dependencies listed
```

## Port Configuration
- **Dev Server**: 0.0.0.0:5000 (Replit webview compatible)
- **Workflow**: vite-dev running `npm run dev`

## Recent Changes

### 2025-11-04: PHASE 2 - Supabase Schema & Backend ✓
1. ✅ Created database schema with production-ready security:
   - Tables: profiles, balances, transactions, withdrawals, deposit_addresses, admins
   - Row Level Security (RLS) with proper WITH CHECK clauses
   - Admin helper function for role verification
   - Comprehensive indexes for performance
2. ✅ Built secure Edge Functions with JWT authentication:
   - credit_deposit: Admin-only deposit crediting
   - approve_withdrawal: Admin-only withdrawal approval
   - Both validate authorization headers and derive user from JWT
   - Comprehensive error handling
3. ✅ Configured environment variables (.env.example)
4. ✅ Vite dev server running on port 5000
5. ✅ All dependencies installed successfully
6. ✅ Security review passed - production-ready

### 2025-11-04: PHASE 1 - Setup React Stack ✓
1. ✅ Created Vite React TypeScript project
2. ✅ Added all required dependencies
3. ✅ Configured Tailwind CSS 3 with PostCSS
4. ✅ Set up shadcn/ui configuration
5. ✅ Preserved assets from original project

## Next Steps - PHASE 3
See `PHASE2_HANDOFF.md` for Phase 2 summary and Phase 3 preparation.

**Key Phase 3 Tasks:**
1. Configure Supabase project and add secrets to Replit
2. Run migration and deploy Edge Functions
3. Implement authentication UI
4. Build core wallet features (dashboard, deposits, withdrawals)
5. Create admin panel
