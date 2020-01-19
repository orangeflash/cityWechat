import {requestByGet, requestByPost} from "../../util/request";
import {getGlobalData, setGlobalData} from "../../util";
import {getSuccessData} from "../../util/dd-util";

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
    /**查看信息设置*/
    async getXxConfig({commit}, params) {
      const {data} = await requestByGet("city/api/config/crops_post", params);
      return getSuccessData(data, {})
    },
    /**查看信息分类列表*/
    async getXxtype({commit}, params) {
      const {data} = await requestByGet("city/api/crops_post/category", params);
      return getSuccessData(data, [])
    },
    /**发布信息*/
    async saveXx({commit, rootState}, params) {
      const result = await requestByPost("city/api/crops_post/save_post", {
        ...params
      });
      return result;
    },
    /**我的发布*/
    async XxWdfs({commit}, params) {
      const {data} = await requestByGet("city/api/crops_post/my_list", params);
      return data
    },
    /**会员卡列表*/
    async XxCardList({commit}, params) {
      const {data} = await requestByGet("city/api/crops_post/vip_list", params);
      return getSuccessData(data, {})
    },
    /**会员下订单*/
    async XxActivation({commit,rootState}, params) {
      const result = await requestByPost("city/api/crops_post/vip_order", {
        ...params
      });
      return result;
    },
    /**信息列表*/
    async XxList({commit}, params) {
      const {data} = await requestByGet("city/api/crops_post/post_list", params);
      return getSuccessData(data, [])
    },
    /**信息详情 */
    async getXxInfo({commit},params){
      const {data} = await requestByGet("city/api/crops_post/post_info",params);
      return getSuccessData(data,{})
    },
    /** 最新发布 */
    async XxNew({commit}, params) {
      const {data} = await requestByGet("city/api/crops_post/new", params);
      return data || [];
    },
    /**编辑个人资料*/
    async editXx({commit, rootState}, params) {
      const result = await requestByPost("city/api/crops_post/save_user_info", {
        ...params
      });
      return result;
    },
    /**查看个人资料*/
    async seeXx({commit}, params) {
      const {data} = await requestByGet("city/api/crops_post/user_info",params);
      return getSuccessData(data,{})
    },
  },
}
