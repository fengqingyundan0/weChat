// pages/game/game.js

const app = getApp();

Page({
  data: {
    swiperHeight: 500,
    tabList: [
      {
        text: 3000,
        data: []
      },
      {
        text: 5000,
        data: []
      },
      {
        text: 10000,
        data: []
      }
    ],
    gameItem: {
      text: '',
      data: []
    },
    //存放滑动视图的current
    current: 0,
    //分页标签class条件判断的值
    tabArr: {
      tabCurrentIndex: 0
    },
    x: 0,
    y: 0,
    value: 30,
    progress_txt: '正在匹配中...',
    count: 0, // 设置 计数器 初始为0
    countTimer: null // 设置 定时器 初始为null
  },
  //分页选择
  veHandle: function (e) {
    //每个分页标签都设置了data-index,触摸触发事件获取此数值
    //用此数值替换滑动视图的current
    //用此数值替换分页标签class判断的值
    // console.log(e.target.dataset.index)
    var currentIndex = e.target.dataset.index;
    this.setData({
      current: currentIndex,
      "tabArr.tabCurrentIndex": currentIndex,
      gameItem: this.data.tabList[currentIndex]
    })
  },
  // 初始化数据
  initData: function(){
    let _this = this;
    let stepData = {
      one: [
        {
          phase: 20180804,
          totalAmount: 3000,
          totalPeople: 3000
        },
        {
          phase: 20180803,
          totalAmount: 2999,
          totalPeople: 2999,
          reachPeople: 2000,
          profit: 1000
        },
        {
          phase: 20180802,
          totalAmount: 2998,
          totalPeople: 2998,
          reachPeople: 1000,
          profit: 500
        }
      ],
      two: [
        {
          phase: 20180804,
          totalAmount: 5000,
          totalPeople: 5000
        },
        {
          phase: 20180803,
          totalAmount: 5999,
          totalPeople: 5999,
          reachPeople: 5000,
          profit: 5000
        },
        {
          phase: 20180802,
          totalAmount: 5998,
          totalPeople: 5998,
          reachPeople: 5000,
          profit: 500
        }
      ],
      three: [
        {
          phase: 20180804,
          totalAmount: 8000,
          totalPeople: 8000
        },
        {
          phase: 20180803,
          totalAmount: 8999,
          totalPeople: 8999,
          reachPeople: 8000,
          profit: 8000
        },
        {
          phase: 20180802,
          totalAmount: 8998,
          totalPeople: 8998,
          reachPeople: 8000,
          profit: 800
        }
      ]
    }
    // 模拟请求时间
    setTimeout(function(){
      _this.setData({
        ["gameItem.text"]: 3000,
        ["gameItem.data"]: stepData.one,
        ["tabList[0].data"]: stepData.one,
        ["tabList[1].data"]: stepData.two,
        ["tabList[2].data"]: stepData.three,
      });
      console.log(this.data.tabList);
    }.bind(this),2000)
    console.log(this.data.tabList);
  },
  // 报名
  enterFor: function(e){
    // console.log(e.currentTarget.dataset);
    // wx.showToast({
    //   title: '报名成功'
    // })
    wx.showLoading({
      title: '订单提交中',
      mask: true
    })
    let _this = this;
    console.log(e);
    let step = e.currentTarget.dataset.text;
    let stepType = step === 3000 ? 1 : (step === 5000 ? 2 : (step === 10000 ? 3: false));
    // let fee = stepType === 1 ? 1 : (stepType === 2 ? 3 : (stepType === 3 ? 5 : false));
    let fee = 0.01;
    let url = '/api/index/weiXinPrepay';
    let data = {
      fee: fee,
      type: stepType
    }
    // console.log(stepType);
    console.log(stepType);
    console.log(fee);
    if(stepType && fee){
      // console.log('22')
      app.post(url, data, function(res){
        console.log(res);
        console.log(res.data.data.data.timeStamp)
        wx.requestPayment({
          timeStamp: res.data.data.data.timeStamp,
          nonceStr: res.data.data.data.nonceStr,
          package: res.data.data.data.package,
          signType: res.data.data.data.signType,
          paySign: res.data.data.data.paySign,
          success: res2 =>{
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            })
            let url2 = '/api/index/checkWeiXinPay'
            let data2 = {
              out_trade_no: res.data.data.data.out_trade_no
            }
            app.post(url2, data2, function(res3){
              console.log(res3);
            })
          },
          fail: res2 => {
            console.log('支付失败');
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 3000
            })
          },
          complete: () => {
            wx.hideLoading();
          }
        })
      })
    }else{
      wx.showToast({
        title: '客户端错误',
        icon: 'none'
      })
    }
  },
  //监听滑块
  swiperChange: function (e) {
    //获取视图滑块当前的current
    //用此数值替换分页标签的current的值
    // console.log(e.detail.current)
    var swiperCurrent = e.detail.current;
    this.setData({
      'tabArr.tabCurrentIndex': swiperCurrent
    })
    if (swiperCurrent == 1) {
      this.setData({
        swiperHeight: 60
      })
    } else {
      this.setData({
        swiperHeight: 500
      })
    }
  },
  //旋转缩小动画效果
  rotate: function () {
    var angle = this.data.value * 3.6;
    if(angle <= 180){
      this.animation.rotate(angle).step()
      this.setData({
        animationDataLeft: this.animation.export()
      })
    }else{
      this.animation.rotate(180).step()
      this.setData({
        animationDataRight: this.animation.export()
      })
      var angleL = angle - 180;
      this.animation.rotate(angleL).step()
      this.setData({
        animationDataLeft: this.animation.export()
      })
    }
    // setTimeout(function () {
    //   this.animation.rotate(0).scale(1, 1).step()

    //   this.setData({
    //     animationData: this.animation.export()
    //   })
    // }.bind(this), 1500)
  },

  drawProgressbg: function () {
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res.model)
        // console.log(res.pixelRatio)
        // console.log(res.windowWidth)
        // console.log(res.windowHeight)
        // console.log(res.language)
        // console.log(res.version)
        // console.log(res.platform)
        var winWidth = res.windowWidth;
        var rx = ((winWidth/750) * 369) / 2
        // 使用 wx.createContext 获取绘图上下文 context
        var ctx = wx.createCanvasContext('canvasProgressbg')
        ctx.setLineWidth(4);// 设置圆环的宽度
        ctx.setStrokeStyle('#20183b'); // 设置圆环的颜色
        ctx.setLineCap('round') // 设置圆环端点的形状
        ctx.beginPath();//开始一个新的路径
        ctx.arc(110, 110, 100, 0.75 * Math.PI, 0.25 * Math.PI, false);
        //设置一个原点(100,100)，半径为90的圆的路径到当前路径
        ctx.stroke();//对当前路径进行描边
        ctx.draw();
      }
    })
  },
  drawCircle: function (step,rx) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#2661DD");
    gradient.addColorStop("0.5", "#40ED94");
    gradient.addColorStop("1.0", "#5956CC");

    context.setLineWidth(rx*0.16);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(rx, rx, rx-rx*0.15, 0.75 * Math.PI, 0.75 * Math.PI + step * Math.PI, false);
    context.stroke();
    context.draw()
  },
  countInterval: function () {
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    // this.countTimer = setInterval(() => {
    //   if (this.data.count <= 60) {
    //     /* 绘制彩色圆环进度条  
    //     注意此处 传参 step 取值范围是0到2，
    //     所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
    //     */
    //     this.drawCircle(this.data.count / (60 / 2))
    //     this.data.count++;
    //   } else {
    //     this.setData({
    //       progress_txt: "匹配成功"
    //     });
    //     clearInterval(this.countTimer);
    //   }
    // }, 100)
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res.model)
        // console.log(res.pixelRatio)
        // console.log(res.windowWidth)
        // console.log(res.windowHeight)
        // console.log(res.language)
        // console.log(res.version)
        // console.log(res.platform)
        var winWidth = res.windowWidth;
        var rx = ((winWidth / 750) * 369) / 2;
        _this.countTimer = setInterval(() => {
          if (_this.data.count <= 50) {
            _this.drawCircle(_this.data.count / (100 / 1.5), rx)
            _this.data.count++;
          } else {
            _this.setData({
              progress_txt: "匹配成功"
            });
            clearInterval(_this.countTimer);
          }
        }, 100)
      }
    })

  },
  enroll: function(){
    wx.showToast({
      title: 'enroll',
      duration: 1500
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
    // this.drawProgressbg();
    // this.drawCircle(2);

    // this.countInterval();
    
    // const ctx = wx.createCanvasContext('myCanvas')
    // ctx.setFillStyle('red')
    // ctx.fillRect(10, 10, 150, 75)
    // ctx.draw()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log('onReady--game');
    // console.log(this.data.test);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      transformOrigin: '50% 50% 0'
    })
    this.animation = animation;
    setTimeout(function(){
      this.rotate();
    }.bind(this),200)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide--game');
    console.log(this.data.test);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload--game');
    console.log(this.data.test);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh--game');
    console.log(this.data.test);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom--game');
    console.log(this.data.test);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('onShareAppMessage--game');
    console.log(this.data.test);
  }
})