<template>
  <div>
    <dd-tab class="posi-f w100 zIndex99" :tabs="tabs" @click="tabsMethod"/>
    <div class="posi-f w100" style="height: calc(100% - 2rem);margin-top: 1.05rem;">
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
          @button="buttonMethods"
        >
          <div slot="title" class="mar-b-10 fon-b flex-y-center"><span
            class="label fon-xs mar-r-10">{{item.typeName}}</span>{{item.name}}
          </div>

          <dd-store-data-list slot="desc" class="mar-b-10 flex-g-1" :form="item.info" :height="height"/>
          <div slot="down" class="flex-bt flex-y-center">
            <div>
              <span class="col-t fon-xxl">{{item.discount}}</span>
              <em class="col-t">{{item.condition}}</em>
            </div>
            <span class="col-f pad-14-20-10"
                  style="border-radius: 20px;"
                  :class="item.state == 1?'bg-t':'bg-9'"
                  @click="item.state == 1&&goPointPage('/auxiliary/coupon/receiveDetails?orderId='+item.id)"
            >{{tabs[item.state].title}}</span>
          </div>
        </dd-store-order>
      </scroller>
      <not-data v-else-if="isRequest"/>
    </div>
  </div>

</template>

<script>

  import DdStoreOrder from '@/components/template/dd-store/order-two'
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
          {title: '未核销'},
          {title: '已使用'},
          {title: '已结束'},
        ],
        orderList: [],
        hasMore: true,
        height: 40,
        isRequest: false,
        params: {
          page: 1,
          size: 10,
          type: 0,
        }
      }
    },
    methods: {
      ...mapActions("coupon", ["getMyReceive"]),
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
        let result = await this.getMyReceive(this.params);
        result = result.map(item => {
          return {
            name: item.title,
            typeName: +item.type == 1 ? '代金劵' : +item.type == 3 ? '优惠劵' : ' 折扣劵',
            cover: {
              src: this.getSingleImg(item.logo),
              width: 1.74,
              height: 1.74
            },
            info: [
              {label: '有效期至：' + format(item.endTime * 1000)},
              {label: '购买数量：1 '},
              {label: '支付金额： ' + (+item.money > 0 ? item.money + '元' : '免费')},
            ],
            id: item.id,
            discount: +item.type == 1 || +item.type == 3 ? item.reduce + '元' : item.discount + '折',
            condition: +item.condition > 0 ? '满' + (+item.condition).toFixed(2) + '元可使用' : '无最低消费',
            state: +item.state,
            couponId: item.couponId
          }
        })

        hideLoading();
        this.orderList = refresh ? result : this.orderList.concat(result);
        this.isRequest = true;
        this.hasMore = result.length >= this.params.size;
        return this.hasMore;
      },
      tabsMethod(v) {
        this.params.state = v.value;
        this.onRefresh();
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
