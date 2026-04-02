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

module.exports = router;
