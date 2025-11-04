# Safvacut V3 - Modern Web3 Wallet (Replit Project)

## Overview
Safvacut V3 is a cryptocurrency wallet and trading platform being transformed from vanilla JS + Firebase into a modern React + TypeScript + Supabase production PWA.

## Tech Stack (Phase 1 Complete)
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **State**: TanStack Query
- **Web3**: wagmi + viem + RainbowKit 2.3
- **Backend**: Supabase (to be configured in Phase 2)
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

### 2025-11-04: PHASE 1 - Setup React Stack ✓
1. ✅ Created Vite React TypeScript project
2. ✅ Added all required dependencies to package.json:
   - Tailwind CSS 3.4.17
   - Supabase JS client
   - wagmi + viem + RainbowKit
   - TanStack Query
   - Framer Motion, Sonner, Lucide, Recharts
   - shadcn/ui utilities (clsx, class-variance-authority, tailwind-merge)
3. ✅ Configured Vite for Replit (port 5000, host 0.0.0.0, path aliases)
4. ✅ Set up Tailwind CSS 3 with PostCSS
5. ✅ Created shadcn/ui configuration (components.json)
6. ✅ Preserved assets from original project (logo, crypto images)
7. ✅ Removed old vanilla JS files
8. ✅ Created .env.example for Supabase config
9. ✅ Set up vite-dev workflow

### Known Issue (In Progress)
⚠️ **Package Installation**: Due to Replit free plan limitations, npm install times out. The package.json is correctly configured with all dependencies, but node_modules needs to complete installation.

**Resolution Options**:
1. Use Replit's Dependencies tool (UI) to install packages one by one
2. Wait for Replit's automatic package detection to install them
3. Run `npm install` in Shell when stable

## Next Steps - PHASE 2
See `PHASE1_HANDOFF.md` for complete Phase 1 summary and Phase 2 preparation.
