// pages/prize/prize.js
Page({
  data: {
    animationData: {},
    rotates: 90,
    gsds: [],
    giftAnimation: {}
  },

  showModal: function(e){
    console.log(e);
    wx.showToast({
      title: '5000',
    })
  },

  //转发事件监听
  onShareAppMessage: function (res) {
    console.log(res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  },
  onLoad: function(){
    var gsds = [{
      imgUrl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      title: 'LA MER 精华面霜 100ml11',
      surplus: 100,
      needStep: 8
    }, {
      imgUrl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      title: 'LA MER 精华面霜 100ml22',
      surplus: 100,
      needStep: 8
    }, {
      imgUrl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      title: 'LA MER 精华面霜 100ml33',
      surplus: 100,
      needStep: 8
    }, {
      imgUrl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      title: 'LA MER 精华面霜 100ml44',
      surplus: 100,
      needStep: 8
    }];

    this.setData({
      gsds: gsds
    });
  },
  // 礼品图标动画
  gift: function(){
    var rotate = 30;
    this.animation.rotate(rotate).step()

    this.setData({
      giftAnimation: this.animation.export()
    })
    setInterval(function () {
      // console.log(this);
      this.animation.rotate(rotate).step()

      this.setData({
        giftAnimation: this.animation.export()
      })
      // console.log(rotate)
      rotate = rotate == 30 ? -30 : 30;
      // console.log(rotate)
    }.bind(this), 1000)
  },
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-out',
      transformOrigin: '50% 50% 0'
    })
    // console.log(this);
    this.animation = animation;

    this.gift();
  },
  test: function () {
    console.log('ok');  
  },
  rotateAndScale: function () {
    // 旋转同时放大
    this.animation.rotate(45).scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateThenScale: function () {
    // 先旋转后放大
    this.animation.rotate(45).step()
    this.animation.scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateAndScaleThenTranslate: function () {
    // 先旋转同时放大，然后平移
    this.animation.rotate(45).scale(2, 2).step()
    this.animation.translate(100, 100).step({ duration: 1000 })
    this.setData({
      animationData: this.animation.export()
    })
  }
})