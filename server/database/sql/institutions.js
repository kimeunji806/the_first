const { pool } = require("../DAO");

const selectAllInstitution = `
SELECT institution_no,
       name,
       institution_tel,
       institution_address,
       institution_email,
       tel,
       operation,
       created_at
FROM institution
ORDER BY institution_no
`;

module.exports = { selectAllInstitution };
