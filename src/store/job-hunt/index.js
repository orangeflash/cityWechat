import {requestByGet, requestByPost} from "../../util/request";
import jobHuntEnter from './job-hunt-enter'
export default {
  namespaced: true,
  state: {
    jobConfig:{},
    jobCategory: [],
    categoryOption: [],
  },
  mutations: {
    SET_JOB_CONFIG(state, data) {
      state.jobConfig = data;
    },
    SET_JOB_CATEGORY(state, data) {
      state.jobCategory = data;
    },
    SET_CATEGORY_OPTION(state, data) {
      state.categoryOption = data;
    },
  },
  getters: {
    formatCategoryOption(state) {
      return [{ id: "", text: "全部", children: [] }, ...state.categoryOption.map(({ id, name, son }) => ({
        id,
        text: name,
        children: [{ id, text: "全部" }, ...son && son.map(({ id, name }) => ({ id, text: name }))]
      }))]
    },
  },
  actions: {
    /**招聘配置 */
    async getJobConfig({commit},params) {
      const {data} = await requestByGet("city/api/config/job",params);
      commit("SET_JOB_CONFIG", data);
      return data;
    },
    /**分类 */
    async getJobCategory({commit},params) {
      const {data} = await requestByGet("city/api/job/category",params);
      commit("SET_JOB_CATEGORY", data);
      return data;
    },
    /**分类下的标签*/
    async getCategoryLabel({commit}, params) {
      const {data} = await requestByPost("city/api/job/category_label", params);
      return data;
    },
    /**职位列表*/
    async getJobPosition({commit},params) {
      const {data} = await requestByGet("city/api/job/position",params);
      commit("SET_CATEGORY_OPTION", data);
      return data;
    },
    /**求职列表 */
    async getJobList({commit},params) {
      const {data} = await requestByGet("city/api/job/job_list",params);
      return data;
    },
    /**招聘列表 */
    async getHuntList({commit},params) {
      const {data} = await requestByGet("city/api/job/recruit_list",params);
      return data;
    },
    /**求职详情 */
    async getJobInfo({commit},params) {
      const data = await requestByGet("city/api/job/job_info",params);
      return data;
    },
    /**招聘详情 */
    async getHuntInfo({commit},params) {
      const data = await requestByGet("city/api/job/recruit_info",params);
      return data;
    },
  },
  modules: {
    jobHuntEnter,
  }
}
