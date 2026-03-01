# Skill: New Component

Create a new React component for the Latent project following all project conventions.

## Instructions

When the user asks to create a new component, follow these steps:

1. **Determine placement** based on the component's scope:
   - `src/components/ui/` — Shadcn primitives only (auto-generated, do not create manually)
   - `src/components/shared/` — reusable across multiple features
   - `src/components/features/<feature-name>/` — scoped to a single feature

2. **Ask** if the component is purely presentational or if it owns any data-fetching/query logic. If it owns data logic, the data hook should live in a separate `hooks/use-<name>.ts` file and be composed into the component.

3. **Generate the component** following this exact structure:

```tsx
// src/components/shared/ExampleCard.tsx
import { cn } from '@/lib/utils';

interface ExampleCardProps {
  title: string;
  description?: string;
  className?: string;
}

export function ExampleCard({
  title,
  description,
  className,
}: ExampleCardProps) {
  return (
    <div
      className={cn(
        'bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6',
        className,
      )}
    >
      <h3 className='text-sm font-semibold text-foreground'>{title}</h3>
      {description && (
        <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      )}
    </div>
  );
}
```

## Rules to Enforce

- Named export — never default export for components
- Always accept and forward `className` using `cn()` from `@/lib/utils`
- No emojis in JSX, copy, or comments
- No inline `style` props — use Tailwind only
- No `React.FC` — use plain function with typed props interface
- Glass surface pattern: `bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl`
- Focus rings on all interactive elements: `focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none`
- Color tokens from the design palette — no hardcoded hex values
- If the component wraps a Shadcn primitive, compose it — do not rebuild it from scratch

## Interactive Component Pattern

For components with click/hover state:

```tsx
<button
  className={cn(
    'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
    'bg-purple-600 text-white',
    'hover:bg-purple-500',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
    'disabled:pointer-events-none disabled:opacity-50',
    className,
  )}
>
  {children}
</button>
```

## Checklist Before Finishing

- [ ] Types defined before the component
- [ ] `className` prop accepted and applied via `cn()`
- [ ] No emojis anywhere in the file
- [ ] Colors reference design tokens, not hardcoded values
- [ ] Component is under 100 lines; if longer, extract sub-components
- [ ] File is in the correct directory based on scope
