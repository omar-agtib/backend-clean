# Project Management Platform - Frontend Setup Guide

## Project Structure

The frontend is organized into the `/frontend` directory with a clean, scalable Next.js 14+ structure.

### Directory Overview

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth group routes (login, register)
│   ├── (dashboard)/              # Protected dashboard routes
│   └── layout.tsx & globals.css  # Root layout and global styles
├── components/                   # React components
│   ├── auth/                     # Authentication forms
│   ├── layout/                   # Layout components (sidebar, navbar)
│   ├── projects/                 # Project management components
│   ├── dashboard/                # Dashboard stat cards
│   ├── common/                   # Shared UI components
│   └── ui/                       # Base UI components (shadcn-style)
├── lib/
│   ├── api/                      # API client and endpoint functions
│   ├── config/                   # Configuration (query client, etc)
│   ├── utils/                    # Utility functions (formatting, cn, etc)
│   └── types/                    # TypeScript type definitions
├── hooks/                        # React hooks (useAuth, useProjects, etc)
├── store/                        # Zustand stores (auth, ui)
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.mjs               # Next.js configuration
└── .env.local                    # Environment variables

```

## Technology Stack

- **Framework**: Next.js 14+ with React 19
- **State Management**: Zustand (lightweight, hooks-based)
- **Data Fetching**: React Query (TanStack Query v5)
- **HTTP Client**: Axios with JWT interceptors
- **Styling**: Tailwind CSS with custom theme variables
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: shadcn/ui style components with Radix UI
- **Icons**: Lucide React
- **Date Handling**: Day.js
- **Real-time**: Socket.io-client (ready to integrate)
- **TypeScript**: Full type safety with strict mode

## Installation

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Steps

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Configure environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

5. Run development server:
```bash
pnpm dev
# or
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Core Features Implemented

### ✅ Phase 1: Foundation & Infrastructure
- Next.js project setup with TypeScript
- Tailwind CSS and design system tokens
- Global styling with modern minimalist aesthetic
- Package.json with all necessary dependencies
- ESLint configuration
- TypeScript strict mode

### ✅ Phase 2: Authentication
- Login form with validation and error handling
- Registration form with password confirmation
- JWT token management with axios interceptors
- Zustand auth store with persistence
- Protected routes with automatic redirects
- Auth hooks (useAuth) for easy integration

### ✅ Phase 3: Core Layout & Navigation
- Responsive sidebar navigation with icons
- Desktop and mobile-friendly navbar
- User profile dropdown menu
- Protected layout wrapper
- Responsive design with collapsible sidebar
- Six main navigation items (Dashboard, Projects, Planning, Progress, Tools, Stock, Billing, Quality)

### ✅ Phase 4: Dashboard
- Dashboard stats overview with 6 key metrics
- Stat cards with icons and drill-down links
- Loading states and error handling
- React Query integration for data fetching
- Real-time stats calculation from backend

### ✅ Phase 5: Project Management (Partial)
- Project API endpoints and hooks
- Project list page with filtering
- Project card component with status badge
- Create, read, update, delete operations
- Member count display and actions

## Key Patterns & Best Practices

### API Integration Pattern
```typescript
// lib/api/endpoint.ts - Define API functions
export async function getItems() {
  const response = await apiClient.get('/api/items')
  return response.data
}

// hooks/useItems.ts - Create React Query hooks
export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => getItems(),
  })
}

// components/ItemList.tsx - Use in components
const { data, isLoading } = useItems()
```

### State Management Pattern
```typescript
// store/myStore.ts - Zustand store
const myStore = create()(
  persist((set) => ({
    state: value,
    setState: (newValue) => set({ state: newValue }),
  }))
)

// components/MyComponent.tsx - Use store
const { state, setState } = myStore()
```

