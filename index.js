import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const handleListen = () => {
    console.log(`서버가 ${process.env.PORT}에서 실행중이야`);
};

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(process.env.PORT, handleListen);
