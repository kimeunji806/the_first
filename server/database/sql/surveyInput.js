const { pool } = require("../DAO");

// 신청할 사용자 선택 -> 조사지 답변 -> 확인

// 보호자에대한 지원대상자 SLECET
const beneficiariesList = `
SELECT b.beneficiaries_name as beneficiaries_name
		,b.beneficiaries_no as beneficiaries_no
FROM beneficiaries b
LEFT JOIN user g 
    ON b.guardian_no = g.user_no
WHERE b.guardian_no = ?;
`;

// -> 지원대상자에대한 정보 불러오기 SELECT
const beneficiariesInfo = `
SELECT beneficiaries_name
		, disability_type
    ,DATE_FORMAT(birth, '%Y-%m-%d') as birth
    , gender
FROM beneficiaries 
WHERE beneficiaries_no = ?;
`;

const surveyQuestion = `
SELECT 
    m.main_no AS main_no,
    m.main_title AS main_title,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'sub_no', s.sub_no,
            'sub_title', s.sub_title,
            'questions', q.questions
        )
    ) AS subs
FROM survey_main m
JOIN survey_sub s ON s.main_no = m.main_no
LEFT JOIN (
    SELECT sub_no, JSON_ARRAYAGG(JSON_OBJECT(
        'question_no', question_no,
        'question_text', question_text,
        'answer', NULL
    )) AS questions
    FROM survey_question
    GROUP BY sub_no
) q ON q.sub_no = s.sub_no
GROUP BY m.main_no, m.main_title;
`;

// -> 새조사지생성 INSERT

const createSurvey = `
INSERT INTO survey_input(version_no,beneficiaries_no)
VALUES (1,?);
`;

// -> 조사지 답변 저장 INSERT

const createSurveyInput = `
INSERT INTO survey_answer(survey_no,question_no,choice_value )
 VALUES (?, ?, ?);
`;

const survey_QA = `
SELECT 
    m.main_no AS main_no,
    m.main_title AS main_title,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'sub_no', s.sub_no,
            'sub_title', s.sub_title,
            'questions', q.questions
        )
    ) AS subs
FROM survey_main m
JOIN survey_sub s ON s.main_no = m.main_no
LEFT JOIN (
    SELECT sub_no, JSON_ARRAYAGG(JSON_OBJECT(
        'question_no', q.question_no,
        'question_text', q.question_text,
        'answer_name', c.code_name
    )) AS questions
    FROM survey_question q
    JOIN survey_answer a ON a.question_no = q.question_no
    LEFT JOIN common_code c
      ON c.group_id = 'surveyValue'
     AND c.common_id = a.choice_value
     WHERE a.survey_no = ?
    GROUP BY sub_no
) q ON q.sub_no = s.sub_no
GROUP BY m.main_no, m.main_title;
`;

module.exports = {
  beneficiariesList,
  beneficiariesInfo,
  createSurvey,
  createSurveyInput,
  surveyQuestion,
  survey_QA,
};
