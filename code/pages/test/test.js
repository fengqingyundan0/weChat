// pages/test/test.js
Page({
  data: {
    animationData: {},
    rotates: 360,
    test: false
  },
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      transformOrigin: '50% 50% 0'
    })

    this.animation = animation
  },
  test: function () {
    console.log('ok');
    this.animation.rotate(this.data.rotates).scale(0.1, 0.1).step()

    this.setData({
      animationData: this.animation.export()
    })

    setTimeout(function(){
      this.animation.rotate(0).scale(1,1).step()

      this.setData({
        animationData: this.animation.export(),
        test: true
      })
    }.bind(this),2000)

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