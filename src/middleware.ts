import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { UserRole } from './lib/models/User';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;
  
  // Define protected routes and required roles
  const dashboardRoutes = ['/dashboard', '/dashboard/admin', '/dashboard/superadmin'];
  const adminRoutes = ['/dashboard/admin', '/dashboard/superadmin'];
  const superadminRoutes = ['/dashboard/superadmin'];
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/auth/error'];
  
  // Check if user is trying to access auth pages while logged in
  if (token && path.startsWith('/auth/')) {
    // Redirect authenticated users from auth pages to homepage instead of dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // For protected routes, check authentication
  if (dashboardRoutes.some(route => path.startsWith(route))) {
    // If not authenticated, redirect to sign in
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    
    const userRole = token.role as UserRole;
    
    // For base dashboard path, only allow members, admins and superadmins
    if (path === '/dashboard' && !['member', 'admin', 'superadmin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Check admin routes
    if (adminRoutes.some(route => path.startsWith(route)) && !['admin', 'superadmin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Check superadmin routes
    if (superadminRoutes.some(route => path.startsWith(route)) && userRole !== 'superadmin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Redirect admin, superadmin and member roles from public routes to dashboard
  if (token && ['member', 'admin', 'superadmin'].includes(token.role as UserRole) && publicRoutes.includes(path)) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 