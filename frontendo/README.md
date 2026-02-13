# Project Management Platform - Frontend

A modern, production-ready React frontend for a comprehensive project management platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Overview

This frontend provides a complete user interface for managing projects, planning, progress tracking, tools, inventory, billing, and quality control. It integrates seamlessly with the Node.js/Express backend API.

## Features

### Authentication
- Secure login and registration
- JWT token-based authentication
- Automatic token refresh
- Protected routes

### Core Modules
- **Dashboard**: Overview and quick stats
- **Projects**: Create, manage, and track projects
- **Planning**: Upload and manage project documentation with version control
- **Progress**: Track milestones and overall project progress
- **Tools**: Manage tool inventory and assignments
- **Stock**: Track product inventory and stock movements
- **Billing**: Manage invoices and payments
- **Quality Control**: Track non-conformities and issues
- **Settings & Profile**: User account management

## Tech Stack

- **Framework**: Next.js 14 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Data Fetching**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Custom shadcn/ui components + Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: Day.js
- **Real-time**: Socket.io

## Project Structure

```
frontend/
├── app/                          # Next.js app directory
│   ├── (dashboard)/             # Protected routes
│   │   ├── layout.tsx           # Dashboard layout
│   │   ├── page.tsx             # Dashboard homepage
│   │   ├── projects/            # Projects module
│   │   ├── planning/            # Planning module
│   │   ├── progress/            # Progress tracking
│   │   ├── tools/               # Tools management
│   │   ├── stock/               # Stock/inventory
│   │   ├── billing/             # Billing & invoices
│   │   ├── quality/             # Quality control
│   │   ├── profile/             # User profile
│   │   └── settings/            # Settings
│   ├── auth/                    # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles & design tokens
│
├── components/
│   ├── auth/                    # Auth components
│   ├── layout/                  # Layout components (Sidebar, Navbar)
│   ├── dashboard/               # Dashboard-specific components
│   ├── projects/                # Project components
│   ├── common/                  # Reusable components (Loading, Empty states)
│   └── ui/                      # Base UI components (Button, Input, Card, etc.)
│
├── hooks/
│   ├── useAuth.ts              # Authentication hook
│   ├── useProjects.ts          # Projects data hooks
│   ├── usePlanning.ts          # Planning module hooks
│   ├── useProgress.ts          # Progress tracking hooks
│   ├── useTools.ts             # Tools management hooks
│   ├── useStock.ts             # Stock management hooks
│   ├── useBilling.ts           # Billing hooks
│   └── useQuality.ts           # Quality control hooks
│
├── lib/
│   ├── api/
│   │   ├── client.ts           # Axios configuration
│   │   ├── auth.ts             # Auth API endpoints
│   │   ├── projects.ts         # Projects API
│   │   ├── planning.ts         # Planning API
│   │   ├── progress.ts         # Progress API
│   │   ├── tools.ts            # Tools API
│   │   ├── stock.ts            # Stock API
│   │   ├── billing.ts          # Billing API
│   │   ├── quality.ts          # Quality API
│   │   └── dashboard.ts        # Dashboard API
│   ├── config/
│   │   └── query-client.ts     # React Query configuration
│   └── utils/
│       ├── formatting.ts       # Formatting utilities
│       └── cn.ts               # Classname merge utility
│
├── store/
│   ├── auth-store.ts           # Zustand auth store
│   └── ui-store.ts             # Zustand UI state
│
├── types/
│   └── index.ts                # TypeScript type definitions
│
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.js
└── .env.local.example
```

## Installation

### Prerequisites
- Node.js 18+ and pnpm

### Setup

1. **Install dependencies**
   ```bash
   cd frontend
   pnpm install
   ```

2. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3001](http://localhost:3001) in your browser.

## Usage

### Authentication Flow

1. Navigate to `/auth/register` to create a new account
2. Or go to `/auth/login` with existing credentials
3. After successful authentication, you'll be redirected to the dashboard
4. JWT token is stored in localStorage and automatically included in API requests

### Module Navigation

Use the sidebar on the left to navigate between modules:
- **Dashboard**: Get overview of all projects and stats
- **Projects**: Manage all projects
- **Planning**: Upload and manage project documentation
- **Progress**: Track project milestones
- **Tools**: Manage tool inventory
- **Stock**: Track product inventory
- **Billing**: Manage invoices
- **Quality**: Track and resolve quality issues

## API Integration

The frontend communicates with the backend API at the URL specified in `NEXT_PUBLIC_API_URL`. All requests include JWT authentication headers automatically.

### API Endpoints Reference

- **Auth**: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`
- **Projects**: `/api/projects`, `/api/projects/:id`
- **Planning**: `/api/projects/:id/plans`, `/api/projects/:id/plans/:planId/versions`
- **Progress**: `/api/projects/:id/milestones`, `/api/projects/:id/progress`
- **Tools**: `/api/projects/:id/tools`, `/api/projects/:id/tool-assignments`
- **Stock**: `/api/projects/:id/products`, `/api/projects/:id/stock-movements`
- **Billing**: `/api/projects/:id/invoices`, `/api/projects/:id/billing-rules`
- **Quality**: `/api/projects/:id/non-conformities`
- **Dashboard**: `/api/dashboard`

## State Management

### Zustand Stores

**Auth Store** (`store/auth-store.ts`)
- Manages authentication state
- Stores user info and JWT token
- Handles login/logout/register

**UI Store** (`store/ui-store.ts`)
- Manages UI state
- Sidebar collapse state
- Theme preferences

### React Query

Data fetching is managed through React Query with custom hooks in the `hooks/` directory. Each module has a dedicated hook file:

```typescript
import { useProjects } from '@/hooks/useProjects'

const { data, isLoading, error } = useProjects()
```

## Styling

The frontend uses Tailwind CSS v4 with a custom design system defined in `app/globals.css`:

```css
@theme inline {
  --color-primary: #2563eb;
  --color-secondary: #1e293b;
  /* ... more tokens ... */
}
```

### Color Palette
- **Primary**: Blue (#2563eb)
- **Secondary**: Slate (#1e293b)
- **Accent**: Blue (#0ea5e9)
- **Neutrals**: Slate shades

## Development

### Adding a New Module

1. Create API functions in `lib/api/module-name.ts`
2. Create React Query hooks in `hooks/useModuleName.ts`
3. Create components in `components/module-name/`
4. Add pages under `app/(dashboard)/module-name/`
5. Add types to `types/index.ts`

### Component Development

Follow these patterns:

```typescript
'use client' // Add for client components

import { useModuleName } from '@/hooks/useModuleName'
import { Button } from '@/components/ui/button'

export default function ModulePage() {
  const { data, isLoading } = useModuleName()
  
  return (
    <div className="space-y-6">
      {/* Content */}
    </div>
  )
}
```

### Form Handling

Use React Hook Form with Zod validation:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
})

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
})
```

## Performance Optimization

- **Code Splitting**: Next.js automatically code-splits per route
- **Image Optimization**: Use Next.js Image component for images
- **Data Caching**: React Query caches API responses
- **Lazy Loading**: Components load on demand
- **CSS**: Tailwind purges unused styles in production

## Error Handling

Global error handling with notifications:

```typescript
const { data, error } = useQuery({
  queryKey: ['data'],
  queryFn: async () => {
    try {
      return await api.getData()
    } catch (error) {
      // Error is caught and displayed via toast
      throw error
    }
  },
})
```

## Real-time Updates

Socket.io is configured for real-time updates:

```typescript
// Configured in lib/api/client.ts
// Automatic reconnection and event handling
```

## Building for Production

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

## Troubleshooting

### API Connection Issues
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend server is running
- Check browser console for CORS errors

### Authentication Issues
- Clear localStorage and cookies
- Check JWT expiration
- Verify backend authentication setup

### Performance Issues
- Check React Query cache settings
- Monitor Network tab in DevTools
- Use React DevTools Profiler

## Contributing

1. Create a feature branch
2. Follow the project structure conventions
3. Write TypeScript with proper types
4. Test your changes
5. Submit a pull request

## License

Proprietary - All Rights Reserved

## Support

For issues and questions, contact the development team or check the backend documentation.
