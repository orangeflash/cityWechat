<template>
  <div class="order">
    <!--<div class="order-top">-->
    <!--<div class="shop-info">-->
    <!--<div class="shop-cover-box">-->
    <!--<img src="">-->
    <!--</div>-->
    <!--<div class="shop-name">-->
    <!--店铺名称-->
    <!--<i class="iconfont icon-youjiantou1"></i>-->
    <!--</div>-->
    <!--</div>-->
    <!--<span class="order-stauts">{{status}}</span>-->
    <!--</div>-->
    <div class="order-goods">
      <!-- @click="goPointPage('/auxiliary/mall/details?goodsId='+item.goodsId)"-->

      <div v-if="goods.constructor===Array">
        <div class="order-goods-box"
             v-for="(item,key) in goods"
             :key="key"
             @click="goPointPage('/auxiliary/mall/details?goodsId='+item.goodsId)"
        >

          <div class="goods-cover-box">
            <img-wrapper :src="item.logo || item.img"></img-wrapper>
          </div>
          <div class="order-goods-info">
            <div class="order-goods-info-top">
              <p class="order-goods-name">{{item.name}}</p>
              <div class="order-goods-param">
                <p class="order-goods-price">{{item.goodsMoney || item.money}}</p>
                <p class="order-goods-number">{{item.num}}</p>
              </div>
            </div>
            <!--<p class="order-goods-spec">产品规格</p>-->
          </div>
        </div>

      </div>


      <div class="order-goods-box" v-else>
        <div class="goods-cover-box">
          <img-wrapper :src="goods.logo"></img-wrapper>
        </div>
        <div class="order-goods-info">
          <div class="order-goods-info-top">
            <p class="order-goods-name">{{goods.name}}</p>
            <div class="order-goods-param">
              <p class="order-goods-price">{{goods.goodsMoney}}</p>
              <p class="order-goods-number">{{goods.num}}</p>
            </div>
          </div>
          <!--<p class="order-goods-spec">产品规格</p>-->
        </div>
      </div>
      <div v-if="!notOperation">
        <div class="discount-info">
          积分抵扣： <span>已使用<em>{{goods.score}}</em>积分享受<em>{{goods.discount}}</em>元优惠</span>
        </div>
        <div class="order-total-info">
          <div>
            <span class="order-goods-total-number">共 <em>{{goods.num}}</em> 件商品</span>
            <span class="order-goods-total-price">合计 {{(+goods.money).toFixed(2)}}<em>(含运费)</em></span>
          </div>
        </div>
        <div class="order-operation">
          <em class="is-pay" v-if="+goods.status==1">已付款</em>
          <em class="is-pay" v-else-if="+goods.status==0">未付款</em>
          <em class="is-send" v-else-if="+goods.status==2">已发货</em>
          <em class="is-success" v-else-if="+goods.status==3">已完成</em>
          <button class="default"
                  @click="goPointPage({path:'/personal/integralMall/writeOff',query:{goods:goods,notOperation:true}})">
            查看详情
          </button>
          <button class="special" v-if="(+goods.status==2 || +goods.delivery == 2) && goods.status != 3"
                  @click="getGoods()">确认收货
          </button>
          <button class="special" v-else @click="goPointPage({path:'/personal/integralMall'})">继续兑换</button>
        </div>
        <img class="is-success-icon" v-if="+goods.status==3" :src="dealSuccess">
      </div>
    </div>
  </div>
</template>

