import {requestByGet, requestByPost} from "../../util/request";
import {getSuccessData} from "../../util/dd-util";

export default {
  namespaced: true,
  state: {
    postList: [],
    toppingOptions: [],
  },
  mutations: {
    SET_POST_LIST(state, data) {
      state.postList = data;
    },
    SET_TOPPING_OPTIONS(state, data) {
      state.toppingOptions = data;
    },
  },
  actions: {
    /* 用户已发帖子数量 */
    async getUserSentPostNum({commit, rootState}) {
      const {data} = await requestByGet("city/api/post/today_post_count", {
        userId: rootState.user.id
      });
      return data;
    },
    /* 置顶选项 */
    async getToppingOptions({commit}, params) {
      const {data} = await requestByGet("city/api/post/top", params);
      commit("SET_TOPPING_OPTIONS", data);
      return data;
    },
    /* 发送评论 */
    async submitComment({commit, rootState}, params) {
      return await requestByPost("city/api/post/comment", {
        ...params,
        userId: rootState.user.id
      });
    },
    /* 检查是否收藏 */
    async checkCollection({commit, rootState}, params) {
      return await requestByGet("city/api/post/collection", {
        ...params,
        userId: rootState.user.id
      });
    },
    /* 收藏帖子 */
    async collectPost({commit, rootState}, params) {
      return await requestByPost("city/api/post/collection_post", {
        ...params,
        userId: rootState.user.id
      });
    },
    /* 根据参数获取帖子 */
    async getPostListByParams({commit}, params) {
      const {data} = await requestByGet("city/api/post/post_list", params);
      return data;
    },
    /* 根据参数获取个人帖子 */
    async getMyPostListByParams({commit, rootState}, params) {
      const {data} = await requestByGet("city/api/user/post", {
        ...params,
      });
      return data;
    },
    /* 点赞帖子 */
    async likePostAction({commit}, params) {
      const {code, data} = await requestByGet("city/api/post/praise", params);
      return code;
    },
    /* 结束帖子 */
    async cancelPostAction({commit}, params) {
      const {code, data} = await requestByPost("city/api/post/end", params);
      return code;
    },
    /* 删除帖子 */
    async deletePostAction({commit}, params) {
      const {code, data} = await requestByPost("city/api/post/destroy", params);
      return code;
    },

    /* 获取帖子详情 */
    async getPostDetailById({commit}, params) {
      return await requestByGet("city/api/post/index", params);
    },
    /* 评论详情 */
    async getCommentDetailById({commit}, params) {
      return await requestByGet("city/api/post/common_details", params);
    },
    /* 刷新帖子 */
    async PayPostRefreshAction({commit, rootState}, params) {
      const res = await requestByPost("city/api/common/post_refresh_pay", {
        ...params,
        userId: rootState.user.id
      });
      return res;
    }, /* 查看电话支付 */
    async payCallAction({commit, rootState}, params) {
      const {data} = await requestByPost("city/api/common/look_pay", params);
      return data;
    },
    /* 领取红包 */
    async getRedMoneyById({commit, rootState}, params) {
      const data = await requestByPost("city/api/post/bonus", {
        ...params,
        user_id: rootState.user.id,
      });
      return data;
    },

    /* 获取领取红包列表 */
    async getRedListById({commit, rootState}, params) {
      const data = await requestByGet("city/api/post/red_list", {
        ...params,
      });
      return data;
    },
    /** 记录浏览的记录 提供给任务用的 */
    async recrodBrowser({commit}, params) {
      const data = await requestByPost("city/api/post/browser", params);
      return data;
    },
    /* 获取红包排行 */
    async getRedRank({commit}, params) {
      const data = await requestByGet("city/api/post/red_rank", {
        ...params,
      });
      return data;
    },
    /** 单个帖子评论列表 */
    async postCommentList({commit}, params) {
      const data = await requestByGet("city/api/post/post_comment_list", {
        ...params,
      });
      return data;
    },
    /** 增加分享 */
    async plusShare({commit}, params) {

      const data = await requestByGet("city/api/post/share", params);

      return data;

    },
    /** 查看会员免费刷新次数 */
    async getFreeRefreshNum({commit}, params) {
      const {data} = await requestByPost("city/api/post/free_refresh", params);
      return getSuccessData(data, {})
    },
    /** 查看会员帖子免费查看电话收费 */
    async getFreeLookTelNum({commit}, params) {
      const {data} = await requestByPost("city/api/post/free_look", params);
      return getSuccessData(data, {})
    }
  }
}
