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
    /* get请求返回金额 */
    async getHuntEnterMoney({commit}, params) {
      const {data} = await requestByGet("city/api/job/save_recruit", {
        ...params
      });
      return data;
    },
    /* 保存招聘/显示 */
    async saveHuntEnter({commit}, params) {
      const data = await requestByPost("city/api/job/save_recruit", {
        ...params
      });
      return data;
    },
    /* get请求返回金额 */
    async getJobEnterMoney({commit}, params) {
      const {data} = await requestByGet("city/api/job/save_job", {
        ...params
      });
      return data;
    },
    /* 保存招聘/显示 */
    async saveJobEnter({commit}, params) {
      const data = await requestByPost("city/api/job/save_job", {
        ...params
      });
      return data;
    },
    /**投递简历 */
    async getJobDeliver({commit},params) {
      const data = await requestByPost("city/api/job/deliver",params);
      return data;
    },
    /**我的求职简历 */
    async getMyResume({commit},params) {
      const {data} = await requestByGet("city/api/job/my_resume",params);
      return data;
    },
    /**我的招聘 */
    async getMyRecruit({commit},params) {
      const {data} = await requestByGet("city/api/job/my_recruit",params);
      return data;
    },
    /**我的收藏 */
    async getMyCollection({commit}, params) {
      const {data} = await requestByGet("city/api/job/my_collection", {
        ...params
      });
      return data;
    },
    /**招聘收到的简历 */
    async getRecruitResume({commit}, params) {
      const {data} = await requestByGet("city/api/job/recruit_resume", {
        ...params
      });
      return data;
    },
    /**保存工作/学习经历 */
    async postSaveExperience({commit}, params) {
      const data = await requestByPost("city/api/job/save_experience", {
        ...params
      });
      return data;
    },
    /**置顶套餐*/
    async getJobTop({commit}, params){
      const data = await requestByGet("city/api/job/top",params);
      return data;
    },
    /**求职招聘删除*/
    async postJobHuntDelete({commit}, params) {
      const data = await requestByPost("city/api/job/delete", {
        ...params
      });
      return data;
    },
    /* 明细详情 */
    async getpartnerInfoById({commit}, params) {
      const data = await requestByGet("city/api/partner/cash_info", params);
      return data;
    }
  },
}
