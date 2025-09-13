'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setPending(data.filter((item) => item.status === 'pending'));
      setApproved(data.filter((item) => item.status === 'approved'));
    }
  };

  useEffect(() => {
    fetchSubmissions();

    const channel = supabase
      .channel('realtime admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        (payload) => {
          console.log('Admin page received payload:', payload);
          fetchSubmissions();
        }
      )
      // ---- ✨ V V V เพิ่มโค้ดตรวจสอบตรงนี้ V V V ✨ ----
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ [Admin Page] Connected to Realtime!');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ [Admin Page] Realtime Connection Error:', err);
        }
        if (status === 'TIMED_OUT') {
          console.warn('⌛ [Admin Page] Realtime Connection Timed Out.');
        }
      });
      // ---- ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ----

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAction = async (id, action) => {
    const endpoint = action === 'approve' ? `/api/approve/${id}` : `/api/reject/${id}`;
    
    await fetch(endpoint, { method: 'POST' });
    // ไม่ต้องรอ fetchSubmissions เพราะ Realtime จะทำงานเอง
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">รายการรออนุมัติ ({pending.length})</h1>
      {pending.length === 0 ? (
        <p className="text-gray-400">ไม่มีรายการรออนุมัติ</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pending.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img src={item.imageUrl} alt="submission" className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="font-bold">"{item.message}"</p>
                <p className="text-sm text-gray-400">จาก: {item.name} ({item.socialType})</p>
                <p className="text-sm text-gray-400">โต๊ะ: {item.tableNumber}</p>
                <div className="flex justify-between mt-4 gap-2">
                  <button onClick={() => handleAction(item.id, 'reject')} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">ไม่อนุมัติ</button>
                  <button onClick={() => handleAction(item.id, 'approve')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">อนุมัติ</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h1 className="text-3xl font-bold mt-8 mb-4">รูปที่อนุมัติแล้ว ({approved.length})</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {approved.map((item) => (
             <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img src={item.imageUrl} alt="submission" className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="font-bold">"{item.message}"</p>
                <p className="text-sm text-gray-400">จาก: {item.name} ({item.socialType})</p>
                <p className="text-sm text-gray-400">โต๊ะ: {item.tableNumber}</p>
                <div className="mt-4">
                   <button onClick={() => handleAction(item.id, 'reject')} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors">ลบ</button>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}

