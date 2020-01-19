// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import {uncompileStr} from "./util/dd-util";

const currentParams = getUrlParams(location.href);
currentParams.correctLinks && (location.href = uncompileStr(currentParams.correctLinks));


import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';
import common from './plugins/common';
import VueScroller from 'vue-scroller'      //滚动插件
import store from "./store"
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import ImgWrapper from './components/basic/img-wrapper'
import Header from "./components/header";
import NotData from "./components/no-data";
import {initHttpInterceptor} from "./interceptor";
import VueClipboard from 'vue-clipboard2'
import More from './components/template/more'
import {version} from './project-config/base'
import {calculateDiffTime, getUrlParams} from "./util";
import {requestByGet} from "./util/request";
import DdImage from './components/layout/dd-layout-img'

import DdLayoutDiv from './components/layout/dd-layout-div'
import DdLayoutTag from './components/layout/dd-layout-tag'
import DdLayoutSearch from './components/layout/dd-layout-search'


// import lrz from 'lrz'         // 图片压缩


Vue.use(preview, {
  tapToClose: true,
})
Vue.component("img-wrapper", ImgWrapper);     //该组件将被逐渐淘汰
Vue.component("DdImage", DdImage);
Vue.component("DdLayoutDiv", DdLayoutDiv);
Vue.component("DdLayoutSearch", DdLayoutSearch);
Vue.component("DdLayoutTag", DdLayoutTag);
Vue.component("Header", Header);
Vue.component("not-data", NotData);
Vue.component("More", More);
Vue.use(VueScroller)
Vue.use(Vant);
Vue.use(common);
Vue.use(VueClipboard);
// Vue.use(lrz);
Vue.config.productionTip = false;
initHttpInterceptor();

// 每次页面跳转的时候，都返回顶部
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});


//进来的时候清除所有的本地储存信息  当版本号改变的时候，就进行清除缓存
// if (!localStorage.isClear || localStorage.version != version) {
//   // showDialog(`版本更新有，老版本${localStorage.version}，新版本${version}`,'版本弹窗')没有效果，还是存在缓存，微信客户端里访问的还是之前的文件
//   console.log("清除缓存")
//   localStorage.clear();
//   localStorage.version = version;
//   localStorage.isClear = true;
// } else {
//   console.log('已经清除过缓存')
//   //alert("localStorage.version:"+localStorage.version)
// }

// 每日活跃量添加 - 代码块
{
  const itemTime = new Date().getTime();
  !localStorage.loginTime && (localStorage.loginTime = itemTime);
  const loginTime = localStorage.loginTime;
  if (calculateDiffTime(loginTime, itemTime)[2] > 0) {
    requestByGet("city/api/statistic/increase_visit", {
      type: 'ip'
    });
    localStorage.loginTime = itemTime
  }
}


new Vue({
  el: '#app',
  router, store,
  components: {App},
  template: '<App/>'
})
