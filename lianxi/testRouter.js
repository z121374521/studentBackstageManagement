const express = require('express');
const router = require('./route/index.js');
const studentRouter = require('./route/studentRouter.js');

var app = express();

//处理路由: 当我请求http://localhost:3000/login
app.use('/login',router);
//求http://localhost:3000/student
app.use('/student',studentRouter);

app.listen(3000);