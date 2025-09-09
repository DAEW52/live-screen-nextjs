// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Import ตัวเชื่อมต่อใหม่

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // 1. อัปโหลดไฟล์ไปที่ Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: fileData, error: fileError } = await supabase.storage
      .from('uploads') // ชื่อ Bucket ที่เราสร้างไว้
      .upload(fileName, file);

    if (fileError) {
      throw new Error(fileError.message);
    }
    
    // 2. ดึง Public URL ของไฟล์ที่เพิ่งอัปโหลด
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    // 3. เตรียมข้อมูลเพื่อบันทึกลงฐานข้อมูล
    const newSubmission = {
      name: formData.get('name'),
      socialType: formData.get('socialType'),
      tableNumber: formData.get('tableNumber'),
      message: formData.get('message'),
      imageUrl: urlData.publicUrl, // ใช้ URL จาก Supabase
      status: 'pending' // สถานะเริ่มต้น
    };

    // 4. เพิ่มข้อมูลลงในตาราง 'submissions'
    const { data: dbData, error: dbError } = await supabase
      .from('submissions')
      .insert([newSubmission]);

    if (dbError) {
      throw new Error(dbError.message);
    }

    return NextResponse.json({ success: true, data: dbData });

  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}