class Add {
    constructor(name, name2) {


        this.ajax()

    }
    ajax() {
        $.ajax({
            type: 'get',
            url: '/student/dh',
            success: (data) => {
                console.log(data);

                //渲染专业
                this.rad(data)
                this.ben()
            }
        })
    }

    ben() { 
        var _this = this
        //实时获取radio的选中值
        $("input[name='radio']").change(function () {
            
            if ($(this).val() == "自定义"  ) {
         
                $('#inputWithError').removeAttr('disabled')
            }else{

                $('#inputWithError').attr('disabled','disabled')
            }   
        })

        //重置
        $('.czhi').on('click',function (){
            // console.log(1);
            $('#inputWithError').attr('disabled','disabled')
            // $('.name').val('')
            // $('.sex').val('')
            // $('.age').val('')
            // $('.bji').val('-1')//重置select的值
            // // $("input[name='radio']").attr("checked",false); //取消radio的选中
            // $("input[name='radio']").removeAttr('checked')//取消radio的选中
        })

        //提交
        $('.tij').on('click',function (){
            var name = $('.name').val();
            var sex = $('.sex').val();
            var age = $('.age').val()
            var grads = null
            var speci = null
            // console.log(b);
            // return;
            
            if(!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test($('.name').val())){
                alert('请填写正确名字')
                return;
            }
            if(!/^男$|^女$/.test($('.sex').val())){
                alert('请填写正确性别')
                return;
            }
            if(!$('.age').val()){
                alert('请填写年龄')
                return;
            }
            if($('.bji').val() == -1){
                alert('请选择班级')
                return;
            }else{
                grads = $('.bji').val()
            }
            if(!$('input:radio:checked').val()){
                alert('请选择专业')
                return;
            }else{
                if($('input:radio:checked').val() == '自定义'){
                    if(!$('.zidy').val()){
                        alert('请填写专业')
                        return;
                    }
                    speci = $('.zidy').val()
                }else{
                    speci = $('input:radio:checked').val()
                }
            }
            
            console.log(name,age,sex,grads,speci);
            
            
            
            _this.add(name,age,sex,grads,speci)
        })

    } 
    //添加学生
    add(name,age,sex,grads,speci){
        $.ajax({
            type:'put',
            url:'/student/addStudent',
            data:{
                name,
                sex,
                age,
                grads,
                speci
            },
            success(res){
                console.log(res);
                
                if(res.error==1){
                    alert('添加学生成功')
                    $('.czhi').click()
                    $('#inputWithError').attr('disabled','disabled')
                }
            }
        })

    }


    //渲染专业
    rad(data) {
            var dio = ''
        for(var i = 0; i<data.error.length; i++){
            dio += `
            <div class="margin-right-15 templatemo-inline-block">
                <input type="radio" name="radio" id="r${i}" value="${data.error[i]._id}">
                <label for="r${i}" class="font-weight-400"><span></span>${data.error[i]._id}</label>
            </div>
            `
        }
        dio += `
        <div class="margin-right-15 templatemo-inline-block">
            <input type="radio" name="radio" id="r${i}" value="自定义">
            <label for="r${i}" class="font-weight-400"><span></span>自定义</label>
        </div>
        `
        $('.dio').empty()
        $('.dio').html(dio)
    }
}