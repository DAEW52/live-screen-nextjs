// ─────────────────────────────────────────────────────────────
//  ด่านตรวจ: หน้าแอดมิน และ API ของแอดมิน ต้องล็อกอินก่อน
//  (หน้าแขก /, จอ /display, ส่งรูป /api/upload, กดหัวใจ /api/heart เปิดให้ทุกคนเหมือนเดิม)
// ─────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifySession } from '@/lib/adminAuth';

const PUBLIC_PATHS = ['/admin/login', '/api/admin/login'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p)) return NextResponse.next();

  const ok = await verifySession(request.cookies.get(ADMIN_COOKIE)?.value);
  if (ok) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ ok: false, error: 'ต้องล็อกอินแอดมินก่อน' }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/approve/:path*',
    '/api/approved/:path*',
    '/api/reject/:path*',
    '/api/delete/:path*',
    '/api/pending/:path*',
    '/api/hearts/:path*',
    '/api/socket/:path*',
  ],
};
