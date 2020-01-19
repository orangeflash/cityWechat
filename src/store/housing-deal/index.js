import {requestByGet, requestByPost} from "../../util/request";
import {getSuccessData} from "../../util/dd-util";


export default {
  namespaced: true,
  state: {
    locationOption: [],
    categoryOption: [],
  },
  mutations: {},
  actions: {

    /** 租房设置 */
    async housingDealConfig({commit}, params) {
      const {data} = await requestByPost("city/api/config/renting", params);
      return data;
    },
    /** 分类详情 */
    async housingDealClssInfo({commit}, params) {
      const result = await requestByGet("city/api/renting/category_info", params);
      return result;
    },
    /** 租房设置 */
    async housingDealRentConfig({commit}, params) {
      const {data} = await requestByPost("city/api/config/renting", params);
      return data
    },
    /** 置顶信息 */
    async housingDealTopInfo({commit}, params) {
      const result = await requestByGet("city/api/renting/top", params);
      return result;
    },
    /** 租房置顶 */
    async housingDealTop({commit}, params) {
      const result = await requestByPost("city/api/renting/renting_top", params);
      return result;
    },
    /** 租房分类 */
    async housingDealRentCategory({commit}, params) {
      const {data} = await requestByGet("city/api/renting/category", params);
      return data
    },
    /** 租房统计 */
    async housingDealRentCount({commit}, params) {
      const {data} = await requestByGet("city/api/renting/statistics", params);
      return data
    },
    /** 发布租房 */
    async housingDealRelease({commit}, params) {
      const {data} = await requestByPost("city/api/renting/save_renting", params);
      return data
    },
    /** 租房列表 */
    async housingDealList({commit}, params) {
      const {data} = await requestByGet("city/api/renting/renting_list", params);
      return data
    },
    /** 我的发布 */
    async housingDealMyRelease({commit}, params) {
      const {data} = await requestByGet("city/api/renting/my_list", params);
      return data;
    },
    /** 帖子详情 */
    async housingDealInfo({commit}, params) {
      const {data} = await requestByGet("city/api/renting/renting_info", params);
      return data;
    },
    /** 帖子上下架 */
    async housingDealUpOrDown({commit}, params) {
      const res = await requestByPost("city/api/renting/display", params);
      return res;
    },
    async housingDealDel({commit}, params) {
      const res = await requestByPost("city/api/renting/del", params);
      return res;
    },
    /** 帖子分享 */
    async housingDealShare({commit}, params) {
      const res = await requestByPost("city/api/renting/share", params);
      return res;
    },
    /** 最新发布 */
    async housingDealNew({commit}, params) {
      const {data} = await requestByGet("city/api/renting/new", params);
      return data || [];
    },
    /** 发布房屋出售 */
    async housingDealSale({commit}, params) {
      const res = await requestByPost("city/api/sell/save_sell", params);
      return getSuccessData(res, {})
    },
    /** 热门楼盘 */
    async housingDealGetHot({commit}, params) {
      const {data} = await requestByGet("city/api/renting/hot", params);
      return getSuccessData(data, [])
    }
  }

}
