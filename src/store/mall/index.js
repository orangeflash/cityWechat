import {requestByGet, requestByPost} from "../../util/request";
import {getSuccessData} from "../../util";

export default {
  namespaced: true,
  state: {
    tabs: [],
    config: {},
    shoppingCart: [],    //购物车清单
    orderList: [],       //订单列表
  },
  mutations: {
    SET_TABS(state, params = []) {
      state.tabs = params;
    },
    SET_CONFIG(state, params = {}) {
      state.config = params;
    },
    SET_ORDELIST(state, params = []) {
      state.orderList = params
    },
    SET_SHOPPING_CART(state, params) {

      let bool = false;
      state.shoppingCart.forEach((item, index) => {
        if (item.id == params.id) {
          state.shoppingCart[index] = params;
          bool = true;
          return
        }
      });
      !bool && state.shoppingCart.push(params);
    }
  },
  actions: {
    /** 分类详细数据 */
    async getMallCategoryDetails({commit}, params) {
      return [];
    },
    /** 商城配置 */
    async getMallConfig({commit}, params) {
      const {data} = await requestByPost("city/api/config/shop", params);
      commit('SET_CONFIG', data);
      return data || {};
    },
    /** 分类导航 */
    async getMallClassNav({commit}, params) {
      const {data} = await requestByGet("city/api/shop/nav", params)
      return data || [];
    },
    /** 商家列表 */
    async getMallBusinessList({commit}, params) {
      const {data} = await requestByGet("city/api/shop/store_list", params);
      return data || [];
    },
    /** 获取一级分类 */
    async getMallFristCategory({commit}, params) {
      const {data} = await requestByGet("city/api/shop/category", params);
      return data || [];
    },
    /** 商品列表 */
    async getMallGoodsList({commit}, params) {
      const {data} = await requestByGet("city/api/shop/goods_list", params);
      return data || [];
    },
    /** 商城分类 */
    async getMallCategory({commit}, params) {
      const {data} = await requestByGet("city/api/shop/full_category", params);
      commit('SET_TABS', data);
      return data || [];
    },
    /** 商品详情 */
    async getMallGoodsInfo({commit}, params) {
      const {data} = await requestByGet("city/api/shop/goods_info", params);
      return data;
    },
    /** 商家商品列表 */
    async getMallBusinessGoodsList({commit}, params) {
      const {data} = await requestByGet("city/api/shop/store_goods_list", params);
      return data || [];
    },
    /** 购物车清单 */
    async mallShoppingCartOperation({commit}, params) {
      commit('SET_SHOPPING_CART', params);
    },
    /** 下单 */
    async mallDownOrder({commit}, params) {
      const res = await requestByPost("city/api/shop/save_order", params);
      return res || {}
    },
    /** 保存评论 */
    async mallSaveComment({commit}, params) {
      const res = await requestByPost("city/api/shop/save_comment", params);
      return res
    },
    /** 获取规格组合 */
    async getMallSpceGroup({comment}, params) {
      const {data} = await requestByPost("city/api/shop/group", params);
      return data || [];
    },
    /** 订单列表 */
    async getMallOrderList({commit}, params) {
      const {data} = await requestByGet("city/api/shop/order_list", params);
      return data || [];
    },
    /** 订单详情 */
    async getMallOrderDetails({commit}, params) {
      const {data} = await requestByGet("city/api/shop/order_info", params);
      return data || {};
    },
    /** 单个商品立即购买的数据存储 */
    async setOrderList({commit}, params) {
      commit('SET_ORDELIST', params);
      return params;
    },
    /** 取消订单 | 确认收货 | 申请退款 */
    async mallCancelOrder({commit}, params) {
      const res = await requestByPost("city/api/shop/cancel_order", params);
      return res;
    },
    /** 删除订单 */
    async mallDelOrder({commit}, params) {
      const res = await requestByPost("city/api/shop/del_order", params);
      return res;
    },
    /** 退款 */
    async mallRefund({commit}, params) {
      const res = await requestByPost("city/api/shop/refund", params);
      return res || {}
    },
    /** 添加购物车 */
    async mallSaveCar({commit}, params) {
      const res = await requestByPost("city/api/shop/save_car", params);
      return res || {}
    },
    /** 我的购物车 */
    async mallMyShoppingCar({commit}, params) {
      const {data} = await requestByPost("city/api/shop/car_list", params);
      return data || []
    },
    /** 删除购物车 */
    async mallDelShoppingCar({commit}, params) {
      const res = await requestByPost("city/api/shop/del_car", params);
      return res;
    },
    /** 清空购物车 */
    async mallClearShoppingCar({commit}, params) {
      const res = await requestByPost("city/api/shop/clear_car", params);
      return res;
    },
    /** 购物下单的时候存储本地的值 */
    async saveOrder({commit}, params) {
      commit();
    },
    /**获取商品的服务范围*/
    async mallGetGoodsService({commit}, params) {
      const {data} = await requestByGet("city/api/shop/goods_service", params);
      return data || {};
    },
    /** 领取优惠劵 */
    async mallGetStoreCoupon({commit}, params) {
      const res = await requestByPost("city/api/shop/receive_coupon", params);
      return res;
    },
    /** 我的优惠劵 */
    async mallGetMyCoupons({commit}, params) {
      const {data} = await requestByGet("city/api/shop/my_coupon", params);
      return data || []
    },
    /** 订单核销 */
    async mallOrderWriteOff({commit}, params) {
      const res = await requestByPost("city/api/shop/validate_order", params);
      return res
    },
    async mallGetGoodsComments({commit}, params) {
      const res = await requestByGet("city/api/shop/more_comment", params);
      return getSuccessData(res.data, [])
    }
  }
  ,
}
