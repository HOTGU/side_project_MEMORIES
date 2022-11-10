import Memory from "../model/Memory.js";

export const upload = (req, res) => {
    return res.render("upload");
};

export const uploadPost = async (req, res, next) => {
    const {
        file: { location },
        body: { title, description },
        user,
    } = req;
    try {
        const memory = new Memory({
            thumbnail: location,
            title,
            description,
            creator: user._id,
        });
        await memory.save();
        req.flash("success", "업로드 성공😀😀");
        return res.redirect("/");
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
        req.flash("success", "업데이트 성공😀");
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
        req.flash("success", "삭제 성공😀");

        await Memory.findOneAndDelete(id);
        res.redirect("/");
    } catch (error) {
        next(error);
    }
};

export const search = async (req, res, next) => {
    const {
        query: { searchTerm },
    } = req;
    try {
        if (!searchTerm) {
            req.flash("error", "검색어가 없습니다");
            return res.redirect("/");
        }

        const searchedMemories = await Memory.find({
            title: { $regex: searchTerm },
        }).populate("creator");

        return res.render("home", {
            title: "Search",
            memories: searchedMemories,
            searchTerm,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
