const mongoose = require('mongoose'),
    fs = require('fs'),
    md5 = require('md5-node');

//1.声明schema
let adminSchema = new mongoose.Schema({
    username: String, //用户名
    password: String, //密码
    posttime: Number, //注册时间
    lastLoginTime: Number, //最后一次登录时间
    src: String,
    idol: String,
    path: String
});
//处理登录:
adminSchema.statics.checkLogin = function (json, callback) {
    //调用 验证用户名的方法
    this.checkUser(json.user, function (torf) {
        //{username:xxxx,password:23ssfsa,posttime:234234,lastLoginTime:234234}
        if (torf.t) { //用户名对了
            if (md5(json.pwd) == torf.val.password) {
                callback(1); //登录成功;
                //实例调用的方法是动态方法
                torf.val.changelastLoginTime();
                return;
            }
            callback(-1); //密码输入错误
        } else {
            callback(-2); //用户名不存在
        }
    })
}
//验证用户名是否存在
adminSchema.statics.checkUser = function (user, callback) {
    this.find({ 'username': user }, (err, results) => {

        if (err) {
            callback({ t: false, val: null });
            return;
        }
        if (results.length != 0) {

            callback({ t: true, val: results[0] });
            return;
        }
        callback({ t: false, val: null });
    })
}
//验证密保是否正确
adminSchema.statics.checkIdol = function (data, callback) {
    //调用 验证用户名的方法
    this.checkUser(data.user, function (torf) {
        //{username:xxxx,password:23ssfsa,posttime:234234,lastLoginTime:234234}
        if (torf.t) { //用户名对了
            if (data.idol == torf.val.idol) {
                callback(1); //用户名和密保都正确
                return;
            }
            callback(-1); //密保输入错误
        } else {
            callback(-2); //用户名输入错误
        }
    })
}
//修改密码 删除旧头像
adminSchema.statics.checkXg = function (data, callback) {

    this.find({ 'username': data.user }, (err, results) => {
        if (err) {
            callback(-3);//查询失败
            return;
        }
        //这个得放在 somebody = results[0]; 上面 不然会有问题
        //判断有没有管理员信息
        if (results.length == 0) {//用户名错误
            callback(-2)
            return;
        }
        var somebody = results[0];

        //判断密保
        if (data.idol != somebody.idol) {//密保输入错误
            callback(-1)
            return;
        }
        //密码加密 保存到数据库
        somebody.password = md5(data.newpwd);

        //没有上传新头像 但是要保存新密码  头像还是上次上传的头像
        if (!data.src) {
            somebody.save((err) => {
                if (err) {
                    callback(-4); //修改失败
                    return;
                }
                //删除文件   如果删除成功 err就是null
                //没有头像更新 也会传上来一个size为0 的文件 删掉
                fs.unlink(data.path, (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log('没有上传新文件');

                    callback(1); //修改成功
                })


            });

            return;
        }
        //如果有新头像上传  将旧头像的路径拿出来  path是文件保存路径
        var jsrc = somebody.path;

        //将新头像的路径和src 更新
        somebody.src = data.src;
        somebody.path = data.path;
        // console.log(somebody);
        // console.log(jsrc);

        somebody.save((err) => {
            if (err) {
                callback(-4); //修改失败
                return;
            }
            if (jsrc) {//如果jsrc有值的话在删除 没有值的话就是第一次注册没有上传头像的情况不用删除
                //删除旧头像 
                fs.unlink(jsrc, (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(err, '删除成功');

                })
            }

            callback(1); //修改成功

        });
    });
}
//获取所有管理员信息
adminSchema.statics.adli = function (callback) {
    this.find({}, function (err, res) {
        if (err) {
            callback({ err: "查询失败" })
            return;
        }

        callback(res);
    })
}
//删除管理员
adminSchema.statics.delad = function (username, callback) {
    
    console.log(username);
    

    this.find({ username }, (err, results) => {
        //results [{_id:23423,name:xxx}]
        var somebody = results[0];
        console.log(somebody);
        if(somebody.src !='mr.jpg'){
            //删除文件   如果删除成功 err就是null
            fs.unlink(somebody.path, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('删除成功');
            })
            console.log('有头像');
            
        }
        
        somebody.remove(err => {
            if (err) {
                callback({ error: 0, msg: '删除失败' });
                return;
            }
            callback({ error: 1, msg: '删除成功' });
        });
    })


}
//添加管理员
adminSchema.statics.ad = function (data, callback) {
    // console.log(data);
    if (data.size) {
        p = data.path
    }else{
        p = ''
    }

    let admin = new Admin({
        username: data.user,
        password: data.pwd,
        posttime: new Date().getTime(),
        lastLoginTime: new Date().getTime(),
        idol: data.ido,
        path: p,
        src: data.src

    });
    admin.save(err => {
        if (err) {
            callback({ error: 0, msg: '保存失败' });
            return;
        }
        if (!data.size) {
            //删除文件   如果删除成功 err就是null
            //没有头像更新 也会传上来一个size为0 的文件 删掉
            fs.unlink(data.path, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('没有上传新文件');

                callback({ error: 1, msg: '保存成功' }); //修改成功
            })
            return;
        }
        callback({ error: 1, msg: '保存成功' });
    })

}
//修改用户登录成功以后的登录时间
adminSchema.methods.changelastLoginTime = function () {
    var timeStemp = new Date().getTime();
    this.lastLoginTime = timeStemp;
    this.save();
}

//2.初始化Admin类 该类会声明一个名为admins的集合
let Admin = mongoose.model('Admin', adminSchema);

//3.导出集合
module.exports = Admin;