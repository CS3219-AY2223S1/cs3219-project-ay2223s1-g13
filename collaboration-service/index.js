import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const log = console.log

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

const httpServer = createServer(app);
httpServer.listen(8003);
console.log("Hello World from collaboration-service") 

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
        log("joined room " + params["roomId"]);
    });

    socket.on('send code', (params) => {
        socket.to(params.roomId).emit('receive code', params.text);
    });

    socket.on('exit', (params) => {
        socket.to(params.roomId).emit('partner exit');
    })
});