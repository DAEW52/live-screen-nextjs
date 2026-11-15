'use client';
// ─────────────────────────────────────────────────────────────
//  FxCanvas: เครื่องยิงเอฟเฟกต์บนจอ (พลุกระดาษ / อีโมจิลอย / ฝนหัวใจ / ลูกโป่ง)
//  วาดด้วย <canvas> แผ่นเดียว ลื่นและไม่ต้องลงไลบรารีเพิ่ม
// ─────────────────────────────────────────────────────────────
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const COLORS = ['#ff2bd6', '#00e5ff', '#ffe600', '#39ff88', '#ff5c39', '#a76bff', '#ffffff'];
// ระดับเอฟเฟกต์: off = ปิด, low = เบา (ค่าเริ่มต้น), high = จัดเต็ม
const LEVELS = {
  off:  { mult: 0,    max: 0,    emojiCap: 0 },
  low:  { mult: 0.35, max: 260,  emojiCap: 18 },
  high: { mult: 1,    max: 900,  emojiCap: 60 },
};
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const EMOJI_FONT = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';

const FxCanvas = forwardRef(function FxCanvas({ level = 'low' }, ref) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const size = useRef({ w: 1920, h: 1080 });
  const cfg = useRef(LEVELS.low);
  useEffect(() => { cfg.current = LEVELS[level] || LEVELS.low; if (!cfg.current.max) particles.current = []; }, [level]);
  const scale = (n) => Math.round(n * cfg.current.mult);

  const add = (p) => {
    const arr = particles.current;
    const max = cfg.current.max;
    if (!max) return;
    if (arr.length >= max) return;
    arr.push({
      x: 0, y: 0, vx: 0, vy: 0, g: 0, drag: 1, size: 12, rot: 0, vr: 0, flip: 0,
      sw: 0, swf: 0.05, ph: Math.random() * 100, age: 0, life: 240, color: '#fff', text: null,
      ...p,
    });
  };

  useImperativeHandle(ref, () => ({
    confetti(n = 220) {
      n = scale(n);
      const { w, h } = size.current;
      for (let i = 0; i < n; i++) add({
        x: rand(0, w), y: rand(-h * 0.35, -10), vx: rand(-2, 2), vy: rand(2, 6), g: 0.06, drag: 0.995,
        size: rand(8, 16), color: pick(COLORS), life: rand(260, 380), vr: rand(-0.2, 0.2), flip: rand(0.08, 0.3),
        sw: 0.6, swf: rand(0.03, 0.07),
      });
    },
    cannons(n = 110) {
      n = scale(n);
      const { w, h } = size.current;
      [0, 1].forEach((side) => {
        for (let i = 0; i < n; i++) add({
          x: side ? w + 10 : -10, y: h * rand(0.75, 0.95),
          vx: (side ? -1 : 1) * rand(7, 17), vy: -rand(13, 24), g: 0.33, drag: 0.985,
          size: rand(8, 15), color: pick(COLORS), life: rand(180, 260), vr: rand(-0.3, 0.3), flip: rand(0.1, 0.35),
        });
      });
    },
    rain(text = '❤️', n = 45) {
      n = scale(n);
      const { w } = size.current;
      for (let i = 0; i < n; i++) add({
        text, x: rand(0, w), y: rand(-600, -40), vy: rand(3, 6.5), g: 0.015, size: rand(36, 76),
        life: rand(260, 340), sw: 1, swf: rand(0.02, 0.05), vr: rand(-0.02, 0.02),
      });
    },
    floatUp(text = '🔥', opts = {}) {
      const { w, h } = size.current;
      // จำกัดจำนวนอีโมจิที่ลอยพร้อมกัน ถ้าคนกดรัวเกินจะไม่เพิ่ม
      if (particles.current.filter(p => p.text && p.vy < 0).length >= cfg.current.emojiCap) return false;
      add({
        text, x: opts.x ?? rand(w * 0.05, w * 0.95), y: h + 40, vy: -rand(2.6, 4.6), g: -0.004,
        size: opts.size ?? rand(48, 92), life: rand(230, 300), sw: 1.3, swf: rand(0.03, 0.06), vr: rand(-0.01, 0.01),
      });
      return true;
    },
    balloons(n = 26) {
      n = scale(n);
      const { w, h } = size.current;
      for (let i = 0; i < n; i++) add({
        text: pick(['🎈', '🎈', '🎈', '🎁', '🎂', '✨']), x: rand(0, w), y: h + rand(40, 500), vy: -rand(1.8, 3.4),
        size: rand(60, 120), life: rand(380, 480), sw: 1.4, swf: rand(0.02, 0.04),
      });
    },
    fireworks(n = 5) {
      n = Math.max(cfg.current.mult ? 1 : 0, scale(n));
      const per = Math.max(30, scale(90));
      const { w, h } = size.current;
      for (let k = 0; k < n; k++) {
        setTimeout(() => {
          const cx = rand(w * 0.15, w * 0.85), cy = rand(h * 0.15, h * 0.5), color = pick(COLORS);
          for (let i = 0; i < per; i++) {
            const a = (Math.PI * 2 * i) / per, sp = rand(4, 11);
            add({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.09, drag: 0.965,
                  size: rand(5, 9), color: Math.random() < 0.8 ? color : '#fff', life: rand(90, 140), flip: 0.2 });
          }
        }, k * 380);
      }
    },
  }), []);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    let dpr = 1;
    const resize = () => {
      dpr = 1; // วาดที่ความละเอียดปกติ ประหยัดเครื่องมาก (จอทีวี 4K ไม่ต้องวาด 4 เท่า)
      size.current = { w: window.innerWidth, h: window.innerHeight };
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0, last = performance.now();
    const loop = (now) => {
      const dt = Math.min(50, now - last) / 16.67;
      last = now;
      const arr = particles.current;
      if (!arr.length && !c._dirty) { raf = requestAnimationFrame(loop); return; }
      c._dirty = arr.length > 0;
      ctx.clearRect(0, 0, c.width, c.height);
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.age += dt;
        if (p.age > p.life || p.y > size.current.h + 200 || p.y < -900) { arr.splice(i, 1); continue; }
        p.vy += p.g * dt;
        p.vx *= Math.pow(p.drag, dt);
        p.vy *= Math.pow(p.drag, dt);
        p.x += (p.vx + Math.sin((p.age + p.ph) * p.swf) * p.sw) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        const alpha = Math.min(1, p.age / 6, (p.life - p.age) / 35);
        if (alpha <= 0) continue;
        ctx.globalAlpha = alpha;
        ctx.save();
        ctx.translate(p.x * dpr, p.y * dpr);
        ctx.rotate(p.rot);
        if (p.text) {
          ctx.font = `${Math.round(p.size * dpr)}px ${EMOJI_FONT}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.text, 0, 0);
        } else {
          const s = p.size * dpr;
          if (p.flip) ctx.scale(1, Math.cos(p.age * p.flip));
          ctx.fillStyle = p.color;
          ctx.fillRect(-s / 2, -s / 4, s, s / 2);
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 30 }}
    />
  );
});

export default FxCanvas;
