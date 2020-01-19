<template>
  <!--查询搜索-->
  <div class="dd-query">
    <span class="dd-query__txt" @click="$emit('query')">搜索</span>
    <div class="dd-query__info">
      <div v-if="isInput" class="dd-query__info__input">
        <input type="text" v-model="frist" @input="$emit('onInput',frist,0)" :placeholder="(placeholder&&placeholder[0])||'出发地'"/>
      </div>
      <span v-else>出发地</span>
      <i class="iconfont icon-jiaohuan"></i>
      <div v-if="isInput" class="dd-query__info__input" >
        <input type="text" v-model="second" @input="$emit('onInput',second,1)" :placeholder="(placeholder&&placeholder[1])||'目的地'"/>
      </div>
      <span v-else>目的地</span>

    </div>

  </div>

</template>

<script>

  export default {
    props: ["isInput", "placeholder"],
    data(){
      return{
        frist:'',
        second:''
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-query {
    border: 1.1px solid #999;
    border-radius: 34px;
    padding: 20px 0;
    overflow: hidden;
    margin: 0 26px;
    height: 40px;
    line-height: 40px;
    &__txt {
      float: right;
      padding: 0 26px;
      color: $themeColor;
      border-left: 4px solid $themeColor;
      font-size: 30px;
    }

    &__info {
      display: flex;
      justify-content: space-between;
      padding: 0 44px;
      position: relative;
      z-index: 0;

      span {
        color: #666;
        font-size: 30px;
      }
      &__input{
        overflow: hidden;
        width: 30%;
        input{
          max-width: 100%;
          border: none;
          outline: none;
          text-align: center;
          font-size: 30px;
          height: 40px;
          margin-top: -5px;
        }
      }
      i {
        color: #999;
        font-size: 48px;
        left: 50%;
        margin-left: -24px;
        position: absolute;
        z-index: 0;
      }
    }
  }
</style>
