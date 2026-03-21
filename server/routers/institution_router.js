const express = require("express");
const router = express.Router();

const institutionService = require("../services/institution_service");

router.get("/institutions", async (req, res) => {
  let result = await institutionService.findAll();
  res.send(result);
});

module.exports = router;
