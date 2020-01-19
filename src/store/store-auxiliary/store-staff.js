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
    /** 管理列表 */
    async getMyStaffList({commit}, params) {
      const {data} = await requestByGet("city/api/clerk/index", params);
      return getSuccessData(data, [])
    },
    /** 添加员工 */
    async addStaff({commit}, params) {
      const res = await requestByPost("city/api/clerk/save", params);
      return getSuccessData(res, {})
    },
    /** 删除员工 */
    async delStaff({commit}, params) {
      const res = await requestByPost("city/api/clerk/delete", params);
      return getSuccessData(res, {})
    },
    /** 启用禁用 */
    async staffSwitch({commit}, params) {
      const res = await requestByPost("city/api/clerk/change", params);
      return getSuccessData(res, {})
    },
    /** 核销权限 */
    async writerOffPower({commit}, params) {
      const {data} = await requestByGet("city/api/clerk/power", params);
      return getSuccessData(data, {})
    },
    /** 查看编辑信息 */
    async getStaffInfo({commit}, params) {
      const {data} = await requestByGet("city/api/clerk/save", params);
      return getSuccessData(data, {})
    }
  }
}
