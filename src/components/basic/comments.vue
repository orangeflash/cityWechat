<template>
  <div class="comments pad-b">
    <div class="info-comment-message">
      <img :src="comment.portrait" alt="" srcset="" class="header-img">
      <div class="info-header flex-g-1">
        <div class="flex-bt">
          <em class="info-header-nickname">{{comment.userName}}</em>
          <i class="iconfont icon-pinglun11 commment-icon"
             @click="$emit('comment',comment.userId)"></i>
        </div>
        <em class="date">{{computedDate(comment.creatTime)}}</em>
        <span class="comments-detail pad-t-10 pad-b-10">{{comment.body}}</span>
        <div class="bg-e-i pad-l-20 pad-r-20 pad-b mar-t-10 mar-b-10 " v-if="comment.reply.length">
           <span class="comments-other bg-e-i lineH-40 " v-for="(reply,key) in comment.reply" :key="key" v-if="key<3">
          <em class="comment-header">{{reply.userName}}</em>回复<em class="comment-header">&nbsp;&nbsp;{{reply.replyUserName}}</em>
          ：{{reply.body}}
        </span>
        </div>

        <router-link :to="{path:'/commentDetail',query:{commentId:comment.commentId}}" v-if="comment.reply.length > 3"
                     class="see-more-comment pad-l-0">点击查看全部&nbsp;{{comment.reply.length}}&nbsp;条评论
        </router-link>
      </div>
    </div>


  </div>
</template>

<script>
  import autorImg from "../../assets/img/city-information/小头像.png";
  import {utilMixins} from "../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    props: {
      comment: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        autorImg,
      }
    },
    methods: {},
  }
</script>
<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";

  .comments {
    position: relative;

    .info-comment-message {
      border-top: 1PX solid rgb(221, 221, 221);
      padding: 20px 0px 0px 0px;
      display: flex;
      flex-direction: row;

      .header-img {
        width: 48px;
        height: 48px;
      }

      .info-header {
        margin-left: 24px;
        display: flex;
        flex-direction: column;

        .info-header-nickname {
          font-size: 28px;
          color: $themeColor;
        }
      }

      .info-article-reviews {
        margin-top: 20px;
        font-size: 26px;
        color: rgba(51, 51, 51, 1);
      }
    }

    .date {
      font-size: 22px;
      color: rgba(153, 153, 153, 1);
      margin: 10px 0px;
    }

    .comments-detail {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: $font-size-xs;

    }

    .comments-other {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-top: 20px;
      line-height: 30px;
      font-size: $font-size-xs;
      color: rgba(51, 51, 51, 1);
    }

    .comment-header {
      font-size: $font-size-base;
      color: $themeColor;
    }

    .autor-comment {
      color: rgba(0, 0, 0, 1);
    }

    .see-more-comment {
      color: $themeColor;
      display: inline-block;
      padding: 20px;
    }
  }
</style>
