/* =========================
   지원계획 목록 조회
========================= */
// survey_no 기준으로 지원계획 목록 조회
// files 테이블은 1:N 관계라서 GROUP_CONCAT으로 파일명을 한 줄로 묶음
const planList = `
SELECT sp.support_plan_no as support_plan_no
      ,sp.plan_title as title
      ,sp.plan_content as content
      ,sp.plan_approval as approval
      ,cc.code_name as approval_name
      ,sp.plan_reason_rejection as rejection_reason
      ,GROUP_CONCAT(f.file_name ORDER BY f.file_no SEPARATOR ', ') as filename
      ,u.user_name as name
      ,DATE_FORMAT(sp.created_at, '%Y-%m-%d') as created_at
FROM support_plan sp
JOIN user u
  ON sp.writer_no = u.user_no
LEFT JOIN files f
  ON f.support_plan_no = sp.support_plan_no
LEFT JOIN common_code cc
  ON sp.plan_approval = cc.common_id
WHERE sp.survey_no = ?
GROUP BY sp.support_plan_no
        ,sp.plan_title
        ,sp.plan_content
        ,sp.plan_approval
        ,cc.code_name
        ,sp.plan_reason_rejection
        ,u.user_name
        ,sp.created_at
ORDER BY sp.support_plan_no DESC
`;

/* =========================
   survey 기준 대상자 조회
========================= */
// survey_no로 beneficiaries_no를 찾을 때 사용
const findBeneficiaryNoBySurvey = `
SELECT beneficiaries_no
FROM survey_input
WHERE survey_no = ?
`;

/* =========================
   지원계획 등록
========================= */
// 담당자가 승인요청하면 기본 상태는 a0(검토중)
const insertPlan = `
INSERT INTO support_plan (
    survey_no,
    beneficiaries_no,
    plan_title,
    plan_content,
    writer_no,
    plan_approval,
    created_at
) VALUES (?, ?, ?, ?, ?, 'a0', NOW())
`;

/* =========================
   임시저장 관련 SQL
========================= */
// 현재 survey_no + writer_no 기준으로 임시저장 목록 조회
const planRecordList = `
SELECT support_plan_no_record
      ,record_title
      ,record_content
      ,DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as created_at
FROM plan_record
WHERE survey_no = ?
  AND writer_no = ?
ORDER BY created_at DESC
`;

// 임시저장 1건 상세 조회
const planRecordOne = `
SELECT support_plan_no_record
      ,survey_no
      ,beneficiaries_no
      ,writer_no
      ,record_title
      ,record_content
      ,DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as created_at
FROM plan_record
WHERE support_plan_no_record = ?
`;

// 임시저장 신규 등록
const insertPlanRecord = `
INSERT INTO plan_record (
    survey_no,
    beneficiaries_no,
    writer_no,
    record_title,
    record_content,
    created_at
) VALUES (?, ?, ?, ?, ?, NOW())
`;

// 임시저장 수정
const updatePlanRecord = `
UPDATE plan_record
SET record_title = ?
   ,record_content = ?
WHERE support_plan_no_record = ?
  AND writer_no = ?
`;

// 임시저장 삭제
const deletePlanRecord = `
DELETE FROM plan_record
WHERE support_plan_no_record = ?
  AND writer_no = ?
`;

/* =========================
   첨부파일 저장 관련 SQL
========================= */
// 지원계획 등록/수정 시 새 파일을 files 테이블에 저장
const insertPlanFile = `
INSERT INTO files (
    support_plan_no,
    file_name,
    file_path,
    file_size,
    uploaded_at
) VALUES (?, ?, ?, ?, NOW())
`;

/* =========================
   지원계획 첨부파일 조회 관련 SQL
========================= */
// 특정 지원계획에 연결된 첨부파일 전체 조회
const selectPlanFilesByPlanNo = `
SELECT file_no
      ,file_name
      ,file_path
      ,file_size
      ,DATE_FORMAT(uploaded_at, '%Y-%m-%d %H:%i') as uploaded_at
FROM files
WHERE support_plan_no = ?
ORDER BY file_no ASC
`;

