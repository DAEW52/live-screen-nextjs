'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    setLoading(true);
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
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        (payload) => {
          console.log('Change received!', payload);
          fetchSubmissions();
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ [Admin Page] Connected to Realtime!');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ [Admin Page] Realtime Connection Error:', err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAction = async (id, action) => {
    const endpoint = action === 'approve' ? `/api/approve/${id}` : `/api/reject/${id}`;
    
    // Optimistic UI updates
    if (action === 'approve') {
      const itemToMove = pending.find(item => item.id === id);
      if(itemToMove) {
        setPending(prev => prev.filter(item => item.id !== id));
        setApproved(prev => [itemToMove, ...prev]);
      }
    } else { // 'reject' or 'delete'
      setPending(prev => prev.filter(item => item.id !== id));
      setApproved(prev => prev.filter(item => item.id !== id));
    }

    try {
      const response = await fetch(endpoint, { method: 'POST' });
      if (!response.ok) {
        console.error(`Failed to ${action} submission`);
        fetchSubmissions(); 
      }
    } catch (error) {
      console.error('Error performing action:', error);
      fetchSubmissions();
    }
  };


  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', paddingTop: '50px' }}>Loading Admin Panel...</div>;
  }

  return (
    <>
      {/* --- ✨ เพิ่มโค้ด CSS สำหรับจัดสไตล์ ✨ --- */}
      <style>{`
        .admin-container {
          padding: 2rem;
          color: #e5e7eb;
          max-width: 1200px;
          margin: 0 auto;
        }
        .admin-container h1 {
          font-size: 2.5rem;
          font-weight: bold;
          border-bottom: 2px solid #4b5563;
          padding-bottom: 1rem;
          margin-bottom: 2rem;
        }
        .section {
          margin-bottom: 3rem;
        }
        .section h2 {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .card {
          background-color: #1f2937;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
        }
        .card img {
          width: 100%;
          height: 250px;
          object-fit: cover;
        }
        .card .info {
          padding: 1rem;
          flex-grow: 1;
        }
        .card .info p {
          margin: 0 0 0.5rem 0;
          color: #d1d5db;
        }
        .card .info p:first-child { /* Message */
          font-style: italic;
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 1rem;
        }
        .card .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          padding: 0 1rem 1rem 1rem;
        }
        .card.approved-card .actions {
           grid-template-columns: 1fr;
        }
        .card button {
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .card button:hover {
            transform: scale(1.05);
        }
        .btn-approve {
          background-color: #22c55e;
          color: white;
        }
        .btn-reject {
          background-color: #ef4444;
          color: white;
        }
        .btn-delete {
          background-color: #4b5563;
          color: #e5e7eb;
        }
        .no-items {
            background-color: #1f2937;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            font-style: italic;
            color: #9ca3af;
        }
      `}</style>

      <div className="admin-container">
        <h1>Admin Panel</h1>
        
        <div className="section">
          <h2>รายการรออนุมัติ ({pending.length})</h2>
          {pending.length === 0 ? (
            <div className="no-items">ไม่มีรายการรออนุมัติ</div>
          ) : (
            <div className="grid">
              {pending.map((item) => (
                <div key={item.id} className="card">
                  <img src={item.imageUrl} alt="submission" />
                  <div className="info">
                    <p><strong>"{item.message || 'ไม่มีข้อความ'}"</strong></p>
                    <p>{item.name} ({item.socialType})</p>
                    <p>โต๊ะ: {item.tableNumber}</p>
                  </div>
                  <div className="actions">
                    <button className="btn-reject" onClick={() => handleAction(item.id, 'reject')}>ไม่อนุมัติ</button>
                    <button className="btn-approve" onClick={() => handleAction(item.id, 'approve')}>อนุมัติ</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h2>รูปที่อนุมัติแล้ว ({approved.length})</h2>
          {approved.length === 0 ? (
            <div className="no-items">ยังไม่มีรูปที่อนุมัติ</div>
          ) : (
            <div className="grid">
              {approved.map((item) => (
                <div key={item.id} className="card approved-card">
                  <img src={item.imageUrl} alt="submission" />
                  <div className="info">
                    <p><strong>"{item.message || 'ไม่มีข้อความ'}"</strong></p>
                    <p>{item.name} ({item.socialType})</p>
                    <p>โต๊ะ: {item.tableNumber}</p>
                  </div>
                   <div className="actions">
                    <button className="btn-delete" onClick={() => handleAction(item.id, 'reject')}>ลบ</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

