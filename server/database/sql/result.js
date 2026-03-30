/* =========================
   승인된 지원계획 목록 조회
========================= */
// 결과서를 작성할 수 있는 대상은 승인된(a1) 지원계획서만
// survey_no 기준으로 승인된 계획서 목록 조회
const approvedPlanListForResult = `
SELECT sp.support_plan_no
      ,sp.survey_no
      ,sp.plan_title
      ,sp.plan_content
      ,u.user_name as writer_name
      ,DATE_FORMAT(sp.created_at, '%Y-%m-%d') as created_at
FROM support_plan sp
JOIN user u
  ON sp.writer_no = u.user_no
WHERE sp.survey_no = ?
  AND sp.plan_approval = 'a1'
ORDER BY sp.support_plan_no DESC
`;

/* =========================
   지원결과 목록 조회
========================= */
// 특정 지원계획서에 연결된 결과서 목록 조회
const resultListByPlanNo = `
SELECT spr.support_result_no
      ,spr.support_plan_no
      ,spr.result_title as title
      ,spr.result_content as content
      ,spr.result_approval as approval
      ,cc.code_name as approval_name
      ,spr.result_reason_rejection as rejection_reason
      ,spr.finish as finish
      ,GROUP_CONCAT(f.file_name ORDER BY f.file_no SEPARATOR ', ') as filename
      ,u.user_name as name
      ,DATE_FORMAT(spr.created_at, '%Y-%m-%d') as created_at
FROM support_plan_result spr
JOIN user u
  ON spr.writer_no = u.user_no
LEFT JOIN files f
  ON f.support_result_no = spr.support_result_no
LEFT JOIN common_code cc
  ON spr.result_approval = cc.common_id
WHERE spr.support_plan_no = ?
GROUP BY spr.support_result_no
        ,spr.support_plan_no
        ,spr.result_title
        ,spr.result_content
        ,spr.result_approval
        ,cc.code_name
        ,spr.result_reason_rejection
        ,spr.finish
        ,u.user_name
        ,spr.created_at
ORDER BY spr.support_result_no DESC
`;

/* =========================
   지원결과 등록 전 대상자 조회
========================= */
// support_plan_no로 beneficiaries_no 조회
const findBeneficiaryNoByPlan = `
SELECT beneficiaries_no
FROM support_plan
WHERE support_plan_no = ?
`;

/* =========================
   지원결과 등록
========================= */
// 담당자가 결과서 승인요청하면 기본 상태는 a0(검토중)
const insertResult = `
INSERT INTO support_plan_result (
    support_plan_no,
    writer_no,
    result_title,
    result_content,
    beneficiaries_no,
    result_approval,
    finish,
    created_at
) VALUES (?, ?, ?, ?, ?, 'a0', ?, NOW())
`;

/* =========================
   지원결과 임시저장 관련 SQL
========================= */
// 특정 지원계획서 + 작성자 기준 임시저장 목록 조회
const resultRecordList = `
SELECT support_result_no_record
      ,support_plan_no
      ,record_title
      ,record_content
      ,DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as created_at
FROM result_record
WHERE support_plan_no = ?
  AND writer_no = ?
ORDER BY created_at DESC
`;

// 임시저장 1건 상세 조회
const resultRecordOne = `
SELECT support_result_no_record
      ,support_plan_no
      ,writer_no
      ,record_title
      ,record_content
      ,DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as created_at
FROM result_record
WHERE support_result_no_record = ?
`;

// 임시저장 신규 등록
const insertResultRecord = `
INSERT INTO result_record (
    support_plan_no,
    writer_no,
    record_title,
    record_content,
    created_at
) VALUES (?, ?, ?, ?, NOW())
`;

// 임시저장 수정
const updateResultRecord = `
UPDATE result_record
SET record_title = ?
   ,record_content = ?
WHERE support_result_no_record = ?
  AND writer_no = ?
`;

// 임시저장 삭제
const deleteResultRecord = `
DELETE FROM result_record
WHERE support_result_no_record = ?
  AND writer_no = ?
`;

/* =========================
   첨부파일 저장 관련 SQL
========================= */
// 결과서 등록/수정 시 새 파일을 files 테이블에 저장
const insertResultFile = `
INSERT INTO files (
    support_result_no,
    file_name,
    file_path,
    file_size,
    uploaded_at
) VALUES (?, ?, ?, ?, NOW())
`;

/* =========================
   지원결과 첨부파일 조회 관련 SQL
========================= */
// 특정 결과서에 연결된 첨부파일 전체 조회
const selectResultFilesByResultNo = `
SELECT file_no
      ,file_name
      ,file_path
      ,file_size
      ,DATE_FORMAT(uploaded_at, '%Y-%m-%d %H:%i') as uploaded_at
FROM files
WHERE support_result_no = ?
ORDER BY file_no ASC
`;

// file_no 기준으로 첨부파일 1건 조회
const selectResultFileByNo = `
SELECT file_no
      ,file_name
      ,file_path
      ,file_size
FROM files
WHERE file_no = ?
`;

