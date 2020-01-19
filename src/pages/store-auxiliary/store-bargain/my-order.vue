<template>

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
        <div class="bg-f pad-t pad-l pad-r pad-b-20 mar-b-20"
             v-for="(item,key) in orders"
             :key="key"
        >
          <div class="flex ">
            <div>
              <face
                :src="item.face"
                size="40"
              />
            </div>
            <div class="flex-g-1 ">
              <div class="flex-bt mar-b-10 mar-r mar-l-30 flex-y-center pad-t-10">
                <span class="fon-lg">{{item.userName}}</span>
                <span class="col-t">{{item.state}}</span>
              </div>
              <div class="flex-bt flex-center">
                <dd-store-data-list class="mar-b-20 flex-g-1 pad-l pad-r" :form="item.tips" :height="40"/>
              </div>
            </div>
          </div>
          <dd-store-buttons
            class="pad-0"
            :bts="item.bts||[]"
            @click="buttonMethods"
          />
        </div>
      </scroller>
      <not-data v-else-if="isRequest"/>
    </div>
    <dd-store-logistics-input v-model="showInput" @confirm="confirm"/>
  </div>
</template>

<script>
  import DdTab from '@/components/template/other/tab'
  import Face from '@/components/template/face'
  import DdStoreDataList from "@/components/template/dd-store/data-list";
  import DdStoreButtons from '@/components/template/dd-store/buttons'
  import DdStoreLogisticsInput from "@/components/template/dd-store/logistics-input";

  import {mapActions} from 'vuex'
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";

  export default {
    components: {DdTab, Face, DdStoreDataList, DdStoreButtons, DdStoreLogisticsInput},
    data() {
      return {
        isRequest: false,
        showInput: false,
        tabs: [{title: '全部'},
          {title: '未支付', state: 1},
          {title: '未使用', state: 2},
          {title: '已完成', state: 3}
        ],
        orderId: null,
        orders: [],
        params: {
          page: 1,
          size: 10,
          state: 0, //1未支付2未使用3已完成
        }
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeBargain", ["getBargainGoodsOrders", "bargainBeliverGoods"]),
      tabsMethod(e) {
        console.log(e);
        e && (this.params.state = e.item.state);
        this.onRefresh();
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getData(true)
        done && done();
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getData();
        done && done(!bool);
      },
      async getData(refresh) {

        let result = await this.getBargainGoodsOrders(this.params);

        result = result.map(item => {

          let tips = [], bts = [];

          const notPay = +item.state == 1, isSelf = +item.delivery == 2

          notPay && tips.push({info: `<span class="col-t fon-b mar-r">现价￥${item.money}</span><em class="col-9 t-d-l">原价￥${item.price}</em>`});
          notPay && tips.push({label: '参与时间：', info: format(item.createdAt * 1000)});
          !notPay && isSelf && tips.push({label: '兑换码：', info: item.code})
          tips.push({label: '有效期至：', info: `<span class="col-t">${format(item.useTime * 1000)}</span>`})
          !notPay && tips.push({label: '支付金额：', info: `<span class="col-t">￥${(+item.money).toFixed(2)}</span>`})
          !notPay && tips.push({label: '订单编号：', info: item.outTradeNo})
          !notPay && !isSelf && tips.push({label: '收货人：', info: item.receivedName})
          !notPay && !isSelf && tips.push({label: '联系电话：', info: item.receivedTel})
          !notPay && !isSelf && tips.push({label: '收货地址：', info: item.receivedAddress})
          // !notPay && tips.push({label: '下单时间：', info: format(item.created * 1000)})
          !notPay && tips.push({label: '配送方式：', info: +item.delivery == 1 ? '快递配送' : '门店自取'})
          item.logisticsName && tips.push({
            label: '物流公司：',
            info: item.logisticsName
          })
          item.logisticsCode && tips.push({
            label: '物流编号：',
            info: item.logisticsCode
          })
          !notPay && !isSelf && +item.state == 3 && bts.push({
            name: '点击发货',
            type: 'main',
            field: 'deliverGoods',
            orderId: item.orderId
          });

          let stateTips = ['', '砍价中', '砍价成功', '已付款', '已发货', '已完成', '已取消']
          //1砍价中2砍价成功3已付款4已发货5已完成/已核销6已取消/已过期
          return {
            face: item.portrait,
            userName: item.userName,
            state: stateTips[+item.state],
            tips,
            bts
          }
        });
        this.orders = refresh ? result : this.orders.concat(result);
        this.isRequest = true;

        return result.length >= this.params.length;
      },
      buttonMethods(e) {
        console.log(e);
        this.orderId = e.orderId
        this.showInput = !this.showInput
      },
      async confirm(e) {
        showLoading("请稍后...");
        const res = await this.bargainBeliverGoods({
          ...e,
          orderId: this.orderId
        });
        hideLoading();
        showHandleStatusByFlag(res.code, "操作成功", res.msg, this.tabsMethod)
      }
    },
    created() {
      const query = this.$route.query;
      this.isFailParams({
        field: query.bargainId,
        tips: '缺少商品id',
      }, () => {
        try {
          this.params.id = query.bargainId;
          this.onRefresh();
        } catch (e) {
          console.log(e)
        }
      })
    }
  }

</script>
