import Memory from "../model/Memory.js";
import User from "../model/User.js";

export const detail = async (req, res, next) => {
    const {
        params: { id },
    } = req;
    try {
        const user = await User.findById(id);
        const memories = await Memory.find({ creator: user });
        res.render("userDetail", { user, memories });
    } catch (error) {
        next(error);
    }
};
