import {requestByGet} from "../../util/request";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    /** 获取积分列表 */
    async getIntegralList({commit},params) {
      const {data} = await requestByGet("city/api/bill/integral_list" , params );
      return data
    }
  },
}
