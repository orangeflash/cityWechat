import {requestByGet, requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {
    businessPackages: [],
  },
  mutations: {
    SET_BUSINESS_PACKAGE(state, data) {
      state.businessPackages = data;
    },

  },
  actions: {
    /* 获取入驻套餐 */
    async getBusinessEnterVersion({commit}) {
      const {data} = await requestByGet("city/api/business/setmeal");
      commit("SET_BUSINESS_PACKAGE", data);
    },
    /* 获取商圈选项 */
    async getTradeOptions({commit}, type) {
      return (await requestByGet("city/api/business/get_trade", {type})).data;
    },
    /* 获取帖子分类选项 */
    async getPostCategoryOptions({commit}, type) {
      return (await requestByGet("city/api/post/category", {type})).data;
    },
    /* 商家入驻保存 */
    async submitBusinessForm({commit, rootState}, params) {
      const {data} = await requestByPost("city/api/business/add", {
        adminId: rootState.user.id,
        ...params
      });

      return data;
    },
    /* 商家入驻支付 */
    async payBusinessEnterAction({commit, rootState}, params) {
      const {data} = await requestByPost("city/api/common/store_pay", {
        ...params
      });
      return data;
    },
  },
}
