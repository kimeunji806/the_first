const { pool } = require("../DAO");

const mInfo = `
SELECT user_id
      ,u.user_name as name
      ,u.tel
      ,u.email
      ,u.address
      ,i.name as ins
      ,DATE_FORMAT(u.created_at, '%Y-%m-%d') as created_at
FROM user u JOIN institution i ON u.institution_no  = i.institution_no
WHERE u.institution_no = ? AND u.role = 'e2'
`;

module.exports = { mInfo };
