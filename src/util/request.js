import axios from "axios";
import {backendPath, uploadPath, appId, isDev, isH5} from "../project-config/base";
import {hideLoading, showLoading, getUrlParams, getGlobalData} from "./index";


/** 最多错误请求次数 */
const maxLength = 3;

/***
 * 上传文件地址固定
 * @param formData
 * @returns {Promise<*>}
 * 后台暂不支持多图同时上传
 */




async function requestByUpload(formData, type, has, len = 0) {

  if (formData.file) {
    const form = new FormData();
    form.append('file', formData.file);
    formData = form
  }
  //showLoading(type ? '视频上传中' : '图片上传中');
  const isVideo = type ? '?makePreview=1' : '';

  let isError = false

  const res = await axios.post(`${backendPath}/${uploadPath}${isVideo}`, formData, {
    headers: {
      ...defaultHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  }).catch(() => {
    isError = true
  });
  if (isError && len < maxLength) {
    len++;
    console.log('开始重新上传')
    return await requestByUpload(formData, type, has, len)
  }

  debug({
    url: `${backendPath}/${uploadPath}${isVideo}`,
    method: 'GET',
    data: formData || {},
    preview: res.data,
    status: res.status,
    statusText: res.statusText
  });


  //!has && hideLoading();
  return res.data;
}

async function _requestByUploadToTestServer(formData) {
  const res = await axios.post(`https://www.shanjiezhifu.com/sl/api/fileUpload`, formData, {headers: {'Content-Type': 'multipart/form-data'}});
  return {
    file: `http://static.shanjiezhifu.com/${res.data.file}`
  };
}

//添加debug
const debug = (param) => {

  const StorageData = localStorage.getItem("debugData"),
    debugData = StorageData ? JSON.parse(StorageData) : [];

  debugData.push({
    url: param.url,
    headers: {
      ...defaultHeaders(),
      'Content-Type': 'multipart/form-data'
    },
    preview: param.preview,
    method: param.method,
    data: param.data,
    time: new Date().getTime(),
    status: param.status,
    statusText: param.statusText
  });
  try {


    if (window.location.href.indexOf('&debug=true')) {
      localStorage.setItem("debugData", JSON.stringify(debugData))
    } else {
      // 防止debug的数据出现了缓存超出，当没有debug的时候就进行清除
      localStorage.setItem("debugData", '')
    }
  } catch (e) {
    // 防止debug的数据出现了缓存超出，当没有debug的时候就进行清除
    localStorage.setItem("debugData", '')
  }


}

let isH5Login = false;   //关于H5登入的

const defaultHeaders = () => {
  const StorageData = localStorage.getItem("GlobalData"),
    GlobalData = StorageData ? JSON.parse(StorageData) : {};

  const currentParams = getUrlParams(location.href);
  // console.log("获取到的缓存数据为",GlobalData)
  // alert(localStorage.projectAppId != 'undefined'?localStorage.projectAppId : appId)

  //const projectAppId = localStorage.projectAppId&&localStorage.projectAppId != 'undefined'?localStorage.projectAppId : getUrlParams(location.href).appId;


  return {
    // 优先获取链接上的appId,若没有在获取缓存的，因为链接上面的是最新的
    "zh-appid": getUrlParams(window.location.href).appId || localStorage.projectAppId,
    "zh-type": isH5() ? 'H5' : "weChat",
    "zh-city-id": GlobalData.cityId || '',
    "zh-zone-id": GlobalData.zoneId || '',
    "zh-session-key": GlobalData.sessionKey || ''
  }
};


/***
 * get请求
 * @param url
 * @param params
 * @returns {Promise<*>}
 */
async function requestByGet(url, params, len = 0) {
  if (!url) return;

  // if(!localStorage.projectAppId){
  //   console.log(url);
  //   alert("应用的id不存在，无法进行操作")
  //
  //   return ;
  // }

  let isError = false;
  const res = await axios.get(`${backendPath}/${url}`, {
    params,
    headers: {
      ...defaultHeaders()
    },
    onProgress(e) {
      console.log(`${backendPath}/${url}`, "\n onProgress", e, "\n")
    }
  }).catch(async error => {
    console.warn("\n\n\n\n", `👇👇👇👇👇👇${backendPath}/${url}👇👇👇👇👇👇`, error, '开始重新请求', '\n\n\n\n');
    isError = true
  });

  if (isError && len < maxLength) {
    len++;
    console.log('开始重新请求')
    return await requestByGet(url, params, len);
  }

  debug({
    url: `${backendPath}/${url}`,
    method: 'GET',
    data: params || {},
    preview: res.data,
    status: res.status,
    statusText: res.statusText
  });

  return res.data;
}


/***
 * post请求
 * @param url
 * @param data
 * @returns {Promise<*>}
 */
async function requestByPost(url, data, len = 0) {
  console.log("调用POST请求", data)
  if (!url) return;
  // if(!localStorage.projectAppId){
  //   console.log(url);
  //   alert("应用的id不存在，无法进行操作");
  //   return ;
  // }


  // let H5ArrayUrl = [
  //   "city/api/login/web_bind",
  //   "city/api/user/web_send_msg"
  // ]
  //
  // console.log("H5ArrayUrl.indexOf(url) >= 0",url, H5ArrayUrl.indexOf(url) >= 0)
  //
  // isH5Login = H5ArrayUrl.indexOf(url) >= 0;


  let isError = false;
  const res = await axios.post(`${backendPath}/${url}`, data, {
    "Content-Type": "application/x-www-form-urlencoded",
    headers: {...defaultHeaders()},
    transformRequest: [function (data) {
      let ret = '';
      for (let it in data) {
        let val = data[it];
        if (typeof val === "object") {
          val = JSON.stringify(val);
        }
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(val) + '&'
      }
      return ret
    }]
  }).catch(async error => {
    console.warn("\n\n\n\n", `👇👇👇👇👇👇${backendPath}/${url}👇👇👇👇👇👇`, error, '开始重新请求', '\n\n\n\n');
    isError = true
  });

  if (isError && len < maxLength) {
    len++;
    console.log('开始重新请求')
    return await requestByPost(url, data, len);
  }

  debug({
    url: `${backendPath}/${url}`,
    method: 'POST',
    data: data,
    preview: res.data,
    status: res.status,
    statusText: res.statusText
  });

  return res.data;
}

export {
  requestByGet, requestByPost, requestByUpload, _requestByUploadToTestServer, debug
}

