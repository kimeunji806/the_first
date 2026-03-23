const nodemailer = require("nodemailer");
const generateRandomNumber = (n) => {
  let code = "";
  for (let i = 0; i < n; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "thdwl525@g.yju.ac.kr",
    pass: "hbwwafryvfubodzy",
  },
});

const sendEmail = (email, code) => {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "회원가입 인증 코드",
    text: `회원가입인증 코드는 ${code}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
  return code;
};

module.exports = { generateRandomNumber, sendEmail };
