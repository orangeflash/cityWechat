import {Toast, Dialog} from "vant";


import _ from 'lodash'

export function randomNumber(codeLength = 10) {
  var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);//随机数
  var code = "";
  for (var i = 0; i < codeLength; i++) {//循环操作
    var index = Math.floor(Math.random() * 10);//取得随机数的索引（0~35）
    code += random[index];//根据索引取得随机数加到code上
  }
  return +code;
}

export function randomColor() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
}

export function isNotUndefined(obj) {
  return typeof obj !== "undefined"
}

export function generateMutation(key) {
  return (state, data) => state[key] = data;
}

export function splitStrBySeparator(str) {
  if (isNotUndefined(str)) {
    //如果不是逗号分割
    const arr = str.split(",");
    if (arr.length === 1) {
      return str.split(" ").filter(item => item);
    } else {
      return str.split(",").filter(item => item);
    }

  }
  return [];
}

export function asyncWaitTime(time = 1000) {
  return new Promise(function (resolve) {
    setTimeout(() => {
      resolve();
    }, time)
  })

}


export function keyLenByObj(obj) {
  if (isNotUndefined(obj)) {
    return !!Object.keys(obj).length;
  }
  return false;
}


export function showLoading(message = "加载中", duration = 0) {
  return Toast.loading({
    duration,       // 持续展示 toast
    forbidClick: true, // 禁用背景点击
    loadingType: 'spinner',
    message
  });
}

export function showHandleStatusByFlag(flag, successMsg = "操作成功", failMsg = "操作失败", callBack) {
  if (typeof flag != 'object') {
    callBack && setTimeout(callBack, 800, flag ? true : false);
    return flag ? Toast.success({
      duration: 800,
      forbidClick: true,
      message: successMsg
    }) : Toast.fail({
      duration: 800,
      forbidClick: true,
      message: failMsg
    });
  } else {
    callBack && setTimeout(callBack, 1200, flag ? true : false);
    return flag[0] ? Toast.success({
      duration: flag[2] || 1200,
      forbidClick: true,
      message: flag[1] || '操作成功'
    }) : Toast.fail({
      duration: flag[2] || 1200,
      forbidClick: true,
      message: flag[1] || '操作失败'
    });
  }


}

export function showText(text = "提示", duration = 1000, forbidClick = false, mask = false,) {
  Toast({
    message: text,
    duration: duration,
    forbidClick: forbidClick,
    mask: mask,
  });
}

export function showDialog(msg, title = "提示", showCancelButton = true, confirmButtonText, cancelButtonText,) {
  hideLoading();
  return Dialog.alert({
    title,
    message: msg,
    confirmButtonText,
    cancelButtonText,
    showCancelButton
  });
}

export function getUrlParams(url) {
  const params = url.split("?")[1];
  const reg = /&?([^&]+)/g;
  let res = null;
  const map = Object.create(null);
  while (res = reg.exec(params)) {
    const paramEntry = res[1].split("=");
    map[paramEntry[0]] = paramEntry[1];
  }
  return map;
}

export function parseObjToParams(obj, excludeMark) {
  let params = "";
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    params += (i === keys.length - 1 ? `${key}=${obj[key]}` : `${key}=${obj[key]}&`)
  }
  if (excludeMark) {
    return params ? `${params}` : '';
  }
  return params ? `?${params}` : '';
}

export function hideLoading() {
  return Toast.clear();
}

/**
 * 缓动函数
 * @param t 动画已消耗时间
 * @param b 原始值
 * @param c 目标值
 * @param d 持续时间
 */
export function sineaseOut(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b
}


/**
 * 将元素滚动到可见位置
 * @param scroller 要滚动的元素
 * @param viewer 需要可见的元素
 * @param justify
 */
export function scrollToView(scroller, viewer, justify = 0) {
  if (!scroller || !viewer) {
    return
  }
  const clientHeight = document.documentElement.clientHeight
  const rect = viewer.getBoundingClientRect()
  const scroll = rect.top - clientHeight + rect.height + justify
  const scrollStart = scroller.scrollTop
  let start = null
  const step = (timestamp) => {
    if (!start) {
      start = timestamp
    }
    let stepScroll = sineaseOut(timestamp - start, 0, scroll, 500)
    let total = scroller.scrollTop = scrollStart + stepScroll
    if (total < scrollStart + scroll) {
      requestAnimationFrame(step)
    }
  }
  requestAnimationFrame(step)
}

