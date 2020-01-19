<template>

  <ul class="dd-article-attr-info">

    <li @click="$emit('choice','look')" v-if="look || +look==0"><i class="iconfont icon-yanjing3 look"></i><em>{{look||0}}</em></li>
    <li @click="$emit('choice','lover')" v-if="lover"><i class="iconfont icon-like-b" :class="lover.status&&'active'"></i><em>{{lover.num||0}}</em></li>
    <li @click="$emit('choice','comment')" v-if="comment || +comment==0"><i class="iconfont icon-pinglun comment"></i><em>{{comment||0}}</em></li>
    <li @click="$emit('choice','share')" v-if="share || +share==0"><i class="iconfont icon-fenxiang-tianchong share"></i><em>{{share || 0}}</em></li>
  </ul>
</template>
<script>
  export default {
    props: ['lover', 'comment', 'share','look']
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-article-attr-info {
    display: flex;
    align-items: center;

    li {
      display: flex;
      align-items: center;
      margin-right: 40px;

      i {
        height: 32px;
        font-size: 28px;
        color: #CDCDCD;
      }

      .comment {
        margin-top: 6px;
      }

      .share {
        margin-top: 3px;
      }
      .look{
        font-size: 38px;
      }
      .active{
        color: $themeColor;
      }
      em {
        font-size: 24px;
        margin-left: 10px;
        color: #999;
      }
    }
  }


</style>
