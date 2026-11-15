// ─────────────────────────────────────────────────────────────
//  ระบบล็อกอินหน้าแอดมิน: รหัสผ่านเก็บใน .env.local (ADMIN_PASSWORD)
//  ล็อกอินผ่าน → ได้คุกกี้ที่เซ็นด้วยรหัสผ่าน (ปลอมไม่ได้ถ้าไม่รู้รหัส)
//  ใช้ Web Crypto ล้วน จึงทำงานได้ทั้งใน middleware และ API
// ─────────────────────────────────────────────────────────────
export const ADMIN_COOKIE = 'ther_admin';
export const SESSION_DAYS = 7;

const enc = new TextEncoder();

function b64url(buf) {
  let s = '';
  new Uint8Array(buf).forEach((b) => { s += String.fromCharCode(b); });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

function sameString(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export const adminPasswordSet = () => !!process.env.ADMIN_PASSWORD;

/** เทียบรหัสผ่าน (เทียบผ่าน HMAC เพื่อไม่ให้เดาจากเวลาตอบได้) */
export async function checkPassword(input) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || typeof input !== 'string') return false;
  return sameString(await hmac('pw-check', input), await hmac('pw-check', pw));
}

/** สร้างค่าคุกกี้: "<หมดอายุ>.<ลายเซ็น>" */
export async function createSession() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${exp}.${await hmac(process.env.ADMIN_PASSWORD, `ther-admin:${exp}`)}`;
}

/** ตรวจคุกกี้ (เปลี่ยนรหัสผ่านเมื่อไหร่ ทุกเครื่องที่ล็อกอินอยู่จะหลุดทันที) */
export async function verifySession(value) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || !value) return false;
  const [exp, sig] = String(value).split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return sameString(sig, await hmac(pw, `ther-admin:${exp}`));
}
