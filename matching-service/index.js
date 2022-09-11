import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());
// import { createMatch } from "./controller/match-controller";

// // const router = express.Router()

// // router.post('/', createMatch)

const httpServer = createServer(app);
httpServer.listen(8001);

app.get("/", (req, res) => {
    res.send("Hello World from matching-service");
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
    // ...
    console.log(`New Client connected ${socket.id}`);
    socket.on('match', (params) => {
        params["socketId"] = socket.id;
        console.log("hihihi", params)
        socket.emit('createMatch', params)
    })
});

