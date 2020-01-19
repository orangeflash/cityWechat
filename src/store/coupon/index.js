import {requestByGet, requestByPost} from "../../util/request";
import {getSuccessData} from "../../util/dd-util";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    /** 发布优惠劵 */
    async releaseCoupon({commit}, params) {
      const res = await requestByPost("city/api/coupons/save_coupons", params);
      return getSuccessData(res, {})
    },
    /** 我发布的优惠劵 */
    async getMyReleaseCoupon({commit}, params) {
      const {data} = await requestByGet("city/api/coupons/my_coupons", params);
      return getSuccessData(data, [])
    },
    /** 优惠券列表 */
    async getCouponList({commit}, params) {
      const {data} = await requestByGet("city/api/coupons/coupon_list", params);
      return getSuccessData(data, [])
    },
    /** 服务范围 */
    async getServiceRange({commit}, params) {
      const {data} = await requestByGet("city/api/coupons/coupon_service", params)

      return getSuccessData(data, [])
    },
    /** 获取优惠劵详情 */
    async getCouponInfo({commit}, params) {
      const {data} = await requestByGet("city/api/coupons/coupon_info", params);
      return getSuccessData(data, {})
    },
    /** 领取优惠劵 */
    async receiveCoupon({commit}, params) {
      const res = await requestByPost("city/api/coupons/receive_coupon", params);
      return getSuccessData(res,{});
    },
    /** 优惠券领取列表 */
    async getMyCouponReciveList({commit}, params) {
      const {data} = await requestByGet("city/api/coupons/receive_coupon_list", params);
      return getSuccessData(data, []);
    },
    /** 我领取的优惠券 */
    async getMyReceive({commit}, params) {
      const {data} = await requestByGet("city/api/coupons/my_coupon", params);
      return getSuccessData(data, []);
    },
    /** 优惠劵订单详情 */
    async getCouponOrderInfo({commit}, params) {
      const {data} = await requestByGet("city/api/coupons/coupon_order", params);
      return getSuccessData(data, {})
    },
    /** 优惠劵配置 */
    async getCouponConfig({commit}, params) {
      const {data} = await requestByGet("city/api/config/coupon", params);
      return getSuccessData(data, {})
    },
    /** 核销 */
    async writeOffCoupon({commit}, params) {
      const res = await requestByPost("city/api/coupons/use_coupon", params);
      return getSuccessData(res, {})
    },
    /** 删除优惠劵 */
    async delCoupon({commit}, params) {
      const res = await requestByPost("city/api/coupons/del_coupon", params);
      return getSuccessData(res, {})
    }
  },
}
