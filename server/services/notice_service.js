const noticeMapper = require("../database/mappers/notice.mapper");

// 공지사항 조회
const findAll = async (institutionNo) => {
  const list = await noticeMapper.selectAllNotice(institutionNo);
  return list || [];
};

// 공지사항 상세조회
const findInfoByNo = async (noticeNo) => {
  const notice = await noticeMapper.selectNoticeByNo(noticeNo);
  const files = await noticeMapper.selectFilesByNoticeNo(noticeNo);
  return { ...notice, files };
};

// 공지사항 등록
const createInfo = async (noticeData, files) => {
  let conn = null;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 공지사항 등록
    const noticeNo = await noticeMapper.insertNotice(conn, noticeData);

    // 첨부파일 등록
    if (files && files.length > 0) {
      for (const file of files) {
        await noticeMapper.insertNoticeFile(conn, {
          notice_no: noticeNo,
          file_name: file.originalname,
          file_path: file.path,
          file_size: file.size,
        });
      }
    }
    await conn.commit();
    return noticeNo;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
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

module.exports = {
  findAll,
  findInfoByNo,
  createInfo,
  modifyInfo,
  removeInfo,
  createInfo,
};
