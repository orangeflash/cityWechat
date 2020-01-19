import {requestByGet, requestByPost} from "../../util/request";
import businessEnter from './business-enter'
import yellowEnter from './yellow-enter'
import {getSuccessData} from "../../util/dd-util";

export default {
  namespaced: true,
  state: {
    postCategories: [],
    auxiliaryArr: [],
    publicationConfig: {},
    publicationPrice: {},
    redConfig: {},
  },
  mutations: {
    SET_POST_CATEGORIES(state, data) {
      state.postCategories = data;
    },
    SET_AUXILIARYARR(state, data) {
      state.auxiliaryArr = data;
    },
    SET_PUBLICATION_PRICE(state, data) {
      state.publicationPrice = data;
    },
    SET_RED_CONFIG(state, data) {
      state.redConfig = data
    }
  },

  actions: {
    /*  1 帖子分类,2商家分类，3资讯，10商圈 */
    async getPostCategoriesByType({commit}, params) {
      const {code, data} = await requestByGet("city/api/post/category", params);
      commit("SET_POST_CATEGORIES", data);

      return {data, code};
    },
    /*发布页的集合*/
    async getPostCategoriesAggregate({commit}, params) {
      const {data} = await requestByGet("city/api/post/release_page", params);
      commit("SET_AUXILIARYARR", data);
      return data;
    },
    /** 会员免费发帖查询 */
    async queryVipFreeReleasePost({commit}, params) {
      const {data} = await requestByPost('city/api/post/free_post', params);
      return getSuccessData(data, {})
    },
    /* 发布 */
    async postArticle({commit}, params) {
      return await requestByPost("city/api/post/add", params);
    },
    /* 发布金额 */
    async getPublicationPrice({commit}, params) {
      const res = await requestByGet("city/api/post/add", params);
      commit("SET_PUBLICATION_PRICE", res.data);
      return res;
    },

    /* 支付帖子 */
    async postPayAction({commit}, params) {
      const {data} = await requestByPost("city/api/common/pay", params);
      return data;
    },
    /* 创建帖子置顶订单 */
    async createToppingOrder({commit}, params) {
      const data = await requestByPost("city/api/post/post_top_add", params);
      return data;
    },
    /* 获取帖子置顶支付信息 */
    async payToppingAction({commit, rootState}, params) {
      const {data} = await requestByPost("city/api/common/post_top_pay", {
        ...params,
        userId: rootState.user.id
      });
      return data;
    },
    /* 获取红包配置*/
    async getRedEnvelopesConfig({commit, rootState}, params) {
      const {data} = await requestByPost("city/api/config/red", params);
      console.log("SET_RED_CONFIG", data)
      commit("SET_RED_CONFIG", data)
      return data;
    }
  },
  modules: {
    businessEnter,
    yellowEnter
  }
}
