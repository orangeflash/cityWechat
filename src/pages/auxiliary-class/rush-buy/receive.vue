<template>
  <div>
    <dd-tab class="posi-f w100 zIndex99" :tabs="tabs" @click="tabsMethod"/>
    <div class="posi-f w100" style="height: calc(100% - 45px);margin-top: 45px;">
      <scroller
        v-if="orderList.length"
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
      >
        <dd-store-order
          :order="item"
          class="bg-f mar-b"
          v-for="(item,key) in orderList"
          :key="key"
          @click="clickMethod(item)"
          @button="buttonMethods"
        >
          <div slot="title" class="mar-b-10 fon-b flex-y-center t-o1">{{item.name}}</div>

          <dd-store-data-list slot="desc" class="mar-b-10 flex-g-1" :form="item.info" :height="height"/>
          <div slot="down" class="flex-bt flex-y-center">
            <div>
              <span class="col-t fon-xxl">{{item.discount}}</span>
              <em class="col-9 t-d-l">{{item.condition}}</em>
            </div>
            <span class="col-f pad-14-20-10"
                  style="border-radius: 20px;"
                  :class="item.state == 1?'bg-t':'bg-9'"
            >{{state[item.state]}}</span>
          </div>
        </dd-store-order>
      </scroller>
      <not-data v-else-if="isRequest"/>
    </div>
  </div>

</template>

<script>

  import DdStoreOrder from '../../../components/template/dd-store/order-two'
  import DdTab from '@/components/template/other/tab'
  import {format, hideLoading, showLoading} from "../../../util";
  import DdStoreDataList from "@/components/template/dd-store/data-list";
  import {mapActions} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {DdStoreOrder, DdTab, DdStoreDataList},
    data() {
      return {
        active: 0,
        tabs: [
          {title: '全部'},
          {title: '未使用'},
          {title: '已使用'},
          {title: '已过期'},
        ],
        orderList: [],
        hasMore: true,
        height: 40,
        isRequest: false,
        params: {
          page: 1,
          size: 10,
          type: 0,
        },
        state:['','已付款','已发货','已完成','已过期'],
      }
    },
    methods: {
      ...mapActions('rushBuy',['myRushOrderList']),
      async onRefresh(done) {
        this.params.page = 1;
        await this.getOrderList(true);
        done && done()
      },
      async onInfinite(done) {
        let bool = false;
        if (this.hasMore) {
          this.params.page++;
          bool = await this.getOrderList();
        }
        done && done(!bool)
      },
      async getOrderList(refresh) {
        showLoading();
        let result = await this.myRushOrderList(this.params);
        result = result.map(item => {
          return {
            name: item.title,
            cover: {
              src: this.getSingleImg(item.showImgs[0]&&item.showImgs[0].url),
              width: 1.7,
              height: 1.7
            },
            info: [
              {label: '下单时间：' + this.formatDateByTimeStamp(item.createdAt,"YYYY-MM-DD HH:mm:ss")},
              {label: '有效期至：' + this.formatDateByTimeStamp(item.expireTime,"YYYY-MM-DD HH:mm:ss")},
              {label: '购买数量：'+item.orderNum},
              {label: '支付金额： ' + (+item.totalMoney > 0 ? (+item.totalMoney).toFixed(2) + '元' : '免费')},
            ],
            goodsId: item.goodsId,
            discount: '￥'+item.goodsMoney + '元',
            condition: '￥'+item.originalPrice,
            state: +item.state,
            orderId: item.orderId
          }
        })

        hideLoading();
        this.orderList = refresh ? result : this.orderList.concat(result);
        this.isRequest = true;
        this.hasMore = result.length >= this.params.size;
        return this.hasMore;
      },
      tabsMethod(v) {
        this.params.type = v.value;
        this.onRefresh();
      },
      clickMethod(item){
        this.goPointPage('/auxiliary/rushBuy/receiveDetails?id='+item.orderId)
        console.log(item)
        // this.goPointPage({path:'/auxiliary/rushBuy/rushBuyDetails',query:{id:item.goodsId}})
      },
      buttonMethods(item) {
        console.log(item)
        switch (item.field) {
          case 'details':
            this.goPointPage({
              path: '/auxiliary/coupon/receiveDetails'
            })
            break;
        }
      }
    },
    created() {
      this.onRefresh();
    }
  }

</script>


<style scoped lang="scss">
  @import "../../../assets/theme";

  .label {
    border-radius: 20px;
    color: #FF3838;
    border: 1.1px solid #FF3838;
    padding: 8px 10px 4px;
  }

</style>
