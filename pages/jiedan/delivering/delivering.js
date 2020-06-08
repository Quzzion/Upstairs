var index = 0;//便利的索引值
Page({
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '正在派送', //导航栏 中间的标题
    },
    confirmBoxVisible: false,//确认弹框的显示
    deliverList: [],
    currentDeliverList: {},
    is_working: true,
    info: ["labulafu", "dululu"],
  },
  
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
  close: function () {
    this.setData({
      confirmBoxVisible: false,
    })
  },
  //下单
  completeOrder: function (event) {
    // let index = event.currentTarget.dataset.index;
    console.log(index);
    let deliverListItem = "deliverList[" + index + "].is_outdata";
    this.setData({
      [deliverListItem]: "1",
    });

    wx.request({
      url: 'http://upstairs.sidcloud.cn/usersystem/wechat/updata_list.php',
      method: 'POST',
      data: {
        // sever_type: this.data.sever_type,//服务类型
        // meet_place: this.data.meet_place,//交接地点
        // unit_price: this.data.unit_price,//单价
        // cus_details: this.data.cus_details,//客户的备注信息
        is_matched: 0,//是否匹配到骑手
        // upload_time: this.data.submitTime,//订单提交时间
        torider: "17816125217",//骑手名
        // tocustomer: this.data.tocustomer,//客户名
        on_working: 0,//订单是否被配送
        is_outdata: 1,//订单是否完成
        is_failed: 0,//订单是否被遗弃
        id: this.data.currentDeliverList.shoppingId,//订单id
        // submitTime: this.data.submitTime,  //返回用户提交订单的时间作为时间凭据
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        // console.log(util.formatTime)
        console.log(result.data)
        // console.log("upload successfully");
        wx.showToast({
          title: '接单成功！',
          icon: 'success',
          duration: 1500
        })
      },
      fail: () => {
        console.log("getinf fails")
      },

      complete: () => {
        console.log("getinfo completes")
      },
    })


    wx.showToast({
      title: '骑手已选择',
      icon: 'success',
      duration: 1500
    }),
      this.close();
  },


  onLoad: function (options) {
    wx.request({
      url: 'http://upstairs.sidcloud.cn/usersystem/wechat/get_rider_list.php',//判断is_match==1并且on_working==1
      data: {
        torider:'17816125217',
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
              is_failed: singleData[10],//订单是否被遗弃
              shoppingId: singleData[11]
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

  
})


