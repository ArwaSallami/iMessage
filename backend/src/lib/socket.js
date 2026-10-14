import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
});

function getReceiverSocketId(userId) {
  return userocketMap[userId] || null;
}

// online users map ={userId:socketId}
const userocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) userocketMap[userId] = socket.id;

  //io.emit sends the event to all connected clients-broadcast
  io.emit("getonlineUsers", Object.keys(userocketMap));

  // socket.on is used to listen for events from the client
  socket.on("disconnect", () => {
    // Remove the user from the online users map when they disconnect
    if (userId) delete userocketMap[userId];
    io.emit("getonlineUsers", Object.keys(userocketMap));
  });

  console.log("A user connected:", socket.id);
});

export { io, userocketMap, server, app, getReceiverSocketId };
