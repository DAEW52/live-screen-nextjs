import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { maskProfanity } from '@/lib/profanity';

export const dynamic = 'force-dynamic';

// แก้ข้อมูลรูปจากหน้าแอดมิน (ผ่านด่านล็อกอินใน middleware แล้ว)
//   { id, action: 'message', value }  → แก้ข้อความใต้รูป
//   { id, action: 'push' }            → ดันขึ้นคิวถัดไป (อัปเดตเวลา)
export async function POST(request) {
  try {
    const { id, action, value } = await request.json().catch(() => ({}));
    const submissionId = Number(id);
    if (!Number.isFinite(submissionId)) return NextResponse.json({ ok: false, error: 'id ไม่ถูกต้อง' }, { status: 400 });

    let patch;
    if (action === 'message') patch = { message: maskProfanity(String(value ?? '')).slice(0, 200) };
    else if (action === 'push') patch = { created_at: new Date().toISOString() };
    else return NextResponse.json({ ok: false, error: 'คำสั่งไม่ถูกต้อง' }, { status: 400 });

    const { data, error } = await supabaseAdmin.from('submissions').update(patch).eq('id', submissionId).select().single();
    if (error) throw error;
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error('Admin update error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
