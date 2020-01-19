import {requestByGet, requestByPost} from "../../util/request";
import {getSuccessData} from "../../util";

export default {
  namespaced: true,
  state: {
    storeId: '',
    storeList: [],
    locationOption: [],
    categoryOption: [],
  },
  mutations: {
    SET_LOCATION_OPTION(state, data) {
      state.locationOption = data;
    },
    SET_CATEGORY_OPTION(state, data) {
      state.categoryOption = data;
    },
    SET_STOREID(state, data) {
      state.storeId = data;
    },
    SET_STORELIST(state, data) {
      state.storeList = data;
    },
  },
  getters: {
    formatCategoryOption(state) {
      return [{id: "", text: "全部", children: []}, ...state.categoryOption.map(({id, name, son}) => ({
        id,
        text: name,
        children: [{id, text: "全部"}, ...son && son.map(({id, name}) => ({id, text: name}))]
      }))]
    },
    formatLocationOption(state) {
      return [{id: "", text: "全部"}, ...state.locationOption.map(({id, name}) => ({
        id,
        text: name,
      }))]
    },
  },
  actions: {
    async getLocationOption({commit}, params) {
      const {zone} = await requestByGet("city/api/user/get_zone", params);
      commit("SET_LOCATION_OPTION", zone);
    },
    async getCategoryOption({commit}, params) {
      const {data} = await requestByGet("city/api/post/category", params);
      commit("SET_CATEGORY_OPTION", data);
    }, async getStoreList({commit}, params) {
      const {data} = await requestByGet("city/api/business/index", params);
      return data || [];
    },
    /**获取商家*/
    async getStoreByAdminId({commit}, params) {
      const {data} = await requestByGet("city/api/drag/store", params);
      return getSuccessData(data, []);
    },
    /**我的商家列表*/
    async getUserStoreList({commit}, params) {
      const {data} = await requestByGet("city/api/user/store_list", params);
      commit("SET_STORELIST", data);
      return getSuccessData(data, []);
    },
    /**设置默认店铺*/
    async getSetStore({commit}, params) {
      const data = await requestByPost("city/api/user/set_store", params);
      return data;
    },
    /**获取店铺排行榜*/
    async getStoreRanking({commit}, params) {
      const {data} = await requestByGet("city/api/business/store_rank", params);
      return data;
    },
    async getStoreCastGory({commit}, params) {
      const {data} = await requestByGet("city/api/config/store_rank", params)
      return data
    },
    /**获取商家手机端数据*/
    async getStoreData({commit}, params) {
      const {data} = await requestByGet("city/api/business/store_data", params);
      return data;
    },
    /**获取商家续费套餐*/
    async getSetmeal({commit}, params) {
      const {data} = await requestByGet("city/api/business/setmeal", params);
      return data;
    },
    /**商家续费*/
    async postStoreRenew({commit}, params) {
      const data = await requestByPost("city/api/business/store_renew", params);
      return data;
    },
  },
}
