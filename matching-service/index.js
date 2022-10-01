import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { createMatch, getAllMatch } from "./controller/match-controller.js";
import moment from "moment";

const PORT = 8001;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

export const httpServer = createServer(app);
httpServer.listen(PORT);
console.log("matching-service listening on port " + PORT);

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

export const users = [];

io.on("connection", (socket) => {
    // add user to users
    const user = {
        "socket": socket,
        "socketId": socket.id
    }
    users.push(user);

    console.log(`New Client connected ${socket.id}`);

    // see all match items
    socket.on("get", () => {
        getAllMatch();
    })

    // call to create match
    socket.on("match", (params) => {
        params["socketId"] = socket.id;
        params["createdAt"] = moment().format("YYYY-MM-DD HH:mm:ss")
        console.log(params.createdAt)
        createMatch(params);
    });

    socket.on("start", (params) => {
        socket.to(params.roomId).emit("partner start");
    });
});

// io.on('disconnect', (socketId) => {
//     users = users.filter(u => u.socketId !== user.socketId); // removing disconnected user

// });
