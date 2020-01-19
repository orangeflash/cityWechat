<template>
  <!--公共的评论详情列表页-->


  <div class="dd-comment" v-if="comment.src">
    <Header/>
    <div>
      <comment
        :data="comment"
      />
    </div>
    <chunk
      :title="'回复列表('+replyList.length+')'"
    >
      <div slot="content" class="pad-l bg-f br-t-d">
        <comment
          v-for="(item,key) in replyList"
          :key="key"
          :data="item"
        />
      </div>
    </chunk>
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
        comment: {},
        replyList: [],
        commentId: null,
        params: {
          body: null,
          commentId: null,
        }
      }
    },
    methods: {
      ...mapActions("activity", ["getSingelActivityComment", "commentActivity"]),
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
      async getComment() {
        const result = await this.getSingelActivityComment({
          commentId: this.commentId
        });


        if (result.length) {
          this.comment = result[0]
        }

        /**  后台给予的字段     组件的字段
         *     portrait           src
         *    body                comment
         *    userName            nickname
         *     creatTime          time
         * */
        const fields = {
          portrait: 'src',
          body: 'comment',
          userName: 'nickname',
          creatTime: 'time'
        }

        this.comment.time = computedDate(+this.comment.creatTime);

        /** 利用jsonChangeField 替换字段的方法进行数据字段转换
         *  该方法会返回一个新的json
         * */
        this.comment = this.jsonChangeField({
          json: this.comment,
          fields,
        });


        this.replyList = this.comment.reply.map(item => {
          item.time = computedDate(+item.creatTime);
          return this.jsonChangeField({
            json: item,
            fields,
          });
        })
      },
    }
    ,
    created() {
      const query = this.$route.query;
      let fields = query.commentId;
      this.isFailParams({
        field: fields,
        tips: ["缺少评论Id"],
        success() {
          this.params.commentId = this.commentId = query.commentId;
          this.params.activityId = query.activityId;
          this.getComment();
        }
      })
    }
  }

</script>
