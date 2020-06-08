// pages/userinfo/history/history.js
var index = 0;//便利的索引值
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '开始接单', //导航栏 中间的标题
    },
    // visible:true,//本条代拿选项是否可见
    confirmBoxVisible: false,//确认弹框的显示
    deliverList: [],
    currentDeliverList:{},
    // sever_type: "快递代拿",//服务类型选择
    // meet_place: "五餐门口",//交接地点
    // unit_price: 1.0,//单价
    // choose_rider: "瞿智健",//选择骑手
    // cus_details: "无",//客户的备注信息
    // is_matched: true,//是否匹配到骑手
    // upload_time: "2020/5/20",//订单提交时间
    // torider: "瞿智健",//骑手名
    // tocustomer: "吴亦炜",//客户名
    // on_working: true,//订单是否被配送
    // is_outdata: true,//订单是否完成
    // is_failed: true//订单是否被遗弃
  },
  //显示弹窗口
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
  getOrder: function (event){
    // let index = event.currentTarget.dataset.index;
    console.log(index);
    let deliverListItem = "deliverList[" + index + "].is_matched";
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
        is_matched: 1,//是否匹配到骑手
        // upload_time: this.data.submitTime,//订单提交时间
        torider: "17816125217",//骑手名
        // tocustomer: this.data.tocustomer,//客户名
        on_working: 1,//订单是否被配送
        is_outdata: 0,//订单是否完成
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
   
    this.close();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'http://upstairs.sidcloud.cn/usersystem/wechat/match.php',
      data: { 
        is_matched:0,
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
            console.log(singleData);
            switch (singleData[1]) {
              case "0": singleData[1] = "快递代拿"; break;
              case "1": singleData[1] = "外卖代拿"; break;
              case "2": singleData[1] = "食堂代拿"; break;
              case "3": singleData[1] = "超市代买"; break;
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
              shoppingId: singleData[11]//订单编号
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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