<template>
  <div class="dd-column-steps">
    <ul class="dd-column-steps_list" v-for="(item,index) in list" :key="index" @click="$emit('click',item)">
      <i class="dd-column-steps_icon iconfont icon-multiple_choice"></i>
      <li class="dd-column-steps_step">
        <div class="name">
          <span class="name-l">{{`${formatDateByTimeStamp(item.startTime,'YYYY.MM')}-${formatDateByTimeStamp(item.endTime,'YYYY.MM')}`}}</span>
          <span v-if="isEdit" class="name-r">修改</span>
        </div>
        <dd-layout-div class="flex flex-bt fon-lg">
          <dd-layout-div color="#444" class="hide-e fon-wb" :pad="[5,0,0]">{{item.name}}</dd-layout-div>
          <span class="col-9 flex-g-0 mar-l">{{item.jobName}}</span>
        </dd-layout-div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    props:['list','isEdit'],
    data(){
      return{
      }
    },
    mixins: [utilMixins],
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-column-steps{
     &_list{
       position: relative;
       padding: 0 0 10px;
       border-left: 1.1px solid #EEEEEE;
       .iconfont{
         color: $themeColor;
         font-size: 30px;
       }
     }
    &_step{
      font-size: $font-size-base;
      color: #666;
      margin: 0 0 0 30px;
      .name,.desc{
        @include flex-between;
        margin-bottom: 30px;
        line-height: 45px;
      }
      .name-r{
        color: #ff4444;
      }
      .desc-l{
        font-size: $font-size-lg;
        color: #333;
      }
      .desc-r{
        text-align: right;
      }
    }
    &_icon{
      position: absolute;
      left:-15px;
      top: 0px;
    }
  }

</style>