<script>
  import dealSuccess from "@/assets/img/personal/deal-success.png";
  import {mapActions} from 'vuex';
  import {Toast} from "vant";
  import {hideLoading, showLoading, showDialog} from "../../../../util";

  export default {
    props: ["goods", 'type', 'notOperation'],
    data() {
      return {
        dealSuccess
      }
    },
    methods: {
      ...mapActions("integralMall", ['confirmReceipt']),
      async getGoods() {
        if (+this.goods.delivery == 1) {
          // 快递配送
          try {
            await showDialog("您确定收到货了吗？");
            showLoading();
            this.confirmReceipt({
              orderId: this.goods.orderId
            }).then(result => {
              hideLoading();
              if (result.code == 1) {
                this.$emit('getOrderByType', this.type)
              } else {
                Toast.fail({
                  message: "请求失败",
                  duration: 1500
                })
              }
            })
          } catch (e) {

          }
        } else {
          // 到店自取
          console.log("到店自取");

          this.goPointPage({
            path: '/personal/integralMall/writeOff',
            query: {goods: this.goods, notOperation: true}
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../assets/common";

  .order {
    background: #fff;
    margin-bottom: 20px;

    .order-top {
      background: #fff;
      padding: 32px 30px;
      overflow: hidden;

      .shop-info {
        float: left;
        display: flex;
        height: 48px;
        align-items: center;

        .shop-cover-box {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #9933ff;
          margin-right: 26px;
        }

        .shop-name {
          font-size: 28px;

          i {
            float: right;
            margin-top: 4px;
            margin-left: 24px;
            font-size: 22px;
            color: #999;
          }
        }
      }

      .order-stauts {
        float: right;
        color: #FF0000;
        font-size: 24px;
      }
    }

    .order-goods {
      position: relative;
      z-index: 0;
      overflow: hidden;

      .order-goods-box {
        overflow: hidden;
        padding: 16px 0;
        margin: 0 30px;
        border-bottom: 1.1px solid #f4f4f4;

        .goods-cover-box {
          width: 118px;
          height: 118px;
          border-radius: 8px;
          float: left;
          overflow: hidden;
        }

        .order-goods-info {
          margin-left: 118+26px;

          .order-goods-info-top {
            overflow: hidden;

            .order-goods-name {
              width: 312px;
              line-height: 32px;
              font-size: 24px;
              float: left;
            }

            .order-goods-param {
              float: right;
              text-align: right;

              .order-goods-price {
                color: #333;
                font-size: 28px;
                margin-bottom: 28px;
              }

              .order-goods-price:before {
                content: "￥";
                font-size: 20px;
              }

              .order-goods-number {
                color: #999;
                font-size: 28px;
              }

              .order-goods-number:before {
                content: 'x';
                font-size: 20px;
              }
            }
          }

          .order-goods-spec {
            color: #999;
            font-size: 22px;
          }
        }
      }

      .discount-info {
        background: #FFF0F1;
        padding: 0 30px;
        height: 88px;
        align-items: center;
        display: flex;
        font-size: 26px;

        span {
          color: #999;
          margin-left: 30px;

          em {
            color: #FF0000;
          }
        }
      }

      .order-total-info {
        background: #fff;
        display: flex;
        align-items: center;
        height: 88px;
        border-bottom: 1.1px solid #ddd;

        div {
          text-align: right;
          flex: 1;
          padding: 0 30px;

          .order-goods-total-number {
            color: #999;

            em {
              color: #333;
            }
          }

          .order-goods-total-price {
            font-size: 28px;

            em {
              font-size: 22px;
            }
          }
        }
      }

      .order-operation {
        text-align: right;
        padding: 34px 30px;
        background: #fff;
        position: relative;
        z-index: 0;

        em {
          position: absolute;
          left: 30px;
          z-index: 0;
          top: 50px;
        }

        .is-pay {
          color: #999;
        }

        .is-success {
          color: #FF4E00;
        }

        .is-send {
          color: #999;
        }

        button {
          width: 150px;
          height: 56px;
          border-radius: 8px;
          margin-left: 32px;
        }

        .default {
          background: #fff;
          border: 1.1px solid #999;
        }

        .special {
          color: #fff;
          background: #E50101;
        }
      }

      .is-success-icon {
        position: absolute;
        z-index: 0;
        width: 188px;
        height: 144px;
        top: 24px;
        right: 116px;
      }
    }
  }
</style>
