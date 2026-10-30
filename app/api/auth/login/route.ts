import { createHash, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createSession, SESSION_COOKIE, SESSION_SECONDS } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'คำขอไม่ถูกต้อง กรุณาโหลดหน้าใหม่' }, { status: 403 });
  }
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) return NextResponse.json({ error: 'ยังไม่ได้ตั้งรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ' }, { status: 503 });
  let password: unknown;
  try { ({ password } = await request.json()); } catch {
    return NextResponse.json({ error: 'คำขอไม่ถูกต้อง' }, { status: 400 });
  }
  const hash = (value: string) => createHash('sha256').update(value).digest();
  if (typeof password !== 'string' || password.length > 4096 || !timingSafeEqual(hash(password), hash(expected))) {
    return NextResponse.json({ error: 'รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง' }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.headers.set('Cache-Control', 'no-store');
  response.cookies.set(SESSION_COOKIE, await createSession(), {
    httpOnly: true, secure: request.nextUrl.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: SESSION_SECONDS,
  });
  return response;
}
