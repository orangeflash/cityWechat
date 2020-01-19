<template>
  <!--文章封面模版 - 第二种类型-->
  <div
    @click="$emit('click',data)"
    class="dd-article mar-30 mar-b-20">
    <div class="dd-article_cover bg-f9">
      <img-wrapper
        :src="data.cover"
      ></img-wrapper>
      <div class="mask">
        <slot name="mask"></slot>
      </div>
    </div>
    <div class="pad-lr pad-b">
      <div class="dd-article_info fon-sm" v-if="data.info">{{data.info}}</div>
      <div class="dd-article_attr flex-bt flex-y-center">
        <div class="left col-9">
          <span class="time mar-r" v-if="data.time">{{data.time}}</span>
          <span class="tag" v-if="data.tag">{{data.tag}}</span>
        </div>
        <div class="right">
          <span class="price col-t fon-xxl" v-if="data.money">￥{{data.money}}</span>
          <span class="price col-9 fon-xs" v-if="data.price">￥{{data.price}}</span>
        </div>
      </div>
    </div>

    <slot name="content" />
  </div>
</template>

<script>

  export default {
    props: ['data'],
  }


</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-article {
    background: #fff;

    &_cover {
      height: 310px;
      overflow: hidden;
      border-radius: 8px;
      position: relative;
      z-index: 1;

      .mask {
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }

    &_info {
      line-height: 34px;
      margin: 20px 0;
      max-height: 65px;
      overflow: hidden;
    }
  }
</style>
