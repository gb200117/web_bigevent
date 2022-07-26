// 导入 Joi 来定义验证规则
const Joi = require('joi')
// 2. 定义验证规则
// 注意：如果客户端提交的某些参数项未在 schema 中定义，
// 此时，这些多余的参数项默认会被忽略掉
const username = Joi.string().alphanum().min(3).max(12).required()
const password = Joi.string()
  .pattern(/^[\S]{6,12}$/)
  .required()
const id = Joi.number().integer().min(1).required()
const nickname = Joi.string().required()
const emil = Joi.string().email()
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = Joi.string().dataUri().required()

// 登录的验证规则
exports.req_login_schema = {
  body: {
    username,
    password,
  }
}
// 更新基本信息的验证规则
exports.update_userinfo_schema = {
  body: {
    id,
    nickname,
    emil
  }
}

// 验证规则对象 - 重置密码
exports.update_password_schema = {
  body: {
    // 使用 password 这个规则，验证 req.body.oldPwd 的值
    oldPwd: password,
    // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
    // 解读：
    // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
    // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
    // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
    newPwd: Joi.not(Joi.ref('oldPwd')).concat(password),
  },
}

// 验证规则对象 - 更新头像
exports.update_avatar_schema = {
  body: {
    avatar
  }
}