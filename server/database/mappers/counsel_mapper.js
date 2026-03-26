const { pool } = require("../DAO");
const counselSql = require("../sql/counsel");

const counsel = async (surNo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(counselSql.counselList, [surNo]);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

const counselInsert = async (selectNo , beneNo, userNo,title, content , date,  files) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(counselSql.counselAdd, [selectNo , beneNo, userNo,title, content , date]);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};




module.exports = {counsel,counselInsert}