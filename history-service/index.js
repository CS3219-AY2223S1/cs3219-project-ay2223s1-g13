import express from "express";
import cors from "cors";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.options("*", cors());

import {
    createHistory,
    deleteHistories,
    getHistories,
} from "./controller/history-controller.js";

const router = express.Router();

router.get("/", getHistories);
router.post("/", createHistory);
router.delete("/", deleteHistories);

app.use("/api/history", router).all((_, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
});

app.listen(8005, () => console.log("history-service listening on port 8005"));

export default app;
