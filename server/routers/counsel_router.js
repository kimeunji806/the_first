const express = require("express");
const router = express.Router();

const counselService = require("../services/counsel_service");
const upload = require('../upload');


router.get("/counsel/:no", async (req, res) => {
  let surNo = req.params.no
  let result = await counselService.counselInfoService(surNo);
  res.send(result);
});


router.post("/counselUpload", upload.array('file'), async (req, res) => {
  let {selectNo , beneNo, userNo,title, content , date,  files } = req.body;
  console.log({ date, title, content });
  console.log(surNo);
  console.log(files);
  let result = await counselService.counselInsertService(selectNo , beneNo, userNo,title, content , date,  files);
  res.send(result);
});


module.exports = router;
