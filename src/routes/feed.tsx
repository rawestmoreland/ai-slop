import { createFileRoute } from '@tanstack/react-router'
import { Heart, MessageCircle, Repeat2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/feed')({ component: FeedPage })

// Types

interface Author {
  name: string
  handle: string
  initials: string
  accentClass: string
}

interface ImageMedia {
  kind: 'image'
  gradient: string
  alt: string
}

interface CodeMedia {
  kind: 'code'
  language: string
  code: string
}

interface TextMedia {
  kind: 'text'
}

type PostMedia = ImageMedia | CodeMedia | TextMedia

interface Post {
  id: string
  author: Author
  content: string
  media: PostMedia
  tool: string
  model: string
  prompt?: string
  timestamp: string
  likes: number
  comments: number
  reposts: number
  tags: string[]
}

// Sample Authors

const MAYA: Author = {
  name: 'Maya Chen',
  handle: 'mayachen',
  initials: 'MC',
  accentClass: 'bg-purple-600',
}
const LUCA: Author = {
  name: 'Luca Ferretti',
  handle: 'lucaai',
  initials: 'LF',
  accentClass: 'bg-blue-600',
}
const PRIYA: Author = {
  name: 'Priya Nair',
  handle: 'priyacreates',
  initials: 'PN',
  accentClass: 'bg-cyan-600',
}
const JAMES: Author = {
  name: 'James Okafor',
  handle: 'jamesokafor',
  initials: 'JO',
  accentClass: 'bg-amber-600',
}
const SOFIA: Author = {
  name: 'Sofia Lindqvist',
  handle: 'sofial',
  initials: 'SL',
  accentClass: 'bg-rose-600',
}
const RYO: Author = {
  name: 'Ryo Nakamura',
  handle: 'ryonakamura',
  initials: 'RN',
  accentClass: 'bg-indigo-600',
}

// Sample Posts

const POSTS: Post[] = [
  {
    id: '1',
    author: MAYA,
    content:
      'Been experimenting with Midjourney v6.1 — the fabric texture detail is unreal now. Single prompt, zero post-processing.',
    media: {
      kind: 'image',
      gradient: 'from-purple-950 via-purple-900/70 to-indigo-950',
      alt: 'Silk dress draped over baroque furniture, soft directional lighting',
    },
    tool: 'Midjourney',
    model: 'v6.1',
    prompt:
      'a silk dress draped over a baroque chair, soft directional lighting, photorealistic, 8k detail, muted palette',
    timestamp: '2h',
    likes: 284,
    comments: 31,
    reposts: 12,
    tags: ['midjourney', 'fashion', 'photorealism'],
  },
  {
    id: '2',
    author: LUCA,
    content:
      'Asked Claude to write a clean Python sentiment analyzer with confidence scores. Typed properly, no hallucinations, ran first try.',
    media: {
      kind: 'code',
      language: 'python',
      code: `def analyze_sentiment(text: str) -> dict[str, float]:
    """Return sentiment scores for the given text."""
    tokens = tokenize(text)
    scores = model.predict(tokens)
    return {
        "positive":   round(float(scores[0]), 4),
        "neutral":    round(float(scores[1]), 4),
        "negative":   round(float(scores[2]), 4),
        "confidence": round(float(scores.max()), 4),
    }`,
    },
    tool: 'Claude',
    model: 'Claude Opus 4',
    timestamp: '4h',
    likes: 156,
    comments: 22,
    reposts: 38,
    tags: ['claude', 'python', 'nlp'],
  },
  {
    id: '3',
    author: PRIYA,
    content:
      'DALL-E 3 finally nailing urban wet-surface reflections. The neon-on-asphalt prompt is my new go-to for concept work.',
    media: {
      kind: 'image',
      gradient: 'from-blue-950 via-cyan-900/60 to-slate-950',
      alt: 'Neon-lit rainy alleyway at night with wet asphalt reflections',
    },
    tool: 'DALL-E',
    model: 'DALL-E 3',
    prompt:
      'neon-lit rainy alleyway at night, wet asphalt reflections, cyberpunk, cinematic wide-angle composition',
    timestamp: '5h',
    likes: 412,
    comments: 47,
    reposts: 89,
    tags: ['dalle', 'cyberpunk', 'urban'],
  },
  {
    id: '4',
    author: JAMES,
    content:
      'Gave GPT-4o a tight constraint and it wrote the most haunting 200-word story. The ending completely blindsided me.',
    media: {
      kind: 'text',
    },
    tool: 'GPT-4o',
    model: 'GPT-4o',
    prompt: 'write a 200 word story about the last lighthouse keeper on a flooded Earth, no dialogue',
    timestamp: '7h',
    likes: 89,
    comments: 14,
    reposts: 6,
    tags: ['gpt4o', 'writing', 'scifi'],
  },
  {
    id: '5',
    author: SOFIA,
    content:
      'Stable Diffusion XL with ControlNet for architecture. Starting to replace my early concept sketch workflow entirely.',
    media: {
      kind: 'image',
      gradient: 'from-slate-900 via-zinc-800/60 to-stone-950',
      alt: 'Minimalist concrete pavilion architectural visualization, golden hour',
    },
    tool: 'Stable Diffusion',
    model: 'SDXL + ControlNet',
    prompt:
      'minimalist concrete pavilion, golden hour light, architectural photography, Tadao Ando style, sharp shadows',
    timestamp: '9h',
    likes: 203,
    comments: 19,
    reposts: 24,
    tags: ['stablediffusion', 'architecture', 'design'],
  },
  {
    id: '6',
    author: RYO,
    content:
      'Macro insect photography is my new obsession with Midjourney. Each one took 30 seconds. Would have been a full day in the field.',
    media: {
      kind: 'image',
      gradient: 'from-emerald-950 via-teal-900/60 to-green-950',
      alt: 'Extreme macro photograph of a jewel beetle on black background',
    },
    tool: 'Midjourney',
    model: 'v6.1',
    prompt:
      'extreme macro photography of a jewel beetle, iridescent wings, pure black background, studio ring lighting, 8k',
    timestamp: '12h',
    likes: 341,
    comments: 28,
    reposts: 41,
    tags: ['midjourney', 'nature', 'macro'],
  },
  {
    id: '7',
    author: MAYA,
    content:
      'Built this React sparkline component entirely with Claude. Typed props, no any, works as a server component. Zero iteration needed.',
    media: {
      kind: 'code',
      language: 'tsx',
      code: `interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  className?: string
}

export function Sparkline({
  data,
  color = '#A78BFA',
  height = 40,
  className,
}: SparklineProps) {
  const max = Math.max(...data)
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = height - (v / max) * height
      return \`\${x},\${y}\`
    })
    .join(' ')

  return (
    <svg
      viewBox={\`0 0 100 \${height}\`}
      preserveAspectRatio="none"
      className={className}
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  )
}`,
    },
    tool: 'Claude',
    model: 'Claude Sonnet 4',
    timestamp: '1d',
    likes: 178,
    comments: 33,
    reposts: 52,
    tags: ['claude', 'react', 'typescript'],
  },
]

// Sidebar Data

const TRENDING_TAGS: { tag: string; count: number }[] = [
  { tag: 'midjourney', count: 1204 },
  { tag: 'claude', count: 892 },
  { tag: 'dalle', count: 741 },
  { tag: 'photorealism', count: 634 },
  { tag: 'typescript', count: 521 },
  { tag: 'stablediffusion', count: 489 },
  { tag: 'writing', count: 312 },
]

const SUGGESTED_CREATORS: Author[] = [RYO, SOFIA, JAMES]

// Utilities

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

// Icon map (outside component to avoid re-creation)

type StatIconType = 'heart' | 'comment' | 'repost'

const ICON_MAP: Record<StatIconType, React.ComponentType<{ size?: number }>> = {
  heart: Heart,
  comment: MessageCircle,
  repost: Repeat2,
}

// Components

function FeedPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="page-wrap">
        <FeedHeader />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
          <PostList />
          <FeedSidebar />
        </div>
      </div>
    </main>
  )
}

function FeedHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Feed</h1>
        <p className="mt-1 text-sm text-muted-light">
          Discover the latest AI-generated work
        </p>
      </div>
      <FilterTabs />
    </div>
  )
}

const FILTERS = ['Latest', 'Top', 'Following'] as const

function FilterTabs() {
  return (
    <div className="flex rounded-lg border border-white/[0.08] bg-white/[0.04] p-1">
      {FILTERS.map((f, i) => (
        <button
          key={f}
          className={cn(
            'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
            i === 0
              ? 'bg-purple-600 text-white'
              : 'text-muted-light hover:text-foreground',
          )}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

function PostList() {
  return (
    <div className="flex flex-col gap-4">
      {POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <article
      className={cn(
        'rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md',
        'transition-colors hover:border-white/[0.12] hover:bg-white/[0.07]',
      )}
    >
      <div className="p-4 pb-3">
        <PostCardHeader post={post} />
        <p className="mt-3 text-sm leading-relaxed text-foreground">
          {post.content}
        </p>
      </div>

      {post.media.kind !== 'text' && (
        <PostMediaBlock media={post.media} />
      )}

      {post.prompt && (
        <div className="mx-4 mb-3 mt-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <span className="text-xs font-medium text-muted">Prompt</span>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-light">
            {post.prompt}
          </p>
        </div>
      )}

      <PostCardFooter post={post} />
    </article>
  )
}

function PostCardHeader({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-3">
      <AuthorAvatar author={post.author} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm font-semibold text-foreground">
            {post.author.name}
          </span>
          <span className="text-xs text-muted">@{post.author.handle}</span>
          <span className="text-xs text-muted">&middot;</span>
          <span className="text-xs text-muted">{post.timestamp}</span>
        </div>
      </div>
      <ToolBadge tool={post.tool} model={post.model} />
    </div>
  )
}

function AuthorAvatar({ author }: { author: Author }) {
  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
        'text-xs font-bold text-white',
        author.accentClass,
      )}
    >
      {author.initials}
    </div>
  )
}

function ToolBadge({ tool, model }: { tool: string; model: string }) {
  return (
    <div
      title={model}
      className={cn(
        'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium',
        'border border-purple-700/40 bg-purple-900/30 text-purple-300',
      )}
    >
      {tool}
    </div>
  )
}

function PostMediaBlock({ media }: { media: ImageMedia | CodeMedia }) {
  if (media.kind === 'image') {
    return (
      <div className="relative mx-4 mb-3 aspect-[16/9] overflow-hidden rounded-lg border border-white/[0.06]">
        <div
          className={cn('absolute inset-0 bg-gradient-to-br', media.gradient)}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-2xl" />
          <div className="absolute bottom-1/4 right-1/4 h-24 w-24 translate-x-1/2 translate-y-1/2 rounded-full bg-white/[0.04] blur-xl" />
        </div>
        <div className="absolute bottom-2 right-2 rounded-md bg-black/40 px-2 py-1 text-xs text-white/40 backdrop-blur-sm">
          AI Generated
        </div>
        <span className="sr-only">{media.alt}</span>
      </div>
    )
  }

  return (
    <div className="mx-4 mb-3 overflow-hidden rounded-lg border border-white/[0.06] bg-[#0D0D1F]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
        </div>
        <span className="text-xs text-muted">{media.language}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-xs leading-relaxed text-purple-200/80">
        <code>{media.code}</code>
      </pre>
    </div>
  )
}

function PostCardFooter({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-t border-white/[0.06] px-4 py-3">
      <StatButton icon="heart" count={post.likes} label="likes" />
      <StatButton icon="comment" count={post.comments} label="comments" />
      <StatButton icon="repost" count={post.reposts} label="reposts" />
      <div className="ml-auto flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-xs text-muted-light"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function StatButton({
  icon,
  count,
  label,
}: {
  icon: StatIconType
  count: number
  label: string
}) {
  const Icon = ICON_MAP[icon]
  return (
    <button
      aria-label={`${count} ${label}`}
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted',
        'transition-colors hover:bg-white/[0.06] hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
      )}
    >
      <Icon size={14} />
      <span>{formatCount(count)}</span>
    </button>
  )
}

// Sidebar

function FeedSidebar() {
  return (
    <aside className="hidden flex-col gap-4 lg:flex">
      <TrendingTags />
      <SuggestedCreators />
    </aside>
  )
}

function TrendingTags() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        Trending Tags
      </h2>
      <ul className="flex flex-col gap-0.5">
        {TRENDING_TAGS.map(({ tag, count }) => (
          <li key={tag}>
            <a
              href={`/tags/${tag}`}
              className={cn(
                'flex items-center justify-between rounded-lg px-2 py-1.5',
                'text-sm transition-colors hover:bg-white/[0.06]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
              )}
            >
              <span className="text-purple-400">#{tag}</span>
              <span className="text-xs text-muted">{formatCount(count)}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SuggestedCreators() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        Suggested Creators
      </h2>
      <ul className="flex flex-col gap-2">
        {SUGGESTED_CREATORS.map((author) => (
          <li key={author.handle}>
            <div
              className={cn(
                'flex items-center gap-3 rounded-lg p-1',
                'transition-colors hover:bg-white/[0.06]',
              )}
            >
              <AuthorAvatar author={author} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {author.name}
                </p>
                <p className="text-xs text-muted">@{author.handle}</p>
              </div>
              <button
                className={cn(
                  'shrink-0 rounded-lg border border-purple-700/40 px-3 py-1 text-xs font-medium text-purple-300',
                  'transition-colors hover:bg-purple-900/30',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
                )}
              >
                Follow
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
