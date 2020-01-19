<template>
  <div class="c-chat">
    <!--<header class="l-header">-->
    <!--<van-icon name="arrow-left" class="arrow-icon"-->
    <!--@click="$pushRoute({path:'/conversation/history',query:{cId:user.cId}})"/>-->
    <!--<em class="nick-name">{{targetUser.userName}}</em>-->
    <!--</header>-->
    <!--这个头部是组件来的 S-->
    <Header :childrenTitle="otherInfo.userName"></Header>
    <!--这个头部是组件来的 E-->


    <section class="l-content" ref="container" @click="cancelFeatureBar">
      <van-loading size="80px" color="#5db271" class="loading-icon" v-show="!visibility"/>
      <ul class="c-chat-list" :style="{visibility:visibility?'visible':'hidden'}">
        <li class="c-chat-list__item" :class="{'c-chat-list__item--right':item.type!='target'}"
            v-for="(item,index) in msgList" :key="index">
          <img class="c-chat-list__avatar" :src="item.user.portrait" alt="">
          <aside class="c-chat-list__audio can-touch" :style="{width:`${item.duration * 30}px`}"
                 v-if="item.msgType==='audio'" @click="playAudio(item.msg,index)">
            <speak-icon class="audio-icon" :is-play="playVideoIndex === index"/>
            <em class="audio-duration">{{item.duration}} "</em></aside>
          <div class="c-chat-list__video-container" v-else-if="item.msgType==='video'"
               @click="playVideo(item.msg)">
            <i class="iconfont icon-bofang1 c-chat-list__video-icon can-touch"></i>
            <ImgLoading class="c-chat-list__pic can-touch"
                        :src="item.captureImageUrl" alt=""/>
          </div>
          <img class="c-chat-list__pic" :preview="imgPreviewId" v-else-if="item.msgType==='image'"
               :src="item.msg" alt=""/>
          <p class="c-chat-list__text" v-else>
            {{item.msg}}
          </p>
        </li>
      </ul>
    </section>
    <footer class="l-footer">
      <div class="l-footer__top">
        <i class="iconfont icon-biaoqing smile-icon can-touch" @click.stop="openFeatureBar('emoji')"></i>
        <input class="c-chat__input" @focus="focusHandle" @keydown.enter="sendMsg" v-model="inputVal" type="text" placeholder="请输入..."
        >
        <i class="iconfont icon-jiahao add-icon can-touch" @click.stop="openFeatureBar('toolBar')"></i>
        <button class="c-chat__submit"  @click="sendMsg">发送</button>
      </div>
      <transition name="upSideDown">
        <div class="l-footer__bottom" v-show="showFeatureBar">
          <div class="c-feature-bar">
            <transition name="leftRightToggle">
              <ul class="c-emoji" v-if="featureTarget==='emoji'">
                <li class="c-emoji__item can-touch" @click="addEmoji(item.unicode)" v-for="(item,key) in EMOJI_LIST"
                    :key="key">
                  {{item.unicode}}
                </li>
              </ul>
              <ul class="c-tool" v-if="featureTarget==='toolBar'">
                <li class="c-tool__item can-touch" @click="uploadImg">
                  <i class="c-tool__icon iconfont icon-tupian1"></i>
                  <em class="c-tool__legend">图片</em>
                </li>
                <li class="c-tool__item can-touch">
                  <van-uploader class="c-tool__upload" accept="video/*" :after-read="uploadVideo">
                    <i class="c-tool__icon iconfont icon-shipin1"></i>
                    <em class="c-tool__legend">视频</em>
                  </van-uploader>
                </li>
                <li class="c-tool__item can-touch" @touchstart="beginRecord" @touchend="stopRecord"
                    @touchcancel="stopRecord">
                  <i class="c-tool__icon iconfont icon-luyin"></i>
                  <em class="c-tool__legend">录音</em>
                </li>
              </ul>
            </transition>
          </div>
        </div>
      </transition>
    </footer>
    <video class="c-video"
           x5-video-player-fullscreen="true"
           :src="getPathByAssetPath(videoUrl)" ref="commonVideo" controls>
    </video>
  </div>
</template>

