// app.ts
App<IAppOption>({
  globalData: {
    openid: '',

  },
  onLaunch() {


    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        wx.request({
          url: "https://gallifrey.asia/eatwhat/login",
          method: "POST",
          data: {
            code: res.code
          },

          success: (res) => {
            console.log(res.data)

            this.globalData.openid = res.data.openid

            //回调函数
            this.callback(res.data.openid)

          },

        })
      },
    })
  },

})