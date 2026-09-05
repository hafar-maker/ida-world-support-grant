import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )
  await supabase.auth.getUser()

  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase()
  const pathname = request.nextUrl.pathname
  if (host === 'agent.idawsg.com' && (pathname === '/' || pathname === '')) {
    const url = request.nextUrl.clone(); url.pathname = '/agent'; return NextResponse.rewrite(url)
  }
  if (host === 'admin.idawsg.com' && (pathname === '/' || pathname === '')) {
    const url = request.nextUrl.clone(); url.pathname = '/admin'; return NextResponse.rewrite(url)
  }
  return response
}

export const config = { matcher: ['/dashboard/:path*', '/agent/:path*', '/admin/:path*', '/apply/:path*', '/'] }
