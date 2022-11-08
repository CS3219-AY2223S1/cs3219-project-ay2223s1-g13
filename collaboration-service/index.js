import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 8003;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

const httpServer = createServer(app);
httpServer.listen(PORT);
console.log("collaboration-service listening on port 8003");

app.get("/", (req, res) => {
    res.send("Hello World from collaboration-service");
});

// create a socket.io server
export const io = new Server(httpServer, {
    /* options */
    cors: {
        origin: "https://frontend-66acladbaq-uc.a.run.app",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    socket.on('join room', (params) => {
        socket.join(params["roomId"]);
    });

    socket.on('exchange question', (params) => {
        socket.to(params.roomId).emit('receive other question', params.question);
    })

    socket.on('sendmessage', (params) => {
        socket.to(params.roomId).emit('receivemessage', {sender: params.sender, message: params.message});
    })

    socket.on('exit', (params) => {
        socket.to(params.roomId).emit('partner exit');
    })

    socket.on('end', () => {
        socket.disconnect();
    })
});