<template>
  <div class="comment-detail">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <section v-for="(item,key) in postComments" :key="key">
      <ul class="c-comment-content">
        <li class="c-comment-content__list">
          <div class="l-container">
            <div class="c-comment__avatar">
              <img-wrapper :src="item.portrait" alt=""/>
            </div>
            <figure class="c-comment-info">
              <figcaption class="c-comment-info__nick-name flex-bt">{{item.userName}}
                <i class="iconfont icon-pinglun11 commment-icon"
                   @click="openComment(item.commentId,item.userId)" v-if="postConfig.comment == '1'"></i></figcaption>
              <figcaption class="c-comment-info__time">{{computedDate(item.creatTime)}}</figcaption>
              <figcaption class="c-comment-info__body  lineH-38">{{item.body}}</figcaption>
            </figure>
          </div>
          <h3 class="c-comment-replay-header" v-if="item.reply &&item.reply.length">全部回复</h3>
          <section class="c-comment-replay">
            <div class="l-container" v-for="replay in item.reply" :key="replay.id">
              <div class="c-comment__avatar">
                <img-wrapper :src="replay.portrait" alt=""/>
              </div>
              <figure class="c-comment-info">
                <figcaption class="c-comment-info__nick-name">{{replay.userName}}</figcaption>
                <figcaption class="c-comment-info__time">{{computedDate(replay.creatTime)}}</figcaption>
                <figcaption class="c-comment-info__body lineH-38">{{replay.body}}</figcaption>
              </figure>
            </div>
          </section>
        </li>
      </ul>
    </section>
    <dd-comment v-model="showComment" @confirm="releaseComment"/>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../plugins/util-mixins";
  import DdComment from '@/components/template/dd-form/comment'
  import {hideLoading, showHandleStatusByFlag, showLoading} from "../../util";
  import {Toast} from 'vant'

  export default {
    components: {DdComment},
    data() {
      return {
        showComment: false,
        hasMore: true,
        postComments: [],
        methodName: [],
        commentId: '',
        replyId: '',
        params: {
          page: 1,
          size: 10,
          infoId: 0,
          commentId: 0,
          postId: 0
        }
      }
    },
    mixins: [utilMixins],
    methods: {
      ...mapActions("post", [
        "getPostDetailById", "getPostListByParams", "submitComment", "getCommentDetailById", "postCommentList"
      ]),
      ...mapActions("common", ["getPostConfig"]),
      ...mapActions("cityInformation", ['getInformationComments', "informationComment"]),
      async initPostDetail(postId) {
        const {data, comment, dz, count} = await this.postCommentList(this.params);
        this.postComments = this.postComments.concat(data);
        this.hasMore = data.length >= this.params.size;
      },
      async initCommentDetail() {
        const {data} = await this.getCommentDetailById(this.params);
        this.hasMore = data.length >= this.params.size;
        this.postComments = this.postComments.concat(data);
      },
      async getInformationComment() {
        const data = await this.getInformationComments(this.params);
        this.hasMore = data.length >= this.params.size;
        this.postComments = this.postComments.concat(data);
      },
      async onRefresh() {
        this.params.page = 1;
        showLoading();
        await this[this.methodName]()
        hideLoading()
      },
      async onInfinite() {
        console.log("开始加载更多")
        if (!this.hasMore) return;
        this.params.page++;
        showLoading();
        await this[this.methodName]()
        hideLoading()
      },
      openComment(commentId, replyId) {
        this.commentId = commentId
        this.replyId = replyId;
        this.showComment = !this.showComment
      },
      async releaseComment(msg = "", commentId, replyId) {
        console.log('开始评论');
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return

        if (!msg.trim()) {
          return Toast({
            message: '请输入评论',
            duration: 1500
          })
        }
        showLoading();
        const res = await this.informationComment({
          infoId: this.$route.query.postId || this.$route.query.infoId,
          body: msg,
          commentId: this.commentId,
          replyUserId: this.replyId
        })

        showHandleStatusByFlag(res.code, "评论成功", res.msg);
        if (res.code) {
          this.showComment = !this.showComment
          setTimeout(() => {
            this.postComments = [];
            this.onRefresh();
          }, 1500)
        }
      }
    },
    computed:{
      ...mapState("common", {
        postConfig: state => state.postConfig,
      }),
    },

    created() {
      const {postId, commentId, infoId} = this.$route.query;
      console.log("this.$route.query", this.$route.query)
      if (commentId) {
        this.params.commentId = commentId;
        this.methodName = 'initCommentDetail'
      } else if (infoId) {
        this.params.infoId = infoId;
        this.methodName = 'getInformationComment'
      } else if (postId) {
        this.params.postId = postId;
        this.methodName = 'initPostDetail'
      }

      this.getPostConfig();


      this.onRefresh(postId);
      this.onscroll(this.onInfinite, this.$route.path);
    }
  }
</script>
<style scoped lang="scss">
  .comment-detail {
    .c-comment-content {
      .c-comment-content__list {
        margin-bottom: 20px;
        background-color: #fff;
        display: flex;
        padding: 20px 40px 0;
        flex-direction: column;

        .l-container {
          display: flex;
          padding: 20px 0;
          border-bottom: 1.1px solid #f4f4f4;
        }
      }

      .c-comment__avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }

      .c-comment-info {
        flex: 1;
        margin-left: 30px;
        display: flex;
        flex-direction: column;
        color: #000;
        font-size: 28px;

        &__time {
          margin-top: 12px;
          color: #bfbfbf;
          font-size: 24px;
        }

        &__body {
          margin-top: 20px;
          word-break: break-all;
        }

      }

      .c-comment-replay-header {
        font-size: 28px;
        color: #424242;
        padding: 20px 0;
        border-bottom: 1PX solid #f4f4f4;
      }

      .c-comment-replay {
        padding: 30px 0px 0px 40px;
      }
    }

  }
</style>
