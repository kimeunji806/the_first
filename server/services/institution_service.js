const institutionMapper = require("../database/mappers/institution_mapper.js");

// 기관정보 조회
const findAll = async () => {
  let info = await institutionMapper.selectAllInstitution();
  return info;
};

// 기관정보 수정
const modifyInfo = async (institutioninfo) => {
  let result = await institutionMapper.updateInstitution(institutioninfo);
  let resObj = {
    status: result?.affectedRows > 0,
    target: {
      ...institutioninfo,
    },
  };
  return resObj;
};

module.exports = { findAll, modifyInfo };
