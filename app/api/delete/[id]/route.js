// app/api/delete/[id]/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    // 1. ดึงข้อมูล imageUrl ก่อนที่จะลบ
    const { data: submissionData, error: selectError } = await supabase
      .from('submissions')
      .select('imageUrl')
      .eq('id', id)
      .single();

    if (selectError || !submissionData) {
      throw new Error('ไม่พบข้อมูลที่จะลบ');
    }

    // 2. ลบไฟล์ออกจาก Storage
    const fileName = submissionData.imageUrl.split('/').pop();
    const { error: storageError } = await supabase.storage
      .from('uploads')
      .remove([fileName]);
      
    if (storageError) {
      console.warn('Storage delete warning:', storageError.message);
      // ไม่ต้องหยุดการทำงานถ้าลบไฟล์ไม่ได้ ให้ลบข้อมูลใน db ต่อไป
    }

    // 3. ลบข้อมูลออกจาก Database
    const { error: dbError } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (dbError) {
      throw new Error(dbError.message);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}