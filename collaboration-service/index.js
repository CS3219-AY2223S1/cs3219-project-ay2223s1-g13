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
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    socket.on('join room', (params) => {
        socket.join(params["roomId"]);
        console.log("joined room " + params["roomId"]);
    });

    socket.on('exchange question', (params) => {
        socket.to(params.roomId).emit('receive other question', params.question);
    })

    socket.on('send code', (params) => {
        socket.to(params.roomId).emit('receive code', params.text);
    });

    socket.on('exit', (params) => {
        socket.to(params.roomId).emit('partner exit');
    })
});