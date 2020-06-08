// pages/userinfo/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '订单查询', //导航栏中间的标题
    },
    deliverList:[],
    // sever_type:"快递代拿",//服务类型选择
    // meet_place:"五餐门口",//交接地点
    // unit_price:1.0,//单价
    // choose_rider:"rider",//选择骑手
    // cus_details:"无",//客户的备注信息
    // is_matched:true,//是否匹配到骑手
    // upload_time:"2020/5/20",//订单提交时间
    // torider:"rider",//骑手名
    // tocustomer:"customer",//客户名
    // on_working:true,//订单是否被配送
    // is_outdata:true,//订单是否完成
    // is_failed:true//订单是否被遗弃
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'http://upstairs.sidcloud.cn/usersystem/wechat/get_list.php',
      data: {torider:"17816125217"},
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        // console.log(result);
        var arr = result.data;    //绑定数据到Data.gotmsg
        console.log("request successfully");
        // console.log(arr);
        var dataList = new Array();
        dataList = arr.split("#$@#666");//切割返回的数据成为多条订单
        for(let i=0;i<dataList.length-1;i++){
          var singleData = new Array();
          if (dataList[i]){
            singleData = dataList[i].split("#$@#$");
            switch (singleData[1]) {
              case "0": singleData[1] = "快递代拿"; break;
              case "1": singleData[1] = "外卖代拿"; break;
              case "2": singleData[1] = "食堂代拿"; break;
              case "3": singleData[1] = "超市代买"; break;
              default: singleData[1] = "无效服务";
            }
            // console.log(singleData);
            let singleObject = {};
            singleObject={
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