import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'youssef_auth_token';
const SESSION_SECRET = process.env.SESSION_SECRET || 'authenticated_youssef_2026';

export async function setSession() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: SESSION_SECRET,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return sessionCookie?.value === SESSION_SECRET;
}
