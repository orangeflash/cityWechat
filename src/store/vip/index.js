import {requestByGet, requestByPost} from "../../util/request";
import {getGlobalData, setGlobalData} from "../../util";

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
    /**套餐*/
    async getSetMeal({commit}, params) {
      const {data} = await requestByGet("city/api/vip/setmeal", params);
      return data;
    },
    /**购买/续费会员*/
    async postAddVip({commit,rootState}, params) {
      const result = await requestByPost("city/api/vip/add_vip", {
        ...params
      });
      return result;
    },
    /**激活会员*/
    async postActivation({commit,rootState}, params) {
      const result = await requestByPost("city/api/vip/activation", {
        ...params
      });
      return result;
    },
    /**开卡礼包*/
    async getPackageList({commit}, params) {
      const {data} = await requestByGet("city/api/vip/package_list", params);
      return data;
    },
    /**礼包详情*/
    async getPackageInfo({commit}, params) {
      const data = await requestByGet("city/api/vip/package_info", params);
      return data;
    },
    /**领取礼包*/
    async receivePackage({commit}, params) {
      const data = await requestByPost("city/api/vip/receive_package", params);
      return data;
    },
    /**核销礼包*/
    async writeOffPackage({commit}, params) {
      const data = await requestByPost("city/api/vip/write_off", params);
      return data;
    },
    /**会员卡设置*/
    async getVipConfig({commit}, params) {
      const {data} = await requestByGet("city/api/config/vip", params);
      return data;
    },
    /**开通列表*/
    async getOpenList({commit}, params) {
      const {data} = await requestByGet("city/api/vip/open_list", params);
      return data;
    },
    /**我的开卡礼包*/
    async getMyPackage({commit}, params) {
      const {data} = await requestByGet("city/api/vip/my_package", params);
      return data;
    },
    /**礼包领取列表*/
    async getPackageReceive({commit}, params) {
      const {data} = await requestByGet("city/api/vip/package_receive", params);
      return data;
    },
    /**特权日期列表*/
    async getPrivilegeDay({commit}, params) {
      const {data} = await requestByGet("city/api/vip/privilege_day", params);
      return data;
    },
    /**特权列表*/
    async getPrivilegeList({commit}, params) {
      const {data} = await requestByGet("city/api/vip/privilege_list", params);
      return data;
    },
    /**特权领取列表*/
    async getPrivilegeReceive({commit}, params) {
      const {data} = await requestByGet("city/api/vip/privilege_receive", params);
      return data;
    },
    /**特权详情*/
    async getPrivilegeInfo({commit}, params) {
      const data = await requestByGet("city/api/vip/privilege_info", params);
      return data;
    },
    /**领取特权*/
    async receivePrivilege({commit}, params) {
      const data = await requestByPost("city/api/vip/receive_privilege", params);
      return data;
    },
    /**核销特权*/
    async writeOffPrivilege({commit}, params) {
      const data = await requestByPost("city/api/vip/use_privilege", params);
      return data;
    },
    /**我领取的特权*/
    async myReceivePrivilege({commit}, params) {
      const {data} = await requestByGet("city/api/vip/my_receive_privilege", params);
      return data;
    },
  },
}
