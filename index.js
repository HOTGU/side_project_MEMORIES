import express from "express";
import csrf from "csurf";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import sessions from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import flash from "connect-flash";

import globalRouter from "./routes/globalRouter.js";
import memoryRouter from "./routes/memoryRouter.js";
import userRouter from "./routes/userRouter.js";
import { resLocalsMiddleware } from "./middleware.js";

const app = express();
const csrfProtection = csrf({ cookie: true });

mongoose.connect(process.env.DEV_MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const dbErrorHandler = () => console.log("❌ DB 연결 실패");
const dbSuccessHandler = () => console.log("✅ DB 연결 성공");

const db = mongoose.connection;
db.on("error", dbErrorHandler);
db.once("open", dbSuccessHandler);

const cspOptions = {
    directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),

        "script-src": ["'self'"],

        "img-src": ["'self'", "blob:"],
    },
};

app.use(
    helmet({
        contentSecurityPolicy: cspOptions,
    })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    sessions({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.DEV_MONGO_URL,
        }),
    })
);

app.use(flash());

app.set("view engine", "pug");
app.use("/src", express.static("src"));
app.use("/static", express.static(__dirname + "/static"));
app.use("/uploads", express.static("uploads"));

app.use(resLocalsMiddleware);
// app.use(csrfProtection);
// app.use((req, res, next) => {
//     res.cookie("X-CSRF-TOKEN", req.csrfToken());
//     next();
// });

app.use("/", globalRouter);
app.use("/memory", memoryRouter);
app.use("/user", userRouter);

app.use((err, req, res, next) => {
    console.log(err);
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "오류가 생겼습니다";
    return res.render("error", { errorStatus, errorMessage });
});

const handleListen = () => {
    console.log(`✅ 서버가 ${process.env.PORT}에서 실행중이야`);
};

app.listen(process.env.PORT, handleListen);
