import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors';

const port = 3000

const app = express();
const server = createServer(app);

// two ways to enable cors

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

//acts as a middleware also before running anything this gets executed

// app.use(cors({
//     cors:{
//         origin: 'http://localhost:5173/',
//         methods: ['GET', 'POST'],
//         credentials: true
//     }
// }))

app.get('/', (req, res) => {
    res.send('Hello World! This is my first server using Node.js and Express.js')
});

io.on('connection', (socket) => {
    console.log("User Connected", socket.id);

    socket.on("message", ({ room, message }) => {
        console.log({ room, message });
        socket.to(room).emit("receive-message", message);
    });

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });

})

server.listen(3000, () => {
    console.log(`server running on port ${port}..`);

})