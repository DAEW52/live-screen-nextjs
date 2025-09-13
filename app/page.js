'use client';

import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';

export default function HomePage() {
  // --- 1. State สำหรับจัดการข้อมูลในฟอร์ม ---
  const [socialType, setSocialType] = useState('facebook');
  const [username, setUsername] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  
  // --- State ใหม่สำหรับแสดงสถานะการอัปโหลด ---
  const [status, setStatus] = useState('ยังไม่มีการอัปโหลด');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleUploadBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setStatus(`เลือกไฟล์: ${file.name}`);
    }
  };
  
  // --- 2. ฟังก์ชัน handleSubmit ที่มีตรรกะการบีบอัดรูปภาพ ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      alert('กรุณาเลือกรูปภาพก่อนครับ');
      return;
    }
    
    setIsSubmitting(true);
    setStatus('กำลังบีบอัดรูปภาพ...');

    const options = {
      maxSizeMB: 4,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(selectedFile, options);
      setStatus('กำลังอัปโหลด...');
      
      const formData = new FormData();
      formData.append('file', compressedFile, selectedFile.name);
      formData.append('socialType', socialType);
      formData.append('name', username);
      formData.append('tableNumber', tableNumber);
      formData.append('message', caption);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      setStatus('อัปโหลดสำเร็จ! รอการอนุมัติ');
      
      // เคลียร์ฟอร์ม
      setUsername('');
      setTableNumber('');
      setCaption('');
      setSelectedFile(null);
      setFileName('');
      fileInputRef.current.value = null;

    } catch (error) {
      console.error('Error:', error);
      setStatus(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  // --- ฟังก์ชันสำหรับปุ่ม "ลบรูป" ---
  const handleClearFile = () => {
      setSelectedFile(null);
      setFileName('');
      setStatus('ยังไม่มีการอัปโหลด');
      fileInputRef.current.value = null;
  }

  return (
    <main className="form-container">
      {/* --- คอลัมน์ซ้าย: ฟอร์ม --- */}
      <div className="form-column">
        <h1 className="form-title">THER Phuket • ส่งรูปขึ้นจอ</h1>
        
        <form id="uploadForm" className="form-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>โซเชียล</label>
            <div className="radio-group">
              <label className={socialType === 'facebook' ? 'active' : ''}>
                <input type="radio" name="social" value="facebook" checked={socialType === 'facebook'} onChange={(e) => setSocialType(e.target.value)} /> Facebook
              </label>
              <label className={socialType === 'instagram' ? 'active' : ''}>
                <input type="radio" name="social" value="instagram" checked={socialType === 'instagram'} onChange={(e) => setSocialType(e.target.value)} /> Instagram
              </label>
              <label className={socialType === 'line' ? 'active' : ''}>
                <input type="radio" name="social" value="line" checked={socialType === 'line'} onChange={(e) => setSocialType(e.target.value)} /> LINE
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="username">ชื่อในโซเชียล</label>
            <input id="username" type="text" placeholder="@username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
          </div>
          <div className="form-group">
            <label htmlFor="table">เบอร์โต๊ะ</label>
            <input id="table" type="text" placeholder="เช่น 14, B5" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} required/>
          </div>
          <div className="form-group">
            <label htmlFor="caption">แคปชั่น</label>
            <textarea id="caption" rows="3" placeholder="ข้อความสั้นๆ โดนๆ ...." value={caption} onChange={(e) => setCaption(e.target.value)}></textarea>
          </div>
          <div className="form-group">
            <label>คุณภาพรูป (ออพชั่น)</label>
              <select defaultValue="standard">
                <option value="standard">มาตรฐาน (อัปโหลดเร็ว)</option>
                <option value="hd" disabled>คมชัดสูง (เร็วๆ นี้)</option>
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
                    <small>รองรับไฟล์ JPG, PNG, GIF</small>
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
            <div className="status-display">
                <p>สถานะปัจจุบัน: <strong>{status}</strong></p>
            </div>
            <h3>Quick Tips</h3>
            <ul>
                <li>เพื่อให้รูปที่ส่งไป/แชร์มาในโซเชียลฯ ระบบจะปรับขนาดอัตโนมัติให้พอดีจอแสดงผล</li>
                <li>เลือกคุณภาพภาพ "มาตรฐาน" เพื่ออัปโหลดรวดเร็วและคมชัดพอใช้ได้</li>
                <li>ระบบจะบีบอัดไฟล์ภาพขนาดใหญ่ให้โดยอัตโนมัติ</li>
            </ul>
            <div className="button-group">
                <button type="submit" form="uploadForm" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'กำลังส่ง...' : 'ส่งทั้งหมด'}
                </button>
                <button type="button" className="btn-clear" onClick={handleClearFile} disabled={isSubmitting}>ลบรูป</button>
            </div>
        </div>
      </div>
    </main>
  );
}

