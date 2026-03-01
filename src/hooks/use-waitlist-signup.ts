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
      const response = await pb
        .collection('waitlist_users')
        .create(payload, {
          query: {
            key: 'LATENT2026',
          },
        })
        .catch((error) => {
          const { response } = error;
          console.log('[waitlist] response:', response);
          return response;
        });
      return response;
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
