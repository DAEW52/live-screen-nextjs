// app/api/reject/[id]/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request, { params }) {
  const { id } = params;

  // สำหรับการ Reject เราจะลบข้อมูลออกจากตารางเลย
  const { error } = await supabase
    .from('submissions')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}