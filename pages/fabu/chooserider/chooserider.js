const app = getApp()
// let check = require('../../function/uploadAvatar.js')
var index = 0;//便利的索引值
Page({
  // 骑手的信息推送
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '选择骑手', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,

    confirmBoxVisible: false,//确认弹框的显示
    deliverList: [],
    currentDeliverList: {},
    //以下是骑手和客户的数据
  },
  //确认下单窗口
  confirm: function (event) {
    this.setData({
      confirmBoxVisible: true,
    })
    index = event.currentTarget.dataset.index;
    console.log(index);
    this.setData({
      currentDeliverList: this.data.deliverList[index]
    });
    console.log("当前的deliverList是" + this.data.currentDeliverList);
  },
  //关闭下单窗口
  close: function () {
    this.setData({
      confirmBoxVisible: false,
    })
  },
  //找他接单
  completeOrder: function (event) {
    // let index = event.currentTarget.dataset.index;
    console.log(index);
    let deliverListItem = "deliverList[" + index + "].is_outdata";
    this.setData({
      [deliverListItem]: "1",
    });
    wx.showToast({
      title: '选择成功',
      icon: 'success',
      duration: 1500
    }),
      this.close();
      //页面之间的传递数据
    // var model = JSON.stringify (this.data.currentDeliverList);
    //   wx.navigateTo({
    //     url: '../form/form?currentDeliverList=' + model,
    //   })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  
    prevPage.setData({
      currentDeliverList: this.data.currentDeliverList
    })
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  
  onLoad: function (options) {
    this.refreshView = this.selectComponent("#refreshView")//刷新组件
    wx.request({
      url: 'http://upstairs.sidcloud.cn/usersystem/wechat/get_rider_list.php',
      data: {
        is_matched: 1,
        on_working: 1
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        // console.log(result);
        var arr = result.data;    //绑定数据到Data.gotmsg
        console.log("request successfully");
        console.log(arr);
        var dataList = new Array();
        dataList = arr.split("#$@#666");//切割返回的数据成为多条订单
        // console.log(dataList);
        for (let i = 0; i < dataList.length - 1; i++) {
          var singleData = new Array();
          if (dataList[i]) {
            singleData = dataList[i].split("#$@#$");
            switch (singleData[1]) {
              case "1": singleData[1] = "快递代拿"; break;
              case "2": singleData[1] = "外卖代拿"; break;
              case "3": singleData[1] = "食堂代拿"; break;
              case "4": singleData[1] = "超市代买"; break;
              default: singleData[1] = "无效服务";
            }

            // console.log(singleData);
            let singleObject = {};
            singleObject = {
              tocustomer: singleData[0],//客户名
              sever_type: singleData[1],//服务类型选择
              meet_place: singleData[2],//交接地点
              unit_price: singleData[3],//单价
              cus_details: singleData[4],//客户的备注信息
              upload_time: singleData[5],//订单提交时间
              choose_rider: singleData[6],//选择骑手
              is_matched: singleData[7],//是否匹配到骑手
              on_working: singleData[8],//订单是否被配送
              is_outdata: singleData[9],//订单是否完成
              is_failed: singleData[10]//订单是否被遗弃
            }
            // console.log(singleObject);
            this.setData({
              deliverList: this.data.deliverList.concat(singleObject)
            });
          }
        }
        console.log(this.data.deliverList);
      },

      fail: () => {
        console.log("getinf fails")
      },

      complete: () => {
        console.log("getinfo completes")
      },
    });
  },
  //触摸开始
  handletouchstart: function (event) {
    this.refreshView.handletouchstart(event)
  },
  //触摸移动
  handletouchmove: function (event) {
    this.refreshView.handletouchmove(event)
  },
  //触摸结束
  handletouchend: function (event) {
    this.refreshView.handletouchend(event)
  },
  //触摸取消
  handletouchcancel: function (event) {
    this.refreshView.handletouchcancel(event)
  },
  //页面滚动
  onPageScroll: function (event) {
    this.refreshView.onPageScroll(event)
  },
  onPullDownRefresh: function () {
    setTimeout(() => { this.refreshView.stopPullRefresh() }, 2000)
  }
})

