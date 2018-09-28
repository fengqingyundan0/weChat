// pages/index2/index2.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 1, //进入页面时，默认选择第3个，如果不需要默认选中，去掉此语句即可；id从0开始    
    pres: [
      {
        preX: "好极了",
        img:"../../images/hjl-1.png"
      },
      {
        preX: "感觉不错",
        img: "../../images/gjbc.png"
      },
      {
        preX: "有点懒",
        img:"../../images/ydl.png"
      }
    ], 
    userInfo: {},
    step: {
      myStep: 0,
      frStep: 0,
      totalStep: 0
    },
    flag:true,
    goodsList: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animationData: {},
    animatData: {},
    imgUrls: [],
    authorizeModal: false,
    signModal: false,
    signChecked: true,
    signId: null,
    signFormId: null,
    addBNum: 0,
    goodsModal: false,
    goodsInfo: {}
  },
  // {
      //   "pagePath": "pages/game/game",
      //   "text": "奖金赛",
      //   "iconPath": "./images/djs.png",
      //   "selectedIconPath": "./images/djs2.png"
      // },app.json里面对应奖金赛的页面暂时拿掉
  // 初始化用户信息
  getInitData: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        // console.log(res)
        this.setData({
          userInfo: res,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  click:function(e){
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let up = "pres[" + 1 + "].img";
    let upQ = "pres[" + 0 + "].img";
    let upW = "pres[" + 2 + "].img"
    console.log(index);
    if(index == 1){
      console.log(up)
      this.setData({
        [up]: "../../images/gjbc-1.png",
        [upQ]: "../../images/hjl.png",
        [upW]:"../../images/ydl.png"
      })
    }else if(index == 2){
      this.setData({
        [up]: "../../images/gjbc.png",
        [upQ]: "../../images/hjl.png",
        [upW]: "../../images/ydl-1.png"
      })
    }else if(index ==0){
      this.setData({
        [up]: "../../images/gjbc.png",
        [upQ]: "../../images/hjl-1.png",
        [upW]: "../../images/ydl.png"
      })
    }
  },
  // 初始化步数以及商品信息
  getInitStepAndGoods: function () {
    if (app.globalData.step.upData) {
      // console.log(app.globalData.step);
      this.setData({
        step: app.globalData.step,
        goodsList: app.globalData.goods
      })
      // console.log(this.data.step);
      wx.hideLoading();
    } else {
      app.initGolbalDataCallback = (step, goods) => {
        // console.log(step);
        // console.log(goods);
        this.setData({
          step: step,
          goodsList: goods
        });
        wx.hideLoading();
        // console.log(this.data.step);
      }
    }
  },
  onMyste:function(){
    this.setData({flag:false})
  },
  onYao:function(){
    this.setData({flag:true})
  },
  // 手动获取用户信息
  getUserInfo: function (e) {
    app.login(app.initGolbalData);
  },
  // 用户不进行授权事件
  onCancel: function (e) {
    this.closeAuthorizeModal();
  },
  //关闭授权弹窗
  closeAuthorizeModal: function () {
    this.setData({
      authorizeModal: false
    });
  },
  // 自定义弹窗背景通用蒙版
  catchTouchMove: function (res) {
    return false;
  },
  //跳转至规则页面
  rule: function () {
    wx.navigateTo({
      url: '../rules/rules'
    })
  },
  //签到弹窗显示
  signIn: function () {
    if (app.weChat.weRunData){
      var _this = this;

      var url = '/api/user/sign';
      var data = {};
      app.post(url, data, function (res) {
        console.log(res);
        // console.log(res.data.status);
        // console.log(res.data.status == 0 ? 't' : 'f')
        if (res.data.status == 1) {

          _this.setData({
            signModal: true,
            addBNum: res.data.data.bu_coin,
            signId: res.data.data.id
          })
        } else if (res.data.status == 0) {
          //
          // _this.setData({
          //   signModal: true
          // })
          wx.showToast({
            title: res.data.info,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '未知错误',
            icon: 'none',
            duration: 1500
          })
        }
      })
    }else{
      app.equipmentClose();
    }
  },
  // 关闭签到弹窗
  closeSignModal: function(){
    this.setData({
      signModal: false
    })
  },
  //签到通知复选框
  signTz: function (e) {
    this.setData({
      signChecked: !this.data.signChecked
    })
  },
  //签到表单Submit
  signSubmit: function(e){
    var _this = this;
    // console.log(e);
    var status = this.data.signChecked ? 1 : 2;
    var url = '/api/user/signNotice';
    var data = {
      id: this.data.signId,
      status: status,
      formid: e.detail.formId
    };
    app.post(url, data, function(res){
      console.log(res);
      if(res.data.status == 1){
        _this.setData({
          signModal: false
        })
      }else if(res.data.status == 0){
        wx.showToast({
          title: '设置失败',
          icon: 'none',
          duration: 1500
        })
      }else{
        wx.showToast({
          title: '未知错误',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //签到表单Reset
  signReset: function(){
    console.log(`签到表单Reset`);
  },
  //旋转缩小动画效果
  rotate: function () {
    this.animation.rotate(360).scale(0, 0).step()
    this.setData({
      animationData: this.animation.export()
    })
    setTimeout(function () {
      this.animation.rotate(0).scale(1, 1).step()

      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this), 1500)
  },
  jin: function () {
   wx:wx.navigateTo({
     url: '/pages/particul/partic'
    //  success: function(res) {},
    //  fail: function(res) {},
    //  complete: function(res) {},
   })
  },
  //点击事件
  test: function (e) {
    console.log(e);
    wx.showToast({
      title: e.currentTarget.dataset.hi || 'test',
      icon: 'success',
      duration: 1500
    })
  },
  //商品兑换
  goodsExchange: function (e) {
    if(app.weChat.weRunData){
      // console.log(e);
      // console.log(this.data.goodsList[e.currentTarget.dataset.index])
      // var myStepNum = this.data.myStep + this.data.frStep;
      // var myStepNum = app.globalData.step.totalStep;
      var totalStep = this.data.step.totalStep;
      var goodsInfo = this.data.goodsList[e.currentTarget.dataset.index];
      console.log(goodsInfo);
      var needStepNum = goodsInfo.number;
      console.log(needStepNum);
      console.log(totalStep);
      this.setData({
        goodsInfo: goodsInfo
      })
      if (totalStep >= needStepNum) {
        wx.navigateTo({
          url: '/pages/goodsDetails/index?id=' + goodsInfo.id
        })
        // console.log("true");
      } else {
        // console.log("false");
        this.setData({
          goodsModal: true
        })
      }
    // console.log(this.data.goodsModal)
    // console.log(this.data.goodsInfo);
    }else{
      app.equipmentClose();
    }
  },
  // 图片广告处理
  advert: function(e){
    console.log(e);
  },
  showGoodsModal: function(e){
    this.setData({
      goodsModal: false
    })
  },
  // 装载数据
  loadData: function () {
    var imgUrls = [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ];

    this.setData({
      imgUrls: imgUrls,
    });
  },
  
  //监听转发事件
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/pages/index/index',
      success: function (res) {
        console.log(res);
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            console.log(res);
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    //模拟群分享
    wx.showShareMenu({
      withShareTicket: true
    })

    // 数据加载提示框开启
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })

    // 装载模拟数据
    this.loadData();

    // 初始化用户信息
    this.getInitData();
    // 获取步数商品等信息
    this.getInitStepAndGoods();
    // 判断用户是否授权
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.hideLoading();
          this.setData({
            authorizeModal: true
          })
        }
      }
    })
    // wx.startPullDownRefresh()
    // wx.stopPullDownRefresh()
    // console.log(opt);
    if (opt.scene == 1044) {
      wx.getShareInfo({
        shareTicket: opt.shareTicket,
        success: function (res) {
          console.log(res);
          var encryptedData = res.encryptedData;
          var iv = res.iv;
        }
      })
    }
    
    // console.log(app);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      // transformOrigin: '50% 50% 0'
    })
    this.animation = animation;
    this.setData({
      animatData:animation.export()
    })
    var n = 0;
    var m = true;
    setInterval(function(){
      n = n+1;
      // console.log(n);
      if(m){
        this.animation.scale(1.6,1.6).step()
        m = !m;
      }else{
        this.animation.scale(1, 1).step()
        m = !m;
      }
      this.setData({
        animatData:this.animation.export()
      })
    }.bind(this),300)
    // this.infoAndStep();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // wx.showToast({
    //   title: 'nihao',
    //   icon: 'success',
    //   duration: 1500
    // })
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})