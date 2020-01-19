<template>
  <div id="presentation-content">
    <Header @onMore="goPointPage({name: 'Rule',params:{rulefrom:'partnerprivilege'}})"></Header>
    <scroller
      class="scrollermt"
      v-if="dataList.length"
      :on-refresh="onRefresh"
      :on-infinite="onInfinite">
      <div class="data-list">
        <div v-for="(item,key) in dataList" :key="key" class="persent"
             @click="goPointPage({path: 'storeCashDetail',query:{id:item.id}})">
          <div class="present-type">
            <i class="iconfont "
               :class="{'icon-weixinzhifu4': +item.mode==1,'icon-zhifubao': +item.mode===2,'icon-iconfontjikediancanicon20': +item.mode===3}"></i>
          </div>
          <div class="present-status">
            <p class="present-money">{{item.applyMoney}}</p>
            <span class="present-status-txt">{{+item.status===1?'审核中': +item.status===2?'已通过':'已拒绝'}}</span>
          </div>
          <div class="present-info">
            <p class="present-info-time">{{formatDateByTimeStamp(item.creatTime,"MM-DD")}}
              {{formatDateByTimeStamp(item.creatTime,"HH:mm")}}</p>
            <span class="present-info-order">订单号:{{item.orderNum}}</span>
          </div>
        </div>
      </div>
    </scroller>
    <not-data v-else></not-data>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "@/plugins/util-mixins";

  const defaultPage = () => ({pageSize: 10, pageNum: 1});
  export default {
    components: {},
    data() {
      return {
        dataList: [],
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeBalance", ["getStoreCashlist"]),
      // 刷新的函数
      async onRefresh(done) {
        console.log('222222222')
        Object.assign(this, defaultPage());
        this.dataList = [];
        this.dataList = await this.getStoreCashlist({
          page: this.pageNum,
          size: this.pageSize,
          type: this.type,
          storeId:this.storeId,
        });
        // this.pageNum++;
        done && done();
      },
      async onInfinite(done) {

        if (this.pageNum === 0) return done();
        this.pageNum++;
        const list = await this.getStoreCashlist({
          page: this.pageNum,
          size: this.pageSize,
          type: this.type,
          storeId:this.storeId,
        });
        if (list.length) {
          this.dataList = this.dataList.concat(list);
        } else {
          this.pageNum--;
        }
        done(!list.length)
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    created() {
      // 获取列表
      this.onRefresh();
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
  #presentation-content {
    background-color: #f4f4f4;
    position: fixed;
    width: 100%;
    height: calc(100vh - 0px);
    .scrollermt{
      margin-top: 92px;
    }
    @include widhei;
    .data-list {
      border-top: 20px solid #f4f4f4;
      background-color: #fff;
    }

    .persent, .recharge {
      overflow: hidden;
      padding: 20px 30px 20px 0;
      margin-left: 30px;
      border-top: 1.1px solid #eee;
      line-height: 46px;

      .present-type {
        float: left;
        width: 66px;
        display: flex;
        height: 92px;
        align-items: center;
        margin-right: 20px;

        i {
          margin: 0 auto;
          font-size: 60px;
        }

        .icon-weixinzhifu4 {
          color: #5db271;
        }

        .icon-zhifubao {
          color: #00aaee;
        }

        .icon-iconfontjikediancanicon20 {
          color: #eeaf1d;
        }
      }

      .present-status, .recharge-status {
        float: right;
        height: 92px;
        text-align: right;

        p.present-money, p.recharge-money {
          color: $themeColor;
          font-size: 32px;
        }

        .present-status-txt, .recharge-status-txt {
          color: #999;
        }
      }

      .present-info, .recharge-info {

        .present-info-time, .recharge-time {
          color: #666;
          font-size: 30px;
        }

        .present-info-order, .recharge-order {
          font-size: 26px;
          color: #999;
        }
      }
    }

    .load-more {
      text-align: center;
      line-height: 100px;
    }
  }
</style>
