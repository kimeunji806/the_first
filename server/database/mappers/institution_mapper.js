const { pool } = require("../DAO");
const institutionSql = require("../sql/institutions.js");

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

module.exports = { selectAllInstitution };
