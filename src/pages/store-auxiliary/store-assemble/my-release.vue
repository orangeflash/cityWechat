<template>

  <div>
    <div class="posi-f w100">
      <Header/>
      <dd-tab :tabs="tabs" @click="tabsMethod"/>
    </div>
    <div class="posi-f w100" style="height: calc(100% - 95px);margin-top: 100px">
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
          @click="goPointPage('/auxiliary/assemble/goodsDetails?assembleId='+item.id)"
          @button="buttonMethods"
        >
          <div slot="title" class="mar-b-20 fon-b lineH-40">{{item.name}}</div>

          <!--<dd-store-data-list slot="desc" class="mar-b-10 flex-g-1" :form="item.info" :height="height"/>-->
          <div slot="down" class="flex-bt flex-y-center pad-t">
            <div>
              <span class="col-t fon-xxl">{{item.money}}</span>
              <em class="col-9 t-d-l">{{item.oldMoney}}</em>
            </div>
          </div>
        </dd-store-order>
      </scroller>
      <not-data v-else-if="isRequest"/>
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
  import DdTab from '@/components/template/other/tab'
  import DdStoreOrder from '@/components/template/dd-store/order-two'
  import {mapActions, mapState} from 'vuex'
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {getOperation} from "@/plugins/common/index";

  export default {

    mixins: [utilMixins],
    components: {DdTab, DdStoreOrder, Operation},
    data() {
      return {
        showOperation: false,
        isRequest: false,
        actions: [],
        tabs: [
          {title: '全部'},
          {title: '进行中'},
          {title: '待审核'},
          {title: '已下架'},
        ],
        itemAssembleId: null,
        orderList: [],
        params: {
          page: 1,
          size: 10,
          storeId: null,
        }
      }
    },
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    methods: {
      ...mapActions("storeAuxiliary/storeAssemble", ["getMyRelaseAssemble", "delAssembleGoods"]),
      tabsMethod(e) {
        this.params.type = e.value
        this.onRefresh();
      },

      async actionsOperation(item) {
        console.log(item)
        switch (item.field) {
          case 'edit':
            if (this.itemAssembleId) {
              this.goPointPage({
                path: '/storeAuxiliary/storeAssemble/release',
                query: {
                  assembleId: this.itemAssembleId
                }
              })
            } else {

            }
            break;
          case 'delete':
            try {
              await showDialog("您确定要删除该拼团？");
              const res = await this.delAssembleGoods({
                goodsId: this.itemAssembleId
              })
              showHandleStatusByFlag(res.code, "删除成功", res.msg);
              setTimeout(() => {
                this.onRefresh();
              }, 1500)

            } catch (e) {
              console.log(e);
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
        let bool = false;
        if (this.hasMore) {
          this.params.page++;
          bool = await this.getOrderList();
        }
        done && done(!bool)
      },
      async getOrderList(refresh) {
        showLoading()
        this.params.storeId = this.storeId;
        let result = await this.getMyRelaseAssemble(this.params);
        console.log("result", result)
        result = result.map(item => {
          return {
            cover: {
              src: item.showImgs[0] && this.getSingleImg(item.showImgs[0].url),
              width: 1.7,
              height: 1.7,
            },
            createTime: format(item.createdAt * 1000) + " 发布",
            state: this.tabs[+item.state].title,
            tips: '已拼' + item.salesNum + '份',
            name: item.title,
            money: '￥' + item.groupPrice,
            oldMoney: '￥' + item.originalPrice,
            id: item.id,
            bts: [
              {name: '拼团详情', type: 'main', field: 'details', id: item.id},
              {name: '操作/编辑', type: 'default', field: 'operation', id: item.id},
            ]
          }
        })
        hideLoading();
        this.orderList = refresh ? result : this.orderList.concat(result);
        console.log("getMyAssembleOrders", result);
        this.hasMore = result.length >= this.params.size;
        return this.hasMore
      },
      buttonMethods(e) {
        console.log(e);
        switch (e.field) {
          case "details":
            this.goPointPage('/auxiliary/assemble/receiveDetails?goodsId=' + e.id);
            break;
          case 'operation':
            let operations = ['share', 'top', 'refresh', 'over', 'upOrDown'];
            this.itemAssembleId = e.id;
            this.actions = [{
              title: '拼团id:' + e.id
            }].concat(getOperation(operations));
            this.showOperation = !this.showOperation;
            break;
        }
      }
    },
    created() {
      this.onRefresh();
    }
  }

</script>
