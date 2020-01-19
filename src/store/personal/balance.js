import {requestByGet} from "../../util/request";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    /**获取余额明细列表*/
    async getBalanceList({commit}, params) {
      const {data} = await requestByGet("city/api/bill/balance_list", params);
      return data;
    },
  },
}
