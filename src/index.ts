import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import { MessageController as Message } from "./controllers/MessageController";
import { ConversationController as Conversation } from "./controllers/ConversationController";

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
      io.emit('updateNewMessage', newMessage);
    }
    
    callback(status);
  });

  socket.on('sendFirstMessage', async (data, callback) => {
    const conversation = await Conversation.create(data.userId, data.clientId);
    const response: { ok: boolean; conversationId: number | null } = { 
      ok: false ,
      conversationId: null
    };

    if (conversation) {
      const newMessage = await Message.create(data.userId, conversation.id, data.content);
      
      if (newMessage) {
        response.ok = true;
        response.conversationId = conversation.id;

        conversation.latest_message = newMessage;
        socket.broadcast.emit('newConversation', conversation);
      }
    }

    callback(response);
  });

  socket.on('sample', () => {
    console.log('disconnected');
  })

  socket.on('disconnect', () => {
    // console.log('disconnected');
  });
});

httpServer.listen(port);