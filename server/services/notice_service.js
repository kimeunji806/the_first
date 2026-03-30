const noticeMapper = require("../database/mappers/notice.mapper");
const { pool } = require("../database/DAO");

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
    console.log("noticeData:", noticeData);
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const { user_no, institution_no, notice_title, notice_content } =
      noticeData;

    // notice_no 생성
    const [rows] = await conn.query(
      "SELECT IFNULL(MAX(notice_no), 0) AS maxNo FROM notice",
    );
    const notice_no = rows.maxNo + 1;

    // 공지사항 등록 (매퍼 함수 호출)
    await noticeMapper.insertNotice(conn, {
      notice_no, // 생성한 번호 전달
      user_no,
      institution_no,
      notice_title,
      notice_content,
    });

    // 첨부파일 등록
    if (files && files.length > 0) {
      for (const file of files) {
        // conn.execute 대신 매퍼의 함수를 직접 실행
        await noticeMapper.insertNoticeFile(conn, {
          notice_no: notice_no, // 위에서 생성한 번호 사용
          file_name: file.originalname,
          file_path: file.path,
          file_size: file.size,
        });
      }
    }

    await conn.commit();
    return notice_no;
  } catch (err) {
    console.log(err);
    if (conn) await conn.rollback();
  } finally {
    if (conn) conn.release();
  }
};

// 첨부파일 다운로드
const findFileByNo = async (fileNo) => {
  const file = await noticeMapper.selectFileByFileNo(fileNo);
  return file;
};

// 공지사항 수정
const modifyInfo = async (noticeInfo) => {
  let result = await noticeMapper.updateNotice(noticeInfo);

  let resObj = {
    status: result.changedRows > 0 || result.affectedRows > 0,
    target: {
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
  findFileByNo,
};
