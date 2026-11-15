import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, SESSION_DAYS, adminPasswordSet, checkPassword, createSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!adminPasswordSet()) {
    return NextResponse.json({ ok: false, error: 'ยังไม่ได้ตั้งรหัสผ่าน: ใส่ ADMIN_PASSWORD ในไฟล์ .env.local แล้วรันใหม่' }, { status: 500 });
  }
  const { password } = await request.json().catch(() => ({}));
  if (!(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 800)); // หน่วงเวลา กันการสุ่มเดารหัสรัวๆ
    return NextResponse.json({ ok: false, error: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createSession(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' && request.nextUrl.protocol === 'https:',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return res;
}
