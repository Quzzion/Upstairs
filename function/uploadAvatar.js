var imgUrl = ""

const upload = (url) =>{
  return new Promise(function (resolve,reject){
    wx.chooseImage({
      count: 1,//选取的图片张数
      sizeType: ['original', 'compressed'],//图片大小：原始或压缩
      sourceType: ['album', 'camera'],//图片来源：相册或拍照
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        wx.uploadFile({
          url: url,
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
            imgUrl = res.data;
            resolve(res.data);
          },
          fail: (res) => {
            reject("update fail");
          }
        })
      },
    })
  })
}

const uploadAvatar = (url) =>{
  wx.chooseImage({
    count:1,//选取的图片张数
    sizeType: ['original', 'compressed'],//图片大小：原始或压缩
    sourceType: ['album', 'camera'],//图片来源：相册或拍照
    success: function(res) {
      var tempFilePaths = res.tempFilePaths;
      console.log(tempFilePaths);
      wx.uploadFile({
        url: url,
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
          imgUrl = res.data;
          console.log("图片地址是"+imgUrl);
          return res.data;
        },
        fail: (res) => {
          console.log("avarar upload failed");
        }
      })
    },
  })
  
}
const test = () => {
  console.log("test successful");
  console.log(imgUrl);
}
module.exports = {
  test:test,
  uploadAvatar: uploadAvatar,
  imgUrl: imgUrl,
  upload: upload
}

