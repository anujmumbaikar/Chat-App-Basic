import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {Server} from 'socket.io';
import http from 'http';
import path from 'path';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});


//used to store online users
const userSocketMap = {}
export function getRecieverSocketId(userId){
    return userSocketMap[userId];
}

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });

});
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));




const __dirname = path.resolve();
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}
import { userRouter } from './routes/user.routes.js';
import { messageRouter } from './routes/message.routes.js';
app.use('/api/v1/user', userRouter);
app.use('/api/v1/message', messageRouter);

export {app,server,io}
