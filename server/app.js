require("dotenv").config({ path: "./database/dbConfig.env" });
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const port = 3000;

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

// 기능별 라우터 모듈 등록
const userRouter = require("./routers/user_router.js");
app.use("/", userRouter);
const institutionRouter = require("./routers/institution_router.js");
app.use("/", institutionRouter);
const mypageRouter = require("./routers/mypage_router"); //마이페이지 지원대상자
app.use("/api/mypage", mypageRouter);
const institutionMyPageRouter = require("./routers/institution_mypage_router"); //마이페이지 기관담당자
app.use("/institutionmypage", institutionMyPageRouter);
