'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  CheckCircle2, XCircle, Zap, Clock, Image as ImageIcon, 
  Trash2, RefreshCcw, Monitor, Maximize2, Loader2, X
} from 'lucide-react';

// --- ฟังก์ชันแสดงไอคอนโซเชียล ---
const SocialIcon = ({ type }) => {
  const socialType = type?.toLowerCase();
  const getConfig = () => {
    if (socialType === 'facebook') return { color: '#1877F2', label: 'FB' };
    if (socialType === 'instagram') return { color: '#E4405F', label: 'IG' };
    if (socialType === 'line') return { color: '#06C755', label: 'LINE' };
    return { color: '#64748b', label: '??' };
  };
  const config = getConfig();
  return (
    <span style={{ 
      display: 'inline-flex', alignItems: 'center', padding: '2px 8px', 
      borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold', 
      backgroundColor: config.color, color: 'white', marginLeft: '8px' 
    }}>
      {config.label}
    </span>
  );
};

export default function SuperAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending'); 
  const [previewUrl, setPreviewUrl] = useState(null);

  // 1. ดึงข้อมูล
  const fetchData = async () => {
    const { data: res, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && res) setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const channel = supabase.channel('super_admin_final')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => fetchData())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  // 2. ฟังก์ชันจัดการสถานะ (อนุมัติ / ปฏิเสธ) - แก้ไขให้เรียกผ่าน API
  const handleAction = async (id, status) => {
    try {
      const apiPath = status === 'approved' ? 'approve' : 'reject';
      // ถ้าเป็น status 'pending' (กู้คืน) ให้ใช้ path reject แต่ส่ง status ไปจัดการ หรือสร้าง API เพิ่ม
      // ในที่นี้ขอปรับให้เรียกตรงตามสถานะ
      const targetPath = status === 'pending' ? 'reject' : apiPath; 
      
      const response = await fetch(`/api/${targetPath}/${id}`, { 
        method: 'POST',
        // ส่ง status ไปด้วยถ้า API ของคุณรองรับการรับ Body
        body: JSON.stringify({ status: status }) 
      });
      
      if (!response.ok) {
        const err = await response.json();
        alert("อัปเดตไม่สำเร็จ: " + err.error);
      } else {
        fetchData(); 
      }
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // 3. ฟังก์ชันรัดคิว (Push to Front)
  const pushNext = async (id) => {
    await supabase.from('submissions')
      .update({ created_at: new Date().toISOString() })
      .eq('id', id);
    alert("⚡ ดันขึ้นคิวถัดไปบนหน้าจอเรียบร้อย!");
  };

  // 4. ฟังก์ชันลบถาวร - แก้ไขให้เรียกผ่าน API เพื่อข้าม RLS
  const deletePermanent = async (id) => {
    if (confirm("⚠️ ต้องการลบรูปนี้ออกจากฐานข้อมูลถาวรใช่หรือไม่?")) {
      try {
        const response = await fetch(`/api/delete/${id}`, { method: 'DELETE' });
        if (response.ok) {
          alert("ลบข้อมูลสำเร็จ!");
          fetchData(); 
        } else {
          const err = await response.json();
          alert("ลบไม่สำเร็จ: " + err.error);
        }
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  // 5. ฟังก์ชันแก้ไขข้อความ
  const handleUpdateMessage = async (id, newMessage) => {
    await supabase.from('submissions').update({ message: newMessage }).eq('id', id);
  };

  const filtered = data.filter(item => item.status === tab);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p>THER PHUKET SYSTEM STARTING...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-4 md:p-8 font-sans">
      <style>{`
        .glass { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); }
        .tab-active { background: #3b82f6; color: white; box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-5px); border-color: #3b82f6; background: rgba(30, 41, 59, 0.9); }
        .modal-overlay { 
          position: fixed; inset: 0; background: rgba(0,0,0,0.9); 
          z-index: 10000; display: flex; align-items: center; justify-content: center; 
          backdrop-filter: blur(8px); padding: 40px; cursor: zoom-out;
        }
        .modal-content {
          max-width: 85%; max-height: 85vh; border-radius: 20px;
          border: 4px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          object-fit: contain; animation: zoomIn 0.2s ease-out;
        }
        @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              THER PHUKET <span className="text-white">CONTROL</span>
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm">
              <Monitor size={16} className="text-emerald-400" /> แผงควบคุมระบบ Live Screen อัจฉริยะ
            </p>
          </div>

          <div className="glass p-1.5 rounded-2xl flex gap-1">
            <button onClick={() => setTab('pending')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'pending' ? 'tab-active' : 'hover:bg-white/5'}`}>
              รอตรวจ ({data.filter(i=>i.status==='pending').length})
            </button>
            <button onClick={() => setTab('approved')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'approved' ? 'tab-active' : 'hover:bg-white/5'}`}>
              บนหน้าจอ ({data.filter(i=>i.status==='approved').length})
            </button>
            <button onClick={() => setTab('rejected')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'rejected' ? 'tab-active' : 'hover:bg-white/5'}`}>
              ถังขยะ ({data.filter(i=>i.status==='rejected').length})
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="glass rounded-[1.5rem] overflow-hidden card-hover flex flex-col border border-white/5">
              <div className="relative group aspect-[4/3] overflow-hidden cursor-zoom-in" onClick={() => setPreviewUrl(item.imageUrl)}>
                <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                  <Maximize2 size={32} />
                </div>
                {item.status === 'approved' && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-emerald-500 text-[10px] font-black rounded-full text-white animate-pulse">
                    ON AIR
                  </div>
                )}
              </div>

              <div className="p-5 flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <span className="text-blue-400 font-black">โต๊ะ {item.tableNumber}</span>
                    <SocialIcon type={item.socialType} />
                  </div>
                </div>

                <textarea 
                  defaultValue={item.message}
                  onBlur={(e) => handleUpdateMessage(item.id, e.target.value)}
                  className="w-full bg-black/30 border border-slate-700/50 rounded-xl p-3 text-sm text-slate-200 focus:border-blue-500 outline-none h-20 mb-4 transition"
                  placeholder="พิมพ์ข้อความที่ต้องการโชว์บนจอ..."
                />

                <div className="flex gap-2">
                  {tab === 'pending' && (
                    <>
                      <button onClick={() => handleAction(item.id, 'rejected')} className="flex-1 py-3 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white transition font-bold text-xs flex items-center justify-center gap-2">
                        <XCircle size={16} /> ข้าม
                      </button>
                      <button onClick={() => handleAction(item.id, 'approved')} className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition font-bold text-xs flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} /> อนุมัติ
                      </button>
                    </>
                  )}

                  {tab === 'approved' && (
                    <>
                      <button onClick={() => pushNext(item.id)} className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white transition font-bold text-xs flex items-center justify-center gap-2">
                        <Zap size={16} fill="currentColor" /> รัดคิว
                      </button>
                      <button onClick={() => handleAction(item.id, 'rejected')} className="p-3 rounded-xl bg-slate-800 hover:bg-rose-600 transition text-slate-400 hover:text-white border border-slate-700">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}

                  {tab === 'rejected' && (
                    <>
                      <button onClick={() => handleAction(item.id, 'pending')} className="flex-1 py-3 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white transition font-bold text-xs flex items-center justify-center gap-2">
                        <RefreshCcw size={16} /> กู้คืน
                      </button>
                      <button onClick={() => deletePermanent(item.id)} className="p-3 rounded-xl bg-rose-900/20 text-rose-500 hover:bg-rose-600 hover:text-white transition border border-rose-500/20">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewUrl && (
        <div className="modal-overlay" onClick={() => setPreviewUrl(null)}>
          <button className="absolute top-10 right-10 text-white/50 hover:text-white transition">
            <X size={40} />
          </button>
          <img 
            src={previewUrl} 
            className="modal-content" 
            alt="Preview" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}