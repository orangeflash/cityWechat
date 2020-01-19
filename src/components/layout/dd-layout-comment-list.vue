<template>

  <div class="pad-lr">
    <div class="flex-bt dh flex-y-center br-b-F0">
      <div class="fon-wb col-2 fon-xxl">{{title}}
        <span class="fon-b fon-w4" v-if="comments.length>0 && !hideTotal">（{{total || comments.length}}条评论）</span></div>
      <div class="col-9" v-if="comments.length>0 && !hideLink"
           @click="goPointPage({path:'/commentDetail',query:{postId}})">查看全部评论<i
        class="iconfont icon-youjiantou2"></i></div>
    </div>
    <div v-if="comments.length>0">
      <div class="pad-tb-30"
           :class="canShow && key < comments.length - 1 && ' br-b-F0'"
           v-for="(comment,key) in getComments" :key="key" v-if="canShow(key)">
        <div class="flex-bt">
          <dd-layout-user
            :src="comment.face"
            :size="0.85"
            :fillet="0.85"
            :desc="comment.releaseTime"
          >
            <div slot="icon" class="fon-b">{{comment.name}}</div>
          </dd-layout-user>
          <div class="col-6 fon-sm" @click="replyHandle(comment)">
            <i class="iconfont icon-biaoqing1 mar-r-10"></i>回复
          </div>
        </div>
        <div class="flex">
          <div class="w-85 miw-85 mar-r"></div>
          <div class="flex-g-1">
            <div class="fon-lg  lineH-48 pad-tb" v-html="comment.context"></div>
            <div class="bg-F2F3F5 pad-t-20 pad-lr-20 br-r-20" v-if="comment.reply.length > 0">
              <div class="lineH-38 mar-b-10" v-for="(reply,r) in comment.reply" :key="r">
                <span class="col-name">{{reply.userName}}</span>
                <span v-if="reply.replyUserName"> 回复 <em class="col-name">{{reply.replyUserName}}</em></span>:
                {{reply.body}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <not-data pad="10px 0" v-else/>
    <div class="flex-center pad-b mar-t" v-if="!hideComment">
      <span class="pad-17-28-15 col-t br-t fon-lg br-r-40" @click="commentHandle">我来说两句</span>
    </div>
    <slot v-if="comments.length>0" name="bottom"/>

    <van-popup class="br-r-20 over-h flex-col" v-model="showCommentMask">
      <section class="popup-mask w-600 bg-f  flex-col-i flex-center">
        <h3 class="mar-t fon-xxl">随便说点什么</h3>
        <div class="w-500 pad-30">
          <van-field class="br-f4 br-r-12" v-model="message" type="textarea" placeholder="请输入文字" rows="3"/>
        </div>
        <footer class="flex-center br-t-f4 w100">
          <button class="flex-g-1 dh-80 flex-center fon-xl let-space-20 out-n bg-f" @click="cancel">取消
          </button>
          <button class=" feature-btn--success flex-g-1 br-r-f4 dh-80 flex-center fon-xl bg-f let-space-20 out-n col-t"
                  @click="confirmComment">确定
          </button>
        </footer>
      </section>
    </van-popup>

  </div>

</template>


<script>

  import DdLayoutUser from "../../components/layout/dd-layout-user";
  import {computedDate, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../util";
  import {mapActions} from 'vuex'

  export default {
    props: {
      comments: {
        type: Array,
        default: () => []
      },
      total: {
        type: Number,
        default: 0,
      },
      postId: Number,
      hideComment: {
        type: Boolean,
        default: false,
      },
      hideTotal: {
        type: Boolean,
        default: false,
      },
      hideLink: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '评论'
      },
      limit: {
        type: Boolean,
        default: true,
      },
      deliver: {
        type: Boolean,
        default: false
      }
    },
    components: {DdLayoutUser},
    data() {
      return {
        message: '',
        replayConfig: {},
        showCommentMask: false
      }
    },
    computed: {
      getComments() {
        return this.comments.map(item => {
          return {
            face: item.portrait,
            context: item.body,
            releaseTime: computedDate(item.creatTime),
            reply: item.reply,
            userId: item.userId,
            name: item.userName,
            commentId: item.commentId
          }
        })
      },


    },
    methods: {
      ...mapActions("post", ['submitComment']),
      cancel() {
        this.$emit('cancel');
        this.showCommentMask = false
      },
      async replyHandle(item) {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return

        this.$emit('open');
        this.message = '';
        this.replayConfig = {
          commentId: item.commentId,
          userId: item.userId,

        }
        console.log("this.replayConfig", this.replayConfig, item)
        this.showCommentMask = true;
      },
      async commentHandle() {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        this.message = '';
        this.replayConfig = {};
        this.showCommentMask = true;
      },
      async confirmComment() {
        if (!this.message) {
          return showDialog("评论不能为空！", "提示", false)
        }


        if (this.deliver) {
          this.$emit('comment', {
            body: this.message,
            ...this.replayConfig
          })

        } else {
          showLoading();
          console.log("开始评论咯",this.replayConfig)
          const {code} = await this.submitComment({
            postId: this.postId,
            body: this.message,
            userId: this.user.id,
            replyUserId: this.replayConfig.userId,
            commentId: this.replayConfig.commentId,
          });
          hideLoading();
          showHandleStatusByFlag(code);
          if (code) {
            this.showCommentMask = false;
            // this.initPostDetail();
            this.$emit('comment', true)
          } else {
            this.$emit('comment', false)
          }
        }
        this.showCommentMask = false;
      },
      canShow(key) {

        if (!this.limit) {
          return true
        } else {
          return key < 2
        }
      }
    }
  }

</script>
