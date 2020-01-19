<template>

  <div class="dd-goods-info" v-if="item">
    <div class="dd-goods-info_cover">
      <img-wrapper :src="item.goodsCover"></img-wrapper>
    </div>
    <div class="dd-goods-info_text">
      <h3 class="dd-goods-info_text_title">{{item.name}}</h3>
      <p class="dd-goods-info_text_spec">{{item.data}}</p>
    </div>
  </div>

</template>

<script>

  export default {
    props: ['item']
  }

</script>


<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-goods-info {
    display: flex;
    margin-bottom: 30px;

    &_cover {
      width: 80px;
      height: 80px;
      overflow: hidden;
      margin-right: 30px;
      border-radius: 10px;
    }

    &_text {
      width: calc(100% - 110px);
      text-align: left;

      h3 {
        height: 40px;
        overflow: hidden;
        line-height: 0.4rem;
      }

      > p {
        background: #eee;
        color: #999;
        display: inline-block;
        padding: 8px 10px 4px;
        border-radius: 4px;
        margin-top: 5px;
      }
    }

  }
</style>
