# Latent — Claude Code Rules

## Project Overview

Latent is a social network for showcasing AI-generated content. Users can display, share, and celebrate their AI-generated work. The codebase prioritizes clean, type-safe code and a consistent design language.

---

## Tech Stack

### Frontend

- **Framework**: Tanstack Start (React, SSR-first)
- **Routing**: Tanstack Router (file-based routes)
- **Data Fetching**: Tanstack Query (server state, caching)
- **Tables**: Tanstack Table
- **Forms**: React Hook Form + Zod (schema-driven validation)
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn UI (Radix primitives + Tailwind)

### Backend (MVP)

- **Database + API**: PocketBase (self-hosted BaaS)
- **Auth**: PocketBase built-in auth
- Future: Migrate to Postgres + custom API when scale demands it

---

## Design System

### Theme: Glass-morphic Dark

The UI is glass-morphic — layered translucent surfaces over a deep dark background. Keep it refined and minimal. No clutter.

### Color Palette

```
Background     #060611   (near-black, blue-tinted)
Surface-1      #0D0D1F   (dark navy — card bases)
Surface-2      #12122A   (slightly lighter — nested surfaces)
Surface-3      #1A1A38   (elevated panels)

Glass fill     rgba(255,255,255,0.04)
Glass border   rgba(255,255,255,0.08)
Glass hover    rgba(255,255,255,0.07)

Purple-900     #2E1065
Purple-800     #4C1D95
Purple-700     #5B21B6
Purple-600     #7C3AED   ← primary brand
Purple-500     #8B5CF6
Purple-400     #A78BFA   ← primary light / interactive
Purple-300     #C4B5FD   ← hover states

Blue-900       #1E3A5F
Blue-700       #1D4ED8
Blue-500       #3B82F6   ← accent
Blue-400       #60A5FA

Foreground     #F4F4FF   (near-white, slightly cool)
Muted          #64748B   (slate-500)
Muted-light    #94A3B8   (slate-400)

Success        #22D3EE   (cyan-400)
Warning        #F59E0B   (amber-400)
Destructive    #F43F5E   (rose-500)
```

Map these to Tailwind CSS custom properties in `tailwind.config.ts` and expose as CSS variables on `:root`.

### Glass Component Pattern

```css
/* Base glass surface */
background: rgba(255, 255, 255, 0.04);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 12px;
```

Use Tailwind utility classes — prefer composing from `bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl`.

### Typography

- Font: System font stack as fallback; add `Inter` or `Geist` as primary sans-serif
- Headings: `font-semibold` or `font-bold`, never all-caps for body text
- Code: `font-mono` with a slightly purple-tinted monospace feel

### Strict Design Rules

1. **NO EMOJIS** — ever, in any file, component, copy, or commit message. This is a hard rule.
2. **Minimal gradients** — avoid decorative gradients. Subtle gradients are allowed only for interactive states (e.g., button hover shimmer) and must be purposeful.
3. **No shadows by default** — prefer border-based depth over box shadows. If a shadow is needed, keep it subtle and dark-toned.
4. **Spacing**: Use Tailwind's 4px grid. Prefer `gap-*`, `p-*`, `m-*` utilities. Do not use arbitrary values unless absolutely necessary.
5. **Border radius**: `rounded-xl` (12px) for cards/panels, `rounded-lg` (8px) for inputs/buttons, `rounded-full` for pills/badges only.
6. **Interactive states**: All interactive elements must have visible focus rings using `focus-visible:ring-2 focus-visible:ring-purple-400`.

---

## Code Conventions

### General

- TypeScript everywhere — no `any`, no implicit `any`. Use `unknown` when the type is genuinely unknown and narrow it.
- Prefer `const` over `let`. Never use `var`.
- Named exports over default exports for components and utilities. Exception: route files (Tanstack Router convention).
- No barrel `index.ts` files unless the directory is a true public API boundary.
- Keep files focused. One primary export per file for components.

### Component Structure

```tsx
// 1. Imports (external first, internal second, types last)
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

// 2. Types
interface PostCardProps {
  post: Post;
  className?: string;
}

// 3. Component
export function PostCard({ post, className }: PostCardProps) {
  // hooks first
  // derived state
  // handlers
  // render
  return <div className={cn('...', className)}>{/* content */}</div>;
}
```

- Always accept and forward a `className` prop on presentational components using `cn()` from `@/lib/utils`.
- Keep components small. Extract sub-components when a component exceeds ~100 lines.

### Tailwind

- Use `cn()` (clsx + tailwind-merge) for conditional class merging — always, never string concatenation.
- Order Tailwind classes: layout → box model → typography → visual → interactive → responsive → dark.
- Avoid inline `style` props. Everything goes through Tailwind unless it's a truly dynamic computed value (e.g., a CSS variable set from JS).

### Forms

- All forms use **React Hook Form** with a **Zod** schema.
- Define the schema first, derive the form type from it with `z.infer<>`.
- Use Shadcn's `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormMessage>` wrappers.
- Never manage form state with `useState`.

```tsx
const schema = z.object({
  title: z.string().min(1, 'Title is required').max(120),
});

type FormValues = z.infer<typeof schema>;
```

### Data Fetching

- All server state lives in **Tanstack Query**.
- Define query/mutation keys in a central `queryKeys.ts` file per feature.
- Queries go in `hooks/use-*.ts` files, not inline in components.
- Mutations use `useMutation` and invalidate relevant queries on success.
- Never use `useEffect` to fetch data.

### Routing (Tanstack Router)

- Use file-based routing under `src/routes/`.
- Route loaders handle data prefetching — use them for critical above-the-fold data.
- Use `createFileRoute` per Tanstack Router conventions.
- Typed route params and search params — define them in the route file.

### PocketBase

- Create a singleton PocketBase client in `src/lib/pb.ts`.
- Never call `pb.collection()` directly in components — wrap in typed service functions under `src/services/`.
- Type PocketBase records by extending `RecordModel` from `pocketbase`.
- Handle auth state via PocketBase's `authStore` and expose via a React context/hook.

---

## File Structure (Target)

```
src/
  routes/           # Tanstack Router file-based routes
  components/
    ui/             # Shadcn primitives (auto-generated, do not edit)
    shared/         # App-wide shared components
    features/       # Feature-scoped components
  hooks/            # Shared React hooks (use-*.ts)
  services/         # PocketBase service layer
  lib/
    pb.ts           # PocketBase singleton
    utils.ts        # cn() and other utilities
    queryKeys.ts    # Tanstack Query key factory
  types/            # Shared TypeScript types/interfaces
  styles/           # Global CSS, Tailwind base
```

---

## What to Avoid

- No class components
- No `React.FC` — use plain function signatures with typed props
- No `any` casts — use proper types or `unknown`
- No prop drilling beyond 2 levels — use context or query state
- No `useEffect` for data fetching or derived state calculations
- No direct DOM manipulation
- No hardcoded colors — always use the design token variables
- No emojis in any output, copy, comment, or commit message
