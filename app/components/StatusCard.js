// src/components/StatusCard.js
export default function StatusCard({ status, isSubmitting, handleClearFile, handleSubmit }) {
  return (
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
          <button 
            type="button" 
            onClick={handleSubmit} 
            className="btn-submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'กำลังส่ง...' : 'ส่งทั้งหมด'}
          </button>
          <button 
            type="button" 
            className="btn-clear" 
            onClick={handleClearFile} 
            disabled={isSubmitting}
          >
            ลบรูป
          </button>
        </div>
      </div>
    </div>
  );
}