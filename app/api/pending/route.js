// app/api/pending/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('status', 'pending') // ดึงเฉพาะรายการที่มีสถานะ 'pending'
    .order('created_at', { ascending: false }); // เรียงจากใหม่ไปเก่า

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}