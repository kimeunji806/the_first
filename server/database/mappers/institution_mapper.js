const { pool } = require("../DAO");
const institutionSql = require("../sql/institutions.js");

// 기관정보 조회
const selectAllInstitution = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [rows] = await conn.execute(institutionSql.selectAllInstitution);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// 기관정보 수정
const updateInstitution = async (updateData) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // Auto Commit 해제
    let [result] = await conn.query(institutionSql.updateInstitution, [
      updateData,
    ]);
    conn.commit();
    return result;
  } catch (err) {
    console.log(err);
    conn.rollback();
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { selectAllInstitution, updateInstitution };
