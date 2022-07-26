// 用户基本信息处理函数模块

// 导入密码加密解密包bcryptjs
const bcrypt = require('bcryptjs')


// 导入数据库模块
const db = require('../db/index.js')
// 获取用户基本信息
module.exports.getUserInfo = (request, response) => {
  const sqlstr = 'select id,username,nickname,emil,user_pic from ev_users where id=?'
  // 注意：requsst对象上的user属性，是token解析成功，express-jwt 中间件帮我们挂载上去的
  db.query(sqlstr, request.user.id, (err, results) => {
    if (err) return response.cc(err)
    if (results.length !== 1) return response.cc('获取用户信息失败！')
    response.send({
      status: 0,
      message: '获取用户基本信息成功！',
      data: results[0]
    })
  })

}
// 更新用户基本信息处理函数
module.exports.updateUserInfo = (request, response) => {
  const sqlstr = "update ev_users set ? where id = ?"
  db.query(sqlstr, [request.body, request.body.id], (err, results) => {
    if (err) return response.cc(err)
    if (results.affectedRows !== 1) return response.cc('更新用户基本信息失败！')
    response.cc('更新成功！', 0)
  })

}
// 更新密码的处理函数
module.exports.updatePassword = (request, response) => {
  const sqlstr = 'select * from ev_users where id = ?'
  db.query(sqlstr, request.user.id, (err, results) => {
    if (err) return response.cc(err)
    if (results.length !== 1) return response.cc('用户不存在')

    let compareRouter = bcrypt.compareSync(request.body.oldPwd, results[0].password)
    console.log(compareRouter);
    if (!compareRouter) return response.cc('原密码错误，请重新输入！')

    const sql = 'update ev_users set password=? where id=?'
    // 对新密码进行 bcrypt 加密处理
    const newPwd = bcrypt.hashSync(request.body.newPwd, 10)

    // 执行 SQL 语句，根据 id 更新用户的密码
    db.query(sql, [newPwd, request.user.id], (err, results) => {
      console.log(results);
      if (err) return response.cc(err)
      if (results.affectedRows !== 1) return response.cc('修改密码失败！')
      response.cc('修改密码成功', 0)
    })
  })
}
// 更新头像的处理函数
module.exports.updateAvatar = (request, response) => {
  const sql = 'update ev_users set user_pic=? where id=?'
  db.query(sql, [request.body.avatar, request.user.id], (err, results) => {
    if (err) return response.cc(err)
    if (results.affectedRows !== 1) return response.cc('更新头像失败！')
    response.cc('更新头像成功！', 0)
  })
}