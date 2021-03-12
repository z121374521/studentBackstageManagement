/* 处理路由访问 */
const express = require('express');
const studentRouter2 = require('./studentRouter2');

let router = express.Router();

router.use('/msg/banji',studentRouter2);
//路由请求: /student
router.get('/',(req,res)=>{
    res.send('首页');
})
//路由请求: /student/:sid
router.get('/:sid',(req,res)=>{
    res.json(req.params.sid);
})
//post请求 /student/add
router.post('/add',(req,res)=>{
    res.send('添加');
})
module.exports = router;