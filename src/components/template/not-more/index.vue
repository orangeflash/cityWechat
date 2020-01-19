<template>
  <div class="not-more">{{hasMore?hasTisp||'加载更多':notTips||'没有更多了'}}</div>
</template>

<script>

  export default {
    props:['hasMore','hasTisp','notTips']
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";
  .not-more{
    padding: 0.3rem;
    text-align: center;
    font-size: 0.28rem;
    color: #2d2d2d;
  }
</style>
