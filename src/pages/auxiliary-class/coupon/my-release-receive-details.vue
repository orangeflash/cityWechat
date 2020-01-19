<template>

  <div>
    <div class="posi-f w100">
      <Header/>
      <dd-tab :tabs="tabs" @click="tabsMethod"/>
    </div>
    <div class="posi-f w100" style="height: calc(100% - 95px);margin-top: 100px">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="list.length"
      >
        <div class="flex bg-f pad-t pad-l pad-r mar-b-20"
             v-for="(item,key) in list"
             :key="key"
        >
          <div>
            <face
              :src="item.face"
              size="40"
            />
          </div>
          <div class="flex-g-1 ">
            <div class="flex-bt mar-b-10 mar-r mar-l-30 flex-y-center pad-t-10">
              <span class="fon-lg">{{item.userName}}</span>
              <span class="col-t">{{item.state}}</span>
            </div>
            <div class="flex-bt flex-center">
              <dd-store-data-list class="mar-b-20 flex-g-1 pad-l pad-r" :form="item.tips" :height="height"/>
              <div class="pad-r pad-l">
                <i class="iconfont icon-dianhua2 fon-50 col-t" @click="callTel(item.linkTel)"></i>
              </div>
            </div>
          </div>
        </div>
      </scroller>
      <not-data v-else-if="isRequest"/>
    </div>
  </div>

</template>

<script>
  import DdTab from '@/components/template/other/tab'
  import Face from '@/components/template/face'
  import DdStoreDataList from "@/components/template/dd-store/data-list";

  import {mapActions} from 'vuex'
  import {format, hideLoading, showLoading} from "../../../util";

  export default {
    components: {DdTab, Face, DdStoreDataList},
    data() {
      return {
        tabs: [
          {title: '全部'},
          {title: '未核销'},
          {title: '已使用'},
          {title: '已过期'},
        ],
        tips: [],
        isRequest: false,
        height: 40,
        params: {
          page: 1,
          size: 10,
          couponId: null,
          state: 0,
        },
        list: [],
      }
    },
    methods: {
      ...mapActions('coupon', ['getMyCouponReciveList']),
      tabsMethod(item) {
        this.params.state = item.value;
        this.onRefresh();
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getList(true);
        done && done(true);
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getList();
        done && done(!bool);
      },
      async getList(refresh) {
        showLoading();
        let result = await this.getMyCouponReciveList(this.params);

        result = result.map(item => {
          return {
            userName: item.userName,
            face: item.portrait,
            linkTel: item.userTel,
            state: +item.state == 1 ? '待核销' : +item.state == 2 ? '已核销' : +item.state == 3 ? '已过期' : '',
            tips: [
              {label: '联系人姓名：' + item.userName},
              {label: '联系人电话：' + item.userTel},
              {label: '支付金额：' + (+item.money > 0 ? (+item.money).toFixed(2) + '元' : '免费')},
              {label: '订单编号：' + item.outTradeNo},
              {label: '下单时间：' + format(item.createdAt * 1000)},
            ]
          }
        })
        this.list = refresh ? result : this.list.concat(result);
        hideLoading();
        this.isRequest = true;
        return result.length >= this.params.size;
      }
    },
    created() {
      const query = this.$route.query;
      this.isFailParams({
        field: query.couponId,
        tips: '缺少优惠劵id',
        success() {
          try {
            this.params.couponId = query.couponId;
            this.onRefresh();
          } catch (e) {
            console.log(e)
          }
        }
      })


    }
  }

</script>
