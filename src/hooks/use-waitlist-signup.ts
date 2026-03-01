import { useMutation } from '@tanstack/react-query';
import { getPbClient } from '@/lib/pb';

interface WaitlistSignupPayload {
  firstName?: string;
  lastName?: string;
  email: string;
  message: string;
}

export async function useWaitlistSignup() {
  return useMutation({
    mutationFn: async ({ payload }: { payload: WaitlistSignupPayload }) => {
      const pb = getPbClient();
      return pb.collection('waitlist_users').create(payload, {
        query: {
          key: 'LATENT2026',
        },
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
