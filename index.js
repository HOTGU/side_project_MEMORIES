import express from "express";

const app = express();
const PORT = 5000;

const handleListen = () => {
    console.log("서버가 실행중이야");
};

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, handleListen);
