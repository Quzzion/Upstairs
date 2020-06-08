const app = getApp()
let check = require('../../function/uploadAvatar.js')
var index = 0;//便利的索引值
Page({
  // 骑手的信息推送
  data: {
      // 组件所需的参数
      nvabarData: {
        showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
        title: '发  布', //导航栏 中间的标题
      },
      // 此页面 页面内容距最顶部的距离
      height: app.globalData.height * 2 + 20,   
      postFlag:true,//是否为发布订单的文字
      confirmBoxVisible: false,//确认弹框的显示
      deliverList: [],
      currentDeliverList: {},
      //以下是骑手和客户的数据
      gotmsg:"",
      output:[],
      num:3,
      hero_img:[],   //骑手头像src
      hero_name:["拉布拉夫","欢乐马","爬爬龟"],   //骑手名字
      book_info:["(3/5)","(2/3)","(4/6)"],   //接单信息， 服务器直接返回组合后的信息 (3/8)
      pub_time:["2020.5.8","2020.5.4","2020.5.6"],   //骑手信息发布时间
      ava_time:["随时","下午都行","早上八点前"],  //骑手可行的工作时间
      hero_say:["一单九十八，砍价死亲妈","杭电老子跑最快！","爬爬爬，给爷爬！"],  //骑手留的备注
      // 如果满单了就不要返回骑手信息（在数据库比较 book_info）
  },
  changeFunction:function(){//改变文字显示
    this.setData({
      postFlag: !this.data.postFlag
    })
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
      title: '订单已发送',
      icon: 'success',
      duration: 1500
    }),
      this.close();
  },


  gotostateinfo:function(){
    console.log("go to stateinfo success!");
    // check.uploadAvatar("https://www.baidu.com/img/bd_logo1.png","http://upstairs.sidcloud.cn/usersystem/wechat/head/index.php");
      // check.uploadAvatar( "http://upstairs.sidcloud.cn/usersystem/wechat/head/index.php");
    // check.upload("http://upstairs.sidcloud.cn/usersystem/wechat/head/index.php")
    //             .then(
                  
    //             )
    //             .catch((res) => { console.log(res) });
    wx.navigateTo({
      url: './stateinfo/stateinfo',
    })
  },

  gotoform:function(){
    console.log("go to form success!");
    console.log(check.imgUrl);
    if (this.data.postFlag){
      wx.navigateTo({
        url: './form/form',
      })
    }else{
      wx.navigateTo({
        url: './stateinfo/stateinfo',
      })
    }
    
  },

  action:function(){
    wx.request({
      url: 'https://upstairs.sidcloud.cn/usersystem/wechat.php',
      data: {
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        // console.log(result);
        var arr = result.data;    //绑定数据到Data.gotmsg
        this.setData({gotmsg:arr})
        // console.log(this.data.gotmsg);
        // 处理字符串
        var msgstr = this.data.gotmsg;
        console.log(msgstr);

        var cutA= new Array(); //定义一数组
        cutA=msgstr.split("*(^*&)(*&&^%^^^*&("); //字符分割 
        console.log("cutA info");
        console.log(cutA); // line1 line2 line3

        for (var i=0 ;i<cutA.length-1 ;i++ ){
          var cutB = new Array();
          cutB = cutA[i].split(",");   
          console.log(cutB);  //each line1 detail apart
          var out = "订单号:["+cutB[1]+"]　　大侠:["+cutB[2]+"]　　时间:["+cutB[3]+"]　　大侠说明:["+cutB[4]+"]　　当前单数:["+cutB[5]+"]　　单次最大单数:["+cutB[6]+"]　　"
          var item = 'output['+i+']';
          this.setData({[item]:out});
          console.log(this.data.output);   // 处理过的 line1 line2 line3 
        }

         //get单数 Int类型
         var n = 3;  //假定单数为n
         for( var i=0 ; i<n ; i++){
           var item = 'num['+i+']';
           this.setData({[item]:i});
         }
         console.log(this.data.num);
          //直接处理好字符串然后整条渲染给data.output
          // console.log(key2);
          // console.log(this.data.key);
          // var cutB = new Array();
          // cutB = cutA[i].split(",");
      },

      fail: () => {
        console.log("getinf fails")
      },

      complete: () => {
        console.log("getinfo completes")
      },

    });  // wx.request
  }, // action.function
  onLoad: function (options) {
    wx.request({
      url: 'http://upstairs.sidcloud.cn/usersystem/wechat/match.php',
      data: {
        is_matched: 0,
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
})

