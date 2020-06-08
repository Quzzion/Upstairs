var timer;//定时器
Page({
  // 页面数据
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '注 册', //导航栏 中间的标题
    },
    second:60,
    registerTime:"",//注册时间
    resiterCode:'',//验证码
    passwordFlag:false,//密码标志位
    PhoneNumberFlag:false,//手机标志位
    phoneFormFlag:false,
    password:"",//密码
    pho_num:""//手机号码
  },
  back:function(){
    wx.navigateBack()
  },
  Countdown:function(){//验证码倒计时功能
    // console.log(this.data.second);
    this.setData({
      second: this.data.second - 1
    });
    if(this.data.second>0){
      timer = setTimeout(this.Countdown, 1000);
    }else{
      clearTimeout(timer);
      this.setData({
        second: 60
      });
    }
  },
  setCode: function (e) {//输入验证码
    var checkcode = e.detail.value;
    if (checkcode == this.data.resiterCode && this.data.resiterCode !== "") {
      wx.showToast({
        title: '验证成功',
        icon: 'success',
        duration: 1000,
      })
      this.setData({ PhoneNumberFlag: true });
    }
    else {
      wx.showToast({
        title: '验证失败',
        icon: 'loading',
        duration: 1500,
      })
      this.setData({ PhoneNumberFlag: false });
    }
  },
  checkPhone: function(phone){//正则表达式检测手机号码
      if(!(/^1[3456789]\d{9}$/.test(phone))){
        this.setData({
          phoneFormFlag:false
        });
      }else{
        this.setData({
          phoneFormFlag: true
        });
      } 
},
  setPhoneNumber: function (e) {//输入手机号码
    this.checkPhone(e.detail.value);//验证手机号码格式
    if (this.data.phoneFormFlag)//检查号码长度是否为11位，当前号码与历史号码是否相同
    {
      this.setData({ pho_num: e.detail.value });//更新号码
    } 
    else {
      wx.showToast({
        title: '请检查手机号码',
        icon: 'loading',
        duration: 1500,
      });
    }
  },

  getCode: function () {//向服务器发送接收验证码的手机
    wx.request({
      url: 'http://upstairs.sidcloud.cn/usersystem/wechat/sms/demo/send.php',
      data: {
        pho_num: JSON.stringify(this.data.pho_num),
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(result);
        this.setData({ resiterCode: result.data });
        if (result.data.length>5){
          wx.showToast({
            title: '该号码已被注册',
            icon: 'loading',
            duration: 1500,
          });
        }
      },
      fail: () => {
        console.log("post failed");
      },
      complete: () => {
        console.log("post complete");
      }
    });
    this.Countdown();
  },

  setPassword: function (e) {//设置登陆密码
    var inputer = e.detail.value;
    if (inputer.length < 6) {
      wx.showToast({
        title: '密码太短',
        icon: 'loading',
        duration: 500,
      });
    }
    else { this.setData({ password: e.detail.value }); }
  },

  confirmPassword: function (e) {//检查登录密码
    var precheck = e.detail.value;
    if (precheck != this.data.password) {
      wx.showToast({
        title: '请输入相同密码',
        icon: 'loading',
        duration: 500,
      });
    }
    else {
      wx.showToast({
        title: '密码验证成功',
        icon: 'success',
        duration: 500,
      });
      this.setData({ passwordFlag: true });
    }
  },

  // registerTime: "",//注册时间
  // resiterCode: '',//验证码
  // passwordFlag: false,//密码标志位
  // PhoneNumberFlag: false,//手机标志位
  // password: "",//密码
  // phoneNumber: ""//手机号码

  Register: function () {//提交客户信息
    if (this.data.passwordFlag == true && this.data.PhoneNumberFlag == true) {
      var myDate = new Date();
      this.setData({ registerTime: myDate.toLocaleString() })
      wx.request({
        url: 'http://upstairs.sidcloud.cn/usersystem/wechat/sms/demo/reg.php',
        data: {
          pho_num: this.data.pho_num,
          password: this.data.password,
          reg_time: this.data.registerTime,
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
          console.log(result);
          wx.showToast({
            title: '注册成功',
            icon: 'loading',
            duration: 100000,
          });
          wx.navigateBack();
        },
        fail: () => {
          console.log("post failed");
        },
        complete: () => {
          console.log("post complete");
        }

      });
    }
    else {
      wx.showToast({
        title: '注册失败',
        icon: 'loading',
        duration: 500,
      });
    }
  },

})




