import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import sharp from 'sharp';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file'); 

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded or file is invalid.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .toFormat('webp')
      .webp({ quality: 80 })
      .toBuffer();

    const fileName = `${Date.now()}-${file.name.split('.')[0]}.webp`;

    const { data: fileData, error: fileError } = await supabaseAdmin.storage
      .from('uploads')
      .upload(fileName, optimizedBuffer, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (fileError) {
      console.error("❌ Supabase Upload error:", fileError);
      throw new Error(fileError.message);
    }
    
    const { data: urlData } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(fileName);

    const newSubmission = {
      name: formData.get('name') || '',
      socialType: formData.get('socialType') || '',
      tableNumber: formData.get('tableNumber') || '',
      message: formData.get('message') || '',
      imageUrl: urlData.publicUrl,
      status: 'pending',
    };

    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('submissions')
      .insert([newSubmission])
      .select();

    if (dbError) {
      console.error("❌ DB insert error:", dbError);
      throw new Error(dbError.message);
    }

    return NextResponse.json({ success: true, data: dbData });

  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} // --- ✨ ปีกกาที่หายไปอยู่ตรงนี้ครับ ✨ ---

