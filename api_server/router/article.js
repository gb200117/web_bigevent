// 文章类别管理

const express = require('express')
const router = express.Router()
// 导入验证规则中间件
const expressJoi = require('@escook/express-joi')
// 导入验证规则的中间件
const { add_cate_schema, deletecate_schema, get_cate_schema, update_cate_schema } = require('../schema/article.js')
const { article_handler, addcates_handler, deletecate_handler, articleID_handler, updatecate_handler } = require('../router_handler/article.js')
// 获取文章分类列表
router.get('/cates', article_handler)
// 新加文章分类列表
router.post('/addcates', expressJoi(add_cate_schema), addcates_handler)
// 根据 Id 删除文章分类数据
router.get('/deletecate/:id', expressJoi(deletecate_schema), deletecate_handler)
// 根据 Id 获取文章分类数据
router.get('/cates/:id', expressJoi(get_cate_schema), articleID_handler)
// 根据 Id 更新文章分类数据
router.post('/updatecate', expressJoi(update_cate_schema), updatecate_handler)
module.exports = router