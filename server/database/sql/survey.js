const { pool } = require("../DAO");

const main = `
SELECT main_title, main_no
FROM survey_main;
`;

const sub = `
SELECT sub_title, sub_no
FROM survey_sub
WHERE main_no = ?;
`;

const question = `
SELECT question_no, question_text, sub_no
FROM survey_question
WHERE sub_no = ?;
`;

module.exports = { main, sub, question };
