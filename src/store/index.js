import Vuex from 'vuex';
import Vue from 'vue';

import {getSuccessData} from "@/util/dd-util";

Vue.use(Vuex);
import createLogger from 'vuex/dist/logger'

import home from './home'
import personal from './personal'
import shop from './shop'
import conversation from './conversation'
import publication from './publication'
import businessDistrict from './business-district'
import common from './common'
import post from "./post/index"
import attest from "./attest"
import wxPay from "./wx-pay"
import balancePay from "./balance-pay"
import integralPay from './Integral-pay'

import signIn from "./sign-in"
import YellowPage from "./yellow-page"
import partner from "./partner"

import withdraw from "./withdraw"
import presentationDetails from "./withdraw/presentation-details"

import integralMall from "./integral-mall"
import freeRide from "./free-ride"
import jobHunt from "./job-hunt"
import houingDeal from "./housing-deal"
import mall from "./mall"
import storeAuxiliary from "./store-auxiliary"
import activity from "./activity"
import card from "./card"
import vip from "./vip"
import coupon from "./coupon"
import rushBuy from "./rush-buy"
import bargain from "./bargain"
import cityLove from './city-love'
import yS from './ys'
import Xx from './xx'


import cityInformation from './city-information'
import {requestByGet, requestByPost, userLoginSuccess} from "../util/request";
import createPersistedState from "vuex-persistedstate";
import classification from "./classification/index"
import {getGlobalData, setGlobalData, removeGlobalData} from "../util";

/* 城市代理 */
import cityAgent from './city-agent'

