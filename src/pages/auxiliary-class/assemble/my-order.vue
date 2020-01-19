<template>

  <!--我的订单-->
  <div>
    <div class="posi-f w100">
      <Header/>
      <dd-tab :tabs="tabs" @click="tabsMethod"/>
    </div>
    <div class="posi-f w100" style="height: calc(100% - 95px);margin-top: 100px">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="orderList.length"
      >
        <dd-store-order
          class=" mar-b"
          v-for="(item,key) in orderList"
          :order="item"
          :key="key"
          @click="goPointPage('/auxiliary/assemble/goodsDetails?assembleId='+item.goodsId)"
          @button="buttonMethods"
        >
          <div slot="title" class="mar-b-20 fon-b lineH-40">{{item.name}}</div>

          <!--<dd-store-data-list slot="desc" class="mar-b-10 flex-g-1" :form="item.info" :height="height"/>-->
          <div slot="down" class="flex-bt flex-y-center pad-t">
            <div>
              <span class="col-price fon-b">￥{{item.money}}</span>
              <!--<em class="col-9 t-d-l">￥{{item.oldMoney}}</em>-->
            </div>
            <span class="col-9">x1</span>
          </div>
          <div slot="center" class="dh bg-f flex flex-col-end flex-y-center pad-lr">
            <div class="col-6 flex-y-center dh">共 <em class="col-f52c2c">{{item.num || 1}}</em> 件商品<span
              class="fon-b mar-l">合计 <em
              class="col-price">￥{{item.totalMoney}}</em><em
              class="fon-xss">（{{item.freightTips}}）</em></span></div>
          </div>
        </dd-store-order>
      </scroller>
      <not-data v-else-if="isRequest"/>
    </div>
  </div>
</template>

<script>

  import DdTab from '@/components/template/other/tab'
  import DdStoreOrder from '../../../components/template/dd-store/order-two'
  import {mapActions} from 'vuex'
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  //
  export default {
    components: {DdTab, DdStoreOrder},
    mixins: [utilMixins],
    data() {
      return {
        isRequest:false,
        tabs: [{title: '全部'},
          {title: '拼团中'},
          {title: '待收货'},
          {title: '已完成'},
          {title: '已取消'},
        ],
        tipsMap: ["拼团中", "待收货", "已发货", "已完成", "拼团失败", "申请退款中", "退款成功", "拒绝退款", "已过期"],
        orderList: [],
        params: {
          size: 10,
          page: 1
        }
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeAssemble", ["getMyAssembleOrders", "userPayRefund", "confirmReceipt"]),
      tabsMethod(e) {
        console.log(e)
        this.params.type = e.value;
        this.onRefresh();
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getDataList(true);
        done && done();
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getDataList();
        done && done(!bool);
      },
      async getDataList(refresh) {
        showLoading();
        let result = await this.getMyAssembleOrders(this.params);
        result = result.map(item => {
          let btnMainName = +item.state == 5 ? '申请退款' : +item.state == 3 ? +item.delivery == 1 ? '确认收货' : '点击使用' : '',
            btnMainField = +item.state == 5 ? 'refund' : +item.state == 3 ? +item.delivery == 1 ? 'delivery' : 'use' : ''

          return {
            goodsId: item.goodsId,
            cover: {
              src: item.showImgs[0] && this.getSingleImg(item.showImgs[0].url),
              width: 1.2,
              height: 1.2
            },
            name: item.title,
            money: item.goodsMoney,
            createTime: '订单号：' + item.outTradeNo,
            state: +item.groupId > 0 ? this.tipsMap[+item.state - 1] : '单独购买',
            bts: [
              {
                name: btnMainName,
                type: 'main',
                field: btnMainField,
                groupId: item.groupId,
                orderId: item.orderId
              },
              {name: '订单详情', type: 'default', field: 'ordeDetails', groupId: item.groupId, orderId: item.orderId},
            ],
            tips: '下单时间：' + format(item.createdAt * 1000),
            totalMoney: item.totalMoney,
            freightTips: +item.freight <= 0 ? '包邮' : item.freight,
            num: item.num
          }
        })
        this.orderList = refresh ? result : this.orderList.concat(result);
        hideLoading();
        this.isRequest = true;
        return result.length >= this.params.size
      },
      async buttonMethods(e) {
        console.log(e);
        switch (e.field) {
          case 'ordeDetails': //订单详情
            this.goPointPage('/auxiliary/assemble/assembleDetails?orderId=' + e.orderId + '&groupId=' + e.groupId)
            break;
          case 'refund':  //申请退款
            try {
              await showDialog("确认申请退款？");
              showLoading("退款申请中,请稍后...");
              const res = await this.userPayRefund(e);
              hideLoading();
              showHandleStatusByFlag(res.code, "申请成功", res.msg)
              setTimeout(() => {;
                this.onRefresh();
              }, 1500)
            } catch (e) {
              console.log(e)
            }

            break;
          case 'use':   //点击使用
            break;
          case 'delivery':  //确认收货
            try {
              await showDialog("您确认已收到货？");
              console.log(e.orderId);
              const res = await this.confirmReceipt(e);
              hideLoading();
              showHandleStatusByFlag(res.code, "交易成功", res.msg);
              setTimeout(() => {
                this.onRefresh();
              }, 1500)
            } catch (e) {
              console.log(e)
            }
            break;
        }
      }
    },
    created() {
      this.getDataList();
    }
  }

</script>
