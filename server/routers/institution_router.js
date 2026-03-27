const express = require("express");
const router = express.Router();

const institutionService = require("../services/institution_service");

// 기관정보 조회
router.get("/admin/institutioninfo/:institution_no", async (req, res) => {
  try {
    let institutionNo = req.params.institution_no;
    let result = await institutionService.findAll(institutionNo);
    res.json(result || {});
  } catch (err) {
    console.log(err);
  }
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
