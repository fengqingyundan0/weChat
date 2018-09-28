// pages/my/my.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currency:1,
    cci:1,
    invitation:1
  },

  // 我的兑换
  myExchange: function(e){
    console.log(e);
    wx.showToast({
      title: 'nihao',
      icon: 'success',
      duration: 1500
    })
  },

  //跳转_赚步攻略
  strategy: function () {
    wx.navigateTo({
      url: '../strategy/strategy'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      console.log(app)
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
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
  csRouter:function(){
    console.log(this.data.userInfo);
    var Info = this.data.userInfo;
    var code = app.globalData.code;
    console.log(Info)
    console.log(code)
    wx.request({
      url: 'https://bu.quewzw.com/api/index/getUser', //接口地址
      data: {
        code:code,
        img: Info.avatarUrl,
        city: Info.city,
        nickname: Info.nickName
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  gold:function(){
    wx.navigateTo({
      url: '/pages/gold/gold',
    })
  },
  ready:function(){
    wx.navigateTo({
      url: '/pages/ready/ready',
    })
  },
  problem:function(){
    wx.navigateTo({
      url: '/pages/problem/problem',
    })
  },
  contact:function(){
    wx.navigateTo({
      url: '/pages/contact/contact',
    })
  },
  take:function(){
    wx.navigateTo({
      url: '/pages/take/take',
    })
  }
})