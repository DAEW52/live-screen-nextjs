// app/api/upload/route.js (เวอร์ชันปรับปรุงประสิทธิภาพ)
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import sharp from 'sharp'; // 1. Import sharp ที่เราเพิ่งติดตั้งไป

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded or file is invalid.' }, { status: 400 });
    }

    // --- ✨ ขั้นตอนการปรับปรุงประสิทธิภาพรูปภาพ ✨ ---

    // 2. แปลงไฟล์ที่ผู้ใช้อัปโหลดมาให้เป็น Buffer เพื่อให้ sharp ใช้งานได้
    const originalBuffer = Buffer.from(await file.arrayBuffer());

    // 3. ใช้ sharp เพื่อย่อขนาด, แปลงฟอร์แมต, และบีบอัดไฟล์
    const optimizedBuffer = await sharp(originalBuffer)
      .resize(1920, 1080, { // ย่อขนาดให้กว้างไม่เกิน 1920px และสูงไม่เกิน 1080px
        fit: 'inside', // รักษาสัดส่วนเดิมของภาพ
        withoutEnlargement: true, // ไม่ขยายภาพถ้าขนาดเล็กกว่าที่กำหนด
      })
      .toFormat('webp') // แปลงไฟล์เป็นฟอร์แมต WebP ที่ทันสมัยและขนาดเล็ก
      .webp({ quality: 80 }) // ตั้งค่าคุณภาพของ WebP (80 คือคุณภาพดีและขนาดไฟล์ไม่ใหญ่)
      .toBuffer(); // แปลงผลลัพธ์กลับมาเป็น Buffer เพื่อเตรียมอัปโหลด

    // 4. สร้างชื่อไฟล์ใหม่ให้เป็น .webp
    const originalName = file.name.split('.').slice(0, -1).join('.');
    const fileName = `${Date.now()}-${originalName}.webp`;

    // --- สิ้นสุดขั้นตอนการปรับปรุง ---


    // 5. อัปโหลด Buffer ที่ถูกปรับปรุงแล้วไปยัง Supabase
    const { data: fileData, error: fileError } = await supabase.storage
      .from('uploads')
      .upload(`public/${fileName}`, optimizedBuffer, { // <-- ใช้ optimizedBuffer แทน file เดิม
        contentType: 'image/webp', // <-- ระบุ content type เป็น image/webp
        upsert: false,
      });

    if (fileError) {
      console.error("❌ Upload error:", fileError);
      throw new Error(fileError.message);
    }

    // ดึง Public URL (ส่วนนี้เหมือนเดิม)
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(`public/${fileName}`);

    // เตรียมข้อมูลบันทึกลง DB (ส่วนนี้เหมือนเดิม)
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
