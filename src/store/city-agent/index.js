import {requestByGet,requestByPost} from '@/util/request';
import {getSuccessData} from '@/util'
export default {
  namespaced: true,
  state: {
    cityInfo:{}
  },
  mutations: {
    GET_CITY_INFO(state,data) {
        state.cityInfo = data
    },
    SET_AGENT_INFO(state, data) {
      state.agentInfo = data;
    },
  },
  actions: {
    /**
     * @param 获取城市列表接口
     */
    async getCityList({commit},params){
        const {data} = await  requestByPost("city/api/user/bind_city",params)
        return data
    },
    /**
     * @param 城市后台首页
     */
    async getCityIndex({commit},params){
      const {data} = await  requestByPost("city/api/city_agent/index",params)
      return data
    },
    /**
     * @param 获取城市分红比例
     */
    async getCityBonus({commit},params){
      const {data} = await  requestByPost("/city/api/city_agent/get_bonus",params)
      return data
    },
    /**
     * @param 获取单个区域佣金明细
     */
    async getSingleZoneList({commit},params){
      const {data} = await  requestByPost("/city/api/city_agent/single_zone_list",params)
      return data
    },
    /**
     * @param 获取设置内容
     */
    async getCitySet({commit},params){
      const {data} = await  requestByPost("/city/api/city_agent/set",params)
      commit("GET_CITY_INFO",data)
      return data
    },
    /**
     * @param 获取区域代理列表
     */
    async getZoneList({commit},params){
      const {data} = await  requestByPost("/city/api/city_agent/zone_list",params)
      return data
    },

    /**
     * @param 获取区域分红比列
     */
    async getZoneBonus({commit},params){
      const {data} = await  requestByPost("/city/api/city_agent/get_zone_bonus",params)
      return data
    },
    /**
     * @param 获取区域提现列表
     */
    async getWithdrawal({commit},params){
      const {data} = await  requestByPost("/city/api/city_agent/withdrawal",params)
      return data
    },
    /**
     * @param 获取城市收益明细
     */
    async getincomeList({commit},params){
      const {data} = await  requestByPost("/city/api/city_agent/income_list",params)
      // return getSuccessData(data,{})
      return data
    },
  },

};
