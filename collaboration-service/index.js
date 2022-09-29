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
const io = new Server(httpServer, {
    /* options */
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});


io.on("connection", (socket) => {
    log("Connected")
    socket.on('message', (evt) => {
        socket.broadcast.emit('message', evt)
    })
});