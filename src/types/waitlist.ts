export interface WaitlistMetadata {
  userAgent: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screen: string;
  timezone: string;
  language: string;
  referrer: string | null;
  ip: string | null;
  submittedAt: string;
}

export interface WaitlistSubmission {
  first_name: string;
  last_name: string;
  email: string;
  metadata: WaitlistMetadata;
}
