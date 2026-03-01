# Skill: New PocketBase Collection

Set up a new PocketBase collection for the AI Slop project: define the schema, create TypeScript types, and write the service layer.

## Instructions

When the user asks to add a new data model or collection, follow these steps:

1. **Define the collection schema** in plain terms (field names, types, rules).
2. **Create the TypeScript type** in `src/types/`.
3. **Write the service module** in `src/services/`.
4. **Write the query hook(s)** in `src/hooks/`.

---

## 1. TypeScript Type

Extend `RecordModel` from the `pocketbase` package for all collection records.

```ts
// src/types/post.ts
import type { RecordModel } from 'pocketbase'

export interface Post extends RecordModel {
  title: string
  body: string
  author: string       // relation field — holds record ID
  tags: string[]       // multi-value field
  visibility: 'public' | 'private' | 'draft'
  likes: number
  // PocketBase adds: id, created, updated, collectionId, collectionName
}

// Expanded type when relation is fetched via ?expand=
export interface PostExpanded extends Post {
  expand: {
    author: import('./user').User
  }
}
```

---

## 2. Service Module

All PocketBase calls live in typed service functions — never call `pb.collection()` in a component.

```ts
// src/services/posts.ts
import { getPbClient } from '@/lib/pb'
import type { Post, PostExpanded } from '@/types/post'

const COLLECTION = 'posts'

export async function fetchPosts(page = 1, perPage = 20): Promise<Post[]> {
  const pb = getPbClient()
  const result = await pb.collection(COLLECTION).getList<Post>(page, perPage, {
    sort: '-created',
    filter: 'visibility = "public"',
  })
  return result.items
}

export async function fetchPost(id: string): Promise<PostExpanded> {
  const pb = getPbClient()
  return pb.collection(COLLECTION).getOne<PostExpanded>(id, {
    expand: 'author',
  })
}

export async function createPost(data: {
  title: string
  body: string
  tags?: string
  visibility?: Post['visibility']
}): Promise<Post> {
  const pb = getPbClient()
  return pb.collection(COLLECTION).create<Post>({
    ...data,
    author: pb.authStore.record?.id,
    visibility: data.visibility ?? 'public',
  })
}

export async function updatePost(id: string, data: Partial<Pick<Post, 'title' | 'body' | 'tags' | 'visibility'>>): Promise<Post> {
  const pb = getPbClient()
  return pb.collection(COLLECTION).update<Post>(id, data)
}

export async function deletePost(id: string): Promise<void> {
  const pb = getPbClient()
  await pb.collection(COLLECTION).delete(id)
}
```

---

## 3. Query Hook

```ts
// src/hooks/use-posts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchPosts, fetchPost, createPost, deletePost } from '@/services/posts'

// Centralized query key factory for this feature
export const postsKeys = {
  all: ['posts'] as const,
  lists: () => [...postsKeys.all, 'list'] as const,
  list: (page: number) => [...postsKeys.lists(), { page }] as const,
  detail: (id: string) => [...postsKeys.all, 'detail', id] as const,
}

export function usePosts(page = 1) {
  return useQuery({
    queryKey: postsKeys.list(page),
    queryFn: () => fetchPosts(page),
  })
}

export function usePost(id: string) {
  return useQuery({
    queryKey: postsKeys.detail(id),
    queryFn: () => fetchPost(id),
    enabled: Boolean(id),
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    },
  })
}
```

---

## PocketBase Client Singleton

Make sure `src/lib/pb.ts` exports a stable singleton:

```ts
// src/lib/pb.ts
import PocketBase from 'pocketbase'

let pb: PocketBase | null = null

export function getPbClient(): PocketBase {
  if (!pb) {
    pb = new PocketBase(import.meta.env.VITE_PB_URL ?? 'http://127.0.0.1:8090')
  }
  return pb
}
```

---

## PocketBase Collection Schema Reference

When defining a collection, document its fields in this format before writing code:

```
Collection: posts
Fields:
  - title        text       required, max 120
  - body         text       required, max 10000
  - author       relation   posts -> users, required
  - tags         select     multiple, options: [ai, image, text, code, audio, video]
  - visibility   select     single, options: [public, private, draft], default: public
  - likes        number     default: 0, min: 0
API Rules:
  - list/view:   visibility = "public" || @request.auth.id = author
  - create:      @request.auth.id != ""
  - update:      @request.auth.id = author
  - delete:      @request.auth.id = author
```

---

## Rules to Enforce

- TypeScript types extend `RecordModel` — never define `id`, `created`, `updated` manually
- All PocketBase access goes through service functions — no `pb.collection()` in components
- Query keys defined in the hook file using a key factory object
- Mutations always invalidate relevant queries on success
- Relation fields use the record ID as the stored value — use `expand` for fetching the full record
- Filter strings use PocketBase filter syntax — validate against PocketBase docs
- Env var for PocketBase URL: `VITE_PB_URL`

## Checklist Before Finishing

- [ ] TypeScript type created in `src/types/` extending `RecordModel`
- [ ] Expanded type defined if relations will be fetched
- [ ] Service module in `src/services/` — no raw PocketBase calls elsewhere
- [ ] Query hook in `src/hooks/use-<collection>.ts`
- [ ] Query key factory defined and exported from the hook file
- [ ] Mutations invalidate query lists on success
- [ ] Collection schema documented in comments or docs before implementation
