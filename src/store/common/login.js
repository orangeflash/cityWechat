import {requestByGet, requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async sendVerificationCodeAction({commit}, params) {
      const res = await requestByGet("city/api/user/send_msg", params);
      return res;
    },

    async getH5VerificationCode({commit}, params) {
      const res = await requestByGet("city/api/user/web_send_msg", params);
      return res
    }
  },
}
