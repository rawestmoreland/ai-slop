import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestIP } from '@tanstack/react-start/server'
import { cn } from '@/lib/utils'
import { WaitlistForm } from '@/components/features/WaitlistForm'
import { useWaitlistSignup } from '#/hooks/use-waitlist-signup'
import { isPocketBaseFieldError } from '@/lib/pb-errors'
import type { WaitlistSubmission } from '#/types/waitlist'

const LAUNCH_DATE = new Date('2026-07-04T00:00:00Z')
const SUPPORTED_TOOLS = 14

const getClientIp = createServerFn().handler(() => {
  return getRequestIP({ xForwardedFor: true }) ?? null
})

const getWaitlistCount = createServerFn().handler(async () => {
  try {
    const { getPbClient } = await import('@/lib/pb')
    const pb = getPbClient()
    const result = await pb.collection('waitlist_users').getList(1, 1, {
      query: { key: 'LATENT2026' },
    })
    return result.totalItems
  } catch {
    return 0
  }
})

export const Route = createFileRoute('/')({
  component: LandingPage,
  loader: async () => {
    const [ip, waitlistCount] = await Promise.all([
      getClientIp(),
      getWaitlistCount(),
    ])
    const daysUntilLaunch = Math.max(
      0,
      Math.ceil((LAUNCH_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    )
    return { ip, waitlistCount, daysUntilLaunch }
  },
})

const FEATURES = [
  {
    title: 'Share anything',
    description:
      'Post images, text, code, audio — whatever your model made. No format restrictions, no judgment.',
  },
  {
    title: 'Discover creators',
    description:
      'Browse a curated feed of the most interesting AI-generated work from creators around the world.',
  },
  {
    title: 'Build your portfolio',
    description:
      'Curate your best AI outputs into a clean, shareable profile. Show your process, not just the result.',
  },
] as const

function LandingPage() {
  const { ip, waitlistCount, daysUntilLaunch } = Route.useLoaderData()

  const {
    mutateAsync: signup,
    isError,
    error,
    isSuccess,
  } = useWaitlistSignup()

  const handleSignup = async (submission: WaitlistSubmission) => {
    await signup({
      payload: {
        first_name: submission.first_name,
        last_name: submission.last_name,
        email: submission.email,
        message: submission.metadata.userAgent,
        metadata: submission.metadata,
      },
    })
  }

  return (
    <main>
      <HeroSection
        ip={ip}
        onSubmit={handleSignup}
        isSubmitted={isSuccess}
        hasError={
          isError &&
          !isPocketBaseFieldError(error, 'email', [
            'validation_not_unique',
            'validation_email_domain_not_allowed',
          ])
        }
        errorMessage={error?.message}
      />
      <StatsSection
        waitlistCount={waitlistCount}
        daysUntilLaunch={daysUntilLaunch}
      />
      <FeaturesSection />
      <CtaSection />
    </main>
  )
}

interface HeroSectionProps {
  ip: string | null
  onSubmit: (submission: WaitlistSubmission) => Promise<void>
  isSubmitted: boolean
  hasError: boolean
  errorMessage: string | undefined
}

function HeroSection({
  ip,
  onSubmit,
  isSubmitted,
  hasError,
  errorMessage,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:pb-32 sm:pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-purple-900/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-blue-900/15 blur-3xl" />
      </div>

      <div className="page-wrap flex flex-col items-center text-center">
        <div
          className={cn(
            'mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5',
            'border border-white/[0.08] bg-white/[0.04] text-sm font-medium text-purple-300',
            'fade-up',
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          Coming soon
        </div>

        <h1
          className={cn(
            'mb-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl sm:leading-[1.08]',
            'fade-up [animation-delay:80ms]',
          )}
        >
          Your AI work{' '}
          <span className="text-purple-400">deserves an audience.</span>
        </h1>

        <p
          className={cn(
            'mb-10 max-w-xl text-base text-muted-light sm:text-lg',
            'fade-up [animation-delay:160ms]',
          )}
        >
          Latent is launching soon. Join the waitlist and get early access to
          the social network built for AI creators.
        </p>

        <div
          className={cn(
            'w-full max-w-md rounded-xl p-6 sm:p-8',
            'border border-white/[0.08] bg-white/[0.04] backdrop-blur-md',
            'fade-up [animation-delay:240ms]',
          )}
        >
          <WaitlistForm
            ip={ip}
            onSubmit={onSubmit}
            hasError={hasError}
            errorMessage={errorMessage}
            isSubmitted={isSubmitted}
          />
        </div>

        <p
          className={cn(
            'mt-6 text-center text-xs text-muted',
            'fade-up [animation-delay:320ms]',
          )}
        >
          No spam. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}

interface StatsSectionProps {
  waitlistCount: number
  daysUntilLaunch: number
}

function StatsSection({ waitlistCount, daysUntilLaunch }: StatsSectionProps) {
  const stats = [
    { value: waitlistCount.toLocaleString(), label: 'On the waitlist' },
    { value: daysUntilLaunch.toString(), label: 'Days until launch' },
    { value: `${SUPPORTED_TOOLS}+`, label: 'AI tools at launch' },
  ]

  return (
    <section className="px-4 pb-16">
      <div className="page-wrap">
        <dl
          className={cn(
            'grid grid-cols-3 rounded-xl',
            'border border-white/[0.08] bg-white/[0.04]',
            'divide-x divide-white/[0.08]',
          )}
        >
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 px-6 py-8"
            >
              <dt className="text-2xl font-bold text-foreground sm:text-3xl">
                {value}
              </dt>
              <dd className="text-sm text-muted-light">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="px-4 pb-24">
      <div className="page-wrap">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            Built for the AI era
          </h2>
          <p className="mx-auto max-w-md text-base text-muted-light">
            Everything you need to share your work and connect with other AI
            creators.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map(({ title, description }, index) => (
            <article
              key={title}
              className={cn(
                'rounded-xl p-6',
                'border border-white/[0.08] bg-white/[0.04]',
                'backdrop-blur-md',
                'transition-colors hover:border-white/[0.12] hover:bg-white/[0.07]',
                'fade-up',
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="mb-4 h-8 w-8 rounded-lg bg-purple-900/60 border border-purple-700/40" />
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {title}
              </h3>
              <p className="m-0 text-sm leading-relaxed text-muted-light">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="px-4 pb-24">
      <div className="page-wrap">
        <div
          className={cn(
            'relative overflow-hidden rounded-xl px-8 py-16 text-center',
            'border border-white/[0.08] bg-white/[0.04]',
            'backdrop-blur-md',
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/10" />
          </div>

          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            Get early access.
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-base text-muted-light">
            Be among the first to share your AI-generated work when we launch.
          </p>
          <a
            href="/waitlist"
            className={cn(
              'inline-block rounded-lg bg-purple-600 px-8 py-3 text-sm font-semibold text-white',
              'transition-colors hover:bg-purple-500',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
            )}
          >
            Join the Waitlist
          </a>
        </div>
      </div>
    </section>
  )
}
