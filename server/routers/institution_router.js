const express = require("express");
const router = express.Router();

const institutionService = require("../services/institution_service");

// 기관정보 조회
router.get("/admin/institutioninfo", async (req, res) => {
  let result = await institutionService.findAll();
  res.json(result || {});
});

// 기관정보 수정
router.put("/admin/institutioninfo", async (req, res) => {
  try {
    let target = req.body;
    let result = await institutionService.modifyInfo(target);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
