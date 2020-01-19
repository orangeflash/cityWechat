<template>
  <!--统计-->
  <div class="dd-count">
    <div class="dd-count__icon">
      <i class="iconfont icon-gonggao"></i>
    </div>
    <div class="dd-count__other" v-if="more" @click.stop="$emit('click')">{{more}}</div>
    <div class="dd-count__info">
      <span v-if="browse||browse==0">浏览：<em>{{browse||0}}</em></span>
      <span v-if="enter||enter==0">入驻：<em>{{enter||0}}</em></span>
      <span v-if="release|| release==0">发布：<em>{{release||0}}</em></span>
      <span v-if="share||share==0">分享：<em>{{share||0}}</em></span>
    </div>
  </div>
</template>

<script>

  export default {
    props: ["browse", "enter", "share", 'more', 'release'],
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-count {
    overflow: hidden;
    padding: 30px 30px 24px;
    height: 26px;
    overflow: hidden;
    background: #fff;

    &__icon {
      float: left;
      margin-right: 20px;
      i {
        color: $themeColor;
      }
    }

    &__other {
      float: right;
      color: #999;
      font-size: 28px;
    }

    &__info {
      span {
        font-size: 28px;
        margin-right: 10px;

        em {
          color: $themeColor;
        }
      }
    }
  }


</style>
