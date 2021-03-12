class Index {
    constructor(name, name2) {

        this.page = 1; //默认页
        this.init()
    }
    //获取数据
    init() {

        console.log(1);

        var _this = this
        $.get('/student/dh', (res)=>{
            console.log(res);
            this.renderDom(res);

        }, 'json');
    }

    renderDom(data) {
        if (data.error.length > 0) {
            //渲染DOM
            $('.tbody').empty();
            $.each(data.error, function (idx, item) {

                for (var i in item.banj) {

                    var tr = $('<tr></tr>');
                    tr.html(`
                        <td>${item._id}</td>
                        <td>${i}班</td>
                        <td>${item.banj[i]}</td>
                        <td>${item.zongshu}</td>
                        
                `);
                    tr.appendTo($('.tbody'));
                    
                }

            })
        }
    }


}