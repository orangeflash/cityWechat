import {requestByGet, requestByPost} from "../../util/request";
import partnerEnter from './partner-enter'
export default {
  namespaced: true,
  state: {
    partnerConfig:{},
    businessPackages: [],
  },
  mutations: {
    SET_PARTNER_CONFIG(state, data) {
      state.partnerConfig = data;
    },
    SET_BUSINESS_PACKAGE(state, data) {
      state.businessPackages = data;
    },
  },
  actions: {
    /* 用户 */
    // async getUserSentPostNum({commit, rootState}) {
    //   const {data} = await requestByGet("city/api/post/today_post_count", {
    //     userId: rootState.user.id
    //   });
    //   return data;
    // },
    /**合伙人配置 */
    async getPartnerconfig({commit},params) {
      const {data} = await requestByGet("city/api/config/partner",params);
      commit("SET_PARTNER_CONFIG", data);
      return data;
    },
    /**轮播图*/
    async getBannerList({commit}, params) {
      const {data} = await requestByGet("city/api/information/ad_list", params);
      return data;
    },
    /**公告 */
    async getAnnounceList({commit},params) {
      const {data} = await requestByGet("city/api/information/announce_list",params);
      return data;
    },
    /**合伙人等级 */
    async getPartnergrade({commit},params) {
      const {data} = await requestByGet("city/api/partner/partner_grade",params);
      commit("SET_BUSINESS_PACKAGE", data);
      return data;
    },
    /**合伙人分销比列 */
    async getPartnergradeInfo({commit},params) {
      const {data} = await requestByGet("city/api/partner/grade_info",params);
      return data;
    },
    /**合伙人状态 */
    async getPartnerstatus({commit},params) {
      const {data} = await requestByGet("city/api/partner/partner_status",params);
      return data;
    },
    /**权利问题 */
    async getExclusive({commit},params) {
      const {data} = await requestByGet("city/api/partner/exclusive",params);
      return data;
    },
  },
  modules: {
    partnerEnter,
  }
}
