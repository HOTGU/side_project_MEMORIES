import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import User from "../model/User.js";
import createError from "../utils/createError.js";
import deletePassword from "../utils/deletePassword.js";
import transport from "../utils/sendEmail.js";

export const home = (req, res) => {
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
            return next(createError(500, "비밀번호가 틀립니다"));
        }

        const existUser = await User.exists({ email });

        if (existUser) {
            return next(createError(500, "이메일로 가입된 유저가 있습니다"));
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
        res.redirect("/");

        return transport.sendMail({
            to: email,
            subject: "hello world",
            html: `<h1>아래링크를 눌러줘야 이메일인증이 완료됩니다</h1><a href="http://localhost:5000/verify?key=${newUser.emailVerifyString}">
                http://localhost:5000/verify?key=${newUser.emailVerifyString}</a>`,
        });
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
    req.session.isLogin = false;
    req.flash("success", "로그아웃 성공👋");
    return res.redirect("/");
};

export const me = (req, res, next) => {
    res.render("me");
};

export const meUpdate = (req, res, next) => {
    res.render("meUpdate");
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
                avatar: file?.path,
            },
            { new: true }
        );

        const noPwUser = deletePassword(updateUser);
        req.user = noPwUser;

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
            console.log("string값이 틀립니다");
            return res.redirect("/");
        }
    } catch (error) {
        next(error);
    }
};
