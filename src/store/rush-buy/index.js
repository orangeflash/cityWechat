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
    /**抢购设置*/
    async getRushConfig({commit}, params) {
      const {data} = await requestByGet("city/api/config/rush", params);
      return data;
    },
    /**商品列表 */
    async getRushGoodsList({commit}, params) {
      const {data} = await requestByGet("city/api/rush/goods_list", {
        ...params
      });
      return data;
    },
    /**抢购详情 */
    async getRushGoodsInfo({commit}, params) {
      const data = await requestByGet("city/api/rush/goods_info", {
        ...params
      });
      return data;
    },
    /**抢购详情领取列表*/
    async getRushReceive({commit}, params) {
      const {data} = await requestByGet("city/api/rush/more_receive", params);
      return data;
    },
    /**抢购下单*/
    async RushSaveOrder({commit}, params) {
      const data = await requestByPost("city/api/rush/save_order", params);
      return data;
    },
    /**我的抢购列表*/
    async myRushOrderList({commit}, params) {
      const {data} = await requestByGet("city/api/rush/order_list", params);
      return data;
    },
    /** 我的抢购订单详情 */
    async getRushOrderInfo({commit}, params) {
      const {data} = await requestByGet("city/api/rush/order_info", params);
      return data;
    },
    /**核销抢购*/
    async postRushVerify({commit}, params) {
      const data = await requestByPost("city/api/rush/verify", params);
      return data;
    },
  },
}
