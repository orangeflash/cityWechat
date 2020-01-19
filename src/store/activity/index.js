import {requestByGet, requestByPost} from "../../util/request";
import {getSuccessData} from "../../util/dd-util";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    /** 获取活动列表 */
    async getActivityList({commit}, params) {
      const {data} = await requestByGet("city/api/activity/activity_list", params);
      return getSuccessData(data, []);
    },
    /** 获取按钮组 */
    async getActivityBtns({commit}, params) {
      const {data} = await requestByGet("city/api/activity/category", params);

      return getSuccessData(data, 'array')
    },
    /** 获取活动的详情 */
    async getActivityInfo({commit}, params) {
      const {data} = await requestByGet("city/api/activity/activity_info", params);

      return getSuccessData(data, 'json');
    },
    /**报名表单*/
    async getActivityEnrollForm({commit}, params) {
      const {data} = await requestByGet("city/api/activity/info", params);
      return data || [];
    },
    /** 获取我的活动订单 */
    async getActivityOrder({commit}, params) {
      const {data} = await requestByGet("city/api/activity/enroll_list", params);
      return data || [];
    },
    /** 取消报名 */
    async cancelEnroll({commit}, params) {
      const res = await requestByPost("city/api/activity/cancel_enroll", params);

      return res || {}
    },
    /** 评论活动 */
    async commentActivity({commit}, params) {
      const res = await requestByPost("city/api/activity/comment", params);
      return res || {}
    },
    /** 获取单个评论的所有回复 */
    async getSingelActivityComment({commit}, params) {

      const {data} = await requestByGet("city/api/activity/activity_comment", params);

      return data || {};

    },
    /** 获取所有的评论 */
    async getSingelActivityCommentAll({commit}, params) {
      const {data} = await requestByGet("city/api/activity/activity_comment_list", params);
      return data || [];

    },
    /** 核销活动订单 */
    async writerOffActivityOrder({commit}, params) {
      const res = await requestByPost("city/api/activity/verification", params);
      return res || {}
    }
    ,
    /** 活动订单售后 */
    async activityAfterSale({commit}, params) {
      const res = await requestByPost("", params);
      return res || {}
    }
    ,
    /** 发布活动 */
    async activityRelease({commit}, params) {
      const res = await requestByPost("city/api/activity/save_activity", params);
      return res || {}
    }
    ,
    /** 参加活动 */
    async activityEnroll({commit}, params) {
      const res = await requestByPost("city/api/activity/save_enroll", params);
      return res || {}
    }
    ,
    /** 获取配置信息 */
    async getActivityConfig({commit}, params) {
      const {data} = await requestByGet("city/api/config/activity", params);
      return data || {};
    }
    ,
    /** 报名详情 */
    async getEnrollInfo({commit}, params) {
      const {data} = await requestByGet("city/api/activity/enroll_info", params);
      return data || {}
    },
    /** 商家的发布信息列表 */
    async getStoerActivity({commit}, params) {
      const {data} = await requestByGet("city/api/business/my_activity", params);
      return data || [];
    },
    /** 活动上下架 */
    async activityUpOrDwon({commit}, params) {

      const res = await requestByPost("city/api/business/activity_change", params);
      return res || {}
    },
    /** 商家 活动报名详情列表 */
    async getActivityEnrollList({commit}, params) {
      const {data} = await requestByGet("city/api/business/enroll_list", params);
      return data;
    },
    /** 商家的入账信息 */
    async getStoreEntryRecord({commit}, params) {
      const {data} = await requestByGet("city/api/business/activity_capital", params);
      return getSuccessData(data, [])
    }
  },
}
