const express = require("express");
const router = express.Router();

const counselService = require("../services/counsel_service");



router.get("/counsel/:no", async (req, res) => {
  let beneNo = req.params.no
  let result = await counselService.counselInfoService(beneNo);
  console.log(result);
  res.send(result);
});

module.exports = router;
