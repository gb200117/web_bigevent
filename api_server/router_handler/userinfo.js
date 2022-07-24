// 用户基本信息处理函数模块

// 导入数据库模块
const db = require('../db/index.js')
// 用户基本信息
module.exports.getUserInfo = (request, response) => {
  const sqlstr = 'select username,nickname,emil,user_pic from ev_users where id=?'
  // 注意：requsst对象上的user属性，是token解析成功，express-jwt 中间件帮我们挂载上去的
  db.query(sqlstr, request.user.id, (err, results) => {
    if (err) return response.cc(err)
    if (results.length !== 1) return response.cc('获取用户信息失败！')
    response.cc({
      status: 0,
      message: '获取用户基本信息成功！',
      data: results[0]
    })
  })

}