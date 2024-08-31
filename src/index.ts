import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import Message from "./models/Message";

const app: Express = express();
const port = process.env.PORT || 3000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8001"
  }
});

io.on("connection", (socket) => {
  socket.on('setRoom', (data) => {
    socket.join(data.conversationId);
  });

  socket.on('sendMessage', async (data, callback) => {
    const newMessage = await Message.create(data.senderId, data.conversationId, data.content);
    const status = { ok: false };

    if (newMessage) {
      status.ok = true;
      io.in(data.conversationId).emit('receivedMessage', newMessage);
    }
    
    callback(status);

  });

  socket.on('sample', () => {
    console.log('disconnected');
  })

  socket.on('disconnect', () => {
    // console.log('disconnected');
  });
});

httpServer.listen(port);