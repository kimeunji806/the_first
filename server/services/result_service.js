const dao = require("../database/DAO");
const sql = require("../database/sql/result");

/* =========================
   승인된 지원계획 목록 조회
========================= */
// 결과서를 작성할 수 있는 대상은 승인된(a1) 지원계획서만
const getApprovedPlanListForResult = async (surveyNo) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();
    const rows = await conn.query(sql.approvedPlanListForResult, [surveyNo]);
    return rows ?? [];
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   결과서 목록 조회
========================= */
// 특정 지원계획서에 연결된 결과서 목록 조회
const getResultListByPlanNo = async (supportPlanNo) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();
    const rows = await conn.query(sql.resultListByPlanNo, [supportPlanNo]);
    return rows ?? [];
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   결과서 등록(승인요청 + 파일 저장)
========================= */
// 결과서 저장 후 첨부파일이 있으면 files 테이블에도 같이 저장
const addResult = async ({
  support_plan_no,
  result_title,
  result_content,
  writer_no,
  finish,
  files = [],
}) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();
    await conn.beginTransaction();

    // support_plan_no로 beneficiaries_no 조회
    const planRows = await conn.query(sql.findBeneficiaryNoByPlan, [
      support_plan_no,
    ]);

    if (!planRows.length) {
      throw new Error("해당 지원계획 정보를 찾을 수 없습니다.");
    }

    const beneficiaries_no = planRows[0].beneficiaries_no;

    // 결과서 저장
    const resultInsert = await conn.query(sql.insertResult, [
      support_plan_no,
      writer_no,
      result_title,
      result_content,
      beneficiaries_no,
      finish,
    ]);

    const support_result_no = resultInsert.insertId;

    if (!support_result_no) {
      throw new Error("지원결과 저장 후 번호를 가져오지 못했습니다.");
    }

    // 첨부파일 저장
    if (files && files.length > 0) {
      for (const file of files) {
        await conn.query(sql.insertResultFile, [
          support_result_no,
          file.filename,
          file.path,
          file.size,
        ]);
      }
    }

    await conn.commit();

    return {
      support_result_no,
      file_count: files.length,
    };
  } catch (err) {
    if (conn) await conn.rollback();
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   결과서 임시저장 목록 조회
========================= */
// 특정 지원계획서 + 작성자 기준으로 임시저장 목록 조회
const getResultRecordList = async (supportPlanNo, writerNo) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();
    const rows = await conn.query(sql.resultRecordList, [
      supportPlanNo,
      writerNo,
    ]);
    return rows ?? [];
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   결과서 임시저장 1건 조회
========================= */
// 임시저장 1건 상세 조회
const getResultRecord = async (recordNo) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();
    const rows = await conn.query(sql.resultRecordOne, [recordNo]);
    return rows[0] ?? null;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   결과서 임시저장 신규 등록
========================= */
// result_record에 신규 임시저장
const saveResultRecord = async ({
  support_plan_no,
  record_title,
  record_content,
  writer_no,
}) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();

    const result = await conn.query(sql.insertResultRecord, [
      support_plan_no,
      writer_no,
      record_title,
      record_content,
    ]);

    return result;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   결과서 임시저장 수정
========================= */
// 이미 저장된 임시저장 수정
const editResultRecord = async ({
  record_no,
  record_title,
  record_content,
  writer_no,
}) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();

    const result = await conn.query(sql.updateResultRecord, [
      record_title,
      record_content,
      record_no,
      writer_no,
    ]);

    return result;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   결과서 임시저장 삭제
========================= */
// 임시저장 1건 삭제
const removeResultRecord = async ({ record_no, writer_no }) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();

    const result = await conn.query(sql.deleteResultRecord, [
      record_no,
      writer_no,
    ]);

    return result;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   결과서 첨부파일 목록 조회
========================= */
// support_result_no 기준으로 첨부파일 목록 조회
const getResultFiles = async (supportResultNo) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();
    const rows = await conn.query(sql.selectResultFilesByResultNo, [
      supportResultNo,
    ]);
    return rows ?? [];
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   결과서 첨부파일 1건 조회
========================= */
// file_no 기준으로 파일 1건 조회
const getResultFileByNo = async (fileNo) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();
    const rows = await conn.query(sql.selectResultFileByNo, [fileNo]);
    return rows[0] ?? null;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   결과서 상세 1건 조회
========================= */
// 수정 버튼 클릭 시 입력폼에 채울 데이터 조회
// 검토중(a0)인 본인 결과서만 조회 가능
const getResultByNo = async (supportResultNo, writerNo) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();

    const rows = await conn.query(sql.selectResultByNo, [
      supportResultNo,
      writerNo,
    ]);

    if (!rows.length) {
      return null;
    }

    const result = rows[0];

    // 기존 첨부파일 목록도 같이 반환
    const fileRows = await conn.query(sql.selectResultFilesByResultNo, [
      supportResultNo,
    ]);

    return {
      ...result,
      files: fileRows ?? [],
    };
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   결과서 수정
========================= */
// 검토중(a0)인 본인 결과서만 수정 가능
// 제목/내용/종결여부 수정 + 기존 파일 삭제 + 새 파일 추가
const editResult = async ({
  support_result_no,
  writer_no,
  result_title,
  result_content,
  finish,
  delete_file_nos = [],
  new_files = [],
}) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();
    await conn.beginTransaction();

    // 1. 본문 및 종결여부 수정
    const updateResult = await conn.query(sql.updateResult, [
      result_title,
      result_content,
      finish,
      support_result_no,
      writer_no,
    ]);

    if (!updateResult.affectedRows) {
      throw new Error(
        "수정 가능한 지원결과가 없거나 이미 처리된 결과서입니다.",
      );
    }

    // 2. 삭제할 기존 첨부파일 처리
    if (delete_file_nos && delete_file_nos.length > 0) {
      for (const fileNo of delete_file_nos) {
        await conn.query(sql.deleteResultFileByNo, [fileNo, support_result_no]);
      }
    }

    // 3. 새 첨부파일 추가
    if (new_files && new_files.length > 0) {
      for (const file of new_files) {
        await conn.query(sql.insertResultFile, [
          support_result_no,
          file.filename,
          file.path,
          file.size,
        ]);
      }
    }

    await conn.commit();

    return {
      support_result_no,
      deleted_file_count: delete_file_nos.length,
      added_file_count: new_files.length,
    };
  } catch (err) {
    if (conn) await conn.rollback();
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   결과서 삭제
========================= */
// 검토중(a0)인 본인 결과서만 삭제
// 삭제 전 연결된 첨부파일도 함께 삭제
const removeResult = async ({ support_result_no, writer_no }) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();
    await conn.beginTransaction();

    // 1. 연결된 첨부파일 전체 삭제
    await conn.query(sql.deleteResultFilesByResultNo, [support_result_no]);

    // 2. 결과서 삭제
    const deleteResult = await conn.query(sql.deleteResult, [
      support_result_no,
      writer_no,
    ]);

    if (!deleteResult.affectedRows) {
      throw new Error(
        "삭제 가능한 지원결과가 없거나 이미 처리된 결과서입니다.",
      );
    }

    await conn.commit();

    return deleteResult;
  } catch (err) {
    if (conn) await conn.rollback();
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   기관관리자 결과서 목록 조회
========================= */
// 특정 지원계획서 기준으로 관리자 화면용 결과서 전체 조회
const getAdminResultListByPlanNo = async (supportPlanNo) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();
    const rows = await conn.query(sql.adminResultListByPlanNo, [supportPlanNo]);
    return rows ?? [];
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   기관관리자 결과서 승인
========================= */
// 검토중(a0)인 결과서만 승인 처리
const approveSupportResult = async (supportResultNo) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();

    const result = await conn.query(sql.approveResult, [supportResultNo]);

    if (!result.affectedRows) {
      throw new Error(
        "승인 가능한 지원결과가 없거나 이미 처리된 결과서입니다.",
      );
    }

    return result;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/* =========================
   기관관리자 결과서 반려
========================= */
// 검토중(a0)인 결과서만 반려 처리
// 반려사유는 필수로 받음
const rejectSupportResult = async ({ support_result_no, rejection_reason }) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();

    const result = await conn.query(sql.rejectResult, [
      rejection_reason,
      support_result_no,
    ]);

    if (!result.affectedRows) {
      throw new Error(
        "반려 가능한 지원결과가 없거나 이미 처리된 결과서입니다.",
      );
    }

    return result;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};
/* =========================
   결과서 전체 목록 조회
========================= */
// 현재 survey_no에 속한 결과서 전체 조회
const getResultListBySurveyNo = async (surveyNo) => {
  let conn;
  try {
    conn = await dao.pool.getConnection();
    const rows = await conn.query(sql.resultListBySurveyNo, [surveyNo]);
    return rows ?? [];
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getApprovedPlanListForResult,
  getResultListByPlanNo,
  addResult,
  getResultRecordList,
  getResultRecord,
  saveResultRecord,
  editResultRecord,
  removeResultRecord,
  getResultFiles,
  getResultFileByNo,
  getResultByNo,
  editResult,
  removeResult,
  getAdminResultListByPlanNo,
  approveSupportResult,
  rejectSupportResult,
  getResultListBySurveyNo,
};
