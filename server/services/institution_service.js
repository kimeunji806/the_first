const institutionMapper = require("../database/mappers/institution_mapper.js");

const findAll = async () => {
  let info = await institutionMapper.selectAllInstitution();
  return info;
};

module.exports = { findAll };
