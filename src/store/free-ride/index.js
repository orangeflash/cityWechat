import { requestByGet, requestByPost } from "../../util/request";

export default {
  namespaced: true,
  state: {
    locationOption: [],
    categoryOption: [],
  },
  mutations: {
  },
  actions: {

    /** 顺风车分类 */
    async getCarCategory({commit},params){
      const res = await requestByPost('city/api/car/category',params);
      return res;
    },
    /** 分类下的标签 */
    async getCarCategoryLabel({commit},params){
      const res = await requestByGet('city/api/car/category_label',params);
      return res;
    },
    /** 时间段 */
    async getCarTimeSet({commit},params){
      const res = await requestByPost('city/api/car/time_set',params);
      return res;
    },
    /** 顺风车列表 */
    async getCarList({commit},params){
      const res = await requestByGet('city/api/car/car_list',params);
      return res;
    },
    /** 顺风车详情 */
    async getCarInfo({commit},params){
      const res = await requestByGet('city/api/car/car_info',params);
      return res;
    },
    /** 置顶信息 */
    async getCarTop({commit},params){
      const res = await requestByGet('city/api/car/top',params);
      return res;
    },
    /** 置顶信息生成订单 */
    async FreeRideTopOrder({commit},params){
      const data = await requestByPost("city/api/car/car_top",params);
      return data;
    },

    /** 顺风车配置 */
    async getFreeRideConfig({commit},params) {
      const {data} = await requestByPost("city/api/config/car", params);
      return data;
    },
    /** 发布顺风车 */
    async releaseFreeRide({commit},params) {
      const res = await requestByPost("city/api/car/save_car", params);
      return res;
    },
    /** 分类详情的支付价格 */
    async getCategoryInfo({commit},params) {
      const res = await requestByGet("city/api/car/categoryInfo", params);
      return res;
    },
    /** 分享记录 */
    async recordShare({commit},params){
      const res = await  requestByPost("city/api/car/share",params);
      return res;
    },
    /** 获取顺风车的统计 */
    async getFreeRideCount({commit},params){
      const res = await requestByGet("city/api/car/statistics",params);
      return res;
    },
    /** 我发布顺风车 */
    async getMyReleaseFreeRide({commit},params){
      const res = await requestByGet("city/api/car/my_list",params);
      return res;
    },
    /** 删除的我发布的顺风车 */
    async deleteMyFreeRide({commit},params){
      const  res = await requestByPost("city/api/car/del",params);
      return res;
    },
    /** 我的顺风车上下架*/
    async displayMyFreeRide({commit},params){
      const res = await requestByPost("city/api/car/display",params);
      return res;
    }
  },
}
