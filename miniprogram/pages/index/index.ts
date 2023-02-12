// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    liking: false,
    like_image: '/images/like.png',
    not_like_image: '/images/not_like.png',
    animationData: null, // 绑定的动画效果
    todatEatList: null,
    todayEat: null,
    select_all: false,
    select_Fir: false,
    select_Sec: false,
    select_Third: false,
    hotlist: []
  },

  //点赞
  postLike(e: any) {
    if (this.data.liking) {
      wx.showToast({
        title: "请勿频繁点击",
        icon: "error",
        duration: 500,
      })
      return
    }
    this.setData({
      liking: true
    })

    var eid = e.target.dataset.eid
    var like_type = e.target.dataset.mytype
    var id = e.target.dataset.id
    // console.log(id)
    wx.request({
      method: 'POST',
      url: "https://gallifrey.asia/eatwhat/like/" + eid,
      data: {
        openid: app.globalData.openid,
        type: like_type
      },
      success: (res) => {
        // console.log(res.data)
        let copyhotlist = this.data.hotlist
        copyhotlist[id].islike = !copyhotlist[id].islike
        if (like_type == 1) {
          copyhotlist[id].hot++
        }
        if (like_type == 0) {
          copyhotlist[id].hot--
        }
        this.setData({
          hotlist: copyhotlist
        })
      },
      complete: (res) => {
        // console.log(res)
        setTimeout(() => {
          this.setData({
            liking: false
          })
        }, 500
        )

      }

    })



  },


  //获取菜单
  getHotList() {

    wx.request({
      url: "https://gallifrey.asia/eatwhat/hotList",
      method: "GET",
      data: {
        openid: app.globalData.openid
      },
      success: (res) => {
        // console.log(res.data);
        this.setData({
          hotlist: res.data
        })
      }
    })
  },



  //动画效果  
  startScroll() {
    // console.log('开启')
    // 创建一个动画实例
    let animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease'
    })

    // 获取元素总高度
    let height: any = (this.data.todatEatList.length - 1) * 8
    // console.log(height)
    // 向下移动
    animation.translateY('4vh').step({ duration: 600 })

    // 向上移动
    animation.translateY(-height + 'vh').step()

    // 将动画效果赋值
    this.setData({
      animationData: animation.export()
    })
  },

  // 重置
  reset() {
    let animation = wx.createAnimation({
      duration: 0
    })
    this.setData({
      animationData: animation.translateY(0).step().export()
    })
  },


  //全选
  selectAll() {
    var that = this;
    for (let i = 0; i < that.data.hotlist.length; i++) {
      that.data.hotlist[i].checked = (!this.data.select_all);
      //  console.log(that.data.hotlist[i])
    }
    this.setData({
      hotlist: that.data.hotlist,
      select_all: (!that.data.select_all),
      select_Fir: false,
      select_Sec: false,
      select_Third: false,
    })
  },

  //单选
  seltectOne(e: any) {
    console.log(e.target.dataset.id);
    this.data.hotlist[e.target.dataset.id].checked = !this.data.hotlist[e.target.dataset.id].checked;
  },

  //选菜
  randomOrder() {

    var randomList: any = [];

    this.data.hotlist.forEach(e => {
      if (e.checked == true) {
        randomList.push(e)
      }
    });

    let randomOne: any = (Math.random() * (randomList.length - 1)).toFixed(0);
    //  console.log(randomList.length)
    if (randomList.length == 0) {
      wx.showToast({
        title: "至少选择一个菜",
        icon: "error"
      })
      return
    }
    //  console.log(randomOne);

    let selectedOne = randomList[randomOne]
    selectedOne.id = randomList.length;
    randomList.push(selectedOne);

    //  console.log(randomList[randomList.length-1]);
    this.setData({

      todayEat: randomList[randomOne],
      todatEatList: randomList,
    })

    this.reset();
    this.startScroll();

  },

  //筛选一食堂
  selectFriCanteen() {
    var that = this;
    that.data.hotlist.forEach(e => {
      if (e.address == "一食堂") {
        e.checked = !this.data.select_Fir;
        // console.log(e.checked)
      }
    });

    this.setData({
      hotlist: that.data.hotlist,
      select_Fir: !that.data.select_Fir
    })
  },

  //筛选二食堂
  selectSecCanteen() {
    var that = this;
    that.data.hotlist.forEach(e => {
      if (e.address == "二食堂") {
        e.checked = !this.data.select_Sec;
        // console.log(e.checked)
      }
    });

    this.setData({
      hotlist: that.data.hotlist,
      select_Sec: !that.data.select_Sec
    })
  },

  //筛选三食堂
  selectThirdCanteen() {
    var that = this;
    that.data.hotlist.forEach(e => {
      if (e.address == "三食堂") {
        e.checked = !this.data.select_Third;
        // console.log(e.checked)
      }
    });

    this.setData({
      hotlist: that.data.hotlist,
      select_Third: !that.data.select_Third
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

    this.setData({
      select_all: false,
      select_Fir: false,
      select_Sec: false,
      select_Third: false,
    })

    if (app.globalData.openid == '') {
      app.callback = (my_openid) => {
        // console.log(my_openid)
        app.globalData.openid = my_openid
        console.log("已经回调")
        this.getHotList()
      }
    } else {
      // console.log(app.globalData.openid)
      this.getHotList()
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    let that = this

    that.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
