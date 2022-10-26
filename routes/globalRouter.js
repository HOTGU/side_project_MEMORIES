import express from "express";
import {
    home,
    join,
    joinPost,
    login,
    loginPost,
    logout,
    me,
    meUpdate,
    meUpdatePost,
} from "../controllers/globalController.js";
import { avatarMulter } from "../middleware.js";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/logout", logout);

globalRouter.get("/me", me);

globalRouter.get("/me/update", meUpdate);
globalRouter.post("/me/update", avatarMulter.single("avatar"), meUpdatePost);

globalRouter.route("/join").get(join).post(joinPost);

globalRouter.route("/login").get(login).post(loginPost);

export default globalRouter;
