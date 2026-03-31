const { pool } = require("../DAO");

const list = `
SELECT b.beneficiaries_name AS beneficiaries_name
     , b.beneficiaries_no AS beneficiaries_no
     , u.user_no AS manager_no
     , h.user_no AS sub_manager_no
     , g.user_name AS guardian_name
     , DATE_FORMAT(s.created_at, '%Y-%m-%d') AS created_at
     , p.priority_id AS priority_id
     , c.code_name AS priority_name
     , u.user_name AS manager_name
     , s.survey_no AS survey_no
FROM survey_input s
LEFT JOIN user u ON s.manager_no = u.user_no
JOIN beneficiaries b ON b.beneficiaries_no = s.beneficiaries_no
LEFT JOIN user g ON b.guardian_no = g.user_no
LEFT JOIN user h ON s.sub_manager_no = h.user_no
LEFT JOIN priority p ON s.survey_no = p.survey_no
LEFT JOIN common_code c
      ON c.group_id = 'priority'
     AND c.common_id = p.priority_id
JOIN user me ON me.user_no = ?
WHERE (
       me.role = 'e3'
    OR (me.role = 'e1' AND b.guardian_no = me.user_no)
    OR (me.role = 'e2' AND me.user_no IN (s.manager_no, s.sub_manager_no))
);
`;

const beneficiaries = `
SELECT b.beneficiaries_name as beneficiaries_name
        ,g.user_name as guardian_name
        ,p.priority_id as priority_id
        , cc.code_name AS priority_name
        ,b.gender as gender
        ,c.code_name as gender_name
        ,DATE_FORMAT(b.birth, '%Y-%m-%d')  as birth
        ,b.disability_type as disability_type
        ,b.beneficiaries_no as beneficiaries_no
        ,s.manager_no as manager_no
        ,s.sub_manager_no as sub_manager_no
        ,u.user_name as sub_manager_name
        ,h.user_name as manager_name
        ,s.survey_no as survey_no
        ,b.institution_no as institution_no
FROM survey_input s
LEFT JOIN user u ON s.manager_no = u.user_no
LEFT JOIN user h ON s.sub_manager_no = h.user_no
JOIN beneficiaries b ON b.beneficiaries_no = s.beneficiaries_no
LEFT JOIN user g
    ON b.guardian_no = g.user_no
LEFT JOIN priority p ON s.survey_no = p.survey_no
LEFT JOIN common_code c
      ON c.group_id = 'gender'
     AND c.common_id = b.gender
LEFT JOIN common_code cc
      ON cc.group_id = 'priority'
     AND cc.common_id = p.priority_id
WHERE s.survey_no = ?;
`;

module.exports = { list, beneficiaries };
