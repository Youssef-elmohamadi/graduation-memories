'use server';

import { connectToDatabase } from '@/lib/db';
import Memory from '@/models/Memory';
import { revalidatePath } from 'next/cache';
import { hasSession } from '@/lib/auth';

export interface SerializedMemory {
  id: string;
  text: string;
  sender: string;
  createdAt: string;
}

/* ─────────────────────────────────────────────────────────────
   PUBLIC — anyone can leave a congratulation message
───────────────────────────────────────────────────────────── */
export async function saveMessage(formData: FormData) {
  try {
    await connectToDatabase();

    const text   = formData.get('text')   as string;
    let   sender = formData.get('sender') as string;

    if (!text || text.trim() === '') {
      return { success: false, error: 'الرجاء كتابة رسالة تهنئة أولاً' };
    }

    if (!sender || sender.trim() === '') {
      sender = 'مجهول';
    }

    const newMemory = new Memory({
      text:   text.trim(),
      sender: sender.trim(),
    });

    await newMemory.save();

    // Invalidate the private viewer cache
    revalidatePath('/my-memories');

    return { success: true };
  } catch (error: unknown) {
    console.error('[saveMessage] Error:', error);
    return { success: false, error: 'حدث خطأ أثناء حفظ رسالتك. الرجاء المحاولة مرة أخرى.' };
  }
}

/* ─────────────────────────────────────────────────────────────
   PRIVATE — strictly Youssef's authenticated session only.
   Double-gated: middleware blocks unauthenticated requests at
   the edge; this server action re-validates the cookie to
   prevent any direct API-layer bypass.
───────────────────────────────────────────────────────────── */
export async function getMemories(): Promise<SerializedMemory[]> {
  // ① Authentication gate
  const authed = await hasSession();
  if (!authed) {
    // Throw — do not leak data silently
    throw new Error('[getMemories] Unauthorized: valid session required.');
  }

  try {
    await connectToDatabase();

    // ② Fetch all memories, newest first, select only needed fields
    const memories = await Memory
      .find({})
      .select('text sender createdAt')
      .sort({ createdAt: -1 })
      .lean<{ _id: { toString(): string }; text: string; sender?: string; createdAt: Date }[]>();

    return memories.map((m) => ({
      id:        m._id.toString(),
      text:      m.text,
      sender:    m.sender ?? 'مجهول',
      createdAt: m.createdAt.toISOString(),
    }));
  } catch (error: unknown) {
    console.error('[getMemories] DB error:', error);
    // Re-throw so the page-level error boundary or redirect handles it
    throw new Error('فشل تحميل الذكريات. يرجى المحاولة مجدداً.');
  }
}
