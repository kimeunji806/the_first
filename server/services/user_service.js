const userMapper = require("../database/mappers/user_mapper");
const jwt = require("jsonwebtoken");

const findAll = async () => {
  let list = await userMapper.selectAllUser();
  return list;
};

const loginService = async (id,pw) =>{
  let result = await userMapper.loginUser(id, pw);
  // console.log(result);
  if (result.length == 0) {
    return null;
  }
  // const match = await bcrypt.compare(password, user.password);
  // if (!match) {
  //   return null;
  // }
  return result;
}

const approvalAccess = async () => {
  let result = await userMapper.approval();
  return result;
}

module.exports = { findAll , loginService  ,approvalAccess};
