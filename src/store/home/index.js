import defaultConfig from '../../project-config/example'
import {requestByGet} from "../../util/request";
import {setGlobalData} from "../../util";
import geolocation from './geolocation'
import components from './components'

export default {
  namespaced: true,
  state: {
    defaultConfig: [],
    homeCode: 1,
    tabConfig: {},
    launchConfig: {},
    locationAddress: {
      cityName: '',
      zoneName: '',
    },
    isChangeLocation: false,
    kpBanner:false,
  },
  mutations: {
    SET_LOCATION(state, data) {
      state.locationAddress = data;
    }, CHANGE_LOCATION(state, data) {
      Object.assign(state.locationAddress, data);
      state.isChangeLocation = true;
    }, SET_TAB_LIST(state, data) {
      state.tabConfig = data;
    }, SET_PAGE_CONFIG(state, data) {
      state.defaultConfig = [...data];
    }, SET_LAUNCH_CONFIG(state, data) {
      state.launchConfig = data;
    }, SET_KPBANNER(state, data) {
      state.kpBanner = data;
    },
  },
  actions: {
    async getZoneByAddress({commit}, params) {
      const {data: {cityId, cityName, zoneId, zoneName}} = await requestByGet("city/api/post/zone", params);

      if(!params.notChangeCityName){

        const info = {cityId, cityName, zoneId, zoneName}

        this.updateCityInfo(info);

        // await setGlobalData({
        //   cityId: cityId || '', cityName: cityName || '', zoneId: zoneId || '', zoneName: zoneName || '',defaultZooe:false
        // });
        // commit("SET_LOCATION", {cityName, zoneName});
      }
      return {cityId, cityName, zoneId, zoneName}
    },

    async updateCityInfo({commit}, params){
      await setGlobalData({
        cityId: params.cityId || '', cityName: params.cityName || '', zoneId: params.zoneId || '', zoneName: params.zoneName || '',defaultZooe:false
      });

      const cityName = params.cityName;
      const zoneName = params.zoneName;

      commit("SET_LOCATION", {cityName, zoneName});
      // console.log("%c !!!!!!updateCityInfo!!!:"+params, "color:red;font-size:20px;")
    },


    async getZoneByInfo({commit}, {cityId, cityName, zoneId, zoneName,defaultZooe}) {
      await setGlobalData({
        cityId: cityId || '', cityName: cityName || '', zoneId: zoneId || '', zoneName: zoneName || '',defaultZooe:defaultZooe
      });
      commit("SET_LOCATION", {cityName, zoneName});
      // console.log("%c !!!!!!getZoneByInfo!!!:"+cityId+cityName+zoneId, "color:red;font-size:20px;")
    },
    async getHomeCategory({commit}) {
      const {data} = await requestByGet("city/api/drag/nav", {
        type: 2
      });
      return data;
    },
    // 判断指定的城市是否还在
    async judgeCityExis( {commit},cityId){
      console.log("============cityInfo>>>>>>>>>>>>>>>>>>>>>cityInfo");
      console.log(cityId);
      if(!cityId)return false;
      const {data} = await requestByGet("city/api/post/inspect_city", {
        cityId: cityId
      });
      return data;
    },
    // 获取底部导航的数据，tab
    async getTabDragLayout({commit}, type) {
      const {data} = await requestByGet("city/api/drag/layout", {
        type: "nav"
      });
      commit("SET_TAB_LIST", (data&&data.config) ||  {});
      return data;
    }, async getPageDragLayout({commit}, type) {
      const {data} = await requestByGet("city/api/drag/layout", {
        type: "page"
      });
      commit("SET_PAGE_CONFIG", data || {});
      return data;
    }, async getLaunchDragLayout({commit}, type) {
      const {data} = await requestByGet("city/api/drag/layout", {
        type: "launch"
      });
      commit("SET_LAUNCH_CONFIG", data);
    },
    /***
     * 获取平台信息
     */
    async getPlatformInfo({commit}, params) {
      const {data} = await requestByGet("city/api/config/system", params);
      return {data};
    },
  },
  modules: {geolocation, components}
}
