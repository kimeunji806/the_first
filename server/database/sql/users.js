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

module.exports = { selectAllUser, insertUser, signApproval };
