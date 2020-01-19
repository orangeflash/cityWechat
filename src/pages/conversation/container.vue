<template>
  <div id="Main">
    <router-view @refresh="refreshHandle" :client="client" v-if="isInitialized" :conversations="conversations"
                 :receiveConversations="receiveConversations"/>
    <van-loading size="80px" color="#5db271" class="loading-icon" v-show="!isInitialized"/>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters, mapMutations} from 'vuex'
  import {
    addClientListener,
    addMsgListener,
    initIM,
    initIMClient,
    sortZipUserId,
    unZipTargetUserId
  } from "../../util/im-util";
  import {showDialog} from "../../util";

  export default {
    name: "Main",
    data() {
      return {
        isInitialized: false,
        client: null,
        conversations: [],
        receiveConversations: {}
      }
    },
    methods: {
      ...mapMutations("conversation", ['pushMsgByConversation', 'setReceiveConversations']),
      ...mapActions("personal", ['getUserInfoById']),
      refreshHandle() {
        for (let key in this.receiveConversations) {
          const context = this.receiveConversations[key];
          context.unreadMsg = context.receiveConv.unreadMsg
        }
      },
      /**
       * 监听当前客户端（接收到的所有新会话）
       * 添加新的会话
       * 将每个新会话加上信息监听
       * 将接收到的会话进行添加或替换
       */
      initClientListener() {
        return addClientListener(this.client, (conversation) => {
          if (this.conversations.indexOf(conversation) < 0) {
            this.conversations.push(conversation);
            this.initConversationListener(conversation);
          }
          this.setReceiveConversations(
            sortZipUserId(conversation.members),
            {
              receiveConv: conversation,
              unreadMsg: conversation.unreadMessagesCount,
            }
          );
        })
      },
      setReceiveConversations(id, context) {
        this.receiveConversations[id] = context;
      },
      /***
       * 每次接收到新消息时，将其加入仓库
       */
      initConversationListener(conv) {
        return addMsgListener(conv, async (msgObj) => {
          if (!msgObj.attributes) {
            msgObj.attributes = {}
          }
          const targetUser = await this.getUserInfoById(conv.creator);
          let context = {
            type: 'target',
            msg: msgObj.text,
            ...msgObj.attributes,
            user: targetUser || {},
            targetUser: this.user || {}
          };
          if (msgObj.attributes.msgType === 'audio') {
            context.msg = await new Promise(function (resolve) {
              window.wx.downloadVoice({
                serverId: context.msg, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                  resolve(res.localId);
                }
              });
            });
          } else if (msgObj.attributes.msgType === 'image') {
            context.msg = await new Promise(function (resolve) {
              window.wx.downloadImage({
                serverId: context.msg, // 需要下载的图片的服务器端ID，由uploadImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                  resolve(res.localId);
                },
                fail: function (e) {
                  showDialog(e);
                  resolve("");
                }
              });
            });
          }
          //console.log('this.url',location.href)
          this.pushMsgByConversation({
            id: sortZipUserId(conv.members),
            context
          });
        });
      }
    },
    computed: {
      ...mapState({
        user: s => s.user,
        platform: s => s.platform
      })
    },
    /***
     * 初始化当前user
     * 进入此页面必须带cId
     */
    async created() {
      if (_.isEmpty(this.user)) {
        return showDialog("请先登录后在操作", "警告", false);
      }
      await initIM(this.platform.dialogAppID, this.platform.dialogAppKey);
      console.log("this.user.id", this.user.id)
      this.client = await initIMClient(this.user.id);
      this.isInitialized = true;
      await this.initClientListener();
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #Main .loading-icon {
    @include absoluteFull(fixed);
    margin: auto;
  }
</style>
