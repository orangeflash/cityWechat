<template>
  <!-- 活动评论-->

  <div class="activity-comment">
    <Header/>
    <dd-form-textarea class="pad-30 fon-b mar-b-100 bg-f" v-model="params.body" height="300"
                      placeholder="说点什么吧......"/>

    <dd-button
      class="mar-30"
      name="提交"
      type="release"
      @click="beginReleaseComment"
    />
  </div>
</template>

<script>
  import DdFormTextarea from "@/components/template/dd-form/textarea"
  import DdButton from "@/components/template/button"

  import {Toast} from 'vant';

  import {mapActions, mapState} from 'vuex';
  import {showLoading} from "../../../util";

  export default {
    components: {DdFormTextarea, DdButton},
    data() {
      return {
        params: {
          body: '',
          activityId: null,
          commentId: null,
          replyUserId: null,
        }
      }
    },
    methods: {
      ...mapActions('activity', ["commentActivity"]),
      judge() {


        return this.params.body && this.params.body.trim() != '';
      },
      async beginReleaseComment() {

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
            this.$router.go(-1);
          }, 1500)
        } else {
          Toast.fail({
            message: res.msg,
            duration: 1500
          })
        }
      }
    },
    computed: {
      userInfo: s => s.user
    },
    created() {
      const query = this.$route.query;
      let fields = [query.activityId, query.enrollId];
      if (query.isReply) {
        fields.splice(1, 1);
        fields.push(query.commentId);
        this.params.replyUserId = this.userInfo.id;
      }
      this.isFailParams({
        field: fields,
        tips: ["缺少活动Id", "缺少报名Id", "缺少评论Id"],
        success() {
          this.params.commentId = query.commentId;
          this.params.enrollId = query.enrollId;
          this.params.activityId = query.activityId;
        }
      })

    }

  }


</script>
