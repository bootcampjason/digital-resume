/* *
   *   🗂️ File: index.js (Backend)
   * 
   *   Main server entry point
   * 
   *   Sets up Express
   *   Creates HTTP server
   *   Initializes Socket.IO
   *   Handles real-time socket events
   *  
   *   Notes:
   * 
   *   When using Socket.IO, you need to attach it to a raw HTTP server, not just the Express app.
   *   http.createServer(app)	Creates a raw HTTP server Express can use
   *   new Server(server)	Hooks Socket.IO into that server's low-level WebSocket system
   *   server.listen(...)	Starts both HTTP and WebSocket listeners at once
   * 
   *   🖥️  Client A (socket.id: A1)       🖥️  Client B (socket.id: B2)       🖥️  Client C (socket.id: C3)
   *            │ <--------- socket.emit ---------┘                                │
                │     (Send event to self only)                                    │
                │                                                                  │
                └---------> socket.broadcast.emit ---------> B & C only            │
                              (Send to others, not self)                           │

                                      ┌────────────────────────────┐
                                      │        🌐 Server           │
                                      │                            │
                                      │   io.on('connection')      │
                                      │     - socket.id = A1/B2/C3 │
                                      └────────────────────────────┘

                                      ▲                            ▲
                                      │                            │
                   io.emit('event') ──┴─────> A, B, C (everyone gets it)
                                      (global broadcast)
   *    socket.emit()
   *    socket.broadcast.emit()
   *    io.emit()
*/

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const chatsRouter = require('./routes/chats');
require('./db/db')
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Attach socket.io to the HTTP server
const io = new Server(server, {
  cors: {
      origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

app.use(express.json());
app.use(cors());
app.use('/chats', chatsRouter);

const PORT = process.env.PORT || 5000;

// root directory
app.get('/', (req, res) => {
    res.send('Showing 🆒 UI');
    console.log('🔹🔹🔹 Welcome to the backworld 🔹🔹🔹')
});

let onlineUsers = [];

// Listen for new connections
io.on('connection', (socket) => {
  console.log('🟢 Connected to Socket.io:', socket.id);

  // Listen for a custom event
  socket.on('add_new_online_user', ({username, socketId}) => {
    console.log('onlineUsers', onlineUsers)
    console.log('socketId', socketId)
    if (onlineUsers.some((onlineUser) => onlineUser.socketId !== socketId) || !onlineUsers.length) {
      console.log(`DEV: pushing ${username} to onlineUser `)
      onlineUsers.push({ username, socketId: socket.id });
      console.log('Online Users:', onlineUsers);
    }
    io.emit('get_users', onlineUsers);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit('get_users', onlineUsers);
    console.log('❌ Disconnected from Socket.io:', socket.id);
  });

  socket.on('send_message', (msg) => {
    console.log('sent message!')
    io.emit('receive_message', msg);
  });


  socket.on('typing', (user) => {
    socket.broadcast.emit('typing', user);
  });

  socket.on('stop_typing', (user) => {
    socket.broadcast.emit('stop_typing', user);
  });
});

// # /chats

// // Use this from client side's request.body on POST method
// // { timestampe: new Date().toISOString(); }

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

