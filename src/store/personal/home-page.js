import {requestByGet} from "../../util/request";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getUserById({commit}, userId) {
      const {data} = await requestByGet("city/api/own/info", {
        ownId: userId,
        id: userId
      });
      return data;
    }, async getMyPostList({commit}, params) {
      const {code, data} = await requestByGet("city/api/user/post", params);
      return data;
    }, async getMyStoreList({commit}, params) {
      const {code, data} = await requestByGet("city/api/drag/store", params);
      return data;
    }, async getMyVisitorList({commit}, params) {
      const {code, data} = await requestByGet("city/api/own/visitor_list", params);
      return data;
    }
  },
}
