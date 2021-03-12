const mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path'),
    nodeXlsx = require('node-xlsx');


//1.声明schema
let studentSchema = new mongoose.Schema({
    sid: Number, //学生的学号
    name: String, //名字
    sex: String, //性别
    age: Number, //年龄  
    grads: Number,//班级
    speci: String//专业

});

//获取某一页学生数据
studentSchema.statics.findPageData = async function (page, callback) {
    //分页:
    let pageSize = 9; //一页4条数据
    let start = (page - 1) * pageSize; //起始位置
    let count = await this.find().countDocuments(); //获取数据总条数
    this.find({}).sort({ 'sid': 1 }).skip(start).limit(pageSize).exec(function (err, results) {
        if (err) {
            callback(null);
            return;
        }
        callback({
            results,//9条数据
            count, //数据总条数
            length: Math.ceil(count / pageSize), //一共多少页
            now: page // 当前在那一页
        });
    })
}
//修改学生信息:
studentSchema.statics.changeStudent = function (sid, data, callback) {
    this.find({ sid }, (err, results) => {
        //console.log(results);
        var somebody = results[0];
        somebody.age = data.age;
        somebody.sex = data.sex;
        somebody.name = data.name;
        console.log(somebody);
        
        somebody.save((err) => {
            if (err) {
                callback(-1); //修改失败
                return;
            }
            callback(1); //修改成功
        });
    });
}
//聚合查询  将专业一样的数据合并 并且把每条数据所对应的班级push进banji数组中 并且记录总数
studentSchema.statics.changeDh = function (callback) {
    this.aggregate([
        {
            $group: {
                _id: '$speci',
                zongshu: { $sum: 1 },
                banj: { $push: '$grads' }
            }
        }
    ]).exec(function (err, results) {
        if (err) {
            callback(-1);//-1失败
            return;
        }
        // console.log(results);
        results.forEach(function (item, idx) {
            //去重并统计总数
            item.banj = item.banj.reduce((pre, cur) => {
                if (cur in pre) {
                    pre[cur]++
                } else {
                    pre[cur] = 1
                }
                return pre
            }, {})
        })
        // console.log(results);

        callback(results);
    })

}
//聚合查询  查询指定专业和班级
studentSchema.statics.changeZd = async function (grads, speci, a, page, callback) {
    // console.log(speci,grads,a,page);
    //分页:
    let pageSize = 9; //一页9条数据
    let start = (page - 1) * pageSize; //起始位置

    var arr = [
        {
            speci: speci,//查询指定专业
            grads: { $eq: grads }//查询指定班级  与指定值相等

        },
        {
            speci: speci,//查询指定专业
            grads: { $ne: grads }//查询指定班级  与指定值不相等

        }
    ]

    let count = await this.aggregate([
        {
            $match: arr[a]
        }
    ]) //获取数据总条数
    // console.log(count.length);

    this.aggregate([
        {
            $match: arr[a]
        },
        {//排序
            $sort: {
                'sid': 1
            }
        },
        {//起始位置
            $skip: start
        },
        {//截取几条
            $limit: pageSize
        }
    ]).exec(function (err, results) {
        if (err) {
            callback(-1);//-1失败
            return;
        }

        // console.log(results); 
        // return;

        callback({
            results,//9条数据
            count: count.length, //数据总条数
            length: Math.ceil(count.length / pageSize), //一共多少页
            now: page // 当前在那一页
        });
    })

}
//通过正则做模糊搜索
studentSchema.statics.findStudentNames = function (reg, callback) {
    let a = null
    if (parseInt(reg).toString() === "NaN") {
        reg = new RegExp(reg, 'g');
        a = 0
    } else {
        let k = 'name'
        a = 1
    }
    var arr = [
        { name: { $regex: reg } },
        { sid: reg }
    ]

    this.find(arr[a], (err, results) => {
        if (err) {
            callback({ error: 0, data: null });
            return;
        }
        // console.log(results);
        // return;
        callback({ error: 1, data: results });
    }
    );
}
//将学生输出导出为excel表
studentSchema.statics.exportExcel = function (grads, speci, a, callback) {
    //如果是导出动画学院全部数据
    if(a == -1){
        this.aggregate([
            {
                $project: {
                    _id: 0,  //不显示_id字段
                }
            },
            {
                $sort: {
                    'sid': 1
                }
            },
        ]).exec(function (err, results) {
            if (err) {
                callback(-1);//-1失败
                return;
            }
    
            // console.log(results); 
            // return;
    
            callback(results);
        })
        
        return;
    }
    var arr = [
        {
            speci: speci,//查询指定专业
            grads: { $eq: grads }//查询指定班级  与指定值相等

        },
        {
            speci: speci,//查询指定专业
            grads: { $ne: grads }//查询指定班级  与指定值不相等

        }
    ]

    this.aggregate([
        {
            $match: arr[a]
        },
        {
            $sort: {
                'sid': 1
            }
        },
        {
            $project: {
                _id: 0,  //不显示_id字段
            }
        }
    ]).exec(function (err, results) {
        if (err) {
            callback(-1);//-1失败
            return;
        }

        // console.log(results); 
        // return;

        callback(results);
    })
}
//添加学生
studentSchema.statics.saveStudent = function (data, callback) {
    //查询表里所有sid字段 _id字段自动查询
    this.find({}, { sid: 1 }).sort({ sid: -1 }).limit(1).exec(function (err, results) {
        if (err) {
            callback({ error: 0, msg: '保存失败' });
            return;
        }
        console.log(data);
        
        //resutls : [{_id:23423,sid:11}]  data : {name:xxx,age:xxx,sex:xxx}
        let sid = results.length > 0 ? Number(results[0]['sid']) + 1 : 100001; //设置学号
        let student = new Student({
            ...data,
            sid
        });
        student.save(err => {
            if (err) {
                callback({ error: 0, msg: '保存失败' });
                return;
            }
            callback({ error: 1, msg: '保存成功' });
        })

    })
}
//删除学生
studentSchema.statics.deleteStudent = function (sid, callback) {
    this.find({ sid }, (err, results) => {
        //results [{_id:23423,name:xxx}]
        var somebody = results[0];
        somebody.remove(err => {
            if (err) {
                callback({ error: 0, msg: '删除失败' });
                return;
            }
            callback({ error: 1, msg: '删除成功' });
        });
    })
}

//2.初始化Student类 该类会声明一个名为students的集合
let Student = mongoose.model('anmat', studentSchema);

//3.导出集合
module.exports = Student;