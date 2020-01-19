import {requestByGet} from "../../util/request";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getBasicStatistics({commit}) {
      const {data} = await requestByGet("city/api/statistic/index");
      return data;
    },
    async getPostStatistics({commit}) {
      const {data} = await requestByGet("city/api/statistic/post");
      return data;
    },
    async getStoreStatistics({commit}) {
      const {data} = await requestByGet("city/api/statistic/store");
      return data;
    },
    /**招聘首页统计 */
    async getJobStatistics({commit},params) {
      const {data} = await requestByGet("city/api/job/job_statistic",params);
      return data;
    },
    async getEntryGroupCategories({commit},params) {
      const {data} = await requestByGet("city/api/post/category",params);
      return data;
    },
    /**公告 */
    async getAnnounceList({commit},params) {
      const {data} = await requestByGet("city/api/information/announce_list",params);
      return data;
    },async getBusinessList({commit},params) {
      const {data} = await requestByGet("city/api/business/index",params);
      return data;
    }
  },
}
