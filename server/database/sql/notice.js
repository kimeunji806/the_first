const { pool } = require("../DAO");

// 공지사항 조회
const selectAllNotice = `
SELECT n.notice_no,
       n.notice_title,
       i.name,
       u.user_name,
       n.created_at
FROM notice n
LEFT JOIN user u ON n.user_no = u.user_no
LEFT JOIN institution i ON n.institution_no = i.institution_no
ORDER BY n.notice_no
`;

// 공지사항 상세조회
const selectNoticeByNo = `
SELECT n.notice_no,
       n.notice_title,
       n.notice_content,
       u.user_name,
       n.created_at
FROM notice n
LEFT JOIN user u ON n.user_no = u.user_no
WHERE notice_no = ?
`;

// 첨부파일 조회
const selectFilesByNoticeNo = `
SELECT f.file_no,
       f.file_name,
       f.file_path,
       f.file_size,
       f.uploaded_at
FROM files f
WHERE f.notice_no = ?
ORDER BY f.file_no
`;

// 공지사항 등록
const insertNotice = `
INSERT INTO notice (
institution_no,
user_no,
notice_title,
notice_content,
)
VALUES(?,?,?,?)
`;

// 첨부파일 등록
const insertFiles = `
INSERT INTO files(
notice_no,
file_name,
file_path
)
VALUES(?,?,?)
`;

// 공지사항 수정
const updateNotice = `
UPDATE notice
SET ?
WHERE notice_no = ?
`;

// 공지사항 삭제
const deleteNotice = `
DELETE FROM notice
WHERE notice_no = ?
`;

module.exports = {
  selectAllNotice,
  selectNoticeByNo,
  selectFilesByNoticeNo,
  insertNotice,
  insertFiles,
  updateNotice,
  deleteNotice,
};
