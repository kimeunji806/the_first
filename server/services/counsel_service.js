const counselMapper = require("../database/mappers/counsel_mapper");


const counselInfoService = async (surNo) => {
  let list = await counselMapper.counsel(surNo);
  return list;
};

const counselInsertService = async (surNo , beneNo, userNo,title, content , date,  file) => {
  let list = await counselMapper.counselInsert(surNo , beneNo, userNo,title, content , date,  file);
  return list;
};



const counselUpdateService = async (no,title,content,name,role) => {
  let list = await counselMapper.counselUpdate(no,title,content,name,role);
  return list;
};

const counselHistoryService = async (cNo) => {
  let list = await counselMapper.counselHistory(cNo);
  return list;
};



const counselDeleteService = async (no) => {
  let list = await counselMapper.counselDelete(no);
  return list;
};




module.exports = {counselInfoService ,counselInsertService,counselUpdateService,counselHistoryService,counselDeleteService}