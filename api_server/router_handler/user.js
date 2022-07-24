// 路由处理函数

// 导入数据库模块
const db = require('../db/index.js')
// 导入密码加密包bcryptjs
const bcrypt = require('bcryptjs')
// 导入token加密的包
const jwt = require('jsonwebtoken');
// 导入全局的配置文件
const config = require('../config.js')
// 注册
module.exports.regUser = (request, response) => {
  const userInfo = request.body
  // if (!userInfo.username || !userInfo.password) {
  //   // return response.send({ status: 1, message: '用户名或密码不能为空！' })
  //   return response.cc('用户名或密码不能为空！')
  // }
  // 查看用户名是否被占用  查询返回的数据是一个数组
  const sqlstr = 'select * from ev_users where username = ?'
  db.query(sqlstr, userInfo.username, (err, results) => {
    // 判断查询是否出错
    if (err) return response.send({ status: 1, message: err.message })
    // 判断用户名是否被占用
    if (results.length > 0) {
      // return response.send({ status: 1, message: '用户名被占用,请更换其他用户名！' })
      return response.cc('用户名被占用,请更换其他用户名！')
    }
    // 对密码进行加密  bcrypt.hashSync
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)
    // 插入用户信息给数据库
    const sql = 'insert into ev_users set ?'
    db.query(sql, { username: userInfo.username, password: userInfo.password }, (err, results) => {
      // 判断插入是否报错
      if (err) {
        // return response.send({ status: 1, message: err.message })
        return response.cc(err.message)
      }
      // 判断插入是否成功 affectedRows == 1
      if (results.affectedRows !== 1) {
        // return response.send({ status: 1, message: '注册用户失败，请稍后再试！' })
        return response.cc('注册用户失败，请稍后再试！')
      }
      // response.send('注册成功')
      response.cc('注册成功', 0)
    })
  })
}
// 登录
module.exports.login = (request, response) => {
  const userInfo = request.body
  const sqlstr = 'select * from ev_users where username = ?'
  db.query(sqlstr, userInfo.username, (err, results) => {
    if (err) return response.cc(err)
    if (results.length != 1) return response.cc('登陆失败')
    let compareRouter = bcrypt.compareSync(userInfo.password, results[0].password)
    if (!compareRouter) {
      return response.cc('密码输入错误')
    }
    const user = { ...results[0], password: '', user_pic: '' }
    // jwt.sign(数据，密钥，{expiresIn：过期时间})
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    response.send({
      status: 0,
      message: '登陆成功',
      token: 'Bearer ' + tokenStr
    })

  })
}