const noticeMapper = require("../database/mappers/notice.mapper");

// 공지사항 조회
const findAll = async () => {
  let list = await noticeMapper.selectAllNotice();
  return list;
};

// 공지사항 상세조회
const findInfoByNo = async (noticeNo) => {
  let info = await noticeMapper.selectNoticeByNo(noticeNo);
  return info;
};

// 공지사항 등록(재확인 필요)
const createInfo = async (noticeObj) => {
  const { institution_no, user_no, notice_title, notice_content } = noticeObj;
  let insertData = [institution_no, user_no, notice_title, notice_content];
  let result = await noticeMapper.insertNotice(insertData);
  let resObj = {
    status: result.insertId > 0 ? "success" : "fail",
    notice_no: result.insertId,
  };
  return resObj;
};

// 공지사항 수정(재확인 필요)
const modifyInfo = async (noticeMapper, noticeInfo) => {
  let result = await noticeMapper.updateNotice(noticeInfo, noticeInfo);

  let resObj = {
    status: result.changedRows > 0 || result.affectedRows > 0,
    target: {
      notice_no: noticeInfo,
      ...noticeInfo,
    },
  };
  return resObj;
};

// 공지사항 삭제
const removeInfo = async (noticeNo) => {
  let result = await noticeMapper.deleteNotice(noticeNo);
  let resObj = {
    status: result.affectedRows > 0,
    notice_no: noticeNo,
  };
  return resObj;
};

module.exports = { findAll, findInfoByNo, createInfo, modifyInfo, removeInfo };
