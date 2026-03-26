const { pool } = require("../DAO");

const list = `
SELECT b.beneficiaries_name as beneficiaries_name
		,b.beneficiaries_no as beneficiaries_no
        ,u.user_no as manager_no
        ,g.user_name as guardian_name
        ,DATE_FORMAT(s.created_at, '%Y-%m-%d') as created_at
        ,p.priority_id as priority_id
        ,u.user_name as manager_name
        ,s.survey_no as survey_no
FROM survey_input s
JOIN user u ON s.manager_no = u.user_no
JOIN beneficiaries b ON b.beneficiaries_no = s.beneficiaries_no
LEFT JOIN user g 
    ON b.guardian_no = g.user_no
LEFT JOIN priority p ON s.survey_no = p.survey_no
WHERE s.manager_no || s.sub_manager_no = ?;
`;

const beneficiaries = `
SELECT b.beneficiaries_name as beneficiaries_name
        ,g.user_name as guardian_name
        ,p.priority_id as priority_id
        ,b.gender as gender
        ,DATE_FORMAT(b.birth, '%Y-%m-%d')  as birth
        ,b.disability_type as disability_type
        ,b.beneficiaries_no as beneficiaries_no
FROM survey_input s
JOIN user u ON s.manager_no = u.user_no
JOIN beneficiaries b ON b.beneficiaries_no = s.beneficiaries_no
LEFT JOIN user g
    ON b.guardian_no = g.user_no
LEFT JOIN priority p ON s.survey_no = p.survey_no
WHERE s.survey_no = ?;
`;
module.exports = { list, beneficiaries };
