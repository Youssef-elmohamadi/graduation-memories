'use server';

import { setSession, clearSession, hasSession } from '@/lib/auth';

export async function login(formData: FormData) {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD || 'youssef2026';

  if (password === adminPassword) {
    await setSession();
    return { success: true };
  }

  return { success: false, error: 'كلمة المرور غير صحيحة. الرجاء المحاولة مرة أخرى.' };
}

export async function logout() {
  await clearSession();
  return { success: true };
}

export async function checkAuth() {
  return await hasSession();
}
