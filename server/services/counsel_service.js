const counselMapper = require("../database/mappers/counsel_mapper");


const counselInfoService = async (surNo) => {
  let list = await counselMapper.counsel(surNo);
  return list;
};

const counselInsertService = async (surNo , beneNo, userNo,title, content , date,  file) => {
  let list = await counselMapper.counselInsert(surNo , beneNo, userNo,title, content , date,  file);
  return list;
};



const counselUpdateService = async (no,title,content) => {
  let list = await counselMapper.counselUpdate(no,title,content);
  return list;
};

const counselDeleteService = async (no) => {
  let list = await counselMapper.counselDelete(no);
  return list;
};




module.exports = {counselInfoService ,counselInsertService,counselUpdateService,counselDeleteService}