export function asyncSleep(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


export function setGlobalData(obj) {
  let globalData = localStorage.getItem("GlobalData");
  globalData = globalData ? JSON.parse(globalData) : {};
  Object.assign(globalData, obj);
  localStorage.setItem("GlobalData", JSON.stringify(globalData));
  //console.log(JSON.stringify(globalData));
}

export function removeGlobalData(key) {
  let globalData = localStorage.getItem("GlobalData");
  globalData = globalData ? JSON.parse(globalData) : {};
  if (globalData[key]) {
    delete globalData[key];
  }
  localStorage.setItem("GlobalData", JSON.stringify(globalData));
}

export function getGlobalData(key) {
  let globalData = localStorage.getItem("GlobalData");
  globalData = globalData ? JSON.parse(globalData) : {};
  return globalData[key];
}


export function excludeEmpty(obj) {
  const newObj = Object.create(null);
  for (let key in obj) {
    if (!_.isEmpty(obj[key]) || _.isInteger(obj[key])) {

      if (_.isPlainObject(obj[key])) {
        const res = this.excludeEmpty(obj[key]);
        if (res) {
          newObj[key] = res
        }
      } else {
        newObj[key] = obj[key]
      }

    }
  }
  return newObj;
}

export function validFormNotEmpty(obj, excludeList = []) {
  for (let key in obj) {
    console.log(excludeList.indexOf(key))
    if (excludeList.indexOf(key) === -1) {
      const val = obj[key];
      if (_.isEmpty(val) && !_.isNumber(val)) {
        return false
      }
    }
  }
  return true;
}

// 计算当前时间是多少天前
export function computedDate(timestamp) {
  // 补全为13位
  var arrTimestamp = (timestamp + '').split('');
  for (var start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) {
      arrTimestamp[start] = '0';
    }
  }
  timestamp = arrTimestamp.join('') * 1;

  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = Date.now();
  //console.log(now)
  //console.log(timestamp)
  var diffValue = now - timestamp;
  //console.log(diffValue)
  // 如果本地时间反而小于变量时间
  if (diffValue < 0) {
    return '不久前';
  }

  // console.log(diffValue)
  // console.log(month)
  // 计算差异时间的量级
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;

  // 数值补0方法
  var zero = function (value) {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  };

  // 使用
  if (weekC >= 1) {
    // 超过1年，直接显示年月日
    return (function () {
      var date = new Date(timestamp);
      const nowYear = new Date().getFullYear();
      if (weekC >= 1 && nowYear == date.getFullYear()) {
        return zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
      } else {
        return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
      }

    })();
  } else if (monthC >= 1) {
    return parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    return parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    return parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    return parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    return parseInt(minC) + "分钟前";
  }
  return '刚刚';
}

//判断是不是电话号码 - Clover
export function isTellPhone(phoneNumber) {
  let myreg = /^(\d{6,})$/;
  return (myreg.test(phoneNumber));
}

