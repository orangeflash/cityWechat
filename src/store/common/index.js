import {debug, requestByGet, requestByPost} from "../../util/request";
import axios from "axios"
import search from './search'
import login from "./login";
import {getSuccessData, setGlobalData, showDialog} from "../../util";
import {backendPath} from "../../project-config/base";

export default {
  namespaced: true,
  state: {
    latLng: {
      latitude: 30.59276,
      longitude: 114.30525
    },
    adInfo: {},
    isGetLocationByLatLng: false,
    payConfig: {},
    postConfig: {},
    storeConfig: {}
  },
  mutations: {
    SET_LAT_LNG(state, data) {
      state.latLng = data || {};
    },
    SET_ISGETLATLNG(state, data) {
      state.isGetLocationByLatLng = data;
    },
    SET_ADINFO(state, data) {
      state.adInfo = data;
    },
    SET_POST_CONFIG(state, data) {
      state.postConfig = data || {};
    },
    SET_PAY_CONFIG(state, data) {
      state.payConfig = data || {};
    },
    SET_STORE_CONFIG(state, data) {
      state.storeConfig = data || {};
    }
  },
  actions: {
    async getBannerListByType({commit}, params) {
      const {data} = await requestByGet("city/api/information/ad_list", params);
      return data;
    },
    async getDefaultLatLng({commit}) {
      const {data} = await requestByGet("city/api/post/default_zone");
      const {lat, lng} = getSuccessData(data, {});
      commit("SET_LAT_LNG", {latitude: lat, longitude: lng});
      return data;
    },
    /* 根据经纬度获取地址 */
    async getLocationByLatLng({commit, state}, {latitude, longitude}) {
      const {data} = await requestByGet("city/api/common/get_address", {
        location: `${latitude},${longitude}`
      });
      commit("SET_LAT_LNG", {latitude: latitude, longitude: longitude});
      commit("SET_ISGETLATLNG", true);
      console.log(`JSON.parse(data)["result"]`, JSON.parse(data)["result"])
      commit("SET_ADINFO", JSON.parse(data)["result"]);
      const res = JSON.parse(data);
      return res["result"];
    },
    /* 帮助中心 */
    async getHelp({commit}, params) {
      return await requestByGet("city/api/config/help", params);
    },
    /**
     * 获取商家列表
     */
    async getBusinessList({commit}, params) {
      try {
        const {BusinessList} = await requestByGet("city/api/business/index", {params});
        return BusinessList;
      } catch (error) {
        return false
      }
    },

    /**
     * 获取天气
     */

    async getWether({commit, rootState}, params) {
      // const data = await requestByGet("city/api/common/get_ip_address");
      // let adcode
      // if (data.data.status == 0) {
      //   adcode = data.data.result.ad_info.adcode
      // }
      // console.log('get_ip_address',data)

      // console.log('adcode,city',adcode,gdKey)
      try {

        let city = params || 420111,
          gdKey = rootState.platform.gdKey || 'd20cdf767bfca9394a14dfa3453e36ec';

        debug({
          url: `https://restapi.amap.com/v3/weather/weatherInfo`,
          method: 'GET',
          data: {
            gdKey, city,
            tips: '第一次请求'
          },
        });

        const data = await axios.get(`https://restapi.amap.com/v3/weather/weatherInfo?key=${gdKey}&city=${city}&output =json`);

        debug({
          url: `https://restapi.amap.com/v3/weather/weatherInfo`,
          method: 'GET',
          data: data.data.lives[0],
        });

        return data.data.lives[0];
      } catch (error) {
        //showDialog(error, '获取天气error')
        return false
      }
    },
    async getPayConfig({commit}) {

      const {data} = await requestByGet("city/api/Config/pay");
      commit("SET_PAY_CONFIG", data);
      return data;
    },
    /* 发布设置 */
    async getPostConfig({commit}, params) {

      const {data} = await requestByGet("city/api/config/post");
      commit("SET_POST_CONFIG", data);

      return data;
    },
    /* 商家设置 */
    async getStoreConfig({commit}) {
      const {code, data} = await requestByGet("city/api/config/store");
      commit("SET_STORE_CONFIG", data);
      return {code, data};
    },
    /***
     * 微信图片上传
     */
    async getWxUpload({commit}, params) {
      const data = await requestByPost("city/api/common/wx_upload", params);
      return data;
    },
  },
  modules: {
    search, login
  }
}
