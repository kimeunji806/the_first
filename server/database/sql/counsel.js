const { pool } = require("../DAO");

const counselList = `
SELECT
        c.counsel_no AS no,
        c.counsel_title AS title,
        c.counsel_content AS content,
        IFNULL(GROUP_CONCAT(f.file_name), '') AS filename,
        DATE_FORMAT(c.counsel_date, '%Y-%m-%d') AS counseldate,
        u.user_name AS name,
        DATE_FORMAT(c.created_at, '%Y-%m-%d') AS created_at
FROM counsel c 
JOIN user u ON c.writer_no = u.user_no
LEFT JOIN files f ON f.counsel_no = c.counsel_no
WHERE c.survey_no = 2
GROUP BY c.counsel_no
ORDER BY  c.created_at DESC ,c.counsel_date DESC
`;


const counselInsertSql = `
INSERT INTO counsel
(survey_no , beneficiaries_no ,writer_no , counsel_title,counsel_content,counsel_date)
VALUES(?,?,?,?,?,?)
`;


const fileAdd = `
INSERT INTO files
(counsel_no,file_name,file_path,file_size)
values(?,?,?,?)
`


const counselUpdateSql = `
UPDATE counsel
SET counsel_title = ?  , counsel_content = ?
WHERE counsel_no = ?
`

const counselHistory = `
INSERT INTO counsel_history (counsel_no , history_writer,history_title,  history_content,role)
VALUES (?,?,?,?,?)
`

const counselHistorySelect = `
SELECT
        history_title AS title,
        history_content AS content,
        history_writer AS writer,
        cm.code_name AS role,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created_at
FROM counsel_history c JOIN common_code cm ON c.role = cm.common_id
WHERE counsel_no = ?
ORDER BY created_at DESC
`


const counselDeleteSql = `
DELETE FROM counsel
WHERE counsel_no = ?
`

module.exports = {counselList,counselInsertSql,fileAdd ,counselUpdateSql,counselHistorySelect,counselHistory,counselDeleteSql}