# Skill: New Form

Create a new form using React Hook Form and Zod for the Latent project.

## Instructions

When the user asks to create a form, follow these steps:

1. **Identify all fields** and their validation requirements.
2. **Write the Zod schema first** — the schema is the single source of truth.
3. **Derive the TypeScript type** from the schema with `z.infer<>`.
4. **Build the form** using Shadcn's `<Form>` components wrapping React Hook Form.
5. **Wire the submit handler** — typically a Tanstack Query `useMutation`.

## Template

```tsx
// src/components/features/posts/CreatePostForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createPost } from '@/services/posts';

// 1. Schema — always defined first
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Title is too long'),
  body: z.string().min(1, 'Body is required').max(10_000),
  tags: z.string().optional(),
});

type CreatePostValues = z.infer<typeof createPostSchema>;

// 2. Component
export function CreatePostForm() {
  const form = useForm<CreatePostValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      body: '',
      tags: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      form.reset();
      // navigate or invalidate queries here
    },
  });

  function onSubmit(values: CreatePostValues) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder='Give your slop a title'
                  className='bg-white/[0.04] border-white/[0.08]'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='body'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Paste your AI Content here...'
                  className='min-h-32 bg-white/[0.04] border-white/[0.08] resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={isPending}
          className='w-full bg-purple-600 hover:bg-purple-500 text-white'
        >
          {isPending ? 'Posting...' : 'Post'}
        </Button>
      </form>
    </Form>
  );
}
```

## Validation Patterns

```ts
// Required string
z.string().min(1, 'Field is required');

// Optional string with max length
z.string().max(200).optional();

// Email
z.string().email('Enter a valid email');

// URL (optional)
z.string().url('Enter a valid URL').optional().or(z.literal(''));

// Enum / select
z.enum(['public', 'private', 'draft'], {
  required_error: 'Visibility is required',
});

// Number from string input
z.coerce.number().int().min(1);

// Confirmed password
const schema = z
  .object({
    password: z.string().min(8),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });
```

## Multi-Step Form Pattern

For multi-step forms, manage the step index outside React Hook Form and keep one unified Zod schema. Use `form.trigger(['field1', 'field2'])` to validate individual steps before advancing.

## Rules to Enforce

- Schema is always defined before the component
- Never use `useState` for form field values — that's RHF's job
- Always use `zodResolver` from `@hookform/resolvers/zod`
- Shadcn's `<FormMessage />` handles error display — do not add custom error text
- `onSubmit` handler receives validated, typed values — no need to validate again
- Inputs use glass styling: `bg-white/[0.04] border-white/[0.08]`
- Submit button shows a pending state string (no spinners unless a spinner component exists)
- No emojis in labels, placeholders, or any copy

## Checklist Before Finishing

- [ ] Zod schema defined before the component
- [ ] `z.infer<>` used to derive the form type
- [ ] `zodResolver` passed to `useForm`
- [ ] Every field wrapped in `<FormField>` + `<FormItem>` + `<FormMessage>`
- [ ] Submit wired to a `useMutation` (not a raw `fetch`)
- [ ] Button disabled while `isPending`
- [ ] No `useState` for field values
- [ ] No emojis in any copy
