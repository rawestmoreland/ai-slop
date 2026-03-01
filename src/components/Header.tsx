import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[rgba(6,6,17,0.8)] backdrop-blur-md">
      <nav className="page-wrap flex items-center gap-6 py-4">
        <Link
          to="/"
          className={cn(
            'flex items-center gap-2 text-sm font-semibold text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg',
          )}
        >
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          <span className="text-foreground">AI Slop</span>
        </Link>

        <div className="ml-auto flex items-center gap-6 text-sm font-medium text-muted-light">
          <Link
            to="/"
            className={cn(
              'transition-colors hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg',
            )}
            activeProps={{ className: 'text-foreground' }}
          >
            Home
          </Link>

          <a
            href="#features"
            className={cn(
              'transition-colors hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg',
            )}
          >
            Features
          </a>
        </div>

        <a
          href="/signup"
          className={cn(
            'rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white',
            'transition-colors hover:bg-purple-500',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
          )}
        >
          Get Started
        </a>
      </nav>
    </header>
  )
}

export default Header
