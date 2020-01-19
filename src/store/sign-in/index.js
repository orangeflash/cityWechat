import {requestByGet, requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {

  },
  mutations: {

  },
  actions: {
   /** 查看本周签到记录 */
   async lookWeekSignInfo({commit}, params){
     const {data} = await requestByGet("city/api/integral/week_sign_record", params);
     return data;
   },
    /** 签到规则 */
    async signInRule({commit},params){
      const res = await requestByGet("city/api/integral/sign_rule", params);
      return res;
    },
    /** 查看是否有漏签 */
    async isRepair({commit},params){
      const res = await requestByGet("city/api/integral/is_repair", params);
      return res;
    },
    /** 签到 */
    async beginSign({commit},params){
      const res = await requestByPost("city/api/integral/sign", params);
      return res;
    },
    /** 补签 */
    async repair({commit},params){
      const res = await requestByPost("city/api/integral/repair", params);
      return res;
    },
    /** 签到记录 */
    async signRecord({commit},params){
      const res = await requestByPost("city/api/integral/sign_record", params);
      return res;
    },
    /** 签到排行榜 */
    async signRank({commit},params){
      const res = await requestByGet("city/api/integral/sign_rank", params);
      return res;
    },
  },
}
