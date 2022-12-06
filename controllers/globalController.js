import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import Memory from "../model/Memory.js";
import User from "../model/User.js";
import deletePassword from "../utils/deletePassword.js";
import sendMail from "../utils/sendEmail.js";

export const home = async (req, res) => {
    try {
        const memories = await Memory.find().populate("creator");
        return res.render("home", { title: "Home!", memories });
    } catch (error) {
        next(error);
    }
    res.render("home", { title: "Home" });
};

export const join = (req, res) => {
    res.render("join", { title: "Join" });
};

export const joinPost = async (req, res, next) => {
    const {
        body: { name, email, password: bodyPassword, password1 },
    } = req;
    try {
        if (bodyPassword !== password1) {
            req.flash("error", "비밀번호가 틀립니다");
            return res.redirect("/join");
        }

        const existUser = await User.exists({ email });

        if (existUser) {
            req.flash("error", "이메일로 가입된 유저가 있습니다");
            return res.redirect("/login");
        }

        const hashedPassword = bcrypt.hashSync(bodyPassword, +process.env.BCRYPT_SALT);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const noPwUser = deletePassword(newUser);
        req.session.user = noPwUser;
        req.flash("success", `회원가입 성공👋`);

        sendMail(email, newUser.emailVerifyString);

        res.redirect("/");
    } catch (error) {
        next(error);
    }
};

export const login = (req, res, next) => {
    res.render("login", { title: "Log in" });
};

export const loginPost = async (req, res, next) => {
    const {
        body: { email, password: bodyPassword },
    } = req;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            req.flash("error", "이메일로 가입된 유저가 없습니다");
            return res.redirect("/join");
        }

        const checkPassword = bcrypt.compareSync(bodyPassword, user.password);
        if (!checkPassword) {
            req.flash("error", "비밀번호가 틀립니다");
            return res.redirect("/login");
        }

        const noPwUser = deletePassword(user);

        req.session.user = noPwUser;

        req.flash("success", `안녕하세요👋 ${noPwUser.name}님`);

        return res.redirect("/");
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res, next) => {
    req.session.user = undefined;
    req.flash("success", "로그아웃 성공👋");
    return res.redirect("/");
};

export const me = (req, res, next) => {
    res.render("me", { title: "Me" });
};

export const meUpdate = (req, res, next) => {
    res.render("meUpdate", { title: "Update" });
};

export const meUpdatePost = async (req, res, next) => {
    const {
        user,
        body: { name },
        file,
    } = req;
    try {
        const updateUser = await User.findByIdAndUpdate(
            user._id,
            {
                name,
                avatar: file?.location,
            },
            { new: true }
        );

        const noPwUser = deletePassword(updateUser);
        req.session.user = noPwUser;

        return res.redirect("/me");
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    const {
        query: { key },
        user,
    } = req;
    try {
        const findUser = await User.findById(user._id);

        if (findUser.emailVerifyString === key) {
            findUser.emailVerify = true;
            await findUser.save();

            const noPwUser = deletePassword(findUser);
            req.session.user = noPwUser;
            req.flash("success", `${findUser.name}님의 이메일 인증 성공👋`);
            return res.redirect("/");
        } else {
            req.flash("error", "잘못된접근입니다");
            return res.redirect("/");
        }
    } catch (error) {
        next(error);
    }
};
