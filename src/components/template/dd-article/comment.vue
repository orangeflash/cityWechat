<template>

  <div class="dd-article-comment flex pad-30 br-b-d">
    <div class="user-face mar-r">
      <face
        :src="data.src"
        size="36"
      />
    </div>
    <div class="dd-article-comment_info">
      <div class="up">
        <span class="nickname fon-lg">{{data.nickname}}：</span>
        <p class="time col-9">{{data.time}}</p>
      </div>
      <div class="center fon-sm mar-b-20">{{data.comment}}</div>
      <div class="down flex-bt col-9">
        <div v-if="data.replySize&&data.replySize>0" class="fon-b" @click.stop="$emit('lookReply',data)">查看所有回复({{data.replySize}})</div>
        <div v-else></div>
        <div v-if="canReply" @click.stop="$emit('reply',data)">
          <i class="iconfont icon-pinglun"></i>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import Face from '@/components/template/face'

  export default {
    props: ['data', 'canReply'],
    components: {Face},
  }

</script>

<style lang="scss">
  @import "../../../assets/theme";

  .dd-article-comment {
    background: #fff;

    &_info {
      width: 100%;
      padding-top: 10px;

      .time {
        margin: 15px 0;
      }

      .center {
        line-height: 40px;
      }
    }
  }
</style>
