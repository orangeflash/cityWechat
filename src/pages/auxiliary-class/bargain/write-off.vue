<template>

  <!--砍价核销页面-->

  <div class="">
    <Header/>
    <div class="pad-30 flex bg-f">
      <div class="h-175 w-175 miw-175 mar-r">
        <img-wrapper :src="bargainInfo.cover"/>
      </div>
      <div class="flex-g-1">
        <div class="order-title-r2">{{bargainInfo.title}}</div>
        <p class="col-9 mar-t mar-b">有效期至：{{bargainInfo.endTime}}</p>
        <div>
          <span class="col-t fon-xl">现价:￥{{orderInfo.money}}</span>
          <span class="t-d-l col-9">原价:￥{{bargainInfo.price}}</span>
        </div>
      </div>
    </div>
    <div class="dh flex-y-center bg-f fon-b pad-lr br-t-d">支付金额：<span class="col-t">￥{{(+orderInfo.money || 0).toFixed(2)}}</span></div>
    <div class="dh flex-y-center pad-lr col-9 fon-b">购买信息</div>
    <dd-store-data-list class="mar-b-20 bg-f4-i " v-bind="buyInfo"/>
    <DdButton
      class="mar-lr mar-t-100"
      name="确认核销"
      @click="beginWriteOff"
      type="release"
    />
  </div>


</template>

<script>
  import {mapActions} from 'vuex'
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import Chunk from '@/components/template/dd-store/chunk';
  import DdStoreDataList from "@/components/template/dd-store/data-list";
  import DdButton from "@/components/template/button"

  export default {
    mixins: [utilMixins],
    components: {Chunk, DdStoreDataList, DdButton},
    data() {
      return {
        bargainInfo: {},
        orderInfo: {},
        buyInfo: {
          height: 88,
          form: []
        },
      }
    },

    methods: {

      ...mapActions("storeAuxiliary/storeBargain", ["getBargainInfo", "bargainWriteOff"]),
      async getInfo(params) {
        showLoading();
        const res = await this.getBargainInfo(params)
        hideLoading();

        let logos = res.logo.map(item => {
          return {url: this.getSingleImg(item.url)}
        })

        /** 订单信息 */
        this.orderInfo = res.orderInfo || {}

        this.bargainInfo = {
          cover: logos[0].url,
          title: res.title,
          body: res.body,
          floorPrice: (+res.floorPrice || 0).toFixed(2),
          price: (+res.price || 0).toFixed(2),
          viewNum: res.viewNum || 0,
          joinNum: res.receiveNum || 0,
          bargainMoney: res.bargainMoney || 0,
          userName: res.user.userName || this.userInfo.userName,
          portrait: res.user.portrait || this.userInfo.portrait,
          bg: res.color || '#fff',
          state: res.state,    //1.发起砍价2砍价中3.点击购买4完成
          stock: res.stock || 0,
          id: res.id,
          shareNum: res.shareNum || 0,
          music: res.music,
          isFloor: +res.isFloor == 1,
          progress: ((res.bargainMoney && res.bargainMoney > 0 ? (res.bargainMoney / (res.price - res.floorPrice)) : 0) * 100).toFixed(2),
          imgs: res.media.map(item => {
            return this.getSingleImg(item.url);
          }),
          delivery: +res.delivery,
          endTime: format(res.endTime * 1000),
        }

        this.buyInfo.form = [
          {
            label: '姓名：',
            color: '#333',
            className: 'bg-f pad-r pad-l fon-b',
            info: `<span class="col-3">${this.bargainInfo.userName}</span>`
          }, {
            label: '电话：',
            color: '#333',
            className: 'bg-f pad-r pad-l fon-b mar-b-20',
            info: `<span class="col-3">${this.bargainInfo.linkTel || ''}</span>`
          },
          // {
          //   label: '兑换码：',
          //   color: '#333',
          //   className: 'bg-f pad-r pad-l br-b-d fon-b',
          //   info: `<span class="col-3">${this.orderInfo.code || ''}</span>`
          // },
          {
            label: '订单编号：  ',
            color: '#333',
            className: 'bg-f pad-r pad-l br-b-d fon-b',
            info: `<span class="col-3">${this.orderInfo.outTradeNo || ''}</span>`
          }, {
            label: '下单时间：',
            color: '#333',
            className: 'bg-f pad-r pad-l fon-b mar-b-10',
            info: `<span class="col-3">${format(this.orderInfo.createdAt * 1000) || ''}</span>`
          },
        ]
        this.storeInfo = {
          name: res.storeName,
          lat: res.lat,
          lng: res.lng,
          logo: this.getSingleImg(res.storeLogo),
          endTime: res.businessEndTime,
          startTime: res.businessStartTime,
          linkTel: res.linkTel,
          address: res.address,
          id: res.storeId,
        }
      },
      async beginWriteOff() {
        try {
          await showDialog("确认核销？")
          showLoading("核销中...")
          const res = await this.bargainWriteOff({
            id: this.orderInfo.id
          })
          hideLoading();
          showHandleStatusByFlag(res.code, "核销成功", res.msg, () => {
            this.getInfo({orderId: this.orderInfo.id})
          })
        } catch (e) {
          console.log(e)
        }
      }
    },
    created() {
      const query = this.$route.query;
      this.isFailParams({
        field: query.orderId,
        tips: '缺少商品id'
      }, () => {
        this.getInfo({orderId: query.orderId})
      })
    },
  }

</script>
