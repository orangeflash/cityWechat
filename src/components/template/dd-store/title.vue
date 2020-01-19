<template>

  <div class="dd-store-title br-b-d pad-30"
       :style="{'background':bag || '#fff'}"
  >
    <div class="dd-store-title_up flex-bt mar-b-10">
      <div class="dd-store-title_up_left">
        <span class="price col-t fon-40 dd-price mar-r">{{price}}</span>
        <em class="old-price col-9 dd-price" v-if="oldPrice">{{oldPrice}}</em>
      </div>
      <div class="operation"
           v-if="isCollection"
           @click.stop="$emit('collection')"
           :class="{'col-t':isCollection.state}"
      >
        <i class="iconfont icon-collection"
           :class="{'icon-collection-b':isCollection.state}"
        ></i>
        <span>收藏</span>
      </div>
    </div>
    <div class="dd-store-title_center fon-b">{{title}}</div>
    <div class="dd-store-title_down"></div>
  </div>

</template>

<script>

  export default {
    props: ['title', 'price', 'oldPrice', 'bag', 'isCollection']
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-store-title {
    &_center {
      line-height: 38px;
    }
  }

</style>