### Component Structure
```typescript
// Client component with data fetching
'use client'
export function MyComponent() {
  const { data, isLoading } = useMyData()
  
  if (isLoading) return <LoadingState />
  return <div>{/* render data */}</div>
}
```

## Available Components

### UI Components (shadcn-style)
- `Button` - Styled button with variants
- `Input` - Text input with focus states
- `Label` - Form labels
- `Card` - Card container with header/footer
- `Table` - Data table with rows/cells
- `Avatar` - User avatar with fallback
- `DropdownMenu` - Dropdown menu with items

### Layout Components
- `ProtectedLayout` - Route protection wrapper
- `Sidebar` - Navigation sidebar
- `Navbar` - Top navigation bar
- `Notifications` - Toast notification system

### Common Components
- `LoadingState` - Loading skeleton
- `EmptyState` - Empty state with icon/action
- `StatCard` - Dashboard stat display

### Form Components
- `LoginForm` - Login with validation
- `RegisterForm` - Registration form

## Configuration

### Theme Colors
Edit `frontend/app/globals.css` to customize:
- Background, foreground, card, text colors
- Primary accent colors
- Destructive (error) colors
- Border and input colors

### API Base URL
Update `NEXT_PUBLIC_API_URL` in `.env.local`

### Query Client
Configure caching behavior in `lib/config/query-client.ts`

## Development Workflow

### Creating a New Feature

1. **Define API functions** in `lib/api/feature.ts`
```typescript
export async function getFeatures() {
  return apiClient.get('/api/features')
}
```

2. **Create React Query hooks** in `hooks/useFeature.ts`
```typescript
export function useFeatures() {
  return useQuery({
    queryKey: ['features'],
    queryFn: getFeatures,
  })
}
```

3. **Build UI components** in `components/feature/`
```typescript
export function FeatureList() {
  const { data } = useFeatures()
  return <div>{data?.map(item => ...)}</div>
}
```

4. **Create page** in `app/(dashboard)/feature/page.tsx`
```typescript
export default function FeaturePage() {
  return <FeatureList />
}
```

## Error Handling

Errors are automatically caught and displayed via the notification system:
- API errors trigger error notifications
- Form validation errors display inline
- Authentication errors redirect to login

## Performance Optimization

- React Query caching with 5-minute stale time
- Automatic code splitting with Next.js
- Image optimization ready
- Font optimization with next/font
- Memoization for expensive components

## Next Steps

1. **Run the development server** and test login flow
2. **Connect backend API** by updating `.env.local`
3. **Test authentication** with backend endpoints
4. **Complete project management** features (detailed pages, create/edit forms)
5. **Build remaining modules** (Planning, Progress, Tools, Stock, Billing, Quality)
6. **Integrate real-time updates** with Socket.io
7. **Add advanced filtering and search**
8. **Deploy to Vercel**

## Troubleshooting

### Login not working
- Check `NEXT_PUBLIC_API_URL` points to correct backend
- Verify backend is running and endpoints are correct
- Check browser console for CORS errors

### API errors
- Ensure token is being sent (check Authorization header)
- Verify JWT token is valid and not expired
- Check backend error responses

### Styling issues
- Clear Next.js cache: `rm -rf .next`
- Rebuild Tailwind: `pnpm build`

## Production Build

```bash
pnpm build
pnpm start
```

## Deployment

Ready to deploy on Vercel:
```bash
vercel deploy
```

Or connect GitHub repository for auto-deployment.

---

## Status Summary

- ✅ Foundation & Configuration Complete
- ✅ Authentication System Ready
- ✅ Core Layout & Navigation Done
- ✅ Dashboard with Stats
- ✅ Project Management UI (70%)
- ⏳ Planning Module (Ready)
- ⏳ Progress Tracking (Ready)
- ⏳ Tools Management (Ready)
- ⏳ Stock Management (Ready)
- ⏳ Billing System (Ready)
- ⏳ Quality Control (Ready)
- ⏳ Real-time Features (Ready)
