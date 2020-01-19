<template>
  <div class="exchange" v-if="itemData">
    <div class="left">
      <em class="detail">{{itemData.note}}</em>
      <em class="time">{{formDataTime}}</em>
    </div>
    <div class="right">
      <em class="goldNum obtain" v-if="+itemData.type == 1">+{{itemData.integral}}</em>
      <em class="goldNum consumption" v-else>-{{Math.abs(itemData.integral)}}</em>
    </div>
  </div>
  <!--<div class="no-data">-->
  <!--<img width="211" height="137" style="width: 211px;height: 137px" not-load="true" :src="noData" />-->
  <!--<em>暂无任何记录</em>-->
  <!--</div>-->
  <not-data v-else></not-data>
</template>

<script>
  import dayjs from 'dayjs'
  import noData from '../../assets/img/personal/my_publication_placeholder.jpg'

  export default {
    props: ['itemData'],
    name: "exchange",
    data() {
      return {
        noData,
      }
    },
    methods: {},
    created() {
    },
    computed: {
      createdTypes() {
        switch (+this.itemData.source) {
          case 1:
            return "充值奖励"
          case 2:
            return "任务奖励"
          default:
            return "每日签到奖励"
        }
      },
      formDataTime() {
        return dayjs(this.itemData.createdAt*1000).format('YYYY-MM-DD HH:mm');
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/theme";

  .exchange {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
    background-color: #fff;
    border-bottom: 1PX solid #eee;

    .goldNum {
      font-size: 40px;
      font-family: PingFang-SC-Medium;
      font-weight: bold;
    }

    .obtain {
      color: rgba(248, 73, 48, 1);
    }

    .consumption {
      color: rgba(153, 153, 153, 1);
    }

    .left {
      display: flex;
      flex-direction: column;
      line-height: 40px;

      .detail {
        font-size: $font-size-lg;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
      line-height: 40px;
    }

    .time {
      font-size: $font-size-xs;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
    }

    .order-num {
      font-size: $font-size-base;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
  }

  .no-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #ccc;
    font-size: 30px;
  }
</style>
