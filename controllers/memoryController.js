import Memory from "../model/Memory.js";
import createError from "../utils/createError.js";

export const home = async (req, res, next) => {
    try {
        const memories = await Memory.find().populate("creator");
        return res.render("memory", { title: "Memory", memories });
    } catch (error) {
        next(error);
    }
};
export const upload = (req, res) => {
    console.log(req.memory);
    return res.render("upload");
};
export const uploadPost = async (req, res, next) => {
    const {
        file: { path },
        body: { title, description },
        user,
    } = req;
    try {
        const memory = new Memory({
            thumbnail: path,
            title,
            description,
            creator: user._id,
        });
        await memory.save();
        return res.redirect("/memory");
    } catch (error) {
        next(error);
    }
};

export const detail = async (req, res, next) => {
    const {
        params: { id },
    } = req;
    try {
        const memory = await Memory.findById(id).populate("creator");

        return res.render("detail", { title: memory.title, memory });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    const {
        params: { id },
        body: { title, description },
        file,
    } = req;
    try {
        await Memory.findByIdAndUpdate(
            id,
            {
                thumbnail: file?.path,
                title,
                description,
            },
            {
                new: true,
            }
        );
        return res.redirect(`/memory/${id}`);
    } catch (error) {
        next(error);
    }
};

export const renderUpdate = async (req, res, next) => {
    const {
        params: { id },
        memory,
    } = req;
    try {
        return res.render("update", { title: "update", memory });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    const {
        params: { id },
    } = req;
    try {
        await Memory.findOneAndDelete(id);
        res.redirect("/memory");
    } catch (error) {
        next(error);
    }
};
