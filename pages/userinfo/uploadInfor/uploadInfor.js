var util = require("../../../utils/util.js");
Page({
  // 页面数据
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '完善个人信息', //导航栏 中间的标题
    },
    pho_num: "110",   	//骑手手机号——> 直接从User表获取
    nick_name: "",   	//骑手昵称——> 直接从User表获取
    school_num: "",//学号
    my_Sign: "",
  },
  getNickname:function(e){
    this.setData({
      nick_name: e.detail.value
    })
  },
  getSchoolNum:function(e){
    this.setData({
      school_num: e.detail.value
    })
  },
  getSign:function(e){
    this.setData({
      my_Sign: e.detail.value
    })
  },
  confirm:function(){
    wx.request({
      url: 'http://upstairs.sidcloud.cn/usersystem/wechat/user_details.php',//完善信息的接口
      method: 'POST',
      data: {//1.少一个可配送范围的数据 2.需不需要上传is_active数据
        pho_num: this.data.pho_num,   	//骑手手机号——> 直接从User表获取
        nick_name: this.data.nick_name,   	//骑手昵称——> 直接从User表获取
        school_num: this.data.school_num,//学号
        my_Sign: this.data.my_Sign,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        // console.log(util.formatTime)
        console.log(result.data)
        console.log("upload successfully");
        wx.showToast({
          title: '修改成功',
          icon:"success",
          duration:2000
        })
        var pages = getCurrentPages();//获取当前页面js里面的所有pages里的所有信息
        var prevPage = pages[pages.length - 2];////prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，     
  
        prevPage.setData({
          nick_name: this.data.nick_name,   	//骑手昵称——> 直接从User表获取
          school_num: this.data.school_num,//学号
          my_Sign: this.data.my_Sign,
        })   
        wx.navigateBack({
          delta: 1  // 返回上一级页面。
        })
      },
      fail: () => {
        console.log("getinf fails")
      },
      complete: () => {
        console.log("getinfo completes")
        this.setData({
          confirmBoxVisible: false,
        })
      },
    })
  },
  onLoad:function(options){
    var nick_name = JSON.parse(options.nick_name)
    var my_Sign = JSON.parse(options.my_Sign)
    var school_num = JSON.parse(options.school_num)
    this.setData({
      nick_name ,
      my_Sign,
      school_num
    })
  }
})




