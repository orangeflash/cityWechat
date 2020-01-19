import {requestByGet, requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {
    // businessPackages: [],
  },
  mutations: {
    // SET_BUSINESS_PACKAGE(state, data) {
    //   state.businessPackages = data;
    // },

  },
  actions: {
    /**余额明细 */
    async getStoreBalance({commit}, params) {
      const {data} = await requestByGet("city/api/business/store_balance", {
        ...params
      });
      return data;
    },
    /**余额列表 */
    async getStoreBalanceList({commit}, params) {
      const {data} = await requestByGet("city/api/business/balance_list", {
        ...params
      });
      return data;
    },
    /**商家提现*/
    async postStoreCash({commit}, params){
      const data = await requestByPost("city/api/business/apply_cash",params);
      return data;
    },
    /**提现列表*/
    async getStoreCashlist({commit}, params) {
      const {data} = await requestByGet("city/api/business/cash_list", {
        ...params
      });
      return data;
    },
    /**提现详情*/
    async getCashInfoById({commit}, params) {
      const data = await requestByGet("city/api/business/cash_info", params);
      return data;
    }
  },
}
