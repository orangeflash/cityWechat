<template>
  <div class="region">
    <div class="regionalv">
      <div class="regions">{{title}}</div>
      <div class="count" v-if="right">总代理数: <span class="theme ">{{zone[0]}}</span></div>
    </div>
    <div class="regionbox">
      <div class="regioninfos" v-for="(item,i) in zone[1]" :key="i"  @click.stop="noLink?'':goPointPage({path:'/agentIndex/cityAgent/cityBonus',query:{areaId:item.zoneId,areaName:item.cityName}})">
        <p class="regionnum">{{item.money}}</p>
        <p class="regcity">{{item.cityName||item.note}} <i v-if="!noLink" class="iconfont icon-youjiantou2"></i></p>
      </div>
      <div v-if="zone[1]&&zone[1].length==0" class="col-9">暂无数据</div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "regionbox",
        props:['zone','title','right','noLink'],

    }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .theme {
    color:$themeColor
  }
  .regionalv {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    .regions {
      font-size: 28px;
      margin-bottom: 32px;
    }
    .count {
      font-size: 26px;
      color: #999;
    }
  }
  .regionbox {
    display: flex;
    flex-wrap: wrap;
    border-radius: 20px;
    box-shadow: 5px 5px 5px #DDDDDD;
    padding: 30px 40px;
    .regioninfos {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: 50px;
      width: 33.33%;
      margin: 20px 0px;
      .icon-youjiantou2 {
        font-size: 26px;
      }
      .regionnum {
        word-break:break-all;
        text-overflow: revert;
        font-size: 36px;
        color: #333333;
      }
      .regcity {
        font-size: 26px;
        color: #999999;
      }
    }
  }
</style>
