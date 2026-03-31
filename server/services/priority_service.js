const priorityMapper = require("../database/mappers/priority_mapper");

// -> 지원대상자에대한 정보 불러오기 SELECT
const priorityInfoService = async (surveyNo) => {
  console.log(surveyNo);

  let list = await priorityMapper.priorityInfo(surveyNo);
  return list;
};

const createPriorityService = async (priorityObj) => {
  const { priority_id, survey_no, writer_no } = priorityObj;

  let insertData = [priority_id, survey_no, writer_no];
  let result = await priorityMapper.insertPriority(insertData);

  // let resObj = {
  //   status: result.insertId > 0 ? "success" : "fail",
  //   user_no: result.insertId,
  // };
  return result;
};

const updatePriorityService = async (surveyNo, priorityObj) => {
  const { approval, approver, reason_rejection } = priorityObj;

  let insertData = {
    approval,
    approver,
    reason_rejection,
  };
  let result = await priorityMapper.updatePriority(surveyNo, insertData);
  // let resObj = {
  //   // 성공여부
  //   status: result.changedRows > 0,
  //   // 성공여부
  //   target: mainObj,
  // };
  // return resObj;
};

module.exports = {
  priorityInfoService,
  createPriorityService,
  updatePriorityService,
};
