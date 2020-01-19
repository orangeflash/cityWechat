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
    /* 商品保存 */
    async postSaveGoods({commit}, params) {
      const data = await requestByPost("city/api/shop_goods/save_goods", {
        ...params
      });
      return data;
    },
    /**商品标签*/
    async getGoodsLabel({commit}, params) {
      const {data} = await requestByGet("city/api/shop_goods/goods_label", params);
      return data;
    },
    /**商品列表 */
    async getGoodsList({commit}, params) {
      const {data} = await requestByGet("city/api/shop_goods/goods_list", {
        ...params
      });
      return data;
    },
    /**商品分类列表 */
    async getCategoryList({commit}, params) {
      const {data} = await requestByPost("city/api/shop_goods/category_list", {
        ...params
      });
      return data;
    },
    /**商品上下架 */
    async postModify({commit},params) {
      const data = await requestByPost("city/api/shop_goods/modify",params);
      return data;
    },
    /**删除商品 */
    async postDelGoods({commit},params) {
      const data = await requestByPost("city/api/shop_goods/del_goods",params);
      return data;
    },
    /**编辑商品详情 */
    async getGoodsInfo({commit},params) {
      const {data} = await requestByGet("city/api/shop_goods/goods_info",params);
      return data;
    },
    /**编辑商品规格 */
    async postModifySpec({commit},params) {
      const data = await requestByPost("city/api/shop_goods/modify_spec",params);
      return data;
    },
    /**配送设置 */
    async postBusinessSet({commit},params) {
      const data = await requestByPost("city/api/business/set",params);
      return data;
    },
    /**地址列表 */
    async getDeliverSet({commit},params) {
      const {data} = await requestByPost("city/api/business/deliver_set",params);
      return data;
    },
    /**保存地址 */
    async postSaveAddress({commit},params) {
      const data = await requestByPost("city/api/business/save_address",params);
      return data;
    },
    /**地址详情 */
    async getAddressInfo({commit},params) {
      const {data} = await requestByGet("city/api/business/address_info",params);
      return data;
    },
    /**删除地址 */
    async postDelAddress({commit},params) {
      const data = await requestByPost("city/api/business/del_address",params);
      return data;
    },
    /** 商家订单列表 */
    async getShopOrderList({commit}, params) {
      const {data} = await requestByPost("city/api/shop_order/order_list", params);
      return data || [];
    },
    /** 商家订单详情 */
    async getShopOrderDetails({commit}, params) {
      const {data} = await requestByGet("city/api/shop/order_info", params);
      return data || {};
    },
    /** 取消订单/拒绝退款*/
    async postCancelOrder({commit}, params) {
      const data = await requestByPost("city/api/shop/cancel_order", params);
      return data;
    },
    /**发货 */
    async postShopDelivery({commit},params) {
      const data = await requestByPost("city/api/shop_order/delivery",params);
      return data;
    },
    /**退款 */
    async postShopRefund({commit},params) {
      const data = await requestByPost("city/api/shop_order/refund",params);
      return data;
    },
  },
}
