import {requestByGet, requestByPost} from "../../util/request";
import {getSuccessData} from "../../util/dd-util";

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
    /** 信息发布支付 */
    async balanceInfoRleasePay({commit}, params) {
      const res = await requestByPost("city/api/balance/post", params);
      return getSuccessData(res, {});
    },
    /** 信息刷新支付 */
    async balanceInfoRefreshPay({commit}, params) {
      const res = await requestByPost("city/api/balance/post_refresh", params);
      return getSuccessData(res, {})
    },
    /** 信息置顶支付(加红包) */
    async balanceInfoTopAndRedPay({commit}, params) {
      const res = await requestByPost("city/api/balance/post_top", params);
      return getSuccessData(res, {})
    },
    /** 商家入驻 */
    async balanceSotreEnterPay({commit}, params) {
      const res = await requestByPost("city/api/balance/store", params)
      return getSuccessData(res, {})
    },
    /** 资讯打赏 */
    async balanceInformationRewardPay({commit}, params) {
      const res = await requestByPost("city/api/balance/reward", params);
      return getSuccessData(res, {})
    },
    /** 商家续费 */
    async balanceSotreRenewPay({commit}, params) {
      const res = await requestByPost("city/api/balance/renew", params);
      return getSuccessData(res, {})
    },
    /** 房屋租售发布 */
    async balanceRentReleasePay({commit}, params) {
      const res = await requestByPost("city/api/balance/renting", params);
      return getSuccessData(res, {})
    },
    /** 房屋租售置顶 */
    async balanceRentTopPay({commit}, params) {
      const res = await requestByPost("city/api/balance/renting_top", params);
      return getSuccessData(res, {})
    },
    /** 租房刷新 */
    async balanceRentRefreshPay({commit}, params) {
      const res = await requestByPost("city/api/balance/renting_refresh", params);
      return getSuccessData(res, {})
    },
    /** 名片发布 */
    async balanceSuperCardPay({commit}, params) {
      const res = await requestByPost("city/api/balance/super_card", params);
      return getSuccessData(res, {})
    },
    /** 名片置顶 */
    async balanceSuperCardTopPay({commit}, params) {
      const res = await requestByPost("city/api/balance/card_top", params);
      return getSuccessData(res, {})
    },
    /** vip */
    async balanceVipJoinPay({commit}, params) {
      const res = await requestByPost("city/api/balance/vip", params);
      return getSuccessData(res, {})
    },
    /** 领取优惠卷 */
    async balanceCouponReceivePay({commit}, params) {
      const res = await requestByPost("city/api/balance/coupon", params);
      return getSuccessData(res, {})
    },
    /** 顺风车发布 */
    async balanceFreeCarRleasePay({commit}, params) {
      const res = await requestByPost("city/api/balance/car", params);
      return getSuccessData(res, {})
    },
    /** 顺风车置顶 */
    async balanceFreeCarTopPay({commit}, params) {
      const res = await requestByPost("city/api/balance/car_top", params);
      return getSuccessData(res, {})
    },
    /** 顺风车刷新 */
    async balanceFreeCarRefreshPay({commit}, params) {
      const res = await requestByPost("city/api/balance/car_refresh", params);
      return getSuccessData(res, {})
    },
    /** 保证金 */
    async balanceBondPay({commit}, params) {
      const res = await requestByPost("city/api/balance/bond", params);
      return getSuccessData(res, {})
    },
    /** 积分兑换 */
    async balanceExchangePay({commit}, params) {
      const res = await requestByPost("city/api/balance/integral", params);
      return getSuccessData(res, {})
    },
    /** 招聘 */
    async balanceHuntEnterPay({commit}, params) {
      const res = await requestByPost("city/api/balance/recruit", params);
      return getSuccessData(res, {})
    },
    /** 求职 */
    async balanceJobPay({commit}, params) {
      const res = await requestByPost("city/api/balance/job", params);
      return getSuccessData(res, {})
    }, /** 求职置顶 */
    async balanceJobTopPay({commit}, params) {
      const res = await requestByPost("city/api/balance/job_top", params);
      return getSuccessData(res, {})
    }, /** 求职刷新 */
    async balanceJobRefreshPay({commit}, params) {
      const res = await requestByPost("city/api/balance/job_refresh", params);
      return getSuccessData(res, {})
    }, /** 商城 */
    async balanceSotrePay({commit}, params) {
      const res = await requestByPost("city/api/balance/goods", params);
      return getSuccessData(res, {})
    }, /** 活动报名 */
    async balanceActivityPay({commit}, params) {
      const res = await requestByPost("city/api/balance/enroll", params);
      return getSuccessData(res, {})
    }, /** 抢购商品 */
    async balanceRushPay({commit}, params) {
      const res = await requestByPost("city/api/balance/rush", params);
      return getSuccessData(res, {})
    }, /** 拼团商品 */
    async balanceAssemlePay({commit}, params) {
      const res = await requestByPost("city/api/balance/group", params);
      return getSuccessData(res, {})
    }, /** 砍价报名 */
    async balanceBargainPay({commit}, params) {
      const res = await requestByPost("city/api/balance/bargain", params);
      return getSuccessData(res, {})
    },
    /** 查看电话付费 */
    async balanceLookTelPay({commit}, params) {
      const res = await requestByPost("city/api/balance/look", params);
      return getSuccessData(res, {})
    },
    /** 合伙人 */
    async balancePartnerPay({commit}, params) {
      const res = await requestByPost("city/api/balance/partner", params);
      return getSuccessData(res, {})
    }, /** 黄页认领 */
    async balanceYellowPresentationPay({commit}, params) {
      const res = await requestByPost("city/api/balance/yellowPresentation", params);
      return getSuccessData(res, {})
    }, /** 黄页入驻 */
    async balanceYellowPay({commit}, params) {
      const res = await requestByPost("city/api/balance/yellow", params);
      return getSuccessData(res, {})
    }, /** 合伙人升级 */
    async balancePartnerUpgradePay({commit}, params) {
      const res = await requestByPost("city/api/balance/partner_upgrade", params);
      return getSuccessData(res, {})
    },
    /** 交友置顶 */
    async balanceCityLoveTop({commit}, params) {
      const res = await requestByPost("city/api/balance/Friend_top", params);
      return getSuccessData(res, {})
    },
    /**悬赏 */
    async balanceReward({commit}, params) {
      const res = await requestByPost("city/api/balance/reward_pay", params);
      return getSuccessData(res, {})
    },
    /**信息定制 */
    async balanceXx({commit}, params) {
      const res = await requestByPost("city/api/balance/reward_pay", params);
      return getSuccessData(res, {})
    },
    /**信息定制会员 */
    async balanceXxVip({commit}, params) {
      const res = await requestByPost("city/api/balance/reward_pay", params);
      return getSuccessData(res, {})
    },
  }
}
