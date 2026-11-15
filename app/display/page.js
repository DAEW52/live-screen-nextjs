'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { onFx, sendFx, REACTIONS, isBirthday, stripTags } from '@/lib/liveFx';
import dynamic from 'next/dynamic';
import FxCanvas from './FxCanvas';

const QRCode = dynamic(() => import('react-qr-code'), { ssr: false });

const SocialIcon = ({ type }) => {
  const socialType = type?.toLowerCase();
  const iconSize = "48";
  if (socialType === 'facebook') return (
    <svg width={iconSize} height={iconSize} viewBox="0 0 105.78513 105.78513"><g transform="translate(-29.12827,-77.419919)"><g transform="matrix(0.98570778,0,0,0.98570778,1.1722601,1.8624552)"><circle r="47.625" cy="130.31248" cx="82.020836" fill="#0066ff"/><path d="m 89.822943,107.76035 c -4.444987,-0.0186 -9.850149,0.22118 -11.336776,1.41386 -2.911076,2.33548 -2.258777,6.83421 -2.258777,6.83421 h 0.0098 v 8.17728 l -8.351943,-0.0424 2.606043,7.95146 5.7459,0.0176 v 22.96759 h 9.621637 v -22.93762 l 6.281269,0.0191 2.204516,-7.88427 -8.485785,-0.0429 v -8.13284 l 10.274823,0.0997 0.02274,-8.25583 c 0,0 -2.876251,-0.17051 -6.333464,-0.185 z" fill="#ffffff"/></g></g></svg>
  );
  if (socialType === 'instagram') return (
    <svg width={iconSize} height={iconSize} viewBox="0 0 105.8851 105.88512"><defs><linearGradient id="instagramGradient"><stop offset="0" stopColor="#00009f"/><stop offset="0.32" stopColor="#7500cb" stopOpacity="0.53"/><stop offset="0.59" stopColor="#c30077" stopOpacity="0.71"/><stop offset="0.83" stopColor="#ff0000" stopOpacity="0.93"/><stop offset="1" stopColor="#ffff00"/></linearGradient></defs><g transform="translate(-52.572577,-100.74468)"><g transform="matrix(0.93003423,0,0,0.93003423,7.3824477,10.752847)"><ellipse ry="47.625" rx="46.125" cy="154.125" cx="105.84524" fill="url(#instagramGradient)"/><rect ry="9.4182072" y="132.91701" x="83.404526" height="44.695126" width="44.695126" stroke="#ffffff" strokeWidth="2.41370797" fill="none"/><circle r="2.7381825" cy="139.84071" cx="118.28339" fill="#ffffff"/><circle r="11.584605" cy="155.26457" cx="105.75208" stroke="#ffffff" strokeWidth="3.32993841" fill="none"/></g></g></svg>
  );
  if (socialType === 'line') return (
    <svg height={iconSize} width={iconSize} viewBox="0 0 99 99"><g><rect fill="#3ACD01" height="99.4661" rx="10" ry="10" width="99.4661"/><path fill="white" d="M50 17c19,0 35,12 35,28 0,5 -2,11 -5,15 0,0 -1,0 -1,1l0 0c-1,1 -2,2 -4,3 -10,9 -26,20 -28,19 -2,-2 3,-9 -2,-10 -1,0 -1,0 -1,0l0 0 0 0c-17,-3 -30,-14 -30,-28 0,-16 16,-28 36,-28zm-21 37l0 0 0 0 7 0c1,0 2,-1 2,-2l0 0c0,-1 -1,-2 -2,-2l-5 0 0 -12c0,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 14c0,1 1,2 2,2zm44 -9l0 0 0 0c0,-1 0,-2 -1,-2l-6 0 0 -2 6 0c1,0 1,-1 1,-2l0 0c0,-1 0,-2 -1,-2l-7 0 0 0 -1 0c-1,0 -1,1 -1,2l0 13c0,1 0,2 1,2l1 0 0 0 7 0c1,0 1,-1 1,-2l0 0c0,-1 0,-2 -1,-2l-6 0 0 -3 6 0c1,0 1,-1 1,-2zm-13 8l0 0 0 0c0,0 0,0 0,-1l0 -14c0,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 9 -6 -9c-1,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 14c0,1 1,2 2,2l0 0c1,0 2,-1 2,-2l0 -8 7 9c0,0 0,0 0,0l0 0c0,1 0,1 1,1 0,0 0,0 0,0l0 0c1,0 1,0 1,0 0,0 1,0 1,-1zm-18 1l0 0 0 0c1,0 2,-1 2,-2l0 -14c0,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 14c0,1 1,2 2,2z"/></g></svg>
  );
  return <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm0-18c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm0 11c-3.866 0-7 2.19-7 5v1c0 .552.448 1 1 1h12c.552 0 1-.448 1-1v-1c0-2.81-3.134-5-7-5z"/></svg>;
};

