import {requestByGet,requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {

  },
  mutations: {},
  actions:{
    /** 获取认证设置 */
    async getAttestByPost(){
        const {data} = await requestByPost("city/api/ident/attestation");
        return data;
    },
    /** 获取认证  ---- 这个接口作废 */
    // async getAttestTypeByPost(){
    //   const {data}  = await requestByPost("city/api/ident/is_attestation");
    //   return data;
    // },
    /** 保存认证  */
    async postAttestByPost ({commit},params){
      const data = await requestByPost("city/api/ident/add",params)
      return data;
    },
    /** 查看是否认证*/
    async getAttestStatus({commit},params){
      const {data} = await  requestByGet("city/api/user/my_auth",params);
      return data;
    },
    /** 保证金下单*/
    async downOrder({commit},params){
      const {data} = await requestByPost("city/api/bill/save_bond",params);
      return data;
    },
    /** 查看用户 / 商家保证金信息 */
    async lookBondInfo({commit},params){
      const {data} = await requestByGet("city/api/user/my_ensure",params);
      return data;
    },
    /** 退换保证金 */
    async refundrBond({commit},params){
      const res = await requestByPost("city/api/bill/refund_bond",params)
      return res
    }
  },
}
