import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// รหัสมือถือของลูกค้า (สุ่มเก็บไว้ในเครื่องลูกค้า) ใช้กันกดหัวใจซ้ำรูปเดิม
const validCid = (c) => typeof c === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(c);

// กดหัวใจ: POST { id, cid }
export async function POST(request) {
  try {
    const { id, cid } = await request.json().catch(() => ({}));
    const submissionId = Number(id);
    if (!Number.isFinite(submissionId) || !validCid(cid)) {
      return NextResponse.json({ ok: false, error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 });
    }

    const { data: sub } = await supabaseAdmin
      .from('submissions').select('id, status').eq('id', submissionId).maybeSingle();
    if (!sub || sub.status !== 'approved') {
      return NextResponse.json({ ok: false, error: 'ไม่พบรูปนี้' }, { status: 404 });
    }

    // ตาราง hearts มี unique (submission_id, client_id) → กดซ้ำจะไม่ถูกนับ
    const { error } = await supabaseAdmin.from('hearts').insert({ submission_id: submissionId, client_id: cid });
    const already = error?.code === '23505';
    if (error && !already) throw error;

    const { data: row } = await supabaseAdmin.from('submissions').select('hearts').eq('id', submissionId).single();
    return NextResponse.json({ ok: true, already, hearts: row?.hearts ?? 0 });
  } catch (error) {
    console.error('Heart API Error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// รูปที่มือถือเครื่องนี้กดหัวใจไปแล้ว: GET ?cid=...
export async function GET(request) {
  const cid = new URL(request.url).searchParams.get('cid');
  if (!validCid(cid)) return NextResponse.json({ liked: [] });
  const { data, error } = await supabaseAdmin.from('hearts').select('submission_id').eq('client_id', cid);
  if (error) return NextResponse.json({ liked: [], error: error.message }, { status: 500 });
  return NextResponse.json({ liked: data.map(r => r.submission_id) });
}
