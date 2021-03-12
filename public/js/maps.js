class Maps{
    constructor() {

        this.key = true;
        this.ben()
    }

    ben (){
        var _this = this;
        
        $('.name').on('blur',function (){
            var val = $(this).val()
            // console.log(val==true);
            
            _this.cal('.name')
            if(!val) return;
            _this.yanz(val)
        })
        $('.pwd').on('blur',function (){
            _this.cal('.pwd')
        })
        $('.ido').on('blur',function (){
            _this.cal('.ido')
        })

        $('.go').on('click',()=>{
    
            var name = $('.name').val()
            var pwd = $('.pwd').val()
            var ido = $('.ido').val();
            // console.log($('.file').val());
            

            if( !name || !pwd || !ido) {
                alert('请填写完整信息')
            };
            if(!this.key){
                alert('用户名已存在')
            }
            // console.log(this.key);
            
            if(!this.key) return;
            this.ajax()
        })


    }

    ajax (){
        var form = new FormData($('#form')[0]);
        $.ajax({
            type:'post',
            url:'/addad',
            cache: false,
            processData: false,   // jQuery不要去处理发送的数据
            contentType: false,
            data: form,
            success:(res)=>{
                console.log(res);
                if(res.error){
                    alert('添加成功')
                    $('.res').click()
                    $('.name').removeClass('is-valid')
                    $('.pwd').removeClass('is-valid')
                    $('.ido').removeClass('is-valid')
                    $('#img').prop('src','/images/mr.jpg')
                }
            }
        })
    }

    cal( name){
        if( !$(name).val() ){

            $(name).addClass('is-invalid').removeClass('is-valid')
            $(name+'s').addClass('invalid-feedback').removeClass('valid-feedback')
            $('.names').html('Looks pei!')
        }else{
            $(name).removeClass('is-invalid').addClass('is-valid')
            $(name+'s').removeClass('invalid-feedback').addClass('valid-feedback')
        }
    }

    //
    yanz(user){
        $.ajax({
            type:'propfind',
            url:'/login',
            data:{
                user
            },
            success:(res)=>{
                console.log(res);
                if(res.result){
                    $('.name').addClass('is-invalid').removeClass('is-valid')
                    $('.names').addClass('invalid-feedback').removeClass('valid-feedback')
                    $('.names').html('用户名已存在')
                    this.key = false
                    console.log(this.key);
                    
                }else{
                

                    $('.name').removeClass('is-invalid').addClass('is-valid')
                    $('.names').removeClass('invalid-feedback').addClass('valid-feedback')
                    $('.names').html('ok')
                    this.key = true;
                }
                
            }
        })
    }
}