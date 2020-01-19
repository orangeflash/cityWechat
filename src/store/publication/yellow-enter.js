import { requestByGet, requestByPost } from "../../util/request";

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
    async getBusinessEnterVersion({ commit },params) {
      const { data } = await requestByPost("city/api/yellow_page/setmeal",{
        ...params
      });
      commit("SET_BUSINESS_PACKAGE", data);
    },
    /* 获取区域选项 */
    async getTradeOptions({ commit }, type) {
      return (await requestByGet("city/api/business/get_trade", { type })).data;
    },
    /* 获取黄页分类选项 */
    async getPostCategoryOptions({ commit }, type) {
      return (await requestByGet("city/api/post/category", { type })).data;
    },
    /* yellowPage set up  黄页设置 */
    async getYellowPageSetUp() {
      const { data } = await requestByGet("city/api/config/yellow_page");
      return data;
    },
    /* yellowPage save  黄页入驻保存 */
    async submitBusinessForm({ commit, rootState }, params) {
      const { data } = await requestByPost("city/api/yellow_page/add", {
        userId: rootState.user.id,
        ...params
      });

      return data;
    },
    /* 商家入驻支付 */
    async payBusinessEnterAction({ commit, rootState }, params) {
      const { data } = await requestByPost("city/api/common/yellow_pay", {
        ...params
      });
      return data;
    },
  },
}
