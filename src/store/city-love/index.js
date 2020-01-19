import {requestByGet, requestByPost} from "../../util/request";
import {getSuccessData} from "../../util";

export default {
  namespaced: true,
  state: {
    registerInfo: { //用户注册信息
      id: '',
      name: '',
      birthday: '',
      city: '',
      sex: 1,
      height: 160, //身高
      weight: 50,//体重
      icon: '',   //头像
      tel: '',
      education: '', //学历
      occupation: '', //职业分类id
      emotion: '', //情感状态
      label: [],
      media: [], //相册
      introduce: '',//自我介绍
      face: ''
    },
    friendConfig: {}
  },
  mutations: {
    UPDATE_REGISTER_INFO(state, params) {
      state.registerInfo = params;
    },
    UPDATE_FRIEND_CONFIG(state, params) {
      state.friendConfig = params
    }
  },
  actions: {
    async cityLoveRegister({commit}, params) {
      const {code, data, msg} = await requestByPost("city/api/friend/save_user", params);

      if (data.id) {
        commit("UPDATE_REGISTER_INFO", {
          ...data,
          face: '',
          myCollection: data.myCollection || 0,
          myFans: data.myFans || 0
        })
      }
      return {
        code,
        data,
        msg
      }
    },
    /** 交友列表 */
    async cityLoveFriends({commit}, params) {
      const {data} = await requestByGet("city/api/friend/friend_list", params);
      return getSuccessData(data, [])
    },
    /** 我的关注/我的粉丝 */
    async cityLoveGetFollowInfo({commit}, params) {
      const {data} = await requestByGet("city/api/friend/fans", params);
      return getSuccessData(data, [])
    },

    async cityLoveCategory({commit}, params) {
      const {data} = await requestByGet("city/api/friend/category", params);
      return getSuccessData(data, [])
    },
    /**足迹*/
    async cityLoveFotprint({commit}, params) {
      const {data} = await requestByGet("city/api/friend/footprint", params);
      return getSuccessData(data, [])
    },
    /** 获取详情 */
    async cityLoveGetInfo({commit}, params) {
      const {data} = await requestByGet("city/api/friend/friend_info", params);

      return getSuccessData(data, {})
    },
    /** 动态列表 */
    async cityLoveGetDynamicList({commit}, params) {
      const {data} = await requestByGet("city/api/friend/dynamic_list", params);
      return getSuccessData(data, [])
    },
    /** 动态详情 */
    async cityLoverGetDynamicDetails({commit}, params) {
      const {data} = await requestByGet("city/api/friend/dynamic_info", params);
      return getSuccessData(data, {})
    },
    /** 我发布的动态 */
    async cityLoveGetMyreleaseDynamic({commit}, params) {
      const {data} = await requestByGet("city/api/friend/my_dynamic", params);
      return getSuccessData(data, [])
    },
    /**发布动态*/
    async cityLoveReleaseDynamic({commit}, params) {
      const {data} = await requestByPost("city/api/friend/save_dynamic", params);
      return getSuccessData(+data, 0)
    },
    /** 动态状态改变 */
    async cityLoveDynamicChangeStatus({commit}, params) {
      const res = await requestByPost("city/api/friend/change", params);
      return getSuccessData(res, {})
    },

    /** 分享动态 */
    async cityLoveShareDynamic({commit}, params) {
      const {data} = await requestByPost("city/api/friend/share", params);
      return getSuccessData(data, {})
    },
    /** 点赞动态 */
    async cityLoveDynamicLove({commit}, params) {
      const {data} = await requestByGet("city/api/post/praise", params);
      return getSuccessData(data, {})
    },
    /** 交友配置 */
    async cityLoveConfig({commit}, params) {
      const {data} = await requestByGet("city/api/config/friend", params);

      commit("UPDATE_FRIEND_CONFIG", getSuccessData(data, {}))

      return getSuccessData(data, {})
    },
    /** 电话记录 */
    async cityLoveTelOrder({commit}, params) {
      const {data} = await requestByGet("city/api/friend/contact", params);
      return getSuccessData(data, [])
    },
    /** 删除动态 */
    async cityLoveDeleteDynamic({commit}, params) {
      const res = await requestByPost("city/api/friend/del", params);
      return getSuccessData(res, {})

    },
    /** 获取交友置顶套餐 */
    async cityLoveGetTopList({commit}, params) {
      const {data} = await requestByPost("city/api/friend/top", params);
      return getSuccessData(data, [])
    },
    /** 置顶下订单 */
    async cityLoveTopOrder({commit}, params) {
      const res = await requestByPost("city/api/friend/friend_top", params);
      return getSuccessData(res, {})
    },
    /** 民族 */
    async MzList({commit}, params) {
      const {data} = await requestByGet("city/api/friend/nation", params);
      return getSuccessData(data, [])
    },
  }
}
