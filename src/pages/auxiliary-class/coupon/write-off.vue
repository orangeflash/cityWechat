<template>
  <!--核销页面-->
  <div>
    <Header/>
    <dd-store-order
      :order="order"
      class="bg-f br-b-d"
    >
      <h3 slot="title" class="fon-b mar-b-20 lineH-48"><span class="label fon-xs mar-r-10 flo-l">{{order.type}}</span>{{order.name}}
      </h3>
      <!--<div class="order-title-r2"><span class="label fon-xs mar-r-10">{{order.type}}</span>{{order.name}}-->
      <!--</div>-->
      <div slot="desc" class="mar-b-20 col-9">有效期至：{{order.endTime}}</div>
      <div slot="down">
        <span class="col-t fon-xxl mar-r-10">{{order.discount}}</span><em class="col-9">{{order.condition}}</em>
      </div>
    </dd-store-order>
    <dd-form-cell
      label="购买数量："
      labelSize="24"
    ><span slot="center" class="dk pad-r pad-l ">1</span></dd-form-cell>
    <dd-form-cell
      label="支付金额："
      labelSize="24"
    ><span slot="center" class="dk pad-r pad-l col-price">￥{{(+order.money).toFixed(2)}}</span></dd-form-cell>

    <dd-form-chunk title="购买信息" class="mar-b-10">
      <div slot="content" class="pad-t-10">
        <dd-form-cell
          label="姓名："
          labelSize="24"
        ><span slot="center" class="dk pad-r pad-l">{{buyInfo.userName}}</span></dd-form-cell>
        <dd-form-cell
          label="电话："
          labelSize="24"
        ><span slot="center" class="dk pad-r pad-l">{{buyInfo.linkTel}}</span></dd-form-cell>
      </div>
    </dd-form-chunk>
    <!--<dd-form-cell-->
    <!--label="兑换码："-->
    <!--labelSize="24"-->
    <!--&gt;<span slot="center" class="dk pad-r pad-l">1235484</span></dd-form-cell>-->
    <dd-form-cell
      label="订单编号："
      labelSize="24"
    ><span slot="center" class="dk pad-r pad-l">{{buyInfo.outTradeNo}}</span></dd-form-cell>
    <dd-form-cell
      label="领取时间："
      labelSize="24"
    ><span slot="center" class="dk pad-r pad-l">{{buyInfo.createdAt}}</span></dd-form-cell>
    <dd-button
      class="mar-30"
      type="release"
      name="确认核销"
      @click="beginWriteOff"
    ></dd-button>
  </div>


</template>

<script>

  import DdStoreOrder from '@/components/template/dd-store/order-two'
  import DdFormCell from "@/components/template/dd-form/cell"
  import DdFormChunk from "@/components/template/dd-form/chunk"
  import DdButton from "@/components/template/button"
  import {format, showDialog, showLoading} from "../../../util";
  import {Toast} from 'vant'
  import {mapState, mapActions} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {DdStoreOrder, DdFormCell, DdFormChunk, DdButton},
    data() {
      return {
        order: {
          cover: {
            width: 1.8,
            height: 1.8
          }
        },
        buyInfo: {},
        params: {}
      }
    },
    methods: {
      ...mapActions('coupon', ['getCouponOrderInfo', 'getCouponInfo', 'writeOffCoupon']),
      ...mapActions("shop", ["getShopInfoByParams"]),
      async beginWriteOff() {
        try {
          await showDialog('确认核销？');
          showLoading('核销中...')
          const res = await this.writeOffCoupon(this.params);
          if (res.code == 1) {
            Toast.success({
              message: '核销成功',
              duration: 1500
            });
          } else {
            Toast.fail({
              message: res.msg,
              duration: 1500
            })
          }
          console.log("res", res)
        } catch (e) {
          console.log(e);
        }

      }
    },
    computed: {
      ...mapState({
        user: s => s.user
      })
    },
    created() {
      const query = this.$route.query;
      this.isFailParams({
        field: query.orderId,
        tips: '缺少订单id',
      }, async () => {
        this.params.id = query.orderId
        const info = await this.getCouponOrderInfo({id: query.orderId});
        if (info.couponId) {
          info.reduce = (+info.type == 1 || +info.type == 3 ? info.reduce + '元' : info.discount + '折');
          const coupontInfo = await this.getCouponInfo({
            id: info.couponId
          })
          this.order = {
            cover: {
              src: this.getSingleImg(coupontInfo.logo),
              width: 1.8,
              height: 1.8
            },
            name: coupontInfo.title,
            type: +coupontInfo.type == 1 ? '代金劵' : +coupontInfo.type == 3 ? '优惠劵' : ' 折扣劵',
            endTime: format(coupontInfo.endTime * 1000),
            condition: +info.condition > 0 ? '满' + info.condition + '元领取' : '无最低消费',
            discount: info.reduce,
            money: info.money
          }
          console.log("info", info);
          info.createdAt = format(info.createdAt * 1000)
          this.buyInfo = info
        } else {
          Toast.fail({
            message: '请求失败',
            duration: 1500
          })
        }
      })
    }
  }

</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  .label {
    border-radius: 20px;
    color: #FF3838;
    border: 1.1px solid #FF3838;
    line-height: 38px;
    padding: 4px 10px 0;
  }


</style>
