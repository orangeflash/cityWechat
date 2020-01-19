<template>
  <!--我参与的-->
  <div>
    <div class="posi-f w100">
      <Header/>
      <dd-tab :tabs="tabs" @click="tabsMethod"/>
    </div>
    <div class="posi-f w100" style="height: calc(100% - 95px);margin-top: 100px">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="orders.length"
      >
        <div v-for="(order,k) in orders" :key="k"
             class="br-b-d pad-30 bg-f"

        >
          <div class=" flex"
               @click="goPointPage('/auxiliary/bargain/details?bargainId='+order.bargainId)"
          >
            <div style="min-width: 1.74rem">
              <face
                :src="order.logo"
                size="87"
                borderRadius="0"
              ></face>
            </div>

            <div class="flex-g-1 mar-l">
              <div class="order-title-r2">{{order.title}}</div>
              <p class="col-9 mar-t-20">有效期至：{{order.endTime}}</p>
              <div class="mar-t-20"><span class="col-price fon-xl mar-r">现价：￥{{order.money}}</span><span
                class="col-9 t-d-l">原价:￥{{order.price}}</span></div>
              <p class="col-9 mar-t-20" v-if="order.code">核销码：{{order.code}}</p>
            </div>
          </div>
          <div class="flex-x-end flex-wrap mar-t">
            <span class="bg-t col-f pad-12-20-10 mar-l br-r-20 mar-b" v-if="order.state == 1"
                  @click.stop="goPointPage('/auxiliary/bargain/details?bargainId='+order.bargainId)"
            >继续砍价</span>
            <span class="bg-f52c2c col-f pad-12-20-10 mar-l br-r-20 mar-b" v-if="order.state == 3 && order.delivery == 2"
                  @click="goPointPage('/auxiliary/bargain/details?bargainId='+order.bargainId)">去核销</span>
            <span class="bg-9 col-f pad-12-20-10 mar-l br-r-20 mar-b" v-else-if="order.state == 5">已使用</span>
            <span class="bg-9 col-f pad-12-20-10 mar-l br-r-20 mar-b" v-else-if="order.state == 6">已过期</span>
            <span class="bg-t col-f pad-12-20-10 mar-l br-r-20 mar-b" v-else-if="order.state == 2  || (order.state <3 &&order.isFloor)"
                  @click="openDownOrder(order)">立即购买</span>


            <span class="bg-t col-f pad-12-20-10 mar-l br-r-20 mar-b"
                  @click="confrim(order.id)"
                  v-if="order.state == 4 && order.delivery == 1">确认收货</span>

          </div>
        </div>
      </scroller>
      <not-data v-else-if="isRequest"/>
    </div>
    <dd-down-order v-model="show" :info="orderInfo" @confirm="downOrder"/>

    <van-popup v-model="showQRcode">
      <div class="fon-xxl br-b-d flex-center dh">核销二维码</div>
      <div class="pad-30">
        <div class="w-500 h-500 bg-t col-f" id="qrcode" ref="qrcode"></div>
      </div>
      <div class="col-t flex-center dh br-t-d fon-xxl" @click="showQRcode = !showQRcode">确认</div>
    </van-popup>

  </div>
</template>


<script>
  import DdTab from '@/components/template/other/tab'
  import Face from '@/components/template/face'
  import DdDownOrder from '@/components/template/dd-store/down-order'
  import {mapActions} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import {Toast} from 'vant'
  import {redirectPath} from "../../../project-config/base";

  export default {
    mixins: [utilMixins],
    components: {DdTab, Face, DdDownOrder},
    data() {
      return {
        showQRcode: false,
        show: false,
        isRequest: false,
        tabs: [{title: '全部'},
          {title: '砍价中'},
          {title: '待处理'},
          {title: '已完成'}
        ],
        params: {
          size: 10,
          page: 1,

        },
        orders: [],
        orderInfo: {},
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeBargain", ["getMyBargainOrderList", "bargainDownOrder", "confromReceivingGoods"]),
      openDownOrder(item) {
        this.orderInfo = {
          cover: item.logo,
          ...item
        }
        this.show = !this.show;
      },
      tabsMethod(e) {
        console.log(e);
        this.params.state = e.value;
        this.onRefresh();
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getOrders(true);
        done && done();
      },
      async onInfinite(done) {
        this.params.page = 1;
        const bool = await this.getOrders(true);
        done && done(!bool);
      },
      async confrim(id) {
        try {
          await showDialog("您确定已经收到货了吗？")
          showLoading();
          const res = await this.confromReceivingGoods({
            id
          });
          hideLoading();
          showHandleStatusByFlag(res.code, '操作成功', res.msg, (bool) => {
            bool && setTimeout(this.onRefresh, 1500)
          })

        } catch (e) {
          console.log(e)
        }

      },
      async getOrders(refresh) {

        let result = await this.getMyBargainOrderList(this.params);
        this.isRequest = true;

        result = result.map(item => {
          return {
            logo: this.getSingleImg(item.logo),
            title: item.title,
            endTime: format(item.endTime * 1000),
            money: item.money,
            code: +item.code || '',
            price: item.price,
            id: item.id,
            bargainId: item.bargainId,
            state: +item.state,     //1砍价中 2砍价成功 3已付款 4已发货 5已完成/已核销 6已取消/已过期
            delivery: +item.delivery,
            storeId: +item.storeId,
            isFloor: +item.isFloor == 1,
          }
        })

        this.orders = refresh ? result : this.orders.concat(orders);

        return result.length >= this.params.size;

      },
      async downOrder(item) {
        console.log(item);
        const totalMoney = item.money;
        if (totalMoney > 0) {
          try {
            await showDialog("需要支付" + totalMoney + '元')
          } catch (e) {
            return false;
          }
        }
        showLoading("下单中...")
        const res = await this.bargainDownOrder({
          orderId: item.id,
          ...item
        });
        hideLoading();
        console.log("bargainDownOrder", res);
        if (res.code && !isNaN(res.data)) {
          try {
            this.$router.push({
              name: 'cashier',
              params: {
                type: 40,
                param: {
                  orderId: res.data,
                },
                info: {
                  money: totalMoney,
                  type: "砍价商品支付",
                  callLink: '/auxiliary/bargain/myJoin'
                }
              }
            });
          } catch (e) {
            console.log('老板，我也是需要生存的')
          }

        } else if (totalMoney <= 0) {
          Toast.success({
            message: '购买成功',
            duration: 1500
          })
        } else {
          Toast.fail({
            message: res.msg,
            duration: 1500
          })
        }
      },
      getCode(orderId) {

        this.showQRcode = !this.showQRcode;

        setTimeout(() => {
          this.getQRCode({
            dom: this.$refs.qrcode,
            url: redirectPath + "/auxiliary/bargain/writeOff?appId="
              + localStorage.projectAppId + '&orderId=' + orderId
          })
        }, 10)


      }
    },
    created() {
      this.onRefresh();
    }
  }

</script>
