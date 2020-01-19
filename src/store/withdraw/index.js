import {requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {

  },
  mutations: {

  },
  actions: {
    // 获取提现配置
    async getReflectConfig(){
      const {data} = await requestByPost("city/api/Config/pay");
      return data;
    },
    // 个人提现
    async reflectMoney({commit}, params){
      const data = await requestByPost("city/api/bill/apply_cash",params);
      return data;
    }
  }
}
