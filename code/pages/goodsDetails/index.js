// pages/goodsDetails/index.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: 500,
    goodsInfo: {},
    //存放滑动视图的current
    current: 0,
    //分页标签class条件判断的值
    tabArr: {
      tabCurrentIndex: 0
    },
    goodsId:null,
  },
  gotoSponsor: function(){
    console.log('跳转至另一个小程序并传参');
    // wx.navigateToMiniProgram({
    //   appId: '',
    //   path: 'pages/index/index?id=123',
    //   extraData: {},
    //   envVersion: 'develop',
    //   success(res) {
    //     // 打开成功
    //   }
    // })
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
      "tabArr.tabCurrentIndex": currentIndex
    })
    if(currentIndex == 1){
      this.setData({
        swiperHeight: 60
      })
    }else{
      this.setData({
        swiperHeight: 500
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
  freExchange:function(){
    console.log(this.data.goodsId);
  },
  // 获取初始数据
  initData: function(goodId){
    var _this = this;
    let url = '/api/goods/goodDetail';
    let data = {
      goods_id: goodId
    }
    app.post(url, data, function (res) {
      console.log(res);
      let data = res.data.data;
      _this.setData({
        goodsInfo: {
          imgUrls: data.good.images,
          title: data.good.name,
          needStep: data.good.number,
          surplus: data.good.repertory
        },
        goodsId: goodId
      })
      wx.hideLoading();
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    this.initData(options.id);

    // wx.showModal({
    //   title: '提示',
    //   content: '没了',
    //   showCancel: false,
    //   success: function(e){
    //     console.log(e)
    //   }
    // })

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
    // console.log(x)
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