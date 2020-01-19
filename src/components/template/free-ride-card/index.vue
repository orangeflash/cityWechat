<template>
  <!--顺风车的卡片-->
  <div class="dd-free-ride" @click="goPointPage({path:'/auxiliary/freeRide/details',query:{id:freeRide.id}})">
    <!--<div class="dd-free-ride__top">-->
    <!--<div class="dd-free-ride__top__time">-->
    <!--<i class="iconfont icon-Group-"></i>-->
    <!--<span>出发时间：今天10:50</span>-->
    <!--</div>-->
    <!--<span class="dd-free-ride__top__label">人找车</span>-->
    <!--</div>-->
    <Top :time="getTime" v-bind="updateLabel"
         :over="+freeRide.isGo==1"></Top>
    <div class="dd-free-ride__center">

      <div class="dd-free-ride__center__top">
        <div class="dd-free-ride__center__top__info">
          <StartEnd :start="freeRide.startPlace" :end="freeRide.endPlace" :over="+freeRide.isGo==1"></StartEnd>
        </div>
        <StatusStamp :data="freeRide"></StatusStamp>
        <!--<div class="dd-free-ride__center__top__status">-->
          <!--<div class="dd-free-ride__center__top_status_icon">-->
            <!--<img v-if="+freeRide.isTop==1" :src="top">-->
            <!--<img v-if="+freeRide.isGo==1" :src="end">-->
          <!--</div>-->
        <!--</div>-->
      </div>
      <div class="dd-free-ride__center_other fon-xs">
        <div>
          <i class="iconfont icon-ren3"></i>乘车人数：<em :class="+freeRide.isGo==1&&'over'">{{freeRide.num}}人</em>
        </div>
        <span>{{computedDate(freeRide.createdAt)}} 发布</span>
      </div>
      <div class="dd-free-ride__center__label">
        <Labels :labels="getLabels" :over="+freeRide.isGo==1"></Labels>
      </div>
    </div>
    <div class="dd-free-ride__bottom fon-xs" :class="+freeRide.isGo==1&&'over'">
      备注：{{freeRide.other}}
    </div>
  </div>
</template>

<script>

  import StartEnd from '../start-end'
  import Top from './top'
  import top from '@/assets/img/auxiliary/free-ride/top.png';
  import end from '@/assets/img/auxiliary/free-ride/end.png';
  import {utilMixins, computedDate} from "@/plugins/util-mixins";
  import Labels from '@/components/template/labels'
  import {getAuxiliaryConfigColor} from '@/plugins/auxiliary/auxiliary-config'
  import StatusStamp from "@/components/template/status-stamp";
  export default {
    components: {StartEnd, Top, Labels,StatusStamp},
    props: ['freeRide'],
    data() {
      return {
        top,
        end,
        time:'',
        labelsConfig: {
          labels: [
            {
              name: this.freeRide.name,
              color: '#20D4D0',
            }
          ],
          fontSize: 15,
          back: true,
          maxLength: 2,
        },
      }
    },
    mixins: [utilMixins],
    computed: {
      getTime() {
          if(this.freeRide){
            if (+this.freeRide.type == 2) {
              this.time = this.freeRide.rideTime +'(每日)'
            } else {
              this.time = this.freeRide.rideTime.split('-').splice(1,2).join('-');
            }
          }
          return this.time
      },
      getLabels() {
        const labels = this.freeRide.data, len = this.freeRide.data.length;
        let arr = [];
        for (let i = 0; i < len; i++) {
          arr.push({
            name: labels[i],
            color:getAuxiliaryConfigColor(labels[i])
          })
        }
        return arr
      },
      updateLabel() {

        let labels = [];

        (+this.freeRide.type == 2) && labels.push({
          name: '长期',
          color: getAuxiliaryConfigColor('长期')
        })
        labels.push({
          name: this.freeRide.name,
          color: getAuxiliaryConfigColor(this.freeRide.name)
        })

        return {
          labels,
          fontSize: 15,
          back: true,
          maxLength: 2,
        }
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-free-ride {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 20px;


    &__center {
      padding: 30px 20px;
      border-bottom: 1.1px solid #eee;
      position: relative;
      z-index: 0;
      &__top {
        display: flex;
        justify-content: space-between;

        &__status {
          width: 168px;
          height: 136px;
          overflow: hidden;
          margin-top: -20px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      &_other {
        display: flex;
        justify-content: space-between;
        color: #999;
        align-items: center;

        div {
          display: flex;
          align-items: center;

          i {
            margin-right: 10px;
            font-size: 42px;
          }

          em {
            color: $themeColor;
            margin-left: 10px;
          }
        }
      }

      &__label {
        margin-top: 30px;

        em {
          $color-list: (#FFA029, #7594B6, #648EFC);
          padding: 6px;
          border-radius: 6px;
          margin-right: 12px;
          @for $i from 1 through length($color-list) {
            &:nth-child(3n+#{$i}) {
              color: nth($color-list, $i);
              border: 1PX solid nth($color-list, $i);
            }
          }
        }

      }
    }

    &__bottom {
      padding: 24px 30px 32px;
      color: #FF6F20;
    }

    .over {
      color: #bbb !important;
    }
  }

</style>
