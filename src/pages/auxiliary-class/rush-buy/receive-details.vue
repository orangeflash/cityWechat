<template>

  <div class="write-off">
    <Header/>
    <div class="bg-f br-r-20 mar-30">
      <div class="pad-30 t-c">
        <p class="mar-b-40 pad-t fon-lg lineH-40">{{orderInfo.title}}</p>
        <div v-if="orderInfo.delivery=='2'" id="qrcode" class="mar-b-40" ref="qrcode" style="width: 3rem;height: 3rem;margin: 0.4rem auto;"></div>
        <!--<p class="fon-xxl mar-b-40">兑换码：<em class="col-5c">123 456 789</em></p>-->
      </div>
      <dd-store-data-list class="mar-b-20 pad-r pad-l" :form="tips" :height="height"/>
      <div class="pad-r pad-l bg-f flex-wrap flex br-r-16">
        <span v-for="(item,key) in config" :key="key" class="mar-r-60 col-9 mar-b-20">
          <i class="iconfont icon-trues mar-r-10"></i>{{item}}
        </span>
      </div>
    </div>

    <!--<chunk title="使用流程" class="mar-30" icon="icon-tubiaozhizuo-1">-->
      <!--<div slot="content" class="pad-r pad-l">-->
        <!--<dd-steps v-bind="stepsConfig" class="pad-t-10"/>-->
      <!--</div>-->
    <!--</chunk>-->
    <chunk title="购买信息" class="mar-30" icon="icon-tubiaozhizuo-1">
      <dd-store-data-list slot="content" class="mar-b-20 pad-r pad-l" v-bind="buyInfo"/>
    </chunk>
    <chunk v-if="orderInfo.logisticsCode&&orderInfo.delivery=='1'" title="物流信息" class="mar-30" icon="icon-tubiaozhizuo-1">
      <div slot="content" class="">
        <CellList class="col-9" title="物流名称" extra-class="col-3" :extra="orderInfo.logisticsName"></CellList>
        <CellList class="col-9" title="物流单号">
          <div slot="footer" class="flex-y-center">
            <div>{{orderInfo.logisticsCode}}</div>
            <div v-clipboard:copy="orderInfo.logisticsCode" v-clipboard:success="onCopy" class="box-btn pad-0 pad-lr10 fon-sm">复制</div>
          </div>
        </CellList>
        <!--<div class="foot-mar-btn posi-r" style="padding: 0.3rem 0.5rem;">-->
          <!--<button @click="confirm">确认收货</button>-->
        <!--</div>-->
      </div>
    </chunk>
    <chunk title="适用商家" class="mar-30" icon="icon-tubiaozhizuo-1">
      <div slot="content" class="">
        <CellList @click="callTel(orderInfo.linkTel)" ft-icon="icon-dianhuahover fon-45 col-r">
          <div slot="content">
            <div class="flex-y-center">
              <img class="br-r-c mar-r-10" style="width: 0.5rem;height: 0.5rem" :src="getSingleImg(orderInfo.storeLogo)"/>
              <span>{{orderInfo.storeName}}</span>
            </div>
            <div class="mar-t-10 col-9 fon-sm">营业时间:{{orderInfo.businessStartTime}}-{{orderInfo.businessEndTime}}</div>
          </div>
        </CellList>
        <CellList @click="openMap" ft-icon="icon-qunfengfabushangxian fon-45 col-b" :content="orderInfo.address"></CellList>
      </div>
    </chunk>
    <chunk title="优惠详情" class="mar-30" icon="icon-tubiaozhizuo-1 fon-b">
      <div slot="content" class="fon-b">
        <div class="base-pad" v-html='orderInfo.details'></div>
        <div class="details-imgs">
          <img-wrapper :isShowView="true" :pictures="getMediaList(orderInfo.detailImgs).img" v-for="(item,index) in getMediaList(orderInfo.detailImgs).img" :key="index" :src="item" not-load="true"/>
        </div>
      </div>
    </chunk>
  </div>

</template>


