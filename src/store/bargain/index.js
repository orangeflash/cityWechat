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
    async getMyReleaseBargain({commit},params){
      const {data} = await requestByGet("city/api/bargain/my_bargain",params);
      return getSuccessData(data,[])
    },
    /** 砍价商品列表 */
    async getBargainList({commit},params){
      const {data} = await requestByGet("city/api/bargain/bargain_list",params);
      return getSuccessData(data,[])
    },
    /** 商品详情 */
    async getBargainInfo({commit},params){
      const {data} = await requestByGet("city/api/bargain/bargain_info",params);
      return getSuccessData(data,{})
    }
  }
}
