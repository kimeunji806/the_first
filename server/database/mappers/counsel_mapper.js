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

const counselInsert = async (surNo , beneNo, userNo,title, content , date,  files) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
        let result = await conn.query(counselSql.counselAdd, [
      surNo,
      beneNo,
      userNo,
      title,
      content,
      date
    ]);

    const counselNo = result.insertId;

    if (files && files.length > 0) {
      for (let file of files) {
        await conn.query(counselSql.fileAdd, [counselNo,file.filename,file.path,file.size]);
      }
    }

    await conn.commit();
    return result;
  } catch (err) {
    if (conn) await conn.rollback();
  } finally {
    if (conn) conn.release();
  }
};




module.exports = {counsel,counselInsert}