<template>
  <!--这个是用在加载更多数据的页面底部-->

  <div class="dd-more">
    <div class="dd-more__details">
      <van-loading color="#999" style="margin-right: 10px" size="20px" type="spinner" v-if="status" />
      <i class="iconfont icon-meiyoudingdan-01" v-else></i>
      <span class="dd-more__details__txt">{{status?'加载更多':'暂无更多信息'}}</span>
    </div>
  </div>

</template>

<script>

  export default {
    props:['status']
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
    .dd-more{
      font-size: $font-size-sm;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      &__details{
        @include flex-center;
        i{
          color: #999;

        }
        span{
          color: #999;
          margin-left: 20px;
        }
      }
    }
</style>

