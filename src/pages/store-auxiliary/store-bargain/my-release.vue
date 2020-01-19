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
        v-if="bargains.length"
      >
        <dd-store-order
          class="bg-f mar-b"
          v-for="(item,key) in bargains"
          :order="item"
          :key="key"
          @click="goPointPage('/auxiliary/bargain/details?bargainId='+item.id)"
          @button="buttonMethods"
        >
          <div slot="desc">
            <p class="mar-b-20">
              <span class="fon-b  mar-r" :class="item.isOver?'col-9':'col-t'">底价:￥{{item.floorPrice}}</span>
              <span class="t-d-l col-9">原价:￥{{item.oldPrice}}</span>
            </p>
            <div class="flex-y-center col-6">
              <i class="iconfont icon-daojishi mar-r-10 mar-t-5" :class="item.isOver?'col-9':'col-t'"></i> 距结束：<span
              :class="item.isOver?'col-9':'col-t'">{{item.expireTime}}</span>
            </div>
          </div>
        </dd-store-order>
      </scroller>
      <not-data v-else-if="isRequest"/>
    </div>
    <Operation :show="showOperation"
               @close="showOperation = !showOperation"
               @choice="actionsOperation"
               :actions="actions"
    />
  </div>


</template>

<script>
  import DdTab from '@/components/template/other/tab'
  import DdStoreOrder from '@/components/template/dd-store/order-two'
  import {mapActions,mapState} from 'vuex'
  import {format, showDialog, timeStampToHMS} from "../../../util";
  import {getOperation} from "@/plugins/common/index";
  import Operation from "@/components/template/operation";
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {DdTab, DdStoreOrder, Operation},
    data() {
      return {
        isRequest: false,
        showOperation: false,
        tabs: [{title: '全部'},
          {title: '进行中', state: 2},
          {title: '已结束', state: 4},
          {title: '待审核', state: 1}
        ],
        bargains: [],
        actions: [],
        bargainId: null,
        params: {
          page: 1,
          size: 10,
          state: 0,//1待审核2进行中4已结束
        }
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeBargain", ["getMyReleaseBargain"]),
      ...mapActions("shop", ["getShopInfoByParams"]),
      tabsMethod(e) {
        console.log(e);
        this.params.state = e.item.state;
        this.onRefresh();
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getData(true)
        done && done();
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getData();
        done && done(!bool);
      },
      getExpireTime() {
        if (this.bargains.length && !this.interval) {
          let S = 1000;
          this.interval = setInterval(() => {
            const now = new Date().getTime();
            this.bargains.forEach((item, index) => {
              let timeStamp = item.endTime * 1000 - now;
              if (timeStamp <= 0) {
                item.expireTime = "00天00时00分00秒"
              } else {
                const time = timeStampToHMS(timeStamp, true).split(":");
                item.expireTime = time[0] + "天" + time[1] + "时" + time[2] + "分" + time[3] + "秒"
              }
            })
          }, S)

        }
      },
      buttonMethods(e) {
        console.log(e);

        switch (e.field) {
          case "ordeDetails":
            this.goPointPage({
              path: "/storeAuxiliary/storeBargain/myOrder",
              query: {
                bargainId: e.bargainId
              }
            })
            break;
          case "operation":
            console.log("operation")
            this.actions = [];
            let arr = ['delete', 'over', 'share', 'top', 'refresh', 'upOrDown'];
            e.isOver && arr.shift();
            this.bargainId = e.bargainId;
            this.actions = [{title: '商品编号：' + e.bargainId}].concat(getOperation(arr));
            this.showOperation = !this.showOperation
            break;
        }


      },
      actionsOperation(e) {
        switch (e.field) {
          case 'edit':
            console.log("编辑", e);
            this.goPointPage({
              path: '/storeAuxiliary/storeBargain/release',
              query: {
                bargainId: this.bargainId,
              }
            })


            break;
        }
      },
      async getData(refresh) {
        let result = await this.getMyReleaseBargain(this.params);
        result = result.map(item => {
          let tips = _.find(this.tabs, {
            state: +item.state
          }).title;
          let status = `<span class="${+item.state == 4 ? 'col-9' : 'col-t'}">${tips}</span>`;
          let bts = [
            {name: '订单详情', type: 'main', field: 'ordeDetails', bargainId: item.id},
            {name: '操作/编辑', type: 'default', field: 'operation', bargainId: item.id, isOver: +item.state == 4},
          ];
          +item.state == 4 && bts.shift();
          return {
            id: item.id,
            createTime: format(item.createdAt * 1000) + ' 发布',
            status,
            cover: {
              src: this.getSingleImg(item.logo),
              width: 1.8,
              height: 1.8,
              borderRadius: 0.16
            },
            floorPrice: item.floorPrice,
            oldPrice: item.price,
            title: item.title,
            tips: `已砍<span class="col-t">${item.receiveNum || 0}</span>份`,
            endTime: item.endTime,
            expireTime: "00天00时00分00秒",
            isOver: +item.state == 4,
            bts
          }
        })
        this.bargains = refresh ? result : this.bargains.concat(result);
        this.isRequest = true
        this.getExpireTime();
        return result.length >= this.params.size;
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
    },
    destroyed() {
      clearInterval(this.interval);
    }
  }


</script>
