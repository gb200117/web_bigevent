const Joi = require('joi')

// 定义分类名称 和 分类别名 的验证规则
const name = Joi.string().required()
const alias = Joi.string().alphanum().required()
const id = Joi.number().integer().min(1).required()
// 根据规则对象 - 添加分类

exports.add_cate_schema = {
  body: {
    name,
    alias,
  }
}

exports.deletecate_schema = {
  params: {
    id
  }
}
exports.get_cate_schema = {
  params: {
    id
  }
}

exports.update_cate_schema = {
  body: {
    id,
    name,
    alias
  }
}