import {requestByGet, requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {
    address: {}
  },
  mutations: {
    CHOICE_ADDRESS(state, data = null) {
      state.address = data;
    },
  },
  actions: {
    /** 分类列表 */
    async integralCategory({commit}, params) {
      const res = await requestByGet("city/api/integral/category", params);
      return res;
    },
    /** 商品列表 */
    async integralGoodsList({commit}, params) {
      const res = await requestByGet("city/api/integral/goods_list", params);
      return res;
    },
    /** 商品详情 */
    async integralGoodsDetails({commit}, params) {
      const res = await requestByGet("city/api/integral/goods_info", params);
      return res;
    },
    /** 下单 */
    async integralSaveOrder({commit}, params) {

      const res = await requestByPost("city/api/integral/save_order", params);
      return res;
    },
    /** 我的兑换订单 */
    async integralMyRecord({commit}, params) {
      const res = await requestByPost("city/api/integral/my_record", params);
      return res;
    },
    /** 广告 */
    async integralSlide({commit}, params) {
      const res = await requestByGet("city/api/integral/slide", params);
      return res;
    },
    /** 下单的时候从地址列表里面选择的地址 */
    async choiceAddress({commit},params){
      commit("CHOICE_ADDRESS",params);
      return params;
    },
    /** 确认收货 */
    async confirmReceipt({commit},params){
      const res = await requestByPost("city/api/integral/query",params);
      return res;
    },
    /** 核销订单 */
    async writeOffOrders({commit},params){
      const res = await requestByPost("city/api/integral/order_confirm",params);
      return res;
    },
    /** 查看订单详情 */
    async lookOrderInfo({commit},params){
      const res = await  requestByGet("city/api/integral/order_info",params);
      return res;
    },
    /** 兑换快报 */
    async exchangeNotice({commit},params){
      const res = await  requestByPost("city/api/integral/exchange",params);
      return res;
    },
    /** 分享 */
    async integralMallShare({commit},params){
      const res = await requestByPost("city/api/config/integral",params);

      return res;
    }
  },
}
