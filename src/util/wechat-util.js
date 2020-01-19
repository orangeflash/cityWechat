import {backendPath, isH5, redirectPath} from "../project-config/base";
import {getGlobalData, parseObjToParams, setGlobalData, showDialog} from "./index";
import {requestByGet} from "./request";
import {Toast} from "vant";
import {
  getUrlParams,
} from "../util";
import store from "../store"
import {isDev, appId} from "../project-config/base";
import {compileStr} from "./dd-util";
import {getLocationByTXMap} from "./location";


export const jsApiList = [
  "chooseWXPay"
  , "getLocation"
  , "updateAppMessageShareData"
  , "updateTimelineShareData"
  , "onMenuShareAppMessage"
  , "onMenuShareTimeline"
  , "openLocation"
  , "startRecord"
  , "stopRecord"
  , "onVoiceRecordEnd"
  , "playVoice"
  , "pauseVoice"
  , "stopVoice"
  , "onVoicePlayEnd"
  , "chooseImage"
  , "getLocalImgData"
  , "downloadImage"
  , "uploadImage"
  , "uploadVoice"
  , "downloadVoice"
  , "scanQRCode"];


// 这个是在微信PC端的浏览器上开关，false的时候微信PC端上就不会显示,true就可以显示，但是会影响到支付功能
export const isWeb = false;

export function waitWxReady() {
  return new Promise(function (resolve) {
    if (isH5() || isWeb) return resolve();
    window.wx.ready(function () {
      resolve();
    })
  })
}

export async function getLocation() {
  if (isH5()) {
    // console.log('%c getLocation start ',
    //   'color: white; background-color: #95B46A',
    //   'getLocation');
    const res = await getLocationByTXMap();
    // console.log('%c getLocation get',
    //   'color: white; background-color: #f44444',
    //   res);
    return {...res, latitude: res.lat, longitude: res.lng}
  }

  return new Promise(function (resolve, reject) {
    if (isH5() || isWeb) return resolve(store.state.common.latLng || {latitude: 30.59276, longitude: 114.30525});
    const location = getGlobalData("location");
    if (location) {
      resolve(location);
    }
    window.wxReady(() => {
      window.wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: (res) => {
          setGlobalData({
            location: res
          });
          if (!location) {
            resolve(res);
          }
        },
        fail: (e) => {
          console.log("%c 定位失败", "font-size:40px;color:orange", e)
          resolve(store.state.common.latLng || {latitude: 30.59276, longitude: 114.30525})
        }
      });
    })
  })

}

export function openLocation(addressObj) {
  window.wx.openLocation({
    latitude: parseFloat(addressObj.lat) || 39.903740, // 纬度，浮点数，范围为90 ~ -90
    longitude: parseFloat(addressObj.lng) || 116.397827, // 经度，浮点数，范围为180 ~ -180。
    name: addressObj.name || '天安门广场', // 位置名
    address: addressObj.address || '北京市东城区东长安街', // 地址详情说明
    scale: 18, // 地图缩放级别,整形值,范围从1~28。默认为最大
    infoUrl: addressObj.url || '', // 在查看位置界面底部显示的超链接,可点击跳转
    // complete: (e) => {
    //   showDialog(e)
    //   // console.log("%c openLocation", "font-size:40px;color:orange", e)
    // }
  });
}

export function registerConfig(config, wxAppId) {
  return new Promise(function (resolve) {
    if (isH5() || isWeb) return resolve(true);
    try {
      window.wx.config({
        debug: false,
        appId: wxAppId,
        timestamp: config["timestamp"],
        nonceStr: config["nonceStr"],
        signature: config["signature"],
        jsApiList: jsApiList,
      });

      window.wx.error(e => {
        //console.log("微信环境配置ERROE", e)
      })

      window.wx.ready(function (e) {
        //console.log("微信环境配置SUCCESS", e)
        resolve(true);
      });
    } catch (e) {
      console.log("微信环境出问题了")
    }
  })

}

export function startRecord() {
  return new Promise(function (resolve, reject) {
    if (isH5() || isWeb) return resolve(true);
    window.wx.startRecord({
      success: function (res) {
        resolve(res);
      },
      cancel: function () {
        reject('用户拒绝授权录音');
      }
    });
  })

}

export function stopRecord() {
  return new Promise(function (resolve, reject) {
    if (isH5() || isWeb) return resolve(true);
    window.wx.stopRecord({
      async success(res) {
        resolve(res);
      }
    });
  })

}

export function uploadVoice(localId) {
  return new Promise(function (resolve, reject) {
    if (isH5() || isWeb) return resolve(true);
    window.wx.uploadVoice({
      localId, // 需要上传的音频的本地ID，由stopRecord接口获得
      isShowProgressTips: 0, // 默认为1，显示进度提示
      success: function (res) {
        resolve(res);
      }
    });
  })

}

export function chooseImage(count) {
  return new Promise(function (resolve, reject) {
    if (isH5() || isWeb) return resolve(true);
    window.wx.chooseImage({
      count: count || 9, // 默认9
      sizeType: ['compressed'],
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: async function (res) {
        resolve(res);
      },
      fail() {
        resolve({})
      }
    });

  })

}

export function uploadImage(localId, showTips) {
  return new Promise(function (resolve, reject) {
    if (isH5() || isWeb) return resolve(true);
    window.wx.uploadImage({
      localId, // 需要上传的图片的本地ID，由chooseImage接口获得
      isShowProgressTips: showTips || 0, // 默认为1，显示进度提示
      success: function (res) {
        resolve(res) // 返回图片的服务器端ID
      }
    });

  })

}

