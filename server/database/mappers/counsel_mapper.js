const { pool } = require("../DAO");
const counselSql = require("../sql/counsel");

const counsel = async (beneNo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(counselSql.counselList, [beneNo]);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {counsel}