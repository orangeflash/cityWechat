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
    /* 合伙人保存 */
    async submitPartnerForm({commit, rootState}, params) {
      const {data} = await requestByPost("city/api/partner/save_partner", {
        ...params
      });
      return data;
    },
    /**邀请码查找信息 */
    async getFindsuperior({commit}, params) {
      const data = await requestByGet("city/api/partner/find_superior", params);
      return data;
    },
    /* 我的上线 */
    async getpartnerMyBoss({commit}, params) {
      const {data} = await requestByPost("city/api/partner/my_boss", {
        ...params
      });
      return data;
    },
    /* 二维码*/
    async getpartnerCode({commit}, params) {
      const {data} = await requestByPost("city/api/partner/code", {
        ...params
      });
      return data;
    },
    /* 绑定上下级 */
    async getpartnerBindDistribution({commit}, params) {
      const {data} = await requestByPost("city/api/partner/bind_distribution", {
        ...params
      });
      return data;
    },
    /* 合伙人个人中心 */
    async getpartnerStatistics({commit}, params) {
      const {data} = await requestByPost("city/api/partner/partner_statistics", {
        ...params
      });
      return data;
    },
    // 合伙人升级
    async postpartnerUpgrade({commit}, params) {
      const data = await requestByPost("city/api/partner/upgrade", params);
      return data;
    },
    /* 我的粉丝 */
    async getpartnerTeam({commit}, params) {
      const {data} = await requestByGet("city/api/partner/team", {
        ...params
      });
      return data;
    },
    /**  */
    async getUnregistered({commit}, params) {
      const {data} = await requestByGet("city/api/partner/unregistered", params);
      return getSuccessData(data, [])
    },
    /* 佣金列表 */
    async getpartnerCommission({commit}, params) {
      const {data} = await requestByGet("city/api/partner/commission", {
        ...params
      });
      return data;
    },
    /* 最新收益 */
    async getpartnerNewlist({commit}, params) {
      const {data} = await requestByPost("city/api/partner/new_list", {
        ...params
      });
      return data;
    },
    // 合伙人提现
    async postpartnerCash({commit}, params) {
      const data = await requestByPost("city/api/partner/apply_cash", params);
      return data;
    },
    /* 提现明细 */
    async getpartnerCashlist({commit}, params) {
      const {data} = await requestByGet("city/api/partner/cash_list", {
        ...params
      });
      return data;
    },
    /* 明细详情 */
    async getpartnerInfoById({commit}, params) {
      const data = await requestByGet("city/api/partner/cash_info", params);
      return data;
    }
  },
}
