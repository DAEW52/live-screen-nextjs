const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // อนุญาตให้เว็บจาก Next.js (Port 3000) เชื่อมต่อได้
    methods: ["GET", "POST"]
  },
  path: "/api/socket" // กำหนด path ให้ตรงกับที่ client และ API เรียกใช้
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // เมื่อ API ส่ง event มา, ให้กระจาย event นี้ไปยัง client ที่เชื่อมต่ออยู่ (หน้า admin/display)
  socket.on('refresh_admin', () => {
    console.log('Received refresh_admin, broadcasting...');
    io.emit('refresh_admin');
  });

  socket.on('new_approved_submission', () => {
    console.log('Received new_approved_submission, broadcasting...');
    io.emit('new_approved_submission');
  });
  
  socket.on('item_deleted', () => {
    console.log('Received item_deleted, broadcasting...');
    io.emit('item_deleted');
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${PORT}`);
});