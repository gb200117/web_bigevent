// 导入 Joi 来定义验证规则
const Joi = require('joi')
// 2. 定义验证规则
// 注意：如果客户端提交的某些参数项未在 schema 中定义，
// 此时，这些多余的参数项默认会被忽略掉
const username = Joi.string().alphanum().min(3).max(12).required()
const password = Joi.string()
  .pattern(/^[\S]{6,12}$/)
  .required()
exports.req_login_schema = {
  body: {
    username,
    password,
  }
}