import { requestByGet, requestByPost } from "../../util/request";

export default {
  namespaced: true,
  state: {
    shopDetail: {},
  },
  mutations: {
    SET_LOCATION_OPTION(state, data) {
      state.locationOption = data;
    }, SET_CATEGORY_OPTION(state, data) {
      state.categoryOption = data;
    },
  },
  getters: {
    formatCategoryOption(state) {
      return [{ id: "", text: "全部", children: [] }, ...state.categoryOption.map(({ id, name, son }) => ({
        id,
        text: name,
        children: [{ id:'', text: "全部" }, ...son && son.map(({ id, name }) => ({ id, text: name }))]
      }))]
    },
    formatLocationOption(state) {
      return [{ id: "", text: "全部" }, ...state.locationOption.map(({ id, name }) => ({
        id,
        text: name,
      }))]
    },
  },
  actions: {
    // 获取黄页详情
    async getYellowInfo({ commit }, params) {
      const { data } = await requestByGet("city/api/yellow_page/info", params);
      return data;
    },
    async getCategoryOption({ commit }, params) {
      const { data } = await requestByGet("city/api/post/category", params);
      commit("SET_CATEGORY_OPTION", data);
    },
    // 获取黄页的列表
    async getYellowList({ commit }, params) {
      const { data } = await requestByGet("city/api/yellow_page/list", params);
      return data;
    },
    // 我发布的黄页
    async getMineYellowPage({ commit, rootState }, params) {
      const { data, code } = await requestByGet("city/api/yellow_page/my_list", params);
      return data;
    },
    // 黄页拨打记录
    async getYellowPageHistory({ commit, rootState }, params) {
      const { data, code } = await requestByGet("city/api/yellow_page/call", params);
      return data;
    },
    /* 查看电话支付 */
    async payCallAction({ commit, rootState }, params) {
      const { data } = await requestByPost("city/api/common/look_pay", params);
      return data;
    },
    // 收藏黄页
    async collectStore({ commit }, params) {
      const { data } = await requestByPost("city/api/post/collection_post", params);
      return data;
    },
    // 上下架黄页
    async upperLowerYellowPage({ commit }, params) {
      const { data } = await requestByPost("city/api/yellow_page/show", params);
      return data;
    },
    // 黄页续费套餐
    async renewYellowPage({ commit }, params) {
      const { data } = await requestByPost("city/api/yellow_page/setmeal", params);
      return data;
    },
    // 黄页提交续费定点杆
    async placeYellowPage({ commit }, params) {
      const { data } = await requestByPost("city/api/yellow_page/store_renew", params);
      return data;
    },
    // 黄页续费支付
    async renewPayYellowPage({ commit }, params) {
      const { data } = await requestByPost("city/api/common/renew_pay", params);
      return data;
    },
    // 删除黄页
    async removeYellowPage({ commit }, params) {
      const { data } = await requestByPost("city/api/yellow_page/delete", params);
      return data;
    },
    // 黄页轮播图
    async getBannerList({commit}, params) {
      const {data} = await requestByGet("city/api/information/ad_list", params);
      return data;
    },
    // 黄页统计
    async staticYellowPage({ commit }, params) {
      const { data } = await requestByGet("city/api/yellow_page/statistics", params);
      return data;
    },
    // 获取已开通区域
    async getLocationOption({ commit }, params) {
      const { zone } = await requestByGet("city/api/user/get_zone", params);
      commit("SET_LOCATION_OPTION", zone);
    },
    // 获取黄页公告
    async getannounce({ commit }, params) {
      const { data } = await requestByGet("city/api/yellow_page/announce", params);
      return data
    },
    // 认领/纠错/举报
    async presentation({ commit }, params) {
      const { data } = await requestByPost("city/api/yellow_page/presentation", params);
      return data
    },
    // 转发
    async share({ commit }, params) {
      const { data } = await requestByPost("city/api/yellow_page/share", params);
      return data
    },
  },
}
