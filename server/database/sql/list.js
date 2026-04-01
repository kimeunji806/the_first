const { pool } = require("../DAO");

const list = `
SELECT MAX(b.beneficiaries_name) AS beneficiaries_name
     , MAX(b.beneficiaries_no) AS beneficiaries_no
     , MAX(u.user_no) AS manager_no
     , MAX(h.user_no) AS sub_manager_no
     , MAX(g.user_name) AS guardian_name
     , MAX(DATE_FORMAT(s.created_at, '%Y-%m-%d')) AS created_at
     , MAX(p.priority_id) AS priority_id
     , MAX(c.code_name) AS priority_name
     , MAX(u.user_name) AS manager_name
     , s.survey_no AS survey_no

     /* e2, e3용 */
     , MAX(COALESCE(r.review_cnt, 0)) AS review_cnt
     , MAX(COALESCE(r.approve_cnt, 0)) AS approve_cnt
     , MAX(COALESCE(r.reject_cnt, 0)) AS reject_cnt
     , MAX(COALESCE(r.result_cnt, 0)) AS result_cnt
     , MAX(COALESCE(r.finish_cnt, 0)) AS finish_cnt

     /* e1용 진행중 */
     , MAX(
         CASE
           WHEN COALESCE(r.finish_cnt, 0) > 0 THEN 0
           ELSE GREATEST(
                  COALESCE(r.plan_approve_cnt, 0) - COALESCE(r.result_approve_cnt, 0),
                  0
                )
         END
       ) AS progress_cnt

     /* e1용 결과 */
     , MAX(
         CASE
           WHEN COALESCE(r.finish_cnt, 0) > 0 THEN 0
           ELSE COALESCE(r.result_approve_cnt, 0)
         END
       ) AS e1_result_cnt

FROM survey_input s
LEFT JOIN user u
       ON s.manager_no = u.user_no
JOIN beneficiaries b
     ON b.beneficiaries_no = s.beneficiaries_no
LEFT JOIN user g
       ON b.guardian_no = g.user_no
LEFT JOIN user h
       ON s.sub_manager_no = h.user_no
LEFT JOIN priority p
       ON s.survey_no = p.survey_no
LEFT JOIN common_code c
       ON c.group_id = 'priority'
      AND c.common_id = p.priority_id

LEFT JOIN (
    SELECT sp.survey_no

         /* 검토 = 대기 */
         , SUM(
             CASE
               WHEN spr.finish = 0 AND spr.result_approval = 'a0' THEN 1
               ELSE 0
             END
           ) AS review_cnt

         /* 승인 */
         , SUM(
             CASE
               WHEN spr.finish = 0 AND spr.result_approval = 'a1' THEN 1
               ELSE 0
             END
           ) AS approve_cnt

         /* 반려 */
         , SUM(
             CASE
               WHEN spr.finish = 0 AND spr.result_approval = 'a2' THEN 1
               ELSE 0
             END
           ) AS reject_cnt

         /* e2, e3용 결과 */
         , SUM(
             CASE
               WHEN spr.finish = 0 AND spr.result_approval = 'a1' THEN 1
               ELSE 0
             END
           ) AS result_cnt

         /* e1용 진행중 계산용: 승인된 계획 */
         , SUM(
             CASE
               WHEN sp.plan_approval = 'a1' THEN 1
               ELSE 0
             END
           ) AS plan_approve_cnt

         /* e1용 결과 계산용: 승인된 결과 */
         , SUM(
             CASE
               WHEN spr.result_approval = 'a1' THEN 1
               ELSE 0
             END
           ) AS result_approve_cnt

         /* 종결 */
         , SUM(
             CASE
               WHEN spr.finish = 1 THEN 1
               ELSE 0
             END
           ) AS finish_cnt

    FROM support_plan sp
    LEFT JOIN support_plan_result spr
           ON sp.support_plan_no = spr.support_plan_no
    GROUP BY sp.survey_no
) r
       ON r.survey_no = s.survey_no

JOIN user me
  ON me.user_no = ?

WHERE (
       me.role = 'e3'
    OR (me.role = 'e1' AND b.guardian_no = me.user_no)
    OR (me.role = 'e2' AND me.user_no IN (s.manager_no, s.sub_manager_no))
)

GROUP BY s.survey_no;
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
