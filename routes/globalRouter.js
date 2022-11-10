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
    verifyEmail,
} from "../controllers/globalController.js";
import { s3MulterUpload, isVerifiedEmail } from "../middleware.js";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/verify", verifyEmail);
globalRouter.get("/logout", logout);

globalRouter.get("/me", isVerifiedEmail, me);

globalRouter.get("/me/update", isVerifiedEmail, meUpdate);
globalRouter.post(
    "/me/update",
    isVerifiedEmail,
    s3MulterUpload.single("avatar"),
    meUpdatePost
);

globalRouter.route("/join").get(join).post(joinPost);

globalRouter.route("/login").get(login).post(loginPost);

export default globalRouter;
