import {requestByGet, requestByPost} from "../../util/request";
import {getSuccessData} from "../../util/dd-util";

export default {
  namespaced: true,
  state: {
    isCanCall: false,
  },
  mutations: {
    IS_CAN_CALL(state, data) {
      state.isCanCall = data;
    }
  },
  actions: {
    /** 帖子积分支付 */
    async integralPayPostRelease({commit}, params) {
      const res = await requestByPost('city/api/Integral_pay/post', params);
      return getSuccessData(res, {});
    }
  }
}
