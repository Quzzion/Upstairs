var index = 0;//便利的索引值
Page({
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我要接单', //导航栏 中间的标题
    },
    confirmBoxVisible: false,//确认弹框的显示
    deliverList: [],
    currentDeliverList: {},
    is_working: true,
    info:["labulafu","dululu"],

    // gotmsg: "",
    // output: [],
    // num: 3,
    // hero_img: [],   //骑手头像src
    // hero_name: ["拉布拉夫", "欢乐马", "爬爬龟"],   //骑手名字
    // book_info: ["(3/5)", "(2/3)", "(4/6)"],   //接单信息， 服务器直接返回组合后的信息 (3/8)
    // pub_time: ["2020.5.8", "2020.5.4", "2020.5.6"],   //骑手信息发布时间
    // ava_time: ["随时", "下午都行", "早上八点前"],  //骑手可行的工作时间
    // hero_say: ["一单九十八，砍价死亲妈", "杭电老子跑最快！", "爬爬爬，给爷爬！"],  //骑手留的备注
  },
  switch_work: function (e) {//改变骑手工作状态
    console.log(e.detail.value);
    this.setData({ is_working: e.detail.value });
    wx.request({
      url: 'http://upstairs.sidcloud.cn/usersystem/wechat/rider_onwork.php',
      data: {//?需不需要发送骑手的电话号码
        is_active: e.detail.value?1:0
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(result.data);
      },
      fail: () => {
        console.log("post failed");
      },
      complete: () => {
        console.log("post complete");
      }

    })
  },
  post:function(){//测试
    wx.showToast({
      title: '已经点击',
    })
    wx.request({
      url: 'http://upstairs.sidcloud.cn/usersystem/wechat/debug.php', 
      data: {
        id:1
      },   
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(result.data);
      },
      fail: () => {
        console.log("post failed");
      },
      complete: () => {
        console.log("post complete");
      }

    })
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
    wx.showToast({
      title: '订单已完成',
      icon: 'success',
      duration: 1500
    }),
      this.close();
  },


  onLoad: function (options) {
    wx.request({
      url: 'http://upstairs.sidcloud.cn/usersystem/wechat/get_rider_list.php',//判断is_match==1并且on_working==1
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

  gotoworking:function(){
      wx.navigateTo({
        url: './working/working'　
      })
  },

  gotocustomer:function(){
    
    wx.navigateTo({
      url: './customer/customer'　
    })
  },

  gotodelivering:function(){
    wx.navigateTo({
      url: './delivering/delivering'
    })
  } 
})


  