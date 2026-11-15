import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// เริ่มนับหัวใจใหม่ (ปุ่ม "เริ่มนับใหม่" ในหน้าแอดมิน)
export async function POST() {
  try {
    const { error: e1 } = await supabaseAdmin.from('hearts').delete().gt('id', 0);
    if (e1) throw e1;
    // trigger ลดตัวเลขให้อยู่แล้ว แต่ตั้งเป็น 0 ซ้ำอีกรอบเผื่อมีค่าค้าง
    const { error: e2 } = await supabaseAdmin.from('submissions').update({ hearts: 0 }).gt('hearts', 0);
    if (e2) throw e2;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Hearts reset error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
