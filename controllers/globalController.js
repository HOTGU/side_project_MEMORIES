import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import User from "../model/User.js";
import createError from "../utils/createError.js";

export const home = (req, res) => {
    res.render("home", { title: "Home" });
};

export const join = (req, res) => {
    res.render("join", { title: "Join" });
};

export const joinPost = async (req, res, next) => {
    const {
        body: { name, email, password, password1 },
    } = req;
    try {
        if (password !== password1) {
            return next(createError(500, "비밀번호가 틀립니다"));
        }

        const existUser = await User.exists({ email });

        if (existUser) {
            return next(createError(500, "이메일로 가입된 유저가 있습니다"));
        }

        const hashedPassword = bcrypt.hashSync(password, +process.env.BCRYPT_SALT);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.render("home");
    } catch (error) {
        next(error);
    }
};

export const login = (req, res, next) => {
    res.render("login");
};

export const loginPost = async (req, res, next) => {
    const {
        body: { email, password: bodyPassword },
    } = req;
    try {
        const user = await User.findOne({ email });
        if (!user) return next(createError(400, "이메일로 가입된 유저가 없습니다"));

        const checkPassword = bcrypt.compareSync(bodyPassword, user.password);
        if (!checkPassword) return next(createError(400, "비밀번호가 틀립니다"));

        const userInfo = { ...user._doc };

        const { password, ...otherInfo } = userInfo;

        req.session.user = otherInfo;
        req.session.isLogin = true;

        return res.redirect("/");
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
};
