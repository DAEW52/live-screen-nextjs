'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Check, X, Maximize2 } from 'lucide-react';

export default function AdminPage() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions:', error);
    } else {
      setPending(data.filter((item) => item.status === 'pending'));
      setApproved(data.filter((item) => item.status === 'approved'));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
    const channel = supabase
      .channel('realtime admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => fetchSubmissions())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`ยืนยันลบ ${selectedIds.length} รายการที่เลือก?`)) return;

    try {
      await Promise.all(
        selectedIds.map(id => fetch(`/api/reject/${id}`, { method: 'POST' }))
      );
      setSelectedIds([]);
      fetchSubmissions();
    } catch (error) {
      console.error('Batch delete error:', error);
    }
  };

  const handleAction = async (id, action) => {
    const endpoint = action === 'approve' ? `/api/approve/${id}` : `/api/reject/${id}`;
    if (action === 'approve') {
      const itemToMove = pending.find(i => i.id === id);
      setPending(prev => prev.filter(i => i.id !== id));
      if(itemToMove) setApproved(prev => [{...itemToMove, status: 'approved'}, ...prev]);
    } else {
      setPending(prev => prev.filter(i => i.id !== id));
      setApproved(prev => prev.filter(i => i.id !== id));
    }
    try {
      await fetch(endpoint, { method: 'POST' });
    } catch (error) {
      fetchSubmissions();
    }
  };

  const getSocialColor = (type) => {
    const t = type?.toLowerCase();
    if (t === 'facebook') return '#1877F2';
    if (t === 'line') return '#06C755';
    if (t === 'instagram') return '#E4405F';
    return '#4b5563';
  };

  if (loading) return <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading Professional Panel...</div>;

  return (
    <div className="admin-wrapper">
      <style>{`
        .admin-wrapper { background: #0f172a; min-height: 100vh; color: #e5e7eb; padding: 2rem; font-family: sans-serif; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; border-bottom: 1px solid #1e293b; padding-bottom: 1rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .card { background: #1e293b; border-radius: 16px; overflow: hidden; position: relative; transition: 0.3s; border: 2px solid transparent; }
        .card.selected { border-color: #3b82f6; transform: translateY(-4px); }
        .img-box { position: relative; height: 240px; cursor: zoom-in; }
        .img-box img { width: 100%; height: 100%; object-fit: cover; }
        .select-check { position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; border-radius: 50%; background: rgba(0,0,0,0.4); border: 2px solid #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; }
        .selected .select-check { background: #3b82f6; border-color: #3b82f6; }
        .info { padding: 1.25rem; }
        .message-box { background: rgba(59, 130, 246, 0.1); padding: 12px; border-radius: 10px; margin-bottom: 12px; border-left: 4px solid #3b82f6; }
        .social-badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; font-weight: bold; color: white; display: inline-block; margin-left: 8px; vertical-align: middle; }
        .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 1.25rem 1.25rem; }
        .btn { border: none; padding: 10px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .btn-approve { background: #10b981; color: white; }
        .btn-reject { background: #334155; color: #f1f5f9; }
        .btn-delete { background: #ef4444; color: white; width: 100%; grid-column: span 2; }
        .batch-bar { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #3b82f6; padding: 12px 24px; border-radius: 50px; display: flex; align-items: center; gap: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 100; }
        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal img { max-width: 90%; max-height: 90vh; border-radius: 12px; }
      `}</style>

      <div className="container">
        <div className="header">
          <h1 style={{ fontSize: '2rem' }}>THER Phuket Admin</h1>
        </div>

        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>รายการรออนุมัติ ({pending.length})</h2>
          <div className="grid">
            {pending.map((item) => (
              <div key={item.id} className={`card ${selectedIds.includes(item.id) ? 'selected' : ''}`}>
                <div className="select-check" onClick={() => toggleSelect(item.id)}>{selectedIds.includes(item.id) && <Check size={18} />}</div>
                <div className="img-box" onClick={() => setPreviewUrl(item.imageUrl)}><img src={item.imageUrl} alt="" /></div>
                <div className="info">
                  <div className="message-box"><p style={{ color: '#fff', margin: 0, fontWeight: '500' }}>"{item.message || 'ไม่มีข้อความ'}"</p></div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    <p style={{ margin: '0 0 5px 0' }}>
                      <strong>โต๊ะ {item.tableNumber}</strong>
                      <span className="social-badge" style={{ backgroundColor: getSocialColor(item.socialType) }}>{item.socialType}</span>
                    </p>
                    <p style={{ margin: 0 }}>ผู้ส่ง: {item.name}</p>
                  </div>
                </div>
                <div className="actions">
                  <button className="btn btn-reject" onClick={() => handleAction(item.id, 'reject')}><X size={18} /> ข้าม</button>
                  <button className="btn btn-approve" onClick={() => handleAction(item.id, 'approve')}><Check size={18} /> อนุมัติ</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>อนุมัติแล้ว ({approved.length})</h2>
          <div className="grid">
            {approved.map((item) => (
              <div key={item.id} className={`card ${selectedIds.includes(item.id) ? 'selected' : ''}`}>
                <div className="select-check" onClick={() => toggleSelect(item.id)}>{selectedIds.includes(item.id) && <Check size={18} />}</div>
                <div className="img-box" onClick={() => setPreviewUrl(item.imageUrl)} style={{ opacity: 0.7 }}><img src={item.imageUrl} alt="" /></div>
                <div className="info">
                  <div className="message-box" style={{ borderLeftColor: '#10b981' }}><p style={{ fontSize: '0.9rem', margin: 0 }}>"{item.message || '-'}"</p></div>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                    <strong>โต๊ะ {item.tableNumber}</strong> — {item.name}
                    <span className="social-badge" style={{ backgroundColor: getSocialColor(item.socialType), opacity: 0.8 }}>{item.socialType}</span>
                  </p>
                </div>
                <div className="actions"><button className="btn btn-delete" onClick={() => handleAction(item.id, 'reject')}>ลบ</button></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedIds.length > 0 && (
        <div className="batch-bar">
          <span>เลือกอยู่ {selectedIds.length} รายการ</span>
          <button style={{ background: '#fff', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }} onClick={handleBatchDelete}>ลบทั้งหมด</button>
          <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setSelectedIds([])}>ยกเลิก</button>
        </div>
      )}

      {previewUrl && (
        <div className="modal" onClick={() => setPreviewUrl(null)}>
          <img src={previewUrl} alt="Preview" />
        </div>
      )}
    </div>
  );
}