<template>

  <div class="receive-details">
    <div class="posi-f w100">
      <Header/>
      <dd-tab :tabs="tabs" @click="tabsMethod"/>
    </div>
    <div class="posi-f w100" style="height: calc(100% - 95px);margin-top: 100px">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
      >
        <div class="bg-f pad-t pad-l pad-r pad-b-20 mar-b-20"
             v-for="(item,key) in list"
             :key="key"
        >
          <div class="flex ">
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
                <dd-store-data-list class="mar-b-20 flex-g-1 pad-l pad-r" :form="item.tips" :height="40"/>
                <div class="pad-r pad-l">
                  <i class="iconfont icon-dianhua2 fon-50 col-t" @click="callTel(item.linkTel)"></i>
                </div>
              </div>
            </div>
          </div>
          <dd-store-buttons
            class="pad-0"
            :bts="item.bts||[]"
            @click="buttonMethods"
          />
        </div>
      </scroller>
      <!--<not-data v-else-if="isRequest"/>-->
      <van-popup v-model="showInput">
        <div>
          <div class="dh flex-center fon-xl br-b-d" style="width: 6rem;">物流信息填写</div>
          <van-cell-group class="pad-30">
            <van-field
              v-model="paramsTwo.logisticsName"
              label="物流公司"
              placeholder="请输入物流公司名称"
              required
            />

            <van-field
              v-model="paramsTwo.logisticsCode"
              type="number"
              label="物流编号"
              placeholder="请输入物流编号"
              required
            />
          </van-cell-group>
          <dd-button
            type="release"
            class="mar-lr mar-b"
            name="确认"
            @click="beginDelivery"
          ></dd-button>
        </div>


      </van-popup>
    </div>
  </div>

</template>


<script>
  import DdTab from '@/components/template/other/tab'
  import Face from '@/components/template/face'
  import DdStoreDataList from "@/components/template/dd-store/data-list";
  import DdButton from "@/components/template/button"
  import {mapActions} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import DdStoreButtons from '@/components/template/dd-store/buttons'
  import {Toast} from 'vant'


  export default {
    components: {DdTab, Face, DdStoreDataList, DdStoreButtons, DdButton},
    data() {
      return {
        showInput: false,
        tabs: [
          {title: '全部'},
          {title: '未使用'},
          {title: '已使用'},
          {title: '已过期'},
        ],
        params: {
          page: 1,
          size: 10,
          goodsId: null,
          type: 0,
        },
        paramsTwo: {
          logisticsCode: '',
          logisticsName: '',
        },
        orderId: null,
        list: [],
        tipsMap: ["未付款", "已付款", "已发货", "已完成", "已过期",'已取消'],
      }
    },
    mixins: [utilMixins],
    methods: {
      ...mapActions("storeAuxiliary/storeAssemble", ["getAssembleInfo", "bossPayRefund", "deliveryOrder"]),
      ...mapActions('storeAuxiliary/storeRushbuy', ['getRushRushInfo','postRushDeliver']),
      async beginDelivery() {
        if (!this.paramsTwo.logisticsName.trim()) {
          return Toast.fail({
            message: '请输入物流公司名称'
          })
        }
        if (!this.paramsTwo.logisticsCode.trim()) {
          return Toast.fail({
            message: '请输入订单编号'
          })
        }
        this.showInput = !this.showInput;
        showLoading("数据提交中");
        const res = await this.postRushDeliver(this.paramsTwo);
        hideLoading();
        showHandleStatusByFlag(res.code, '提交成功', res.msg);
        setTimeout(() => {
          this.onRefresh();
        }, 1000)

      },
      async buttonMethods(e) {
        console.log(e)
        switch (e.field) {
          case 'refund': //退款
            try {
              await showDialog("确定进行退款？")
              const res = await this.bossPayRefund(e);
              showHandleStatusByFlag(res.code, '操作成功', res.msg);
              setTimeout(() => {
                this.onRefresh();
              })
            } catch (e) {
              console.log(e);
            }
            break;
          case 'inputOrder'://填写订单
            this.paramsTwo.orderId = e.orderId;
            this.showInput = !this.showInput;
            break;
        }
      },
      tabsMethod(item) {
        this.params.type = item.value;
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
        let result = await this.getRushRushInfo(this.params);
        console.log("result", result)
        result = result.map(item => {
          let tips = [
            {label: '联系人姓名：', info: item.receivedName},
            {label: '联系人电话：', info: item.receivedTel},
            {
              label: '购买数量：',
              info: '<em class="col-t">' + item.orderNum + '</em><em class="mar-l pad-l">支付金额：</em><span class="col-t">' + ((+item.totalMoney > 0 ? (+item.totalMoney).toFixed(2) + '元' : '免费') + '</span>')
            },
            {label: '订单编号：', info: item.outTradeNo},
            {label: '下单时间：', info: this.formatDateByTimeStamp(item.createdAt,"YYYY-MM-DD HH:mm:ss")},
            {label: '配送方式：', info: +item.delivery == 1 ? '快递配送' : '门店自取'}
          ];
          +item.delivery == 1 && tips.push({label: '收货地址：', info: item.receivedAddress});
          item.note && tips.push({label: '备注：', info: item.note})
          return {
            userName: item.receivedName,
            face: item.portrait,
            linkTel: item.receivedTel,
            state: this.tipsMap[+item.state],
            tips,
            bts:  +item.state == 1 && +item.delivery == 1
                ? [{name: '填写单号', type: 'default', field: 'inputOrder', orderId: item.orderId}] : []
            // bts: +item.state - 1 == 5
            //   ? [{name: '确认退款', type: 'main', field: 'refund', orderId: item.id}]
            //   : +item.state - 1 == 1 && +item.delivery == 1
            //     ? [{name: '填写单号', type: 'default', field: 'inputOrder', orderId: item.id}] : []
          }
        })
        console.log(result);
        this.list = refresh ? result : this.list.concat(result);
        hideLoading();
        this.isRequest = true;
        return result.length >= this.params.size;
      }
    },
    created() {
      const query = this.$route.query;
      this.isFailParams({
        field: query.goodsId,
        tips: '缺少id'
      }, () => {
        this.params.goodsId = query.goodsId;
        this.onRefresh();
      })
    }
  }


</script>
