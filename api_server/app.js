const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs')
// 导入 Joi 来定义验证规则
const Joi = require('joi')
//解决跨域
app.use(cors())
// 解析 x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
// 中间件   一定要在路由之前，封装res.css函数(作用：在处理函数中需要多次的调用response.send()向客户端响应失败的结果，减少的使用response.send())
app.use((request, response, next) => {
  // status 默认值为1 表示失败的情况
  // err的值，可能是一个错误对象，也可能时一个错误的描述字符串
  response.cc = function (err, status = 1) {
    response.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})
// 导入配置文件
const config = require('./config.js')
// 解析token的中间件
const expressJWT = require('express-jwt')
// unless 使路由路径不受保护
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))
// 注册并导入 路由模块
const userRouter = require('./router/user.js')
app.use('/api', userRouter)
const userInfo = require('./router/userinfo.js')
app.use('/my', userInfo)
// 文章类别
const artcateRouter = require('./router/article.js')
app.use('/my/article', artcateRouter)
// 文章管理
const artcatesRouter = require('./router/articles.js')
app.use('/my/article', artcatesRouter)
// 错误级别的中间件
app.use((err, request, response, next) => {
  // 验证失败导致  (在response里面不允许连续两次调用response.send())
  if (err instanceof Joi.ValidationError) return response.cc(err)
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return response.cc("身份认证失败")
  // 未知的错误
  response.cc(err)

})

app.listen(3007, () => {
  console.log("serve runing ant http://127.0.0.1:3007");
})