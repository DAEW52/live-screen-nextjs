'use client';

import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';

export default function HomePage() {
  const [socialType, setSocialType] = useState('facebook');
  const [username, setUsername] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('พร้อมใช้งาน');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadBoxClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setStatus(`เตรียมพร้อม: ${file.name}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return alert('กรุณาเลือกรูปภาพก่อนครับ');
    setIsSubmitting(true);
    setStatus('กำลังบีบอัดรูปภาพ...');
    const options = { maxSizeMB: 4, maxWidthOrHeight: 1920, useWebWorker: true };

    try {
      const compressedFile = await imageCompression(selectedFile, options);
      setStatus('กำลังส่งข้อมูล...');
      const formData = new FormData();
      formData.append('file', compressedFile, selectedFile.name);
      formData.append('socialType', socialType);
      formData.append('name', username);
      formData.append('tableNumber', tableNumber);
      formData.append('message', caption);
      
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('การอัปโหลดล้มเหลว');

      setStatus('ส่งสำเร็จ! รอการอนุมัติ');
      setUsername(''); setTableNumber(''); setCaption(''); setSelectedFile(null); setFileName('');
    } catch (error) {
      setStatus(`ผิดพลาด: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* เปลี่ยนจาก bg-red-500 เป็นสีน้ำเงินเข้มเพื่อความทันสมัย */
    <main className="min-h-screen bg-[#0f172a] py-12 px-4 font-sans text-slate-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* คอลัมน์ซ้าย: ฟอร์ม */}
        <div className="lg:col-span-7 bg-[#1e293b] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-black text-white mb-2">THER Phuket</h1>
            <p className="text-slate-400 mb-8">แชร์ความสนุกของคุณขึ้นบนจอหลักของร้าน</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-300 block mb-3 uppercase tracking-wider">ช่องทางโซเชียล</label>
                <div className="grid grid-cols-3 gap-3">
                  {['facebook', 'instagram', 'line'].map((type) => (
                    <label key={type} className={`
                      flex items-center justify-center py-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                      ${socialType === type 
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                        : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:border-slate-700'}
                    `}>
                      <input type="radio" className="hidden" value={type} checked={socialType === type} onChange={(e) => setSocialType(e.target.value)} />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">ชื่อโซเชียลของคุณ</label>
                  <input className="w-full bg-slate-900/60 px-5 py-4 rounded-2xl border border-slate-800 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    type="text" placeholder="@username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">เลขโต๊ะ</label>
                  <input className="w-full bg-slate-900/60 px-5 py-4 rounded-2xl border border-slate-800 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    type="text" placeholder="เช่น 14, B5" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">แคปชั่นความในใจ</label>
                <textarea className="w-full bg-slate-900/60 px-5 py-4 rounded-2xl border border-slate-800 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" 
                  rows="3" placeholder="บอกอะไรกับทุกคนหน่อย..." value={caption} onChange={(e) => setCaption(e.target.value)}></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">เลือกรูปภาพ</label>
                <div onClick={handleUploadBoxClick} className={`
                  border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300
                  ${fileName ? 'border-green-500/50 bg-green-500/5' : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60'}
                `}>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <span className={`text-xl font-bold block mb-2 ${fileName ? 'text-green-400' : 'text-indigo-400'}`}>
                    {fileName || 'คลิกเพื่อเลือกไฟล์รูปภาพ'}
                  </span>
                  <p className="text-sm text-slate-500">รองรับ JPG, PNG, GIF (บีบอัดอัตโนมัติ)</p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* คอลัมน์ขวา */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#1e293b] p-8 rounded-3xl shadow-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6">สถานะระบบ</h2>
            <div className={`p-5 rounded-2xl mb-8 flex items-center gap-4 ${isSubmitting ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-900/60 text-slate-400'}`}>
              <div className={`w-4 h-4 rounded-full ${isSubmitting ? 'bg-amber-500 animate-pulse' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`}></div>
              <span className="font-bold tracking-wide">{status}</span>
            </div>

            <div className="space-y-4">
              <button onClick={handleSubmit} disabled={isSubmitting} className={`
                w-full py-5 rounded-2xl font-black text-lg text-white transition-all transform
                ${isSubmitting ? 'bg-slate-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-1 shadow-[0_10px_20px_rgba(79,70,229,0.3)] active:scale-95'}
              `}>
                {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งขึ้นจอเลย!'}
              </button>
              <button onClick={() => { setSelectedFile(null); setFileName(''); setStatus('พร้อมใช้งาน'); }} className="w-full py-3 rounded-2xl font-bold text-slate-500 hover:text-white transition-colors">
                ล้างข้อมูล
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600/20 to-transparent p-8 rounded-3xl border border-indigo-500/20 shadow-inner">
            <h3 className="text-indigo-400 font-bold mb-4 flex items-center gap-2 text-lg">Quick Tips 💡</h3>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li className="flex gap-3"><span>•</span> รูปจะถูกปรับขนาดให้พอดีจอแสดงผลอัตโนมัติ</li>
              <li className="flex gap-3"><span>•</span> ระบบตรวจสอบความเหมาะสมก่อนแสดงผล</li>
              <li className="flex gap-3"><span>•</span> ทีมงานจะปล่อยรูปขึ้นจอภายใน 1-2 นาที</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}