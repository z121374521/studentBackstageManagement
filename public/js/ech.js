class Ech {
    constructor(name, name2) {
        this.json = null;
        this.page = 1; //默认页
        this.init()
    }

    ben() {
        var _this = this
        //班级
        $('.grads').on('click',function (){
            _this.grads()
        })

        //专业
        $('.speci').on('click',function (){
            _this.speci()
        })
    }

    //获取数据
    init() {
        var _this = this
        $.get('/student/dh', (res) => {
            // console.log(res);
            this.json = res.error
            console.log(this.json);
            
            this.renderDom();
            this.speci()
            this.ben()
            
        });
    }

    //图表默认
    renderDom() {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        this.option = {
            title: {
                textStyle: {
                    fontSize: 20,

                },
                text: '动画学院'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: 'red'
                    },
                
                },
                backgroundColor:'#007bff',
                

            },
            lineStyle: {
                // 线条颜色
                color: 'black'
            },
            legend: {
                data: ['人数'],

            },
            grid: {

                left: '2%',
                right: '3%',
                bottom: '0%',
                containLabel: true
            },
            axisLabel:{
                rotate:76
            },
            toolbox: {
                top: '6%',
                feature: {
                    restore: {},
                    dataView: {},
                    dataZoom: {},
                    magicType: {
                        type: ['line', 'bar']
                    },
                    saveAsImage: {},
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                type: 'category',
                axisLabel:{
                    rotate:70,
                    rnterval:10,
                    textStyle: { //改变刻度字体样式
                        color: '#007bff'
                    }

                }
            },
            //数据集合 一系列图的集合
            dataset: {
                //0 1 2是竖着排列的 

                source: [
                    // ["1900年01月",8],
                    // ["1986年02月",1],
                    // ["2017年03月",3],
                    // ["2020年04月",5],
                    // ["2027年05月",6],
                    // ["1900年06月",8],
                    // ["1986年07月",9],
                    // ["2017年08月",5],
                    // ["2020年09月",3],
                    // ["2027年10月",1],
                    // ["袜子",20,32,]
                ]
            },
            yAxis: {
                type: 'value',
                minInterval: 1
            },
            series: [
                {
                    name: '人数',
                    type: 'line',
                    stack: '总量',
                    // data: [120, 132, 101, 134, 90, 230, 210]
                    encode: { x: 0, y: 1 },

                },

            ]
        };

        // this.myChart.setOption(this.option);
    }

    //渲染专业图表
    speci() {
        this.option.dataset.source = []
        this.option.xAxis.axisLabel.textStyle.color = '#007bff'
        this.option.lineStyle.color =  '#007bff'
        this.option.tooltip.backgroundColor = '#007bff'
        this.myChart.showLoading()//显示加载条    
        var k = [];
        for (var i in this.json) {
            for (var j in this.json[i]) {
                //如果是对象的话 就跳出本次循环  因为this.json里面有班级对象
                if (typeof this.json[i][j] == 'object') {
                    continue;
                }

                k.push(this.json[i][j])
            }
            this.option.dataset.source.push(k)
            k = []
        }
        console.log(this.option.dataset.source);
        this.myChart.hideLoading()//取消加载条 
        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(this.option);
    }
    //班级
    grads() {
        this.option.dataset.source = []
        this.option.xAxis.axisLabel.textStyle.color = '#000'
        this.option.lineStyle.color =  '#000'
        this.option.tooltip.backgroundColor = '#000'
        this.myChart.showLoading()//显示加载条  
        var a= []  
        var k = [];
        for (var i in this.json) {

            for (var j in this.json[i]) {
                if (typeof this.json[i][j] == 'object') {
                    
                    for( var z in this.json[i][j]){
                        k.push(this.json[i]._id+z+'班')
                        k.push(this.json[i][j][z])
                        
                        // a.push(k)
                        this.option.dataset.source.push(k)
                        k = []
                    }
                }
                
            }
            
            
        }
        console.log(this.option.dataset.source);
        this.myChart.hideLoading()//取消加载条 
        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(this.option);
    }
}