// 文章管理
const express = require('express')
const router = express.Router()

// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
// const upload = multer({ dest: path.join(__dirname, '../uploads') })

let uploadFolder = path.join(__dirname, '../uploads')
// 2. 设置磁盘存贮
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder); // 他会放在当前目录下的 /upload 文件夹下（没有该文件夹，就新建一个）
  },
  filename: function (req, file, cb) { // 在这里设定文件名
    cb(null, Date.now() + '-' + file.originalname + file.originalname + '.png'); // file.originalname是将文件名设置为上传时的文件名+png图片格式，file中携带的
    // cb(null, Date.now() + '-' + file.originalname) // 加上Date.now()可以避免命名重复
  }
})

let upload = multer({ storage: storage });




// 导入路由处理函数组件
const rooter_handler = require('../router_handler/articles.js')
const expressJoi = require('@escook/express-joi')
const { add_article_schema, edit_article_schema, list_article_schema } = require('../schema/articles.js')
const { func } = require('joi')
const { fstat } = require('fs')

// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), rooter_handler.addArticle_handler)

// 获取文章列表
router.get('/list', expressJoi(list_article_schema), rooter_handler.listArticle_handler)

// 根据 Id 删除文章数据
router.get('/delete/:id', rooter_handler.deleteArticle_handler)
// 根据id获取文章详情
router.get('/:id', rooter_handler.article_handler)
// 根据 Id 更新文章信息
router.post('/edit', upload.single('cover_img'), expressJoi(edit_article_schema), rooter_handler.editArticle_handler)
module.exports = router