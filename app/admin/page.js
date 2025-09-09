'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  // ฟังก์ชันดึงข้อมูลทั้งหมดจาก Supabase
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setSubmissions(data);
    }
  };

  // จัดการการอนุมัติ
  const handleApprove = async (id) => {
    await supabase
      .from('submissions')
      .update({ status: 'approved' })
      .eq('id', id);
    // ไม่ต้องทำอะไรต่อ Real-time จะอัปเดตหน้าจอเอง
  };

  // จัดการการไม่อนุมัติ/ลบ
  const handleRejectOrDelete = async (id, imageUrl) => {
    // ลบข้อมูลใน database
    await supabase.from('submissions').delete().eq('id', id);

    // ลบไฟล์ใน storage (ถ้ามี)
    if (imageUrl) {
      const fileName = imageUrl.split('/').pop();
      await supabase.storage.from('uploads').remove([fileName]);
    }
    // ไม่ต้องทำอะไรต่อ Real-time จะอัปเดตหน้าจอเอง
  };

  // useEffect สำหรับ Real-time
  useEffect(() => {
    // 1. ดึงข้อมูลครั้งแรก
    fetchData();

    // 2. สร้าง "ช่องสัญญาณ" เพื่อติดตามตาราง submissions
    const channel = supabase
      .channel('realtime submissions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        (payload) => {
          console.log('Change received!', payload);
          fetchData(); // เมื่อมีอะไรเปลี่ยนแปลง ให้ดึงข้อมูลใหม่ทั้งหมด
        }
      )
      .subscribe();

    // 3. Cleanup: ยกเลิกการติดตามเมื่อปิดหน้า
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredPending = submissions.filter(x => 
    x.status === 'pending' &&
    (!filter || x.socialType === filter) && 
    (!search || [x.message, x.name, x.tableNumber].join(' ').toLowerCase().includes(search.toLowerCase()))
  );
  const filteredApproved = submissions.filter(x => 
    x.status === 'approved' &&
    (!filter || x.socialType === filter) && 
    (!search || [x.message, x.name, x.tableNumber].join(' ').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="admin-container">
        <header className="admin-toolbar">
            <h1>THER Phuket • แอดมินอนุมัติรูป</h1>
            <div className="controls">
                <input type="search" placeholder="ค้นหา..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="">ทุกโซเชียล</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="line">LINE</option>
                </select>
            </div>
        </header>

        <main className="admin-content">
            <div className="section">
                <h2>⏳ รายการรออนุมัติ ({filteredPending.length})</h2>
                <div className="grid-layout">
                {filteredPending.length > 0 ? (
                    filteredPending.map(item => (
                        <div key={item.id} className="admin-card">
                            <div className="img-box"><img loading="lazy" src={item.imageUrl} alt="Pending submission" /></div>
                            <div className="meta">
                                <p className="msg">"{item.message || '-'}"</p>
                                <span className="badge">โต๊ะ: {item.tableNumber || '-'}</span>
                                <small>จาก: <strong>{item.name || '-'}</strong> ({item.socialType})</small>
                            </div>
                            <div className="actions-group">
                                <button className="btn-reject" onClick={() => handleRejectOrDelete(item.id, item.imageUrl)}>ไม่อนุมัติ</button>
                                <button className="btn-approve" onClick={() => handleApprove(item.id)}>อนุมัติ</button>
                            </div>
                        </div>
                    ))
                ) : ( <div className="empty-state">🎉 ไม่มีรายการรออนุมัติ</div> )}
                </div>
            </div>

            <div className="section">
                <h2>✅ รูปที่อนุมัติแล้ว ({filteredApproved.length})</h2>
                <div className="grid-layout">
                {filteredApproved.length > 0 ? (
                    filteredApproved.map(item => (
                        <div key={item.id} className="admin-card">
                            <div className="img-box"><img loading="lazy" src={item.imageUrl} alt="Approved submission" /></div>
                            <div className="meta">
                                <p className="msg">"{item.message || '-'}"</p>
                                <span className="badge">โต๊ะ: {item.tableNumber || '-'}</span>
                                <small>จาก: <strong>{item.name || '-'}</strong> ({item.socialType})</small>
                            </div>
                            <div className="actions">
                                <button className="btn-delete" onClick={() => handleRejectOrDelete(item.id, item.imageUrl)}>ลบถาวร</button>
                            </div>
                        </div>
                    ))
                ) : ( <div className="empty-state">ยังไม่มีรูปในสไลด์</div> )}
                </div>
            </div>
        </main>
    </div>
  );
}