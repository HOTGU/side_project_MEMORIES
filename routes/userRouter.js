import express from "express";
import { home } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", home);

export default userRouter;
