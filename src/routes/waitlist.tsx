import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequestIP } from '@tanstack/react-start/server';
import { cn } from '@/lib/utils';
import { WaitlistForm } from '@/components/features/WaitlistForm';
import { useWaitlistSignup } from '#/hooks/use-waitlist-signup';
import type { WaitlistSubmission } from '#/types/waitlist';

const getClientIp = createServerFn().handler(() => {
  return getRequestIP({ xForwardedFor: true }) ?? null;
});

export const Route = createFileRoute('/waitlist')({
  component: WaitlistPage,
  loader: async () => {
    const ip = await getClientIp();
    return { ip };
  },
});

function WaitlistPage() {
  const { ip } = Route.useLoaderData();

  const {
    mutateAsync: signup,
    isError,
    error,
    isSuccess,
  } = useWaitlistSignup();

  const handleSignup = async (submission: WaitlistSubmission) => {
    await signup({
      payload: {
        first_name: submission.first_name,
        last_name: submission.last_name,
        email: submission.email,
        message: submission.metadata.userAgent,
        metadata: submission.metadata,
      },
    });
  };

  return (
    <main>
      <section className='relative overflow-hidden px-4 pb-24 pt-20 sm:pb-32 sm:pt-28'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 -z-10'
        >
          <div className='absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-purple-900/20 blur-3xl' />
          <div className='absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-blue-900/15 blur-3xl' />
        </div>

        <div className='page-wrap flex flex-col items-center'>
          <div
            className={cn(
              'mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5',
              'border border-white/[0.08] bg-white/[0.04] text-sm font-medium text-purple-300',
              'fade-up',
            )}
          >
            <span className='h-1.5 w-1.5 rounded-full bg-purple-400' />
            Early access
          </div>

          <h1
            className={cn(
              'mb-4 max-w-xl text-center text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]',
              'fade-up [animation-delay:80ms]',
            )}
          >
            Be first to{' '}
            <span className='text-purple-400'>share your work.</span>
          </h1>

          <p
            className={cn(
              'mb-10 max-w-md text-center text-base text-muted-light sm:text-lg',
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
              onSubmit={handleSignup}
              hasError={isError}
              errorMessage={error?.message}
              isSubmitted={isSuccess}
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
    </main>
  );
}
