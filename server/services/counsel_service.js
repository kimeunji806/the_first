const counselMapper = require("../database/mappers/counsel_mapper");


const counselInfoService = async (surNo) => {
  let list = await counselMapper.counsel(surNo);
  return list;
};

const counselInsertService = async (selectNo , beneNo, userNo,title, content , date,  files) => {
  let list = await counselMapper.counselInsert(selectNo , beneNo, userNo,title, content , date,  files);
  return list;
};




module.exports = {counselInfoService ,counselInsertService}