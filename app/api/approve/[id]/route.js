import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request, { params }) {
  // ---- ✨ 1. เพิ่มโค้ดสำหรับ Debug ✨ ----
  // ตรวจสอบว่าเซิร์ฟเวอร์อ่าน Service Key จาก .env.local หรือไม่
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('✅ Service Key loaded successfully!');
  } else {
    console.error('❌ FATAL: Service Key is missing! Check your .env.local file.');
  }
  // ------------------------------------

  const { id } = params;

  try {
    const { error } = await supabaseAdmin
      .from('submissions')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      console.error("❌ Update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Submission approved.' });

  } catch (error) {
    console.error('Approve API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

