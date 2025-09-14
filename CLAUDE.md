# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (Vue.js)
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend API (Express/Prisma)
Navigate to `api/` directory first:
- `npm run dev` - Start API server with nodemon on port 3001
- `npm start` - Start API server in production
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio for database management

## Architecture Overview

This is a full-stack crypto asset tracker with a Vue.js frontend and Express/Prisma backend:

### Frontend Structure
- **Vue 3** with Composition API, Vite build tool, Tailwind CSS styling
- **Router**: Client-side routing with vue-router for SPA navigation
- **Components**: Reusable UI components in `src/components/`
  - `Layout.vue` - Main layout with navigation
  - `Chart.vue` - Chart.js wrapper for data visualization
  - `StatCard.vue` - Statistics display cards
- **Pages**: Main application views in `src/pages/`
  - `GrowthSummary.vue` - Portfolio overview with charts
  - `AssetInput.vue` - Add/manage crypto assets
  - `DebtData.vue` - Debt tracking functionality
- **Services**: Data layer abstraction in `src/services/`
  - `api.js` - Mock API service (can be replaced with real API calls)
  - `currency.js` - Currency conversion utilities

### Backend Structure
- **Express.js** API server with CORS and JSON middleware
- **Prisma ORM** with MySQL database for data persistence
- **Route modules**: Organized API endpoints in `api/routes/`
  - `assets.js` - Asset CRUD operations
  - `debts.js` - Debt management
  - `exchanges.js` - Exchange data
  - `portfolio.js` - Portfolio calculations and summaries
- **Database Schema**: Four main models in `api/prisma/schema.prisma`
  - `Exchange` - Trading platforms
  - `Asset` - Crypto holdings with purchase/current prices
  - `Debt` - Debt tracking
  - `DailyGrowth` - Historical portfolio performance

### Data Flow
- Frontend uses either mock API service (`src/services/api.js`) or real backend API
- Both frontend and backend handle multi-currency calculations (USD/IDR)
- Real-time profit/loss calculations based on purchase vs current prices
- Portfolio aggregation across multiple exchanges

## Key Configuration Files
- `vite.config.js` - Vite configuration (dev server on port 3000)
- `tailwind.config.js` - Tailwind CSS customization
- `api/prisma/schema.prisma` - Database schema definition
- Environment variables needed for API: `DATABASE_URL`, `NODE_ENV`, `PORT`

## Development Workflow
1. Start both frontend (`npm run dev`) and backend (`cd api && npm run dev`)
2. Frontend serves on port 3000, API on port 3001
3. Database changes require running `npm run db:push` or `npm run db:migrate`
4. Use `npm run db:studio` for visual database management
5. Seed database with `npm run db:seed` for initial test data