import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request, { params }) {
  const { id } = params;
  console.log(`[Reject API] ได้รับคำสั่งลบ ID: ${id}`);

  try {
    // ขั้นตอนที่ 1: ค้นหาข้อมูลเพื่อเอารูปภาพ URL
    const { data: submission, error: findError } = await supabaseAdmin
      .from('submissions')
      .select('imageUrl')
      .eq('id', id)
      .single();

    if (findError || !submission) {
      console.error('❌ เกิดข้อผิดพลาดในการค้นหา:', findError);
      return NextResponse.json({ error: 'ไม่พบข้อมูลที่ต้องการลบ' }, { status: 404 });
    }

    // ขั้นตอนที่ 2: ลบไฟล์รูปภาพออกจาก Storage
    const imageUrl = submission.imageUrl;
    // ดึงชื่อไฟล์จาก URL เต็ม
    const filePath = imageUrl.substring(imageUrl.indexOf('/uploads/') + 9);
    console.log(`[Reject API] กำลังลบไฟล์จาก Storage: ${filePath}`);

    const { error: storageError } = await supabaseAdmin.storage
      .from('uploads')
      .remove([filePath]);

    if (storageError) {
      // แจ้งเตือนข้อผิดพลาด แต่ยังคงทำงานต่อไปเพื่อลบข้อมูลใน DB
      console.error('⚠️ เกิดข้อผิดพลาดในการลบไฟล์ (แต่จะลบข้อมูลใน DB ต่อ):', storageError);
    } else {
      console.log('✅ ลบไฟล์รูปภาพสำเร็จ');
    }

    // ขั้นตอนที่ 3: ลบข้อมูลออกจากตาราง
    console.log(`[Reject API] กำลังลบข้อมูล ID: ${id} จากตาราง`);
    const { error: deleteError } = await supabaseAdmin
      .from('submissions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('❌ เกิดข้อผิดพลาดในการลบข้อมูล:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    console.log(`✅ ปฏิเสธ ID ${id} สำเร็จ`);
    return NextResponse.json({ success: true, message: 'ปฏิเสธและลบข้อมูลสำเร็จ' });

  } catch (error) {
    console.error('เกิดข้อผิดพลาดทั่วไปใน Reject API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

