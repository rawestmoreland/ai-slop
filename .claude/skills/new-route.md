# Skill: New Route

Create a new Tanstack Router file-based route for the AI Slop project.

## Instructions

When the user asks to add a new page or route, follow these steps:

1. **Determine the route path** from the user's request and map it to a file under `src/routes/`.

   | URL Pattern           | File Path                              |
   |-----------------------|----------------------------------------|
   | `/feed`               | `src/routes/feed.tsx`                  |
   | `/profile/$username`  | `src/routes/profile/$username.tsx`     |
   | `/settings/account`   | `src/routes/settings/account.tsx`      |
   | `/_authenticated/...` | `src/routes/_authenticated/....tsx`    |

2. **Check if a layout route** is needed. Authenticated routes belong under a `_authenticated` layout that checks auth before rendering.

3. **Generate the route file** following this structure:

```tsx
// src/routes/feed.tsx
import { createFileRoute } from '@tanstack/react-router'
import { FeedPage } from '@/components/features/feed/FeedPage'

export const Route = createFileRoute('/feed')({
  component: FeedPage,
})
```

For routes with **loaders** (critical data needed before render):

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { queryClient } from '@/lib/queryClient'
import { postsQueryOptions } from '@/hooks/use-posts'
import { FeedPage } from '@/components/features/feed/FeedPage'

export const Route = createFileRoute('/feed')({
  loader: () => queryClient.ensureQueryData(postsQueryOptions()),
  component: FeedPage,
})
```

For routes with **typed search params**:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  q: z.string().optional(),
})

export const Route = createFileRoute('/explore')({
  validateSearch: searchSchema,
  component: ExplorePage,
})
```

For routes with **dynamic params**:

```tsx
export const Route = createFileRoute('/profile/$username')({
  loader: ({ params }) => fetchProfile(params.username),
  component: ProfilePage,
})

// Inside the component:
function ProfilePage() {
  const { username } = Route.useParams()
  // ...
}
```

## Page Component Conventions

The actual page UI lives in `src/components/features/<feature>/` — the route file is only a thin connector.

```tsx
// src/components/features/feed/FeedPage.tsx
export function FeedPage() {
  return (
    <main className="min-h-screen bg-[#060611]">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* page content */}
      </div>
    </main>
  )
}
```

## Auth-Protected Route Pattern

```tsx
// src/routes/_authenticated.tsx  (layout)
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getPbClient } from '@/lib/pb'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const pb = getPbClient()
    if (!pb.authStore.isValid) {
      throw redirect({ to: '/login' })
    }
  },
})
```

## Checklist Before Finishing

- [ ] Route file uses `createFileRoute` with the correct path string
- [ ] Page UI is in `src/components/features/`, not inline in the route file
- [ ] Loaders use `queryClient.ensureQueryData` for Tanstack Query integration
- [ ] Search params validated with Zod if the route accepts query string params
- [ ] Auth-protected routes live under `_authenticated` layout
- [ ] No emojis anywhere
