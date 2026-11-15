'use client';
// ─────────────────────────────────────────────────────────────
//  Live FX: ส่งคำสั่ง/เอฟเฟกต์แบบเรียลไทม์ระหว่างหน้า แขก / แอดมิน / จอ
//  ใช้ Supabase Realtime "Broadcast" → ไม่ต้องสร้างตารางเพิ่มในฐานข้อมูล
// ─────────────────────────────────────────────────────────────
import { supabase } from '@/lib/supabaseClient';

const CHANNEL_NAME = 'ther-live-fx';

// อีโมจิที่แขกส่งขึ้นจอได้ (จอจะไม่รับอีโมจินอกรายการนี้)
export const REACTIONS = ['🔥', '❤️', '🎉', '😂', '🍻', '👏', '😍', '🥳'];

export const TRANSITIONS = [
  { id: 'random', label: '🎲 สุ่ม' },
  { id: 'fade', label: 'จางหาย' },
  { id: 'zoom', label: 'ซูม' },
  { id: 'slide', label: 'สไลด์' },
  { id: 'flip', label: 'พลิก' },
  { id: 'glitch', label: 'กลิตช์' },
];

let channel = null;
let readyPromise = null;
const listeners = new Set();

function ensureChannel() {
  if (channel) return channel;
  channel = supabase.channel(CHANNEL_NAME, { config: { broadcast: { self: false } } });
  channel.on('broadcast', { event: 'fx' }, ({ payload }) => {
    listeners.forEach((fn) => {
      try { fn(payload || {}); } catch (e) { console.error('[liveFx]', e); }
    });
  });
  readyPromise = new Promise((resolve) => {
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') resolve();
    });
  });
  return channel;
}

/** ส่งเอฟเฟกต์/คำสั่ง เช่น sendFx('react', { emoji: '🔥' }) */
export async function sendFx(type, data = {}) {
  const ch = ensureChannel();
  await readyPromise;
  return ch.send({ type: 'broadcast', event: 'fx', payload: { type, ...data, t: Date.now() } });
}

/** ฟังเอฟเฟกต์/คำสั่ง  คืนค่าเป็นฟังก์ชันยกเลิกการฟัง */
export function onFx(handler) {
  ensureChannel();
  listeners.add(handler);
  return () => listeners.delete(handler);
}

// ── ป้ายวันเกิด: เก็บไว้หน้าข้อความ เพื่อไม่ต้องแก้ตารางในฐานข้อมูล ──
export const HBD_TAG = '[HBD]';
export const isBirthday = (msg) => typeof msg === 'string' && msg.trim().startsWith(HBD_TAG);
export const stripTags = (msg) => (typeof msg === 'string' ? msg.replace(HBD_TAG, '').trim() : '');
