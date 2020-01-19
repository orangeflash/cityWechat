<template>
  <div id="order-pay">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <div class="order-address-info">
      <div class="choice-delivery">
        <span>请选择配送方式：</span>
        <div class="choice-input-box">
          <span @click="radio = 1" v-if="goods.delivery == 1"><i class="iconfont icon-wanchenggouxuan2"></i>快递发货</span>
          <span @click="radio = 2" v-if="goods.delivery == 2"><i class="iconfont icon-wanchenggouxuan2"></i>门店自取</span>
        </div>
      </div>
      <div class="order-address"
           v-if="goods.delivery == 1"
           @click="goPointPage({path:'/personal/shippingAddress',query:{isChoice:true}})">
        <div class="order-address-icon-box">
          <i class="iconfont icon-dizhi"></i>
        </div>
        <div class="order-address-details">
          <p class="order-main-info">
            收货人:{{getAddres.linkName}}
            <span class="order-main-tellphone">{{getAddres.linkTel}}</span>
          </p>
          <div class="order-address-info-details">
            <span>收货地址:</span>
            <i class="iconfont icon-iconfontjiantou4"></i>
            <div>{{getAddres.address}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="goods-info">
      <!--<div class="shop-name">-->
      <!--<div class="shop-face">-->
      <!--<img src="">-->
      <!--</div>-->
      <!--<span>店铺名称</span>-->
      <!--</div>-->
      <div class="goods-info-details">
        <div class="goods-cover-box">
          <img-wrapper :src="goods.logo&&getMediaList(goods.logo).img[0]"></img-wrapper>
        </div>
        <div class="goods-txt-info">
          <p class="goods-introduction">{{goods.name}}</p>
          <p class="goods-spec">
            <span class="goods-spec-txt">商品规格商品规格</span>
            <span class="goods-price">￥{{goods.originalPrice}}</span>
          </p>
          <p class="goods-while-info" v-if="goods.money">
            <span>
              <em>￥</em>{{parseInt(goods.money)}}<em>.{{goods.money.toString().split(".")[1] || "00"}}</em> <em
              class="goods-and-while">+</em> {{goods.score}}<em class="integral-txt">积分</em>
            </span>

            <span class="goods-number">x1</span>
          </p>
        </div>
      </div>
      <div class="buy-info">
        <div class="buy-number">购买数量
          <ChoiceNumber :goodsNumber="goodsNumber"></ChoiceNumber>
        </div>
        <!--<div class="discount-info">-->
        <!--<dd></dd>-->
        <!--积分抵扣： <span>已使用<em>{{goods.sort}}</em>积分享受<em>100</em>元优惠</span>-->
        <!--</div>-->
      </div>
    </div>
    <div class="input-info">
      <div class="input-info-tips">请填写以下内容</div>
      <!--<div class="pay-type">-->
      <!--<div class="pay-type-icon-box"><i class="iconfont icon-weixinzhifu4"></i></div>-->
      <!--<div class="choice-other-pay">-->
      <!--<i class="iconfont icon-youjiantou1"></i>-->
      <!--</div>-->
      <!--<div class="pay-type-name">-->
      <!--<p>微信支付</p>-->
      <!--<span>请选择支付方式</span>-->
      <!--</div>-->
      <!--</div>-->
      <ul class="input-info-list">
        <li>
          <span>积分</span>
          <div>{{ -goods.score*goodsNumber }}</div>
        </li>
        <li>
          <span>配送费</span>
          <div>{{radio == 1? Number(goods.deliveryMoney).toFixed(2) : "0.00" }}</div>
        </li>
        <!--<li>-->
        <!--<span>备注</span>-->
        <!--<div><textarea placeholder="卖家留言"></textarea></div>-->
        <!--</li>-->
      </ul>
    </div>
    <div class="order-footer">
      <!--$pushRoute('/personal/integralMall/myOrderIndex')-->
      <div class="begin-down-order success" v-if="isCanDownOrder" @click="goDownOrder"><span>立即兑换</span></div>
      <div class="begin-down-order fail" v-else><span>积分不够</span></div>
      <div class="buy-info">
        <div>共1件商品，合计（含运费）<span>￥{{totalMoney}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ChoiceNumber from "./template/choice-number";
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {Toast} from 'vant';
  import {showDialog, hideLoading, showLoading} from "../../../util";

  export default {
    data() {
      return {
        openSelfMention: false,
        radio: 1,
        price: 99.99,
        goodsNumber: 1,
        goods: {
          money: 0,
          deliveryMoney: 0
        },
        addressInfo: {},
        myIntegral: 0,
        isCan: false,
        totalPrice: 0,
        goodsId: null,
        addressTwo: {}
      }
    },
    components: {ChoiceNumber},
    methods: {
      ...mapActions("personal", ["getUserAddressByGet", 'deleteAddressById', 'setDefaultAddress']),
      ...mapActions('integralMall', ["integralGoodsDetails", "integralSaveOrder"]),
      getOrderInfo() {
        this.goodsId = this.$route.query.goodsId;
        this.integralGoodsDetails({
          id: this.goodsId
        }).then(result => {
          console.log(result);
          if (result.code == 1) {
            this.goods = result.data;
          }
        })
      },

      load() {
        this.getOrderInfo();
        this.myIntegral = this.$route.query.myIntegral;
        if (!this.address.linkName) {
          this.getUserAddressByGet().then(result => {
            console.log(result)
            if (result.length) {
              this.addressTwo = result[0];
            } else {
              console.log("用户还没有地址信息")
            }
          })
        } else {
          console.log("有收货地址")
        }
      },
      async goDownOrder() {
        if (this.isCan) {
          let needPay = false;
          if (this.goods.delivery == 1) {
            if (!this.addressInfo.linkName) return Toast.fail({
              message: '请填写收货信息',
              duration: 1500
            })
          }
          if (this.goodsNumber <= 0) return Toast({
            message: '物品数量不能小于等于零',
            duration: 1500
          })


          if (this.totalPrice > 0) {
            try {
              await showDialog("需要支付" + this.totalPrice + "元，以及" + this.goods.score * this.goodsNumber + "积分");
              needPay = true;
            } catch (e) {
              return console.log("老板，我这是小本买卖啊！");
            }
          } else {
            try {
              await showDialog("需要支付" + this.goods.score * this.goodsNumber + "积分");
            } catch (e) {
              return console.log("老板，积分就是用来拿礼品的！");
            }
          }
          showLoading();


          this.integralSaveOrder({
            goodsId: this.goodsId,
            score: this.goods.score * this.goodsNumber,
            money: this.totalPrice,
            receivedName: this.addressInfo.linkName,
            receivedAddress: this.addressInfo.address,
            receivedTel: this.addressInfo.linkTel,
            num: this.goodsNumber,
            delivery: this.goods.delivery
          }).then(result => {
            hideLoading();
            if (result.code != 1) {
              Toast.fail({
                message: '下单失败',
                duration: 1500
              })
            } else if (needPay) {
              this.$router.push({
                name: 'cashier',
                params: {
                  type: 11,
                  param: {
                    money: +this.totalPrice,
                    orderId: +result.data
                  },
                  info: {
                    money: +this.totalPrice,
                    type: "积分兑换",
                    callLink: "/personal/integralMall/myOrderIndex"
                  },
                }
              });
            } else {
              // 订单的id
              console.log("当前的订单的id:" + result.data);

              this.goPointPage({
                path: "/personal/integralMall/myOrderIndex"
              })

            }
          })

        } else {
          Toast.fail({
            message: '积分不够',
            duration: 1500
          })
        }
      }
    },
    computed: {
      ...mapState("integralMall", {
        address: state => state.address,
      }),

      isCanDownOrder() {
        this.isCan = this.myIntegral >= +this.goods.score * +this.goodsNumber
        return this.isCan;
      },
      totalMoney() {
        this.totalPrice = (Number(this.goods.money) * this.goodsNumber + Number((this.radio == 1 ? this.goods.deliveryMoney : 0)))
        return this.totalPrice.toFixed(2);
      },
      getAddres() {
        this.addressInfo = {
          linkName: this.address.linkName || this.addressTwo.linkName || '',
          linkTel: this.address.linkTel || this.addressTwo.linkTel || '',
          address: (this.address.address || this.addressTwo.address || '') + " " + (this.address.detailedAddress || this.addressTwo.detailedAddress || '')
        }

        return this.addressInfo;

      }
    },
    mixins: [utilMixins],
    created() {
      this.load()
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  #order-pay {
    background: #f4f4f4;
    font-family: PingFang-SC-Medium;
    padding-bottom: 192px;

    .order-address-info {
      background: #fff;

      .choice-delivery {
        border-bottom: 1.1px solid #ddd;
        height: 88px;
        padding: 0 30px;
        line-height: 88px;

        div {
          float: right;
          height: 88px;
          width: 450px;

          span {
            margin-right: 64px;
            color: #333;
            display: flex;
            align-items: center;
            float: left;

            i.iconfont {
              margin-right: 22px;
            }

            .unchoice {
              border: 1.1px solid #999;
              width: 32px;
              height: 32px;
              border-radius: 50%;
            }

            .icon-wanchenggouxuan2 {
              font-size: 36px;
              color: $themeColor;
            }
          }
        }
      }

      .order-address {
        padding: 34px 0;

        div {
          line-height: 34px;
        }

        .order-address-icon-box {
          width: 74px;
          display: flex;
          align-items: center;
          float: left;
          height: 104px;

          i {
            margin: 0 auto;
            font-size: 32px;
          }
        }

        .order-address-details {
          margin-right: 30px;

          .order-main-info {
            font-size: 30px;

            .order-main-tellphone {
              float: right;
            }
          }

          .order-address-info-details {
            margin-top: 16px;
            overflow: hidden;

            span {
              float: left;
              font-size: 24px;
            }

            div {
              margin-left: 120px;
              margin-right: 50px;
            }

            i {
              float: right;
              font-size: 24px;
              margin-top: 10px;
            }
          }
        }
      }
    }

    .goods-info {
      margin-top: 20px;

      .shop-name {
        background: #fff;
        height: 88px;
        display: flex;
        align-items: center;
        padding: 0 30px;
        font-size: 28px;

        .shop-face {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #008a00;
          margin-right: 34px;
        }
      }

      .goods-info-details {
        overflow: hidden;
        padding: 24px 30px;

        .goods-cover-box {
          width: 184px;
          height: 184px;
          float: left;
          overflow: hidden;
        }

        .goods-txt-info {
          margin-left: 218px;

          .goods-introduction {
            font-size: 26px;
            line-height: 32px;
          }

          .goods-spec {
            overflow: hidden;
            margin: 32px 0;

            .goods-spec-txt {
              font-size: 24px;
              color: #999;
            }

            .goods-price {
              font-size: 28px;
              margin-top: 2px;
              float: right;
            }
          }

          .goods-while-info {
            font-size: 28px;

            span {
              color: #FF0101;

              em {
                font-size: 24px;
              }

              .integral-txt {
                color: #333;
              }
            }

            .goods-number {
              float: right;
              font-size: 28px;
              color: #333;
            }
          }
        }
      }
    }

    .buy-info {
      background: #fff;
      /*padding-bottom: 24px;*/
      .buy-number {
        padding: 32px 30px;
      }

      .discount-info {
        background: #FFF0F1;
        padding: 0 30px;
        height: 88px;
        align-items: center;
        position: relative;
        display: flex;
        font-size: 26px;

        dd {
          border: 20px solid rgba(0, 0, 0, 0);
          border-bottom-color: #FFF0F1;
          position: absolute;
          top: -40px;
          left: 50px;
        }

        span {
          color: #999;
          margin-left: 30px;

          em {
            color: #FF0000;
          }
        }
      }
    }

    .input-info {

      .input-info-tips {
        height: 88px;
        line-height: 88px;
        font-size: 26px;
        padding: 0 30px;
      }

      .pay-type {
        background: #fff;
        padding: 0 30px;
        overflow: hidden;

        .pay-type-icon-box {
          width: 66px;
          height: 66px;
          background: #fff;
          overflow: hidden;
          float: left;
          margin: 24px 30px 24px 0;
          border-radius: 50%;

          i {
            color: #5DB271;
            font-size: 70px;
          }
        }

        .pay-type-name {
          margin: 28px 30px 24px 0;

          p {
            font-size: 28px;
            margin-bottom: 8px;
          }

          span {
            font-size: 18px;
            color: #999;
          }
        }

        .choice-other-pay {
          float: right;
          height: 66px;
          display: flex;
          align-items: center;
          width: 30px;
          margin-top: 24px;

          i {
            color: #999;
          }
        }
      }

      .input-info-list {
        background: #fff;

        li {
          border-top: 1.1px solid #ddd;
          padding: 32px 30px;
          overflow: hidden;

          span {
            font-size: 28px;
            float: left;
          }

          div {
            margin-left: 130px;
            overflow: hidden;
            color: #999;

            textarea {
              outline: none;
              width: 100%;
              border: none;
              resize: none;
              min-height: 116px;
              color: #333;
              font-size: 26px;
            }
          }
        }
      }
    }

    .order-footer {
      position: fixed;
      height: 90px;
      width: 100%;
      background: #fff;
      bottom: 0;
      left: 0;
      border-top: 1.1px solid #f4f4f4;

      .buy-info {
        height: 100%;
        margin-right: 254+26px;

        div {
          height: 100%;
          line-height: 90px;
          text-align: right;

          span {
            color: #FF0000;
            font-size: 28px;
          }
        }
      }

      .begin-down-order {
        width: 254px;
        height: 100%;
        font-size: 34px;
        display: flex;
        align-items: center;
        float: right;

        span {
          display: block;
          margin: 0 auto;
        }
      }
    }

    .success {
      background: $themeColor;
      color: #fff;
    }

    .fail {
      background: #ddd;
      color: #666;
    }
  }
</style>