// พื้นหลังเบลอแบบประหยัดเครื่อง: ย่อรูปให้เล็กมากใน canvas แล้วขยายกลับ (ไม่ต้องใช้ CSS blur ที่กินเครื่อง)
const blurCache = new Map();
function makeBlurUrl(src) {
  if (blurCache.has(src)) return Promise.resolve(blurCache.get(src));
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const a = document.createElement('canvas'); a.width = 24; a.height = 14;
        a.getContext('2d').drawImage(img, 0, 0, 24, 14);
        const b = document.createElement('canvas'); b.width = 192; b.height = 108;
        const ctx = b.getContext('2d'); ctx.imageSmoothingQuality = 'high';
        ctx.filter = 'blur(6px) brightness(0.5)';
        ctx.drawImage(a, -10, -10, 212, 128);
        const url = b.toDataURL('image/jpeg', 0.8);
        blurCache.set(src, url); resolve(url);
      } catch { blurCache.set(src, null); resolve(null); }
    };
    img.onerror = () => { blurCache.set(src, null); resolve(null); };
    img.src = src;
  });
}

function BlurBg({ src }) {
  const [url, setUrl] = useState(() => blurCache.get(src) || null);
  useEffect(() => { let on = true; makeBlurUrl(src).then(u => on && setUrl(u)); return () => { on = false; }; }, [src]);
  return <div className="blur-bg" style={url ? { backgroundImage: `url(${url})` } : undefined} />;
}

const SOCIAL_COLORS = { facebook: '#1877f2', instagram: '#e1306c', line: '#3acd01' };
const SETTINGS_KEY = 'ther_display_settings';
const RANDOM_POOL = ['fade', 'zoom', 'slide', 'fade', 'zoom'];

const loadSettings = () => {
  try { return { interval: 15, transition: 'random', ticker: '', fxLevel: 'low', ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }; }
  catch { return { interval: 15, transition: 'random', ticker: '', fxLevel: 'low' }; }
};
const saveSettings = (s) => { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch {} };

