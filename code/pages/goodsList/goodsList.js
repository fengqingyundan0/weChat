// pages/goodsList/goodsList.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
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
  //商品兑换
  goodsExchange: function (e) {
    if (app.weChat.weRunData) {
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
    } else {
      app.equipmentClose();
    }
  },
  jin: function () {
    wx: wx.navigateTo({
      url: '/pages/particul/partic'
      //  success: function(res) {},
      //  fail: function(res) {},
      //  complete: function(res) {},
    })
  },
  onTabItemTap: function(item){
    console.log(item);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onlad')
    this.setData({
      goodsList: getApp().globalData.goods
    })
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
    console.log('show')
    // wx.hideTabBar();
    // if (app.weChat.weRunData) {
    //   // wx.switchTab({
    //   //   url: '/pages/index/index'
    //   // })
    //   // wx.navigateBack();
    //   app.equipmentClose();
    // }
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})