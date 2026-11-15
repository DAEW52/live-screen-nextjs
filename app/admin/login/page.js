'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true); setError('');
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'เข้าสู่ระบบไม่สำเร็จ');
      window.location.href = '/admin';
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="login-wrap">
      <style dangerouslySetInnerHTML={{ __html: `
        .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px;
                      background: radial-gradient(ellipse 600px 400px at 20% 20%, rgba(59,130,246,0.12), transparent 70%),
                                  radial-gradient(ellipse 500px 300px at 80% 80%, rgba(219,39,119,0.10), transparent 70%), #060b14;
                      font-family: var(--font-space), var(--font-kanit), sans-serif; }
        .login-card { width: 100%; max-width: 380px; background: #0d1626; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 32px 28px;
                      box-shadow: 0 30px 80px rgba(0,0,0,.55); }
        .login-logo { font-size: 24px; font-weight: 800; color: #e8f0f8; letter-spacing: -.5px; }
        .login-logo span { background: linear-gradient(135deg, #3b82f6, #22d3ee); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .login-sub { font-size: 13px; color: #6b7d90; margin: 6px 0 24px; }
        .login-label { display: block; font-size: 11px; font-weight: 700; color: #6b7d90; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
        .login-field { position: relative; }
        .login-input { width: 100%; background: rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 48px 13px 14px;
                       font-size: 15px; color: #e8f0f8; outline: none; font-family: inherit; }
        .login-input:focus { border-color: rgba(59,130,246,.6); box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
        .login-eye { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #6b7d90; cursor: pointer; font-size: 16px; padding: 6px; }
        .login-btn { width: 100%; margin-top: 16px; height: 48px; border: none; border-radius: 12px; cursor: pointer; font-family: inherit; font-size: 15px; font-weight: 700; color: #fff;
                     background: linear-gradient(135deg, #2563eb, #1d4ed8); box-shadow: 0 8px 24px rgba(37,99,235,.35); }
        .login-btn:disabled { opacity: .6; cursor: default; }
        .login-err { margin-top: 12px; font-size: 13px; color: #f43f5e; background: rgba(244,63,94,.1); border: 1px solid rgba(244,63,94,.25); border-radius: 10px; padding: 10px 12px; }
      ` }} />
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">THER PHUKET <span>CONTROL</span></div>
        <div className="login-sub">🔒 เฉพาะทีมงาน กรุณาใส่รหัสผ่าน</div>
        <label className="login-label" htmlFor="pw">รหัสผ่าน</label>
        <div className="login-field">
          <input id="pw" className="login-input" type={show ? 'text' : 'password'} autoFocus autoComplete="current-password"
                 value={password} onChange={e => setPassword(e.target.value)} />
          <button type="button" className="login-eye" onClick={() => setShow(s => !s)} aria-label="แสดงรหัสผ่าน">{show ? '🙈' : '👁️'}</button>
        </div>
        <button className="login-btn" type="submit" disabled={loading || !password}>{loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}</button>
        {error && <div className="login-err">{error}</div>}
      </form>
    </main>
  );
}
