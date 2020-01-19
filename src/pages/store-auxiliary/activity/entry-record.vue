<template>

  <!--入账记录-->
  <div class="entry-record">
    <Header/>
    <van-tabs v-model="active" @click="changeTab">
      <van-tab :title="item" v-for="(item,key) in tabs" :key="key"></van-tab>
    </van-tabs>
    <div class="dh pad-l pad-r flex-y-center col-9">已入账的收入将汇入到“商家余额”，可进行商家余额提现</div>
    <div class="ps-f" style="height: calc(100% - 2.8rem);">
      <scroller
        v-if="record.length>0"
        :onRefresh="onRefresh"
        :onInfinite="onInfinite"
      >
        <ul>
          <li class="pad-30 bg-f br-b-d" v-for="(item,key) in record" :key="key">
            <div class="flex flex-bt mar-b-20 flex-y-center">
              <div>
                <span>{{item.time}}</span>
              </div>
              <span class="fon-xl"
                :class="+item.state==1?'col-9':'col-t '"
              >+{{item.money}}</span>
            </div>
            <div class="flex-bt col-9 flex-y-center">
              <div>订单号：{{item.orderNum}}</div>
              <div>{{+item.state==1?'未到账':'已到账'}}</div>
            </div>
          </li>
        </ul>
      </scroller>
      <not-data v-else-if="isRequest"/>
    </div>
  </div>
</template>

<script>

  import {mapActions, mapState} from 'vuex';
  import {format} from "../../../util";

  export default {
    data() {
      return {
        active: 0,
        record: [],
        isRequest: false,
        tabs: ["未入账", "已入账"],
        params: {
          page: 1,
          size: 10,
          storeId: null,
          type: 1,
        }
      }
    },
    methods: {
      ...mapActions("activity", ["getStoreEntryRecord"]),
      /** 刷新 */
      async onRefresh(done) {
        this.params.page = 1;
        await this.getEntryRecord(true);
        done && done()
      },
      /** 加载更多 */
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getEntryRecord();
        done && done(!bool)
      },
      /** 获取入账明细 */
      async getEntryRecord(refresh) {

        this.params.type = this.active + 1;

        const result = await this.getStoreEntryRecord(this.params);
        this.isRequest = true;

        result.forEach(item => {

          item.time = format(item.createdAt * 1000);
          item.time = item.time.substr(5, item.time.length - 1);
          item.orderNum = item.outTradeNo

        })

        this.record = refresh ? result : this.record.concat(result);
        return result.length >= this.params.size;
      },
      changeTab() {
        this.onRefresh();
      }
    },
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId
      }),
    },
    created() {
      this.isFailParams({
        field: this.storeId,
        tips: '信息错误',
        success() {
          this.params.storeId = this.storeId;
          console.log("开始获取")
          this.onRefresh();
        }
      })


    }
  }

</script>
