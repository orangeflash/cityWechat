<template>
  <div id="BalanceList">
    <Header moreName="" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <van-tabs v-if="queryParams.item<7" :line-width="25" @click="changeTab" :color="$themeColor" v-model="active">
      <van-tab :title="label" v-for="(label,key) in tabList" :key="key">
      </van-tab>
    </van-tabs>
    <scroller
      :style="{marginTop: queryParams.item==7?'51px':'96px'}"
      v-if="dataList.length"
      :on-refresh="onRefresh"
      :on-infinite="onInfinite">
      <div v-if="queryParams.item<7" class="t-c pad-30 col-9">已入账的收入将汇入到“商家余额”，可进入“商家余额”提现</div>
      <div>
        <div class="dd-cell" v-for="(item,index) in dataList" :key="index">
          <div class="flex-x-bt">
            <div>{{formatDateByTimeStamp(item.payTime,"MM-DD HH:mm")}}</div>
            <div v-if="queryParams.item!=7" class="col-t fon-xl">+{{item.totalMoney}}</div>
            <div v-else class="col-t fon-xl">-{{item.totalMoney}}</div>
          </div>
          <div class="flex-x-bt mar-t col-9">
            <div>订单号：{{item.outTradeNo}}</div>
            <div v-if="queryParams.item!=7">{{active==0?'已入账':'未入账'}}</div>
            <div v-else>支出</div>
          </div>
        </div>
      </div>
    </scroller>
    <not-data v-else></not-data>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import {utilMixins} from "../../../plugins/util-mixins";
  import {
    hideLoading,
    showDialog,
    showLoading,
    getUrlParams,
    parseObjToParams,
    showText,
    showHandleStatusByFlag
  } from "../../../util";
  import {Toast} from 'vant';
  import {PlaceholderAvatar} from "../../../project-config/base";
  import PlaceholderImg from "../../../assets/img/personal/my_publication_placeholder.jpg";
  import {getOperation} from "../../../plugins/common/index";

  export default {
    name: "BalanceList",
    components: {},
    data() {
      return {
        queryParams: {
          page: 1,
          size: 10,
          type: null,
        },
        active: 0,
        dataList: [],
        PlaceholderImg,
        PlaceholderAvatar,
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeBalance", ["getStoreBalanceList"]),
      changeTab(active) {
        console.log(active)
        this.queryParams.storeId = this.storeId;
        this.queryParams.page = 1;
        this.queryParams.type = +active + 1;
        this.onRefresh();
      },
      async getData(refresh) {
        refresh && (this.queryParams.page = 1);
        const result = await this.getStoreBalanceList({
          ...this.queryParams,
        });
        this.dataList = refresh ? result : this.dataList.concat(result);
        return result.length >= this.queryParams.size;
      },
      // 刷新的函数
      async onRefresh(done) {
        await this.getData(true);
        done && done()
      },
      async onInfinite(done) {
        this.queryParams.page++;
        const bool = await this.getData();
        done && done(!bool)
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
      tabList() {
        return ['已入账', '未入账']
      },
    },

    async created() {
      console.log(this.storeId, this.$route.query.item)
      this.queryParams = {
        ...this.queryParams,
        storeId: this.storeId,
        item: this.$route.query.item,
      }
      // 获取列表
      this.changeTab(0);
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  #BalanceList {
    /*min-height: calc(100vh - 80px);*/
    width: 100%;
    height: calc(100vh - 96px);
  }
</style>
