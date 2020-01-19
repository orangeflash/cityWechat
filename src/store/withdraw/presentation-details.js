import {requestByGet, requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    /**
     *   获取提现信息
     *   param :{
     *       page : number,
     *       size: number,
     *       id:number
     *   }
     * */
    async getPresentationInfo({commit}, params) {
      const {data} = await requestByGet("city/api/bill/cash_list", params);
      return data;
    },
    /**
     *  获取充值信息
     *  param:{
     *       page : number
     *       size: number
     *  }
     * */
    async getRechargeInfo({commit}, params) {
      const data = await requestByGet("city/api/bill/balance_list", params);
      return data;
    },
    async getPresentationInfoById({commit}, params) {
      const data = await requestByGet("city/api/bill/cash_info", params);
      return data;
    }
  }
}