// 上传的文件时时候的格式（提交到数据库的）， url,可以是数组，也可以是字符串
export function uploadFileFormat(url, type) {
  let arr = [], res = [];
  if (typeof url == 'string') {
    arr = url.split(";")
  }
  arr.forEach(v => {
    res.push({
      type,
      url: v
    })
  })

  return res;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export const countDownTime = (second) => {
  // 总秒数
  let s = Math.floor(second),
    // 天数
    day = Math.floor(s / 3600 / 24),
    // 小时
    hr = Math.floor(s / 3600 % 24),
    // 分钟
    min = Math.floor(s / 60 % 60),
    // 秒
    sec = Math.floor(s % 60);
  return [day, hr, min, sec].map(formatNumber)
  // if (day < 10) {
  //   day = '0' + day
  // }
  // if (hr < 10) {
  //   hr = '0' + hr
  // }
  // if (sec < 10) {
  //   sec = '0' + sec
  // }
  // if (min < 10) {
  //   min = '0' + min
  // }
  // let time = {
  //   day: day,
  //   hr: hr,
  //   min: min,
  //   sec: sec
  // }
  //return time
}

export const calculateDiffTime = (start_time, end_time) => {
  if (start_time.toString().length > 10) {
    start_time = parseInt(start_time / 1000)
    end_time = parseInt(end_time / 1000)
  }
  var startTime = 0, endTime = 0
  if (start_time < end_time) {
    startTime = start_time
    endTime = end_time
  } else {
    startTime = end_time
    endTime = start_time
  }
// //计算天数
  var timeDiff = endTime - startTime
  var year = Math.floor(timeDiff / 86400 / 365);
  timeDiff = timeDiff % (86400 * 365);
  var month = Math.floor(timeDiff / 86400 / 30);
  timeDiff = timeDiff % (86400 * 30);
  var day = Math.floor(timeDiff / 86400);
  timeDiff = timeDiff % 86400;
  var hour = Math.floor(timeDiff / 3600);
  timeDiff = timeDiff % 3600;
  var minute = Math.floor(timeDiff / 60);
  timeDiff = timeDiff % 60;
  var second = timeDiff;
  return [year, month, day, hour, minute, second]

// var timeDiff = endTime - startTime
// var hour = Math.floor(timeDiff / 3600);
// timeDiff = timeDiff % 3600;
// var minute = Math.floor(timeDiff / 60);
// timeDiff = timeDiff % 60;
// var second = timeDiff;
// return [hour, minute, second]
}

export const compareStartEnd = (start_time, end_time) => {
  if (Number(start_time) >= Number(end_time)) {

    return false;
  } else {
    return true;
  }
}

/**
 * 图片压缩
 * params:{
 *     width,     number
 *     height,    number
 *     quality,   number 0 - 10,
 *     file,    string base64
 *     callBack,  evetn
 * }
 * */
const canvas = document.createElement('canvas');

export function picCompress(params = {}) {
  if (!params.file) return Toast.fail({
    message: '缺少图片路径',
    duration: 1500
  });
  if (!params.callBack) return Toast({
    message: '小伙砸，是不是忘记写callBack的回调函数啦',
    duration: 1500
  })

  function convertBase64UrlToBlob(urlData) {
    var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], {type: mime});
  }

  var ready = new FileReader();
  ready.readAsDataURL(params.file);
  ready.onload = function () {
    const img = new Image();
    img.src = this.result;
    img.onload = function () {
      const w = img.width,
        h = img.height,
        ctx = canvas.getContext('2d');
      canvas.width = params.width || w;
      canvas.height = params.height || h;
      ctx.drawImage(img, 0, 0, w, h);
      // 图像质量
      if (params.quality && params.quality / 10 <= 1 && params.quality > 0) {
        const bl = convertBase64UrlToBlob(canvas.toDataURL('image/jpeg', params.quality / 10))
        const form = new FormData();
        form.append("file", bl, "file_" + Date.parse(new Date()) + ".jpg"); // 文件对象
        params.callBack(form, canvas.toDataURL('image/jpeg', params.quality / 10));
      } else {
        Toast.fail({
          message: 'quality参数错误',
          duration: 1500
        })
      }
    }
    img.onerror = function () {
      Toast.fail({
        message: '图片地址错误',
        duration: 1500
      })
    }
  }
}

/**
 * 图片转base64
 *
 * 该方法解决了文件跨域的问题
 *
 * 利用XMLHttpRequest方法进行拿取网络资源，并要求一个返回blob对象
 *
 * 然后在通过 FileReader 去读取这个blob对象返回的结果就是base64编码的图片了
 *
 * POINT 图片的请求协议必须是https,如果不是的话，就进行转换，也就是把http改成https
 *
 * 这个影藏性的问题就是，http请求失败，
 *
 * */
export function getImageBase64(src, fn, vue) {

  /** XMLHttpRequest的时候由于苹果手机对http的请求进行了拦截无法进行请求 */
  if (src.indexOf('https:') == -1) {
    src = src.replace("http", 'https');
  }

  window.URL = window.URL || window.webkitURL;
  let xhr = new XMLHttpRequest();
  xhr.open("get", src, true);
  // 至关重要
  xhr.responseType = "blob";
  xhr.onprogress = function (e) {
    console.log("onprogress", e);
  }
  xhr.onload = function () {
    if (this.status == 200) {
      //得到一个blob对象
      let blob = this.response;
      // 至关重要
      let oFileReader = new FileReader();
      /** 当文件读取完毕只有就会执行 */
      oFileReader.onloadend = function (e) {
        let base64 = e.target.result;
        /** 调用回调函数 */
        fn && fn(base64)
      };
      /** 开始读取 */
      oFileReader.readAsDataURL(blob);
    }
  }
  /** 图片有被限制跨域问题 前提是必须是https */
  xhr.onerror = function (e) {

    fn && fn(false)


    /** 运行跨域请求 */
    /** 运行跨域请求 */
    // let host = /^http(s)?:\/\/(.*?)\//.exec(src)[2].split(".");
    // /** 如果不是当前站点的图片资源 就进行添加允许跨域访问 */
    // host.splice(0, 1);
    // let loca = location.host.split(".");
    // loca.splice(0, 1);
    // let hostName = host.join("."),
    //   locationName = loca.join(".");
    // console.log("hostName != locationName", hostName != locationName, hostName, locationName)
    // if (hostName != locationName) {
    //   img.setAttribute("crossOrigin", '*')
    // }


  }
  /** 发送请求 */
  xhr.send();

}

