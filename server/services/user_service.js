const userMapper = require("../database/mappers/user_mapper");

const findAll = async () => {
  let list = await userMapper.selectAllUser();
  return list;
};

const createUser = async (userObj) => {
  const {
    role,
    user_name,
    user_id,
    user_pwd,
    user_email,
    tel,
    address,
    institution,
  } = userObj;

  let insertData = [
    role,
    user_name,
    user_id,
    user_pwd,
    user_email,
    tel,
    address,
    institution,
  ];
  let result = await userMapper.insertUser(insertData);

  // let resObj = {
  //   status: result.insertId > 0 ? "success" : "fail",
  //   user_no: result.insertId,
  // };
  // return resObj;
};
module.exports = { findAll, createUser };
