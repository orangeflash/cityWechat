import {requestByGet, requestByPost} from "../../util/request";
import {getSuccessData} from "../../util";

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
    /**保存特权 */
    async postAddPrivilege({commit}, params) {
      const data = await requestByPost("city/api/vip/add_privilege", {
        ...params
      });
      return data;
    },
    /** 服务范围 */
    async getVipLabel({commit}, params) {
      const {data} = await requestByGet("city/api/vip/vip_label", params)
      return getSuccessData(data, [])
    },
    /**我发布特权列表 */
    async getMyPrivilege({commit}, params) {
      const {data} = await requestByGet("city/api/vip/my_privilege", {
        ...params
      });
      return data;
    },
    /**特权上下架 */
    async postPrivilegeDisplay({commit},params) {
      const data = await requestByPost("city/api/vip/privilege_display",params);
      return data;
    },
    /**删除优惠券 */
    async postDelCoupon({commit},params) {
      const data = await requestByPost("city/api/shop_coupon/del_coupon",params);
      return data;
    },

  },
}
