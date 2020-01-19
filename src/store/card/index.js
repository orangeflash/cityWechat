import {requestByGet, requestByPost} from "../../util/request";
import {getSuccessData} from "../../util";

export default {
  namespaced: true,
  state: {
    cardConfig: {},
    categoryOption: [],
  },
  mutations: {
    SET_CARD_CONFIG(state, data) {
      state.cardConfig = data;
    },
    SET_CATEGORY_OPTION(state, data) {
      state.categoryOption = data;
    },

  },
  getters: {
    formatCategoryOption(state) {
      return [{id: "", text: "全部", children: []}, ...state.categoryOption.map(({id, name, son}) => ({
        id,
        text: name,
        children: [{pid: id, text: "全部", id: ''}, ...son && son.map(({id, name, pid}) => ({id, text: name, pid}))]
      }))]
    },
  },
  actions: {
    // 名片设置
    async getCardConfig({commit}, params) {
      const {data} = await requestByGet("city/api/config/super_card", params);
      commit("SET_CARD_CONFIG", data);
      return data;
    },
    // 行业列表
    async getCategoryList({commit}, params) {
      const {data} = await requestByGet("city/api/category/full", params);
      commit("SET_CATEGORY_OPTION", data);
      return data;
    },

    // 套餐
    async getCardMeal({commit}, params) {
      const {data} = await requestByGet("city/api/super_card/setmeal", params);
      return data;
    },
    // 发布名片
    async postSaveCard({commit}, params) {
      const data = await requestByPost("city/api/super_card/save_card ", {
        ...params
      });
      return data;
    },
    // 我的名片
    async getMyList({commit}, params) {
      const data = await requestByGet("city/api/super_card/my_list", {
        ...params
      });
      return data;
    },
    // 名片列表
    async getCardList({commit}, params) {
      const data = await requestByGet("city/api/super_card/card_list", {
        ...params
      });
      return data;
    },
    // 名片详情
    async getCardInfo({commit}, params) {
      const {data} = await requestByGet("city/api/super_card/card_info", {
        ...params
      });
      return data;
    },
    // 点赞名片
    async loveCard({commit}, params) {
      const {code, data} = await requestByGet("city/api/post/praise", params);
      return code;
    },
    // 收藏名片
    async followCard({commit}, params) {
      const {code, data} = await requestByPost("city/api/post/collection_post", params);
      return code;
    },
    //
    async deleteCard({commit}, params) {
      const res = await requestByPost("city/api/super_card/del", params);
      return res;
    },
    /** 下单 */
    async downOrder({commit}, params) {
      const {data} = await requestByPost("city/api/super_card/card_top", params);
      return getSuccessData(+data, 0);
    },
    /** 获取置顶套餐 */
    async getTopList({commit}, params) {
      const {data} = await requestByGet("city/api/super_card/top", params);
      return getSuccessData(data, []);
    },
    /** 分享记录 */
    async orderShareNum({commit}, params) {
      const res = await requestByPost("city/api/super_card/share", params);
      return getSuccessData(res, {})
    },
    /** 续费套餐下单 */
    async downOrderRenew({commit}, params) {
      const {data} = await requestByPost("city/api/super_card/store_renew", params);
      return getSuccessData(+data, 0);
    },
    async cardStatistics() {
      const {data} = await requestByGet("city/api/super_card/statistics")
      return getSuccessData(data, {})
    }
  },
  modules: {}
}
