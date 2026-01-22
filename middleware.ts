import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем API routes и статические файлы
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next()
  }

  // Защищенные маршруты
  const protectedRoutes = ['/dashboard', '/my-prompts']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Проверяем наличие session token в cookies
    // NextAuth использует cookie с именем 'authjs.session-token' или 'next-auth.session-token'
    const sessionToken = request.cookies.get('authjs.session-token') || 
                        request.cookies.get('__Secure-authjs.session-token') ||
                        request.cookies.get('next-auth.session-token') ||
                        request.cookies.get('__Secure-next-auth.session-token')

    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/my-prompts/:path*',
  ],
}
