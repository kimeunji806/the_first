const counselMapper = require("../database/mappers/counsel_mapper");

const counselInfoService = async (beneNo) => {
  let list = await counselMapper.counsel(beneNo);
  return list;
};



module.exports = {counselInfoService}