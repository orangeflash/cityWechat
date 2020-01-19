<template>
  <div class="dd-tips flex pad-30">
    <div class="dd-right mar-r flex-center">
      <i class="iconfont icon-jinggao  col-t"></i>
    </div>
    <div class="dd-right col-t">{{tips}}</div>
  </div>

</template>

<script>

  export default {
    props: ['tips']
  }

</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-tips {
    background: #F8FAFF;
    .dd-right{
      line-height: 0.36rem
    }
  }

</style>
