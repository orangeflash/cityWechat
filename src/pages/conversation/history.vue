<template>
  <div id="History">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <header class="l-header">
      <!--<h1 class="l-header__title">我的私信</h1>-->
      <aside class="l-header__tool-bar">
        <em>{{getTotalUnReadCount(receiveConversations)?`${getTotalUnReadCount(receiveConversations)}条未读消息`:'暂无未读消息'}}</em>
        <i class="iconfont icon-qingchu1 icon-trash" @click="showActionSheet=true"></i>
      </aside>
    </header>
    <section class="l-content">
      <ul class="c-history">

        <li class="c-history__item" v-for="(item,key) in lastMsgList" :key="key"
            @click="goPointPage({path:'/conversation',query:changeIdsToParams(item.ids)})">
          <div class="c-history-avatar">
            <img class="c-history-avatar__img" :src="item.target&&item.target.portrait" alt="">
            <em v-show="getUnReadMsg(item.ids)" class="c-history-avatar__dot">{{getUnReadMsg(item.ids)}}</em>
          </div>
          <div class="c-history__content">
            <h3 class="c-history__legend">{{item.target.userName}}</h3>
            <p class="c-history__text">{{formatMsg(item.lastMsg)}}</p>
          </div>
        </li>
      </ul>
    </section>
    <van-actionsheet
      cancel-text="取消"
      v-model="showActionSheet"
      :actions="actions"
      @select="onSelectHandle"
    />
  </div>
</template>

<script>
  import {PlaceholderAvatar} from "../../project-config/base";
  import {
    changeConversationState,
    unZipTargetUserId
  } from "../../util/im-util";
  import {mapState, mapActions} from 'vuex'
  import _ from 'lodash'
  import Header from "@/components/header";
  export default {
    name: "History",
    props: ["client", "receiveConversations"],
    components: {Header},
    data() {
      return {
        PlaceholderAvatar,
        showActionSheet: false,
        actions: [
          {
            name: '标为已读',
            tag: 0
          },
          {
            name: '全部清除',
            tag: 1
          }
        ],
        userList: [],
        currentUserId: null
      }
    },
    methods: {
      ...mapActions("conversation", ["cleanHistory"]),
      async onSelectHandle({tag}) {
        if (tag === 0) {
          const promiseArr = _.map(this.receiveConversations, async function (receiveContext) {
            await changeConversationState(receiveContext.receiveConv);
          });
          await Promise.all(promiseArr);
          this.$emit("refresh");
        } else if (tag === 1) {
          this.cleanHistory();
        }
        this.showActionSheet = false;
      },
      changeIdsToParams(ids) {
        return {
          tId: unZipTargetUserId(ids, this.clientUser.id)
        };
      },
      getUnReadMsg(ids) {
        return this.receiveConversations[ids] && this.receiveConversations[ids].unreadMsg;
      },
      formatMsg(msgObj) {
        if (msgObj.msgType === 'image') {
          return "[图片]"
        }
        else if (msgObj.msgType === 'video') {
          return "[视频]"
        }
        else if (msgObj.msgType === 'audio') {
          return "[音频]"
        }
        else {
          return msgObj.msg
        }
      },
      getTotalUnReadCount(receiveConversations) {
        const countList = _.map(receiveConversations, function (receiveContext) {
          return receiveContext.unreadMsg;
        });
        return countList.reduce((p, c) => p + c, 0)
      },
    },
    computed: {
      ...mapState({
        clientUser: state => state.user,
      }),
      ...mapState("conversation", {
        conversationMsg: state => state.conversationMsg,
      }),

      lastMsgList() {

        return _.map(this.conversationMsg, (msgArr, key) => {

          const targetList = msgArr.filter(rc => rc.type === "target");
          let target = null;
          if (targetList.length) {
            target = targetList[targetList.length - 1].user;
          }else{
            target = msgArr[msgArr.length - 1].targetUser;
          }
          return {
            ids: key,
            target,
            lastMsg: msgArr[msgArr.length - 1]
          }
        })
      }
    },
    async created() {

    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #History {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .l-header {
      background: $themeColor;
      position: relative;
      font-size: 36px;
      color: #fff;
      &__title {
        padding: 20px 0;
        margin-top: 20px;
        letter-spacing: .1em;
        @include flex-center;
      }
      &__tool-bar {
        padding: 18px 32px;
        font-size: 32px;
        @include flex-between;
        .icon-trash {
          display: inline-block;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #EFAE68;
          color: #fff;
          @include flex-center;
          font-size: 26px;
        }
      }
    }
    .l-content {
      flex: 1;
      background-color: #F4F4F4;
      padding: 16px 0;
      box-sizing: border-box;
    }
    .c-history {
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fcfcfc;
      border-radius: 30px;
      $item-height: 80px;
      &__item {
        width: 100%;
        height: $item-height;
        padding: 32px 0;
        @include alignCenter;
        &:not(:last-child) {
          border-bottom: 1PX solid #f1f1f1;
        }
      }
      &-avatar {
        width: $item-height;
        height: 100%;
        margin: 0 20px;
        font-size: 0;
        position: relative;
        &__img {
          border-radius: 6px;
          width: 100%;
          height: 100%;
        }
        &__dot {
          position: absolute;
          right: 0;
          top: 0;
          width: 30px;
          height: 30px;
          @include flex-center;
          font-size: 22px;
          border-radius: 50%;
          color: white;
          background-color: red;
          transform: translate(30%, -30%);
        }
      }
      &__content {
        flex: 1;
        height: 100%;
        padding: 2px 40px 0 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
      }
      &__legend {
        font-size: 30px;
        color: #000;
        @include t-overflow;
      }
      &__text {
        font-size: 22px;
        color: #cccc;
        @include t-overflow;
      }
    }

  }
</style>
