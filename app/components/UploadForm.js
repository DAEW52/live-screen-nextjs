// src/components/UploadForm.js
export default function UploadForm({ 
  socialType, setSocialType, 
  username, setUsername, 
  tableNumber, setTableNumber, 
  caption, setCaption, 
  fileName, handleUploadBoxClick, 
  fileInputRef, handleFileChange 
}) {
  return (
    <div className="form-column">
      <h1 className="form-title">THER Phuket • ส่งรูปขึ้นจอ</h1>
      <form id="uploadForm" className="form-body">
        <div className="form-group">
          <label>โซเชียล</label>
          <div className="radio-group">
            {['facebook', 'instagram', 'line'].map((type) => (
              <label key={type} className={socialType === type ? 'active' : ''}>
                <input 
                  type="radio" 
                  name="social" 
                  value={type} 
                  checked={socialType === type} 
                  onChange={(e) => setSocialType(e.target.value)} 
                /> {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
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
  );
}