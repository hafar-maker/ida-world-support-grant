import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
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

  const host = (request.headers.get('x-forwarded-host') || request.headers.get('host'))?.split(':')[0]?.toLowerCase()
  const pathname = request.nextUrl.pathname
  const isAgentHost = host === 'agent.idawsg.com'
  const isAdminHost = host === 'admin.idawsg.com'

  // Allow the shared login page to render on staff subdomains.
  if ((isAgentHost || isAdminHost) && pathname === '/login') {
    return response
  }

  const { data: { user } } = await supabase.auth.getUser()
  let role: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    role = profile?.role || null
  }

  if (isAgentHost) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', '/agent')
      return NextResponse.redirect(url)
    }
    if (role !== 'agent' && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'staff_access_required')
      return NextResponse.redirect(url)
    }
    if (pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/agent'
      return NextResponse.rewrite(url)
    }
    if (!pathname.startsWith('/agent')) {
      const url = request.nextUrl.clone()
      url.pathname = '/agent' + pathname
      return NextResponse.rewrite(url)
    }
  }

  if (isAdminHost) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', '/admin')
      return NextResponse.redirect(url)
    }
    if (role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'admin_access_required')
      return NextResponse.redirect(url)
    }
    if (pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.rewrite(url)
    }
    if (!pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin' + pathname
      return NextResponse.rewrite(url)
    }
  }

  if ((pathname === '/dashboard' || pathname.startsWith('/dashboard/')) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (pathname === '/apply' && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', '/apply')
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/:path*'],
}
