const express = require('express')
const router = express.Router()
// 导入路由处理函数模块
const handlerUser = require('../router_handler/user.js')
// 1. 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi')
// 2, 导入需要的规则的验证对象
const { req_login_schema } = require('../schema/user.js')
// 注册
router.post('/reguser', expressJoi(req_login_schema), handlerUser.regUser)
// 登录
router.post('/login', expressJoi(req_login_schema), handlerUser.login)
module.exports = router