export default function DisplayPage() {
  const [uploadUrl, setUploadUrl] = useState('');
  const [currentContent, setCurrentContent] = useState(null);
  const [isIdle, setIsIdle] = useState(true);
  const [imageSlots, setImageSlots] = useState([{ src: null, visible: false, key: 0, anim: 'fade' }, { src: null, visible: false, key: 1, anim: 'fade' }]);
  const [activeSlot, setActiveSlot] = useState(0);

  // ── ของใหม่ ──
  const [settings, setSettings] = useState({ interval: 15, transition: 'random', ticker: '', fxLevel: 'low' });
  const [lastTickAt, setLastTickAt] = useState(0);
  const [now, setNow] = useState(0);
  const [timerNonce, setTimerNonce] = useState(0);
  const [banner, setBanner] = useState(null);        // { kind: 'new' | 'hbd', text }
  const [announce, setAnnounce] = useState(null);    // { text, id }
  const [flash, setFlash] = useState(0);
  const [hype, setHype] = useState(null);            // { emoji, id }
  const [showCount, setShowCount] = useState(0);
  const [heartBump, setHeartBump] = useState(0);
  const [topOverlay, setTopOverlay] = useState(null);

  const fxRef = useRef(null);
  const settingsRef = useRef(settings);
  const bannerTimer = useRef(null);
  const announceTimer = useRef(null);
  const reactLog = useRef([]);
  const lastHype = useRef(0);
  const currentRef = useRef(null);
  const stateTimer = useRef(null);
  const topTimer = useRef(null);
  const lastHearts = useRef({ id: null, n: 0 });

  // ── ระบบหัวใจ: คะแนนเก็บในฐานข้อมูล (คอลัมน์ hearts) จออ่านจากฐานข้อมูลอย่างเดียว ──
  const countOf = (id) => dataRef.current.approvedList.find(i => i.id === id)?.hearts || 0;
  const publicItem = (item) => item && ({
    id: item.id, imageUrl: item.imageUrl, name: item.name || '', tableNumber: item.tableNumber || '',
    socialType: item.socialType || '', message: stripTags(item.message), hbd: isBirthday(item.message),
  });
  const buildTop = useCallback((n = 5) => dataRef.current.approvedList
    .map(i => ({ ...publicItem(i), count: i.hearts || 0 }))
    .filter(i => i.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, n), []); // eslint-disable-line react-hooks/exhaustive-deps

  // บอกมือถือลูกค้าว่าตอนนี้รูปไหนอยู่บนจอ
  const scheduleState = useCallback(() => {
    if (stateTimer.current) return;
    stateTimer.current = setTimeout(() => {
      stateTimer.current = null;
      const cur = currentRef.current;
      sendFx('state', { now: cur ? { ...publicItem(cur), count: countOf(cur.id) } : null }).catch(() => {});
    }, 400);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dataRef = useRef({
    approvedList: [],
    newItemsQueue: [],
    currentIndex: -1,
    lastIndexBeforeQueue: null,
    ids: new Set(),
  });

  const activeSlotRef = useRef(activeSlot);
  useEffect(() => { activeSlotRef.current = activeSlot; }, [activeSlot]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  // โหลดการตั้งค่าที่จอจำไว้
  useEffect(() => { setSettings(loadSettings()); }, []);

  const showBanner = useCallback((b, ms = 5000) => {
    clearTimeout(bannerTimer.current);
    setBanner({ ...b, id: Date.now() });
    bannerTimer.current = setTimeout(() => setBanner(null), ms);
  }, []);

  // ✨ เอฟเฟกต์ตอนรูปขึ้นจอ
  const celebrate = useCallback((item, isNew) => {
    const fx = fxRef.current;
    if (!fx) return;
    if (isBirthday(item.message)) {
      setTimeout(() => { fx.balloons(28); fx.confetti(200); }, 600);
      showBanner({ kind: 'hbd', text: item.name ? `สุขสันต์วันเกิด ${item.name}` : 'สุขสันต์วันเกิด!' }, Math.min(settingsRef.current.interval * 1000, 12000));
    } else if (isNew) {
      setTimeout(() => (settingsRef.current.fxLevel === 'high' ? fx.cannons() : fx.confetti(120)), 600);
      showBanner({ kind: 'new', text: item.tableNumber ? `รูปใหม่จากโต๊ะ ${item.tableNumber}` : 'รูปใหม่มาแล้ว!' }, 4500);
    }
  }, [showBanner]);

  // ✅ TICK: เลือกรูปถัดไป (รูปใหม่แซงคิวก่อน แล้วกลับไปเล่นต่อจากเดิม)
  const tick = useCallback(() => {
    const data = dataRef.current;
    if (data.approvedList.length === 0) {
      setIsIdle(true);
      setCurrentContent(null);
      if (currentRef.current) { currentRef.current = null; scheduleState(); }
      return;
    }

    let nextItem = null;
    let fromQueue = false;

    if (data.newItemsQueue.length > 0) {
      if (data.lastIndexBeforeQueue === null) data.lastIndexBeforeQueue = data.currentIndex;
      nextItem = data.newItemsQueue.shift();
      fromQueue = !nextItem._manual;
      data.currentIndex = data.approvedList.findIndex(item => item.id === nextItem.id);
    } else {
      let targetIndex;
      if (data.lastIndexBeforeQueue !== null) {
        targetIndex = (data.lastIndexBeforeQueue + 1) % data.approvedList.length;
        data.lastIndexBeforeQueue = null;
      } else {
        targetIndex = (data.currentIndex + 1) % data.approvedList.length;
      }
      data.currentIndex = targetIndex;
      nextItem = data.approvedList[data.currentIndex];
    }

    if (nextItem) {
      const t = settingsRef.current.transition;
      const anim = t === 'random' || !t ? RANDOM_POOL[Math.floor(Math.random() * RANDOM_POOL.length)] : t;
      const currentActiveSlot = activeSlotRef.current;
      const nextSlot = (currentActiveSlot + 1) % 2;

      setImageSlots(prev => {
        const newSlots = [...prev];
        newSlots[nextSlot] = { src: nextItem.imageUrl, visible: true, key: Date.now(), anim };
        newSlots[currentActiveSlot] = { ...newSlots[currentActiveSlot], visible: false };
        return newSlots;
      });
      setActiveSlot(nextSlot);
      activeSlotRef.current = nextSlot;
      setCurrentContent(nextItem);
      setIsIdle(false);
      setLastTickAt(Date.now());
      setShowCount(c => c + 1);
      currentRef.current = nextItem;
      scheduleState();
      celebrate(nextItem, fromQueue);
    }
  }, [celebrate, scheduleState]);

  // โหลดรูป + ฟังการเปลี่ยนแปลงในฐานข้อมูล
  useEffect(() => {
    setUploadUrl(window.location.origin);
    const fetchInitialData = async () => {
      const { data } = await supabase.from('submissions').select('*').eq('status', 'approved').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        dataRef.current.approvedList = data;
        dataRef.current.ids = new Set(data.map(item => item.id));
        tick();
      } else {
        scheduleState();
      }
    };
    fetchInitialData();

    const channel = supabase.channel('display-realtime-v3')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, (payload) => {
        const d = dataRef.current;
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const row = payload.new;
          if (row.status === 'approved' && !d.ids.has(row.id)) {
            d.ids.add(row.id);
            d.approvedList.push(row);
            d.newItemsQueue.push(row);
            if (d.currentIndex === -1) tick();
          } else if (row.status === 'approved') {
            // แอดมินแก้ข้อความ → อัปเดตข้อมูลที่จำไว้
            d.approvedList = d.approvedList.map(i => (i.id === row.id ? { ...i, ...row } : i));
            setCurrentContent(c => (c && c.id === row.id ? { ...c, ...row } : c));
          } else if (row.status !== 'approved' && d.ids.has(row.id)) {
            // ถูกเอาลงจากจอ
            d.ids.delete(row.id);
            d.approvedList = d.approvedList.filter(i => i.id !== row.id);
            d.newItemsQueue = d.newItemsQueue.filter(i => i.id !== row.id);
          }
        } else if (payload.eventType === 'DELETE') {
          const id = payload.old.id;
          d.ids.delete(id);
          d.approvedList = d.approvedList.filter(i => i.id !== id);
          d.newItemsQueue = d.newItemsQueue.filter(i => i.id !== id);
        }
      }).subscribe();
    return () => supabase.removeChannel(channel);
  }, [tick, scheduleState]);

  // ตั้งเวลาเปลี่ยนรูป (เริ่มนับใหม่เมื่อเปลี่ยนเวลา หรือเมื่อแอดมินสั่งขึ้นจอทันที)
  useEffect(() => {
    const timerId = setInterval(tick, Math.max(3, settings.interval) * 1000);
    return () => clearInterval(timerId);
  }, [tick, settings.interval, timerNonce]);

  // นาฬิกาสำหรับตัวนับถอยหลัง
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  // ── รับคำสั่งสด จากแขก / แอดมิน ──
  useEffect(() => {
    const updateSettings = (patch) => {
      setSettings(prev => { const next = { ...prev, ...patch }; saveSettings(next); return next; });
    };

    return onFx((msg) => {
      const fx = fxRef.current;
      const d = dataRef.current;
      switch (msg.type) {
        case 'react': {
          if (!REACTIONS.includes(msg.emoji) || !fx || settingsRef.current.fxLevel === 'off') return;
          fx.floatUp(msg.emoji);
          const t = Date.now();
          reactLog.current = reactLog.current.filter(x => t - x < 4000);
          reactLog.current.push(t);
          // HYPE: ต้องกดรวมกันเยอะจริงๆ และเว้นอย่างน้อย 30 วินาทีต่อครั้ง
          if (reactLog.current.length >= 25 && t - lastHype.current > 30000) {
            lastHype.current = t;
            reactLog.current = [];
            fx.rain(msg.emoji, 40);
            setHype({ emoji: msg.emoji, id: t });
            setTimeout(() => setHype(null), 2800);
          }
          break;
        }
        case 'effect': {
          if (!fx) return;
          if (msg.name === 'confetti') { fx.confetti(260); if (settingsRef.current.fxLevel === 'high') fx.cannons(); }
          else if (msg.name === 'hearts') fx.rain('❤️', 60);
          else if (msg.name === 'fire') fx.rain('🔥', 60);
          else if (msg.name === 'fireworks') fx.fireworks(6);
          else if (msg.name === 'balloons') fx.balloons(30);
          else if (msg.name === 'flash') setFlash(f => f + 1);
          break;
        }
        case 'show': {
          const item = d.approvedList.find(i => i.id === msg.id);
          if (!item) return;
          d.newItemsQueue = d.newItemsQueue.filter(i => i.id !== msg.id);
          d.newItemsQueue.unshift({ ...item, _manual: true });
          tick();
          setTimerNonce(n => n + 1);
          setFlash(f => f + 1);
          break;
        }
        case 'queue': {
          const item = d.approvedList.find(i => i.id === msg.id);
          if (!item) return;
          d.newItemsQueue = d.newItemsQueue.filter(i => i.id !== msg.id);
          d.newItemsQueue.unshift({ ...item, _manual: true });
          break;
        }
        case 'next': { tick(); setTimerNonce(n => n + 1); break; }
        case 'sync_req': scheduleState(); break;
        case 'show_top': {
          const items = buildTop(3);
          clearTimeout(topTimer.current);
          setTopOverlay({ items, id: Date.now() });
          if (items.length && settingsRef.current.fxLevel !== 'off') fx?.rain('❤️', 30);
          topTimer.current = setTimeout(() => setTopOverlay(null), 12000);
          break;
        }
        case 'announce': {
          const text = String(msg.text || '').slice(0, 140);
          if (!text) { setAnnounce(null); return; }
          clearTimeout(announceTimer.current);
          setAnnounce({ text, id: Date.now() });
          announceTimer.current = setTimeout(() => setAnnounce(null), Math.min(Math.max(Number(msg.seconds) || 10, 3), 60) * 1000);
          break;
        }
        case 'ticker': updateSettings({ ticker: String(msg.text || '').slice(0, 300) }); break;
        case 'settings': {
          const patch = {};
          if (msg.interval) patch.interval = Math.min(Math.max(Number(msg.interval), 3), 120);
          if (msg.transition) patch.transition = String(msg.transition);
          if (['off', 'low', 'high'].includes(msg.fxLevel)) patch.fxLevel = msg.fxLevel;
          updateSettings(patch);
          break;
        }
        default: break;
      }
    });
  }, [tick, scheduleState, buildTop]); // eslint-disable-line react-hooks/exhaustive-deps

  // หัวใจของรูปที่อยู่บนจอเพิ่มขึ้น → ป้ายเด้ง + หัวใจลอย
  useEffect(() => {
    if (!currentContent) return;
    const n = currentContent.hearts || 0;
    const prev = lastHearts.current;
    if (prev.id === currentContent.id && n > prev.n) {
      setHeartBump(b => b + 1);
      if (settingsRef.current.fxLevel !== 'off') {
        for (let i = 0; i < Math.min(n - prev.n, 5); i++) fxRef.current?.floatUp('❤️', { x: 120 + Math.random() * 200, size: 46 });
      }
    }
    lastHearts.current = { id: currentContent.id, n };
  }, [currentContent?.id, currentContent?.hearts]); // eslint-disable-line react-hooks/exhaustive-deps

  const remaining = currentContent && lastTickAt
    ? Math.max(0, Math.ceil(settings.interval - (now - lastTickAt) / 1000))
    : 0;
  const progress = currentContent && lastTickAt ? Math.min(1, (now - lastTickAt) / (settings.interval * 1000)) : 0;
  const social = currentContent?.socialType?.toLowerCase();
  const socialColor = SOCIAL_COLORS[social] || '#ffffff';
  const message = stripTags(currentContent?.message);
  const hbd = isBirthday(currentContent?.message);

  return (
    <div className="stage" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'black', fontFamily: 'var(--font-kanit), sans-serif' }}>
      <style>{`
        .image-slot { position: absolute; inset: 0; opacity: 0; transition: opacity 1.2s ease-in-out; z-index: 1; overflow: hidden; }
        .image-slot.visible { opacity: 1; z-index: 2; }
        .image-slot img { width: 100%; height: 100%; object-fit: contain; transform-origin: center; will-change: transform; }
        .image-slot.visible img { animation: kenburns var(--kb, 17s) linear forwards; }
        .image-slot .blur-bg { position: absolute; inset: 0; background: #07070c center / cover no-repeat; }
        .image-slot .fg { position: absolute; inset: 0; }
        @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.05); } }
        .image-slot.visible.a-zoom   { animation: t-zoom 1.3s cubic-bezier(.2,.8,.2,1); }
        .image-slot.visible.a-slide  { animation: t-slide 1.1s cubic-bezier(.7,0,.2,1); }
        .image-slot.visible.a-flip   { animation: t-flip 1.2s cubic-bezier(.2,.8,.2,1); }
        .image-slot.visible.a-glitch { animation: t-glitch .9s steps(1, end); }
        @keyframes t-zoom  { from { transform: scale(1.35); filter: blur(14px) brightness(1.6); } to { transform: none; filter: none; } }
        @keyframes t-slide { from { transform: translateX(100%); } to { transform: none; } }
        @keyframes t-flip  { from { transform: perspective(1800px) rotateY(-80deg) scale(.8); } to { transform: none; } }
        @keyframes t-glitch {
          0%  { clip-path: inset(40% 0 45% 0); transform: translateX(-40px); filter: hue-rotate(90deg) saturate(4); }
          15% { clip-path: inset(10% 0 70% 0); transform: translateX(35px);  filter: hue-rotate(-90deg) saturate(4); }
          30% { clip-path: inset(65% 0 5% 0);  transform: translateX(-20px); }
          45% { clip-path: inset(0 0 55% 0);   transform: translateX(25px); filter: invert(1); }
          60% { clip-path: inset(30% 0 20% 0); transform: translateX(-8px); filter: none; }
          75% { clip-path: inset(0);           transform: translateX(6px); }
          100%{ clip-path: inset(0);           transform: none; filter: none; }
        }

        .content-overlay { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 0.8s ease-out 0.5s; z-index: 10; }
        .content-overlay.visible { opacity: 1; }
        .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.35) 0%, transparent 25%, transparent 50%, rgba(0,0,0,.75) 100%); }

        .msg { color: #fff; text-align: center; font-size: clamp(2.9rem, max(5.4vw, 6.5vmin), 6.2rem); font-weight: 800; line-height: 1.15; margin: 0; text-wrap: balance;
               text-shadow: 0 0 30px rgba(0,0,0,.85), -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 4px 0 #000;
               animation: pop-in .9s cubic-bezier(.2,1.6,.4,1) both .6s; }
        @keyframes pop-in { from { opacity: 0; transform: scale(.4) rotate(-4deg); } to { opacity: 1; transform: none; } }

        .who { display: flex; flex-direction: column; background: rgba(0,0,0,.72); padding: 18px 26px; border-radius: 18px;
               border: 2px solid var(--sc); box-shadow: 0 0 30px var(--sc), inset 0 0 20px rgba(255,255,255,.05);
               animation: slide-up .8s cubic-bezier(.2,1.2,.4,1) both .8s; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: none; } }
        .who p { margin: 0; color: #fff; font-size: 2.4rem; line-height: 1.2; }
        .who .table { font-size: 1.8rem; opacity: .85; margin-top: 8px; }

        .timer { position: absolute; top: 5vh; right: 3vw; width: 64px; height: 64px; }
        .timer svg { transform: rotate(-90deg); }
        .timer span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 1.4rem; }

        .qr { background: #fff; padding: 10px; border-radius: 14px; box-shadow: 0 0 0 4px rgba(255,255,255,.15), 0 0 40px rgba(255,43,214,.45); animation: qr-glow 3s ease-in-out infinite; text-align: center; }
        .qr small { display: block; color: #111; font-weight: 700; font-size: 14px; margin-top: 4px; }
        @keyframes qr-glow { 50% { box-shadow: 0 0 0 4px rgba(255,255,255,.25), 0 0 60px rgba(0,229,255,.6); } }

        .idle { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 12px;
                background: radial-gradient(circle at 30% 30%, #3a0b5a, transparent 50%), radial-gradient(circle at 70% 70%, #003a5a, transparent 50%), #05050a;
                background-size: 200% 200%; animation: idle-bg 12s ease-in-out infinite; }
        @keyframes idle-bg { 50% { background-position: 100% 100%; } }
        .idle h1 { color: #fff; font-size: 7rem; margin: 0; letter-spacing: .05em; text-shadow: 0 0 40px #ff2bd6, 0 0 80px #00e5ff; animation: breathe 3s ease-in-out infinite; }
        .idle p { color: rgba(255,255,255,.75); font-size: 2rem; margin: 0; }
        @keyframes breathe { 50% { transform: scale(1.04); text-shadow: 0 0 60px #ff2bd6, 0 0 120px #00e5ff; } }

        .banner { position: absolute; top: 2.2rem; left: 50%; transform: translateX(-50%); z-index: 40; padding: 14px 36px; border-radius: 999px;
                  font-size: 2.6rem; font-weight: 700; color: #fff; white-space: nowrap; animation: banner-in .7s cubic-bezier(.2,1.5,.4,1) both; }
        .banner.new { background: linear-gradient(90deg, #ff2bd6, #7b2bff); box-shadow: 0 0 40px rgba(255,43,214,.7); }
        .banner.hbd { font-size: 3.4rem; background: linear-gradient(90deg, #ff5c39, #ffcc00, #39ff88, #00e5ff, #ff2bd6, #ff5c39); background-size: 300% 100%;
                      animation: banner-in .7s cubic-bezier(.2,1.5,.4,1) both, rainbow 3s linear infinite; text-shadow: 0 3px 0 rgba(0,0,0,.35); box-shadow: 0 0 60px rgba(255,204,0,.7); }
        @keyframes banner-in { from { opacity: 0; transform: translate(-50%, -120%) scale(.7); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes rainbow { to { background-position: 300% 0; } }

        .announce { position: absolute; inset: 0; z-index: 45; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.7); animation: fade .4s ease both; }
        .announce .box { max-width: 80%; padding: 50px 70px; border-radius: 32px; text-align: center; color: #fff; font-size: clamp(3rem, 6vw, 6.5rem); font-weight: 700; line-height: 1.2;
                         background: linear-gradient(#0b0b14, #0b0b14) padding-box, linear-gradient(90deg, #ff2bd6, #00e5ff, #ffe600, #ff2bd6) border-box;
                         border: 6px solid transparent; background-size: 100% 100%, 300% 100%; animation: pop-in .8s cubic-bezier(.2,1.6,.4,1) both, rainbow 2.5s linear infinite;
                         box-shadow: 0 0 80px rgba(255,43,214,.5); }
        .announce .tag { display: block; font-size: 1.6rem; letter-spacing: .3em; color: #00e5ff; margin-bottom: 14px; }
        @keyframes fade { from { opacity: 0; } }

        .ticker { position: absolute; left: 0; right: 0; bottom: 0; z-index: 35; height: 64px; background: linear-gradient(90deg, #ff2bd6, #7b2bff 50%, #00b8ff);
                  overflow: hidden; display: flex; align-items: center; box-shadow: 0 -6px 30px rgba(0,0,0,.5); }
        .ticker .label { position: relative; z-index: 2; background: #fff; color: #000; font-weight: 800; padding: 0 22px; height: 100%; display: flex; align-items: center; font-size: 1.6rem; letter-spacing: .1em; }
        .ticker .track { white-space: nowrap; color: #fff; font-size: 2rem; font-weight: 600; animation: marquee var(--dur, 20s) linear infinite; padding-left: 100%; }
        @keyframes marquee { to { transform: translateX(-100%); } }

        .heart-badge { display: inline-flex; align-items: center; gap: 8px; padding: 4px 16px; border-radius: 999px; background: rgba(255,43,100,.22);
                       border: 2px solid rgba(255,80,130,.7); color: #fff; font-size: 1.8rem; font-weight: 700; }
        .heart-badge.bump { animation: heart-bump .5s cubic-bezier(.2,1.8,.4,1); }
        @keyframes heart-bump { 0% { transform: scale(1); } 40% { transform: scale(1.35); background: rgba(255,43,100,.6); } 100% { transform: scale(1); } }
        .vote-hint { position: absolute; right: 2rem; bottom: calc(100% + 10px); white-space: nowrap; color: #fff; font-size: 1.1rem; font-weight: 600;
                     background: rgba(255,43,100,.85); padding: 6px 14px; border-radius: 999px; }

        .topov { position: absolute; inset: 0; z-index: 46; background: radial-gradient(circle at 50% 30%, rgba(80,0,40,.92), rgba(0,0,0,.94)); display: flex; flex-direction: column;
                 align-items: center; justify-content: center; gap: 40px; animation: fade .5s ease both; }
        .topov h2 { margin: 0; color: #fff; font-size: 5rem; text-shadow: 0 0 40px #ff2b64; }
        .podium { display: flex; gap: 40px; align-items: flex-end; }
        .pcard { width: 340px; border-radius: 26px; overflow: hidden; background: #111; border: 3px solid var(--mc); box-shadow: 0 0 50px var(--mc); animation: pop-in .8s cubic-bezier(.2,1.6,.4,1) both; }
        .pcard img { width: 100%; height: 300px; object-fit: cover; display: block; }
        .pcard.first { width: 420px; } .pcard.first img { height: 380px; }
        .pcard .pinfo { padding: 16px 20px; color: #fff; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .pcard .pname { font-size: 1.7rem; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pcard .ptable { font-size: 1.2rem; opacity: .7; }
        .pcard .pcount { font-size: 2rem; font-weight: 800; white-space: nowrap; }
        .medal { font-size: 4rem; text-align: center; margin-bottom: 8px; }

        .flash { position: absolute; inset: 0; z-index: 50; background: #fff; pointer-events: none; animation: flash .6s ease-out forwards; }
        @keyframes flash { from { opacity: .9; } to { opacity: 0; } }

        .hype { position: absolute; top: 40%; left: 50%; z-index: 41; transform: translate(-50%, -50%); font-size: 9rem; font-weight: 900; color: #fff;
                text-shadow: 0 0 40px #ff2bd6, 0 0 80px #ff5c39; animation: hype 2.8s cubic-bezier(.2,1.6,.4,1) both; white-space: nowrap; }
        @keyframes hype { 0% { opacity: 0; transform: translate(-50%, -50%) scale(.2); } 20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                          80% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-50%, -50%) scale(1.6); } }
      `}</style>

      {imageSlots.map((slot, index) => (
        <div
          key={`${index}-${slot.key}`}
          className={`image-slot ${slot.visible ? 'visible' : ''} a-${slot.anim}`}
          style={{ '--kb': `${settings.interval + 2}s` }}
        >
          {slot.src && <BlurBg src={slot.src} />}
          {slot.src && <div className="fg"><img src={slot.src} alt="" /></div>}
        </div>
      ))}

      <div className={`content-overlay ${currentContent || isIdle ? 'visible' : ''}`}>
        {isIdle && (
          <div className="idle">
            <h1>THER Phuket</h1>
            <p>สแกน QR ด้านล่าง ส่งรูปขึ้นจอได้เลย 📸</p>
          </div>
        )}

        {currentContent && <div className="shade" />}

        {currentContent && (
          <div className="timer">
            <svg width="64" height="64">
              <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,.2)" strokeWidth="5" fill="rgba(0,0,0,.55)" />
              <circle cx="32" cy="32" r="28" stroke={socialColor} strokeWidth="5" fill="none" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * progress} />
            </svg>
            <span>{remaining}</span>
          </div>
        )}

        {currentContent && message && (
          <div style={{ position: 'absolute', top: hbd ? '62%' : '68%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%' }}>
            <h1 key={`m-${showCount}`} className="msg">“{message}”</h1>
          </div>
        )}

        <div style={{ position: 'absolute', bottom: settings.ticker ? 'calc(4vh + 64px)' : '4vh', left: '3vw', right: '3vw', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            {currentContent && (
              <div key={`w-${showCount}`} className="who" style={{ '--sc': socialColor }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
                  <SocialIcon type={currentContent.socialType} />
                  <p>{currentContent.name}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '8px' }}>
                  {currentContent.tableNumber && <p className="table" style={{ margin: 0 }}>🍸 โต๊ะ {currentContent.tableNumber}</p>}
                  <span key={`h-${heartBump}`} className={`heart-badge ${heartBump ? 'bump' : ''}`}>❤️ {currentContent.hearts || 0}</span>
                </div>
              </div>
            )}
          </div>
          <div className="qr">
            {uploadUrl && <QRCode value={uploadUrl} size={150} />}
            <small>สแกน ส่งรูป + กด ❤️</small>
          </div>
        </div>
      </div>

      <FxCanvas ref={fxRef} level={settings.fxLevel} />

      {banner && (
        <div key={banner.id} className={`banner ${banner.kind}`}>
          {banner.kind === 'hbd' ? `🎂 ${banner.text} 🎂` : `📸 ${banner.text}`}
        </div>
      )}

      {hype && <div key={hype.id} className="hype">{hype.emoji} HYPE! {hype.emoji}</div>}

      {announce && (
        <div key={announce.id} className="announce">
          <div className="box"><span className="tag">📢 ANNOUNCEMENT</span>{announce.text}</div>
        </div>
      )}

      {topOverlay && (
        <div key={topOverlay.id} className="topov">
          <h2>🏆 รูปยอดฮิตคืนนี้</h2>
          {topOverlay.items.length === 0 ? (
            <p style={{ color: '#fff', fontSize: '2.4rem', margin: 0 }}>ยังไม่มีใครกดหัวใจ สแกน QR แล้วกด ❤️ เลย!</p>
          ) : (
            <div className="podium">
              {[1, 0, 2].map(rank => {
                const it = topOverlay.items[rank];
                if (!it) return null;
                const mc = ['#ffd700', '#c0c0c0', '#cd7f32'][rank];
                return (
                  <div key={it.id} style={{ animationDelay: `${rank * 0.2}s` }}>
                    <div className="medal">{['🥇', '🥈', '🥉'][rank]}</div>
                    <div className={`pcard ${rank === 0 ? 'first' : ''}`} style={{ '--mc': mc, animationDelay: `${0.2 + (2 - rank) * 0.2}s` }}>
                      <img src={it.imageUrl} alt="" />
                      <div className="pinfo">
                        <div style={{ minWidth: 0 }}>
                          <div className="pname">{it.name || 'ไม่ระบุชื่อ'}</div>
                          {it.tableNumber && <div className="ptable">โต๊ะ {it.tableNumber}</div>}
                        </div>
                        <div className="pcount">❤️ {it.count}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {settings.ticker && (
        <div className="ticker">
          <div className="label">THER</div>
          <div className="track" style={{ '--dur': `${Math.max(12, settings.ticker.length * 0.35)}s` }}>
            {settings.ticker}&nbsp;&nbsp;✦&nbsp;&nbsp;{settings.ticker}
          </div>
        </div>
      )}

      {flash > 0 && <div key={`f-${flash}`} className="flash" />}
    </div>
  );
}
