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

router.get("/approval", async (req, res) => {
  let result = await userService.approvalAccess();
  res.send(result);
})


module.exports = router;
