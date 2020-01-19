import {requestByGet, requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {
    rechargeConfig: {}
  },
  mutations: {
    SET_RECHARGE_CONFIG(state, data) {
      state.rechargeConfig = data;
    }
  },
  actions: {
    /**积分配置 */
    async getRechargeConfig({commit}) {
      const {data} = await requestByGet("city/api/bill/site");
      commit("SET_RECHARGE_CONFIG", data);
    }, 
    /** 余额支付*/
    async payRechargeAction({commit},params) {
      const {data} = await requestByPost("city/api/common/balance_pay",params);
      return data;
    }
  },
}
