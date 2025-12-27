'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
// อย่าลืมรัน npm install lucide-react เพื่อใช้ไอคอนนะครับ
import { Trash2, Check, X, Maximize2 } from 'lucide-react';

export default function AdminPage() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // -- New States for Features --
  const [selectedIds, setSelectedIds] = useState([]); // สำหรับการเลือกหลายรูป
  const [previewUrl, setPreviewUrl] = useState(null); // สำหรับกดดูรูปใหญ่

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

  // ฟังก์ชันสลับการเลือก (Select/Deselect)
  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  // ฟังก์ชันลบที่เลือกทั้งหมด (Batch Delete)
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`ยืนยันลบ ${selectedIds.length} รายการที่เลือก?`)) return;

    try {
      await Promise.all(
        selectedIds.map(id => fetch(`/api/reject/${id}`, { method: 'POST' }))
      );
      setSelectedIds([]); // ล้างค่าหลังลบเสร็จ
      fetchSubmissions();
    } catch (error) {
      console.error('Batch delete error:', error);
    }
  };

  const handleAction = async (id, action) => {
    const endpoint = action === 'approve' ? `/api/approve/${id}` : `/api/reject/${id}`;
    
    // Optimistic UI
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
      fetchSubmissions(); // Rollback if error
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        กำลังโหลดระบบหลังบ้าน...
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <style>{`
        .admin-wrapper { background: #0f172a; min-height: 100vh; color: #e5e7eb; padding: 2rem; font-family: 'Inter', sans-serif; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; border-bottom: 1px solid #1e293b; padding-bottom: 1rem; }
        
        .section-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; }
        .badge { background: #1e293b; padding: 2px 12px; border-radius: 20px; font-size: 0.9rem; color: #3b82f6; }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        
        .card { 
          background: #1e293b; border-radius: 16px; overflow: hidden; position: relative;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 2px solid transparent;
        }
        .card.selected { border-color: #3b82f6; transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.4); }

        .img-box { position: relative; height: 240px; cursor: zoom-in; overflow: hidden; }
        .img-box img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .card:hover .img-box img { transform: scale(1.05); }

        /* เลือกรูป */
        .select-check {
          position: absolute; top: 12px; right: 12px; width: 28px; height: 28px;
          border-radius: 50%; background: rgba(0,0,0,0.4); border: 2px solid #fff;
          display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;
        }
        .selected .select-check { background: #3b82f6; border-color: #3b82f6; }

        /* Preview Icon */
        .preview-icon {
          position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.4);
          padding: 6px; border-radius: 8px; opacity: 0; transition: 0.2s;
        }
        .card:hover .preview-icon { opacity: 1; }

        .info { padding: 1.25rem; }
        .message-box { 
          background: rgba(255,255,255,0.03); padding: 12px; border-radius: 10px; 
          margin-bottom: 12px; border-left: 3px solid #3b82f6;
        }
        .message-text { color: #fff; font-size: 1.05rem; font-weight: 500; line-height: 1.4; margin: 0; }
        .client-info { font-size: 0.85rem; color: #94a3b8; }

        .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 1.25rem 1.25rem; }
        .btn { border: none; padding: 10px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .btn-approve { background: #10b981; color: white; }
        .btn-reject { background: #334155; color: #f1f5f9; }
        .btn-delete { background: #ef4444; color: white; width: 100%; grid-column: span 2; }
        .btn:hover { opacity: 0.9; transform: scale(1.02); }

        /* Floating Batch Bar */
        .batch-bar {
          position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
          background: #3b82f6; padding: 12px 24px; border-radius: 50px;
          display: flex; align-items: center; gap: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          z-index: 100; font-weight: 600;
        }
        .btn-batch-del { background: #fff; color: #ef4444; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-weight: bold; }

        /* Modal Lightbox */
        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; align-items: center; justify-content: center; cursor: zoom-out; }
        .modal img { max-width: 90%; max-height: 90vh; border-radius: 12px; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
      `}</style>

      <div className="container">
        <div className="header">
          <h1 style={{ fontSize: '2rem', margin: 0 }}>THER Phuket <span style={{ color: '#3b82f6' }}>Admin</span></h1>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, color: '#94a3b8' }}>Real-time Dashboard</p>
          </div>
        </div>

        {/* --- Pending Section --- */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 className="section-title">รายการรออนุมัติ <span className="badge">{pending.length}</span></h2>
          {pending.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>ไม่มีรายการรอดำเนินการในขณะนี้</p>
          ) : (
            <div className="grid">
              {pending.map((item) => (
                <div key={item.id} className={`card ${selectedIds.includes(item.id) ? 'selected' : ''}`}>
                  <div className="select-check" onClick={() => toggleSelect(item.id)}>
                    {selectedIds.includes(item.id) && <Check size={18} />}
                  </div>
                  
                  <div className="img-box" onClick={() => setPreviewUrl(item.imageUrl)}>
                    <img src={item.imageUrl} alt="submission" />
                    <div className="preview-icon"><Maximize2 size={18} /></div>
                  </div>

                  <div className="info">
                    <div className="message-box">
                      <p className="message-text">"{item.message || 'ไม่มีข้อความ'}"</p>
                    </div>
                    <div className="client-info">
                      <p style={{ margin: '0 0 4px 0' }}><strong>โต๊ะ {item.tableNumber}</strong> — {item.name}</p>
                      <p style={{ margin: 0, opacity: 0.6 }}>ผ่านช่องทาง {item.socialType}</p>
                    </div>
                  </div>

                  <div className="actions">
                    <button className="btn btn-reject" onClick={() => handleAction(item.id, 'reject')}><X size={18} /> ไม่อนุมัติ</button>
                    <button className="btn btn-approve" onClick={() => handleAction(item.id, 'approve')}><Check size={18} /> อนุมัติ</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- Approved Section --- */}
        <div>
          <h2 className="section-title" style={{ color: '#94a3b8' }}>อนุมัติแล้ว <span className="badge">{approved.length}</span></h2>
          <div className="grid">
            {approved.map((item) => (
              <div key={item.id} className={`card ${selectedIds.includes(item.id) ? 'selected' : ''}`}>
                <div className="select-check" onClick={() => toggleSelect(item.id)}>
                  {selectedIds.includes(item.id) && <Check size={18} />}
                </div>
                
                <div className="img-box" onClick={() => setPreviewUrl(item.imageUrl)} style={{ opacity: 0.7 }}>
                  <img src={item.imageUrl} alt="submission" />
                </div>

                <div className="info">
                  <div className="message-box" style={{ borderLeftColor: '#10b981' }}>
                    <p className="message-text" style={{ fontSize: '0.9rem' }}>"{item.message || '-'}"</p>
                  </div>
                  <p className="client-info">โต๊ะ {item.tableNumber} — {item.name}</p>
                </div>

                <div className="actions">
                  <button className="btn btn-delete" onClick={() => handleAction(item.id, 'reject')}>ลบออกจากหน้าจอ</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Floating Batch Bar --- */}
      {selectedIds.length > 0 && (
        <div className="batch-bar">
          <span>เลือกอยู่ {selectedIds.length} รายการ</span>
          <button className="btn-batch-del" onClick={handleBatchDelete}>ลบทั้งหมดที่เลือก</button>
          <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setSelectedIds([])}>ยกเลิก</button>
        </div>
      )}

      {/* --- Image Preview Modal --- */}
      {previewUrl && (
        <div className="modal" onClick={() => setPreviewUrl(null)}>
          <img src={previewUrl} alt="Preview Large" />
          <div style={{ position: 'absolute', bottom: '30px', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '20px' }}>
            คลิกที่ว่างเพื่อปิด
          </div>
        </div>
      )}
    </div>
  );
}