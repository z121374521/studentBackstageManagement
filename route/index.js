//处理路由的文件:
const express = require('express'),
    {
        showLogin,
        doLogin,
        checkUser,
        idol,
        fool
    } = require('../controllers/loginCtrl'),
    { logout } = require('../controllers/Logout'),
    {
        showIndex: sI,
        showList: sL,
        searchStudent: sS,
        exportStudentToExcel: eSTE,
        showAddStudent: sAS,
        addStudent: aS,
        updateStudent: uS,
        deleteStudent: dS,
        Dh,
        Ech,
        Adlist,
        Adli,
        Delad,
        Addad,
        Addym,
        showDetalis:sD,
        showZd:Zd
    } = require('../controllers/studentCtrl');

//生成路由:
let router = express.Router();

//登录验证: 验证如果没有登陆过不能访问管理界面的任何内容
router.use((req, res, next) => {
    if (!req.session['s_id'] && req.url != '/login') { //没有s_id证明没有登陆过
        res.redirect('/login');
        return;
    }
    next();
});

//路径清单:当你访问登录页面的时候 不能写login之外的 因为会给你重新定向
router.get('/login', showLogin); //访问登录页面
router.post('/login', doLogin); //访问登录接口 处理登录操作
router.propfind('/login', checkUser); //访问接口 验证用户名是否存在
router.put('/login', idol); //访问密保，验证密保
router.delete('/login',fool)//修改密码

router.get('/', sI); //访问首页
router.get('/student/dh', Dh);//首页动画学院 专业班级数据
router.get('/student/detalis', sD);//访问接口 访问学生详情页
router.get('/student/msg', sL);//访问接口 访问全部学生数据详情
router.delete('/student/:sid', dS);//访问接口 处理删除学生
router.get('/student/search', sS); //访问接口 处理搜索学生
router.post('/student/:sid', uS);//访问接口 处理修改学生数据
router.get('/student/cx', Zd);//访问接口 处理修改学生数据
router.get('/student/exportExcel', eSTE);//访问接口 处理学生数据导出
router.get('/student/addStudent', sAS); //访问增加学生页面
router.put('/student/addStudent', aS);//访问接口 处理增加学生

router.get('/student/ech', Ech); //访问学生图表
router.get('/student/admin', Adlist); //访问管理员列表界面
router.get('/adli', Adli); //获取管理员信息
router.post('/delad', Delad); //删除管理员

router.get('/student/addad',Addym);//访问添加管理员界面
router.post('/addad',Addad);//添加管理员

//退出
router.get('/Logout', logout); //访问接口 处理退出


module.exports = router;