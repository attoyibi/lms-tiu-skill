import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/practice', '/analysis', '/materials']
const AUTH_ROUTES = ['/auth/login', '/auth/register']

/** Supabase kadang redirect ke Site URL (/?code=) jika callback belum di-whitelist. */
function redirectOAuthCodeToCallback(request: NextRequest): NextResponse | null {
    const { pathname, searchParams } = request.nextUrl
    const code = searchParams.get('code')

    if (!code || pathname === '/api/auth/callback') {
        return null
    }

    const callbackUrl = request.nextUrl.clone()
    callbackUrl.pathname = '/api/auth/callback'
    callbackUrl.search = ''
    callbackUrl.searchParams.set('code', code)

    const next = searchParams.get('next')
    if (next) {
        callbackUrl.searchParams.set('next', next)
    }

    return NextResponse.redirect(callbackUrl)
}

export async function middleware(request: NextRequest) {
    const oauthRedirect = redirectOAuthCodeToCallback(request)
    if (oauthRedirect) {
        return oauthRedirect
    }

    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl
    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

    if (isProtected && !user) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/',
        '/auth/:path*',
        '/dashboard/:path*',
        '/practice/:path*',
        '/analysis/:path*',
        '/materials/:path*',
    ],
}
