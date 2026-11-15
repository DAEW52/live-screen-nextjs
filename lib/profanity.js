// ─────────────────────────────────────────────────────────────
//  กรองคำหยาบอัตโนมัติ: คำในรายการจะถูกแทนด้วย ***
//  เพิ่ม/ลบคำได้ที่ BAD_WORDS ด้านล่าง
// ─────────────────────────────────────────────────────────────
const BAD_WORDS = [
  // ไทย
  'ควย', 'เหี้ย', 'เหี้ยะ', 'สัส', 'สัตว์นรก', 'ไอ้สัตว์', 'อีสัตว์', 'เย็ด', 'เย็ส', 'แตด',
  'ส้นตีน', 'ตีนตบ', 'ชิบหาย', 'ฉิบหาย', 'พ่อมึงตาย', 'แม่มึงตาย', 'ระยำ', 'ดอกทอง', 'กะหรี่', 'อีดอก',
  'จัญไร', 'เงี่ยน', 'ไอ้เวร', 'อีเวร', 'ปัญญาอ่อน', 'อีควาย', 'ไอ้ควาย',
  // อังกฤษ
  'fuck', 'fucking', 'fuk', 'shit', 'bitch', 'cunt', 'dick', 'pussy', 'asshole', 'bastard', 'motherfucker', 'nigger', 'nigga', 'whore', 'slut',
];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// เรียงคำยาวก่อน เพื่อให้ตัดคำยาวได้ครบ
// คำไทยจับได้ทุกตำแหน่ง ส่วนคำอังกฤษจับเฉพาะทั้งคำ (กันคำอย่าง "shitake" โดนไปด้วย)
const isThai = (w) => /[ก-๙]/.test(w);
const PATTERN = new RegExp(
  [...BAD_WORDS]
    .sort((a, b) => b.length - a.length)
    .map((w) => (isThai(w) ? escape(w) : `\\b${escape(w)}\\b`))
    .join('|'),
  'gi'
);

export function maskProfanity(text) {
  if (!text || typeof text !== 'string') return text || '';
  const stars = (m) => '*'.repeat(Math.min(m.length, 5));
  // 1) คำหยาบตรงๆ
  let out = text.replace(PATTERN, stars);
  // 2) คำที่แทรกช่องว่าง/จุดกลางคำ เช่น "ค ว ย" หรือ "f.u.c.k"
  out = out.replace(/(?:[ก-๙a-z][\s.\-_]+){2,}[ก-๙a-z](?![ก-๙a-z])/gi, (chunk) => {
    const joined = chunk.replace(/[\s.\-_]/g, '');
    return joined.replace(PATTERN, '') !== joined ? '*****' : chunk;
  });
  return out;
}

export function hasProfanity(text) {
  PATTERN.lastIndex = 0;
  const r = PATTERN.test(String(text || ''));
  PATTERN.lastIndex = 0;
  return r;
}
