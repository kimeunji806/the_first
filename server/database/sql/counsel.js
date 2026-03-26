const { pool } = require("../DAO");

const counselList = `
SELECT
        c.counsel_title AS title,
        c.counsel_content AS content,
        GROUP_CONCAT(f.file_name) AS filename,
        DATE_FORMAT(c.counsel_date, '%Y-%m-%d') AS counseldate,
        u.user_name AS name,
        DATE_FORMAT(c.created_at, '%Y-%m-%d') AS created_at
FROM counsel c 
JOIN user u ON c.writer_no = u.user_no
JOIN files f ON f.counsel_no = c.counsel_no
WHERE c.survey_no = ?
GROUP BY c.counsel_no;
`;


const counselAdd = `
INSERT INTO counsel
(survey_no , beneficiaries_no ,writer_no , counsel_title,counsel_content,counsel_date)
VALUES(?,?,?,?,?,?)
`;


const fileAdd = `
INSERT INTO files
(counsel_no,file_name,file_path,file_size)
values(?,?,?,?)
`

module.exports = {counselList,counselAdd,fileAdd}