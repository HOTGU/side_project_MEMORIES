import express from "express";
import { isCreator, isVerifiedEmail, thumbnailMulter } from "../middleware.js";
import {
    detail,
    remove,
    renderUpdate,
    search,
    update,
    upload,
    uploadPost,
} from "../controllers/memoryController.js";

const memoryRouter = express.Router();

memoryRouter.get("/upload", isVerifiedEmail, upload);

memoryRouter.get("/search", isVerifiedEmail, search);

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
