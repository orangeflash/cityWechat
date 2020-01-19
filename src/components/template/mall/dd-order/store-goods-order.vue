<template>
  <div class="dd-order"  @click="goPointPage({path:'/storeAuxiliary/storeGood/storeOrderDetail',query:{orderId:data.orderId,type:'mall',tips:data.tips}})">
    <div class="dd-order_up">
      <div class="dd-order_up_l">
        订单号:{{data.outTradeNo}}
      </div>
      <div class="dd-order_status">{{data.tips}}</div>
    </div>
    <div class="dd-order_center">
      <div v-for="(goodItem,goodIndex) in data.goods" :key="goodIndex" class="dd-order_center_i">
        <div class="dd-order_center_cover">
          <img-wrapper :src="goodItem.img||PlaceholderAvatar"></img-wrapper>
        </div>
        <div class="dd-order_center_info">
          <div class="dd-order_center_info_title">{{goodItem.name}}</div>
          <span v-if="goodItem.data">{{goodItem.data}}</span>
        </div>
        <div class="dd-order_center_r">
          <span class="price">{{goodItem.money}}</span>
          <span class="number">{{goodItem.num}}</span>
        </div>
      </div>
      <div class="dd-order_center_res">
        <div class="dd-order_up_l">
          <div class="dd-order_up_l_face"
               @click.stop="$emit('face')"
          >
            <img-wrapper
              :src="data.portrait||PlaceholderAvatar"
            ></img-wrapper>
          </div>
          <div class="dd-order_up_l_name">
            {{data.userName}}
            <i class="iconfont"></i>
          </div>
        </div>
        <div>共 <em>{{data.num}}</em> 件商品 合计 <span>￥{{(+data.totalMoney).toFixed(2)}}</span>(含运费<em>{{(+data.freight).toFixed(2)}}</em>)</div>
      </div>
    </div>
    <div class="dd-order_down"
         v-if="canShowBtn(+data.status)"
    >
      <div class="xd-time">下单时间：{{data.createdAt}}</div>
      <div v-if="+data.status == 0">
        <button class="cancel-order" @click.stop="$emit('click',{field:'cancel',data:{orderId:data.orderId}})">关闭订单
        </button>
        <!--<button class="go-pay"-->
                <!--@click.stop="$emit('click',{field:'goPay',data:{orderId:data.id,money:data.totalPrice}})">去支付-->
        <!--</button>-->
      </div>
      <div v-if="+data.status == 1">
        <button class="go-pay">立即发货</button>
      </div>
      <div v-else-if="+data.status == 5">
        <button class="cancel-order" @click.stop="$emit('click',{field:'refund',data:{orderId:data.orderId}})">同意退款
        </button>
        <!--<button class="cancel-order"-->
                <!--@click.stop="$emit('click',{field:'comment',data:{orderId:data.orderId,goodsId:data.goodsId,storeId:data.storeId}})">去评价-->
        <!--</button>-->
        <!--<button class="go-pay" @click.stop="$emit('click',{field:'del',data:{orderId:data.orderId}})">删除订单</button>-->
      </div>
      <div v-else>
        <button class="go-pay">查看详情</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {utilMixins} from "@/plugins/util-mixins";
  import {PlaceholderAvatar} from "../../../../project-config/base";
  export default {
    data:function(){
      return {
        PlaceholderAvatar,
      }
    },
    mixins: [utilMixins],
    props: ['data'],
    methods: {
      canShowBtn(status) {
        if (status == 0 || status >= 0) {
          return true;
        } else {
          return false;
        }

      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../../assets/theme";

  .dd-order {
    background: #fff;
    margin-bottom: 30px;

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
          width: 80px;
          min-width: 80px;
          height: 80px;
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
          line-height: 34px;
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: right;
        padding: 30px;

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
      @include flex-between;
      border-top: 1.1px solid #ddd;
      .xd-time{
        color: #999;
      }
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