export default new Vuex.Store({
  state: {
    user: {},
    platform: {},     //平台信息
    assetPath: '',
    isDebug: false,     //是否允许页面进行显示deBug
    isFollow: false,    //是否关注过平台
    configSwitch: {},   //平台开关
    recruitScrollY: 0,
  },
  mutations: {
    SET_USER(state, data = {}) {
      state.user = data;
    },
    SET_PLATFORM_INFO(state, data = {}) {
      state.platform = data;
      state.assetPath = data.url;
      localStorage.assetPath = data.url;
      localStorage.platform = JSON.stringify(data);
      home.state.kpBanner = data.isOpenImg
    },
    SET_IS_DEBUG(state, data = {}) {
      state.isDebug = data;
    },
    SET_IS_FOLLOW(state, bool = false) {
      state.isFollow = bool;
    },
    SET_CONFIG_SWITCH(state, params = {}) {
      state.configSwitch = params;
    },
    changeRecruitScrollY(state, recruitScrollY) {
      state.recruitScrollY = recruitScrollY;
    },

  },
  actions: {
    setUserInfo({commit}, params) {
      commit("SET_USER", params);
      setGlobalData({
        ...getGlobalData("sessionKey"),
        user: params
      });
    },
    async userLogin({commit}, params) {
      const {data, code, msg} = await requestByGet("city/api/login/web_bind", params);
      if (code) {
        data.user.isVip = data.user.isVip == 1;
        commit("SET_USER", data.user);
        setGlobalData({
          sessionKey: data.sessionKey,
          user: data.user
        });
      }
      return {data, code, msg};
    },
    async loginAction({commit}, params) {
      const {data, code, msg} = await requestByGet("city/api/login/bind", params);
      if (code) {
        data.user.isVip = data.user.isVip == 1;
        commit("SET_USER", data.user);
        setGlobalData({
          sessionKey: data.sessionKey,
          user: data.user
        });
      }
      return {data, code, msg};
    },
    async refreshUserInfo({commit, rootState}, params) {
      const {data, code} = await requestByGet("city/api/user/info", {
        id: rootState.user.id
      });
      if (code) {
        data.isVip = data.isVip == 1;
        commit("SET_USER", {
          ...rootState.user,
          ...data
        });
        setGlobalData({
          user: {
            ...getGlobalData("user"),
            ...data
          }
        });
      }
      return code;
    },
    async getUserCommonInfo({commit}, params) {
      const {data} = await requestByGet("city/api/user/common", params);
      commit("SET_IS_FOLLOW", data.follower);
    },
    async getWxUserInfo({commit, rootState}, params) {
      const {data, code} = await requestByGet("city/api/login/get_info", params);
      if (code) {
        const user = {
          id: data['id'],
          userName: data["nickname"],
          sex: data["sex"],
          portrait: data["headimgurl"],
          userTel: data['userTel'],
          isVip: data['isVip'] ? +data['isVip'] == 1 : false,
        };
        commit("SET_USER", user);
        setGlobalData({
          user
        });
      }
      return code;
    },

    // 这里是通过微信的Code值进行获取openId
    async checkLoginByCode({commit, rootState}, params) {
      const res = await requestByGet("city/api/login/login", {...params, type: "weChat"});
      const {data, code} = res;
      //   alert(JSON.stringify(res));
      if (code === 1) {
        if (data.user) {
          data.user.isVip = data.user.isVip == 1;
          commit("SET_USER", data.user);
          setGlobalData({
            sessionKey: data.sessionKey,
            user: data.user
          });
        } else {
          // 进入这里说明上一次的sessionKey是有效的
          const user = getGlobalData("user");
          commit("SET_USER", user);
        }
        //alert(getGlobalData("user").id+'*****'+getGlobalData("partnerId"))
      } else {
        removeGlobalData("sessionKey");
        // 用户没有绑定手机号

        if (data.hasOwnProperty('nickname')) {
          const user = {
            userName: data["nickname"],
            sex: data["sex"],
            portrait: data["headimgurl"],
          };
          commit("SET_USER", user);
        } else if (res.msg == "获取openId失败") {
          localStorage.removeItem('openId')
          removeGlobalData("user");
          localStorage.clear();

          return res;
        }
      }
      return res;
    },
    async getJsSdkConfig({commit}, params) {
      const {data} = await requestByGet("city/api/login/sign", params);
      return {
        "signature": data["sign"],
        "appId": data["appId"],
        "nonceStr": data["str"],
        "timestamp": data["time"]
      };
      // const {data} = await axios.get("http://192.168.1.20:3019/cityNode/api/wechat/basic/getJsSdkConfig");
      // return data;
    },
    /***
     * 获取平台信息
     */
    async getPlatformInfo({commit}, params) {
      const {data} = await requestByGet("city/api/config/system", params);
      commit("SET_PLATFORM_INFO", data);

      return data;
    },
    setDebugStatus({commit}, bool) {
      localStorage.debugData = [];
      commit("SET_IS_DEBUG", bool);
    },
    setFollowStatus({commit}, bool) {
      commit("SET_IS_FOLLOW", bool);
    },
    // 重置用户信息 目前是用在设置里面的清除缓存那里
    resetUser({commit}) {
      localStorage.removeItem("GlobalData");
      commit("SET_USER", {});
    },
    /** 广告位 */
    async getInformationAdList({commit}, params) {
      const res = await requestByGet('city/api/Information/adList', params);
      return res;
    },
    /** 收藏 */
    async collectionPost({commit}, params) {
      const {data} = await requestByPost("city/api/post/collection_post", params);
      return data;
    },
    /**
     * 获取个人收藏
     */
    async getMyCollection({commit}, params) {
      const {data} = await requestByGet("city/api/user/my_collection", {
        ...params,
      });
      return data;
    },
    /** 公告 */
    async getAnnounce({commit}, params) {
      const {data} = await requestByGet("city/api/Information/announceList", params);
      return data || [];
    },
    /** 区域代理列表 */
    async getZoneList({commit}, params) {
      const {data} = await requestByGet("city/api/city_agent/zone_list", params);
      return getSuccessData(data, [])
    },
    /** 获取城市列表 */
    async getCityList({commit}, params) {
      const {city, zone} = await requestByGet("city/api/user/get_zone", params);
      return {
        city: getSuccessData(city, {}),
        zone: getSuccessData(zone, []),
      }
    },
    /** 网络地址转站点地址 */
    async getLocationUrl({commit}, params) {
      const {data} = await requestByGet("city/api/common/get_files", params);
      return getSuccessData(data, "string");
    },
    /** 举报 */
    async reportInfo({commit}, params) {
      const res = await requestByPost("city/api/common/accusation", params);
      return getSuccessData(res, {})
    },
    /** 全局开关 */
    async configSwitch({commit}, parmas) {
      const {data} = await requestByGet("city/api/config/switch", parmas);

      for (let key in data) {
        if (data[key] == '1') data[key] = true
        if (!data[key]) data[key] = false


        if (data[key] != true) {
          switch (data[key]) {
            case '1':
              data[key] = true
              break;
            case  "open":
              data[key] = true
              break;
            case  "yes":
              data[key] = true
              break;
            default:
              data[key] = false
          }
        }
      }

      commit("SET_CONFIG_SWITCH", data)

      console.log("configSwitch===========>", data)


      return getSuccessData(data, {})
    }
  },
  plugins: [
    createLogger(),
    createPersistedState({
      paths: ["conversation"]
    }),
  ],
  modules: {
    businessDistrict,
    home,
    personal,
    common,
    shop,
    publication,
    cityInformation,
    conversation,
    post,
    classification,
    attest,
    wxPay,
    withdraw,
    YellowPage,
    presentationDetails,
    signIn,
    partner,
    integralMall,
    freeRide,
    jobHunt,
    houingDeal,
    mall,
    storeAuxiliary,
    activity,
    card,
    cityAgent,
    vip,
    coupon,
    rushBuy,
    bargain,
    balancePay,
    integralPay,
    cityLove,
    yS,
    Xx,
  }
})
