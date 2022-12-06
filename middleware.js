import createError from "./utils/createError.js";
import Memory from "./model/Memory.js";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_S3_ACCESS,
    secretAccessKey: process.env.AWS_S3_SCERET,
    region: process.env.AWS_S3_REGION,
});

export const s3MulterUpload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_S3_BUCKET,
        acl: "public-read",
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now() + file.originalname);
        },
    }),
});

export const resLocalsMiddleware = (req, res, next) => {
    res.locals.isLogin = Boolean(req.session.isLogin);
    res.locals.user = req.session.user || undefined;
    res.locals.siteName = "Memories";
    res.locals.message = req.flash();
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

export const isVerifiedEmail = (req, res, next) => {
    const { user } = req;

    if (!user.emailVerify) {
        req.flash("error", "이메일인증이 안됐습니다");
        return res.redirect("/");
    }
    next();
};