export function playVoice(localId) {
  return new Promise(function (resolve, reject) {
    if (isH5() || isWeb) return resolve(true);
    window.wx.playVoice({
      localId
    });
    resolve(true)
  })

}

export function onVoicePlayEnd(localId) {
  return new Promise(function (resolve, reject) {
    if (isH5() || isWeb) return resolve(true);
    window.wx.onVoicePlayEnd({
      success: function (res) {
        resolve(true);
      }
    });
  })

}

//注册
export async function registerByRequestConfig(url = location.href) {


  const wxAppId = localStorage.weChatAppID;
  if (!wxAppId) {
    console.log("无appid")
  }

  let urlParams = getUrlParams(url);

  if (urlParams.isappinstalled) {
    let str = '?';
    for (let k in urlParams) if (k != 'isappinstalled' && k != 'from' && k) str += k + '=' + urlParams[k] + '&';
    str = str.substring(0, str.length - 1);
    url = url.split('?')[0] + str;
    location.href = url;
    return
  }

  const {data} = await requestByGet("city/api/login/sign", {
    url
    // url:encodeURIComponent(url.split('#')[0])
  });

  const config = {
    "signature": data["sign"],
    "appId": data["appId"] || wxAppId,
    "nonceStr": data["str"],
    "timestamp": data["time"]
  };

  if (data["sign"] != 'undefined') {
    // console.log("%c 参数值URL：" + url, "color:blue;font-size:18px");
    // console.log('微信的配置信息')
    // console.log(config);
    // console.log('wxAppId：' + wxAppId)
    // console.log("%c 是不是没有配置白名单的原因啊？？？", "color:blue;font-size:18px");
  } else {
    // console.log('微信的配置信息')
    // console.log(config);
  }
  return registerConfig(config, data["appId"] || wxAppId);
}

//微信支付
export function chooseWXPay(config, callback) {
  if (isH5() || isWeb) return callback && callback();
  window.wx.chooseWXPay({
    ...config,
    timestamp: config.timeStamp,
    success: function (res) {
      // 支付成功后的回调函数
      callback && callback(res);
    },
    fail: function (e) {
      showDialog(JSON.stringify(e))
    }
  });

}

export function wxPreviewImage(src, urls) {
  console.log('src', 'urls', src, urls)
  window.wx.previewImage({
    current: src, // 当前显示图片的http链接
    urls: urls // 需要预览的图片http链接列表
  });
  console.log("%c ======================您查看了图片详情，请移步至手机端上进行查看。======================", "color:#FFB800;font-size:18px;");
}

//分享
// 需要分享指定页面的时候，需要在路由meta里面进行配置 needJsSdk参数 值 true ！！！！！！！！！！！！！！！！！！！！！！
export async function updateShareConfig(config) {


  if (isH5()) {

    const meta = document.querySelector('meta#shareDesc');

    meta.setAttribute("content", config.desc)

    return
  }


  let url = config.link || window.location.href;
  let urlParams = getUrlParams(url);
  if (url.indexOf("?") >= 0) {
    url = url.split("?")[0] + "?"
  } else {
    url += '?'
  }

  // 删除这个两个字段的原因是，防止用户也是被转发进来的，
  // 并在再当前页面里面进行转发，此时的code的值是当前用户的，
  // 下个被转发进来的就会利用上一个人的code值进行了登入，最终会导致无法获取用户信息
  delete urlParams.state;
  delete urlParams.code;

  for (let p in urlParams) {
    if (p && urlParams[p])
      url += p + "=" + urlParams[p] + "&";
  }
  // 如果转发出去的连接上没有appId的话，就进行添加上去
  if (!urlParams.appId) url += 'appId=' + localStorage.projectAppId;
  if (!urlParams.isShare) url += '&isShare=true';

  const user = getGlobalData('user')

  url += '&partnerId=' + (user && user != 'undefined' ? user.id : '')

  config.link = url;

  const {
    title = store.state.platform.title || "同城标题",
    desc = store.state.platform.shareDescription || "同城描述",
    link = url,    //默认为当前页面的路径
    imgUrl = ""
  } = config || {};


  // console.log(config);
  // console.log("===================config========================>>>>>>>>>>>>>>>>>>");


  await new Promise(function (resolve) {
    //分享给朋友
    window.wx.ready(function () {
      // window.wx.onMenuShareAppMessage({
      //   title, // 分享标题
      //   desc, // 分享描述
      //   link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      //   imgUrl, // 分享图标
      // })
      //
      // //分享到朋友圈
      // window.wx.onMenuShareTimeline({
      //   title, // 分享标题
      //   desc, // 分享描述
      //   link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      //   imgUrl, // 分享图标
      // })
      //
      // window.wx.onMenuShareQQ({
      //   title, // 分享标题
      //   desc, // 分享描述
      //   link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      //   imgUrl, // 分享图标
      // });
      //
      // window.wx.onMenuShareQZone({
      //   title, // 分享标题
      //   desc, // 分享描述
      //   link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      //   imgUrl, // 分享图标
      // });
      //
      // window.wx.onMenuShareWeibo({
      //   title, // 分享标题
      //   desc, // 分享描述
      //   link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      //   imgUrl, // 分享图标
      // });

      window.wx.onMenuShareAppMessage({
        title, // 分享标题
        desc, // 分享描述
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl, // 分享图标
      });

      window.wx.updateTimelineShareData({
        title, // 分享标题
        desc, // 分享描述
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl, // 分享图标

      });

    })
  })

  /*


    await new Promise(function (resolve) {
      let FlagList = [];


      function checkFlags(done) {
        FlagList.length === 2 && done();
      }
    })

    */
}

