'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  CheckCircle2, XCircle, Zap, Trash2, RefreshCcw,
  Maximize2, Loader2, X, Search, RefreshCw
} from 'lucide-react';

// ─── Social Icon (SVG จาก display/page.js) ──────────────────────
const SocialBadge = ({ type }) => {
  const t = type?.toLowerCase();
  const s = 24;
  if (t === 'facebook') return (
    <svg width={s} height={s} viewBox="0 0 105.78513 105.78513">
      <g transform="translate(-29.12827,-77.419919)">
        <g transform="matrix(0.98570778,0,0,0.98570778,1.1722601,1.8624552)">
          <circle r="47.625" cy="130.31248" cx="82.020836" fill="#0066ff"/>
          <path d="m 89.822943,107.76035 c -4.444987,-0.0186 -9.850149,0.22118 -11.336776,1.41386 -2.911076,2.33548 -2.258777,6.83421 -2.258777,6.83421 h 0.0098 v 8.17728 l -8.351943,-0.0424 2.606043,7.95146 5.7459,0.0176 v 22.96759 h 9.621637 v -22.93762 l 6.281269,0.0191 2.204516,-7.88427 -8.485785,-0.0429 v -8.13284 l 10.274823,0.0997 0.02274,-8.25583 c 0,0 -2.876251,-0.17051 -6.333464,-0.185 z" fill="#ffffff"/>
        </g>
      </g>
    </svg>
  );
  if (t === 'instagram') return (
    <svg width={s} height={s} viewBox="0 0 105.8851 105.88512">
      <defs>
        <linearGradient id="igGrad">
          <stop offset="0" stopColor="#00009f"/>
          <stop offset="0.32" stopColor="#7500cb" stopOpacity="0.53"/>
          <stop offset="0.59" stopColor="#c30077" stopOpacity="0.71"/>
          <stop offset="0.83" stopColor="#ff0000" stopOpacity="0.93"/>
          <stop offset="1" stopColor="#ffff00"/>
        </linearGradient>
      </defs>
      <g transform="translate(-52.572577,-100.74468)">
        <g transform="matrix(0.93003423,0,0,0.93003423,7.3824477,10.752847)">
          <ellipse ry="47.625" rx="46.125" cy="154.125" cx="105.84524" fill="url(#igGrad)"/>
          <rect ry="9.4182072" y="132.91701" x="83.404526" height="44.695126" width="44.695126" stroke="#ffffff" strokeWidth="2.41370797" fill="none"/>
          <circle r="2.7381825" cy="139.84071" cx="118.28339" fill="#ffffff"/>
          <circle r="11.584605" cy="155.26457" cx="105.75208" stroke="#ffffff" strokeWidth="3.32993841" fill="none"/>
        </g>
      </g>
    </svg>
  );
  if (t === 'line') return (
    <svg width={s} height={s} viewBox="0 0 99 99">
      <g>
        <rect fill="#3ACD01" height="99.4661" rx="10" ry="10" width="99.4661"/>
        <path fill="white" d="M50 17c19,0 35,12 35,28 0,5 -2,11 -5,15 0,0 -1,0 -1,1l0 0c-1,1 -2,2 -4,3 -10,9 -26,20 -28,19 -2,-2 3,-9 -2,-10 -1,0 -1,0 -1,0l0 0 0 0c-17,-3 -30,-14 -30,-28 0,-16 16,-28 36,-28zm-21 37l0 0 0 0 7 0c1,0 2,-1 2,-2l0 0c0,-1 -1,-2 -2,-2l-5 0 0 -12c0,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 14c0,1 1,2 2,2zm44 -9l0 0 0 0c0,-1 0,-2 -1,-2l-6 0 0 -2 6 0c1,0 1,-1 1,-2l0 0c0,-1 0,-2 -1,-2l-7 0 0 0 -1 0c-1,0 -1,1 -1,2l0 13c0,1 0,2 1,2l1 0 0 0 7 0c1,0 1,-1 1,-2l0 0c0,-1 0,-2 -1,-2l-6 0 0 -3 6 0c1,0 1,-1 1,-2zm-13 8l0 0 0 0c0,0 0,0 0,-1l0 -14c0,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 9 -6 -9c-1,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 14c0,1 1,2 2,2l0 0c1,0 2,-1 2,-2l0 -8 7 9c0,0 0,0 0,0l0 0c0,1 0,1 1,1 0,0 0,0 0,0l0 0c1,0 1,0 1,0 0,0 1,0 1,-1zm-18 1l0 0 0 0c1,0 2,-1 2,-2l0 -14c0,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 14c0,1 1,2 2,2z"/>
      </g>
    </svg>
  );
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
    </svg>
  );
};

