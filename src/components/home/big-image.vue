<template>
  <!--大图展示-->
  <div id="bigImage">
    <div class="big-img-box" v-for="(item,i) in pictureList" :class="{spacing:i < pictureList.length-1 && padding }" :key="i" :style="{height:`${height}px`,padding:`${upDownPadding}px ${leftRightPadding}px`}">
      <img-wrapper
        @click.native="goPointPage({path:getEntryPath(item.entry)})"
        not-load="true":style="{borderRadius:`${radius}px`}" :src="item.url"></img-wrapper>
    </div>
  </div>
</template>

<script>
  export default {
    name: "BigImage",
    props: ["pictureList","height","radius","upDownPadding","leftRightPadding","padding"],
    data(){
      return{

      }
    },
  }

</script>

<style scoped lang="scss">
  @import "../../assets/common";
  #bigImage{
    .big-img-box{
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .spacing{
      margin-bottom:20px;
    }
  }

</style>