// file_no 기준으로 첨부파일 1건 조회
const selectPlanFileByNo = `
SELECT file_no
      ,file_name
      ,file_path
      ,file_size
FROM files
WHERE file_no = ?
`;

/* =========================
   지원계획 수정/삭제 관련 SQL
========================= */
// 수정 버튼 클릭 시 입력폼에 채울 상세 데이터 조회
// 검토중(a0)인 본인 계획서만 수정 가능하도록 조건을 둠
const selectPlanByNo = `
SELECT support_plan_no
      ,survey_no
      ,beneficiaries_no
      ,plan_title
      ,plan_content
      ,writer_no
      ,plan_approval
      ,DATE_FORMAT(created_at, '%Y-%m-%d') as created_at
FROM support_plan
WHERE support_plan_no = ?
  AND writer_no = ?
  AND plan_approval = 'a0'
`;

// 검토중(a0)인 본인 계획서만 본문 수정
const updatePlan = `
UPDATE support_plan
SET plan_title = ?
   ,plan_content = ?
WHERE support_plan_no = ?
  AND writer_no = ?
  AND plan_approval = 'a0'
`;

// 검토중(a0)인 본인 계획서만 삭제
const deletePlan = `
DELETE FROM support_plan
WHERE support_plan_no = ?
  AND writer_no = ?
  AND plan_approval = 'a0'
`;

// 수정 화면에서 기존 첨부파일 개별 삭제
const deletePlanFileByNo = `
DELETE FROM files
WHERE file_no = ?
  AND support_plan_no = ?
`;

// 계획서 삭제 전에 연결된 첨부파일 전체 삭제
const deletePlanFilesByPlanNo = `
DELETE FROM files
WHERE support_plan_no = ?
`;
/* =========================
   기관관리자 지원계획 승인/반려 관련 SQL
========================= */
// 관리자 화면에서 전체 지원계획 목록 조회
// survey_no 기준으로 전체를 보고 싶을 때 사용
const adminPlanList = `
SELECT sp.support_plan_no as support_plan_no
      ,sp.survey_no as survey_no
      ,sp.plan_title as title
      ,sp.plan_content as content
      ,sp.plan_approval as approval
      ,cc.code_name as approval_name
      ,sp.plan_reason_rejection as rejection_reason
      ,GROUP_CONCAT(f.file_name ORDER BY f.file_no SEPARATOR ', ') as filename
      ,u.user_name as name
      ,DATE_FORMAT(sp.created_at, '%Y-%m-%d') as created_at
FROM support_plan sp
JOIN user u
  ON sp.writer_no = u.user_no
LEFT JOIN files f
  ON f.support_plan_no = sp.support_plan_no
LEFT JOIN common_code cc
  ON sp.plan_approval = cc.common_id
WHERE sp.survey_no = ?
GROUP BY sp.support_plan_no
        ,sp.survey_no
        ,sp.plan_title
        ,sp.plan_content
        ,sp.plan_approval
        ,cc.code_name
        ,sp.plan_reason_rejection
        ,u.user_name
        ,sp.created_at
ORDER BY sp.support_plan_no DESC
`;

// 관리자 승인 처리
const approvePlan = `
UPDATE support_plan
SET plan_approval = 'a1'
   ,plan_approval_date = NOW()
   ,plan_reason_rejection = NULL
WHERE support_plan_no = ?
  AND plan_approval = 'a0'
`;

// 관리자 반려 처리
const rejectPlan = `
UPDATE support_plan
SET plan_approval = 'a2'
   ,plan_approval_date = NOW()
   ,plan_reason_rejection = ?
WHERE support_plan_no = ?
  AND plan_approval = 'a0'
`;

module.exports = {
  planList,
  findBeneficiaryNoBySurvey,
  insertPlan,
  planRecordList,
  planRecordOne,
  insertPlanRecord,
  updatePlanRecord,
  deletePlanRecord,
  insertPlanFile,
  selectPlanFilesByPlanNo,
  selectPlanFileByNo,
  selectPlanByNo,
  updatePlan,
  deletePlan,
  deletePlanFileByNo,
  deletePlanFilesByPlanNo,
  adminPlanList,
  approvePlan,
  rejectPlan,
};
