class Login {
    constructor() {
        this.json = null;
        this.key = true;
        this.myRotateVerify = null;
        this.end();
    }
    end() {
        var _this = this
        // console.log(this);
        //登录
        $('.dl').on('click', () => {
            

            this.yanz()

        })
        //键盘回车
        $(document).on('keydown', (ev) => {
            if (ev.keyCode == 13) {

                this.yanz();
            }
        })


        //验证用户名是否正确
        $('#user').on('blur', this.blur.bind(this))

        //验证偶像
        $('#idol').on('blur', this.idol.bind(this))

        //忘记密码
        $('.fools').on('click', () => {
            if (this.key) {
                $('.dl').css('display', 'none')//登录隐藏
                $('.xg').css('display', 'block')//修改显示
                $('.b').css('display', 'block')//修改头像显示
                $('.file').css('display', 'block')//可以修改头像

                $('.log').css('top', '35px')//头部转换
                $('.fool').css('top', 0)//头部转换
                $('.fools').html('返回')//
                $('#passwd').css('display', 'none')//隐藏
                $('#idol').css('display', 'block')//默认内容转换
                $('.confirm').css('height', '51px')

                this.key = false;
            } else {
                $('.dl').css('display', 'block')//登录显示
                $('.xg').css('display', 'none')//修改隐藏
                $('#passwd').css('display', 'block')//密码框显示
                $('#idol').css('display', 'none')//偶像框隐藏
                $('.file').css('display', 'none')//可以修改头像
                $('.confirm').css('height', '0')//请输入新密码隐藏
                $('.b').css('display', 'none')//修改头像隐藏
                $('.log').css('top', '0px')//头部转换
                $('.fool').css('top', '35px')//头部转换
                $('.fools').html('忘记密码')//
                $('#idol').val('')//密保清空
                $('#confirm-passwd').val('')
                this.key = true;
            }
            $('.ipt').css('border-bottom', '1px solid #fff')//账号框变成白色
            $('#passwd').val('')//密码清空
            $('#user').val('')//账号清空
            $("#img").attr('src', `images/mr.jpg`)//头像默认

        })

        //修改
        $('.xg').on('click', this.fool.bind(this))


        //    点击x
        $(".cuo").click(function () {
            
            $(".yanz").css("display", "none");
            //重置滑块
            _this.myRotateVerify.resetSlide();
            $('.top-x').html('拖动滑块，使图片角度为正')
            $('.top-x').css('color','black')
        })
        //旋转验证
        this.myRotateVerify = new RotateVerify('#rotateWrap1', {
            initText: '转至正确角度',//默认
            slideImage: ['/img/01.jpg', '/img/02.jpg', '/img/03.jpg', '/img/04.jpg'],//arr  [imgsrc1,imgsrc2] 或者str 'imgsrc1'
            slideAreaNum: 50,// 误差范围角度 +- 10(默认)
            getSuccessState: function (res) {//验证通过 返回  true;
                console.log('例1' + res);
                
                $('.top-x').html('验证通过')
                $('.top-x').css('color','green')
                setTimeout(function (){
                    $(".yanz").css("display", "none");
                    _this.myRotateVerify.resetSlide();
                    $('.top-x').html('拖动滑块，使图片角度为正')
                    $('.top-x').css('color','black')
                    _this.login()
                },1000)
                
            }
        })
    }
    //登陆成功失败
    login() {
        
        $('.b').css('display', 'none')
        $('.file').css('display', 'none')//不能修改
        $('.fool').css('top', '35px')
        $('.log').css('top', 0)
        $('.confirm').css('height', '0px')
        $('#passwd').css('display', 'block')//隐藏
        $('#idol').css('display', 'none')//默认内容转换
        let user = $('#user').val();
        let pwd = $("#passwd").val();
        if (!user || !pwd) return;
        $.ajax({
            type: 'post',
            url: '/login',
            data: {
                user,
                pwd
            },
            success: (res) => {
                console.log(res);
                if (res == 1) {
                    alert('登录成功');

                    window.location.href = '/';
                } else if (res == -1) {
                    this.set('密码错误')
                    $('#hint').css('opacity', 1)

                } else if (res == -2) {
                    this.set('用户名不存在')
                    $('#hint').css('opacity', 1)

                }
            }
        })

    }
    //验证用户名
    blur() {
        if (!$('#user').val()) return;
        let user = $('#user').val();
        // console.log(user);

        $.ajax({
            type: 'propfind', //请求方式.
            url: '/login',
            data: {
                user
            },
            success: (res) => {
                // console.log(res);
                if (res.result) { //用户名正确
                    // console.log($('#user'));

                    $('#user').css('border-bottom', '1px solid #85d45d')
                    $("#img").attr('src', `images/${res.data.src}`)
                    $('#hint').css('opacity', 0)

                } else {
                    $('#user').css('border-bottom', '1px solid #ff0000')
                    $("#img").attr('src', `images/mr.jpg`)
                    this.set('用户名错误')
                }

            }
        })

    }
    //找回密码
    fool() {

        let user = $('#user').val();
        let idol = $('#idol').val();
        let pwd = $('#confirm-passwd').val()
        var form = new FormData($('#form')[0]);
        if (!user || !idol || !pwd) {
            $('#hint').css('opacity', 1)
            setTimeout(function () {
                $('#hint').css('opacity', 0)
            }, 1000)
            $('#hint p').html('请填写完整的信息')
            return;
        }
        $.ajax({
            type: 'delete',
            url: 'login',
            cache: false,
            processData: false,   // jQuery不要去处理发送的数据
            contentType: false,
            data: form,
            success: (res) => {
                console.log(res);
                if (res == 1) {
                    this.set('修改成功')
                    return
                }
                if (res == -2) {
                    this.set('账号输入错误')
                    return
                }
                if (res == -1) {
                    this.set('偶像输入错误')
                    return
                }
            }
        })
    }
    //验证偶像
    idol() {
        if (!$('#idol').val()) return;
        let idol = $('#idol').val();
        let user = $('#user').val()
        // console.log(idol);

        $.ajax({
            type: 'put', //请求方式.
            url: '/login',
            data: {
                idol,
                user
            },
            success: (res) => {
                console.log(res);
                if (res == 1) {
                    $('#idol').css('border-bottom', '1px solid #85d45d')
                    return;
                }
                if (res == -1) {
                    $('#idol').css('border-bottom', '1px solid #ff0000')
                    this.set('不是这个偶像')
                    return;
                }
                if (res == -2) {
                    $('#idol').css('border-bottom', '1px solid #ff0000')
                    this.set('用户名错误')
                    return;
                }

            }
        })
    }
    set(con) {
        $('#hint').css('opacity', 1)
        setTimeout(function () {
            $('#hint').css('opacity', 0)
        }, 1000)
        $('#hint p').html(con)
    }
    yanz() {
        if(!$('#user').val() || !$("#passwd").val()){
            this.set('请填写完整信息')
            $('#hint').css('opacity', 1)
            return;
        }
        
        $('.yanz').css('display', 'block') 
    }

}