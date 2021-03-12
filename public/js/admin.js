class Admin {
    constructor() {


        this.ajax()
        this.ben()
    }

    //获取管理员数据
    ajax() {
        var _this = this
        $.ajax({
            type: 'get',
            url: '/adli',
            success(res) {
                console.log(res);
                _this.init(res.res,res.c)
            }   
        })

    }

    init (res,c){  
        $('.adli').empty()
        var ad = ''
        for(var i =0; i < res.length; i++){
            // console.log(res[i].username);
            ad += `
            <div class="box templatemo-content-widget pink-bg">
                ${c != res[i].username?'<i data="'+res[i].username+'" class="fa xx fa-times"></i>':''}
                
                <img class="adimg" src="/images/${res[i].src}" alt="">
                <div class="addiv">
                    <h2>用户名: ${res[i].username}</h2>
                    <h5>注册时间: ${new Date(parseInt(res[i].posttime)).toLocaleString()}</h5>
                    
                    <h6>最后登陆时间:${new Date(parseInt(res[i].lastLoginTime)).toLocaleString()}</h6>
                </div>
            </div>
            `
        }
        $('.adli').append(ad)
        // console.log(ad);
        

    }

    ben (){
        var _this = this
        //删除管理员
        $('.adli').delegate('.xx','click',function (){
            var _confirm = confirm('确认删除管理员?');
            if( !_confirm ) return;
            // console.log(1);
            var ind = $('.xx').index(this)
            var user = $(this).attr('data')
            console.log(user,ind);
            
            _this.del(user,ind)
        })
    }

    //删除管理员
    del (user,ind){
        // console.log(user);
        // return;
        $.ajax({
            type:'post',
            url:'/delad',
            data:{
                user
            },
            success (res){
                console.log(res);
                // return;
                if(res.error==1){
                    alert('删除成功')

                    $('.xx').eq(ind).offsetParent().remove()
              
                }
                
                
            }
        })
    }
}