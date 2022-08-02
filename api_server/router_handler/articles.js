// 文章管理的处理函数

// 导入处理路径的 path 核心模块
const path = require('path')

// 导入数据库操作模块
const db = require('../db/index')
// 发布文章
exports.addArticle_handler = function (request, response) {
  // console.log(request.body) // 文本类型的数据
  // console.log('--------分割线----------')
  // console.log(request.file) // 文件类型的数据
  // 发布新文章的处理函数

  // 手动判断是否上传了文章封面
  if (!request.file || request.file.fieldname !== 'cover_img') return response.cc('文章封面是必选参数！')
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...request.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', request.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: request.user.id,
  }
  const sql = `insert into ev_articles set ?`

  // 执行 SQL 语句
  db.query(sql, articleInfo, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return response.cc(err)

    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return response.cc('发布文章失败！')

    // 发布文章成功
    response.cc('发布文章成功', 0)
  })

}
// 获取文章列表
exports.listArticle_handler = function (request, response) {
  // 对ev_articles表进行分页 没有携带 cate_id和state
  const sql = 'select id,title,pub_date,state,cate_id from ev_articles where is_delete!=1 limit ?,?;'
  // 查询数据的总条数  没有携带 cate_id和state
  const sql1 = 'select count(*) as total from ev_articles where is_delete!=1'
  // 对ev_articles表进行分页 携带 cate_id和state
  const sql2 = 'select id,title,pub_date,state from ev_articles where cate_id=? and state=? and is_delete!=1 limit ?,? '
  // 查询ev_artide_cate表的文章分类的名称
  const sql3 = 'select name from ev_artide_cate where id=?'
  // 查询数据的总条数  携带 cate_id和state
  const sql4 = 'select count(*) as total from ev_articles where cate_id=? and state=? and is_delete!=1'

  // pagenum :页码值    pagesize：每页显示的条数
  const q = request.query
  let start = (q.pagenum - 1) * q.pagesize
  if (!q.cate_id && !q.state) {
    // 没有携带 cate_id和state
    db.query(sql, [start, parseInt(q.pagesize)], (err, results) => {
      if (err) return response.cc(err)
      if (results.length === 0) return response.cc('获取文章列表失败！')
      const data = results
      // 获取cate_name      
      data.forEach((item, i) => {
        db.query(sql3, item.cate_id, (err, results) => {
          if (err) return response.cc(err)
          item['cate_name'] = results[0].name
        })
      })

      // 总条数
      db.query(sql1, (err, results) => {
        if (err) return response.cc(err)
        let total = results[0].total
        response.send({
          status: 0,
          message: "获取文章列表成功！",
          data: data,
          total: total
        })
      })
    })
  } else {
    // 携带 cate_id和state
    db.query(sql2, [q.cate_id, q.state, start, parseInt(q.pagesize)], (err, results) => {
      if (err) return response.cc(err)
      if (results.length === 0) return response.cc('获取文章列表失败！')
      let data = results
      // 获取cate_name
      db.query(sql3, q.cate_id, (err, results) => {
        if (err) return response.cc(err)
        data.forEach((item, i) => {
          item['cate_name'] = results[0].name
        })

      })
      // 总条数
      db.query(sql4, [q.cate_id, q.state], (err, results) => {
        if (err) return response.cc(err)
        let total = results[0].total
        response.send({
          status: 0,
          message: "获取文章列表成功！",
          data: data,
          total: total
        })
      })
    })
  }

}
// 根据 Id 删除文章数据
exports.deleteArticle_handler = function (request, response) {
  const id = request.params.id

  const sql = 'update ev_articles set is_delete=1 where id=?'
  db.query(sql, id, (err, results) => {
    if (err) return response.cc(err)
    if (results.affectedRows !== 1) return response.cc('删除失败！')
    response.cc('删除成功！', 0)
  })
}
// 根据id获取文章详情
exports.article_handler = function (request, response) {
  const id = request.params.id
  const sql = 'select * from ev_articles where id=? and is_delete!=1'
  db.query(sql, id, (err, results) => {
    if (err) return response.cc(err)
    if (results.length !== 1) return response.cc('"获取文章失败！')
    response.send({
      status: 0,
      message: "获取文章列表成功！",
      data: results
    })
  })
}
// 修改
exports.editArticle_handler = function (request, response) {
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...request.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', request.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: request.user.id,
  }
  console.log(articleInfo);
  const sql = 'update ev_articles set ? where id=?'
  db.query(sql, [articleInfo, articleInfo.id], (err, results) => {
    if (err) return response.cc(err)
    if (results.affectedRows !== 1) return response.cc('修改文章失败！')
    response.cc('修改文章成功！', 0)
  })
}