<template>
  <div id="my-order">
    <!--<div class="search">-->
    <!--<div>-->
    <!--<i class="iconfont icon-xiazai5"></i>-->
    <!--搜索订单-->
    <!--</div>-->
    <!--</div>-->
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->

    <van-tabs :color="$themeColor" @click="tabsMethod">
      <van-tab v-for="(item,i) in tabs" :key="i" :title="item.title"></van-tab>
    </van-tabs>
    <div id="order-scroller">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="order.length > 0"
      >
        <Order v-for="(item,index) in order" v-if="order.length > 0" type=0 :goods="item"
               @getOrderByType="getOrderByType" :key="index"></Order>
      </scroller>
      <not-data v-else></not-data>
    </div>
  </div>
</template>
<script>
  import Order from "../template/order";
  import {updateShareConfig} from "../../../../util/wechat-util";
  import {Toast} from 'vant';
  import {mapActions} from 'vuex';
  import {hideLoading, showLoading, showDialog} from "../../../../util";

  export default {
    components: {Order},
    data() {
      return {
        order: [],
        page: {
          size: 1,
          pageNumber: 10
        },
        tabs: [
          {title: '全部'},
          {title: '未兑换'},
          {title: '待收货'},
          {title: '已兑换'},
        ],

        params: {
          status: 0,
          size: 10,
          page: 1
        }
      }
    },
    methods: {
      ...mapActions('integralMall', ["integralMyRecord"]),
      load() {
        this.getOrderByType(0);
      },
      tabsMethod(v) {
        this.params.status = v || 0;
        this.onRefresh();
      },
      async getOrderByType(refresh) {
        showLoading();
        const result = await this.integralMyRecord(this.params);

        this.order = refresh ? result.data.data : this.order.concat(result.data.data)
        hideLoading();

        return result.data.data.length >= this.params.size;
      },
      async onRefresh(done) {
        this.params.page = 1
        await this.getOrderByType(true);
        done && done();

      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getOrderByType();
        done && done(!bool)
      }
    },
    async created() {
      this.load()
      //配置转发信息
      //updateShareConfig();
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../../assets/common";

  #my-order {
    background: #f4f4f4;
    /*padding: 16px 0 200px;*/

    #order-scroller {
      position: fixed;
      width: 100%;
      height: calc(100vh - 195px);
      margin-top: 20px;
    }

    .search {
      display: flex;
      align-items: center;
      margin: 0 24px 16px;
      background: #fff;
      border-radius: 8px;
      background: #fff;
      height: 72px;

      div {
        margin: 0 auto;
        font-size: 28px;
        color: #999;

      }
    }
  }

</style>

