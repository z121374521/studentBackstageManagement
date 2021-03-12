const formidable = require('formidable'),
      Admin = require('../models/Admin');
/* 登录块 */

//渲染登录页:
exports.showLogin = function (req,res){
    if( req.session['s_id'] ){ //如果已经登录过 就不需要访问登录页面了.
        res.redirect('/');
        return;
    }
    //设置了ejs模板引擎 通过render渲染login时它就会自动到views目录下寻找名为login.ejs的模板文件进行渲染
    res.render('login');
}

//处理登录
exports.doLogin = function (req,res){
    let form = formidable();
    form.parse(req,(err,fields)=>{
        Admin.checkLogin(fields,function (data){
            //console.log(data);
            if( data == 1 ){ //如果登录成功 种session
                req.session['s_id'] = fields.user;
            }
            res.send(`${data}`);
            //res.json(data);
        });
    })
}

//验证用户是否存在
exports.checkUser = function (req,res){
    let form = formidable();
    form.parse(req,(err,fields)=>{ 
        // console.log(fields);//{ user: 'asdasd' }
        if( err ){
            res.json({result : false});
            return;
        }     
        Admin.checkUser(fields.user,function (val){
            //console.log(val);
            res.json({result : val.t ,data:val.val});
        });
    });
}

//验证密保 修改密码 更换头像
exports.fool = function (req,res){
    var form = formidable({
        // multiples:true,//可以上传多个文件
        keepExtensions:true,//是否包含文件后缀
        uploadDir:'./public/images'//一定要设置上传的文件路径  上传图片放到哪里
    });
    form.parse(req,(err,fields,files)=>{ 
        if( err ){
            res.json({result : false});
            return;
        } 
        // console.log(fields);
        // console.log(files);//public\\images\\upload_26688f0cf42ae0386cefdcca655f138d.png'
        var fil = files.file.path.split('\\')
        var fil2 = fil[fil.length-1]
        //将新的头像路径传过去  
        var path = files.file.path;
        //如果新头像大小不为0   将新的图片src保存 更新下来
        if(files.file.size != 0 ){

            fields.src = fil2;
        }
        //无论 有没有新头像都吧上传上来的路径保存下来  就算没有更新头像也会上传一个size为0的文件
        fields.path = path
        // console.log(fields);
            
        Admin.checkXg(fields,function (val){
            //console.log(val);
            res.json(val);
        });
    });
}

//验证密保
exports.idol = function (req,res){
    
    let form = formidable();
    form.parse(req,(err,fields)=>{ 
        // console.log(fields);
        
        if( err ){
            res.json({result : false});
            return;
        } 
        Admin.checkIdol(fields,function (val){
            //console.log(val);
            res.json(val)
        });
    });
}



