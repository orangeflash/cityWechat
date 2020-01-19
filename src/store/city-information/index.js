import {requestByGet, requestByPost} from '../../util/request';
import {utilMixins} from '../../plugins/util-mixins.js';
import axios from 'axios'
import CitySrarch from "./city-search.js"

export default {
  namespaced: true,
  state: {
    searchListInfo: [],
    zxConfig: {},
  },
  mutations: {
    GET_SEARCH_result(state, data) {
      state.searchListInfo = data;
    },
    SET_ZXCONFIG(state, data) {
      state.zxConfig = data.field ? data : {field: "资讯"};
    }
  },
  actions: {
    /*设置*/
    async getZxConfig({commit}, params) {
      const {data} = await requestByGet("city/api/Config/information", params);
      commit("SET_ZXCONFIG", data);
      return data
    },
    /**
     * @param 获取同城资讯首页卡片数据
     */
    async getCityCategory({commit}, params) {

      try {
        const {data} = await requestByGet('city/api/post/category', params);
        return data
      } catch (error) {
        return false;
      }
    },

    /**
     * @param 获取同城首页资讯列表
     */
    async getCityInfoList({commit}, params) {
      try {
        const cityInfoList = await requestByGet('city/api/information/index', params);
        return cityInfoList.data;
      } catch (error) {
        return false;
      }
    },

    /**
     * @param 获取资讯详情
     */
    async getInformationDetail({commit}, params) {
      try {
        const informationDetail = await requestByGet('city/api/information/info', params);
        // let timer = parseInt(informationDetail.data.createdAt);
        // informationDetail.data.createdAt = utilMixins.methods.formatDateByTimeStamp(timer);
        return informationDetail;
      } catch (error) {
        return false;
      }
    },
    /**
     * 同城搜索
     */
    async citySearchInfo({commit}, params) {
      try {
        const searchList = await requestByGet("city/api/information/search", params);
        commit("GET_SEARCH_result", searchList);
        return searchList;
      } catch (error) {
        return false
      }
    },

    /**
     * 资讯详情收藏
     */
    async keepMyLove({commit}, params) {
      try {
        const result = requestByGet("city/api/post/collection_post", params);
        return result
      } catch (error) {
        return false;
      }
    },
    //发布信息
    async postCategory({commit}, params) {
      try {
        const result = await requestByPost("", params);
        return result
      } catch (error) {
        return false
      }
    },

    /** 打赏价格 */
    async rewardPrice({commit}, params) {
      try {
        const result = await requestByPost("city/api/information/reward", params);
        return result
      } catch (error) {
        return false
      }
    },
    /** 资讯分享 */
    async informationShare({commit}, params) {
      const result = await requestByPost("city/api/information/share", params);
      return result;
    },
    async informationComment({commit}, params) {
      const result = await requestByPost("city/api/information/comment", params);
      return result
    },
    /** 查看所有的评论 */
    async getInformationComments({commit}, params) {
      const {data} = await requestByGet("city/api/information/more_comment", params);
      return data;
    }
  },
  modules: {
    CitySrarch,
  }
};
