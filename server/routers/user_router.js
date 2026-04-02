const express = require("express");
const router = express.Router();

const userService = require("../services/user_service");

router.get("/users", async (req, res) => {
  let result = await userService.findAll();
  res.send(result);
});

router.post("/users", async (req, res) => {
  let target = req.body;
  let result = await userService.createUser(target);
  res.send(result);
});

router.post("/login", async (req, res) => {
  const { user_id, user_pw } = req.body;
  let result = await userService.loginService(user_id, user_pw);
  res.send(result);
});

router.get("/approval/:no", async (req, res) => {
  let insNo = req.params.no;
  let result = await userService.approvalAccess(insNo);
  res.send(result);
});

router.put("/access", async (req, res) => {
  const userId = req.body;
  let result = await userService.signAccess(userId);
  if (result.affectedRows === 1) {
    res.send({ update: "success" });
  }
  res.send({ update: "fail" });
});

router.delete("/access/refuse", async (req, res) => {
  const userId = req.body;
  let result = await userService.signRefuseService(userId);
  console.log(result);
  if (result.affectedRows === 1) {
    res.send({ update: "success" });
  }
  res.send({ update: "fail" });
});

router.get("/institution/:no", async (req, res) => {
  const no = req.params.no;
  let result = await userService.insTelService(no);
  res.send(result);
});

// 아이디 찾기
router.post("/user/find-id", async (req, res) => {
  try {
    const { email } = req.body;

    const result = await userService.findUserIdByEmail(email);

    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

// 비밀번호 찾기
router.post("/user/check-user", async (req, res) => {
  try {
    const { user_id, email } = req.body;

    const result = await userService.findUserByIdAndEmail(user_id, email);

    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

// 비밀번호 변경
router.put("/userpw/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const target = req.body;

    const result = await userService.resetUserPassword(userId, target);

    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

// 회원탈퇴
router.post("/withdraw", async (req, res) => {
  try {
    const { email } = req.body;

    // 로그인 여부 체크
    if (!req.session.user) {
      return res.status(401).json({
        retCode: false,
        message: "로그인이 필요합니다.",
      });
    }

    const loginUserEmail = req.session.user.email;

    if (!email) {
      return res.status(400).json({
        retCode: false,
        message: "이메일이 없습니다.",
      });
    }

    // 입력 이메일과 로그인 사용자 이메일 비교
    if (email !== loginUserEmail) {
      return res.status(403).json({
        retCode: false,
        message: "본인 이메일이 아닙니다.",
      });
    }

    const result = await userService.withdrawUser(email);

    if (result) {
      // 탈퇴 성공 시 세션 삭제
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            retCode: false,
            message: "세션 종료 중 오류가 발생했습니다.",
          });
        }

        res.clearCookie("connect.sid");
        return res.json({
          retCode: true,
          message: "회원탈퇴가 완료되었습니다.",
        });
      });
    } else {
      res.status(400).json({
        retCode: false,
        message: "회원정보를 찾을 수 없습니다.",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
