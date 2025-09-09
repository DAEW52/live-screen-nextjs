// app/api/approve/[id]/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request, { params }) {
  const { id } = params;
  
  const { error } = await supabase
    .from('submissions')
    .update({ status: 'approved' }) // เปลี่ยนสถานะเป็น 'approved'
    .eq('id', id); // เฉพาะ id ที่ส่งมา

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}