import {requestByGet, requestByPost} from "../../util/request";
import {getSuccessData} from "../../util/dd-util";


export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    /** 发布砍价 */
    async releaseBargain({commit}, params) {
      const res = await requestByPost("city/api/bargain/save_bargain", params)
      return getSuccessData(res, {});
    },
    /** 我发布的砍价 */
    async getMyReleaseBargain({commit}, params) {
      const {data} = await requestByGet("city/api/bargain/my_bargain", params);
      return getSuccessData(data, [])
    },
    /** 砍价商品列表 */
    async getBargainList({commit}, params) {
      const {data} = await requestByGet("city/api/bargain/bargain_list", params);
      return getSuccessData(data, [])
    },
    /** 商品详情 */
    async getBargainInfo({commit}, params) {
      const {data} = await requestByGet("city/api/bargain/bargain_info", params);
      return getSuccessData(data, {})
    },
    /** 获取商品分类 */
    async getBargainCategory({commit}, params) {
      const {data} = await requestByGet("city/api/bargain/category", params);
      return getSuccessData(data, [])
    },
    /** 发起砍价 */
    async beginBargain({commit}, params) {
      const res = await requestByPost("city/api/bargain/start_bargain", params);
      return getSuccessData(res, {})
    },
    /** 砍价 */
    async bargaing({commit}, params) {
      const res = await requestByPost(("city/api/bargain/bargain_ing"), params);
      return getSuccessData(res, {})
    },
    /** 下单购买 */
    async bargainDownOrder({commit}, params) {
      const res = await requestByPost("city/api/bargain/order_pay", params);
      return getSuccessData(res, {})
    },
    /** 获取我的订单列表 */
    async getMyBargainOrderList({commit}, params) {
      const {data} = await requestByGet("city/api/bargain/my_bargain_order", params);
      return getSuccessData(data, [])
    },
    /** 商品订单列表 */
    async getBargainGoodsOrders({commit}, params) {
      const {data} = await requestByGet("city/api/bargain/good_order_list", params);
      return getSuccessData(data, []);
    },
    async bargainBeliverGoods({commit}, params) {
      const res = await requestByPost("city/api/bargain/delivery", params);
      return getSuccessData(res, {});
    },
    /** 砍价的配置信息 */
    async bargainConfig({commit}, params) {
      const {data} = await requestByGet("city/api/config/bargain", params);
      return getSuccessData(data, {})
    },
    /** 砍价公告 */
    async bargainNotic({commit}, params) {
      const {data} = await requestByGet("city/api/bargain/pay_order_list", params);
      return getSuccessData(data, []);
    },
    /** 砍价分享 */
    async bargainShare({commit}, params) {
      const res = await requestByPost("city/api/bargain/share", params);
      return getSuccessData(res, {})
    },
    async bargainWriteOff({commit}, params) {
      const res = await requestByPost("city/api/bargain/use_bargain", params);
      return getSuccessData(res, {})
    },
    /** 确认收货 */
    async confromReceivingGoods({commit}, params) {
      const res = await requestByPost("city/api/bargain/complete", params);
      return getSuccessData(res, {})
    }

  }
}
