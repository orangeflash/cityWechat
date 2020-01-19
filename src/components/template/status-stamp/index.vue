<template>
  <div class="dd-status-seal" :style="{top:top}">
    <template v-if="ptype">
      <img :src="ysdqr" v-if="data.rewardState == 1">
      <img :src="yscg" v-else-if="data.rewardState == 2||data.rewardState == 3">
      <img :src="yssb" v-else-if="data.rewardState == 4">
    </template>
    <template v-else>
      <img :src="examine" v-if="+data.status == 0">
      <!-- 已拒绝的可以进行编辑 -->
      <img :src="refuse" v-else-if="+data.status == 2">
      <img :src="lowerShelf" v-else-if="+data.display == 2">
      <img :src="zdtop" v-else-if="+data.isTop == 1">
    </template>
    <!--底下这个是测试样式的-->
    <!--<img :src="top" v-else>-->
  </div>
</template>

<script>
  import examine from "@/assets/status/examine.png"   //待审核
  import refuse from "@/assets/status/refuse.png"  //已拒绝
  import zdtop from '@/assets/img/auxiliary/free-ride/top.png';   //置顶
  import ysdqr from '@/assets/status/dqr.png';
  import yscg from '@/assets/status/yscg.png';
  import yssb from '@/assets/status/yssb.png';
  import lowerShelf from '@/assets/img/auxiliary/free-ride/lower-shelf.png';

  export default {
    props: ['data', 'ptype', 'top'],
    data() {
      return {
        examine,
        refuse,
        lowerShelf,
        zdtop,
        ysdqr,
        yscg,
        yssb,
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-status-seal {
    width: 168px;
    height: 136px;
    margin-top: -20px;
    position: absolute;
    z-index: 0;
    top: 30px;
    right: 150px;
    opacity: 0.7;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
