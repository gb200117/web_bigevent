// 用户基本信息路由模块
const express = require('express')
const router = express.Router()
// 导入用户信息处理模块
const userinfo_hander = require('../router_handler/userinfo.js')
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user.js')
// 获取用户基本信息路由
router.get('/userinfo', userinfo_hander.getUserInfo)
// 更新用户信息路由接口
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_hander.updateUserInfo)
// 重置密码路由接口
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_hander.updatePassword)
// 更新头像的路由接口
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_hander.updateAvatar)

module.exports = router