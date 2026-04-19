'use client';

import { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

// ─── Social Icon SVG ─────────────────────────────────────────────
const SocialIcon = ({ type, size = 28 }) => {
  const t = type?.toLowerCase();
  if (t === 'facebook') return (
    <svg width={size} height={size} viewBox="0 0 105.78513 105.78513">
      <g transform="translate(-29.12827,-77.419919)">
        <g transform="matrix(0.98570778,0,0,0.98570778,1.1722601,1.8624552)">
          <circle r="47.625" cy="130.31248" cx="82.020836" fill="#0066ff"/>
          <path d="m 89.822943,107.76035 c -4.444987,-0.0186 -9.850149,0.22118 -11.336776,1.41386 -2.911076,2.33548 -2.258777,6.83421 -2.258777,6.83421 h 0.0098 v 8.17728 l -8.351943,-0.0424 2.606043,7.95146 5.7459,0.0176 v 22.96759 h 9.621637 v -22.93762 l 6.281269,0.0191 2.204516,-7.88427 -8.485785,-0.0429 v -8.13284 l 10.274823,0.0997 0.02274,-8.25583 c 0,0 -2.876251,-0.17051 -6.333464,-0.185 z" fill="#ffffff"/>
        </g>
      </g>
    </svg>
  );
  if (t === 'instagram') return (
    <svg width={size} height={size} viewBox="0 0 105.8851 105.88512">
      <defs>
        <linearGradient id="igG" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0" stopColor="#f09433"/>
          <stop offset="0.25" stopColor="#e6683c"/>
          <stop offset="0.5" stopColor="#dc2743"/>
          <stop offset="0.75" stopColor="#cc2366"/>
          <stop offset="1" stopColor="#bc1888"/>
        </linearGradient>
      </defs>
      <g transform="translate(-52.572577,-100.74468)">
        <g transform="matrix(0.93003423,0,0,0.93003423,7.3824477,10.752847)">
          <ellipse ry="47.625" rx="46.125" cy="154.125" cx="105.84524" fill="url(#igG)"/>
          <rect ry="9.4182072" y="132.91701" x="83.404526" height="44.695126" width="44.695126" stroke="#ffffff" strokeWidth="2.41370797" fill="none"/>
          <circle r="2.7381825" cy="139.84071" cx="118.28339" fill="#ffffff"/>
          <circle r="11.584605" cy="155.26457" cx="105.75208" stroke="#ffffff" strokeWidth="3.32993841" fill="none"/>
        </g>
      </g>
    </svg>
  );
  if (t === 'line') return (
    <svg width={size} height={size} viewBox="0 0 99 99">
      <rect fill="#3ACD01" height="99.4661" rx="10" ry="10" width="99.4661"/>
      <path fill="white" d="M50 17c19,0 35,12 35,28 0,5 -2,11 -5,15 0,0 -1,0 -1,1l0 0c-1,1 -2,2 -4,3 -10,9 -26,20 -28,19 -2,-2 3,-9 -2,-10 -1,0 -1,0 -1,0l0 0 0 0c-17,-3 -30,-14 -30,-28 0,-16 16,-28 36,-28zm-21 37l0 0 0 0 7 0c1,0 2,-1 2,-2l0 0c0,-1 -1,-2 -2,-2l-5 0 0 -12c0,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 14c0,1 1,2 2,2zm44 -9l0 0 0 0c0,-1 0,-2 -1,-2l-6 0 0 -2 6 0c1,0 1,-1 1,-2l0 0c0,-1 0,-2 -1,-2l-7 0 0 0 -1 0c-1,0 -1,1 -1,2l0 13c0,1 0,2 1,2l1 0 0 0 7 0c1,0 1,-1 1,-2l0 0c0,-1 0,-2 -1,-2l-6 0 0 -3 6 0c1,0 1,-1 1,-2zm-13 8l0 0 0 0c0,0 0,0 0,-1l0 -14c0,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 9 -6 -9c-1,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 14c0,1 1,2 2,2l0 0c1,0 2,-1 2,-2l0 -8 7 9c0,0 0,0 0,0l0 0c0,1 0,1 1,1 0,0 0,0 0,0l0 0c1,0 1,0 1,0 0,0 1,0 1,-1zm-18 1l0 0 0 0c1,0 2,-1 2,-2l0 -14c0,-1 -1,-1 -2,-1l0 0c-1,0 -2,0 -2,1l0 14c0,1 1,2 2,2z"/>
    </svg>
  );
  return null;
};

const SOCIALS = ['facebook', 'instagram', 'line'];

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [socialType, setSocialType] = useState('facebook');
  const [username, setUsername] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStatus('idle');
  };

  const handleFileChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedFile) { setStatus('error'); setStatusMsg('กรุณาเลือกรูปภาพก่อนครับ'); return; }
    if (!username.trim()) { setStatus('error'); setStatusMsg('กรุณากรอกชื่อโซเชียลครับ'); return; }
    if (!tableNumber.trim()) { setStatus('error'); setStatusMsg('กรุณากรอกเลขโต๊ะครับ'); return; }

    setIsSubmitting(true);
    setStatus('loading');
    setStatusMsg('กำลังบีบอัดรูปภาพ...');

    try {
      const compressed = await imageCompression(selectedFile, { maxSizeMB: 4, maxWidthOrHeight: 1920, useWebWorker: true });
      setStatusMsg('กำลังส่งข้อมูล...');

      const formData = new FormData();
      formData.append('file', compressed, selectedFile.name);
      formData.append('socialType', socialType);
      formData.append('name', username);
      formData.append('tableNumber', tableNumber);
      formData.append('message', caption);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('การอัปโหลดล้มเหลว');

      setStatus('success');
      setStatusMsg('ส่งสำเร็จแล้ว! รอการอนุมัติสักครู่');
      setUsername(''); setTableNumber(''); setCaption('');
      setSelectedFile(null); setPreviewUrl(null);
    } catch (err) {
      setStatus('error');
      setStatusMsg(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null); setPreviewUrl(null);
    setStatus('idle'); setStatusMsg('');
  };

  if (!isClient) return <div style={{ minHeight: '100vh', background: '#060b14' }} />;

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #060b14 0%, #0d1626 50%, #060b14 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        :root {
          --bg: #060b14; --bg2: #0d1626; --bg3: #111d2e;
          --surface: rgba(255,255,255,0.04); --surface2: rgba(255,255,255,0.07);
          --border: rgba(255,255,255,0.08); --border2: rgba(255,255,255,0.15);
          --text: #e8f0f8; --muted: #5a6a7d;
          --accent: #3b82f6; --green: #10d58a; --red: #f43f5e; --amber: #f59e0b;
        }

        .upload-card {
          background: rgba(13,22,38,0.95);
          border: 1px solid var(--border);
          border-radius: 28px;
          width: 100%; max-width: 520px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
        }

        .card-header { padding: 32px 32px 24px; border-bottom: 1px solid var(--border); background: linear-gradient(180deg, rgba(59,130,246,0.08) 0%, transparent 100%); }
        .brand { font-size: 28px; font-weight: 800; color: white; letter-spacing: -1px; line-height: 1; }
        .brand span { background: linear-gradient(135deg, #3b82f6, #22d3ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .brand-sub { font-size: 13px; color: var(--muted); margin-top: 6px; letter-spacing: .3px; }
        .card-body { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 22px; }
        .social-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .social-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 16px 8px; border-radius: 16px; border: 1.5px solid var(--border); background: var(--surface); cursor: pointer; transition: all .2s ease; color: var(--muted); font-size: 11px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; }
        .social-btn:hover { border-color: var(--border2); background: var(--surface2); color: var(--text); }
        
        /* แก้ไข Facebook ให้ชื่อคลาสตรงกับ Array และสีสว่างขึ้น */
        .social-btn.active-facebook { border-color: #1877f2; background: rgba(24, 119, 242, 0.15); color: #60a5fa; box-shadow: 0 0 20px rgba(24, 119, 242, 0.4); }
        .social-btn.active-instagram { border-color: #e1306c; background: rgba(225, 48, 108, 0.15); color: #f87171; box-shadow: 0 0 20px rgba(225, 48, 108, 0.4); }
        .social-btn.active-line { border-color: #3acd01; background: rgba(58, 205, 1, 0.15); color: #4ade80; box-shadow: 0 0 20px rgba(58, 205, 1, 0.4); }

        .field-label { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; display: block; }
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .input-field { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; font-size: 14px; color: var(--text); font-family: 'Space Grotesk', sans-serif; outline: none; transition: all .2s; }
        .input-field::placeholder { color: var(--muted); }
        .input-field:focus { border-color: rgba(59,130,246,0.5); background: rgba(59,130,246,0.05); }
        textarea.input-field { resize: none; height: 80px; line-height: 1.6; }
        .drop-zone { border: 2px dashed var(--border); border-radius: 16px; transition: all .2s; overflow: hidden; cursor: pointer; }
        .drop-zone:hover, .drop-zone.drag-over { border-color: rgba(59,130,246,0.5); background: rgba(59,130,246,0.04); }
        .drop-empty { padding: 32px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .drop-icon { font-size: 32px; opacity: .4; }
        .drop-title { font-size: 14px; font-weight: 600; color: var(--muted); }
        .drop-sub { font-size: 12px; color: var(--muted); opacity: .6; }
        .preview-wrap { position: relative; aspect-ratio: 4/3; }
        .preview-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .preview-remove { position: absolute; top: 10px; right: 10px; width: 32px; height: 32px; border-radius: 50%; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: all .2s; }
        .preview-remove:hover { background: rgba(244,63,94,0.8); }
        .preview-label { position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.1); color: var(--green); font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; letter-spacing: .5px; display: flex; align-items: center; gap: 5px; }
        .preview-label::before { content:''; width:6px; height:6px; border-radius:50%; background: var(--green); }
        .status-banner { padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 10px; }
        .status-loading { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: var(--amber); }
        .status-success { background: rgba(16,213,138,0.1); border: 1px solid rgba(16,213,138,0.25); color: var(--green); }
        .status-error { background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.25); color: var(--red); }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .dot-loading { background: var(--amber); animation: blink .8s ease-in-out infinite; }
        .dot-success { background: var(--green); }
        .dot-error { background: var(--red); }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .submit-btn { width: 100%; height: 52px; border: none; border-radius: 14px; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: .5px; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .submit-btn:not(:disabled) { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; box-shadow: 0 8px 24px rgba(37,99,235,0.35); }
        .submit-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(37,99,235,0.5); }
        .submit-btn:disabled { background: rgba(255,255,255,0.06); color: var(--muted); cursor: not-allowed; }
        .reset-btn { width: 100%; height: 40px; border: none; background: transparent; font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; transition: color .2s; border-radius: 10px; }
        .reset-btn:hover { color: var(--text); }
        .spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .tips { background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.12); border-radius: 14px; padding: 16px 18px; }
        .tips-title { font-size: 12px; font-weight: 700; color: rgba(59,130,246,0.8); letter-spacing: .8px; text-transform: uppercase; margin-bottom: 10px; }
        .tips-list { display: flex; flex-direction: column; gap: 7px; }
        .tips-item { font-size: 12px; color: var(--muted); display: flex; gap: 8px; line-height: 1.5; }
        .tips-dot { color: rgba(59,130,246,0.6); flex-shrink: 0; margin-top: 1px; }
        main::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px); }
      `}</style>

      <div className="upload-card" style={{ position: 'relative', zIndex: 1 }}>
        <div className="card-header">
          <div className="brand">THER <span>Phuket</span></div>
          <div className="brand-sub">แชร์ความสนุกของคุณขึ้นบนจอหลักของร้าน</div>
        </div>

        <div className="card-body">
          <div>
            <span className="field-label">ช่องทางโซเชียล</span>
            <div className="social-grid">
              {SOCIALS.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`social-btn ${socialType === s ? `active-${s}` : ''}`}
                  onClick={() => setSocialType(s)}
                >
                  <SocialIcon type={s} size={28} />
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="input-row">
            <div>
              <span className="field-label">ชื่อโซเชียล</span>
              <input className="input-field" type="text" placeholder="@username" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
              <span className="field-label">เลขโต๊ะ</span>
              <input className="input-field" type="text" placeholder="เช่น 14, B5" value={tableNumber} onChange={e => setTableNumber(e.target.value)} />
            </div>
          </div>

          <div>
            <span className="field-label">แคปชั่น</span>
            <textarea className="input-field" placeholder="บอกอะไรกับทุกคนหน่อย..." value={caption} onChange={e => setCaption(e.target.value)} />
          </div>

          <div>
            <span className="field-label">รูปภาพ</span>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
            {!previewUrl ? (
              <div className={`drop-zone ${dragOver ? 'drag-over' : ''}`} onClick={() => fileInputRef.current.click()} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
                <div className="drop-empty">
                  <div className="drop-icon">🖼️</div>
                  <div className="drop-title">คลิกหรือลากรูปมาวางที่นี่</div>
                  <div className="drop-sub">JPG, PNG, GIF · บีบอัดอัตโนมัติ</div>
                </div>
              </div>
            ) : (
              <div className="drop-zone" style={{ cursor: 'default' }}>
                <div className="preview-wrap">
                  <img src={previewUrl} alt="preview" />
                  <button type="button" className="preview-remove" onClick={resetForm}>✕</button>
                  <div className="preview-label">พร้อมส่ง</div>
                </div>
              </div>
            )}
          </div>

          {status !== 'idle' && (
            <div className={`status-banner status-${status}`}>
              <span className={`status-dot dot-${status}`} />
              {statusMsg}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button type="button" className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <><span className="spinner" /> กำลังส่ง...</> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> ส่งขึ้นจอเลย!</>}
            </button>
            <button type="button" className="reset-btn" onClick={resetForm} disabled={isSubmitting}>ล้างข้อมูล</button>
          </div>

          <div className="tips">
            <div className="tips-title">💡 Tips</div>
            <div className="tips-list">
              <div className="tips-item"><span className="tips-dot">›</span> รูปจะถูกปรับขนาดอัตโนมัติให้พอดีจอ</div>
              <div className="tips-item"><span className="tips-dot">›</span> ทีมงานตรวจสอบก่อนขึ้นจอทุกรูป</div>
              <div className="tips-item"><span className="tips-dot">›</span> รอรูปขึ้นจอภายใน 1–2 นาที</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}