'use client';
// ─────────────────────────────────────────────────────────────
//  MiniScreen: แกลเลอรีบนมือถือลูกค้า เลือกรูปแล้วกดหัวใจ + อันดับรูปยอดฮิต
//  คนละ 1 หัวใจต่อรูป: คะแนนเก็บในฐานข้อมูล (ตาราง hearts) ผ่าน /api/heart
// ─────────────────────────────────────────────────────────────
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { onFx, sendFx, stripTags, isBirthday } from '@/lib/liveFx';
import { supabase } from '@/lib/supabaseClient';

const CID_KEY = 'ther_cid';
const LIKED_KEY = 'ther_liked';

function getCid() {
  try {
    let id = localStorage.getItem(CID_KEY);
    if (!id || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) {
      id = (crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 36);
      localStorage.setItem(CID_KEY, id);
    }
    return id;
  } catch {
    return 'anon-' + Math.random().toString(36).slice(2);
  }
}
const loadLiked = () => { try { return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || '[]')); } catch { return new Set(); } };
const saveLiked = (set) => { try { localStorage.setItem(LIKED_KEY, JSON.stringify([...set].slice(-500))); } catch {} };

export default function MiniScreen() {
  const [now, setNow] = useState(null);
  const [liked, setLiked] = useState(() => new Set());
  const cid = useRef('');
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('new');         // 'new' | 'hot'
  const [viewer, setViewer] = useState(null);      // รูปที่เปิดดูแบบเต็ม
  const [viewerBurst, setViewerBurst] = useState(0);
  const viewerTap = useRef(0);
  useEffect(() => {
    if (!viewer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setViewer(null); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [viewer]);

  // จำนวนหัวใจของแต่ละรูป (มาจากคอลัมน์ hearts ในฐานข้อมูล)
  const counts = useMemo(() => Object.fromEntries(photos.map(p => [p.id, p.hearts || 0])), [photos]);
  const top = useMemo(() => photos.filter(p => (p.hearts || 0) > 0)
    .sort((a, b) => b.hearts - a.hearts).slice(0, 5)
    .map(p => ({ ...p, count: p.hearts, message: stripTags(p.message) })), [photos]);

  const loadPhotos = async () => {
    const { data } = await supabase.from('submissions').select('*').eq('status', 'approved').order('created_at', { ascending: false });
    if (data) setPhotos(data);
  };
  // รูปที่มือถือเครื่องนี้กดหัวใจไปแล้ว (ถามจากฐานข้อมูล)
  const loadLikedFromServer = async () => {
    try {
      const r = await fetch(`/api/heart?cid=${encodeURIComponent(cid.current)}`);
      const j = await r.json();
      if (Array.isArray(j.liked)) { const set = new Set(j.liked.map(String)); setLiked(set); saveLiked(set); }
    } catch {}
  };

  useEffect(() => {
    cid.current = getCid();
    setLiked(loadLiked());
    loadPhotos();
    loadLikedFromServer();

    // อัปเดตสดจากฐานข้อมูล: รูปใหม่ / จำนวนหัวใจเปลี่ยน / รูปถูกเอาออก
    const ch = supabase.channel('guest-gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, (payload) => {
        const row = payload.new, old = payload.old;
        setPhotos(prev => {
          if (payload.eventType === 'DELETE') return prev.filter(p => p.id !== old.id);
          if (row.status !== 'approved') return prev.filter(p => p.id !== row.id);
          const i = prev.findIndex(p => p.id === row.id);
          if (i === -1) return [row, ...prev];
          const next = [...prev]; next[i] = { ...next[i], ...row }; return next;
        });
      }).subscribe();

    const off = onFx((msg) => {
      if (msg.type === 'state') setNow(msg.now || null);
      if (msg.type === 'hearts_reset') { setLiked(new Set()); saveLiked(new Set()); loadPhotos(); }
    });
    sendFx('sync_req').catch(() => {});
    const poll = setInterval(loadPhotos, 60000); // กันพลาด เผื่อการเชื่อมต่อสดหลุด
    return () => { off(); clearInterval(poll); supabase.removeChannel(ch); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // กดหัวใจให้รูปไหนก็ได้ (คนละ 1 หัวใจต่อรูป)
  const heartId = async (id) => {
    try { navigator.vibrate?.(20); } catch {}
    const key = String(id);
    if (liked.has(key)) return;
    const next = new Set(liked); next.add(key);
    setLiked(next); saveLiked(next);
    setPhotos(prev => prev.map(p => (String(p.id) === key ? { ...p, hearts: (p.hearts || 0) + 1 } : p))); // โชว์ทันที
    try {
      const r = await fetch('/api/heart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, cid: cid.current }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      setPhotos(prev => prev.map(p => (String(p.id) === key ? { ...p, hearts: j.hearts } : p)));
    } catch {
      // ส่งไม่สำเร็จ → คืนค่าเดิม ให้กดใหม่ได้
      const back = new Set(next); back.delete(key);
      setLiked(back); saveLiked(back);
      setPhotos(prev => prev.map(p => (String(p.id) === key ? { ...p, hearts: Math.max(0, (p.hearts || 1) - 1) } : p)));
    }
  };
  const viewerHeart = () => { if (!viewer) return; setViewerBurst(b => b + 1); heartId(viewer.id); };
  const onViewerTap = () => {
    const t = Date.now();
    if (t - viewerTap.current < 320) viewerHeart();
    viewerTap.current = t;
  };

  const q = query.trim().toLowerCase();
  const shown = photos
    .filter(p => !q || `${p.name || ''} ${p.tableNumber || ''} ${stripTags(p.message)}`.toLowerCase().includes(q))
    .sort((a, b) => (sort === 'hot' ? (counts[b.id] || 0) - (counts[a.id] || 0) : 0));


  return (
    <div className="mini-card">
      <style>{`
        .mini-card { background: rgba(13,22,38,0.95); border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; width: 100%; max-width: 520px;
                     overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.6); position: relative; z-index: 1; }
        .mini-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px 14px; }
        .mini-title { font-size: 16px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px; }
        .live-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 800; letter-spacing: 1.2px; color: #fff;
                     background: #e11d48; padding: 3px 9px; border-radius: 20px; }
        .live-pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #fff; animation: livep 1s infinite; }
        .live-pill.off { background: #334155; } .live-pill.off::before { animation: none; opacity: .5; }
        @keyframes livep { 50% { opacity: .3; } }
        .mini-sub { font-size: 12px; color: #5a6a7d; }

        .mini-screen { position: relative; margin: 0 16px; aspect-ratio: 16/10; border-radius: 18px; overflow: hidden; background: #05060a;
                       border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 0 0 4px rgba(255,255,255,0.03); user-select: none; -webkit-user-select: none; }
        .mini-screen img.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: blur(14px) brightness(.4); transform: scale(1.1); }
        .mini-screen img.fg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; animation: mini-in .5s ease both; }
        @keyframes mini-in { from { opacity: 0; transform: scale(1.04); } }
        .mini-meta { position: absolute; left: 0; right: 0; bottom: 0; padding: 26px 14px 10px; background: linear-gradient(transparent, rgba(0,0,0,.85));
                     color: #fff; display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; }
        .mini-name { font-size: 15px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .mini-msg { font-size: 12px; opacity: .8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .mini-count { font-size: 14px; font-weight: 800; white-space: nowrap; background: rgba(225,29,72,.85); padding: 4px 10px; border-radius: 20px; }
        .mini-empty { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: #5a6a7d; font-size: 13px; text-align: center; padding: 20px; }
        .big-heart { position: absolute; left: 50%; top: 50%; font-size: 90px; pointer-events: none; animation: big-heart .8s ease-out forwards; }
        @keyframes big-heart { 0% { opacity: 0; transform: translate(-50%,-50%) scale(.3); } 25% { opacity: 1; transform: translate(-50%,-50%) scale(1.15); }
                               60% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 100% { opacity: 0; transform: translate(-50%,-80%) scale(1.1); } }

        .heart-btn { margin: 14px 16px 0; width: calc(100% - 32px); height: 58px; border-radius: 16px; border: none; cursor: pointer; font-family: inherit;
                     font-size: 17px; font-weight: 800; color: #fff; display: flex; align-items: center; justify-content: center; gap: 10px;
                     background: linear-gradient(135deg, #e11d48, #be185d); box-shadow: 0 8px 26px rgba(225,29,72,.4); transition: transform .12s, box-shadow .2s, background .2s; }
        .heart-btn:active { transform: scale(.96); }
        .heart-btn.done { background: rgba(225,29,72,.14); color: #fb7185; box-shadow: none; border: 1.5px solid rgba(225,29,72,.5); }
        .heart-btn:disabled { opacity: .4; cursor: default; }
        .heart-ico { font-size: 22px; display: inline-block; }
        .heart-ico.pop { animation: heart-pop .45s cubic-bezier(.2,1.8,.4,1); }
        @keyframes heart-pop { 40% { transform: scale(1.6); } }
        .mini-tip { text-align: center; font-size: 11px; color: #5a6a7d; margin-top: 8px; }

        .top-wrap { margin: 18px 16px 18px; padding: 14px; border-radius: 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
        .top-title { font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 10px; display: flex; justify-content: space-between; }
        .top-title span { font-weight: 500; color: #5a6a7d; font-size: 11px; }
        .top-row { display: flex; align-items: center; gap: 10px; padding: 7px 4px; border-radius: 12px; }
        .top-row.me { background: rgba(225,29,72,.1); }
        .top-rank { width: 26px; text-align: center; font-size: 18px; font-weight: 800; color: #5a6a7d; }
        .top-thumb { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; background: #111; flex-shrink: 0; }
        .top-info { flex: 1; min-width: 0; }
        .top-name { font-size: 13px; font-weight: 700; color: #e8f0f8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .top-table { font-size: 11px; color: #5a6a7d; }
        .top-count { font-size: 14px; font-weight: 800; color: #fb7185; white-space: nowrap; }
        .gal-tools { display: flex; gap: 8px; margin: 0 16px 10px; }
        .gal-search { flex: 1; min-width: 0; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 12px; font-size: 14px; color: #e8f0f8; outline: none; font-family: inherit; }
        .gal-search:focus { border-color: rgba(225,29,72,.5); }
        .gal-sort { border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.3); color: #e8f0f8; border-radius: 12px; padding: 0 12px; font-size: 12px; font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap; }
        .gal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin: 0 16px 18px; max-height: 560px; overflow-y: auto; border-radius: 14px; }
        .gal-item { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: #111; cursor: pointer; border: none; padding: 0; }
        .gal-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .gal-item .gc { position: absolute; left: 6px; bottom: 6px; font-size: 11px; font-weight: 800; color: #fff; background: rgba(0,0,0,.6); padding: 2px 7px; border-radius: 20px; }
        .gal-item.liked .gc { background: rgba(225,29,72,.9); }
        .gal-item .gt { position: absolute; right: 6px; top: 6px; font-size: 10px; font-weight: 700; color: #fff; background: rgba(0,0,0,.55); padding: 2px 6px; border-radius: 8px; }
        .gnow { position: absolute; right: 6px; bottom: 6px; font-size: 10px; font-weight: 800; color: #fff; background: #e11d48; padding: 2px 7px; border-radius: 8px; box-shadow: 0 0 10px rgba(225,29,72,.7); }
        .gal-item.onair { outline: 2px solid #e11d48; outline-offset: -2px; }
        .gal-empty { grid-column: 1/-1; text-align: center; color: #5a6a7d; font-size: 13px; padding: 30px 10px; }

        .viewer { position: fixed; inset: 0; z-index: 100; background: #000; display: flex; flex-direction: column; animation: vfade .2s ease; }
        @keyframes vfade { from { opacity: 0; } }
        .viewer-top { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; color: #fff; gap: 10px; }
        .viewer-close { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.08); color: #fff; font-size: 18px; cursor: pointer; flex-shrink: 0; }
        .viewer-img { flex: 1; min-height: 0; position: relative; user-select: none; -webkit-user-select: none; }
        .viewer-img img { width: 100%; height: 100%; object-fit: contain; }
        .viewer-bottom { padding: 14px 16px 22px; }
        .viewer-msg { color: #e8f0f8; font-size: 15px; text-align: center; margin-bottom: 12px; }
        .viewer .heart-btn { margin: 0; width: 100%; }

        .top-empty { font-size: 12px; color: #5a6a7d; text-align: center; padding: 8px; }
      `}</style>

      <div className="mini-head">
        <div className="mini-title">❤️ โหวตรูปที่ชอบ <span className="live-pill">LIVE</span></div>
        <div className="mini-sub">แตะรูปเพื่อดู + กด ❤️</div>
      </div>

      <div className="gal-tools">
        <input className="gal-search" placeholder="🔍 ค้นหาชื่อ หรือเลขโต๊ะ" value={query} onChange={e => setQuery(e.target.value)} />
        <button type="button" className="gal-sort" onClick={() => setSort(s => (s === 'new' ? 'hot' : 'new'))}>
          {sort === 'new' ? '🕒 ล่าสุด' : '🔥 ยอดฮิต'}
        </button>
      </div>
      <div className="gal-grid">
        {shown.length === 0 ? (
          <div className="gal-empty">{photos.length === 0 ? 'ยังไม่มีรูปบนจอ' : 'ไม่เจอรูปที่ค้นหา'}</div>
        ) : shown.map(p => (
          <button type="button" key={p.id} className={`gal-item ${liked.has(String(p.id)) ? 'liked' : ''} ${now && String(now.id) === String(p.id) ? 'onair' : ''}`} onClick={() => setViewer(p)}>
            <img src={p.imageUrl} alt="" loading="lazy" />
            <span className="gc">{liked.has(String(p.id)) ? '💖' : '❤️'} {counts[p.id] || 0}</span>
            {p.tableNumber && <span className="gt">โต๊ะ {p.tableNumber}</span>}
            {now && String(now.id) === String(p.id) && <span className="gnow">📺 บนจอ</span>}
          </button>
        ))}
      </div>

      <div className="top-wrap">
        <div className="top-title">🏆 รูปยอดฮิตคืนนี้ <span>อัปเดตสด</span></div>
        {top.length === 0 ? (
          <div className="top-empty">ยังไม่มีใครกดหัวใจ เป็นคนแรกเลย!</div>
        ) : top.map((t, i) => (
          <div key={t.id} className={`top-row ${liked.has(String(t.id)) ? 'me' : ''}`} onClick={() => setViewer(t)} style={{ cursor: 'pointer' }}>
            <div className="top-rank">{['🥇', '🥈', '🥉'][i] || i + 1}</div>
            <img className="top-thumb" src={t.imageUrl} alt="" />
            <div className="top-info">
              <div className="top-name">{t.name || 'ไม่ระบุชื่อ'}</div>
              {t.tableNumber && <div className="top-table">โต๊ะ {t.tableNumber}</div>}
            </div>
            <div className="top-count">❤️ {t.count}</div>
          </div>
        ))}
      </div>

      {viewer && createPortal(
        <div className="viewer">
          <div className="viewer-top">
            <div style={{ minWidth: 0 }}>
              <div className="mini-name">{isBirthday(viewer.message) ? '🎂 ' : ''}{viewer.name || 'ไม่ระบุชื่อ'}</div>
              {viewer.tableNumber && <div className="top-table">โต๊ะ {viewer.tableNumber}</div>}
            </div>
            <button type="button" className="viewer-close" onClick={() => setViewer(null)} aria-label="ปิด">✕</button>
          </div>
          <div className="viewer-img" onClick={onViewerTap}>
            <img src={viewer.imageUrl} alt="" draggable={false} />
            {viewerBurst > 0 && <div key={viewerBurst} className="big-heart">❤️</div>}
          </div>
          <div className="viewer-bottom">
            {stripTags(viewer.message) && <div className="viewer-msg">“{stripTags(viewer.message)}”</div>}
            <button type="button" className={`heart-btn ${liked.has(String(viewer.id)) ? 'done' : ''}`} onClick={viewerHeart}>
              <span key={viewerBurst} className={`heart-ico ${viewerBurst ? 'pop' : ''}`}>{liked.has(String(viewer.id)) ? '💖' : '❤️'}</span>
              {liked.has(String(viewer.id)) ? `กดหัวใจแล้ว · ❤️ ${counts[viewer.id] || 0}` : `กดหัวใจให้รูปนี้ · ❤️ ${counts[viewer.id] || 0}`}
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
