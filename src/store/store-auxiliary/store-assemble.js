import {requestByGet, requestByPost} from "../../util/request";
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
    /** 获取商品服务范围与标签 */
    async getGoodsServiceLabel({commit}, params) {
      const {data} = await requestByGet('city/api/group/goods_label', params)
      return getSuccessData(data, []);
    },
    /** 获取分类 */
    async getGoodsCategory({commit}, params) {
      const {data} = await requestByGet("city/api/category/category", params);

      return getSuccessData(data, [])
    },
    /** 拼团商品列表 */
    async getAssembleList({commit}, params) {
      const {data} = await requestByGet("city/api/group/group_list", params);
      return getSuccessData(data, [])
    },
    /** 拼团详情订单 */
    async getAssembleInfo({commit}, params) {
      const {data} = await requestByGet("city/api/group/group_order", params);
      return getSuccessData(data, [])
    },
    /** 商家我的商品发布列表 */
    async getMyRelaseAssemble({commit}, params) {
      const {data} = await requestByGet("city/api/group/goods_list", params);
      return getSuccessData(data, [])
    },
    /** 正在拼团 */
    async getAssembleingInfo({commit}, params) {
      const {data} = await requestByGet("city/api/group/going", params);
      return getSuccessData(data, {})
    },
    /** 下单 */
    async assembleDownOrder({commit}, params) {
      const res = await requestByPost("city/api/group/save_order", params);
      return getSuccessData(res, {})
    },
    /** 我的拼团 */
    async getMyAssembleOrders({commit}, params) {
      const {data} = await requestByGet("city/api/group/my_group", params);
      return getSuccessData(data, [])
    },
    /** 订单详情 */
    async getAssembleOrderInfo({commit}, params) {
      const {data} = await requestByGet("city/api/group/order_info", params);
      return getSuccessData(data, {})
    },
    /** 团购详情 */
    async getGroupAssembleInfo({commit}, params) {
      const {data} = await requestByGet("city/api/group/group_info", params);
      return getSuccessData(data, {})
    },
    /** 核销 */
    async writerOffAssembleOrder({commit}, params) {
      const res = await requestByPost("city/api/group/verify", params);
      return getSuccessData(res, {});
    },
    /** 用户申请退款 */
    async userPayRefund({commit}, params) {
      const res = await requestByPost("city/api/group/apply_refund", params);
      return getSuccessData(res, {})
    },
    /** 商家退款 */
    async bossPayRefund({commit}, params) {
      const res = await requestByPost("city/api/group/refund", params);
      return getSuccessData(res, {})
    },
    /** 拼团配置 */
    async assembleConfig({commit}, params) {
      const {data} = await requestByGet("city/api/config/group", params);
      return getSuccessData(data, {})
    },
    /** 发布拼团商品 */
    async releaseAssemble({commit}, params) {
      const res = await requestByPost("city/api/group/save_goods", params);
      return getSuccessData(res, {})
    },
    /** 商品详情 */
    async getAssembleGoodsInfo({commit}, params) {
      const {data} = await requestByGet("city/api/group/goods_info", params);
      return getSuccessData(data, {})
    },
    /** 删除商品 */
    async delAssembleGoods({commit}, params) {
      const res = await requestByPost("city/api/group/del_goods", params);
      return getSuccessData(res, {})
    },
    /** 快递配送 - 确认收货 */
    async confirmReceipt({commit}, params) {
      const res = await requestByPost("city/api/group/complete", params);
      return getSuccessData(res, {})
    },
    /** 商家发货 */
    async deliveryOrder({commit}, params) {
      const res = await requestByPost("city/api/group/delivery", params);
      return getSuccessData(res, {})
    }
  }
}
