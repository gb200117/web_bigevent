const { func } = require('joi')
const db = require('../db/index.js')

// 获取文章分类的处理函数
module.exports.article_handler = function (request, response) {
  const sql = 'select * from ev_artide_cate where is_delete = 0 order by id asc'
  db.query(sql, (err, results) => {
    if (err) return response.cc(err)
    if (results.length == 0) return response.cc('获取文章分类列表失败！')
    response.send({
      status: 0,
      message: "获取文章分类列表成功！",
      data: results
    })
  })
}
// 添加分类的处理函数
module.exports.addcates_handler = function (request, response) {
  // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
  const sql = `select * from ev_artide_cate where name=? or alias=?`
  // 执行查重操作 
  db.query(sql, [request.body.name, request.body.alias], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return response.cc(err)

    // 判断 分类名称 和 分类别名 是否被占用
    if (results.length === 2) return response.cc('分类名称与别名被占用，请更换后重试！')
    // 分别判断 分类名称 和 分类别名 是否被占用
    if (results.length === 1 && results[0].name === request.body.name && results[0].alias === request.body.alias) {
      return response.cc('分类名称与别名被占用，请更换后重试！')
    }
    if (results.length === 1 && results[0].name === request.body.name) return response.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === request.body.alias) return response.cc('分类别名被占用，请更换后重试！')

    // TODO：新增文章分类

    const sqlStr = 'insert into ev_artide_cate set ?'
    db.query(sqlStr, { name: request.body.name, alias: request.body.alias }, (err, results) => {
      if (err) return response.cc(err)
      if (results.affectedRows !== 1) return response.cc('新增文章分类失败！')
      response.cc('新增文章分类成功！', 0)
    })

  })
}

// 根据id删除文章分类
module.exports.deletecate_handler = function (request, response) {
  const sql = 'update ev_artide_cate set is_delete = 1 where id = ?'
  db.query(sql, request.params.id, (err, results) => {
    if (err) return response.cc(err)
    if (results.affectedRows !== 1) return response.cc('删除文章分类失败！')
    response.cc('删除文章分类成功！', 0)
  })
}
// 根据id获取文章分类
module.exports.articleID_handler = function (request, response) {
  const sql = 'select * from ev_artide_cate where id=? and is_delete = 0'
  db.query(sql, request.params.id, (err, results) => {
    if (err) return response.cc(err)
    if (results.length !== 1) return response.cc('获取文章分类数据失败！')
    response.send({
      status: 0,
      message: '获取文章分类数据成功！',
      data: results[0]
    })
  })
}
// 根据 Id 更新文章分类数据
module.exports.updatecate_handler = function (request, response) {
  // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
  const sql = `select * from ev_artide_cate where id!=? and (name=? or alias=?)`
  db.query(sql, [request.body.id, request.body.name, request.body.alias], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return response.cc(err)

    // 判断 分类名称 和 分类别名 是否被占用
    if (results.length === 2) return response.cc('分类名称与别名被占用，请更换后重试！')
    // 分别判断 分类名称 和 分类别名 是否被占用
    if (results.length === 1 && results[0].name === request.body.name && results[0].alias === request.body.alias) {
      return response.cc('分类名称与别名被占用，请更换后重试！')
    }
    if (results.length === 1 && results[0].name === request.body.name) return response.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === request.body.alias) return response.cc('分类别名被占用，请更换后重试！')

    // TODO：新增文章分类
    const sqlStr = 'update ev_artide_cate set name=?,alias=? where id=?'
    db.query(sqlStr, [request.body.name, request.body.alias, request.body.id], (err, results) => {
      if (err) return response.cc(err)
      if (results.affectedRows !== 1) return response.cc('更新分类信息失败！')
      response.cc('更新分类信息成功！', 0)
    })
  })

}