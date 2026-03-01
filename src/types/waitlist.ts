export interface WaitlistMetadata {
  userAgent: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  screen: string
  timezone: string
  language: string
  referrer: string | null
  ip: string | null
  submittedAt: string
}

export interface WaitlistSubmission {
  firstName: string
  lastName: string
  email: string
  metadata: WaitlistMetadata
}
