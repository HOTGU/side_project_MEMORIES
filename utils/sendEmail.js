import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

const sendMail = (email, verifyString) => {
    return transport.sendMail({
        to: email,
        subject: "hello world",
        html: `<h1>아래링크를 눌러줘야 이메일인증이 완료됩니다</h1><a href="http://localhost:5000/verify?key=${verifyString}">
                http://localhost:5000/verify?key=${verifyString}</a>`,
    });
};

export default sendMail;
