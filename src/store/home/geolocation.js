import {requestByGet} from "../../util/request";

export default {
  namespaced: true,
  state: {
    city: [],
  },
  mutations: {
    SET_CITY(state, data) {
      state.city = data;
    },
  },
  actions: {
    async getGeolocationAddress({commit}) {
      const {data} = await requestByGet("city/api/post/open");
      commit("SET_CITY", data);
    }
  },
}
