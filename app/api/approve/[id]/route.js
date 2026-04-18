import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request, { params }) {
  // 1. ดึง ID จาก URL (เช่น /api/approve/123)
  const id = (await params).id; 

  try {
    // 2. ใช้ supabaseAdmin อัปเดตสถานะ (ตัวนี้จะข้าม RLS ให้เอง)
    const { data, error } = await supabaseAdmin
      .from('submissions')
      .update({ status: 'approved' })
      .eq('id', id)
      .select();

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "ไม่พบข้อมูลที่ต้องการอัปเดต" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'อนุมัติเรียบร้อยแล้ว' });

  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}