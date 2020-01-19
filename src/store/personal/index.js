import {requestByGet, requestByPost} from "../../util/request";
import {generateMutation, getGlobalData, setGlobalData} from "../../util";
import homePage from './home-page'
import rechargeCenter from './recharge-center'
import balance from './balance'
import integral from './integral'
import task from './task'
import {getSuccessData} from "../../util/dd-util";

export default {
  namespaced: true,
  state: {
    powerList: [],
  },
  mutations: {
    SET_POWERLIST(state, data) {
      state.powerList = data;
    },
  },
  actions: {
    /**
     * 获取个人收藏
     */
    async getCollection({commit}, type) {
      const {data} = await requestByGet("city/api/user/my_collection", {
        ...type,
      });
      return data;
    },
    /**通过ID获取个人信息 */
    async getUserInfoById({commit, rootState}, id) {
      const {data, code} = await requestByGet("city/api/user/info", {
        id
      });
      //  如果id有的话，就判断一下是不是当前用户的Id，
      //  如果没有Id说明就是自己，因为后台是可以通过sessionKey进行获取的，默认是自己的id
      if (code && ((id && +id == rootState.user.id) || !id)) {
        data.isVip = data.isVip == 1;
        commit("SET_USER", {
          ...rootState.user,
          ...data
        }, {root: true});
        setGlobalData({
          user: {
            ...getGlobalData("user"),
            ...data
          }
        });
      }
      return data;
    },
    /**我的服务权限 */
    async getPowerList({commit}, params) {
      const {data} = await requestByGet("city/api/user/power_list",params);
      commit("SET_POWERLIST", getSuccessData(data, []));
      return getSuccessData(data, []);
    },
    /**保存个人设置 */
    async saveUserInfo({commit}, params) {
      const data = await requestByPost("city/api/user/edit_user", {
        ...params
      })
      return data
    },
    /**获取用户地址*/
    async getUserAddressByGet({commit}) {
      const {data} = await requestByPost("city/api/user/my_address");
      return data;
    },
    /**删除用户地址 */
    async deleteAddressById({commit}, params) {
      const {data} = await requestByPost("city/api/user/del_address", params);
      return data;
    },
    /**获取用户地址详情 */
    async getUserAddressDetail({commit}, params) {
      const {data} = await requestByGet("city/api/user/address_info", params);
      return data;
    },
    /** 保存地址*/
    async saveAddressInfo({commit}, parmas) {
      const data = await requestByPost("city/api/user/save_address", parmas);
      return data;
    },
    /* 获取我的数量*/
    async getMyNun({commit}) {
      const {data} = await requestByPost("city/api/user/my_statistics");
      return data;
    },
    /** 设置默认地址 */
    async setDefaultAddress({commit}, params) {
      const data = await requestByPost("city/api/user/set_default", params);
      return data;
    }

  },
  modules: {homePage, rechargeCenter, balance, integral, task}
}