export function srcToBase64(src, cb) {
  const img = new Image();
  img.src = src;
  img.onload = function () {
    const w = img.width,
      h = img.height,
      ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    try {
      const base64 = canvas.toDataURL('image/jpeg', 1)
      cb && cb(base64);
    } catch (e) {


    }
  }
}


export function format(timestamp) {
  function add(m) {
    return m < 10 ? '0' + m : m
  }

//timestamp是整数，否则要parseInt转换
  var time = new Date(timestamp);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + add(m) + '-' + add(d) + ' ' + add(h) + ':' + add(mm)
}

/**  获取数据类型 */
export function getType(obj) {
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    return 'array';
  } else if (obj === true || obj === false) {
    return 'boolean';
  } else if (typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length) {
    return 'json'
  } else {
    return typeof (obj)
  }
}

/** 获取正确的数据格式，
 * 如果传进来的数据格式是正确的就返回自身，
 * 如果不是就进行返回一个需要的数据格式 */
export function getSuccessData(obj, type) {
  let itemType = getType(obj);
  if (getType(type) != 'string') type = getType(type);
  if (itemType == type) return obj;
  switch (type) {
    case 'array':
      return [];
    case 'json':
      return {};
    case 'string':
      return "";
    case 'number':
      return 0;
    case 'function':
      return () => {
      }
  }
}

/** 将时间时间戳（毫秒） 转换成 时分秒 */
export function timeStampToHMS(time = 0, day) {
  if (time) {
    let D = ~~(time / 1000 / 60 / 60 / 24),
      H = ~~(time / 1000 / 60 / 60),
      M = ~~(time / 1000 / 60) % 60,
      S = ~~(time / 1000) % 60;

    day && (H = H % 24)

    H = H < 10 ? '0' + H : H;
    M = M < 10 ? '0' + M : M;
    S = S < 10 ? '0' + S : S;

    let res = H + ":" + M + ":" + S
    return day ? D + ':' + res : res
  } else {
    return "00:00:00"
  }
}

/** 将该dom元素里面所有的图片地址转换成base64 */
export function picLinkToBase64(dom, callBack) {
  const imgs = dom.querySelectorAll('img');
  let isLoad = 0;
  imgs.forEach(item => {
    getImageBase64(item.getAttribute('src'), (base64) => {
      item.setAttribute('src', base64);
      isLoad++;
      if (isLoad == imgs.length) {
        callBack && callBack();
      }
    })
  })
}

/**
 * 封装forEach
 * */
export function each(obj = [], callBack = () => {
}) {
  obj.forEach(callBack)
}


/**
 * 输入框
 * */
