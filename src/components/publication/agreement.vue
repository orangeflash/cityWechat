<template>
  <!--协议-->
  <div id="agreement">
    <div class="pactBody" v-html="con"></div>
      <div class="cancel" @click="$emit('hide')">
        <span class="cancel-text">
          我已阅读并同意此协议
        </span>
      </div>
  </div>
</template>

<script>
  export default {
    props:['con'],
    data(){
      return{
      }
    }
  }
</script>


<style scoped lang="scss">
  @import "../../assets/theme";
  #agreement{
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: auto;
    top: 0;
    left: 0;
    z-index: 999999;
    background-color: #fff;
    .pactBody {
      overflow-x: hidden;
      overflow-y: scroll;
      padding: 30px 30px 150px;
      font-size: 28px;
      @include widhei;
      box-sizing: border-box;
    }
    .cancel {
      width: 100%;
      height: 120px;
      text-align: center;
      color: #fff;
      position: fixed;
      z-index: 999;
      bottom: 0;
      background-color: #fff;
      border-top: 1.1px solid #f5f5f5;
      .cancel-text {
        display: inline-block;
        text-align: center;
        height: 60px;
        line-height: 60px;
        padding: 5px 0px;
        width: 80%;
        font-size: 28px;
        background-color: $themeColor;
        border-radius: 10px;
        position: absolute;
        left: 50%;
        bottom: 50%;
        transform: translate(-50%, 50%);
      }
    }
  }

</style>
