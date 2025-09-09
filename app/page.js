'use client';

import { useState, useRef } from 'react';

export default function HomePage() {
  // --- 1. สร้าง State เพิ่มสำหรับจัดการข้อมูลและไฟล์ ---
  const [social, setSocial] = useState('facebook');
  const [username, setUsername] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State สำหรับเก็บไฟล์จริงๆ
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleUploadBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // เก็บ Object ของไฟล์ไว้
      setFileName(file.name);
    }
  };
  
  // --- 2. สร้างฟังก์ชัน handleSubmit สำหรับส่งข้อมูล ---
  const handleSubmit = async (event) => {
    event.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรช
    
    if (!selectedFile) {
      alert('กรุณาเลือกรูปภาพก่อนครับ');
      return;
    }
    
    // 3. สร้าง FormData เพื่อเตรียมส่งข้อมูล
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('socialType', social);
    formData.append('name', username);
    formData.append('tableNumber', tableNumber);
    formData.append('message', caption);
    
    try {
      // 4. ใช้ fetch เพื่อส่งข้อมูลไปที่ API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('อัปโหลดไม่สำเร็จ');
      }

      const result = await response.json();
      console.log('Success:', result);
      alert('อัปโหลดรูปภาพสำเร็จแล้ว!');
      // (Optional) เคลียร์ฟอร์มหลังส่งสำเร็จ
      setUsername('');
      setTableNumber('');
      setCaption('');
      setSelectedFile(null);
      setFileName('');

    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <main className="form-container">
      {/* --- คอลัมน์ซ้าย: ฟอร์ม --- */}
      <div className="form-column">
        <h1 className="form-title">THER Phuket • ส่งรูปขึ้นจอ</h1>
        
        {/* 5. แก้ไข Form Tag ให้เรียกใช้ handleSubmit */}
        <form id="uploadForm" className="form-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>โซเชียล</label>
            <div className="radio-group">
              <label className={social === 'facebook' ? 'active' : ''}>
                <input type="radio" name="social" value="facebook" checked={social === 'facebook'} onChange={(e) => setSocial(e.target.value)} /> Facebook
              </label>
              <label className={social === 'instagram' ? 'active' : ''}>
                <input type="radio" name="social" value="instagram" checked={social === 'instagram'} onChange={(e) => setSocial(e.target.value)} /> Instagram
              </label>
              <label className={social === 'line' ? 'active' : ''}>
                <input type="radio" name="social" value="line" checked={social === 'line'} onChange={(e) => setSocial(e.target.value)} /> LINE
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="username">ชื่อในโซเชียล</label>
            <input id="username" type="text" placeholder="@username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="table">เบอร์โต๊ะ</label>
            <input id="table" type="text" placeholder="เช่น 14, B5" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="caption">แคปชั่น</label>
            <textarea id="caption" rows="3" placeholder="ข้อความสั้นๆ โดนๆ ...." value={caption} onChange={(e) => setCaption(e.target.value)}></textarea>
          </div>
          <div className="form-group">
            <label>คุณภาพรูป (ออพชั่น)</label>
             <select defaultValue="standard">
                <option value="standard">มาตรฐาน (อัปโหลดเร็ว)</option>
                <option value="hd">คมชัดสูง (ใช้เวลาเล็กน้อย)</option>
            </select>
          </div>
          <div className="form-group">
             <label htmlFor="upload">เลือกรูป / ลากมาวาง</label>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/png, image/jpeg, image/gif" />
             <div className="upload-box" onClick={handleUploadBoxClick}>
                {fileName ? (<span>{fileName}</span>) : (
                  <>
                    คลิกเพื่อเลือก หรือ ลากไฟล์มาวางที่นี่
                    <br />
                    <small>รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 10MB</small>
                  </>
                )}
             </div>
          </div>
        </form>
      </div>

      {/* --- คอลัมน์ขวา: คำแนะนำ --- */}
      <div className="tips-column">
        <div className="tips-box">
            <h2>ข้อช่วย & สถานะ</h2>
            <h3>Quick Tips</h3>
            <ul>
                <li>เพื่อให้รูปที่ส่งไป/แชร์มาในโซเชียลฯ ระบบจะปรับขนาดอัตโนมัติให้พอดีจอแสดงผล</li>
                <li>เลือกคุณภาพภาพ "มาตรฐาน" เพื่ออัปโหลดรวดเร็วและคมชัดพอใช้ได้</li>
                <li>ถ้าไฟล์ภาพไม่สำาคัญ ระบบจะแจ้ง "คิวรอดส่ง" และลองส่งให้อัตโนมัติ</li>
                <li>คิวรอดส่ง (ออฟไลน์)</li>
            </ul>
            <div className="button-group">
                {/* 6. แก้ไขปุ่มให้ผูกกับฟอร์ม */}
                <button type="submit" form="uploadForm" className="btn-submit">ส่งเข้าทั้งหมด</button>
                <button type="button" className="btn-clear">ลบรูป</button>
            </div>
        </div>
      </div>
    </main>
  );
}