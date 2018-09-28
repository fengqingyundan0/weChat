//app.js
App({
  onLaunch: function (ops) {
    this.login(this.initGolbalData);
    // var _this = this;
    // if (ops.scene == 1044) {
    //   console.log(ops.shareTicket)
    // }
    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 获取转发信息
  },

  //login 获取code更新key
  login: function(nextFun){
    var _this = this;
    // 获取code
    wx.login({
      success: res =>{
        _this.userAuth.code = res.code;
        //获取用户授权信息
        wx.getSetting({
          success: res2 =>{
            _this.weChat.authSetting = res2.authSetting;
            
            if (res2.authSetting['scope.userInfo']){
              //获取用户信息
              wx.getUserInfo({
                success: res3 =>{
                  _this.globalData.userInfo = res3.userInfo;

                  if (_this.userInfoReadyCallback){
                    _this.userInfoReadyCallback(res3.userInfo);
                  }
                  wx.request({
                    url: "https://bu.quewzw.com/api/index/getUser",
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    data: {
                      code: res.code,
                      img: res3.userInfo.avatarUrl,
                      city: res3.userInfo.city,
                      nickname: res3.userInfo.nickName
                    },
                    success: function(res4){
                      // console.log(res4)
                      // _this.userAuth.openId = res4.data.data.openid;
                      _this.userAuth.token = res4.data.data.token;
                      // console.log(nextFun);
                      if(nextFun){
                        nextFun();
                      }
                    },
                    fail: function(res4){
                      console.log(`login接口更新code失败`)
                      // console.log(res4)
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  },

  //获取初始全局信息
  initGolbalData: function(){
    var _this = this;
    //获取微信运动信息再请求全局信息
    wx.getWeRunData({
      success: res =>{
        // console.log(res);
        _this.weChat.weRunData = true;
      },
      fail: res =>{
        console.log(`获取微信运动信息失败`);
        // console.log(res);
        _this.weChat.weRunData = false;
        wx.hideLoading();
        _this.equipmentClose();
      },
      complete: res =>{
        console.log(res);
        let url = '/api/index/getUserByOpenid';
        let data = {
          weRunData: res.encryptedData,
          weRunIv: res.iv
        }
        _this.post(url, data, function (res2) {
          if (!res2.req) {
            // console.log(res2)
            _this.globalData.step.myStep = res2.data.data.user.my_bu_num ? res2.data.data.user.my_bu_num : 0;
            _this.globalData.step.frStep = res2.data.data.user.friends_give_bu_num ? res2.data.data.user.friends_give_bu_num : 0;
            _this.globalData.step.totalStep = res2.data.data.user.total_bu_num ? res2.data.data.user.total_bu_num : 0;
            // _this.globalData.step.totalStep = res2.data.data.user.my_bu_num + res2.data.data.user.friends_give_bu_num;

            _this.globalData.goods = res2.data.data.goods;

            _this.globalData.step.upData = true;

            if (_this.initGolbalDataCallback) {
              _this.initGolbalDataCallback(_this.globalData.step, res2.data.data.goods);
            }
          } else {
            console.log(`请检查`);
            console.log(res2)
          }
        })
      }
    })
  },

  //全局post请求
  post: function (url, data, callback) {
    var _this = this;
    var server = 'https://bu.quewzw.com'+url;
    // 检查session_key是否过期
    wx.checkSession({
      success: function(){
        var token = _this.userAuth.token;
        if (token){
          // console.log(data);
          wx.request({
            url: server, //接口地址
            data: data,
            header: {
              'Authorization': token,
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: callback
          })
        }else{
          callback({
            req: false,
            state: 1,
            info: 'token不存在'
          })
        }
      },
      fail: function(){
        callback({
          req: false,
          state: 2,
          info: 'session_key已过期'
        })
      }
    })
  },

  // 设备不支持处理
  equipmentClose: function () {
    wx.showToast({
      title: '该设备硬件不支持微信运动,请更换设备',
      icon: 'none',
      duration: 3000,
      mask: true
    })
  },
  userAuth:{
    openId: null,
    token: null,
  },
  weChat: {
    authSetting: {},
    weRunData:false
  },
  globalData: {
    userInfo: null,
    step: {
      myStep: 0,
      frStep: 0,
      totalStep: 0,
      upData: false
    },
    goods: [],
  }
})
