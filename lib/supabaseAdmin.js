import { createClient } from '@supabase/supabase-js';

// สร้างการเชื่อมต่อโดยใช้ Service Role Key
// การเชื่อมต่อนี้จะข้ามกฎ RLS ทั้งหมด และต้องใช้บนเซิร์ฟเวอร์เท่านั้น
// ตรวจสอบให้แน่ใจว่าค่า process.env ถูกต้อง
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Supabase URL or Service Role Key is missing from .env.local");
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

