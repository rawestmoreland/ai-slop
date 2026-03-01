import { useMutation } from '@tanstack/react-query';
import { getPbClient } from '@/lib/pb';
import type { WaitlistMetadata } from '#/types/waitlist';

interface WaitlistSignupPayload {
  first_name?: string;
  last_name?: string;
  email: string;
  message: string;
  metadata?: WaitlistMetadata;
}

export function useWaitlistSignup() {
  return useMutation({
    mutationFn: async ({ payload }: { payload: WaitlistSignupPayload }) => {
      const pb = getPbClient();
      const response = await pb.collection('waitlist_users').create(payload, {
        query: {
          key: 'LATENT2026',
        },
      });
      console.log('[waitlist] response:', response.ok);
      return response;
    },
    onError: (error) => {
      console.error('[waitlist] error:', error.message);
      if ('data' in error) console.error('[waitlist] error data:', error.data);
    },
  });
}
