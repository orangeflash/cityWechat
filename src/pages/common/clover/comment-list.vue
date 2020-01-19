<template>
  <!--公共的评论详情列表页-->


  <div class="dd-comment">
    <Header/>
    <!--<dd-article-->
    <!--v-bind="orderInfo"-->
    <!--&gt;-->
    <!--<div slot="attr" class="flex-bt flex-y-center col-9 mar-t">-->
    <!--<span>{{orderInfo.typeName}}</span>-->
    <!--</div>-->
    <!--</dd-article>-->
    <div slot="content" class="comment-list bg-f br-t-d">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="commentList.length > 0"
      >
        <comment
          v-for="(item,key) in commentList"
          :key="key"
          :data="item"
          canReply="true"
          @reply="replyComment(item.commentId)"
          @lookReply="lookReply(item.commentId)"
        />
      </scroller>
      <not-data v-else-if="isRequset"/>
    </div>
    <dd-input
      v-model="params.body"
      placeholder="说点什么吧......"
      @click="send"
    />
  </div>
</template>

<script>
  import Comment from '@/components/template/dd-article/comment';
  import Chunk from '@/components/template/dd-store/chunk';
  import DdInput from '@/components/template/dd-form/footer-input';
  import {Toast} from 'vant'

  import {mapActions, mapState} from 'vuex'
  import {computedDate, showLoading} from "../../../util";

  export default {
    components: {Comment, Chunk, DdInput},
    data() {
      return {
        commentList: [],
        activityId: null,
        isRequset: false,
        params: {
          body: null,
          activityId: null,
          page: 1,
          size: 10
        }
      }
    },
    methods: {
      ...mapActions("activity", ["getSingelActivityCommentAll", "commentActivity"]),
      judge() {
        return this.params.body && this.params.body.trim() != '';
      },
      async send(v) {
        if (!this.judge()) return Toast({
          message: '说点什么吧......',
          duration: 1500
        });
        showLoading("评论中...");

        const res = await this.commentActivity(this.params);

        if (res.code == 1) {
          Toast.success({
            message: '评论成功',
            duration: 1500
          });
          setTimeout(() => {
            this.$router.go(0)
          }, 1500)
        } else {
          Toast.fail({
            message: res.msg,
            duration: 1500
          })
        }

      },
      /** 刷新 */
      async onRefresh(done) {

        this.params.page = 1;
        await this.getComment(true);
        done && done();
      },
      /** 加载更多 */
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getComment(true);
        done && done(!bool);
      },
      /** 回复评论 */
      replyComment(commentId) {
        console.log("commentId", commentId)
        this.isFailParams({
          field: commentId,
          tips: '缺少评论id',
          noBack: true,
          success() {
            this.goPointPage({
              path: '/auxiliary/activity/comment',
              query: {
                title: '回复评论',
                commentId,
                isReply: true,
                activityId: this.$route.query.activityId
              }
            })
          }
        })
      },

      async getComment(refresh) {
        const result = await this.getSingelActivityCommentAll(this.params);
        this.isRequset = true;
        result.forEach(item => {
          item.src = item.portrait,
            item.nickname = item.userName,
            item.comment = item.body,
            item.time = computedDate(+item.creatTime),
            item.replySize = item.reply.length
        })
        this.commentList = this.commentList.concat(result);


        return result.length >= this.params.size
      },
      /** 查看所有的回复 */
      lookReply(commentId) {
        console.log("查看所有的回复", commentId);

        this.goPointPage({
          path: "/auxiliary/activity/commentDetails",
          query: {
            commentId,
            activityId: this.$route.query.activityId
          }
        })


      },
    }
    ,
    created() {
      const query = this.$route.query;
      let fields = query.activityId;
      this.isFailParams({
        field: fields,
        tips: ["缺少活动Id"],
        success() {
          this.params.activityId = query.activityId;
          this.getComment();
        }
      })


    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .comment-list {
    position: fixed;
    width: 100%;
    height: calc(100% - 100px);
  }
</style>
