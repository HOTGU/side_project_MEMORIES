import express from "express";
import multer from "multer";
import { isCreator, isVerifiedEmail, thumbnailMulter } from "../middleware.js";
import {
    detail,
    home,
    remove,
    renderUpdate,
    update,
    upload,
    uploadPost,
} from "../controllers/memoryController.js";

const memoryRouter = express.Router();

memoryRouter.get("/", isVerifiedEmail, home);

memoryRouter.get("/upload", isVerifiedEmail, upload);

memoryRouter.post(
    "/upload",
    isVerifiedEmail,
    thumbnailMulter.single("thumbnail"),
    uploadPost
);

memoryRouter.get("/:id", isVerifiedEmail, detail);

memoryRouter.get("/:id/update", isVerifiedEmail, isCreator, renderUpdate);
memoryRouter.post(
    "/:id/update",
    isVerifiedEmail,
    isCreator,
    thumbnailMulter.single("thumbnail"),
    update
);
memoryRouter.get("/:id/delete", isVerifiedEmail, isCreator, remove);

export default memoryRouter;
