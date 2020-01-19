import {
  ddPreviewImage,
  each,
  formatTime,
  getUrlParams, hideLoading,
  inputConfirm,
  isNotUndefined,
  randomNumber,
  showDialog,
  showLoading
} from "../util";
import {mapActions, mapState, mapGetters} from "vuex";
import {appId, backendPath, isDev, isH5, publishUrl} from "../project-config/base"
import {getEntryPath} from "./get-entry-path";
import {Toast} from "vant";
import QRCode from 'qrcodejs2'
import {openLocation, wxPreviewImage} from "../util/wechat-util";
import {picCompress} from "@/util";
import {requestByUpload} from "../util/request";

const Plugin = Object.create(null);

Plugin.install = function (Vue, options) {
  // const history = [];
  // let lastReplace = "/";
  // 3. 注入组件
  Vue.mixin({
      data() {
        return {
          dom: document.createElement('div')
        }
      },
      computed: {
        ...mapState({
          platform: state => state.platform,
          assetPath: s => s.assetPath,
          user: state => state.user,
        }),
        $themeColor() {
          return this.platform.color;
        },
        $routeHistory() {
          return history;
        }
      },
      methods: {
        ...mapActions("common", ["getWxUpload"]),
        hasModifier(defaultClass, modifier, flag) {
          return flag ? `${defaultClass} ${defaultClass}--${modifier}` : defaultClass
        },
        previewImage(src, urls) {
          if (isH5()) {
            ddPreviewImage(urls, urls.indexOf(src) > -1 ? urls.indexOf(src) : 0)
          } else {
            wxPreviewImage(src, urls)
          }
        },
        openLocation,
        randomNumber,
        getPathByAssetPath(path) {
          //return 'https://app.zhycms.com/file/1/2018/12-03/qh4mvKwqF6D9gs4o1543836616.jpg'
          if (path && path.trim()) {
            return `${this.assetPath}${path}`
          } else {
            return ''
          }
        },
        getTestPathByAssetPath(path) {
          if (path.trim()) {
            return `${this.backendPath}${path}`
          } else {
            return ''
          }
        },
        $replaceRoute(route) {
          // lastReplace = route;
          // this.$router.replace(route);
          this.$router.replace(route);
        },
        $popRoute() {
          // history.pop();
          // this.$router.replace(history[history.length - 1] || lastReplace);
          this.$router.go(-1);
        },
        $pushRoute(route) {
          if (!route) {
            return;
          }
          if (route.category) {
            const path = this.getEntryPath(route);
            return path && this.$router.push(path);
          } else if (route.includes && route.includes("redirect:")) {
            return location.href = route.split("redirect:")[1];
          }
          //this.$router.push(route);
          this.goPointPage({
            path: route,
            query: {
              title: route.category
            }
          })
        },
        getEntryPath,
        formatBody(value) {
          try {
            if (value && value.toString().trim()) {
              let body = value || '';
              body = body.replace(/\r|\n|\\s/g, "") || '暂无内容';
              body = body.replace(/↵/g, "\r\n");
              return body.length > 40 ? body.slice(0, 64) + " ... " : body;
            } else {
              return ''
            }
          } catch (e) {
            return value
          }
        },
        //转译 如: ' ===>> &#39;
        interpretation(val) {
          if (val && val.toString().trim()) {
            try {
              let arr = [
                {hash: '&#39;', prototype: "'"}
              ]
              for (let i = 0; i < arr.length; i++) {
                val = val.split(arr[i].hash).join(arr[i].prototype)
              }
            } catch (e) {
              console.log(e)
            }
          }
          return val
        },
        formatNumber(num) {
          if (!num) return num;
          if (num > 10000) {
            let formatNum = (num / 10000).toFixed(2);
            return formatNum + "万"
          }
          return num;
        },
        stringIntercept(str, length, isSuffix = true) {
          if (!str) return str;
          let suffix = ''
          if (str.length > length) suffix = '...'
          return str.substring(0, length) + (isSuffix ? suffix : '');
        },
        getDomText(txt) {
          this.dom.innerHTML = txt;
          return this.dom.innerText
        },
        async openReport(id, type) {
          const bool = await this.checkBindTel({callBack: true})
          if (!bool) return

          return this.$root.$children[0].openReport({id, type}, (tips) => {

          }, false);
        },
        uploadFile({files, from}) {
          const that = this;


          async function ys(file) {
            console.log("file", file)
            return new Promise((resolve, reject) => {


              if (that.getType(file) == 'string') {
                if (file.indexOf('http') > -1) {
                  return resolve({
                    type: 'img',
                    url: file.substring(that.assetPath.length)
                  })
                }
              }

              picCompress({
                file,
                quality: 5,
                async callBack(ret) {
                  //console.log("图片压缩成功");
                  const res = await requestByUpload(ret)
                  return resolve({
                    url: res.src,
                    type: "img"
                  })
                }
              })
            })
          }

          return new Promise(async function (resolve, reject) {

            let images = files.map(async (item) => {

              return await item.from == 'default' ? ys(item) : that.wxUploadImg([item], true);
            })
            images = await Promise.all(images)
            return resolve(images)

          })
        },
        goPointPage(param, replace) {
          if (typeof param == 'string') {
            param = {
              path: param
            }
          }
          const StorageData = localStorage.getItem("GlobalData"),
            GlobalData = StorageData ? JSON.parse(StorageData) : {};
          if (param.path) {
            if (param.query) {
              param.query.appId = localStorage.projectAppId;
              param.query.cityId = GlobalData.cityId || '';
              param.query.zoneId = GlobalData.zoneId || '';
              param.query.isH5 = isH5();
              // param.query.isShare = true;       //这是用来给转发的时候用的，虽然这个做法有点不合理，但是目前还没想出其它的方法，想过在updateShareConfig里面进行更改，但是没有用
              if (param.isDeBug) param.query.deBug = true;
            } else {
              param.query = {
                appId: getUrlParams(window.location.href).appId || localStorage.projectAppId,
                debug: param.isDeBug,
                cityId: GlobalData.cityId || '',
                zoneId: GlobalData.zoneId || '',
                // isShare:true     //这是用来给转发的时候用的，虽然这个做法有点不合理，但是目前还没想出其它的方法，想过在updateShareConfig里面进行更改，但是没有用
              }
            }
            if (replace) {
              this.$replaceRoute(param)
              return
            }
            this.$router.push({
              path: param.path,
              query: param.query
            })
          } else if (param.name) {
            if (replace) {
              this.$replaceRoute(param)
              return
            }
            this.$router.push({
              name: param.name,
              params: param.params
            })
          } else if (param.wechat && param.wechat.url) {
            console.log("开始外部跳转")
          } else {
            console.log(param)
            console.log("path's value and name's value in param is null")
          }
        },
        async checkBindTel(query) {
          /**
           * {
           *     callBack   当用户绑定成功后返回到之前的那个页面
           * }
           *
           * */
          //console.log(this.user)
          if (!this.user.userTel || this.user.userTel == "undefined") {
            try {
              await showDialog(isH5() ? "请先进行登录" : "请先绑定手机号", "提示",);
              query ? this.goPointPage({
                path: '/login',
                query: query
              }) : this.goPointPage({name: 'Login'});

            } catch (e) {
              return false
            }
          } else {
            return true
          }
        },
        async findInfo(info) {
          console.log('infoinfoinfoinfoinfo', info)
          if (!info || JSON.stringify(info) == '{}') {
            try {
              await showDialog('相关数据已下架或不存在', '提示', false)
              this.$router.go(-1);
            } catch (e) {
              return false
            }
          }
        },
        // 页面的滚动事件，上拉加载，到了底部就会进行触发，
        //一个参数是函数名，第二参数
        onscroll(fn, path, fn2) {
          const _this = this;
          window.onscroll = null;
          window.onscroll = function () {
            const t = this.scrollY,
              sH = document.body.scrollHeight,
              cH = this.screen.height;
            if (t + cH >= sH && _this.$route.path == path) {
              fn && fn()
            } else {
              fn2 && fn2(t);
            }
          }
        },
        // 下拉刷新 第一个值是dome元素，第二是需要执行的函数
        scrollRefresh(dome, fn) {
          dome.sY = 0;
          dome.eY = 0;
          dome.style.position = 'relative';
          const temp = document.createElement("div");
          temp.style.cssText = `height: 50px;display: flex;
        align-items: center;justify-content: center;position:absolute;top:-50px;
        width: 100%;font-size: 14px;
         z-index:0;
        `;
          temp.innerHTML = 'hssg真帅^_^';

          function reduction() {
            dome.removeChild(temp);
            document.documentElement.style.overflowY = 'scroll';
            dome.style.transform = 'translateY(0px)';
            dome.style.transitionDuration = '.5s';
          }

          dome.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            dome.style.transitionDuration = '0s';
            dome.sY = e.touches[0].pageY;
            dome.eY = 0;
            dome.appendChild(temp);
          });
          dome.addEventListener('touchmove', (e) => {
            e.stopPropagation();
            dome.eY = e.touches[0].pageY;
            if (window.scrollY <= 0 && dome.eY - dome.sY > 0) {
              document.documentElement.style.overflowY = 'hidden';
              dome.style.transform = 'translateY(' + (dome.eY - dome.sY) / 2 + 'px)';
            }
          });
          dome.addEventListener('touchend', (e) => {
            if (dome.eY - dome.sY > 100) {
              dome.style.transform = 'translateY(50px)';
              dome.style.transitionDuration = '.5s';
              fn & fn(reduction)
            } else {
              reduction();
            }
          })
        },
        hideTelNumber(tel) {
          return tel.substr(0, 3) + '****' + tel.substr(7)
        },
        hideUserName(userName) {
          return userName.split("").map((v, index) => {
            return index ? "*" : v;
          }).join("")
        },
        // 开发时候的弹窗,每次打包的时候都需要检查一遍alert,所以封装一下，在开发模式的时候，可以显示alert否则就不会显示
        alert(v) {
          isDev && alert(v);
        },
        //微信图片上传方法
        async wxUploadImg(mediaIdArr, solo) {
          let that = this;
          let promiseArr = mediaIdArr.map(async (item) => {
            //console.log("item==>", item)
            if (that.getType(item) == 'string' && item.indexOf('http') > -1) {
              return {
                type: 'img',
                url: await item.substring(that.assetPath.length)
              }
            } else if (that.getType(item) == 'json' && item.url && item.type) {
              return item
            } else {
              const url = await this.getWxUpload({mediaId: item})
              return {
                type: 'img',
                url: url.data
              }
            }
          })
          let arr = await Promise.all(promiseArr);
          return solo ? arr[0] : arr
        },
        /**  获取数据类型 */
        getType(obj) {
          if (Object.prototype.toString.call(obj) === '[object Array]') {
            return 'array';
          } else if (Object.prototype.toString.call(obj) == '[object FileList]') {
            return 'fileList'
          } else if (obj === true || obj === false) {
            return 'boolean';
          } else if (typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length) {
            return 'json'
          } else {
            return typeof (obj)
          }
        },
        judgeData(obj, tips) {
          const type = this.getType(obj);
          console.log("type", type);
          let success = false;
          switch (type) {
            case 'string':
              success = (!obj.trim() || obj == null || obj == undefined || obj == 'undefined')
              break;
            case 'number':
              success = (isNaN(obj))
              break;
            case 'array':
              success = (obj.length <= 0)
              break;
          }
          success && tips && Toast({
            message: tips,
            duration: 1500
          })
          return !success;
        },
        /** 过滤链接的参数 */
        UrlFilter(url, arr) {
          let urlParams = getUrlParams(url);
          for (let i in arr) delete urlParams[arr[i]];
          url = url.indexOf("?") >= 0 ? url.split("?")[0] + "?" : url + '?';
          for (let p in urlParams) if (p && urlParams[p]) url += p + "=" + urlParams[p] + "&";


          if (!urlParams.appId) url += 'appId=' + (getUrlParams(window.location.href).appId || localStorage.projectAppId)

          return url
        },
        /** 获取二维码 */
        getQRCode(params = {}) {
          console.log("qrcodeDom", params.dom)
          try {
            params.dom && (params.dom.innerHTML = null);
            new QRCode(params.dom.id, {
              width: params.width || params.dom.offsetWidth || 100, // 设置宽度，单位像素,父级设置/参数设置/默认
              height: params.height || params.dom.offsetHeight || 100, // 设置高度，单位像素
              text: this.UrlFilter(params.url || window.location.href, ['code', 'state']),   // 设置二维码内容或跳转地址
              typeNumber: 4,
              correctLevel: QRCode.CorrectLevel.H
            });
            // let that = this;
            // params.dom.querySelector('img').onclick = function () {
            //   that.previewImage(this.getAttribute('src'))
            // }
          } catch (e) {
            console.warn(e);
          }
        },
        callTel(tel) {
          window.location.href = `tel://${tel}`;
        },
        /**
         *  是否是错误的参数
         *  目前是用在页面跳转之后的参数判断
         *  如果是无效的参数的话默认返回上一级页面
         *  params={
         *      field,  //值     array | json | string | number
         *      tips,   //失败的提示  array | json | string | number
         *      filter, //过滤  array | string
         *      success,  //成功的回调 event
         *      fail,   //失败的回调 event
         *      noBack, //不允许返回上一级 boolean
         *  }
         *  s : //成功的回调 event
         *  e : //失败的回调 event
         * */
        isFailParams(params = {}, s, e) {
          const that = this;

          function fail(key) {
            const field = params.field;
            if (params.fail) {
              params.fail.call(that);
              if (that.getType(field) == 'json') {
                e ? e() : params.fail(params.tips && params.tips[key] ? params.tips[key] : key);
              } else if (that.getType(field) == 'array') {
                e ? e() : params.fail(params.tips && params.tips[key] ? params.tips[key] : params.tips);
              } else {
                e ? e() : params.fail('缺少参数');
              }
            } else {
              let message = params.tips || "缺少参数";
              if (that.getType(field) == 'json') {
                message = params.tips && params.tips[key] ? params.tips[key] : key;
              } else if (that.getType(field) == 'array') {
                message = params.tips && params.tips[key] ? params.tips[key] : params.tips
              }
              Toast.fail({
                message,
                duration: 1500
              });
              !params.noBack && setTimeout(() => {
                that.$router.go(-1)
              }, 1500);

            }
            return false;
          }

          function failValue(v, k) {
            if (that.getType(v) == 'json') {
              for (let k in v) return false
              return true
            }

            if (params.number) {
              if (params.number.indexOf(k) >= 0) {
                if (!isNaN(v) && v > 0) {
                  return false
                } else {
                  return true
                }
              }
            }

            return (v == undefined || v == null || v == 'undefined' || v == 'null' || v == '' || (that.getType(v) == 'array' && v.length == 0) || !v || JSON.stringify(v) == '{}');

          }

          if (params.field) {
            const field = params.field;
            if (this.getType(field) == 'array') {
              for (let i = 0; i < field.length; i++) {
                if (failValue(field[i]) || failValue(field)) {
                  return fail(i);
                }
              }
              s ? s() : params.success && params.success.call(that) && params.success();
            } else if (this.getType(field) == 'json') {

              if (params.math) {
                if (params.math) {
                  for (let k in field) {
                    for (let m = 0; m < params.math.length; m++) {
                      let i = params.math[m].fields.indexOf(k)
                      if (i >= 0) {
                        let firstField = params.math[m].fields[0],
                          secondField = params.math[m].fields[1],
                          three = params.math[m].fields[2];
                        if (three ? (+field[firstField] > +field[secondField]) : (+field[firstField] >= +field[secondField])) {
                          Toast.fail({
                            message: params.math[m].tips,
                            duration: 1500
                          });
                          return false;
                        }
                      }
                    }
                  }
                }
              }


              for (let k in field) {
                if (failValue(field[k], k)) {
                  if (params.filter) {
                    if (this.getType(params.filter) == 'string' && k != params.filter) {
                      return fail(k);
                    } else if (this.getType(params.filter) == 'array' && params.filter.indexOf(k) < 0) {
                      return fail(k);
                    }
                  } else {
                    return fail(k);
                  }
                }
              }
            } else if (failValue(params.field)) {
              return fail();
            } else {
              s ? s() : params.success && params.success.call(that) && params.success();
            }
            return true;
          } else {

            return fail();
          }
        },
        /** json 转 array */
        jsonToArray(json) {
          let jsonArray = [];
          if (this.getType(json) == 'json' || this.getType(json) == 'array') {
            for (let k in json) {
              jsonArray.push({
                key: k,
                value: this.getType(json[k]) == 'json' ? this.jsonToArray(json[k]) : json[k]
              })
            }
            return jsonArray;
          } else {
            console.warn("this's typeOf is :" + this.getType(json) + ", not JSON Object")
            return json;
          }
        }
        ,
        /** json 字段转换 */
        jsonChangeField(params = {}) {
          const json = params.json,
            fields = params.fields;

          if (this.getType(json) == 'json' && this.getType(fields) == 'json') {
            for (let k in fields) {

              if (!json[fields[k]]) {

                json[fields[k]] = json[k];

              } else {
                console.warn(fields[k] + " exist in json,cannot replace field.please change new field")
              }
            }
          }
          return params.json;
        }
        ,
        /** 批量删除json字段 */
        delJsonField(params) {
          let obj = params.obj;
          if (params.field) {
            if (this.getType(params.field) == 'array') {
              for (let i = 0; i < params.field.length; i++) delete obj[params.field[i]];
            } else if (this.getType(params.field) == 'json') {
              for (let k in params.field) delete obj[k];
            } else if (this.getType(params.field) == 'string') {
              delete obj[params.field];
            }
          }
          return obj;
        },
        colorRgb(color, a) {
          let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
          let sColor = color;
          if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
              let sColorNew = "#";
              for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
              }
              sColor = sColorNew;
            }
            //处理六位的颜色值
            let sColorChange = [];
            for (let i = 1; i < 7; i += 2) {
              sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return "RGBA(" + sColorChange.join(",") + "," + a + ")";
          } else {
            return sColor;
          }
        },
        /** 给元素绑定事件 */
        touch({dom, start, move, end, stop = true, change}) {
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
        },
        temporaryRepair() {
          let that = this
          let windowFocusHeight = window.innerHeight
          if (that.windowHeight == windowFocusHeight) {
            return
          }
          let currentPosition;
          let speed = 1; //页面滚动距离
          currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
          currentPosition -= speed;
          window.scrollTo(0, currentPosition); //页面向上滚动
          currentPosition += speed; //speed变量
          window.scrollTo(0, currentPosition); //页面向下滚动
        },
        each,
        inputConfirm,
        formatTime
      },
      created() {
      }
    }
  )

}
export default Plugin;
