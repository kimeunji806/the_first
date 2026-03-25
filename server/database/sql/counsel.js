const { pool } = require("../DAO");

const counselList = `
SELECT c.counsel_title as title
        ,c.counsel_content as content
        ,f.file_name as filename
        ,DATE_FORMAT(c.counsel_date, '%Y-%m-%d') as counseldate
        ,u.user_name as name
        ,DATE_FORMAT(c.created_at, '%Y-%m-%d') as created_at
FROM counsel c JOIN user u ON c.writer_no = u.user_no
              JOIN files f ON f.counsel_no = c.counsel_no
WHERE c.beneficiaries_no = ?
`

module.exports = {counselList}