export function inputConfirm({title = "请输入", value = '', placeholder = '请输入', length = 0, btns = ['取消', '确认']}) {


  const html = `
  <div v-if="showInput" class="bg-0-5 posi-f t0 l0 b0 r0 flex-center zIndex999999">
      <div style="width: 6.9rem;border-radius: 0.3rem"  class="over-h mar-lr-10 bg-f flex flex-col flex-bt">
        <div  class="flex-center fon-xxl" style="height: 1.13rem;background-color: #EFF3F6" :height="113">${title}</div>
        <div class="pad-30 mar-lr">
          <div contenteditable id="inputConfirmBody" placeholder=${placeholder} class="w100 over-a resize-n mih-50 mh-200 lineH-48 br-n out-n fon-lg"></div>
          <div style="border-top:1px solid #EFF3F6"  class="t-r fon-lg mar-t-20 col-9">
          ${length ? `<div class="pad-t"><span id="inputConfirmBodyLen">0</span>/${length}</div>` : ''}
          </div>
        </div>
        
        <div style="height: 0.96rem" class="flex flex-y-center mar-t-5">
          <span class="flex-g-1 fon-w5 fon-xll flex-center col-9"  id="inputConfirmCancel">${btns[0]}</span>
          <span class="col-t flex-g-1 fon-w5 fon-xll flex-center" id="inputConfirmRight">${btns[1]}</span>
        </div>
        
       
      </div>
    </div>
  </dd-layout-div>
  `

  const dom = document.createElement('div');
  dom.innerHTML = html
  document.body.appendChild(dom)

  const cancel = dom.querySelector("#inputConfirmCancel"),
    right = dom.querySelector("#inputConfirmRight"),
    bodyLen = dom.querySelector("#inputConfirmBodyLen"),
    bodyDom = dom.querySelector("#inputConfirmBody");
  bodyDom.innerText = value;
  if (bodyLen) {
    bodyLen.innerHTML = value.length
    if (value.length > length) {
      bodyLen.classList.add('col-r')
    } else {
      bodyLen.classList.remove('col-r')
    }

    if (length) {
      bodyDom.oninput = () => {
        bodyLen.innerHTML = bodyDom.innerText.length
        if (bodyDom.innerText.length > length) {
          bodyLen.classList.add('col-r')
        } else {
          bodyLen.classList.remove('col-r')
        }

      }
    }
  }


  return new Promise((resolve, reject) => {
    right.onclick = () => {
      resolve(length ? bodyDom.innerText.substring(0, length) : bodyDom.innerText);
      document.body.removeChild(dom)
    }
    cancel.onclick = () => {
      resolve(value);
      document.body.removeChild(dom)
    }
  })


}


/**
 * 时间戳格式转换以及计算
 * */
export function formatTime(time = 0, format = 'YYYY-MM-DD hh:mm:ss') {

  const now = new Date().getTime()

  if (!time) time = now

  while (time.toString().length < 13) time += '0'

  const date = new Date(time)

  date.getMonth()
  /** 参数集 年-月-日 时:分:秒 */
  const arg = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  }

  /** 判断有没有指定的时间格式 */
  switch (format) {
    case 'YYYY-MM-DD hh:mm:ss':
      return `${arg.year}-${arg.month}-${arg.day} ${arg.hours}:${arg.minutes}:${arg.seconds}`
    case 'YYYY-MM-DD':
      return `${arg.year}-${arg.month}-${arg.day}`
    case 'MM-DD':
      return `${arg.month}-${arg.day}`
    case 'hh:mm:ss':
      return `${arg.hours}:${arg.minutes}:${arg.seconds}`
    case 'hh:mm':
      return `${arg.hours}:${arg.minutes}`
    case 'computed':			//判断是不是需要进行计算
      const dt = Math.abs(time - now),    //时间已过去多少毫秒
        S = dt / 1000,    //秒
        M = S / 60,  //分
        H = M / 60,  //小时
        D = H / 24,   //天
        W = D / 7    //周
      if (now > time) {


        /**
         ~~ ==>表示取整数部分 类似与 parseInt
         */
        if (~~W > 0 && W < 3) {
          return ~~W + '周前'
        } else if (D < 7 && ~~D > 0) {
          return ~~D + '天前'
        } else if (~~H > 0 && H < 24) {
          return ~~H + '小时前'
        } else if (~~M > 0 && M < 60) {
          return ~~M + '分钟前'
        } else if (~~S > 0 && S < 60) {
          return ~~S + '秒前'
        }
      } else {
        console.log('未来的时间')

        return `${~~D}天${~~H % 24}时`


      }
      return `${arg.year}-${arg.month}-${arg.day} ${arg.hours}:${arg.minutes}:${arg.seconds}`
  }
}

