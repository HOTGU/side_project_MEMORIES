import express from "express";
import {
    home,
    join,
    joinPost,
    login,
    loginPost,
    logout,
} from "../controllers/globalController.js";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/logout", logout);

globalRouter.route("/join").get(join).post(joinPost);

globalRouter.route("/login").get(login).post(loginPost);

export default globalRouter;
