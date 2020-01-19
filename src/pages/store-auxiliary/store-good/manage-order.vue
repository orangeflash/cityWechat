<template>
  <div class="mall-order">
    <Header moreName=""></Header>
    <!--<van-search-->
    <!--placeholder="请输入搜索关键词" v-model="params.word"-->
    <!--@search="onSearch"-->
    <!--/>-->
    <van-tabs v-model="active" @click='changeTab' :color="$themeColor">
      <van-tab
        :title="item.name"
        v-for="(item,key) in tabs"
        :key="key"></van-tab>
    </van-tabs>

    <ul class="mall-order_list">
      <scroller
        v-if="orderList.length > 0"
        :onRefresh="onRefresh"
        :onInfinite="onInfinite"
      >
        <store-good-order
          v-for="(item,key) in orderList"
          :key="key"
          :data="item"
          @click="operation"
          @face="goPointPage('/auxiliary/mall/storeDetails?id='+item.storeId)"
        ></store-good-order>
      </scroller>
      <not-data v-else></not-data>
    </ul>

  </div>
</template>
<script>

  import StoreGoodOrder from "../../../components/template/mall/dd-order/store-goods-order"

  import {mapActions, mapState, mapGetters} from 'vuex';
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import {Toast} from 'vant';

  export default {

    components: {StoreGoodOrder},
    data() {
      return {
        value: '',
        active: 0,
        params: {
          size: 10,
          page: 1,
          status: 1,
          word: null,
        },
        orderList: [],
        tabs: [
          {name: '全部', status: 1},
          {name: '待付款', status: 2},
          {name: '待发货', status: 3},
          {name: '待收货', status: 4},
          {name: '已完成', status: 5},
          {name: '退款/售后', status: 6}
        ],
        statusArray: ['待付款', '待发货', '待收货', '已评价', '已完成', '待退款', '已同意退款', '已拒绝退款', '已关闭', '已确认收货'],
      }
    },
    methods: {
      ...mapActions('storeAuxiliary/releaseGood', ['getShopOrderList','postShopDelivery','postShopRefund','postCancelOrder']),
      async operation(res) {
        switch (res.field) {
          case 'del':
            this.deleteInfo(res.data)
            break;
          case 'goPay':
            this.goPay(res.data);
            break;
          case 'cancel':
            await this.cancel(res.data);
            break;
          case 'comment':
            this.goPointPage({
              path: '/auxiliary/mall/comment',
              query: res.data
            })
            break;
          case 'refund':
            this.refundInfo(res.data)
            break;
        }
      },
      //退款
      async refundInfo(info){
        console.log(info)
        try {
          await showDialog("确定退款吗？");
          showLoading();
          const res = await this.postShopRefund(info)
          showHandleStatusByFlag(res.code,res.msg,res.msg,)
          res.code&&setTimeout(()=>{
            this.onRefresh();
          },800)
        } catch (e) {
          console.log("还好没有退款")
        }
      },
      //删除
      async deleteInfo(info){
        console.log(info)
        try {
          await showDialog("确定要删除该条信息吗？");
          showLoading();
          const res = await this.postDelGoods(info)
          showHandleStatusByFlag(res.code,res.msg,res.msg,)
          res.code&&this.onRefresh();
        } catch (e) {
          console.log("还好没有删除该信息")
        }
      },
      async cancel(info) {
        console.log(info)
        try {
          await showDialog("确定要关闭该订单吗？");
          showLoading();
          const res = await this.postCancelOrder({
            ...info,
            state: 8,
          })
          showHandleStatusByFlag(res.code,res.msg,res.msg,)
          res.code&&setTimeout(()=>{
            this.onRefresh();
          },800)
        } catch (e) {
          console.log("还好没有取消该订单")
        }
      },
      goPay(res) {
        this.$router.push({
          name: 'cashier',
          params: {
            type: 29,
            param: {
              orderId: res.orderId
            },
            info: {
              money: res.money,
              type: "购买商品",
            }
          }
        });
      },
      changeTab() {
        this.params.status = this.tabs[this.active].status;
        this.params.page = 1;
        this.getData(true);
      },
      onSearch(sss) {
        console.log(sss)
      },
      async getData(refresh) {
        showLoading();
        const res = await this.getShopOrderList({
            ...this.params,
            storeId:this.storeId
          });

        res.forEach(item => {
          item.tips = this.statusArray[item.status];
          console.log("item.createdAt",item.createdAt)
          item.createdAt = format(item.createdAt*1000)
        })
        this.orderList = refresh ? res : this.orderList.concat(res);
        hideLoading();
        return res.length <= this.params.size;
      },
      /** 刷新 */
      async onRefresh(done) {
        this.params.page = 1;
        await this.getData(true);
        done && done();
      },
      /** 加载更多 */
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getData();
        done && done(bool);
      },
      getStatus(status) {
      }
    },
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    created() {
      if (this.$route.query.status) {
        this.params.status = +this.$route.query.status + 1;
        this.active = +this.$route.query.status
      }

      console.log(this.$route.query.from != 'personal');

      this.$route.meta.defaultTab = this.$route.query.from != 'personal'
      this.getData();
    }
  }

</script>
<style scoped lang="scss">
  @import "../../../assets/common";

  .mall-order {
    &_list {
      position: fixed;
      width: 100%;
      top: 180px;
      height: calc(100% - 100px);
    }
  }


</style>
