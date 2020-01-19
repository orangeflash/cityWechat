<template>

  <dd-layout-div>
    <Header/>
    <dd-layout-div class="order-desc block">
      <Order :goods="goods" not-operation="true"></Order>
    </dd-layout-div>

    <div class="order-info-single block" v-if="goods.delivery == 2 || +orderInfo.delivery == 2">
      <div class="order-info-single-title">
        <i class="iconfont icon-wuliuqiache icon"></i>
        自提地址
      </div>
      <van-cell
        v-if="orderInfo.self"
        :title="orderInfo.self.detailedAddress" size="large" :label="orderInfo.self.address"
        :value="orderInfo.self.linkTel"
      />
      <ul v-else>
        <li
          v-for="(item,key) in orderInfo.selfAddress"
          :key="key"
        >
          <div>联系人：{{item[1]}}&nbsp;&nbsp;&nbsp;手机号：{{item[2]}}</div>
          <div class="address">地址：{{item[3]}}</div>

        </li>
      </ul>
    </div>

    <div class="order-info-single block" v-if="orderInfo.note">
      <div class="order-info-single-title">
        <i class="iconfont icon-biaoqian2 "></i>
        订单备注
      </div>
      <ul>
        <li>{{orderInfo.note}}</li>
      </ul>
    </div>
    <div class="order-info-single block">
      <div class="order-info-single-title">
        <i class="iconfont icon-shiyongxuzhi icon "></i>
        订单详情
      </div>
      <ul>
        <li>订单编号：{{orderInfo.outTradeNo}}</li>
        <li>下单时间：{{formatDateByTimeStamp(orderInfo.createdAt)}}</li>
        <!--<li>支付方式：微信支付</li>-->
      </ul>
    </div>
    <dd-layout-div :mar="[100,0]"/>
    <dd-button
      class="mar-lr br-r-c"
      type="release"
      name="立即核销"
      @click="beginWriteOff"
    />

  </dd-layout-div>


</template>

<script>

  import {mapActions} from 'vuex'
  import DdButton from "@/components/template/button"
  import Order from "../../../pages/personal/integral-mall/template/order";
  import {hideLoading, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";

  import {Toast} from 'vant'

  export default {
    mixins: [utilMixins],
    components: {Order, DdButton},
    data() {
      return {
        goods: [],
        orderInfo: {}
      }
    },
    methods: {
      ...mapActions('mall', ['getMallOrderDetails', 'mallOrderWriteOff']),
      ...mapActions("storeAuxiliary/releaseGood", ["getAddressInfo"]),
      beginWriteOff() {
        this.mallOrderWriteOff({
          orderId: this.orderInfo.id
        }).then(result => {
          hideLoading();
          if (result.code == 1) {
            this.getMallOrderInfo();
            Toast.success({
              message: '核销成功',
              duration: 1500
            })
          } else {
            Toast.fail({
              message: result.msg,
              duration: 800
            })
          }
        })
      },
      async getMallOrderInfo() {
        showLoading();
        const res = await this.getMallOrderDetails({
          orderId: this.$route.query.orderId
        });
        hideLoading();
        console.log(res);
        this.goods = [];

        res.goods.forEach(item => {
          this.goods.push({
            logo: item.img,
            name: item.name,
            goodsMoney: item.money,
            num: item.num,
            status: item.status,
            ...item
          })
        })
        this.orderInfo = {
          createdAt: res.createdAt,
          outTradeNo: res.orderNum,
          goodsNum: res.goods.length,
          status: res.state == 9 || res.state == 4 || res.state == 3 ? 3 : res.state,
          tips: (() => {
            let tips = '';

            if (res.state == 1) tips = '已付款'
            else if (res.state == 2) tips = '已发货'
            else if (res.state == 3) tips = '已评价'
            else if (res.state == 4) tips = '已完成'
            else if (res.state == 5) tips = '申请退款中'
            else if (res.state == 6) tips = '已退款'
            else if (res.state == 7) tips = '已拒绝退款'
            else if (res.state == 8) tips = '已取消';
            else if (res.state == 9) tips = '待评价';

            return tips
          })(),
          ...res
        }

        this.orderInfo.wxImg = this.orderInfo.wxImg.length > 10 && this.orderInfo.wxImg ? this.getSingleImg(JSON.parse(this.orderInfo.wxImg)[0].url) : '';

        if (this.orderInfo.delivery == 2) {

          this.getAddressInfo({
            addressId: res.selfId
          }).then(result => {
            console.log("getAddressInfo", result);
            this.orderInfo.self = result;
            this.$set(this.orderInfo, self, result)
          })
        }
      }
    },
    created() {
      this.getMallOrderInfo()

    }
  }

</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  .block {
    background: #fff;
    margin-top: 20px;
  }

  .order-info-single {
    padding-bottom: 10px;

    &-title {
      padding: 0 30px;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 0;
      color: #333;
      font-size: 28px;
      border-bottom: 1.1px solid #ddd;
      height: 90px;

      .icon {
        color: $themeColor;
        font-size: 40px;
        margin-right: 20px;
      }

      span {
        position: absolute;
        right: 30px;
        top: 25px;

        i {
          font-size: 40px;
          color: #FF8330;
        }
      }


    }

    .order-operation-btns {
      display: flex;
      align-items: center;
      height: 90px;

      div {
        width: 50%;
        text-align: center;

        height: 60px;
        line-height: 60px;
        display: flex;
        align-items: center;

        &:nth-child(1) {
          border-right: 1.1px solid #ddd;
        }

        span {
          width: 200px;
          margin: 0 auto;
          display: flex;
          align-items: center;

          i {
            color: $themeColor;
            font-size: 40px;
            margin-right: 20px;
          }
        }

      }
    }

    p {
      text-align: right;
      color: #999;
      position: relative;
      z-index: 0;
      padding: 30px;
      border-bottom: 1.1px solid #ddd;

      .order-status {
        position: absolute;
        left: 30px;
      }

      .success {
        color: #FF4E00;
      }

      .fail {
        color: #999;
      }
    }

    ul {
      padding: 30px 30px 0 30px;

      > span.title_tips {
        font-size: 30px;
        margin-bottom: 30px;
        display: block;
      }

      li {
        margin-bottom: 30px;
        font-size: 26px;

        div {
          font-size: 24px;
        }

        div.address {
          margin-top: 20px;
          padding-bottom: 15px;
        }
      }
    }

    .write-off-box {
      padding: 15px 0;

      div {
        text-align: center;
        font-size: 28px;
        padding: 30px 0 15px;
      }

      .code-box {
        height: 64px;
        line-height: 64px;

        span {
          display: inline-flex;
          width: 64px;
          height: 64px;
          border-radius: 8px;
          line-height: 64px;
          text-align: center;
          border: 1.1px solid #ddd;
          margin: 0 6px;
          font-size: 40px;
          overflow: hidden;

          em {
            margin: 0 auto;
          }
        }

        span.active_ {
          border-color: $themeColor;
        }
      }
    }
  }


</style>
