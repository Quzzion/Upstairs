// pages/jiedan/working/working.js
var util = require("../../../utils/util.js");
Page({
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '完善信息', //导航栏 中间的标题
    },
    confirmBoxVisible: false,//确认弹框的显示
    submitTime: "",  //返回用户提交订单的时间作为时间凭据

    pho_num: "17816125217",   	//骑手手机号——> 直接从User表获取
    nickname: "瞿智健",   	//骑手昵称——> 直接从User表获取
    school_num: "17816125217",   	//学号——> 直接从User表获取
    img_src:"",    		//骑手头像——> 直接从User表获取
    user_num:"0",  	//当前用户数——> 默认0直接Post给服务器
    user_max:"",  	//单次最大拿单量——> 骑手输入
    user_list:"",  		//骑手客户数(不上传)
    ava_time:"",   	//接单时间——> 骑手填写
    locationave:'', //可配送范围
    details:"",    		//骑手自白——> 骑手填写
    pay_url:"",	 	//支付码——> 让骑手上传？还是有接口？先不直接上传，等后续
    is_active:"",   		//骑手现在是否能工作——> 不用填，这个弄个开关给骑手，骑手开了就服务器 is_active = true
    reg_time:"",   	//注册时间——> 直接获取时间post给服务器
    bill:"",		//骑手现金账户(玩资金流？) 默认post0
    maxrange:[1,2,3,4,5]
  },

  confirm: function () {  // 控制弹窗的显示
    this.setData({
      confirmBoxVisible: true,
    })
    let time = util.formatTime(new Date());
    this.setData({
      submitTime: time
    });
  },
 
  close: function () { // 弹窗的关闭按钮
    this.setData({
      confirmBoxVisible: false,
    })
  },
  choosemax:function(e){//选择可以接单的最大范围
    var user_max = parseInt(e.detail.value)+1;
    this.setData({user_max});
  },
  getP:function(e){//是否同意获取骑手的权限
    console.log(e);
    if(e.detail.value=="是"){
    let permission = e.detail.value;
    this.setData({permission}) ;
    console.log("getP success");}
    else{
      let permission = e.detail.value;
      this.setData({permission}) ;
      wx.showToast({
      title: '申请失败！',  
      icon: 'loading',   
      duration: 1000
    })}
  },

  detailBind:function(e){//获取骑手的备注
    var details = e.detail.value;
    this.setData({details});
  },
  locationBind:function(e){//获取可以配送的范围
    var locationave = e.detail.value;
    this.setData({locationave});
  },

  timeBind:function(e){//获取可以接单的时间
    var ava_time = e.detail.value;
    this.setData({ava_time});
  },

  submit:function(){//上传信息按钮
    if (this.data.permission == "是" && this.data.locationave != "" && this.data.ava_time != "" && this.data.user_max!=""){
    
      wx.request({
        url: 'http://upstairs.sidcloud.cn/usersystem/wechat/details.php',//完善信息的接口
        method: 'POST',
        data: {//1.少一个可配送范围的数据 2.需不需要上传is_active数据
          pho_num: this.data.pho_num,   	//骑手手机号——> 直接从User表获取
          nickname: this.data.nickname,   	//骑手昵称——> 直接从User表获取
          school_num: this.data.school_num,   	//学号——> 直接从User表获取
          // img_src: "",    		//骑手头像——> 直接从User表获取
          // user_num: "0",  	//当前用户数——> 默认0直接Post给服务器
          max: this.data.user_max,  	//单次最大拿单量——> 骑手输入
          // user_list: "",  		//骑手客户数(不上传)
          timeAva: this.data.ava_time,   	//接单时间——> 骑手填写
          // details: this.data.details,    		//骑手自白——> 骑手填写
          // pay_url: "",	 	//支付码——> 让骑手上传？还是有接口？先不直接上传，等后续
          // is_active: "",   		//骑手现在是否能工作——> 不用填，这个弄个开关给骑手，骑手开了就服务器 is_active = true
          submitTime: this.data.submitTime,   	//注册时间——> 直接获取时间post给服务器
          // bill: "",		//骑手现金账户(玩资金流？) 默认post0
          locationAva: this.data.locationave
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
          wx.navigateBack({});
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


      // wx.showToast({
      //   title: '申请成功！',  
      //   icon: 'success',   
      //   duration: 1500
      // })
      // setTimeout(function() {
      //   wx.switchTab({
      //   url: '../jiedan'
      //   })
      // }, 1500)
      
      // !!!!!!!!!!!!! 回调数据到数据库 ！！！！！！！！！！！！！！！
    }
    else{
      wx.showToast({
        title: '申请失败！',  
        icon: 'loading',   
        duration: 1000
      })
    }
  },

//最后点提交要返回信息到服务器






  onLoad: function (options) {

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