let check = require('../../function/uploadAvatar.js')
var app = getApp();
Page({
  // 页面数据
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '个人中心', //导航栏 中间的标题
    },
    imgUrl:'',
    pho_num: "",   	//骑手手机号——> 直接从User表获取
    nick_name: "Paul",   	//骑手昵称——> 直接从User表获取
    school_num: "17041723",//学号
    my_Sign: "我是一个帅哥",
  },
  onLoad:function(){
    this.setData({nick_name:app.globalData.user_name});
    // this.setData({imgUrl:app.globalData.user_img});  只能走微信头像 没办法检测头像链接是否有效
    this.setData({my_Sign:app.globalData.Sign});
  },
 uploadAvatar:function(){
    wx.chooseImage({
      count: 1,//选取的图片张数
      sizeType: ['original', 'compressed'],//图片大小：原始或压缩
      sourceType: ['album', 'camera'],//图片来源：相册或拍照
      success: (res)=> {
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths);
        wx.uploadFile({
          url: 'http://upstairs.sidcloud.cn/usersystem/wechat/head/index.php',
          // filePath: imagePath,
          filePath: tempFilePaths[0],
          name: 'img_src',//文件对应的key
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
            "user": "test",
          },
          success: (res) => {
            console.log("upload successfully");
            // let datas = JSON.parse(res.data);
            let imgUrl = res.data;
            this.setData({ imgUrl: imgUrl });
            console.log("图片地址是" + imgUrl);
          },
          fail: (res) => {
            console.log("avarar upload failed");
          }
        })
      },
    })

  },
  hducas : function(){

    console.log("HDU CAS success!");
  },  

  gotoHistory:function(){
    wx.navigateTo({
      url: './history/history'
    })
    console.log("go to history page success!");
  },

  gotoRegister: function () {
    wx.navigateTo({
      url: './register/register'
    })
  },

  gotoLogin: function () {
    wx.navigateTo({
      url: './login/login'
    })
  },

  gotoUploadInfor: function () {
    wx.navigateTo({
      url: './uploadInfor/uploadInfor?nick_name=' + JSON.stringify(this.data.nick_name) + '&my_Sign=' + JSON.stringify(this.data.my_Sign) + '&school_num='+JSON.stringify(this.data.school_num)
    })
  },
  
  })



  
