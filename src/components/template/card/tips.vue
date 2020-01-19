<template>

  <div class="dd-card-tips flex">
    <div class="dd-card-tips_icon">
      <i class="iconfont icon-Creditcards"></i>
    </div>
    <div class="dd-card-tips_info">
      <div>您还没有自己的名片</div>
      <p @click="goPointPage({path:'/auxiliary/card/createCard'})">立即拥有>>></p>
    </div>
  </div>

</template>


<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-card-tips {
    background: rgba(255, 246, 238, 1);
    border: 1.1px solid rgba(246, 121, 87, 1);
    border-radius:8px;
    height: 180px;
    overflow: hidden;
    margin: 20px;
    &_icon{
      display: flex;
      align-items: center;
      margin-left: -30px;
      i{
        font-size: 120px;
        color: #F67957;
        height: 100px;
      }
    }
    &_info{
      text-align: center;
      color: #F67957;
      width: calc(100% - 180px);
      div{
        font-size: 36px;
        margin: 40px;
      }
      p{
        text-align: right;
      }
    }
  }
</style>
