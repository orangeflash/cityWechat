<template>


  <div class="activity-order">
    <van-tabs v-model="active" @click="changeTab">
      <van-tab :title="item" v-for="(item,key) in tabs" :key="key"></van-tab>
    </van-tabs>
    <div class="order-list">
      <scroller
        v-if="orderList.length"
        :onRefresh="onRefresh"
        :onInfinite="onInfinite"
      >
        <dd-store-order
          v-bind="item"
          v-for="(item,key) in orderList"
          :key="key"
          @click="goPointPage('/auxiliary/activity/details?activityId='+item.activityId)"
          @button="operation"
        >
          <div slot="attr" class="flex-bt flex-y-center col-9 mar-t">
            <span>{{item.typeName}}</span>
            <span>人数：<em class="col-t">{{item.num}}</em>人</span>
            <span>金额：<em class="price col-t">￥{{item.money}}</em></span>
          </div>
        </dd-store-order>
      </scroller>
      <not-data v-else></not-data>
    </div>

  </div>

</template>

<script>

  import DdStoreOrder from '@/components/template/dd-store/order'

  import {mapActions} from "vuex";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {format, showDialog} from "../../../util";
  import {Toast} from 'vant'

  export default {
    mixins: [utilMixins],
    components: {DdStoreOrder},
    data() {
      return {
        active: 0,
        tabs: ["全部", '待付款', '报名成功', '待评价', '已完成'],
        params: {
          size: 10,
          page: 1,
          type: null,      //0未付款,1报名成功,2待评价
          word: null
        },
        orderList: [],
      }
    },
    methods: {
      ...mapActions("activity", ["getActivityOrder", "cancelEnroll"]),
      /** 获取订单 */
      async getOrders(refresh) {

        let orders = await this.getActivityOrder(this.params);
        orders = orders.map(item => {
          return {
            orderNum: "订单编号：" + item.outTradeNo,
            tips: this.tabs[+item.state + 1],
            cover: this.getSingleImg(item.showImgs[0].url),
            title: item.name,
            num: item.num,
            price: item.money,
            time: format(item.startTime * 1000) + ' ~ ' + format(item.endTime * 1000),
            activityId: item.activityId,
            bts: this.getPointBtn(item),
            money: item.money,
            typeName: item.typeName
          }
        })
        this.orderList = refresh ? orders : this.orderList.concat(orders);
        return orders.length >= this.params.size;
      },
      /** 获取指定按钮 */
      getPointBtn(item) {

        let bts = [], state = item.state, startTime = item.startTime * 1000,
          endTime = item.endTime * 1000, now = new Date().getTime();

        if (state == 0) {
          bts = [
            {name: '取消订单', type: 'default', state, field: 'cancel', enrollId: item.enrollId},
            {name: '去支付', type: 'main', state, field: 'pay', enrollId: item.enrollId, money: item.money},
          ]
        } else if (state == 1) {
          if (now >= startTime && now <= endTime) {
            bts = [
              {name: '去核销', type: 'main', field: 'writerOff', enrollId: item.enrollId},
            ]
          } else {
            bts = [
              {name: '查看详情', type: 'default', field: 'details', enrollId: item.enrollId},
            ]
          }
        } else if (state == 2) {
          bts = [
            {name: '去评价', type: 'main', field: 'comment', enrollId: item.enrollId, activityId: item.activityId},
          ]
        } else if (state == 3) {
          bts = [
            {name: '查看详情', type: 'default', field: 'details', enrollId: item.enrollId},
          ]
        }
        return bts;
      },
      /** 刷新 */
      async onRefresh(done) {
        this.params.page = 1;
        const bool = await this.getOrders(true);
        done && done(!bool);
      },
      /** 加载更多 */
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getOrders();
        done && done(!bool);
      },
      /** 选项切换 */
      changeTab(key) {
        this.params.type = (key - 1 < 0) ? null : key - 1;
        this.onRefresh();
      },
      /** 操作按钮 */ async operation(item) {
        switch (item.field) {
          case 'cancel':
            try {
              await showDialog("您确定要取消该订单吗？")
              const res = await this.cancelEnroll(item);
              if (res.code == 1) {
                this.onRefresh();
              } else {
                Toast({
                  message: '取消失败',
                  duration: 1500
                })
              }
            } catch (e) {

            }
            break;
          case 'pay':
            this.$router.push({
              name: 'cashier',
              params: {
                type: 31,
                param: {
                  enrollId: item.enrollId,
                },
                info: {
                  money: (+item.money).toFixed(2),
                  type: "参加活动",
                  callLink: "/auxiliary/activity/order"
                }
              }
            });
            break;

          case 'comment':
            this.goPointPage({
              path: '/auxiliary/activity/comment',
              query: {
                activityId: item.activityId,
                enrollId: item.enrollId
              }
            })
            break;
          case 'writerOff':
          case 'details':
            this.goPointPage({
              path: '/auxiliary/activity/enrollDetails',
              query: {
                enrollId: item.enrollId
              }
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

  .order-list {
    position: fixed;
    width: 100%;
    height: calc(100% - 200px);
  }
</style>
