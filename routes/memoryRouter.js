import express from "express";
import multer from "multer";
import { isCreator, thumbnailMulter } from "../middleware.js";
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

memoryRouter.get("/", home);

memoryRouter.get("/upload", upload);

memoryRouter.post("/upload", thumbnailMulter.single("thumbnail"), uploadPost);

memoryRouter.get("/:id", detail);

memoryRouter.get("/:id/update", isCreator, renderUpdate);
memoryRouter.post("/:id/update", isCreator, thumbnailMulter.single("thumbnail"), update);
memoryRouter.get("/:id/delete", isCreator, remove);

export default memoryRouter;
