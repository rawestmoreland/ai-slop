import type { WaitlistMetadata } from '@/types/waitlist'

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent
  if (/Mobi|Android/i.test(ua)) return 'mobile'
  if (/Tablet|iPad/i.test(ua)) return 'tablet'
  return 'desktop'
}

export function collectClientMetadata(ip: string | null): WaitlistMetadata {
  return {
    userAgent: navigator.userAgent,
    deviceType: getDeviceType(),
    screen: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    referrer: document.referrer || null,
    ip,
    submittedAt: new Date().toISOString(),
  }
}
