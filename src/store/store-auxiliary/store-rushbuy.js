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
    /**保存抢购商品 */
    async postRushSaveGoods({commit}, params) {
      const data = await requestByPost("city/api/rush/save_goods", {
        ...params
      });
      return data;
    },
    /** 服务范围 */
    async getRushLabel({commit}, params) {
      const {data} = await requestByGet("city/api/rush/goods_label", params)
      return getSuccessData(data, [])
    },
    /**我发布的商品 */
    async getRushMyList({commit}, params) {
      const {data} = await requestByGet("city/api/rush/my_list", {
        ...params
      });
      return data;
    },
    /** 获取分类 */
    async getRushGoodsCategory({commit}, params) {
      const {data} = await requestByGet("city/api/category/category", params);

      return getSuccessData(data, [])
    },
    /** 抢购领取列表 */
    async getRushRushInfo({commit}, params) {
      const {data} = await requestByGet("city/api/rush/rush_info", params);
      return data;
    },
    /**删除抢购商品 */
    async postDelGoods({commit},params) {
      const data = await requestByPost("city/api/rush/delGoods",params);
      return data;
    },
    /**发货 */
    async postRushDeliver({commit},params) {
      const data = await requestByPost("city/api/rush/delivery",params);
      return data;
    },
  },
}