<script>
  import LayoutOne from "../../../components/template/dd-article/layout-one";
  import CellList from "../../../components/template/dd-store/cell-list";
  import DdStoreDataList from "../../../components/template/dd-store/data-list";
  import Chunk from '@/components/template/dd-store/chunk';
  import DdSteps from '@/components/template/other/steps';
  import UserInfo from "@/components/template/user";
  import DdButton from "@/components/template/button"
  import {mapActions} from 'vuex'
  import {format, hideLoading, showHandleStatusByFlag, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {redirectPath} from "../../../project-config/base";
  import {openLocation} from "../../../util/wechat-util";

  export default {
    mixins: [utilMixins],
    components: {LayoutOne,CellList,DdStoreDataList, Chunk,DdButton, DdSteps, UserInfo},
    data() {
      return {
        orderInfo: {},
        stepsConfig: {
          active: 3,
          steps: [{
            name: "参与领取",
            width: 94,
            height: 94,
            icon: 'icon-wodeyouhuijuan fon-xxl mar-t-10'
          }, {
            name: "领取成功",
            width: 94,
            height: 94,
            icon: 'icon-llingquxianjinquan fon-xxl mar-t-10'
          }, {
            name: "到店核销",
            width: 94,
            height: 94,
            icon: 'icon-saoma fon-xxl mar-t-10'
          }],

          color: '#333'
        },
        buyInfo: {
          height: 88,
          form: []
        },
        height: 50,
        tips: [],
        config: ['线下核销', '需要预约', '茶水免费', '谢绝自带酒水线下核销', '提供WiFi'],
        storeInfo: {
          logo: '',
          name: ''
        },
        state:['','已付款','已发货','已完成','已过期'],
      }
    },
    methods: {
      ...mapActions('rushBuy',['getRushOrderInfo']),
      ...mapActions("storeAuxiliary/releaseGood", ["getAddressInfo"]),
      openMap() {
        openLocation(this.storeInfo)
      },
      onCopy: function (e) {
        console.log(e)
        showHandleStatusByFlag([true, '复制成功'])
      },
    },
    created() {

      let query = this.$route.query;
      this.isFailParams({
        field: query.id,
        tips: '缺少订单id',
      }, async () => {
        showLoading()
        const info = await this.getRushOrderInfo({id: query.id});
        //console.log("info", info)
        hideLoading()
        info.money = +info.totalMoney > 0 ? info.totalMoney + '元' : '免费'

        this.tips = [
          {
            icon: 'icon-dian2',
            label: '每人限购：' +'每个用户限购'+ info.limitNum+'份'
          }, {
            icon: 'icon-dian2',
            label: '有效期至：' + this.formatDateByTimeStamp(info.expireTime,"YYYY-MM-DD HH:mm")
          }
        ]
        this.config = info.label;
        this.orderInfo = info;

        this.storeInfo = {
          logo: this.getSingleImg(info.storeLogo),
          name: info.storeName,
          address: info.address,
          startTime: info.businessStartTime,
          endTime: info.businessEndTime,
          lng: info.lng,
          lat: info.lat
        }
        this.buyInfo.form = [
          {
            label: '购买用户',
            className: 'br-b-d fon-b',
            html: `<div class="flex-y-center">
                      <img
                        class="br-r-c mar-r"
                        style="width: 0.48rem;height: 0.48rem;"
                        src="${info.portrait}"/>
                      ${info.userName}
                   </div>`
          }, {
            label: '手机号',
            className: 'br-b-d fon-b',
            html: info.receivedTel
          }, {
            label: '订单编号',
            className: 'br-b-d fon-b',
            html: info.outTradeNo
          }, {
            label: '购买数量',
            className: 'br-b-d fon-b',
            html: info.orderNum

          },{
            label: '下单时间',
            className: 'br-b-d fon-b',
            html: this.formatDateByTimeStamp(info.createdAt,"YYYY-MM-DD HH:mm:ss")

          },{
            label: '订单金额',
            className: 'br-b-d fon-b',
            html: `<span class="col-t">${info.money}</span>`
          },{
            label: '收货地址',
            className: 'br-b-d fon-b',
            html: `<div class="pad-20 t-r fon-sm"><div>收货人：${info.receivedName}<span> ${info.receivedTel}</span></div><div class="mar-t-10">${info.receivedAddress}</div></div>`
          },{
            label: '订单备注',
            className: 'br-b-d fon-b',
            html: info.note||'无'
          },{
            label: '订单状态',
            className: 'fon-b',
            html: `<span class="col-t">${this.state[info.state]}</span>`
          }
        ]
        if (info.delivery == 2 && info.selfId) {
          this.getAddressInfo({addressId: info.selfId}).then(result => {
            let obj={
                label: '自提地址',
                className: 'br-b-d fon-b',
                html: `<div class="pad-20 t-r fon-sm"><div>${result.linkName}<span>  ${result.linkTel}</span></div><div class="mar-t-10">${result.address+result.detailedAddress}</div></div>`
              }
            this.$set(this.buyInfo.form,6,obj)
          })
        }
        //info.delivery!='1'&&(this.$delete(this.buyInfo.form,6))
        setTimeout(()=>{
          this.getQRCode({
            dom: this.$refs.qrcode,
            url:redirectPath + "/auxiliary/vip/verificationVip?appId="
              + localStorage.projectAppId + "&id=" + info.goodsId +"&hxId=" + info.id + "&pageType=rushBuyDetails",
          })
        },100)
      })

    }
  }
</script>
