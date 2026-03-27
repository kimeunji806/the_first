const { pool } = require("../DAO");
const noticeSql = require("../sql/notice");

// 공지사항 조회
const selectAllNotice = async (institutionNo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.execute(noticeSql.selectAllNotice, [institutionNo]);
    return rows || [];
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
    const rows = await conn.query(noticeSql.selectNoticeByNo, [no]);
    return rows && rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// 공지사항 첨부파일 조회
const selectFilesByNoticeNo = async (no) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(noticeSql.selectFilesByNoticeNo, [no]);
    return rows || [];
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// 공지사항 등록
const insertNotice = async (conn, noticeData) => {
  const { user_no, institution_no, notice_title, notice_content } = noticeData;

  const result = await conn.execute(noticeSql, insertNotice, [
    user_no,
    institution_no,
    notice_title,
    notice_content,
  ]);
  return result.insertId;
};

// 첨부파일 등록
const insertNoticeFile = async (conn, fileData) => {
  const { notice_no, file_name, file_path, file_size } = fileData;

  const result = await conn.execute(noticeSql.insertNoticeFile, [
    notice_no,
    file_name,
    file_path,
    file_size,
  ]);

  return result;
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
  selectFilesByNoticeNo,
  insertNoticeFile,
};
