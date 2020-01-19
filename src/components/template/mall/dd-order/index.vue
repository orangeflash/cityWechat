<template>
  <div class="dd-order">
    <div class="dd-order_up">
      <div class="dd-order_up_l">
        <div class="dd-order_up_l_face"
             @click.stop="$emit('face')"
        >
          <img-wrapper
            :src="data.storeLogo&&data.storeLogo.length&&getSingleImg(data.storeLogo[0].url)"
          ></img-wrapper>
        </div>
        <div class="dd-order_up_l_name">
          {{data.storeName}}
          <i class="iconfont"></i>
        </div>
      </div>
      <div class="dd-order_status">{{data.tips}}</div>
    </div>
    <div class="dd-order_center">
      <div class="dd-order_center_i"
           @click="goPage(+data.status==5,{orderId:data.orderId,type:'mall',tips:data.tips})"
           v-for="(goods,key) in data.goods"
           :key="key"
      >
        <div class="dd-order_center_cover">
          <img-wrapper :src="goods.img"></img-wrapper>
        </div>
        <div class="dd-order_center_info">
          <div class="dd-order_center_info_title">{{goods.name}}</div>
          <span v-if="data.data">{{goods.data}}</span>
        </div>
        <div class="dd-order_center_r">
          <span class="price">{{goods.money}}</span>
          <span class="number">{{goods.num}}</span>
        </div>
      </div>
      <div class="dd-order_center_res">
        共 <em>{{data.num}}</em> 件商品 合计 <span>￥{{(+data.totalMoney).toFixed(2)}}</span>(含运费<em>{{(+data.freight).toFixed(2)}}</em>)
      </div>
    </div>
    <div class="dd-order_down"
         v-if="canShowBtn(+data.status)"
    >
      <div v-if="+data.status == 0">
        <button class="cancel-order" @click.stop="$emit('click',{field:'cancel',data:{orderId:data.orderId}})">取消订单
        </button>
        <button class="go-pay"
                @click.stop="$emit('click',{field:'goPay',data:{orderId:data.orderId,money:data.totalMoney}})">去支付
        </button>
      </div>
      <div v-else-if="+data.status == 9">
        <button v-if="config.refund=='yes'" class="cancel-order"
                @click.stop="$emit('click',{field:'refund',data:{orderId:data.orderId}})">申请退款
        </button>
        <button v-if="config.commentOrder=='yes'" class="cancel-order"
                @click.stop="$emit('click',{field:'comment',data:data})">去评价
        </button>
        <button class="go-pay" @click.stop="$emit('click',{field:'del',data:{orderId:data.orderId}})">删除订单</button>
      </div>
      <div v-else-if="+data.status == 1 ">
        <button class="cancel-order" @click.stop="$emit('click',{field:'refund',data:{orderId:data.orderId}})">申请退款
        </button>
      </div>
      <div v-else-if="+data.status == 2 ">
        <button class="go-pay" @click.stop="$emit('click',{field:'comfrim',data:{orderId:data.orderId}})">确认收货</button>
      </div>
      <div v-else>
        <button class="go-pay" @click.stop="$emit('click',{field:'del',data:{orderId:data.orderId}})">删除订单</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import {utilMixins} from "@/plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    props: ['data'],
    methods: {
      canShowBtn(status) {
        if (status == 0 || status == 1 || status == 2 || status >= 3) {
          return true;
        } else {
          return false;
        }
      },
      goPage(isRefund, query) {
        const path = isRefund ? '/auxiliary/mall/refundDetails' : '/personal/integralMall/writeOff'
        this.goPointPage({
          path,
          query,
        })

      }
    },
    computed: {
      ...mapState("mall", {
        config: state => state.config,
      }),
      getTotalMoney() {

        let money = 0;
        this.data.goods.forEach(item => {
          money += item.num * item.money
        })

        return (money + (+this.data.freight)).toFixed(2);
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../../assets/theme";

  .dd-order {
    background: #fff;
    margin-bottom: 20px;

    &_up {
      height: 95px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;

      &_l {
        display: flex;
        align-items: center;

        &_face {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #f4f4f4;
          margin-right: 20px;
          overflow: hidden;
        }
      }
    }

    &_center {
      &_i {
        background: #f4f4f4;
        display: flex;
        padding: 20px 30px;
      }

      &_info {
        width: 340px;

        &_title {
          height: 68px;
          line-height: 38px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        > span {
          color: #999;
        }
      }

      &_cover {
        width: 120px;
        height: 120px;
        border-radius: 10px;
        overflow: hidden;
        margin-right: 30px;
      }

      &_r {
        width: calc(100% - 340px - 120px - 30px);
        text-align: right;

        .price {
          font-size: 30px;
        }

        .price:before {
          content: '￥ ';
          font-size: 20px;
        }

        .number:before {
          content: 'x ';
          font-size: 20px;
        }

        .number {
          font-size: 24px;
          color: #999;
        }

        span {
          display: block;
          margin-bottom: 20px;
        }
      }

      &_res {
        height: 88px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        text-align: right;
        padding: 0 30px;

        em, span {
          color: $themeColor;
        }

        span {
          font-size: 28px;
        }
      }
    }

    &_down {
      padding: 30px;
      display: flex;
      justify-content: flex-end;
      border-top: 1.1px solid #ddd;

      .go-pay {
        background: #E50101;
        color: #fff;
        border-color: #E50101;
      }

      .cancel-order {
        background: #fff;
        border-color: #ddd;
      }

      button {
        padding: 15px 20px;
        font-size: 26px;
        margin-left: 30px;
        border-radius: 10px;
        border: 1.1px solid;
      }
    }

    &_status {
      color: #FF0000;
    }
  }
</style>
