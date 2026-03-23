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

const insertUser = async (userInfo) => {
  let conn = null;
  console.log(`값 ${userInfo[2]}`);
  try {
    conn = await pool.getConnection();
    let [result] = await conn.query(userSql.insertUser, userInfo);

    console.log(`쿼리 ${result2}`);

    return result;
  } catch (err) {
    if (conn) await conn.rollback();

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

  try {
    conn = await pool.getConnection();

    let result2 = await conn.query(userSql.signApproval, userInfo[2]);

    return result2;
  } catch (err) {
    if (conn) await conn.rollback();
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


module.exports = { selectAllUser , insertUser,loginUser ,approval};
