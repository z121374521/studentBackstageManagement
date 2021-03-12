/* 处理路由访问 */
const express = require('express');

let router = express.Router();

//路由请求: /login
router.get('/',(req,res)=>{
    res.send('登录');
})
//路由请求: /login/out
router.get('/out',(req,res)=>{
    res.send('退出');
})
//post请求 /login
router.post('/',(req,res)=>{
    res.send('登录');
})
module.exports = router;