import {requestByGet, requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {
    isCanCall: false,
  },
  mutations: {
    IS_CAN_CALL(state, data) {
      state.isCanCall = data;
    }
  },
  actions: {
    /** 打赏支付*/
    async infoRewardPay({commit}, params) {
      const data = await requestByPost("city/api/common/info_reward_pay", params);
      return data;
    },
    /** 余额充值*/
    async payRechargeAction({commit}, params) {
      const data = await requestByPost("city/api/common/balance_pay", params);
      return data;
    },
    /** 刷新帖子 */
    async PayPostRefreshAction({commit, rootState}, params) {
      const data = await requestByPost("city/api/common/post_refresh_pay", {
        ...params,
        userId: rootState.user.id
      });
      return data;
    },
    /** 获取个人信息*/
    async getUserInfoById({commit}, id) {
      const data = await requestByGet("city/api/user/info", {
        id
      });
      return data;
    },
    /** 获取帖子置顶支付信息 */
    async payToppingAction({commit, rootState}, params) {
      const data = await requestByPost("city/api/common/post_top_pay", {
        ...params,
        userId: rootState.user.id
      });
      return data;
    },

    /** 支付帖子 */
    async postPayAction({commit}, params) {
      const data = await requestByPost("city/api/common/pay", params);
      return data;
    },
    /** 商家入驻支付 */
    async payBusinessEnterAction({commit, rootState}, params) {
      const data = await requestByPost("city/api/common/store_pay", {
        ...params
      });
      return data;
    },
    /** 黄页入驻支付 */
    async payYellowEnterAction({commit, rootState}, params) {
      const data = await requestByPost("city/api/common/yellow_pay", {
        ...params
      });
      return data;
    },
    /** 黄页认领支付 */
    async payPresentation({commit, rootState}, params) {
      const data = await requestByPost("city/api/common/yellow_presentation_pay", {
        ...params
      });
      return data;
    },
    /** 黄页续费支付 */
    async renewYellowEnterAction({commit, rootState}, params) {
      const data = await requestByPost("city/api/common/renew_pay", {
        ...params
      });
      return data;
    },
    /** 查看电话支付 */
    async payCallAction({commit, rootState}, params) {
      const data = await requestByPost("city/api/common/look_pay", params);
      return data;
    },
    /** 电话付费支付成功后设置一次性的全局变量值*/
    async isCanCallAction({commit}, param) {
      commit("IS_CAN_CALL", param);
      return param;
    },
    /** 交纳保证金*/
    async payDeposit({commit}, params) {
      const data = await requestByPost("city/api/common/bond_pay", params);
      return data;
    },
    /** 积分兑换支付 */
    async payIntegralExchange({commit}, params) {
      const data = await requestByPost("city/api/common/integral_pay", params);
      return data;
    },
    /** 合伙人支付 */
    async payPartnerEnterAction({commit}, params) {
      const data = await requestByPost("city/api/common/partner_pay", params);
      return data;
    },
    /** 顺风车支付 */
    async payReleaseFreeRide({commit}, params) {
      const data = await requestByPost("city/api/common/car_pay", params);
      return data;
    },
    /** 顺风车电话付费 */
    async payFreeRideLookPhone({commit}, params) {
      const data = await requestByPost("city/api/common/look_pay", params);
      return data
    },
    /** 顺风车置顶 */
    async payFreeRideTop({commit}, params) {
      const data = await requestByPost("city/api/common/car_top", params);
      return data;
    },
    /** 顺风车刷新 */
    async payFreeRideRefresh({commit}, params) {
      const data = await requestByPost("city/api/common/car_refresh_pay", params);
      return data;
    },
    /** 发布招聘支付 */
    async payHuntEnter({commit}, params) {
      const data = await requestByPost("city/api/common/recruit_pay", params);
      return data;
    },
    /** 发布求职支付 */
    async payJobEnter({commit}, params) {
      const data = await requestByPost("city/api/common/job_pay", params);
      return data;
    },
    /** 招聘电话付费 */
    async payJobHuntLookPhone({commit}, params) {
      const data = await requestByPost("city/api/common/look_pay", params);
      return data
    },
    /** 求职招聘刷新*/
    async payJobHuntRefresh({commit}, params) {
      const data = await requestByPost("city/api/common/job_refresh_pay", params);
      return data;
    },
    /** 求职招聘置顶*/
    async payJobHuntTop({commit}, params) {
      const data = await requestByPost("city/api/common/job_top_pay", params);
      return data;
    },
    /** 租房发布 */
    async payHousingDealRelase({commit}, params) {
      const data = await requestByPost("city/api/common/renting_pay", params);
      return data;
    },
    /** 租房支付*/
    async payHousingDealLookTel({commit}, params) {
      const data = await requestByPost("", params);
      return data;
    },
    /** 租房置顶支付 */
    async payHousingDealTop({commit}, params) {
      const data = await requestByPost("city/api/common/renting_top", params);
      return data;
    },
    /** 租房信息刷新*/
    async payHousingDealRefresh({commit}, params) {
      const data = await requestByPost("city/api/common/renting_refresh_pay", params);
      return data;
    },
    /** 商城订单支付 */
    async payMallOrder({commit}, params) {
      const data = await requestByPost("city/api/common/goods_pay", params);
      return data;
    },
    /** 名片发布支付 */
    async payCardOrder({commit}, params) {
      const data = await requestByPost("city/api/common/super_card_pay", params);
      return data;
    },
    /** 参加活动 */
    async payEnrollActivity({commit}, params) {
      const data = await requestByPost("city/api/common/enroll_pay", params);
      return data;
    },
    /** 超级名片置顶 */
    async payCardTop({commit}, params) {
      const data = await requestByPost("city/api/common/card_top_pay", params);
      return data;
    },
    /** 超级名片续费 */
    async payCardRenew({commit}, params) {
      const data = await requestByPost("city/api/common/renew_pay", params);
      return data;
    },
    /** 房屋出售发布支付 */
    async payHousingDealReleaseSale({commit}, params) {
      const data = await requestByPost("city/api/common/sell_pay", params);
      return data;
    },
    /** 开通续费会员 */
    async payVip({commit}, params) {
      const data = await requestByPost("city/api/common/vip_pay", params);
      return data;
    },
    /** 领取优惠劵 */
    async payReceiveCoupon({commit}, params) {
      const data = await requestByPost("city/api/common/coupon_pay", params);
      return data;
    },
    /** 拼团支付 */
    async payAssemble({commit}, params) {
      const data = await requestByPost("city/api/common/group_pay", params);
      return data;
    },
    /** 抢购支付 */
    async payRushBuy({commit}, params) {
      const data = await requestByPost("city/api/common/rush_pay", params);
      return data;
    },
    /** 商家续费支付 */
    async renewStore({commit, rootState}, params) {
      const data = await requestByPost("city/api/common/renew_pay", {
        ...params
      });
      return data;
    },
    /** 砍价商品支付 */
    async payBargain({commit}, params) {
      const data = await requestByPost("city/api/common/bargain_pay", params);
      return data;
    },
    /** 合伙人升级支付 */
    async payPartnerUpgrade({commit}, params) {
      const data = await requestByPost("city/api/common/partner_upgrade_pay", params);
      return data;
    },
    /** 交友置顶 */
    async payCityLoveTop({commit}, params) {
      const data = await requestByPost("city/api/common/friend_top", params);
      return data;
    },
    /** 悬赏支付 */
    async payReward({commit}, params) {
      const data = await requestByPost("city/api/common/reward_pay", params);
      return data;
    },
    /** 信息定制支付 */
    async payXx({commit}, params) {
      const data = await requestByPost("city/api/common/crops_post_pay", params);
      return data;
    },
    /** 信息定制会员支付 */
    async payXxVip({commit}, params) {
      const data = await requestByPost("city/api/common/crops_vip_pay", params);
      return data;
    },
  }

}
