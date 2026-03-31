const { pool } = require("../DAO");

const selectAllUser = `
SELECT * FROM t_board;
`;

const insertUser = `
INSERT INTO user (role, user_name, user_id, user_pw, email, tel, address, institution_no)
VALUES(?,?, ?, ?, ?, ?, ?,?)
`;

const signApproval = `
INSERT INTO sign_approval (user_id)
VALUES(?)

`;

const loginUser = `
SELECT user_no,
        role,
        user_id,
        user_name,
        approval,
        institution_no
FROM user
WHERE user_id = ? AND user_pw = ?
`;

const approval = `
SELECT 
        sa.approval_no as no,
        u.user_name as name,
        u.user_id as id,
        i.name as ins,
        u.tel,
        u.email,
        DATE_FORMAT(u.created_at, '%Y-%m-%d') as created_at
FROM user u
JOIN sign_approval sa ON u.user_id = sa.user_id
JOIN institution i ON u.institution_no = i.institution_no
WHERE sa.approval = 0 AND u.institution_no = ?
`;

const access = `
UPDATE user
SET approval = 1
WHERE user_id = ?
`;

const signAccess = `
UPDATE sign_approval
SET approval = 1
WHERE user_id = ?
`;

const signRefuse = `
DELETE FROM sign_approval
WHERE user_id = ?
`

const signRefuse2 = `
DELETE FROM user
WHERE user_id = ?
`


const instelSelect = `
SELECT tel
FROM institution
WHERE institution_no = ?
`

module.exports = {
        selectAllUser,
        loginUser,
        approval,
        insertUser,
        signApproval,
        access,
        signAccess,
        signRefuse,
        signRefuse2,
        instelSelect
};