/* =========================
   지원결과 수정/삭제 관련 SQL
========================= */
// 수정 버튼 클릭 시 입력폼에 채울 상세 데이터 조회
// 검토중(a0)인 본인 결과서만 수정 가능
const selectResultByNo = `
SELECT support_result_no
      ,support_plan_no
      ,writer_no
      ,result_title
      ,result_content
      ,beneficiaries_no
      ,result_approval
      ,finish
      ,DATE_FORMAT(created_at, '%Y-%m-%d') as created_at
FROM support_plan_result
WHERE support_result_no = ?
  AND writer_no = ?
  AND result_approval = 'a0'
`;

// 검토중(a0)인 본인 결과서만 본문 수정
const updateResult = `
UPDATE support_plan_result
SET result_title = ?
   ,result_content = ?
   ,finish = ?
WHERE support_result_no = ?
  AND writer_no = ?
  AND result_approval = 'a0'
`;

// 검토중(a0)인 본인 결과서만 삭제
const deleteResult = `
DELETE FROM support_plan_result
WHERE support_result_no = ?
  AND writer_no = ?
  AND result_approval = 'a0'
`;

// 수정 화면에서 기존 첨부파일 개별 삭제
const deleteResultFileByNo = `
DELETE FROM files
WHERE file_no = ?
  AND support_result_no = ?
`;

// 결과서 삭제 전에 연결된 첨부파일 전체 삭제
const deleteResultFilesByResultNo = `
DELETE FROM files
WHERE support_result_no = ?
`;

/* =========================
   기관관리자 지원결과 승인/반려 관련 SQL
========================= */
// 관리자 화면에서 특정 지원계획서 기준 결과서 전체 조회
const adminResultListByPlanNo = `
SELECT spr.support_result_no
      ,spr.support_plan_no
      ,spr.result_title as title
      ,spr.result_content as content
      ,spr.result_approval as approval
      ,cc.code_name as approval_name
      ,spr.result_reason_rejection as rejection_reason
      ,spr.finish as finish
      ,GROUP_CONCAT(f.file_name ORDER BY f.file_no SEPARATOR ', ') as filename
      ,u.user_name as name
      ,DATE_FORMAT(spr.created_at, '%Y-%m-%d') as created_at
FROM support_plan_result spr
JOIN user u
  ON spr.writer_no = u.user_no
LEFT JOIN files f
  ON f.support_result_no = spr.support_result_no
LEFT JOIN common_code cc
  ON spr.result_approval = cc.common_id
WHERE spr.support_plan_no = ?
GROUP BY spr.support_result_no
        ,spr.support_plan_no
        ,spr.result_title
        ,spr.result_content
        ,spr.result_approval
        ,cc.code_name
        ,spr.result_reason_rejection
        ,spr.finish
        ,u.user_name
        ,spr.created_at
ORDER BY spr.support_result_no DESC
`;

// 관리자 승인 처리
const approveResult = `
UPDATE support_plan_result
SET result_approval = 'a1'
   ,result_approval_date = NOW()
   ,result_reason_rejection = NULL
WHERE support_result_no = ?
  AND result_approval = 'a0'
`;

// 관리자 반려 처리
const rejectResult = `
UPDATE support_plan_result
SET result_approval = 'a2'
   ,result_approval_date = NOW()
   ,result_reason_rejection = ?
WHERE support_result_no = ?
  AND result_approval = 'a0'
`;
/* =========================
   지원결과 전체 목록 조회
========================= */
// 현재 survey_no에 속한 모든 결과서 조회
// 왼쪽 조회창에서 검토중/승인/반려 전체를 보여줄 때 사용
const resultListBySurveyNo = `
SELECT spr.support_result_no
      ,spr.support_plan_no
      ,spr.result_title as title
      ,spr.result_content as content
      ,spr.result_approval as approval
      ,cc.code_name as approval_name
      ,spr.result_reason_rejection as rejection_reason
      ,spr.finish as finish
      ,GROUP_CONCAT(f.file_name ORDER BY f.file_no SEPARATOR ', ') as filename
      ,u.user_name as name
      ,DATE_FORMAT(spr.created_at, '%Y-%m-%d') as created_at
FROM support_plan_result spr
JOIN support_plan sp
  ON spr.support_plan_no = sp.support_plan_no
JOIN user u
  ON spr.writer_no = u.user_no
LEFT JOIN files f
  ON f.support_result_no = spr.support_result_no
LEFT JOIN common_code cc
  ON spr.result_approval = cc.common_id
WHERE sp.survey_no = ?
GROUP BY spr.support_result_no
        ,spr.support_plan_no
        ,spr.result_title
        ,spr.result_content
        ,spr.result_approval
        ,cc.code_name
        ,spr.result_reason_rejection
        ,spr.finish
        ,u.user_name
        ,spr.created_at
ORDER BY spr.support_result_no DESC
`;
module.exports = {
  approvedPlanListForResult,
  resultListByPlanNo,
  findBeneficiaryNoByPlan,
  insertResult,
  resultRecordList,
  resultRecordOne,
  insertResultRecord,
  updateResultRecord,
  deleteResultRecord,
  insertResultFile,
  selectResultFilesByResultNo,
  selectResultFileByNo,
  selectResultByNo,
  updateResult,
  deleteResult,
  deleteResultFileByNo,
  deleteResultFilesByResultNo,
  adminResultListByPlanNo,
  approveResult,
  rejectResult,
  resultListBySurveyNo,
};
