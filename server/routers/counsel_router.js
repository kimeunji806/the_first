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
  let { surNo, beneNo, userNo, title, content, date, files } = req.body;
  let file = req.files;
  console.log(file)
  let result = await counselService.counselInsertService(surNo , beneNo, userNo,title, content , date,  file);
  res.send(result);
});


module.exports = router;
