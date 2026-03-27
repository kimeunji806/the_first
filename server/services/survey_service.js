const surveyMapper = require("../database/mappers/survey_mapper");

const mainInfoService = async (mainNo) => {
  console.log(mainNo);

  let list = await surveyMapper.main(mainNo);
  return list;
};

const subInfoService = async (subNo) => {
  console.log(subNo);

  let list = await surveyMapper.sub(subNo);
  return list;
};

const questionInfoService = async (questionNo) => {
  console.log(questionNo);

  let list = await surveyMapper.question(questionNo);
  return list;
};

const createMainService = async (mainObj) => {
  let result = await userMapper.mainCreate(mainObj);
};

module.exports = { mainInfoService, subInfoService, questionInfoService };
