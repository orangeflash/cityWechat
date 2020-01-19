<template>
  <div class="order-record">
    <div>
      <div class="order-record__left">
        <h4>{{data.name}}</h4>
      </div>
      <div class="order-record__right">
        <div class="order-integral">-{{data.score}}
          <!--<em>积分</em>-->
          <!--<span v-if="+data.money>0"><em>+</em>{{data.money}}<em>元</em></span>-->
        </div>
      </div>
    </div>
    <p class="order-num">订单号：{{data.outTradeNo}}<span class="order-create-time">{{formDataTime}}</span></p>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  export default {
    props: ["data"],
    data() {
      return {}
    },
    computed: {
      formDataTime() {
        return dayjs(this.data.createdAt).format('YYYY-MM-DD HH:mm');
      }
    }

  }

</script>

<style scoped lang="scss">
  @import '../../assets/common.scss';

  .order-record {
    background: #fff;
    border-bottom: 1.1px solid #ddd;
    padding: 30px;
    overflow: hidden;
    div{
      overflow: hidden;
    }
    p{
      overflow: hidden;
      span {
        color: #999;
        float: right;
      }
    }
    &__left {
      float: left;
      width: 500px;

      h4 {
        font-size: 30px;
        overflow: hidden;
        margin-bottom: 30px;
        line-height: 40px;
      }
    }

    &__right {
      text-align: right;
      margin-left: 500px;

      div {
        font-size: 40px;
        height: 30px;
        margin-bottom: 30px;
        color: #999;

        em {
          font-size: 24px;
        }


      }

      span {
        color: #999;
      }
    }
  }
</style>
