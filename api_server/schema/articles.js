// 导入定义验证规则的模块
const Joi = require('joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = Joi.string().required()
const cate_id = Joi.number().integer().min(1).required()
const content = Joi.string().required().allow('')
const state = Joi.string().valid('已发布', '草稿').required()
const state1 = Joi.string().valid('已发布', '最新', '')
const id = Joi.number().integer().min(1).required()
const pagenum = Joi.number().integer().min(1).required()
const pagesize = Joi.number().integer().min(1).required()
// 当传过来的值为空empty("")取消验证  default("")默认值为空
//empty(value) 将与value匹配的任何内容视为空
const cate_id1 = Joi.number().integer().min(1).empty("").default("")
// 验证规则对象 - 发布文章
exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state,
  }
}
// 验证文章列表
exports.list_article_schema = {
  query: {
    pagenum,
    pagesize,
    cate_id: cate_id1,
    state: state1,
  }
}
exports.edit_article_schema = {
  body: {
    id,
    title,
    cate_id,
    content,
    state,
  }
}