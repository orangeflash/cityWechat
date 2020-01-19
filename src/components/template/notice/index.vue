<template>
  <!--公告-->
  <div class="dd-notice">
    <span class="dd-notice__title">{{title|| '公告'}}</span>
    <van-swipe class="dd-notice__seamless" :autoplay="3000" :show-indicators="false" vertical>
      <van-swipe-item style="width: 100%;"v-for="(item,key) in contents || 1" :key="key" >
        <h1 class="notice-title" @click="goPointPage({name:'Announcement',params:{list:contents,index:key}})" >{{item.title||'暂无信息'}}</h1>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
  export default {
    props:['title','contents',''],
    methods:{
      test(){

      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-notice{
    overflow: hidden;
    margin: 16px 0px;
    border-radius: 34px;
    background: #fff;
    padding: 20px 0;
    &__title{
      float: left;
      padding: 0 30px;
      color: $themeColor;
      font-size: 30px;
      border-right: 1.1px solid #f4f4f4;
    }
    &__seamless{
      width: 400px;
      position: relative;
      height: 34px;
      padding:0px 20px;
      line-height: 34px;
      overflow: hidden;
      .notice-title {
        font-size: 28px;
        color: #767676;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        line-height: 34px;
      }
    }
    &__content{
      padding: 0 26px;
      height: 36px;
      overflow: hidden;
      line-height: 36px;
    }
  }


</style>
