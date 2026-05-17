/** Base URL aplikasi (tanpa trailing slash). Dipakai untuk OAuth redirect di server & client. */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

export function getOAuthCallbackUrl(): string {
  const base = getSiteUrl()
  return base ? `${base}/api/auth/callback` : '/api/auth/callback'
}

/** Origin dari request (Vercel/proxy-aware). */
export function getRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  const envOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (envOrigin) return envOrigin

  return new URL(request.url).origin
}
