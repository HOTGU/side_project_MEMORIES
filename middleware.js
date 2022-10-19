import createError from "./utils/createError.js";
import Memory from "./model/Memory.js";
import multer from "multer";

export const uploadMulter = multer({ dest: "uploads/" });

export const resLocalsMiddleware = (req, res, next) => {
    res.locals.isLogin = Boolean(req.session.isLogin);
    res.locals.user = req.session.user || {};
    res.locals.siteName = "Memories";
    req.user = req.session.user || {};
    next();
};

export const isCreator = async (req, res, next) => {
    const {
        params: { id },
    } = req;
    try {
        const memory = await Memory.findById(id);
        if (req.user._id !== String(memory.creator)) {
            next(createError(403, "주인이 아닙니다"));
        }
        req.memory = memory;
        next();
    } catch (error) {
        next(error);
    }
};
