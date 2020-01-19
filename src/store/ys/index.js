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
    /**查看帖子悬赏设置*/
    async getRewardType({commit}, params) {
      const {data} = await requestByGet("city/api/reward/reward_type", params);
      return getSuccessData(data, {})
    },
    /**悬赏详情*/
    async getRewardInfo({commit}, params) {
      const {data} = await requestByGet("city/api/reward/reward_info", params);
      return getSuccessData(data, {})
    },
    /**应赏详情*/
    async getUserRewardInfo({commit}, params) {
      const {data} = await requestByGet("city/api/reward/user_reward_info", params);
      return getSuccessData(data, {})
    },
    /**发布悬赏*/
    async saveReward({commit, rootState}, params) {
      const result = await requestByPost("city/api/reward/save_reward", {
        ...params
      });
      return result;
    },
    /**悬赏绑定关系*/
    async rewardBind({commit}, params) {
      const result = await requestByPost("city/api/reward/bind", {
        ...params
      });
      return result;
    },
    /**应赏*/
    async joinReward({commit, rootState}, params) {
      const result = await requestByPost("city/api/reward/join_reward", {
        ...params
      });
      return result;
    },
    /*退款*/
    async rewardRefund({commit}, params) {
      const result = await requestByPost("city/api/reward/refund", params);
      return result
    },
    /**确认成功*/
    async rewardSuccess({commit}, params) {
      const result = await requestByPost("city/api/reward/confirm_success", {
        ...params
      });
      return result;
    },
    /**确认失败*/
    async rewardFail({commit}, params) {
      const result = await requestByPost("city/api/reward/confirm_fail", {
        ...params
      });
      return result;
    },
    /**申诉*/
    async rewardAppeal({commit}, params) {
      const result = await requestByPost("city/api/reward/appeal", {
        ...params
      });
      return result;
    },
    /**悬赏列表*/
    async rewardList({commit}, params) {
      const {data} = await requestByGet("city/api/reward/reward_list", params);
      return getSuccessData(data, [])
    },
    /**通知商家*/
    async rewardCall({commit}, params) {
      const result = await requestByPost("city/api/reward/call", {
        ...params
      });
      return result;
    },
    /**查看余额*/
    async rewardBalance({commit}, params) {
      const {data} = await requestByPost("city/api/reward/balance", params);
      return data
    },
    /**余额明细*/
    async rewardBalanceList({commit}, params) {
      const {data} = await requestByPost("city/api/reward/balance_list", params);
      return getSuccessData(data, [])
    },
    /*提现明细*/
    async rewardWithdrawalList({commit}, params) {
      const {data} = await requestByPost("city/api/reward/withdrawal_list", params);
      return getSuccessData(data, [])
    },
    /*提现*/
    async rewardApplyCash({commit}, params) {
      const result = await requestByPost("city/api/reward/apply_cash", params);
      return result
    },
    /*收益轮播*/
    async rewardProfitList({commit}, params) {
      const {data} = await requestByGet("city/api/reward/profit_list", params);
      return data
    },
    /*我的粉丝*/
    async rewardWdfs({commit}, params) {
      const {data} = await requestByGet("city/api/reward/my_fans", params);
      return data
    },
    /*收益轮播*/
    async rewardWdys({commit}, params) {
      const {data} = await requestByGet("city/api/reward/my_reward_list", params);
      return data
    },
  },
}
