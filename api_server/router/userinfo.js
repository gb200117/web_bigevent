// 用户基本信息路由模块
const express = require('express')
const router = express.Router()
// 导入用户信息处理模块
const userinfo_hander = require('../router_handler/userinfo.js')
// 获取用户基本信息路由
router.get('/userinfo', userinfo_hander.getUserInfo)

module.exports = router