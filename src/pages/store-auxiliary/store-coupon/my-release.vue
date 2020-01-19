<template>
  <div>
    <div class="posi-f w100 zIndex99">
      <Header/>
      <dd-tab :tabs="tabs" class="posi-r" @click="tabsMethod"/>
    </div>

    <div class="posi-f w100" v-if="params.storeId" style="height: calc(100% - 2rem);margin-top: 2.05rem">
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
          @click="goPointPage('/auxiliary/coupon/details?couponId='+item.id)"
          @button="buttonMethods"
        >
          <div slot="title" class="mar-t mar-b pad-t-10 lineH-38 pad-t-10">{{item.title}}</div>
          <div slot="desc" class="flex flex-y-center mar-b-20">
            <span class="col-t fon-xll mar-r-10"><em class="fon-xs">￥</em>{{item.money}}元</span>
            <span class="col-9 fon-xs">{{item.condition}}</span>
          </div>
          <div slot="down">
            <i class="iconfont icon-Group- col-6"></i>
            <span class="col-6 fon-sm">结束时间：<em class="col-t">{{item.endTime}}</em></span>
          </div>
        </dd-store-order>
      </scroller>
    </div>

    <Operation
      :show="showOperation"
      @close="showOperation=!showOperation"
      @choice="actionsOperation"
      :actions="actions"
    ></Operation>

  </div>

</template>

<script>
  import Operation from "@/components/template/operation"
  import DdStoreOrder from '@/components/template/dd-store/order-two'
  import DdTab from '@/components/template/other/tab'
  import {format, hideLoading, showDialog, showLoading} from "../../../util";  // 按钮组
  import {getOperation} from "@/plugins/common/index";
  import {mapActions,mapState} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {Toast} from 'vant'

  export default {
    mixins: [utilMixins],
    components: {DdStoreOrder, DdTab, Operation},
    data() {
      return {
        itemCounponId: null,
        hasMore: true,
        showOperation: false,
        actions: [],
        active: 0,
        tabs: [
          {title: '全部'},
          {title: '进行中'},
          {title: '已结束'},
          {title: '待审核'},
        ],
        orderList: [],
        sort: ['new', 'hot', 'good'],
        params: {
          page: 1,
          size: 10,
          sort: 'new',
          storeId: null
        }
      }
    },
    methods: {
      ...mapActions('coupon', ['getMyReleaseCoupon', 'delCoupon']),
      ...mapActions("shop", ["getShopInfoByParams"]),
      async actionsOperation(item) {
        console.log(item)
        switch (item.field) {
          case 'edit':
            if (this.itemCounponId) {
              this.goPointPage({
                path: '/storeAuxiliary/storeCoupon/storeCouponRelease',
                query: {
                  counponId: this.itemCounponId
                }
              })
            } else {
              Toast.fail({
                message: '非法操作',
                duration: 1500
              })
            }
            break;
          case 'delete':
            try {
              await showDialog('确定要删除该优惠劵吗？')
              const res = await this.delCoupon({
                id: this.itemCounponId
              });
              if (res.code == 1) {
                Toast.success({
                  message: res.msg,
                  duration: 1500
                });
                setTimeout(() => {
                  this.onRefresh();
                }, 1000)
              } else {
                Toast.fail({
                  message: res.msg,
                  duration: 1500
                })
              }

            } catch (e) {
              console.log(e)
            }

            break;
        }
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getOrderList(true);
        done && done()
      },
      async onInfinite(done) {

        if (!this.hasMore) {
          done && done(true)
        } else {
          this.params.page++;
          const bool = await this.getOrderList();
          done && done(!bool)
        }

      },
      async getOrderList(refresh) {
        showLoading();
        const result = await this.getMyReleaseCoupon(this.params);

        result.forEach(item => {
          item.condition = +item.condition > 0 ? '满' + item.condition + '元领取' : '无最低消费';

          if (+item.state) {
            item.bts = [
              {name: '领取详情', type: 'main', field: 'details', id: item.id},
              {name: '操作/编辑', type: 'default', field: 'operation', id: item.id, endTime: item.endTime * 1000},
            ]
          }
          item.state = +item.state == 0 ? '待审核' : +item.state == 1 ? '进行中' : +item.state == 4 ? '已结束' : ''
          item.endTime = format(new Date(item.endTime * 1000).getTime())
          item.cover = {
            src: this.getSingleImg(item.logo),
            width: 1.8,
            height: 1.8
          }
          item.createTime = format(new Date(item.createdAt * 1000).getTime()) + '发布'
          item.tips = '已领取' + item.receiveNum + '份'


        })
        hideLoading();
        this.orderList = refresh ? result : this.orderList.concat(result);
        this.hasMore = result.length >= this.params.size;
        return result.length >= this.params.size;
      },
      tabsMethod(v) {

        this.params.state = (() => {
          switch (v.value) {
            case 1:
              return 1;
            case 2:
              return 3;
            case 3:
              return 0;
            case 0:
              return null;
          }
        })();
        this.onRefresh();
      },
      buttonMethods(item) {
        console.log(item)
        switch (item.field) {
          case 'details':
            this.goPointPage('/auxiliary/coupon/myReleaseReceiveDetails?couponId=' + item.id)
            break;
          case 'operation':
            let operations = ['share', 'top', 'refresh', 'over', 'upOrDown', 'delete'];
            console.log(item.endTime);
            if (item.endTime < new Date().getTime()) {
              operations.splice(operations.length - 1, 1)
            }
            this.itemCounponId = item.id;
            this.actions = [{
              title: '优惠劵id:' + item.id
            }].concat(getOperation(operations));
            this.showOperation = !this.showOperation;
            break;
        }
      }
    },
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    created() {
      this.params.storeId=this.storeId
      this.onRefresh();
    }
  }

</script>
