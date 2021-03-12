class Manage {
    constructor() {
        this.page = 1//全部学生的分页
        this.page2 = 1//查询指定专业班级学生的分页
        this.see = null;//查询学生的对象
        this.num = true;//判断是指定专业班级查询   还是首页进来渲染
        this.grads = '全部';
        this.speci = '全部';
        this.ajax();
        //不能放 ajax的成功回调里  不然jq会重复绑定事件
        this.ben();
    }
    ajax() {
        $.ajax({
            type: 'get',
            url: '/student/msg',
            data: {
                page: this.page
            },
            success: (data) => {

                console.log(data);

                this.init(data, 1)

            }
        })
        //下拉框数据
        $.ajax({
            type: 'get',
            url: '/student/dh',
            success: (data) => {
                console.log(data);

                //渲染下拉数据库
                this.sele(data)
            }
        })
    }
    init(data, num) {
        var _this = this;
        if (data.results.length > 0) {
            //渲染DOM
            $('.listb').empty();
            $.each(data.results, function (idx, item) {
                var tr = $('<tr></tr>');
                tr.html(`
                <td contenteditable="true">${item.speci}</td>
                <td contenteditable="true">${item.grads}班</td>
                <td contenteditable="true">${item.sid}</td>
                <td class='tdname' contenteditable="true">${item.name}</td>
                <td class='tdsex' contenteditable="true">${item.sex}</td>
                <td class='tdage' contenteditable="true">${item.age}</td>
                <td ><a data-sid="${item.sid}" href="#" class="templatemo-link xg">修改</a></td>
                <td ><a data-sid="${item.sid}" href="#" class="templatemo-link del">开除</a></td>
            `);
                tr.appendTo($('.listb'));
            })
            //渲染分页:
            pagination.init({
                wrapid: 'wrap', //页面显示分页器ID
                total: data.count, //总数据条数
                pagesize: 9, //每页3条数据
                currentPage: num == 1 ? _this.page : _this.page2, //当前页
                onPagechange: function (n) {
                    //页面改变时触发， 参数 n 你点击分页的索引
                    // console.log(n);
                    // _this.page = n;
                    // console.log(_this.page,_this.page2);
                    if (num) {
                        _this.page = n;
                        _this.ajax()
                    } else {
                        _this.page2 = n;
                        _this.cx();
                    }


                }
            })
        } else {
            //本页数据为0的话 就页数-1 就跳到上一页 重新渲染
            //因为data.results.length 获取到的是当前页的数据
            if (_this.page > 1) {
                _this.page -= 1;
                _this.ajax();
            } else {              //如果 页数小于1  就是没数据了     
                $('#wrap').empty();
                $('.listb').html('暂无数据');
            }
            //指定专业班级  查询
            if (_this.page2 > 1) {
                _this.page -= 1;
                _this.cx();
            } else {              //如果 页数小于1  就是没数据了     
                $('#wrap').empty();
                $('.listb').html('暂无数据');
            }
        }
    }
    //事件
    ben() {
        var _this = this;
        //开除学生
        $('.listb').delegate('.del', 'click', function () {
            console.log(1);

            var _confirm = confirm('确认删除?');
            if (!_confirm) return;
            var sid = $(this).attr('data-sid');
            // console.log(sid);

            _this.del(sid)

        })


        //搜索框实时查询
        $('.cha').on('input', this.sees.bind(this))


        //回车 列表替换成查询的学生  
        $('.cha').on('keydown', function (e) {
            if (e.keyCode == 13) {
                //console.log('回车');
                // console.log(_this.see);

                _this.see.results && _this.init(_this.see);
            }
        })


        //点击查询搜索框替换成学生
        $('.fas').on('click', function () {

            _this.see.results && _this.init(_this.see);
        });

        //修改学生数据
        $('.listb').delegate('.xg', 'click', function () {
            var ind = $('.xg').index(this)
            var name = $('.tdname').eq(ind).html();
            var sex = $('.tdsex').eq(ind).html();
            var age = $('.tdage').eq(ind).html()
            var sid = $(this).attr('data-sid')
            console.log(name, sex, age, sid);

            if (sex != '男' && sex != '女') {
                alert('请输入正确的性别');
                return;
            }
            if (isNaN(age)) {
                alert('请输入数字年龄');
                return;
            }
            _this.xg(sid, name, sex, age)

        })

        //查询指定专业班级
        $('.cxun').on('click', () => {
            this.key = false;
            this.page2 = 1
            _this.cx()
        })


        //导出表格
        $('.dchu').on('click', function () {
            _this.dchu();
        })
    }
    //删除学生
    del(sid) {
        var _this = this
        $.ajax({
            url: '/student/' + sid,
            type: 'delete',
            success(res) {
                console.log(res);
                if (res.error) {
                    alert(res.msg);
                    console.log(_this.key);

                    _this.key == true ? _this.ajax() : _this.cx();
                } else {
                    alert(res.msg);
                }
            }
        })
    }
    //搜索框查询学生
    sees() {


        var _this = this;
        var val = $('.cha').val();
        // console.log(val);
        if (!val) {//如果输入为空 则显示全部数据
            _this.see = {};
            this.ajax();
            return;
        }
        $.get('/student/search', { search: val }, function (res) {
            console.log(res);
            // return;
            $('#dataList').empty();
            if (res.data.length > 0) {
                //设置全局搜索数据格式
                $.each(res.data, function (idx, item) {

                    var option = $('<option></option>');
                    option.val(item.name);
                    option.text(item.name);
                    option.appendTo($('#dataList'));
                })
                _this.see = {
                    count: res.data.length,
                    now: 1,
                    results: res.data
                }
            }
        })
    }
    //修改数据
    xg(sid, name, sex, age) {
        $.ajax({
            type: 'post',
            url: '/student/' + sid,
            data: {
                name,
                sex,
                age
            },
            success(res) {
                console.log(res);

            }
        })
    }
    //专业sele
    sele(data) {
        var _this = this;
        var opt = '<option value=-1>全部</option>'
        var opt2 = '<option >全部</option>'
        data.error.forEach(function (item, idx) {
            opt += `
                <option value=${idx}>${item._id}</option>
            `

        })

        $('.zy').empty()
        $('.zy').html(opt)
        //根据专业渲染对应的班级
        $('.zy').change(function () {
            _this.grads = '全部';
            var index = $(".zy option:selected").val()
            _this.speci = $(".zy option:selected").text()
            if (index == -1) {
                $('.bj').html('<option >全部</option>')

                return;
            };

            for (var i in data.error[index].banj) {
                // console.log(i);// 1 2
                opt2 += `
                    <option value=${i}>${i}班</option>
                `

            }
            $('.bj').empty()
            $('.bj').html(opt2)

            opt2 = '<option >全部</option>'

        })

        //获取选中的班级
        $('.bj').change(function () {
            _this.grads = $(".bj option:selected").text()
        })

    }
    //查询指定班级
    cx() {
        if (this.speci == '全部') {
            this.ajax()
            this.page = 1
            this.key = true;
            return;
        };
        // console.log(this.grads,this.speci);

        var _this = this

        $.ajax({
            type: 'get',
            url: '/student/cx',
            data: {
                page: this.page2,
                grads: this.grads,
                speci: this.speci
            },
            success(res) {
                // console.log(res);
                _this.init(res, 0)

            }
        })
    }

    //导出表格
    dchu() {
        var _this = this
        var a = ''
        var b = ''
        if(this.speci == '全部'){
            a = '动画学院全部学生数据'
            b = ''
        }else{
            a = this.speci
            if(this.grads == '全部'){
                b = ''
            }else{
                
                b = this.grads
            }
            
        }
        $.ajax({
            type: 'get',
            url: '/student/exportExcel',
            data: {
                grads: this.grads,//班级
                speci: this.speci//专业
            },
            success(res) {
                // console.log(res);
                
                //列标题，逗号隔开，每一个逗号就是隔开一个单元格
                let str = `学号,姓名,性别,年龄,班级,专业\n`;
                //增加\t为了不让表格显示科学计数法或者其他格式
                for (let i = 0; i < res.length; i++) {
                    for (let item in res[i]) {
                        str += `${res[i][item] + '\t'},`;
                    }
                    str += '\n';
                }
                //encodeURIComponent解决中文乱码
                let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
                //通过创建a标签实现
                let link = document.createElement("a");
                link.href = uri;
                //对下载的文件命名
                link.download = a+b+".csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
              
            }
        })
    }
}