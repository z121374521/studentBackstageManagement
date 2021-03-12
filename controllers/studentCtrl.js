const Student = require('../models/Student'),
    Admin = require('../models/Admin'),
    formidable = require('formidable');


//渲染首页 (包含管理员信息)
exports.showIndex = function (req, res) {
    Admin.checkUser(req.session.s_id, function (adminR) {
        res.render('index', {
            adminData: adminR
        });
    })
}
//访问学生详情页面
exports.showDetalis = function (req, res) {
    Admin.checkUser(req.session.s_id, function (adminR) {
        res.render('manage.ejs', {
            adminData: adminR
        });
    })
}
//访问图表页
exports.Ech = function (req, res) {

    Admin.checkUser(req.session.s_id, function (adminR) {
        res.render('ech', {
            adminData: adminR
        });
    })

}
//访问管理员列表
exports.Adlist = function (req, res) {
    
    Admin.checkUser(req.session.s_id, function (adminR) {
        res.render('admin', {
            adminData: adminR
        });
    })

}
//访问添加管理员页面
exports.Addym = function (req, res) {

    Admin.checkUser(req.session.s_id, function (adminR) {
        res.render('maps', {
            adminData: adminR
        });
    })

}
//获取所有管理员信息
exports.Adli = function (req, res) {
    var cok = req.session['s_id']
    Admin.adli(function (data) {
        res.json({res:data,c:cok})
    })

}
//删除管理员
exports.Delad = function (req, res) {

    let form = formidable();
    form.parse(req, (err, fields) => {
        console.log(fields);
        
        Admin.delad(fields.user,function (data) {
            res.json(data)
        })
    })
    

}
//添加管理员
exports.Addad = function (req, res) {
    var form = formidable({
        // multiples:true,//可以上传多个文件
        keepExtensions:true,//是否包含文件后缀
        uploadDir:'./public/images'//一定要设置上传的文件路径  上传图片放到哪里
    });
    form.parse(req, (err, fields,files) => {
        if( err ){
            res.json({result : false});
            return;
        } 
        // console.log(files);//public\\images\\upload_26688f0cf42ae0386cefdcca655f138d.png'
        var fil = files.file.path.split('\\')
        var fil2 = fil[fil.length-1]
        // console.log(files);
        
        // console.log(fields);
        var path = files.file.path;
        //如果没有上传头像 就用默认头像
        if(files.file.size == 0){
            fields.src = 'mr.jpg';
            fields.size = false
        }else{
            fields.size = true
            fields.src = fil2;
        }
        //把路径也保存下来  无论有没有上传头像 都会有文件上传上来
        fields.path = files.file.path
        // console.log(fields);

        Admin.ad(fields,function (data) {
            res.json(data)
        })
    })
    

}
//访问接口 获取学生某一页数据
exports.showList = function (req, res) {
    let page = req.query.page ? req.query.page : 1; //获取页数
    Student.findPageData(page, function (results) {
        res.json(results);
    });
}
//访问接口 开除学生
exports.deleteStudent = function (req, res) {

    ///student/:sid
    let sid = req.params.sid;
    // console.log(sid);
    // return;
    Student.deleteStudent(sid, (results) => {
        res.json(results);
    });
}
//访问接口 处理修改学生数据
exports.updateStudent = function (req, res) {
    let sid = req.params.sid;
    let form = formidable();
    form.parse(req, (err, fields) => {
        Student.changeStudent(sid, fields, (results) => {
            res.json({ error: results });
        });
    })
}
//查询指定的专业和班级
exports.showZd = function (req, res) {
    // console.log(req.query);
    var grads = parseInt(req.query.grads)
    var speci = req.query.speci;
    var page = req.query.page;
    var a = 0
    // console.log(grads,speci,page);
    // return;

    if (grads.toString() == 'NaN') {
        a = 1
        grads = null;
    }
    Student.changeZd(grads, speci, a, page, (data) => {
        res.json(data);
    });




}
//首页聚合查询每个专业的总人数
exports.Dh = function (req, res) {

    Student.changeDh((results) => {
        res.json({ error: results });
    });

}
//通过学生姓名做模糊搜索
exports.searchStudent = function (req, res) {
    let search = req.query.search;

    Student.findStudentNames(search, (results) => {
        res.json(results);
    });
}
//访问接口 处理学生数据导出
exports.exportStudentToExcel = function (req, res) {
    var grads = parseInt(req.query.grads)
    var speci = req.query.speci;
    var a = 0
    // console.log(grads,speci);
    // return;

    if (speci == '全部') {
        a = -1
    } else {
        if (grads.toString() == 'NaN') {
            a = 1
            grads = null;
        }
    }
    Student.exportExcel(grads, speci, a, (data) => {
        res.send(data);
    });
}
//访问增加学生页面
exports.showAddStudent = function (req, res) {
    Admin.checkUser(req.session.s_id, function (adminR) {
        res.render('addStudent', {
            adminData: adminR
        });
    })
}
//访问接口 处理增加学生
exports.addStudent = function (req, res) {
    let form = formidable();
    form.parse(req, (err, fields) => {
        if (err) {
            res.json({ error: 0, msg: '数据接收失败' });
            return;
        }
        console.log(fields);
        // return;

        Student.saveStudent(fields, (results) => {
            res.json(results);
        });
    })
}
