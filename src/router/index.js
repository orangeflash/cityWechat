import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
// import NProgress from 'nprogress'
import judge from 'judgejs'
/**
 * 路由
 */

import {personalRouter} from "./personal";
import {homeRouter} from "./home";
import {businessDistrictRouter} from "./business-district";
import {yellowPageRouter} from "./yellow-page";
import {publicationRouter} from "./publication";
import {cityInformationRouter} from "./city-information";
import {commonRouter} from "./common";
import {signInRouter} from "./sign-in"
import {attestRouter} from "./attest"
import {ConversationRouter} from "./conversation";
import {classificationRouter} from "./classification"
import {withdrawRouter} from './withdraw'
import {cashier} from './pay'
import {redbagRouter} from './redbag-page'
import {partnerRouter} from './partner-page'
import {auxiliaryClassRouter} from './auxiliary/auxiliary-class'
import {storeAuxiliaryRouter} from './store-auxiliary/store-auxiliary'
import {AgentIndexRouter} from './city-agent/agent-index'

import {asyncSleep, getGlobalData, calculateDiffTime, showDialog, hideLoading} from "../util";
import {registerByRequestConfig, waitWxReady} from "../util/wechat-util";
import {isH5, redirectPath} from "../project-config/base";
import {requestByGet} from "../util/request";
import {ddWeightValue} from "../util/weight-value";

Vue.use(Router)


const router = new Router({
  mode: "history",
  base: "/wechat/",
  routes: [
    {
      path: '/',
      component: Index,
      children: [
        personalRouter,
        homeRouter,
        yellowPageRouter,
        businessDistrictRouter,
        publicationRouter,
        cityInformationRouter,
        ConversationRouter,
        ...commonRouter,
        classificationRouter,
        signInRouter,
        attestRouter,
        withdrawRouter,
        cashier,
        redbagRouter,
        partnerRouter,
        auxiliaryClassRouter,
        storeAuxiliaryRouter,
        AgentIndexRouter,
      ]
    }
  ],

  /**
   * 路由拦截 滚动置顶
   */
  // scrollBehavior(to, from, savedPosition) {
  //   return new Promise(function (resolve) {
  //     setTimeout(() => {
  //       if (savedPosition) {
  //         resolve(savedPosition)
  //       } else {
  //         resolve({x: 0, y: 0})
  //       }
  //     })
  //   })
  // },
});
let callBackStack = [];
let isWxRegistered = false;
let isNotAndroidPlatformWxRegistered = false;
window.wxReady = (fn) => {
  if (isWxRegistered || isH5()) {
    return fn && fn();
  }
  callBackStack.push(fn);
};
/* 路由发生变化修改页面title */
router.beforeEach(async (to, from, next) => {
  callBackStack = [];

  if (to.path !== "/home" && to.path !== "/") {
    // NProgress.start();
  } else {
    document.title = localStorage.platformName || '';

  }


  if (!isH5()) {
    //jssdk分平台注册
    if (judge.platform() !== "android" && !isNotAndroidPlatformWxRegistered) {

      await registerByRequestConfig(redirectPath + to.fullPath);
      isNotAndroidPlatformWxRegistered = true;
      isWxRegistered = true;
    } else if (judge.platform() === "android") {
      isWxRegistered = false;
    }


  }
  if (to.query["title"]) {
    document.title = to.query["title"];
  } else if (to.meta.title) {
    document.title = to.meta.title
  }

  const user = getGlobalData("user");
  const {notRequiredValid, needBingTel} = to.meta;

  if (notRequiredValid) {
    return next();
  }
  //如果用户已绑定信息则允许通过逻辑路由
  //alert(JSON.stringify(user))
  if (needBingTel && !user.userTel) {
    try {
      await showDialog("请先绑定手机号", "提示", false);
      if (to.path === "/home" || to.path === "/") {
        return next()
      }
      next("/login")
    } catch (e) {
      next("/login")
    }

  } else {
    //console.log("needBingTel", needBingTel)

    next()
  }

  // if (true) {
  //   next()
  // } else {
  //   //
  //   if (to.path === "/home" || to.path === "/") {
  //     return next()
  //   }
  //   next("/login")
  // }

});
router.afterEach(async (to, from) => {
  const {needJsSdk} = to.meta;

  if (!isH5()) {
    if (needJsSdk && judge.platform() == "android") {
      await registerByRequestConfig(redirectPath + to.fullPath);
      isWxRegistered = true;
      callBackStack.forEach(cb => cb && cb());
    }
  }
  requestByGet("city/api/statistic/increase_visit", {
    type: 'pv'
  });
  // setTimeout(() => NProgress.done(), 300)
});
export default router;

