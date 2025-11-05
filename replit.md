# Safvacut V3 - Modern Web3 Wallet (Replit Project)

## Overview
Safvacut V3 is a cryptocurrency wallet and trading platform being transformed from vanilla JS + Firebase into a modern React + TypeScript + Supabase production PWA.

## Tech Stack (Phase 1, 2, 3 & 4 Complete)
- **Frontend**: React 19 + TypeScript + Vite
- **Routing**: React Router v6 with protected routes
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **State**: TanStack Query
- **Authentication**: Supabase Auth with email/password
- **Web3**: wagmi + viem + RainbowKit 2.3
- **Backend**: Supabase (schema + edge functions ready)
- **UI Components**: Framer Motion, Sonner, Lucide React, Recharts
- **Build**: Vite 7 with Hot Module Replacement

## Project Structure
```
/
├── src/
│   ├── App.tsx              # Main app with React Router & protected routes
│   ├── main.tsx             # Entry point
│   ├── index.css            # Tailwind + global styles
│   ├── lib/
│   │   ├── utils.ts         # Utility functions (cn, etc.)
│   │   └── supabase.ts      # Supabase client configuration
│   ├── types/
│   │   └── database.ts      # TypeScript types for database tables
│   ├── hooks/
│   │   ├── useUser.ts       # Auth state, profile & admin check hook
│   │   ├── useBalances.ts   # Real-time balance subscription
│   │   └── usePrices.ts     # Live CoinGecko price updates
│   └── components/
│       ├── auth/
│       │   ├── Login.tsx    # Login component with routing
│       │   ├── Signup.tsx   # Signup component with routing
│       │   └── BiometricLogin.tsx # Biometric auth placeholder
│       ├── dashboard/
│       │   └── Dashboard.tsx # Main dashboard with realtime balances
│       ├── wallet/
│       │   ├── Deposit.tsx  # Deposit with QR codes
│       │   └── Withdraw.tsx # Withdrawal form
│       ├── OnboardingCarousel.tsx # Welcome carousel
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

### 2025-11-05: PHASE 4 - Dashboard + Realtime Balances ✓
1. ✅ Created Dashboard component with:
   - Real-time balance updates using Supabase Realtime
   - Live USD prices from CoinGecko API (60s refresh)
   - Animated numbers with Framer Motion
   - Skeleton loaders for loading states
   - Total portfolio value calculation
   - Asset list for BTC, ETH, USDT, USDC
2. ✅ Built Deposit component:
   - QR code generation per token
   - Unique deposit addresses (auto-generated)
   - Copy to clipboard with toast notifications
   - Token selector with warnings
3. ✅ Implemented Withdraw component:
   - Withdrawal form with amount/address inputs
   - MAX button for quick balance selection
   - Submits to withdrawals table for admin approval
   - Balance validation and error handling
4. ✅ Added custom hooks:
   - useBalances: Real-time balance subscription
   - usePrices: Live CoinGecko price polling
5. ✅ Updated routing in App.tsx:
   - /dashboard - Main portfolio view
   - /deposit - Deposit with QR codes
   - /withdraw - Withdrawal form
   - All routes protected with authentication
6. ✅ Code review passed - all features functional

### 2025-11-05: PHASE 3 - Auth & User Flow ✓
1. ✅ Configured Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
2. ✅ Created Supabase client with environment variables
3. ✅ Built useUser hook with:
   - Auth state management
   - Profile loading with auto-creation
   - Admin role checking
   - Session persistence
4. ✅ Implemented authentication UI:
   - Login component with email/password
   - Signup component with validation
   - OnboardingCarousel with animated slides
   - BiometricLogin placeholder component
5. ✅ Set up React Router v6:
   - Protected routes for authenticated users
   - Public routes for auth pages
   - Automatic routing after login/signup
   - Loading states and error handling
6. ✅ Created Dashboard displaying:
   - User email and unique UID
   - Admin status indicator
   - Sign out functionality
7. ✅ Code review passed - auth flow fully functional

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

## Next Steps - PHASE 5

**Ready to commit:**
```bash
git add -A
git commit -m "Phase 4: Dashboard with realtime balances + Deposit/Withdraw"
git push
```

**Key Phase 5 Tasks (Admin Panel):**
1. Create admin dashboard (/admin route):
   - View all users and balances
   - List pending withdrawal requests
   - Manual deposit crediting interface
   - Transaction monitoring
2. Implement withdrawal approval:
   - Call approve_withdrawal Edge Function
   - Update withdrawal status to "completed"
   - Deduct from user balance
   - Show confirmation with tx_hash
3. Implement manual deposit crediting:
   - Call credit_deposit Edge Function
   - Add to user balance
   - Create transaction record
4. Add admin-only route protection:
   - Check isAdmin before rendering
   - Redirect non-admins to dashboard
