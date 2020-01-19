<template>
  <div id="app" ref="porjectApp" v-if="active">
    <router-view v-if="initialized&&initializedTheme&&!$route.meta.alive"/>
    <keep-alive>
      <router-view v-if="initialized&&initializedTheme&&$route.meta.alive"/>
    </keep-alive>
    <!--<skeleton v-else/>-->
    <!--<Debug v-if="isDebug"/>-->
    <dd-article-operaion ref="articleOperaion"/>
  </div>

</template>

<script>
  import CustomMap from "./components/basic/custom-map";
  import Debug from "./components/debug";
  import {mapActions, mapState} from 'vuex';
  import {setGlobalData} from "./util";
  import {getReplaceRouterPath} from "./plugins/common/index";

  import Skeleton from './components/template/dd-skeleton'


  import {createPoster} from "@/util/index"


  import {
    getGlobalData,
    getUrlParams,
    hideLoading,
    parseObjToParams,
    removeGlobalData,
    showDialog,
    showHandleStatusByFlag,
    showLoading
  } from "./util";
  import {isWeb, jsApiList, registerByRequestConfig, registerConfig, updateShareConfig} from "./util/wechat-util";
  import {backendPath, isDev, redirectPath, appId, version, isH5} from "./project-config/base";
  import * as axios from "axios";
  import {uncompileStr} from "./util/dd-util";
  import DdArticleOperaion from './components/template/dd-article/operation'
  import {getLocationByTXMap} from "./util/location";
  import DdLayoutImg from "./components/layout/dd-layout-img";

  export default {
    name: 'App',
    components: {DdLayoutImg, CustomMap, Debug, Skeleton, DdArticleOperaion},
    provide() {
      return {
        refreshActive: this.refreshActive,
      }
    },
    data() {
      return {
        initialized: false,
        active: true,
        initializedTheme: false,
      }
    },
    methods: {
      ...mapActions(["checkLoginByCode", "getJsSdkConfig", "getPlatformInfo", "getWxUserInfo", "refreshUserInfo", "setDebugStatus", 'getUserCommonInfo']),
      ...mapActions("post", ['getToppingOptions']),
      ...mapActions("common", ['getPayConfig', 'getStoreConfig', "getDefaultLatLng"]),
      ...mapActions("home", ["getZoneByInfo", "getTabDragLayout"]),
      ...mapActions("partner/partnerEnter", ["getpartnerMyBoss",]),
      ...mapActions(["configSwitch", "setUserInfo"]),
      openArticleTop(item, fn) {
        this.$refs.articleOperaion.openArticleTop(item, fn);
      },
      openArticleMore(item, fn) {
        this.$refs.articleOperaion.openArticleMore(item, fn);
      },
      openReport(item, fn) {
        this.$refs.articleOperaion.openReport(item, fn);
      },
      openPicker(params, fn) {
        this.$refs.articleOperaion.openPicker(params, fn);
      },
      openTopPicker(params, fn) {
        this.$refs.articleOperaion.openTopPicker(params, fn);
      },
      refreshActive() {
        this.active = false;
        setTimeout(() => this.active = true, 10)
      },
      //本地如果有openId的情况
      async initWhenHasOpenId() {
        const res = await this.checkLoginByCode({
          openid: localStorage.openId
        });
        return res;
      },
      // 授权成功但是本地无openid，并已补全参数的情况下
      async initWhenNotHasOpenId(wxCode) {
        if (!wxCode) {
          console.log("%c !!!!!!wxCode值：" + wxCode + " 无法获取openid !!!!!!", "color:red;font-size:20px;")
          return false;
        }
        // 将从微信获取到的code值进行存储
        localStorage.wxCode = wxCode;

        // 通过wxCode值去获取用户信息
        const {code, data, msg} = await this.checkLoginByCode({
          code: localStorage.wxCode
        });
        //console.log('11111111111111111')
        await this.loginSuccess(data, code, msg, wxCode);
        //console.log('222222222222222222')
      },
      // 授权成功，用wxCode从后台获取到的data数据
      async loginSuccess(data, code, msg, wxCode) {
        // 有返回用户信息就执行
        //这个说明用户没有绑定的
        // alert(JSON.stringify(data));
        // 用户没有绑定

        if (data && code === 0 && data.openid) {
          localStorage.openId = data.openid;
          // showDialog('未绑定');
          // 用户已经绑定后台
        } else if (code === 1 && data.user && data.user.openid) {
          localStorage.openId = data.user.openid;
          this.refreshUserInfo();
          //showDialog('已绑定');
        } else {
          console.log('没有获取到用户的信息', data, code);
          localStorage.clear();
          this.$router.go(0);
          return false;
          showDialog(JSON.stringify(msg));
        }
        //console.log('33333333333333')
        /**
         * 开始获取用户的微信信息
         * */
        this.getWxUserInfo({
          openId: localStorage.openId,
        });
      },
      /***
       *换取openid并登录
       */
      async login() {

        if (isH5()) {
          this.initialized = true;

          this.setUserInfo(getGlobalData("user") || {})

          return false
        }


        localStorage.weChatAppID = this.platform.weChatAppID;

        //获取url参数
        const currentParams = getUrlParams(window.location.href);
        //本地如果有openId的情况
        //console.log('localStoragelocalStoragelocalStoragelocalStorage',localStorage,getGlobalData("user"))
        if (localStorage.openId != 'undefined' && localStorage.openId) {
          //alert("本地如果有openId的情况:"+localStorage.openId+"typeof:"+typeof localStorage.openId);
          const bool = await this.initWhenHasOpenId();
          if (bool) {
            //console.log('boolboolboolbool',bool)
            if (this.user.id) {
              this.refreshUserInfo();
            } else if (bool.code == 0 && bool.msg == '获取openId失败') {
              return this.authorization(currentParams);
            }
            return this.initialized = true;
            // 如果是false就继续往下执行，为false后台已经不存在该openId

          }
          //后面不执行，去获取用户信息
        }
        //未授权进入状态  需要转跳到微信服务再转跳回来
        if (!currentParams.state && this.platform.weChatAppID) {
          return this.authorization(currentParams);
          //后面不执行，去授权微信昵称头像等信息
        }

        //授权后url中有code执行没有openid的方法

        if (!localStorage.openId && currentParams.code) {
          //console.log("%c m没有openid的")
          await this.initWhenNotHasOpenId(currentParams.code);
          this.initialized = true;
        } else if (localStorage.openId === 'undefined') {
          //console.log("%c 本地是有openid的" + localStorage.openId + ',获取到的code值：' + currentParams.code + ',开始清除本地的openId', "color:red;font-size:20px;");
          localStorage.removeItem('openId')
          if (currentParams.code) {
            //console.log("%c 获取到的code值：" + currentParams.code + ",并重新获取用户信息", "color:red;font-size:20px;");
            //currentParams.code != localStorage.wxCode && await this.initWhenNotHasOpenId(currentParams.code);
            await this.initWhenNotHasOpenId(currentParams.code);
            return this.initialized = true;
          } else {
            //console.log("%c 没有获取到wxCode 这回只能重新调用授权的接口了", "color:red;font-size:20px;")
            await this.authorization(currentParams);
          }
        }
      },
      /***
       * 注册jsSdk
       * @returns {Promise<void>}
       */
      /**初始化底部导航*/
      async initDefaultLocation() {
        const data = await this.getDefaultLatLng();
        data.defaultZooe = true;
        await this.getZoneByInfo(data);
        // 底部导航的数据是靠定位来进行获取的，必须先有定位的信息，
        await this.getTabDragLayout("nav");
      },
      async initTheme() {
        document.documentElement.style.setProperty('--mainColor', this.colorRgb(this.platform.color, 1) || "#EE4B47");
        document.documentElement.style.setProperty('--mainColor0', this.colorRgb(this.platform.color, 0) || "#EE4B47");
        document.documentElement.style.setProperty('--mainColorH', this.colorRgb(this.platform.color, 0.5) || "#EE4B47");
        await this.initDefaultLocation()
        this.initializedTheme = true;
        const currentParams = getUrlParams(location.href);
        /**
         * 当有这个的时候说明是从转发出来的
         * 假设A在北京，B在武汉，A转发给B的页面是北京的信息，
         * 则B进去的话应该是访问北京的页面，而不是武汉的页面
         * 所以就在此处将B的定位信息改变到北京
         * */
        if (+currentParams.cityId > 0) {
          setGlobalData({
            cityId: currentParams.cityId,
            zoneId: currentParams.zoneId
          })
        }
      },
      //执行授权的操作
      authorization(currentParams) {

        if (isH5()) return console.log("H5项目，不进行跳转授权")
        const appid = this.platform.weChatAppID;

        // 当用户授权成功后返回之前当前页面，并加上appId
        let url;
        if (window.location.href.split('?')[1]) {
          delete currentParams["code"];
          delete currentParams["state"];
          url = window.location.href.split('?')[0] + parseObjToParams(currentParams)
        } else {
          url = window.location.href
        }
        //if(isDev)localStorage.projectAppId = appId;
        const scope = 'snsapi_userinfo'; // snsapi_base静默授权，snsapi_userinfo弹出授权页面 （必须是弹出授权）
        const state = 'isRedirect'; // 重定向带的参数

        // 当用户没有授权的时候会进行跳转到微信的授权页面，然后在进行跳转回来 授权成功后返回的链接上就自然带上code了
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${escape(url)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;


        return void 0;
      },
    },
    computed: {
      ...mapState({
        platform: state => state.platform,
        isDebug: state => state.isDebug,
        isFollow: state => state.isFollow,
        user: state => state.user
      }),
    },
    async created() {
      //如果有debug就执行

      const currentParams = getUrlParams(location.href);

      if (currentParams.debug) {
        this.setDebugStatus();
      }
      document.title = "加载中..."

      /** 如果是开发模式的话，就直接拿取已设置好的appId */
      if (isDev) localStorage.projectAppId = appId;

      if (!localStorage.projectAppId || localStorage.projectAppId == 'undefined') {
        if (currentParams.appId && currentParams.appId != 'undefined') {
          localStorage.projectAppId = currentParams.appId;
        }
      }

      /**
       *  由于同个域名有多个appId,所以要进行判断一下
       *  个人觉得吧，应该每次进来都必须要有appId，并且appId都要重新赋值
       *  */
      if (currentParams.appId && currentParams.appId != 'undefined') {
        localStorage.projectAppId = currentParams.appId;
      }

      // 如果是分享进来的，就进行存值记录，以便有返回按钮的时候直接返回首页
      if (currentParams.isShare) {
        localStorage.isShare = currentParams.isShare
      }
      if (currentParams.partnerId && currentParams.partnerId != 'undefined') {

        setGlobalData({
          partnerId: currentParams.partnerId
        });
      } else {

      }
      // showDialog(localStorage.projectAppId,'localStorage')

      // /**
      //  * 当有这个的时候说明是从转发出来的
      //  * 假设A在北京，B在武汉，A转发给B的页面是北京的信息，
      //  * 则B进去的话应该是访问北京的页面，而不是武汉的页面
      //  * 所以就在此处将B的定位信息改变到北京
      //  * */
      // if (+currentParams.cityId > 0) {
      //   setGlobalData({
      //     cityId: currentParams.cityId,
      //     zoneId: currentParams.zoneId
      //   })
      // }
      if (currentParams.debug) localStorage.debug = currentParams.debug;

      localStorage.debug && this.setDebugStatus(true)

      this.platformInfo = await this.getPlatformInfo();
      /**版本更新就刷新页面*/
      //console.log('data.version',this.platformInfo.version,version,localStorage.version)
      if (!isDev && this.platformInfo.version != localStorage.version && localStorage.openId != 'undefined' && localStorage.openId) {
        localStorage.clear()
        localStorage.version = this.platformInfo.version
        // showDialog(window.location.href.split('?')[0] + parseObjToParams(currentParams),'版本升级')
        // 重新加载页面
        window.location.href = window.location.href.split('?')[0] + parseObjToParams(currentParams)
      }
      localStorage.weChatAppID = this.platformInfo.weChatAppID;
      localStorage.platformName = this.platformInfo.name;
      document.title = this.platformInfo.name || '公众号';

      await this.login();

      //
      //先注册sdk然后调起定位，然后初始化其他数据
      this.initTheme();


      this.configSwitch();
      this.getStoreConfig();
      this.getToppingOptions();
      this.getPayConfig();

      this.getUserCommonInfo({
        openId: localStorage.openId,
        userId: getUrlParams(location.href).partnerId,
        portrait: this.user.portrait,
        userName: this.user.userName
      });

      // 配置转发分享的信息
      // updateShareConfig();


      {

        /**
         * 手指向右滑动，返回上一页
         *
         * 目前这个还有有点小BUG的
         * 因为路由返回的都是上一级页面
         * 就好比我发布成功了，点击返回首页
         * 再进行向右滑动就会又去了发布页面
         * 解决方案：
         *  当用户返回的是首页的时候，就把router里面的路由全部清空
         *
         * */
        // const porjectApp = this.$refs.porjectApp;
        // porjectApp.startX = 0;
        //
        // porjectApp.addEventListener('touchstart', e => {
        //   porjectApp.startX = e.touches[0].pageX;
        //   porjectApp.endY = 0;
        //   console.log("porjectApp.start",porjectApp.startX)
        // });
        // porjectApp.addEventListener('touchmove', e => {
        //   porjectApp.endY = e.touches[0].pageX;
        //   console.log("porjectApp.endY",porjectApp.endY - porjectApp.startX)
        // });
        // const that = this;
        // porjectApp.addEventListener('touchend', e => {
        //
        //   const porjectAppPath = this.$route.path;
        //   if(getReplaceRouterPath(porjectAppPath)){
        //   }else{
        //     // porjectApp.endY - porjectApp.startX >= 100&&that.$router.go(-1);
        //   }
        // });
      }
    }
  }
</script>

<style lang="scss">

  @import "./assets/theme.scss";

  #app {
    background: #f9f9f9;
    min-height: 100vh;
    font-size: $font-size-xs;

  }

  .van-dialog__content {
    text-align: center;

    .van-dialog__message--has-title {
      display: inline-block;
      text-align: left;
    }
  }

  .van-swipe__indicator {
    background-color: #fff;
  }

  .van-swipe__indicator--active {
    background-color: $themeColor !important;
  }

  .van-nav-bar__title.van-ellipsis {
    color: #fff !important;
  }

  .van-nav-bar .van-icon {
    color: #fff !important;
  }

  .van-nav-bar__text {
    color: #fff !important;
  }

  .van-nav-bar__text:active {
    background: $themeColor !important;
  }

  .van-hairline--bottom::after {
    border: none !important;
  }

  .van-hairline--top-bottom::after {
    border: none !important;
  }

  /** 图片变暗 */
  .grayscale {
    filter: gray;
  }


