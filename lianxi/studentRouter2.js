const express = require('express');

var router = express.Router();

//路由请求 /student/msg/banji
router.get('/',(req,res)=>{
    res.send('msg下的banji');
})
// /student/msg/banji/1902
router.get('/:hao',(req,res)=>{
    res.json(req.params.hao);
})

module.exports = router;