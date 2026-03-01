import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { collectClientMetadata } from '@/lib/metadata';
import type { WaitlistSubmission } from '@/types/waitlist';

const schema = z.object({
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  email: z.email('Enter a valid email'),
});

type FormValues = z.infer<typeof schema>;

interface WaitlistFormProps {
  ip: string | null;
  onSubmit?: (submission: WaitlistSubmission) => Promise<void>;
  isSubmitted?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
}

export function WaitlistForm({
  ip,
  onSubmit,
  isSubmitted = false,
  hasError = false,
  errorMessage,
  className,
}: WaitlistFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '' },
  });

  async function onFormSubmit(values: FormValues) {
    const submission: WaitlistSubmission = {
      first_name: values.firstName ?? '',
      last_name: values.lastName ?? '',
      email: values.email,
      metadata: collectClientMetadata(ip),
    };

    try {
      if (onSubmit) {
        await onSubmit(submission);
      } else {
        // TODO: wire up to PocketBase via src/services/waitlist.ts
        console.log('[waitlist] submission:', submission);
      }
    } catch (err) {
      if (isPocketBaseFieldError(err, 'email', 'validation_not_unique')) {
        setError('email', { message: 'This email is already on the waitlist.' });
      } else {
        throw err;
      }
    }
  }

  if (isSubmitted) {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-4 rounded-xl px-8 py-12 text-center',
          'border border-white/[0.08] bg-white/[0.04] backdrop-blur-md',
          className,
        )}
      >
        <div className='h-10 w-10 rounded-full border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center'>
          <div className='h-2 w-2 rounded-full bg-cyan-400' />
        </div>
        <h3 className='text-lg font-semibold text-foreground'>
          You're on the list
        </h3>
        <p className='max-w-xs text-sm text-muted-light'>
          We'll reach out to{' '}
          <span className='text-purple-300 font-medium'>your email</span> when
          early access opens.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
      className={cn('flex flex-col gap-5', className)}
    >
      <div className='grid gap-4 sm:grid-cols-2'>
        <FormField
          label='First name'
          optional
          error={errors.firstName?.message}
        >
          <input
            {...register('firstName')}
            type='text'
            placeholder='Jane'
            autoComplete='given-name'
            className={cn(inputClass, errors.firstName && inputErrorClass)}
          />
        </FormField>

        <FormField label='Last name' optional error={errors.lastName?.message}>
          <input
            {...register('lastName')}
            type='text'
            placeholder='Smith'
            autoComplete='family-name'
            className={cn(inputClass, errors.lastName && inputErrorClass)}
          />
        </FormField>
      </div>

      <FormField label='Email address' error={errors.email?.message}>
        <input
          {...register('email')}
          type='email'
          placeholder='jane@example.com'
          autoComplete='email'
          className={cn(inputClass, errors.email && inputErrorClass)}
        />
      </FormField>

      {hasError && (
        <p className='text-sm text-rose-400'>
          {errorMessage ?? 'Something went wrong. Please try again.'}
        </p>
      )}

      <button
        type='submit'
        disabled={isSubmitting}
        className={cn(
          'mt-1 w-full rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white',
          'transition-colors hover:bg-purple-500',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {isSubmitting ? 'Joining...' : 'Join the waitlist'}
      </button>
    </form>
  );
}

// Internal sub-components

const inputClass = cn(
  'w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5',
  'text-sm text-foreground placeholder:text-muted',
  'transition-colors hover:border-white/[0.14] hover:bg-white/[0.07]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
);

const inputErrorClass = 'border-rose-500/50 focus-visible:ring-rose-400';

interface FormFieldProps {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, optional, error, children }: FormFieldProps) {
  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex items-center gap-1.5'>
        <span className='text-sm font-medium text-muted-light'>{label}</span>
        {optional && <span className='text-xs text-muted'>optional</span>}
      </div>
      {children}
      {error && <p className='text-xs text-rose-400'>{error}</p>}
    </div>
  );
}

// Narrow a caught error to a specific PocketBase field validation code.
// PocketBase throws ClientResponseError with shape: { data: { [field]: { code: string } } }
function isPocketBaseFieldError(err: unknown, field: string, code: string): boolean {
  if (typeof err !== 'object' || err === null) return false
  const data = (err as Record<string, unknown>)['data']
  if (typeof data !== 'object' || data === null) return false
  const fieldErr = (data as Record<string, unknown>)[field]
  if (typeof fieldErr !== 'object' || fieldErr === null) return false
  return (fieldErr as Record<string, unknown>)['code'] === code
}
