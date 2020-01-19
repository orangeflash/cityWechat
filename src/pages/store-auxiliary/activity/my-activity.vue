<template>


  <div class="activity-order">
    <Header/>
    <van-tabs v-model="active" :color="$themeColor" @click="changeTab">
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
            <span>金额：<em class="price col-t">￥{{item.money}}</em></span>
          </div>
          <div slot="tips" class="flex-y-center">
            <span class="mar-l col-9">已报名<em class="col-t">{{item.residue}}</em>人</span>
          </div>

          <status-stamp :data="item" slot="mask"></status-stamp>
        </dd-store-order>
      </scroller>
      <not-data v-else></not-data>
    </div>
    <Operation :show="showOperation"
               @close="showOperation = !showOperation"
               @choice="actionsOperation"
               :actions="actions"
    ></Operation>
  </div>

</template>

<script>

  import DdStoreOrder from '@/components/template/dd-store/order'
  import Operation from "@/components/template/operation"
  import StatusStamp from "@/components/template/status-stamp";
  import lowerShelf from '@/assets/img/auxiliary/free-ride/lower-shelf.png';
  import {mapActions, mapState} from "vuex";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {format, hideLoading, showDialog, showLoading} from "../../../util";
  import {Toast} from 'vant'

  export default {
    mixins: [utilMixins],
    components: {DdStoreOrder, Operation, StatusStamp},
    data() {
      return {
        lowerShelf,
        active: 0,
        tabs: ['全部', "报名中", '未开始', '已结束'],
        showOperation: false,
        actions: [],
        params: {
          size: 10,
          page: 1,
          type: 0,     //1报名中，2未开始，3已结束   默认1：以为UI上面没有全部这选项
          word: null,
          storeId: null,
        },
        orderList: [],
      }
    },
    methods: {
      ...mapActions("activity", ["getStoerActivity", "cancelEnroll", "activityUpOrDwon"]),
      /** 获取订单 */
      async getOrders(refresh) {

        this.params.storeId = this.storeId;

        let orders = await this.getStoerActivity(this.params);
        let now = new Date().getTime();
        orders = orders.map(item => {


          let tips = this.active ? this.tabs[this.active] : item.enrollEndTime > now && item.enrollStartTime < now ? '报名中'
            : item.startTime * 1000 > now ? '未开始' : item.endTime * 1000 < now ? '已结束' : '';


          return {
            orderNum: format(item.createdAt * 1000) + " 发布",
            tips,
            cover: item.showImgs[0] && this.getSingleImg(item.showImgs[0].url),
            title: item.name,
            num: item.num,
            price: item.currentPrice,
            time: format(item.startTime * 1000) + ' ~ ' + format(item.endTime * 1000),
            activityId: item.id,
            bts: [
              {name: '报名详情', type: 'main', field: 'details', id: item.id},
              {name: '操作/编辑', type: 'default', field: 'operation', id: item.id, display: item.display},

            ],
            money: item.currentPrice,
            typeName: item.typeName,
            residue: item.residue,
            display: item.display
          }
        })
        this.orderList = refresh ? orders : this.orderList.concat(orders);
        return orders.length >= this.params.size;
      },
      async actionsOperation(item) {

        switch (item.field) {
          case 'upOrDwon':
            const res = await this.activityUpOrDwon(item);
            console.log("activityUpOrDwon", res);
            if (res.code != 1) {
              Toast.fail({
                message: '操作失败',
                duration: 1500
              })
            }
            this.onRefresh();
            break;
          case 'edit':
            this.goPointPage({
              path: '/storeAuxiliary/storeActivity/storeActivityRelease',
              query: {
                activityId: item.activityId
              }
            })
            break;
        }
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
        this.params.type = key
        this.onRefresh();
      },
      /** 操作按钮 */
      async operation(item) {
        this.actions = [{title: '活动ID：' + item.id}]
        switch (item.field) {
          case 'operation':
            this.actions.push({name: +item.display == 2 ? '上架' : '下架', activityId: item.id, field: 'upOrDwon'});

            if (+item.display == 2) this.actions.push({name: '编辑', activityId: item.id, field: 'edit'});

            this.showOperation = !this.showOperation
            break;
          case 'details':
            this.goPointPage({
              path: '/storeAuxiliary/storeActivity/enrollList',
              query: {
                activityId: item.id
              }
            })
            break;
        }

      }
    },
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId
      }),
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