export function touch({dom, start, move, end, stop = true, change}) {
  const f = {
    data: {},
    start(e) {
      stop && e.preventDefault && e.preventDefault()
      f.data = {
        ...f.data,
        x: e.touches[0].pageX,
        y: e.touches[0].pageY,
        ex: 0,
        ey: 0,
        time: new Date().getTime()
      }
      start && start(f.data)
    },
    move(e) {

      stop && e.preventDefault && e.preventDefault()
      f.data = {
        ...f.data,
        ex: e.touches[0].pageX,
        ey: e.touches[0].pageY,
      }
      move && move({
        x: e.touches[0].pageX,
        y: e.touches[0].pageY,
        dx: f.data.ex - f.data.x,
        dy: f.data.ey - f.data.y
      })
    },
    end(e) {
      stop && e.preventDefault && e.preventDefault()
      let time = new Date().getTime()

      end && end({
        time,
        startTime: f.data.time,
        dt: time - f.data.time,
        dy: (f.data.ey || f.data.y) - f.data.y,
        dx: (f.data.ex || f.data.x) - f.data.x
      })
      if (new Date().getTime() - f.data.time < 300) {
        if (Math.abs(f.data.ex - f.data.x) > 20 && Math.abs(f.data.ex - f.data.x) > Math.abs(f.data.ey - f.data.y)) {
          if (change) {
            if (f.data.ex > f.data.x) {
              change({
                direction: 'right'
              })
            } else if (f.data.ex < f.data.x) {
              change({
                direction: 'left'
              })
            }
          }
        } else if (Math.abs(f.data.ey - f.data.y) > 20 && Math.abs(f.data.ex - f.data.x) < Math.abs(f.data.ey - f.data.y)) {
          if (change) {
            if (f.data.ey > f.data.y) {
              change({
                direction: 'down'
              })
            } else if (f.data.ey < f.data.y) {
              change({
                direction: 'up'
              })
            }
          }
        } else {
          change && change({
            direction: 'origin'
          })
        }
      } else if (Math.abs(f.data.ey - f.data.y) >= 50) {
        if (change) {
          if (f.data.ey > f.data.y) {
            change({
              direction: 'down'
            })
          } else if (f.data.ey < f.data.y) {
            change({
              direction: 'up'
            })
          }
        }
      } else if (Math.abs(f.data.ex - f.data.x) >= 50) {
        if (change) {
          if (f.data.ex > f.data.x) {
            change({
              direction: 'right'
            })
          } else if (f.data.ex < f.data.x) {
            change({
              direction: 'left'
            })
          }
        }
      } else {
        change && change({
          direction: 'origin'
        })
      }
    }
  }
  try {
    dom.removeEventListener('touchstart', f.start, false)
    dom.addEventListener('touchstart', f.start, false)
    dom.removeEventListener('touchmove', f.move, false)
    dom.addEventListener('touchmove', f.move, false)
    dom.removeEventListener('touchend', f.end, false)
    dom.addEventListener('touchend', f.end, false)
  } catch (e) {
    console.error('给dom元素绑定事件的时候出现了错误', e)
  }
}


/** 图片预览 */
export function ddPreviewImage(images = [], index) {


  let imagesDom = ``;

  images.forEach(src => {
    imagesDom += `<div style="width: 100vw;height: 100vh" class="flex-center flex-g-0">
                    <img src="${src}" style="max-height: 100%;max-width: 100%">
              </div>`
  })
  const html = `<div class="posi-f zIndex999999 t0 r0 b0 l0 bg-0 over-h tr-du-3 dis-n scale-0">
    <div class="bg-0 flex">${imagesDom}</div>
  </div>`;

  const ddPreviewImage = document.createElement("div");

  ddPreviewImage.innerHTML = html;

  document.body.appendChild(ddPreviewImage)

  const firstChild = ddPreviewImage.firstChild.firstElementChild;

  index = -index;
  firstChild.style.transform = `translateX(${index * ddPreviewImage.clientWidth}px)`;


  setTimeout(() => {
    ddPreviewImage.firstChild.classList.remove('dis-n', 'scale-0')
  })


  let
    translateX = 0;
  touch({
    stop: false,
    dom: ddPreviewImage.firstChild,
    start(e) {
      firstChild.style.transitionDuration = '0ms';
      translateX = firstChild.style.transform ? parseFloat(firstChild.style.transform.split('(')[1]) : 0
    },
    move({dx}) {
      firstChild.style.transform = `translateX(${dx + translateX}px)`
    },
    change({direction}) {
      switch (direction) {
        case 'left':
          if (Math.abs(index) < images.length - 1) index--;
          break;
        case 'right':
          index < 0 ? index++ : 0
          break;
      }
      firstChild.style.transitionDuration = '500ms';
      firstChild.style.transform = `translateX(${index * ddPreviewImage.clientWidth}px)`

    }
  })


  firstChild.onclick = () => {
    document.body.removeChild(ddPreviewImage)
  }

}
