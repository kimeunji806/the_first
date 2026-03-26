const { pool } = require("../DAO");
const noticeSql = require("../sql/notice");

// 공지사항 조회
const selectAllNotice = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [rows] = await conn.execute(noticeSql.selectAllNotice);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// 공지사항 상세조회
const selectNoticeByNo = async (no) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [result] = await conn.query(noticeSql.selectNoticeByNo, no);
    let info = result[0];
    return info;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// 공지사항 등록
const insertNotice = async (noticeInfo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [result] = await conn.query(noticeSql.insertNotice, noticeInfo);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// 공지사항 수정
const updateNotice = async (notice) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // Auto Commit 해제

    const { notice_no, ...updateData } = notice;

    const result = await conn.query(noticeSql.updateNotice, [
      updateData,
      notice_no,
    ]);

    await conn.commit();

    return result;
  } catch (err) {
    console.log(err);
    if (conn) await conn.rollback();
  } finally {
    if (conn) conn.release();
  }
};

//공지사항 삭제
const deleteNotice = async (noticeNo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [result] = await conn.query(noticeSql.deleteNotice, noticeNo);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  selectAllNotice,
  updateNotice,
  selectNoticeByNo,
  insertNotice,
  deleteNotice,
};
