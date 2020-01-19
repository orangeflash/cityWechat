import {requestByGet, requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {
    shopDetail: {},
  },
  mutations: {
    SET_SHOP_DETAIL(state, data) {
      state.shopDetail = data || {};
    }
  },
  actions: {
    async getShopInfoByParams({commit}, params) {
      const {data} = await requestByGet("city/api/drag/store", params);
      return data;
    },
    async getShopListByParams({commit}, params) {
      const {data} = await requestByGet("city/api/business/index", params);
      return data;
    },
    async getShopInfoWithUserId({commit, rootState}, params) {
      const {data, code} = await requestByGet("city/api/business/info", {
        userId: rootState.user.id,
        ...params,
      });
      commit("SET_SHOP_DETAIL", data);
      return code;
    },
    async getShopInfoWithUserIdById({commit, rootState}, storeId) {
      const {data, code} = await requestByGet("city/api/business/info", {
        userId: rootState.user.id,
        id:storeId,
      });
      commit("SET_SHOP_DETAIL", data);
      return data;
    },
    async submitShopComment({commit}, params) {
      return await requestByPost("city/api/business/comment", params);
    },
    async collectStore({commit}, params) {
      const {data} = await requestByPost("city/api/post/collection_post", params);
      return data;
    },
    /** 保存分享数量 */
    async preservationShareNum({commit},params){
      const data = await requestByPost("city/api/business/share",params);
      return data;
    }
  },
}
