import {postMsg, signIn, sortZipUserId} from "../../util/im-util";
import _ from 'lodash'
import {TextMessage, TypedMessage} from "leancloud-realtime";
import {requestByGet, requestByPost} from "../../util/request";
import {getGlobalData} from "../../util";

export default {
  namespaced: true,
  state: {
    conversationMsg: {},
    targetUser: {},
  },
  mutations: {
    /**
     * 根据会话推送接收信息
     * @param state
     * @param params
     */
    pushMsgByConversation(state, params) {
      //console.log('pushMsgByConversation',params,getGlobalData("user"))
      const conversationMsg = _.cloneDeep(state.conversationMsg);
      if(conversationMsg[params.id]){

      }
      conversationMsg[params.id] = conversationMsg[params.id] ? conversationMsg[params.id] : [];
      conversationMsg[params.id].push(params.context);

      state.conversationMsg = conversationMsg;
      //  每条消息发送并提交模板消息
      const user = params.context.user;
      const targetUser = params.context.targetUser;
      //如果收到的及时消息的targetUser.id与客户端user.id相同则不发模版信息
      if(targetUser.id==getGlobalData("user").id) return
      requestByPost("city/api/config/send_message", {
        userId: targetUser.id,
        name: user.userName,
        content: params.context.msg
      })
    },
    SET_TARGET_USER(state, user) {
      state.targetUser = user;
    }

  },
  /***
   * 信息模型
   *
   */
  actions: {
    /***
     * 设置会话对象
     * {
          type: 'self'|'target',
          msg: string,
          msgType: 'text'|'audio'|'image'|'video',
          user: User,
          duration?: number,
          targetUser:User
        }
     */
    async setTargetUserById({commit, state, rootState}, userId) {
      const {data} = await requestByGet("city/api/user/info", {
        id: userId
      });
      commit("SET_TARGET_USER", data);
      return data;
    }, async cleanHistory({commit, state, rootState}) {
      state.conversationMsg = {};
      const vuexStorage = JSON.parse(localStorage.getItem("vuex"));
      vuexStorage.conversation = {};
      localStorage.setItem("vuex",JSON.stringify(vuexStorage))
    },
    /***
     * 文本消息
     */
    async postTextMsgAction({commit, state, rootState}, {conversation, msg}) {
      const msgType = 'text';
      await postMsg(conversation, new TextMessage(msg));
      commit("pushMsgByConversation", {
        id: sortZipUserId(conversation.members),
        context: {
          type: 'self',
          msg,
          msgType,
          user: rootState.user,
          targetUser: state.targetUser
        }
      });
    },
    /***
     * 本地保存localId,
     * 发送serverId
     */
    async postAudioMsgAction({commit, state, rootState}, {conversation, serverId, localId, duration}) {
      const msgType = 'audio';
      const audioMsg = new TextMessage(serverId);
      audioMsg.setAttributes({msgType, duration});
      await postMsg(conversation, audioMsg);
      commit("pushMsgByConversation", {
        id: sortZipUserId(conversation.members),
        context: {
          type: 'self',
          msg: localId,
          duration,
          msgType,
          user: rootState.user,
          targetUser: state.targetUser
        }
      });
    },
    /***
     * 本地保存localId,
     * 发送serverId
     */
    async postImgMsgAction({commit, state, rootState}, {conversation, serverId, localId}) {
      const msgType = 'image';
      const imageMsg = new TextMessage(serverId);
      imageMsg.setAttributes({msgType});
      await postMsg(conversation, imageMsg);
      commit("pushMsgByConversation", {
        id: sortZipUserId(conversation.members),
        context: {
          type: 'self',
          msg: localId,
          msgType,
          user: rootState.user,
          targetUser: state.targetUser
        }
      });
    },
    /***
     * 发送上传后的视频数据
     */
    async postVideoMsgAction({commit, state, rootState}, {conversation, videoUrl, captureImageUrl}) {
      const msgType = 'video';
      const videoMsg = new TextMessage(videoUrl);
      videoMsg.setAttributes({msgType, captureImageUrl});
      await postMsg(conversation, videoMsg);
      commit("pushMsgByConversation", {
        id: sortZipUserId(conversation.members),
        context: {
          type: 'self',
          msg: videoUrl,
          msgType, captureImageUrl,
          user: rootState.user,
          targetUser: state.targetUser
        }
      });
    },
  },
}
