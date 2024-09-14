import express, { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import jwt from "jsonwebtoken";
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

io.use((socket, next) => {
  const authorization = socket.handshake.headers.authorization;
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Error('Invalid Token!'));
  }
  
  const token = authorization.substring(7);
  const accessKey = process.env.JWT_KEY || 'my-key';
  
  jwt.verify(token, accessKey, (err, decoded) => {
    if (err) {
      return next(new Error('Invalid Token!'));
    }
    
    socket.data.user = decoded;
    next();
  });
  
});

io.on("connection", (socket) => {
  socket.on('setRoom', (data) => {
    socket.join(data.conversationId);
  });

  socket.on('sendMessage', async (data, callback) => {
    const newMessage = await Message.create(socket.data.user.user_id, data.conversationId, data.content);
    const status = { ok: false };

    if (newMessage) {
      status.ok = true;
      io.in(data.conversationId).emit('receivedMessage', newMessage);
      io.emit('updateNewMessage', newMessage);
    }
    
    callback(status);
  });

  socket.on('sendFirstMessage', async (data, callback) => {
    const conversation = await Conversation.create(socket.data.user.user_id, data.clientId);
    const response: { ok: boolean; conversationId: number | null } = { 
      ok: false ,
      conversationId: null
    };

    if (conversation) {
      const newMessage = await Message.create(socket.data.user.user_id, conversation.id, data.content);
      
      if (newMessage) {
        response.ok = true;
        response.conversationId = conversation.id;

        conversation.latest_message = newMessage;
        socket.broadcast.emit('newConversation', conversation);
      }
    }

    callback(response);
  });
});

httpServer.listen(port);
