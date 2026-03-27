const express = require("express");
const router = express.Router();
const noticeService = require("../services/notice_service");
const upload = require("../upload");

// 공지사항 전체조회
router.get(`/notice/:institution_no`, async (req, res) => {
  const institutionNo = req.params.institution_no;
  const result = await noticeService.findAll(institutionNo);
  console.log("공지사항 result:", result, Array.isArray(result));
  return res.status(200).json(result);
});

// 공지사항 상세조회
router.get(`/notice/detail/:noticeNo`, async (req, res) => {
  try {
    const noticeNo = req.params.noticeNo;
    const result = await noticeService.findInfoByNo(noticeNo);
    res.json(result || {});
  } catch (err) {
    console.log(err);
  }
});

// 공지사항 등록
router.post(`/notice`, upload.array("files"), async (req, res) => {
  try {
    const { user_no, institution_no, notice_title, notice_content } = req.body;
    const file = req.files;

    const result = await noticeService.createInfo(
      user_no,
      institution_no,
      notice_title,
      notice_content,
    );
    files;
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

// 공지사항 수정
router.put(`/:noticeNo`, async (req, res) => {
  const noticeNo = req.params.no;
  const target = req.body;
  const result = await noticeService.modifyInfo(noticeNo, target);
  res.json(result);
});

// 공지사항 삭제
router.delete(`/:noticeNo`, async (req, res) => {
  try {
    const noticeNo = req.params.noticeNo;
    await noticeService.removeNotice(noticeNo);
    res.json();
  } catch (err) {
    console.log(err);
    res.status.json();
  }
});

module.exports = router;
