const { pool } = require("../DAO");
const surveySql = require("../sql/survey");

const main = async (mainNo) => {
  console.log(mainNo);

  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(surveySql.main, [mainNo]);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

const sub = async (subNo) => {
  console.log(subNo);

  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(surveySql.sub, [subNo]);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

const question = async (questionNo) => {
  console.log(questionNo);

  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(surveySql.question, [questionNo]);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// 등록
const insertMain = async (mainInfo) => {
  // userInfo는 배열, {user_id, user_pwd, user_name, user_gender, user_age, join_data}
  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(surveySql.insertMain, mainInfo);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

const insertSub = async (subInfo) => {
  // userInfo는 배열, {user_id, user_pwd, user_name, user_gender, user_age, join_data}
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [result] = await conn.query(surveySql.insertSub, subInfo);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

const insertQuestion = async (questionInfo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [result] = await conn.query(surveySql.insertQuestion, questionInfo);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// 수정
const updateMain = async (mainNo, updateDta) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); //Auto Commit 해제
    let result = await conn.query(surveySql.updateSub, [
      updateDta.main_title,
      mainNo,
    ]);
    // 추가 DML 실헹 => 같은 트렉잭션으로 묶임
    conn.commit();
    return result;
  } catch (err) {
    console.log(err);
    conn.rollback();
  } finally {
    if (conn) conn.release();
  }
};

const updateSub = async (subNo, updateDta) => {
  let conn = null;
  console.log(subNo, updateDta.sub_title);
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); //Auto Commit 해제
    let result = await conn.query(surveySql.updateSub, [
      updateDta.sub_title,
      subNo,
    ]);
    // 추가 DML 실헹 => 같은 트렉잭션으로 묶임
    conn.commit();
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    conn.rollback();
  } finally {
    if (conn) conn.release();
  }
};

const updateQuestion = async (questionNo, updateDta) => {
  let conn = null;
  console.log(questionNo);
  console.log(updateDta.question_text);
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); //Auto Commit 해제
    let result = await conn.query(surveySql.updateQuestion, [
      updateDta.question_text,
      questionNo,
    ]);
    // 추가 DML 실헹 => 같은 트렉잭션으로 묶임
    conn.commit();
    return result;
  } catch (err) {
    console.log(err);
    conn.rollback();
  } finally {
    if (conn) conn.release();
  }
};

// 삭제
const deleteMain = async (no) => {
  let conn = null;
  try {
    // connectionPool에서 대기중인 connection 반환
    conn = await pool.getConnection();
    let [result] = await conn.query(surveySql.deleteMain, no);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    // 사용이 끝난 connection를 pool에 돌려줌
    if (conn) conn.release();
  }
};

const deleteSub = async (no) => {
  let conn = null;
  try {
    // connectionPool에서 대기중인 connection 반환
    conn = await pool.getConnection();
    let [result] = await conn.query(surveySql.deleteSub, no);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    // 사용이 끝난 connection를 pool에 돌려줌
    if (conn) conn.release();
  }
};

const deleteQuestion = async (no) => {
  let conn = null;
  try {
    // connectionPool에서 대기중인 connection 반환
    conn = await pool.getConnection();
    let [result] = await conn.query(surveySql.deleteQuestion, no);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    // 사용이 끝난 connection를 pool에 돌려줌
    if (conn) conn.release();
  }
};

module.exports = {
  main,
  sub,
  question,
  insertMain,
  insertSub,
  insertQuestion,
  updateMain,
  updateSub,
  updateQuestion,
  deleteMain,
  deleteSub,
  deleteQuestion,
};