</style>


<style>
  .goods-title-bg {
    background: url("./assets/img/other/back.png") no-repeat 0 0;
    background-size: 100% 100%;
  }

  .btn-b {
    background: url("./assets/img/other/btn-b.png") no-repeat 0 0;
    background-size: 100% 100%;
  }

  .btn-b-2 {
    background: url("./assets/img/other/bargain-btn.png") no-repeat 0 0;
    background-size: 100% 100%;
  }

  .bargain-bg {
    background: url("./assets/img/auxiliary/bargain/bargain-bg.png") no-repeat 0 0;
    background-size: 100% 100%;
  }

  .red-bag-bg {
    background-image: url("./assets/img/post-datail/redBg.png");
    background-size: 100% 100%;
    background-repeat: repeat-x
  }

  .res-money-bag-bg {
    background-image: url("./assets/img/post-datail/moneyBag.png");
    background-size: 100% 100%;
  }

  .red-low-bg {
    background-image: url("./assets/img/post-datail/low-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .res-money-bg {
    background-image: url("./assets/img/post-datail/money.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .tips-bg {
    background-image: url("./assets/img/city-information/tips-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .auth-bg {
    background-image: url('./assets/img/attest/renzheng.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .coupon-bg {
    background-image: url("./assets/img/auxiliary/coupon/coupon-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .coupon-left-bg {
    background-image: url("./assets/img/auxiliary/coupon/coupon-let-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .coupon-right-bg {
    background-image: url("./assets/img/auxiliary/coupon/coupon-right-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .dingwei-bg {
    background-image: url("./assets/img/other/dingwei.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .plus-bg {
    background-image: url("./assets/img/other/plus.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .hot-bag-bg {
    background-image: url("./assets/img/post-datail/hot-bag-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
</style>

