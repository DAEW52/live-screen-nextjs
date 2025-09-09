const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST"]
  },
  path: "/api/socket"
});

io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on("refresh_admin", () => {
    console.log("📡 Received refresh_admin → broadcasting...");
    io.emit("refresh_admin");
  });

  socket.on("new_approved_submission", () => {
    console.log("📡 Received new_approved_submission → broadcasting...");
    io.emit("new_approved_submission");
  });

  socket.on("item_deleted", () => {
    console.log("📡 Received item_deleted → broadcasting...");
    io.emit("item_deleted");
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Failed to start server:", err);
  } else {
    console.log(`✅ Socket.IO server running at http://localhost:${PORT}`);
  }
});
