<template>

  <div class="write-off">
    <Header/>
    <div class="bg-f br-r-20 mar-30">
      <div class="pad-30 t-c">
        <p class="mar-b-40 pad-t">{{orderInfo.title}}</p>
        <p class="fon-46 col-t mar-b-40">{{orderInfo.discount}}</p>
        <div id="qrcode" class="mar-b-40" ref="qrcode" style="width:1.89rem;height: 1.89rem;margin: 0.4rem auto;"></div>
        <!--<p class="fon-xxl mar-b-40">兑换码：<em class="col-5c">123 456 789</em></p>-->
      </div>
      <dd-store-data-list class="mar-b-20 pad-r pad-l" :form="tips" :height="height"/>
      <div class="pad-r pad-l bg-f flex-wrap flex br-r-16">
        <span v-for="(item,key) in config" :key="key" class="mar-r-60 col-9 mar-b-20">
          <i class="iconfont icon-trues mar-r-10"></i>{{item}}
        </span>
      </div>
    </div>

    <chunk title="使用流程" class="mar-30" icon="icon-tubiaozhizuo-1">
      <div slot="content" class="pad-r pad-l">
        <dd-steps v-bind="stepsConfig" class="pad-t-10"/>
      </div>
    </chunk>
    <chunk title="适用商家" class="mar-30" icon="icon-tubiaozhizuo-1">
      <div slot="content" class="pad-r pad-l">
        <div class="flex-bt br-b-d">
          <div class="pad-b">
            <div class="mar-b">
              <user-info
                size="20"
                :src="storeInfo.logo"
                border-radius="44"
                :name="storeInfo.name"
                fontSize="30"
                infoColor="#999"
              />
            </div>

            <p class="col-9">营业时间：{{storeInfo.startTime}}-{{storeInfo.endTime}}</p>
          </div>
          <div class="flex-center"><i class="iconfont icon-dianhuahover col-t fon-xxl"
                                      @click="callTel(storeInfo.linkTel)"></i></div>
        </div>
        <div class="flex-bt pad-t pad-b">
          <div>
            <div class="lineH-38 mar-r pad-r">{{storeInfo.address}}</div>
            <!--<p class="col-9"></p>-->
          </div>
          <div class="flex-center" @click="openMap"><i class="iconfont icon-qunfengfabushangxian col-b fon-xxl"></i>
          </div>
        </div>
      </div>
    </chunk>
    <chunk title="购买信息" class="mar-30" icon="icon-tubiaozhizuo-1">
      <dd-store-data-list slot="content" class="mar-b-20 pad-r pad-l" v-bind="buyInfo"/>
    </chunk>
    <chunk title="优惠详情" class="mar-30" icon="icon-tubiaozhizuo-1">
      <div slot="content" class="pad-30 fon-b">
        {{orderInfo.body}}
        <div class="t-c">
          <img-wrapper :src="url" not-load="true" isShowView="true" v-for="(url,key) in orderInfo.pictures" :key="key"
                       class="dk mar-t mar-b-10" :pictures="orderInfo.pictures"/>
        </div>
      </div>
    </chunk>
  </div>

</template>


<script>
  import DdStoreDataList from "@/components/template/dd-store/data-list";
  import Chunk from '@/components/template/dd-store/chunk';
  import DdSteps from '@/components/template/other/steps';
  import UserInfo from "@/components/template/user";
  import {mapActions} from 'vuex'
  import {format} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {redirectPath} from "../../../project-config/base";
  import {openLocation} from "../../../util/wechat-util";

  export default {
    mixins: [utilMixins],
    components: {DdStoreDataList, Chunk, DdSteps, UserInfo},
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
        }
      }
    },
    methods: {
      ...mapActions('coupon', ['getCouponOrderInfo']),
      openMap() {
        openLocation(this.storeInfo)
      },
    },
    created() {

      let query = this.$route.query;
      this.isFailParams({
        field: query.orderId,
        tips: '缺少订单id',
      }, async () => {
        const info = await this.getCouponOrderInfo({id: query.orderId});
        console.log("info", info)

        info.type = +info.type == 1 ? '代金劵' : +info.type == 3 ? '优惠劵' : ' 折扣劵'

        // info.reduce = (+info.type == 1 || +info.type == 3 ? info.reduce + '元' : info.discount + '折');

        info.money = +info.money > 0 ? info.money + '元' : '免费'
        info.discount = info.reduce + info.type;

        info.condition = +info.condition > 0 ? '满' + info.condition + '元领取' : '无最低消费';

        this.tips = [
          {
            icon: 'icon-dian2',
            label: '使用条件：' + info.condition
          }, {
            icon: 'icon-dian2',
            label: '有效期至：' + format(new Date(info.endTime * 1000).getTime())
          }
        ]
        info.pictures = info.media.map(item => {
          return this.getSingleImg(item.url);
        })
        this.config = info.service;
        this.orderInfo = info;

        this.storeInfo = {
          logo: this.getSingleImg(info.storeLogo),
          name: info.storeName,
          address: info.address,
          startTime: info.businessStartTime,
          endTime: info.businessEndTime,
          lng: info.lng,
          lat: info.lat,
          linkTel: info.linkTel
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
            html: info.linkTel
          }, {
            label: '订单编号',
            className: 'br-b-d fon-b',
            html: info.outTradeNo
          }, {
            label: '下单时间',
            className: 'br-b-d fon-b',
            html: format(info.createdAt * 1000)

          }, {
            label: '订单金额',
            className: 'fon-b',
            html: `<span class="col-t">${info.money}</span>`
          }
        ]
        this.getQRCode({
          dom: this.$refs.qrcode,
          url: redirectPath + "/auxiliary/coupon/writeOff?appId="
            + localStorage.projectAppId + '&orderId=' + info.id
        })
      })

    }
  }
</script>