// ─── Time ago ────────────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}วิ`;
  if (diff < 3600) return `${Math.floor(diff / 60)}นาที`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}ชม.`;
  return `${Math.floor(diff / 86400)}วัน`;
}

// ─── Toast ───────────────────────────────────────────────────────
let toastId = 0;
const ToastContainer = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map(t => (
      <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>
    ))}
  </div>
);

// ─── Confirm Modal ───────────────────────────────────────────────
const ConfirmModal = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon">🗑️</div>
        <div className="confirm-title">ยืนยันการลบถาวร</div>
        <div className="confirm-sub">ข้อมูลนี้จะถูกลบออกจากฐานข้อมูลอย่างถาวร ไม่สามารถกู้คืนได้</div>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>ยกเลิก</button>
          <button className="btn-confirm-del" onClick={onConfirm}>ลบถาวร</button>
        </div>
      </div>
    </div>
  );
};

// ─── Image Modal ─────────────────────────────────────────────────
const ImageModal = ({ url, onClose }) => {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);
  if (!url) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close" onClick={onClose}><X size={22} /></button>
      <img
        src={url}
        className="modal-img"
        alt="Preview"
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
};

// ─── Card ────────────────────────────────────────────────────────
const Card = ({ item, onAction, onPush, onDeletePermanent, onPreview, onSaveMessage }) => {
  const [msg, setMsg] = useState(item.message || '');

  return (
    <div className="card">
      {/* Image */}
      <div className="card-img" onClick={() => onPreview(item.imageUrl)}>
        <img src={item.imageUrl} alt="" loading="lazy" />
        <div className="img-overlay">
          <Maximize2 size={28} color="white" />
        </div>
        {item.status === 'approved' && (
          <div className="badge-onair">ON AIR</div>
        )}
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="card-meta">
          <div className="card-meta-left">
            <span className="table-num">T-{item.tableNumber}</span>
            <SocialBadge type={item.socialType} />
          </div>
          <span className="time-stamp">{timeAgo(item.created_at)}</span>
        </div>
        {item.name && (
          <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '-4px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {item.name}
          </div>
        )}

        <textarea
          className="msg-input"
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onBlur={() => onSaveMessage(item.id, msg)}
          placeholder="พิมพ์ข้อความที่ต้องการโชว์บนจอ..."
        />

        <div className="actions">
          {item.status === 'pending' && (
            <>
              <button className="btn btn-reject" onClick={() => onAction(item.id, 'rejected')}>
                <XCircle size={14} /> ข้าม
              </button>
              <button className="btn btn-approve" onClick={() => onAction(item.id, 'approved')}>
                <CheckCircle2 size={14} /> อนุมัติ
              </button>
            </>
          )}
          {item.status === 'approved' && (
            <>
              <button className="btn btn-push" onClick={() => onPush(item.id)}>
                <Zap size={14} fill="currentColor" /> รัดคิว
              </button>
              <button className="btn btn-icon btn-trash" onClick={() => onAction(item.id, 'rejected')}>
                <Trash2 size={15} />
              </button>
            </>
          )}
          {item.status === 'rejected' && (
            <>
              <button className="btn btn-restore" onClick={() => onAction(item.id, 'pending')}>
                <RefreshCcw size={14} /> กู้คืน
              </button>
              <button className="btn btn-icon btn-delete-hard" onClick={() => onDeletePermanent(item.id)}>
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────
export default function SuperAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [search, setSearch] = useState('');
  const [toasts, setToasts] = useState([]);
  const [confirmId, setConfirmId] = useState(null);

  // Toast helper
  const showToast = useCallback((msg, type = 'info') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  // Fetch
  const fetchData = useCallback(async () => {
    const { data: res, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && res) setData(res);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const channel = supabase.channel('super_admin_v2')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, fetchData)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [fetchData]);

  // Action (approve / reject / restore)
  const handleAction = async (id, status) => {
    setData(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    try {
      const apiPath = status === 'approved' ? 'approve' : 'reject';
      const path = status === 'pending' ? 'reject' : apiPath;
      const res = await fetch(`/api/${path}/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { showToast('❌ อัปเดตไม่สำเร็จ', 'error'); fetchData(); return; }
      const labels = { approved: '✅ อนุมัติแล้ว', rejected: '🗑️ ย้ายไปถังขยะ', pending: '↩️ กู้คืนแล้ว' };
      showToast(labels[status] || 'สำเร็จ', status === 'approved' ? 'success' : 'info');
    } catch {
      showToast('⚠️ เกิดข้อผิดพลาด', 'error');
      fetchData();
    }
  };

  // Push to front
  const pushNext = async (id) => {
    const newTime = new Date().toISOString();
    setData(prev => prev.map(i => i.id === id ? { ...i, created_at: newTime } : i));
    try {
      await supabase.from('submissions').update({ created_at: newTime }).eq('id', id);
      showToast('⚡ ดันขึ้นคิวถัดไปสำเร็จ!', 'success');
    } catch {
      showToast('⚠️ เกิดข้อผิดพลาด', 'error');
    }
  };

  // Delete permanent
  const deletePermanent = async (id) => {
    setConfirmId(null);
    setData(prev => prev.filter(i => i.id !== id));
    try {
      const res = await fetch(`/api/delete/${id}`, { method: 'DELETE' });
      if (!res.ok) { showToast('❌ ลบไม่สำเร็จ', 'error'); fetchData(); return; }
      showToast('🗑️ ลบข้อมูลสำเร็จ', 'success');
    } catch {
      showToast('⚠️ เกิดข้อผิดพลาด', 'error');
      fetchData();
    }
  };

  // Save message
  const saveMessage = async (id, value) => {
    const item = data.find(i => i.id === id);
    if (!item || item.message === value) return;
    setData(prev => prev.map(i => i.id === id ? { ...i, message: value } : i));
    await supabase.from('submissions').update({ message: value }).eq('id', id);
    showToast('💾 บันทึกข้อความแล้ว', 'info');
  };

  // Filter
  const counts = {
    pending: data.filter(i => i.status === 'pending').length,
    approved: data.filter(i => i.status === 'approved').length,
    rejected: data.filter(i => i.status === 'rejected').length,
  };
  const filtered = data.filter(i => {
    if (i.status !== tab) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      String(i.tableNumber).includes(q) ||
      (i.message || '').toLowerCase().includes(q) ||
      (i.socialType || '').toLowerCase().includes(q)
    );
  });

  if (loading) return (
    <div className="loading-screen">
      <Loader2 className="spin" size={48} />
      <p>THER PHUKET SYSTEM STARTING...</p>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #060b14;
          --bg2: #0d1626;
          --bg3: #111d2e;
          --surface: rgba(255,255,255,0.04);
          --surface2: rgba(255,255,255,0.07);
          --border: rgba(255,255,255,0.08);
          --border2: rgba(255,255,255,0.14);
          --text: #e8f0f8;
          --muted: #6b7d90;
          --accent: #3b82f6;
          --green: #10d58a;
          --red: #f43f5e;
          --amber: #f59e0b;
          --cyan: #22d3ee;
          --r: 12px;
          --r2: 16px;
        }

        body {
          font-family: 'Space Grotesk', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }

        .loading-screen {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text);
          gap: 16px;
          font-family: 'Space Grotesk', sans-serif;
        }
        .spin { animation: spin .8s linear infinite; color: var(--accent); }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* App wrapper */
        .admin-app {
          position: relative;
          min-height: 100vh;
          padding: 24px;
          background:
            radial-gradient(ellipse 600px 400px at 10% 20%, rgba(59,130,246,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 400px 300px at 85% 80%, rgba(16,213,138,0.05) 0%, transparent 70%),
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.025) 39px, rgba(255,255,255,0.025) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.025) 39px, rgba(255,255,255,0.025) 40px),
            var(--bg);
        }

        .admin-inner { max-width: 1400px; margin: 0 auto; }

        /* Header */
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .logo { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; line-height: 1; font-family: 'Space Grotesk', sans-serif; }
        .logo .brand { color: var(--text); }
        .logo .ctrl { background: linear-gradient(135deg, var(--accent), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .logo-sub { font-size: 11px; color: var(--muted); font-family: 'JetBrains Mono', monospace; letter-spacing: 1.5px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; margin-top: 6px; }
        .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); animation: pulse-dot 1.5s ease-in-out infinite; flex-shrink: 0; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.8)} }

        .header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

        /* Search */
        .search-wrap { position: relative; }
        .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
        .search-input {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 9px 12px 9px 34px;
          font-size: 13px;
          color: var(--text);
          font-family: 'Space Grotesk', sans-serif;
          outline: none;
          transition: all .2s;
          width: 220px;
        }
        .search-input::placeholder { color: var(--muted); }
        .search-input:focus { border-color: rgba(59,130,246,0.45); background: var(--surface2); }

        .icon-btn {
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--muted);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s;
        }
        .icon-btn:hover { color: var(--text); background: var(--surface2); border-color: var(--border2); }

        /* Stats */
        .stats-bar { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r);
          padding: 14px 18px;
          display: flex; align-items: center; gap: 12px;
          flex: 1; min-width: 130px;
          transition: all .2s;
        }
        .stat-card:hover { background: var(--surface2); transform: translateY(-1px); border-color: var(--border2); }
        .stat-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .stat-icon.blue { background: rgba(59,130,246,0.15); }
        .stat-icon.amber { background: rgba(245,158,11,0.12); }
        .stat-icon.green { background: rgba(16,213,138,0.12); }
        .stat-icon.red { background: rgba(244,63,94,0.12); }
        .stat-val { font-size: 24px; font-weight: 700; font-family: 'JetBrains Mono', monospace; line-height: 1; }
        .stat-val.blue { color: var(--accent); }
        .stat-val.amber { color: var(--amber); }
        .stat-val.green { color: var(--green); }
        .stat-val.red { color: var(--red); }
        .stat-label { font-size: 11px; color: var(--muted); letter-spacing: .4px; margin-top: 2px; }

        /* Tabs */
        .tabs-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .tabs { display: flex; gap: 4px; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--r2); padding: 4px; }
        .tab-btn {
          padding: 8px 18px; border-radius: 10px; border: none; cursor: pointer;
          font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 600;
          color: var(--muted); background: transparent;
          transition: all .2s;
          display: flex; align-items: center; gap: 7px;
        }
        .tab-btn:hover { color: var(--text); background: var(--surface2); }
        .tab-btn.active { color: white; }
        .tab-btn.active.pending { background: linear-gradient(135deg, #2563eb, #1d4ed8); box-shadow: 0 0 20px rgba(59,130,246,0.35); }
        .tab-btn.active.approved { background: linear-gradient(135deg, #059669, #047857); box-shadow: 0 0 20px rgba(16,213,138,0.3); }
        .tab-btn.active.rejected { background: linear-gradient(135deg, #be123c, #9f1239); box-shadow: 0 0 20px rgba(244,63,94,0.3); }
        .tab-badge {
          background: rgba(255,255,255,0.18); color: white;
          border-radius: 20px; padding: 1px 7px;
          font-size: 11px; font-weight: 700; min-width: 20px; text-align: center;
        }

        /* Grid */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }

        /* Card */
        .card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          overflow: hidden;
          display: flex; flex-direction: column;
          transition: all .25s ease;
        }
        .card:hover { border-color: rgba(59,130,246,0.4); transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.1); }

        .card-img { position: relative; aspect-ratio: 4/3; overflow: hidden; cursor: zoom-in; background: var(--bg3); }
        .card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; display: block; }
        .card:hover .card-img img { transform: scale(1.04); }
        .img-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0); transition: background .2s; display: flex; align-items: center; justify-content: center; }
        .card-img:hover .img-overlay { background: rgba(0,0,0,0.5); }
        .img-overlay svg { opacity: 0; transition: opacity .2s; }
        .card-img:hover .img-overlay svg { opacity: 1; }

        .badge-onair {
          position: absolute; top: 10px; left: 10px; z-index: 2;
          background: var(--green); color: white;
          font-size: 9px; font-weight: 800; letter-spacing: 1.5px;
          padding: 3px 8px; border-radius: 20px;
          display: flex; align-items: center; gap: 5px;
          box-shadow: 0 0 12px rgba(16,213,138,0.5);
          text-transform: uppercase;
        }
        .badge-onair::before { content:''; width:5px; height:5px; border-radius:50%; background:white; animation: pulse-dot 1s infinite; }

        .card-body { padding: 16px; flex: 1; display: flex; flex-direction: column; gap: 12px; }
        .card-meta { display: flex; align-items: center; justify-content: space-between; }
        .card-meta-left { display: flex; align-items: center; gap: 8px; }
        .table-num { font-size: 15px; font-weight: 700; color: var(--accent); font-family: 'JetBrains Mono', monospace; }
        .social-badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; letter-spacing: .5px; text-transform: uppercase; }
        .social-fb { background: rgba(24,119,242,0.2); color: #60a5fa; border: 1px solid rgba(24,119,242,0.3); }
        .social-ig { background: rgba(228,64,95,0.2); color: #f87171; border: 1px solid rgba(228,64,95,0.3); }
        .social-line { background: rgba(6,199,85,0.15); color: #4ade80; border: 1px solid rgba(6,199,85,0.3); }
        .social-default { background: var(--surface); color: var(--muted); border: 1px solid var(--border); }
        .time-stamp { font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }

        .msg-input {
          width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border);
          border-radius: 10px; padding: 10px 12px;
          font-size: 13px; color: var(--text);
          font-family: 'Space Grotesk', sans-serif;
          resize: none; height: 72px; outline: none; transition: border-color .2s; line-height: 1.5;
        }
        .msg-input:focus { border-color: rgba(59,130,246,0.5); background: rgba(59,130,246,0.04); }

        .actions { display: flex; gap: 8px; }
        .btn {
          flex: 1; height: 38px; border: none; border-radius: 10px; cursor: pointer;
          font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all .15s ease;
        }
        .btn:hover { transform: translateY(-1px); }
        .btn:active { transform: scale(.97); }
        .btn-icon { flex: none; width: 38px; height: 38px; }

        .btn-approve { background: linear-gradient(135deg, #059669, #047857); color: white; box-shadow: 0 4px 12px rgba(16,213,138,0.25); }
        .btn-approve:hover { box-shadow: 0 6px 18px rgba(16,213,138,0.4); }
        .btn-reject { background: rgba(244,63,94,0.12); color: var(--red); border: 1px solid rgba(244,63,94,0.25); }
        .btn-reject:hover { background: rgba(244,63,94,0.22); }
        .btn-push { background: linear-gradient(135deg, #d97706, #b45309); color: white; box-shadow: 0 4px 12px rgba(245,158,11,0.2); }
        .btn-push:hover { box-shadow: 0 6px 18px rgba(245,158,11,0.4); }
        .btn-restore { background: rgba(59,130,246,0.1); color: var(--accent); border: 1px solid rgba(59,130,246,0.25); }
        .btn-restore:hover { background: rgba(59,130,246,0.2); }
        .btn-trash { background: rgba(255,255,255,0.05); color: var(--muted); border: 1px solid var(--border); }
        .btn-trash:hover { color: var(--red); border-color: rgba(244,63,94,0.3); background: rgba(244,63,94,0.08); }
        .btn-delete-hard { background: rgba(244,63,94,0.08); color: var(--red); border: 1px solid rgba(244,63,94,0.2); }
        .btn-delete-hard:hover { background: rgba(244,63,94,0.18); }

        /* Empty */
        .empty { grid-column: 1/-1; text-align: center; padding: 80px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .empty-icon { font-size: 48px; opacity: .3; }
        .empty-title { font-size: 16px; font-weight: 600; color: var(--muted); }

        /* Modal */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(0,0,0,0.92); backdrop-filter: blur(20px);
          display: flex; align-items: center; justify-content: center;
          padding: 40px; cursor: zoom-out;
          animation: fadeIn .15s ease;
        }
        .modal-close {
          position: fixed; top: 20px; right: 20px;
          width: 44px; height: 44px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50%; color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s;
        }
        .modal-close:hover { background: rgba(255,255,255,0.2); }
        .modal-img { max-width: 88%; max-height: 88vh; border-radius: 16px; object-fit: contain; border: 1px solid var(--border2); animation: zoomIn .2s ease; cursor: default; }
        @keyframes zoomIn { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        /* Confirm */
        .confirm-overlay {
          position: fixed; inset: 0; z-index: 15000;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn .15s ease;
        }
        .confirm-box {
          background: var(--bg3); border: 1px solid var(--border2); border-radius: 20px;
          padding: 32px; max-width: 380px; width: 90%; text-align: center;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        }
        .confirm-icon { font-size: 36px; margin-bottom: 16px; }
        .confirm-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
        .confirm-sub { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 24px; }
        .confirm-actions { display: flex; gap: 10px; }
        .btn-cancel { flex:1; height:42px; background:var(--surface); border:1px solid var(--border); border-radius:10px; color:var(--muted); cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:600; transition:all .2s; }
        .btn-cancel:hover { background:var(--surface2); color:var(--text); }
        .btn-confirm-del { flex:1; height:42px; background:linear-gradient(135deg,#be123c,#9f1239); border:none; border-radius:10px; color:white; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:600; box-shadow:0 4px 12px rgba(244,63,94,.3); transition: all .2s; }
        .btn-confirm-del:hover { box-shadow: 0 6px 20px rgba(244,63,94,.5); }

        /* Toast */
        .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 20000; display: flex; flex-direction: column; gap: 8px; }
        .toast {
          background: var(--bg3); border: 1px solid var(--border2); border-radius: 12px;
          padding: 12px 18px; font-size: 13px; font-weight: 500; color: var(--text);
          display: flex; align-items: center; gap: 10px; min-width: 220px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          animation: slideUp .25s ease;
          font-family: 'Space Grotesk', sans-serif;
        }
        .toast-success { border-color: rgba(16,213,138,0.4); }
        .toast-error { border-color: rgba(244,63,94,0.4); }
        .toast-info { border-color: rgba(59,130,246,0.4); }
        @keyframes slideUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>

      <div className="admin-app">
        <div className="admin-inner">

          {/* Header */}
          <header className="admin-header">
            <div>
              <div className="logo">
                <span className="brand">THER PHUKET </span>
                <span className="ctrl">CONTROL</span>
              </div>
              <div className="logo-sub">
                <span className="live-dot" />
                LIVE SCREEN SYSTEM · v2.4.0
              </div>
            </div>
            <div className="header-right">
              <div className="search-wrap">
                <Search size={14} className="search-icon" />
                <input
                  className="search-input"
                  type="text"
                  placeholder="ค้นหาโต๊ะ, ข้อความ..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button className="icon-btn" title="รีเฟรช" onClick={fetchData}>
                <RefreshCw size={16} />
              </button>
            </div>
          </header>

          {/* Stats */}
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-icon blue">📥</div>
              <div><div className="stat-val blue">{data.length}</div><div className="stat-label">ทั้งหมด</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amber">⏳</div>
              <div><div className="stat-val amber">{counts.pending}</div><div className="stat-label">รอตรวจ</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">✅</div>
              <div><div className="stat-val green">{counts.approved}</div><div className="stat-label">บนหน้าจอ</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">🗑️</div>
              <div><div className="stat-val red">{counts.rejected}</div><div className="stat-label">ถังขยะ</div></div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-row">
            <div className="tabs">
              {['pending', 'approved', 'rejected'].map(t => (
                <button
                  key={t}
                  className={`tab-btn ${t} ${tab === t ? 'active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t === 'pending' && '⏳'}
                  {t === 'approved' && '✅'}
                  {t === 'rejected' && '🗑️'}
                  {t === 'pending' ? 'รอตรวจ' : t === 'approved' ? 'บนหน้าจอ' : 'ถังขยะ'}
                  <span className="tab-badge">{counts[t]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="cards-grid">
            {filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">
                  {tab === 'approved' ? '📺' : tab === 'rejected' ? '🗑️' : '📋'}
                </div>
                <div className="empty-title">ไม่มีรายการในหมวดนี้</div>
              </div>
            ) : filtered.map(item => (
              <Card
                key={item.id}
                item={item}
                onAction={handleAction}
                onPush={pushNext}
                onDeletePermanent={(id) => setConfirmId(id)}
                onPreview={setPreviewUrl}
                onSaveMessage={saveMessage}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Modals & Toast */}
      <ImageModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
      <ConfirmModal
        open={!!confirmId}
        onCancel={() => setConfirmId(null)}
        onConfirm={() => deletePermanent(confirmId)}
      />
      <ToastContainer toasts={toasts} />
    </>
  );
}