<script>

  import Header from "@/components/header";
  import {mapState, mapActions} from 'vuex'
  import {PlaceholderAvatar} from "../../project-config/base";
  import {
    changeConversationState,
    createConversation,
    sortZipUserId
  } from "../../util/im-util";
  import {
    hideLoading,
    randomColor,
    scrollToView,
    showDialog,
    showLoading
  } from "../../util";
  import ImgLoading from "../../components/basic/img-loading";
  import SpeakIcon from "../../components/basic/speak-icon";
  import {EMOJI_LIST} from "../../project-config/emoji-list";
  import ConversationActions from "../../actions/conversation";

  export default {
    name: "Conversation",
    components: {SpeakIcon, ImgLoading,Header},
    props: ["client", "conversations", "receiveConversations"],
    data() {
      return {
        EMOJI_LIST,
        PlaceholderAvatar,
        videoUrl: "",
        inputVal: '',
        justifySize: 500,
        showFeatureBar: false,
        conversation: {},
        targetId: null,
        visibility: false,
        featureTarget: null,
        toast: null,
        recordStartTime: null,
        playVideoIndex: null,
        recordState: true,
        otherInfo : {}        //对方的信息
      }
    },
    methods: {
      ...mapActions('conversation', ['postTextMsgAction', 'postAudioMsgAction', 'postImgMsgAction', 'postVideoMsgAction', 'setTargetUserById']),
      async sendMsg(e) {
        if (!this.inputVal) return;
        await this.postTextMsgAction({
          conversation: this.conversation,
          msg: this.inputVal
        });
        this.inputVal = '';
      },
      focusHandle() {
        this.cancelFeatureBar();
        this.adjustContent();
        setTimeout(function () {
          document.body.scrollTop = document.body.scrollHeight;
        }, 300);
      },
      openFeatureBar(feature) {
        this.adjustContent();
        //如果是相同功能点击多次则为开关
        if (this.featureTarget === feature) {
          return this.showFeatureBar = !this.showFeatureBar;
        }
        this.showFeatureBar = true;
        this.featureTarget = feature;
      },
      cancelFeatureBar() {
        this.showFeatureBar = false;
      },
      //更新会话状态
      changeReadState() {
        const receiveContext = this.receiveConversations[sortZipUserId(this.conversation.members)];
        receiveContext && changeConversationState(receiveContext.receiveConv);
        this.$emit("refresh");
      },
      addEmoji(unicode) {
        this.inputVal += unicode;
      },
      //调整会话内容区域
      adjustContent() {
        const listItem = document.querySelectorAll(".c-chat-list__item");
        scrollToView(this.$refs.container, listItem[listItem.length - 1], this.justifySize);
      },
      //初始化会话
      async initConversation() {
        showLoading();
        const query = this.$route.query;
        this.targetId = query["tId"];
        if (!this.targetId) {
          return showDialog("无效的用户", "提示", false);
        }
        const userInfo = this.setTargetUserById(this.targetId);
        console.log("userInfo=========================");
        if(userInfo){
          userInfo.then((user) => {
            document.title = user.userName || '会话';
            this.otherInfo = user;
          });
        }
        this.changeReadState();
        console.log(this.client, [this.targetId], '测试会话')
        //创建会话
        this.conversation = await createConversation(this.client, [this.targetId], '测试会话');
        console.log("this.conversation",this.conversation)
        setTimeout(() => {
          const dom = this.$refs.container;
          dom.scrollTop = 99999999;
          this.visibility = true;
          setTimeout(this.$previewRefresh.bind(this), 300)
        }, 300);
        hideLoading();
      }
    },
    watch: {
      conversationMsg() {
        //调整容器滚动位置
        this.adjustContent();
        //  每次收到信息标记为已读
        this.changeReadState();
        //刷新图片的画廊
        setTimeout(this.$previewRefresh.bind(this), 300)
      }
    },
    mixins: [ConversationActions],
    computed: {
      ...mapState("conversation", {
        conversationMsg: state => state.conversationMsg,
        targetUser: s => s.targetUser,
      }),
      ...mapState({
        user: s => s.user
      }),
      imgPreviewId() {
        return randomColor();
      },
      msgList() {
        return this.conversationMsg[sortZipUserId(this.conversation.members)];
      },
    },
    created() {
      this.initConversation();
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  .c-chat {
    user-select: none;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .c-video {
      width: 0;
      height: 0;
      opacity: 0;
      position: fixed;
      left: -6666px;
    }
    .l-header {
      height: 100px;
      background: rgba(255, 255, 255, 1);
      position: relative;
      @include flex-center;
      .arrow-icon {
        position: absolute;
        left: 30px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 34px;
        color: #000;
      }
      .nick-name {
        font-size: 36px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
    }
    .l-content {
      flex: 1;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: #F4F4F4;
      position: relative;
      .loading-icon {
        @include absoluteFull(fixed);
        margin: auto;
      }
      .c-chat-list {
        $item-margin: 60px;
        &__item {
          display: flex;
          padding: 0 30px;
          margin: $item-margin 0;
        }

        &__avatar {
          width: 86px;
          height: 86px;
          background: rgba(187, 187, 187, 1);
          border-radius: 50%;
        }
        &__video-container {
          position: relative;
        }
        &__video-icon {
          display: inline-block;
          font-size: 40px;
          border: 1PX solid #fff;
          border-radius: 50%;
          padding: 20px;
          color: white;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 9;
        }
        &__pic {
          max-width: 288px;
          max-height: 288px;
          border-radius: 8px;
          overflow: hidden;
          margin: 0 43px;

        }
        &__text {
          max-width: 397px;
          background: rgba(93, 178, 113, 1);
          border-radius: 8px;
          margin-left: 43px;
          margin-top: 4px;
          position: relative;
          padding: 20px 34px;
          font-size: 32px;
          word-break: break-all;
          color: rgba(255, 255, 255, 1);
          line-height: 1.5;
          &:before {
            content: "";
            display: block;
            border-top: 12px solid transparent;
            border-bottom: 12px solid transparent;
            border-right: 16px solid transparent;
            border-left: 16px solid transparent;
            border-right-color: #5DB271;
            position: absolute;
            top: 40px;
            transform: translate(-100%, -50%);
            left: 0;
          }
        }
        &__item--right {
          flex-direction: row-reverse;
          .c-chat-list__text {
            word-break: break-all;
            margin-right: 43px;
            &:before {
              right: 0;
              border-right-color: transparent;
              border-left-color: #5DB271;
              transform: translate(100%, -50%);
            }
          }
          .c-chat-list__audio {
            flex-direction: row-reverse;
            .audio-icon {
              transform: rotateZ(180deg);
            }
          }
        }
        &__audio {
          @extend .c-chat-list__text;
          padding: 0 24px;
          height: 86px;
          @include flex-between;
          min-width: 120px;
          .audio-icon {
            font-size: 44px;
          }
          .audio-icon--play {
            width: 40px;
            height: 70px;
          }
          .audio-duration {
            font-size: 30px;
            margin-left: 30px;
          }
        }

      }
    }
    .l-footer {
      width: 100%;
      display: flex;
      flex-direction: column;
      &__top {
        height: 110px;
        background-color: #fcfcfc;
        @include flex-center;
        padding: 25px 29px;
        box-sizing: border-box;
      }
      .c-chat__input {
        flex: 1;
        border: 1PX solid rgba(221, 221, 221, 1);
        height: 100%;
        border-radius: 8px;
        background-color: #fff;
        font-size: 24px;
        padding-left: 20px;
        color: #000;
        box-shadow: none;
        margin-left: 30px;
        -webkit-appearance: none;
        &::-webkit-input-placeholder {
          color: #999999;
          font-size: 26px;
        }
      }
      .c-chat__submit {
        border: 1PX solid rgba(221, 221, 221, 1);
        height: 100%;
        border-radius: 8px;
        background-color: #fff;
        text-align: center;
        padding: 0 20px;
        color: #383838;
      }
      .smile-icon {
        @include flex-center;
        border: 1PX solid rgba(221, 221, 221, 1);
        border-radius: 50%;
        width: 58px;
        height: 58px;
        color: #999999;
        font-size: 60px;
      }
      .add-icon {
        border: 1PX solid rgba(221, 221, 221, 1);
        border-radius: 50%;
        width: 58px;
        height: 58px;
        @include flex-center;
        color: #999999;
        font-size: 26px;
        margin: 0 14px;
      }

      &__bottom {
        height: 400px;
        background-color: #fcfcfc;
        border-top: 1PX solid #f4f4f4;
        overflow: hidden;
        .c-feature-bar {
          height: 400px;
          overflow-y: auto;
        }
        .c-emoji {
          display: flex;
          flex-wrap: wrap;
          &__item {
            width: 14%;
            font-size: 52px;
            @include flex-center;
            margin-top: 24px;
          }
        }
        .c-tool {
          height: 100%;
          background-color: #f4f4f4;
          @include flex-center;
          @mixin c-tool__item {
            flex: 1;
            @include flex-center;
            flex-direction: column;
          }
        ;
          &__upload {
            @include c-tool__item;
          }
          &__item {
            @include c-tool__item;
            &:nth-child(1) {
              color: #00C89D;
            }
            &:nth-child(2) {
              color: #FF6991;
            }
            &:nth-child(3) {
              color: #4391F5;
            }
          }
          &__icon {
            font-size: 96px;
          }
          &__legend {
            margin-top: 40px;
            font-size: 30px;
            color: rgba(153, 153, 153, 1);
          }
        }
      }
    }

    .can-touch:active {
      transition: opacity .1s;
      opacity: .7;
    }
    .upSideDown-enter-active, .upSideDown-leave-active {
      transition: height .3s;
      will-change: transform;
    }
    .upSideDown-enter, .upSideDown-leave-to /* .fade-leave-active below version 2.1.8 */
    {
      height: 0;
    }
    .leftRightToggle-enter-active, .leftRightToggle-leave-active {
      transition: transform .3s;
      will-change: transform;
    }
    .leftRightToggle-enter, .leftRightToggle-leave-to /* .fade-leave-active below version 2.1.8 */
    {
      display: none;
      transform: translateX(-100%);
    }
    .leftRightToggle-leave, .leftRightToggle-enter-to {
      display: none;
    }
  }
</style>
