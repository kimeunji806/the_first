const express = require("express");
const router = express.Router();
const noticeService = require("../services/notice_service");

// 공지사항 전체조회
router.get(`/notice`, async (req, res) => {
  const result = await noticeService.findAll();
  res.json(result);
});

// 공지사항 상세조회
router.get(`/notice/:no`, async (req, res) => {
  const target = req.params.no;
  const result = await noticeService.findInfoByNo(target);
  res.json(result);
});

// 공지사항 등록
router.post(`/notice`, async (req, res) => {
  const target = req.body;
  const result = await noticeService.createInfo(target);
  res.json(result);
});

// 공지사항 수정
router.put(`/notice/:no`, async (req, res) => {
  const noticeNo = req.params.no;
  const target = req.body;
  const result = await noticeService.modifyInfo(noticeNo, target);
  res.json(result);
});

// 공지사항 삭제
router.delete(`/notice/:no`, async (req, res) => {
  const noticeNo = req.params.no;
  const result = await noticeService.removeInfo(noticeNo);
  res.json(result);
});

module.exports = router;
