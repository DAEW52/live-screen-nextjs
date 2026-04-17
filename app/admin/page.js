'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Check, X, Zap, Edit3, MessageSquare } from 'lucide-react';

// --- ฟังก์ชันแสดงไอคอนโซเชียล ---
const SocialIcon = ({ type }) => {
  const socialType = type?.toLowerCase();
  
  const getConfig = () => {
    if (socialType === 'facebook') return { color: '#1877F2', label: 'FB' };
    if (socialType === 'instagram') return { color: '#E4405F', label: 'IG' };
    if (socialType === 'line') return { color: '#06C755', label: 'LINE' };
    return { color: '#94a3b8', label: '??' };
  };

  const config = getConfig();

  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      padding: '2px 8px', 
      borderRadius: '4px', 
      fontSize: '0.75rem', 
      fontWeight: 'bold', 
      backgroundColor: config.color, 
      color: 'white',
      marginLeft: '8px'
    }}>
      {config.label}
    </span>
  );
};

export default function AdminPage() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPending(data.filter((item) => item.status === 'pending'));
      setApproved(data.filter((item) => item.status === 'approved'));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
    const channel = supabase.channel('admin-realtime-v4')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => fetchSubmissions())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const handleUpdateMessage = async (id, newMessage) => {
    await supabase.from('submissions').update({ message: newMessage }).eq('id', id);
  };

  const handlePushToFront = async (id) => {
    const { error } = await supabase
      .from('submissions')
      .update({ created_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) alert('⚡ รัดคิวเรียบร้อย! รูปนี้จะแสดงลำดับถัดไป');
  };

  const handleAction = async (id, action) => {
    const status = action === 'approve' ? 'approved' : 'rejected';
    const { error } = await supabase.from('submissions').update({ status }).eq('id', id);
    if (error) await fetch(`/api/${action}/${id}`, { method: 'POST' });
    fetchSubmissions();
  };

  if (loading) return <div style={{ background: '#0f172a', height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Admin Control...</div>;

  return (
    <div className="admin-wrapper">
      <style>{`
        .admin-wrapper { background: #0f172a; min-height: 100vh; color: #e5e7eb; padding: 2rem; font-family: sans-serif; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid #334155; padding-bottom: 1rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        .card { background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; display: flex; flex-direction: column; }
        .img-box { height: 240px; width: 100%; cursor: pointer; }
        .img-box img { width: 100%; height: 100%; object-fit: cover; }
        .info { padding: 1.25rem; flex-grow: 1; }
        .edit-input { background: #0f172a; border: 1px solid #3b82f6; color: white; width: 100%; padding: 10px; border-radius: 10px; margin-bottom: 12px; font-size: 0.9rem; outline: none; }
        .meta { font-size: 0.9rem; color: #94a3b8; display: flex; flex-direction: column; gap: 4px; }
        .actions { padding: 0 1.25rem 1.25rem; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .btn { border: none; padding: 10px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: bold; transition: 0.2s; }
        .btn:active { transform: scale(0.95); }
        .btn-approve { background: #10b981; color: white; }
        .btn-reject { background: #ef4444; color: white; }
        .btn-zap { background: #f59e0b; color: white; grid-column: span 2; }
        .btn-remove { background: #475569; color: white; grid-column: span 2; }
        .section-title { margin: 2rem 0 1rem; font-size: 1.5rem; display: flex; align-items: center; gap: 12px; }
      `}</style>

      <div className="container">
        <div className="header">
          <h1 style={{ fontSize: '1.8rem' }}>THER Phuket Admin Control</h1>
          <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Realtime Sync Active</div>
        </div>

        {/* --- ส่วนที่ 1: รออนุมัติ --- */}
        <h2 className="section-title" style={{ color: '#f59e0b' }}>⏳ รายการรอตรวจ ({pending.length})</h2>
        <div className="grid">
          {pending.map((item) => (
            <div key={item.id} className="card">
              <div className="img-box"><img src={item.imageUrl} alt="" /></div>
              <div className="info">
                <input 
                  className="edit-input" 
                  defaultValue={item.message} 
                  onBlur={(e) => handleUpdateMessage(item.id, e.target.value)}
                  placeholder="คลิกเพื่อแก้ข้อความ..."
                />
                <div className="meta">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <strong>โต๊ะ {item.tableNumber}</strong>
                    <SocialIcon type={item.socialType} />
                  </div>
                  <div>ผู้ส่ง: {item.name}</div>
                </div>
              </div>
              <div className="actions">
                <button className="btn btn-reject" onClick={() => handleAction(item.id, 'reject')}><X size={18}/> ข้าม</button>
                <button className="btn btn-approve" onClick={() => handleAction(item.id, 'approve')}><Check size={18}/> อนุมัติ</button>
              </div>
            </div>
          ))}
        </div>

        {/* --- ส่วนที่ 2: บนหน้าจอ --- */}
        <h2 className="section-title" style={{ color: '#10b981', marginTop: '4rem' }}>📺 แสดงบนจอ ({approved.length})</h2>
        <div className="grid">
          {approved.map((item) => (
            <div key={item.id} className="card" style={{ borderTop: '4px solid #10b981' }}>
              <div className="img-box"><img src={item.imageUrl} alt="" /></div>
              <div className="info">
                <input 
                  className="edit-input" 
                  defaultValue={item.message} 
                  onBlur={(e) => handleUpdateMessage(item.id, e.target.value)}
                />
                <div className="meta">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <strong>โต๊ะ {item.tableNumber}</strong>
                    <SocialIcon type={item.socialType} />
                  </div>
                  <div>ผู้ส่ง: {item.name}</div>
                </div>
              </div>
              <div className="actions">
                <button className="btn btn-zap" onClick={() => handlePushToFront(item.id)}>
                  <Zap size={18} fill="white"/> รัดคิวให้โชว์รูปถัดไป
                </button>
                <button className="btn btn-remove" onClick={() => handleAction(item.id, 'reject')}>
                  นำออกจากจอ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}