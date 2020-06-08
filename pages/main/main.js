var app = getApp();
Page({
  // 页面数据
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '登 录', //导航栏 中间的标题
    },
    imgUrl: '',
    pho_num: Number,//输入手机号码
    password: '',//密码
    passwordFlag: false,//密码格式标识符
    phoneFormFlag: false,//手机格式标识
    loginTime: ""//登陆时间
  },
  checkPhone: function (phone) {//正则表达式检测手机号码
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      this.setData({
        phoneFormFlag: false
      });
    } else {
      this.setData({
        phoneFormFlag: true
      });
    }
  },

  
  // debug
  debug:function(){
    console.log("debug")
    wx.switchTab({
      url: '/pages/fabu/fabu',
    })
  },

  inputPhoneNumber: function (e) {
    this.checkPhone(e.detail.value);
    if (this.data.phoneFormFlag) {
      this.setData({
        pho_num: e.detail.value
      })
    } else {
      wx.showToast({
        title: '请检查号码格式',
        icon: 'loading',
        duration: 500,
      })
    }
  },

  inputPassword: function (e) {
    let password = e.detail.value;
    if (!password) {
      this.setData({
        passwordFlag: false,
      })
      wx.showToast({
        title: '密码不能为空',
        icon: 'loading',
        duration: 500
      })
    } else {
      this.setData({
        password,
        passwordFlag: true,
      });
    }

  },

  login: function () {
    if (1) {  //this.data.phoneFormFlag && this.data.passwordFlag
      var myDate = new Date();
      this.setData({
        loginTime: myDate.toLocaleString()
      })
      wx.request({
        url: 'http://upstairs.sidcloud.cn/usersystem/wechat/login.php',
        data: {
          pho_num: this.data.pho_num,
          password: this.data.password,
          // reg_time: this.data.registerTime,
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
          var infoarr = result.data.toString().split("#$@#$");
          console.log(infoarr);
          if (infoarr[0] == "1") {
            // 存入本地全局用户数据
            app.globalData.user_name = infoarr[1];
            app.globalData.user_img = infoarr[2];
            app.globalData.user_pho = infoarr[3];
            app.globalData.is_rider = infoarr[4];
            app.globalData.user_school_num = infoarr[5];
            app.globalData.Sign = infoarr[6];
            wx.showToast({
              title: '登陆成功',
              icon: 'success',
              duration: 500,
            });
            wx.switchTab({
              url: '/pages/fabu/fabu',
            })
          } else {
            wx.showToast({
              title: '用户名密码错误',
              icon: 'loading',
              duration: 500,
            });
          }
        },
        fail: () => {
          console.log("post fail");
        },
        complete: () => {
          console.log("post complete");
        }

      });
    } else {
      wx.showToast({
        title: '检查密码和账号',
        icon: 'loading',
        duration: 500
      })
    }
  },

  codeLogin: function () {
    wx.showToast({
      title: '敬请期待',
    })
  },

  gotoRegister: function () {
    wx.navigateTo({
      url: '../userinfo/register/register'
    })
  },

  
})




