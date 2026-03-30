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
  try {
    conn = await pool.getConnection();
    let [result] = await conn.query(userSql.insertUser, userInfo);

    return result;
  } catch (err) {
    if (conn) await conn.rollback();
  }

  try {
    conn = await pool.getConnection();
    let result2 = await conn.query(userSql.signApproval, userInfo[2]);

    return result2;
  } catch (err) {
    if (conn) await conn.rollback();
  }
};

const loginUser = async (userId, userPw) => {
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

const approval = async (insNo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(userSql.approval, [insNo]);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

const access = async (userId) => {
  let conn = null;
  const user = userId.userId;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    let result = await conn.query(userSql.access, [user]);
    await conn.query(userSql.signAccess, [user]);
    conn.commit();
    return result;
  } catch (err) {
    if (conn) await conn.rollback();
  } finally {
    if (conn) conn.release();
  }
};



const signX = async (userId) => {
  let conn = null;
  const user = userId.userId;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    let result = await conn.query(userSql.signRefuse, [user]);
    await conn.query(userSql.signRefuse2, [user]);
    conn.commit();
    return result;
  } catch (err) {
    if (conn) await conn.rollback();
  } finally {
    if (conn) conn.release();
  }
};


const insTel = async (no) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [result] = await conn.query(userSql.instelSelect,[no]);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};



module.exports = { selectAllUser, insertUser, loginUser, approval, access, signX ,insTel};
