const { pool } = require("../DAO");
const userSql = require("../sql/users");

const selectAllUser = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [result] = await conn.query(userSql.selectAllUser);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};


const loginUser = async (userId,userPw) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [result] = await conn.query(userSql.loginUser, [userId, userPw]);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

const approval = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(userSql.approval);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};


module.exports = { selectAllUser , loginUser ,approval};
