import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { createMatch } from "./controller/match-controller.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

// // const router = express.Router()

// // router.post('/', createMatch)

const httpServer = createServer(app);
httpServer.listen(8001);

app.get("/", (req, res) => {
    res.send("Hello World from matching-service");
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
    // ...
    console.log(`New Client connected ${socket.id}`);
    socket.on("createMatch", (params) => {
        console.log("createMatch was called " + params);
    });
    socket.on("match", createMatch);
});
