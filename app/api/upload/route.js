// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
  try {
    const formData = await request.formData();

    // DEBUG: log ทั้ง formData ออกมา
    const entries = [...formData.entries()];
    console.log("📦 formData entries:", entries);

    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded or file is invalid.' }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`;

    // อัปโหลดไปยัง Supabase
    const { data: fileData, error: fileError } = await supabase.storage
      .from('uploads')
      .upload(`public/${fileName}`, file, {
        contentType: file.type,
        upsert: false,
      });

    if (fileError) {
      console.error("❌ Upload error:", fileError);
      throw new Error(fileError.message);
    }

    // ดึง Public URL
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(`public/${fileName}`);

    // เตรียมข้อมูลบันทึกลง DB
    const newSubmission = {
      name: formData.get('name') || '',
      socialType: formData.get('socialType') || '',
      tableNumber: formData.get('tableNumber') || '',
      message: formData.get('message') || '',
      imageUrl: urlData.publicUrl,
      status: 'pending',
    };

    const { data: dbData, error: dbError } = await supabase
      .from('submissions')
      .insert([newSubmission]);

    if (dbError) {
      console.error("❌ DB insert error:", dbError);
      throw new Error(dbError.message);
    }

    return NextResponse.json({ success: true, data: dbData });

  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
