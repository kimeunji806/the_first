const { pool } = require("../DAO");

// 기관정보 조회
const selectAllInstitution = `
SELECT institution_no,
       name,
       institution_tel,
       institution_address,
       institution_email,
       tel,
       operation
FROM institution
ORDER BY institution_no
`;

// 기관정보 수정
const updateInstitution = `
UPDATE institution
SET ?
WHERE institution_no = ?`;

module.exports = { selectAllInstitution, updateInstitution };
