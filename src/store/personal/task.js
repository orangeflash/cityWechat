import {requestByGet,requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    /** 获取任务设置 */
    async getTaskSet({commit}, params) {
      const res = await requestByGet("city/api/integral/task_set", params);
      return res;
    },
    /** 任务进度 */
    async getTaskSpeedOfProgress({commit},params){
      const res = await requestByGet("city/api/integral/task", params);
      return res;
    },
    /** 今日所得积分 */
    async getToDayIntegral({commit},params){
      const res = await requestByGet("city/api/integral/my_toady", params);
      return res;
    }
  },
}
