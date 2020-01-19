<template>
  <div class="mall-order">
    <!--<van-search-->
    <!--placeholder="请输入搜索关键词" v-model="params.word"-->
    <!--@search="onSearch"-->
    <!--/>-->
    <van-tabs v-model="active" @change='changeTab' :color="$themeColor">
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
        <dd-order
          v-for="(item,key) in orderList"
          :key="key"
          :data="item"
          @click="operation"
          @face="goPointPage('/auxiliary/mall/storeDetails?id='+item.storeId)"
        ></dd-order>
      </scroller>
      <not-data v-else></not-data>
    </ul>

  </div>
</template>
<script>

  import DdOrder from "@/components/template/mall/dd-order"

  import {mapActions} from "vuex"
  import {format, hideLoading, showDialog, showLoading} from "../../../util";
  import {Toast} from 'vant';

  export default {

    components: {DdOrder},
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
          {name: '待收货', status: 3},
          {name: '待评价', status: 4},
          {name: '已完成', status: 5},
          {name: '退款/售后', status: 6}
        ],
        statusArray: ['未付款', '已付款', '已发货', '已评价', '已完成', '申请退款中', '已退款', '拒绝退款', '已取消', '待评价'],
      }
    },
    methods: {
      ...mapActions('mall', ['getMallConfig', 'getMallOrderList',
        'mallCancelOrder', 'mallDelOrder']),
      async operation(res) {
        switch (res.field) {
          case 'del':
            try {
              await showDialog("确定要删除该订单？");
              const resutl = await this.mallDelOrder(res.data);
              !isNaN(Number(resutl.data)) && this.orderList.splice(this.orderList.indexOf(_.find(this.orderList, (item) => {
                return item.childrenId == res.data.orderId
              })), 1);
              Toast({
                message: '已删除',
                duration: 1000,
              })
              this.onRefresh();
            } catch (e) {
              console.log(e);
            }
            break;
          case 'goPay':
            this.goPay(res.data);
            break;
          case 'cancel':
            try {
              await showDialog("确定要取消该订单？")
              await this.cancel(res.data, 8);
            } catch (e) {
              console.log(e);
            }

            break;
          case 'comment':
            res.data.goods.forEach(item => item.storeId = res.data.storeId)
            let query = {
              mapGoods: res.data.goods,
            }
            this.goPointPage({
              path: '/auxiliary/mall/comment',
              query: query
            })
            break;
          case 'comfrim':
            await showDialog("确定已收到该商品？");
            await this.cancel(res.data, 9);
            break;
          case 'refund':
            this.goPointPage({
              path: '/auxiliary/mall/orderRefund',
              query: res.data
            })

            // await this.cancel(res.data,5);
            break;
        }
      },
      async cancel(result, state) {
        const res = await this.mallCancelOrder({
          orderId: result.orderId,
          state
        });
        if (res.code == 1 && !isNaN(Number(res.data))) {
          console.log("已取消");
          this.onRefresh();
        } else {
          Toast.fail({
            message: res.msg,
            duration: 1500
          })
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
        const res = await this.getMallOrderList(this.params);

        res.forEach(item => {
          item.tips = this.statusArray[item.status];
          item.createdAt = format(item.createdAt * 1000)
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
    created() {
      this.getMallConfig()
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
      top: 90px;
      height: calc(100% - 100px);
    }
  }


</style>
