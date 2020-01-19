<template>
  <div class="dd-card-one" @click="$emit('click')">
    <div class="dd-card-one_txt">
      <h4>{{name}}</h4>
      <p>{{address}}</p>
    </div>
    <div class="dd-card-one_right">
      <i class="iconfont icon-dizhi2"></i>
    </div>
  </div>
</template>

<script>

  export default {
    props:['name','address']
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";
  .dd-card-one{
    display: flex;
    background: #fff;
    justify-content: space-between;
    align-items: center;
    &_txt{
      h4{
        font-size: 30px;
        margin-bottom: 16px;
        line-height: 42px;
      }
      p{
        color: #666;
        line-height: 32px;
      }
    }
    &_right{
      display: flex;
      align-items: center;
      i{
        font-size: 58px;
        color: #999;
        height: 48px;
      }
    }
  }
</style>
