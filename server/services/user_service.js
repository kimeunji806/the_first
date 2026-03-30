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
  return result;
};

const loginService = async (id, pw) => {
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
};

const approvalAccess = async (insNo) => {
  let result = await userMapper.approval(insNo);
  return result;
};

const signAccess = async (userId) => {
  let result = await userMapper.access(userId);
  return result;
};

const signRefuseService = async (userId) => {
  let result = await userMapper.signX(userId);
  return result;
}

const insTelService = async (no) => {
  let result = await userMapper.insTel(no);
  return result;
}


module.exports = {
  findAll,
  loginService,
  createUser,
  approvalAccess,
  signAccess,
  signRefuseService,
  insTelService
};
