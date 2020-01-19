import {requestByGet, requestByPost} from "../../util/request";

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
    /**保存优惠券 */
    async postSaveCoupon({commit}, params) {
      const data = await requestByPost("city/api/shop_coupon/save_coupon", {
        ...params
      });
      return data;
    },
    /**优惠券列表 */
    async getCouponsList({commit}, params) {
      const {data} = await requestByGet("city/api/shop_coupon/coupon_list", {
        ...params
      });
      return data;
    },
    /**编辑详情 */
    async getCouponInfo({commit},params) {
      const {data} = await requestByGet("city/api/shop_coupon/coupon_info",params);
      return data;
    },
    /**优惠券上下架 */
    async postCouponModify({commit},params) {
      const data = await requestByPost("city/api/shop_coupon/modify",params);
      return data;
    },
    /**删除优惠券 */
    async postDelCoupon({commit},params) {
      const data = await requestByPost("city/api/shop_coupon/del_coupon",params);
      return data;
    },

  },
}
