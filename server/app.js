require("dotenv").config({ path: "./database/dbConfig.env" });
const express = require("express");
const cors = require("cors");
const app = express();
const nodemailer = require("./nodemailer");
app.use(cors());
const port = 3000;
const codeStore = require("./codeStore");

// 미들웨어 등록 영역
// body parser
// content-type : application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// content-type : application/json
app.use(express.json());

// Server 실행
app.listen(port, () => {
  console.log("Server Start");
  console.log(`http://localhost:${port}`);
});

// 라우팅 등록 영역
// - 기본 라우팅
app.get("/", (req, res) => {
  res.send("Welcome!!");
});

app.post("/mail", async (req, res) => {
  const { email } = req.body;
  console.log(email);

  const result = await nodemailer.sendEmail(email);

  console.log(result);
  if (result.messageId) {
    res.json({ retCode: "OK" });
  } else {
    res.json({ retCode: "NG" });
  }
});

app.post("/verify", (req, res) => {
  const { user_email, code } = req.body;
  try {
    const data = codeStore.get(user_email);
    console.log(data.code);
    console.log(code);

    if (!data) throw new Error("요청없음");

    console.log("현재시간:", Date.now());
    console.log("만료시간:", data.expiresAt);
    if (Date.now() > data.expiresAt) {
      codeStore.delete(user_email);
      throw new Error("만료됨");
    }

    if (data.code !== code) {
      throw new Error("틀림");
    }
    res.json({ retCode: true });

    codeStore.delete(user_email);
  } catch (err) {
    res.status(400).json({
      retCode: false,
      message: err.message,
    });
  }
});

// 기능별 라우터 모듈 등록
const userRouter = require("./routers/user_router.js");
app.use("/", userRouter);
const institutionRouter = require("./routers/institution_router.js");
app.use("/", institutionRouter);
const mypageRouter = require("./routers/mypage_router"); //마이페이지 지원대상자
app.use("/api/mypage", mypageRouter);
const institutionMyPageRouter = require("./routers/institution_mypage_router"); //마이페이지 기관담당자
app.use("/institutionmypage", institutionMyPageRouter);
const infoRouter = require("./routers/info_router");
app.use("/", infoRouter);
const counselRouter = require("./routers/counsel_router");
app.use("/", counselRouter);
const managerAssignRouter = require("./routers/manager_assign_router"); // 기관담당자 지정
app.use("/managerAssign", managerAssignRouter);
const noticeRouter = require("./routers/notice_router.js"); // 공지사항
app.use("/", noticeRouter);
const adminMyPageRouter = require("./routers/admin_mypage_router"); //마이페이지 기관관리자
app.use("/admin/mypage", adminMyPageRouter);
const listRouter = require("./routers/list_router");
app.use("/", listRouter);

const surveyRouter = require("./routers/survey_router");
app.use("/", surveyRouter);
const planRouter = require("./routers/plan_router"); // 지원계획
app.use("/plan", planRouter);
const resultRouter = require("./routers/result_router"); // 지원결과
app.use("/result", resultRouter);

const surveyInputRouter = require("./routers/surveyInput_router");
app.use("/", surveyInputRouter);
const fileRouter = require("./routers/file_router");
app.use("/", fileRouter);

const priorityRouter = require("./routers/priority_router");
app.use("/", priorityRouter);
