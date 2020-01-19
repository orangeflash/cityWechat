<template>
  <!--优惠劵详情-->
  <dd-layout-div bg="#dde4ea" :pad="[0,0,30]">
    <Header/>
    <dd-layout-img :width="7.5" :height="4.6" :src='getInfo.logo'/>
    <ddMusic class="posi-f t0 r0 mar-t-150 mar-r" :autoPlay="true" v-if="getInfo.music"
             v-model="getInfo.music"/>
    <dd-layout-div :width="72" :height="72" :mar="[120,30,0]"
                   class="bg-0-5 col-f posi-a r0 t0 flex-center t-c let-space-5"
                   :line-height="26"
                   :font-size="22"
                   @click="showMask = !showMask"
                   :fillet="72">生成海报
    </dd-layout-div>
    <dd-layout-div :mar="[-100,30,0]" class="posi-r">
      <dd-layout-div class="bg-f" :fillet="30" :pad="[30,30,10]" :mar="[0,0,30,0]">
        <dd-layout-div class="fon-xll fon-wb" :line-height="48">{{getInfo.title}}</dd-layout-div>

        <dd-layout-div class="flex-center">
          <dd-layout-div class="flex-bt over-h flex-y-center" :pad="[0,0,0,30]" :height="138" :mar="[30,0]"
                         :fillet="10"
                         bg="linear-gradient(90deg,rgba(246,152,80,1) 0%,rgba(255,54,33,1) 100%)">
            <dd-layout-div class="t-c">
              <dd-layout-div class="fon-wb col-f" :font-size="46" :pad="[0,0,20]">
                {{getInfo.discount}}{{getInfo.label}}
              </dd-layout-div>
              <dd-layout-div class="col-f fon-xss">
                使用期限：{{getInfo.term&&getInfo.term[0]}}-{{getInfo.term&&getInfo.term[1]}}
              </dd-layout-div>
            </dd-layout-div>


            <dd-layout-div class="flex-col flex-bt flex-y-center" :height="138" :pad="[0,0,0,30]">
              <dd-layout-div :width="20" :height="20" :mar="[-10,0,0]" bg="#fff" :fillet="30"/>
              <dd-layout-div class="flex-g-1" :br="{left:'1px dotted #fff'}"/>
              <dd-layout-div :width="20" :height="20" :mar="[0,0,-10]" bg="#fff" :fillet="30"/>
            </dd-layout-div>
            <dd-layout-div class="flex flex-center" :pad="[0,30]" @click="confirm">
              <dd-layout-div class="col-f fon-lg fon-wb" :width="61" :line-height="40">立即领取</dd-layout-div>
            </dd-layout-div>

            <dd-layout-div :mar="[0,-7.5,0,0]">
              <dd-layout-div v-for="key in 10" :key="key" class="bg-f" :width="15" :height="15" :fillet="20"
                             :mar="[0,0,5]"/>
            </dd-layout-div>
          </dd-layout-div>
        </dd-layout-div>


        <dd-layout-div class="flex-center">
          <dd-layout-div class="col-price fon-wb fon-lg">￥{{getInfo.money}}</dd-layout-div>
          <dd-layout-div class="flex-g-0 fon-wb mar-l" v-if="getInfo.vipMoney > 0" bg="#FFE100" :pad="[10,12,6]"
                         :fillet="8">
            会员￥{{getInfo.vipMoney}}
          </dd-layout-div>
        </dd-layout-div>

        <dd-layout-div class="flex-center col-price" :pad="[30]">
          <i class="iconfont col-price icon-huo1 mar-t-05 mar-r-10"></i>已领{{getInfo.receiveNum}}份
        </dd-layout-div>


        <dd-layout-div class="flex-y-center flex-wrap" :mar="[10,0,0,0]">
          <dd-layout-div class="flex-y-center" v-for="(item,key) in getInfo.service" :key="key" :mar="[0,30,30,0]">
            <i class="iconfont col-price icon-trues mar-r-10 mar-t-05"></i>{{item}}
          </dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>

      <dd-layout-div class="over-h bg-f" :mar="[0,0,30]" :fillet="30">
        <dd-layout-div bg="#F3F7FA" :pad="[0,30]" class="fon-xll flex-y-center fon-wb" :height="95">温馨提示</dd-layout-div>
        <dd-layout-div :pad="[0,30]" :line-height="96">
          <dd-layout-div class="fon-sm fon-wb flex-y-center flex-bt br-b-e">
            <dd-layout-div class="fon-wb">使用条件</dd-layout-div>
            <dd-layout-div class="col-price fon-wb" v-if="getInfo.condition>0">消费满{{getInfo.condition}}元可用
            </dd-layout-div>
            <dd-layout-div class="col-price fon-wb" v-else>无最低消费</dd-layout-div>
          </dd-layout-div>
          <dd-layout-div class="fon-sm fon-wb flex-y-center flex-bt br-b-e">
            <dd-layout-div class="fon-wb">有效期</dd-layout-div>
            <dd-layout-div class="fon-w5">到 <span class="col-price">{{getInfo.endTime}}</span> 截止</dd-layout-div>
          </dd-layout-div>
          <dd-layout-div class="fon-sm fon-wb flex-y-center flex-bt">
            <dd-layout-div class="fon-wb">每人限领</dd-layout-div>
            <dd-layout-div class="fon-w5">{{getInfo.limitCollar}}</dd-layout-div>
          </dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>


      <dd-layout-div class="over-h bg-f" :mar="[0,0,30]" :fillet="30">
        <dd-layout-div bg="#F3F7FA" :pad="[0,30]" class="fon-xll flex-y-center fon-wb" :height="95">使用流程</dd-layout-div>
        <dd-layout-div :pad="[30]" class="flex-bt flex-y-center">

          <dd-layout-div class="t-c">
            <dd-layout-div class="mar-a flex-center" :width="150" :height="68" :fillet="30" bg="#F3F4F6">
              <i class="iconfont icon-wodeyouhuijuan col-6 fon-xxll"></i>
            </dd-layout-div>
            <dd-layout-div class="col-9 mar-t-20">参与领取</dd-layout-div>
          </dd-layout-div>
          <i class="iconfont icon-youjiantou2 col-6"></i>
          <dd-layout-div class="t-c">
            <dd-layout-div class="mar-a flex-center" :width="150" :height="68" :fillet="30" bg="#F3F4F6">
              <i class="iconfont icon-trues col-6 fon-xxll"></i>
            </dd-layout-div>
            <dd-layout-div class="col-9 mar-t-20">领取成功</dd-layout-div>
          </dd-layout-div>
          <i class="iconfont icon-youjiantou2  col-6"></i>
          <dd-layout-div class="t-c">
            <dd-layout-div class="mar-a flex-center" :width="150" :height="68" :fillet="30" bg="#F3F4F6">
              <i class="iconfont icon-saoma col-6 fon-xxll"></i>
            </dd-layout-div>
            <dd-layout-div class="col-9 mar-t-20">到店使用</dd-layout-div>
          </dd-layout-div>

        </dd-layout-div>
      </dd-layout-div>

      <dd-layout-div class="over-h bg-f" :mar="[0,0,30]" :fillet="30">
        <dd-layout-div bg="#F3F7FA" :pad="[0,30]" class="fon-xll flex-y-center fon-wb" :height="95">适用商家</dd-layout-div>
        <dd-layout-div class="flex flex-y-center"
                       @click="goPointPage('/shopDetail?storeId='+store.id)"
                       :pad="[30]" v-for="(store,key) in getInfo.storeList" :key="key">
          <dd-layout-img class="mar-r" :src="store.logo" :width="1.66" :height="1.66" :fillet="0.3"/>
          <dd-layout-div class="flex-g-1">
            <dd-layout-div class="flex">
              <dd-layout-div class="fon-wb fon-xll hide-e" :pad="[10,0]" max-w="100%">{{store.storeName}}
              </dd-layout-div>
            </dd-layout-div>

            <dd-layout-div class="flex-bt flex-y-center" :mar="[25,0]">
              <dd-layout-div class="flex-g-1 flex-bt pad-r-20">
                <span class="fon-sm">{{store.followNum }}粉丝</span>
                <span class="fon-sm">{{store.goodsNum }}商品</span>
                <span class="fon-sm"></span>
              </dd-layout-div>
              <i class="iconfont icon-iconfront-"></i>
            </dd-layout-div>
            <dd-layout-div class="flex">
              <dd-layout-div class="iconfont icon-xingxing mar-r-10 fon-xs" v-for="i in 5"
                             :color="i <= (store.star || 5)?'#f7af27':'#eee'"
                             :key="'s'+i"/>
            </dd-layout-div>
          </dd-layout-div>
        </dd-layout-div>

        <dd-layout-div bg="#F2F3F5" :pad="[0,30]" @click="openReport(couponInfo.id,8)"
                       class="fon-sm col-9 flex-y-center flex-bt" :height="95">
          如遇无效、虚假、诈骗信息，请立即举报哦！
          <i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>
        </dd-layout-div>

      </dd-layout-div>


      <dd-layout-div class="over-h bg-f" :mar="[0,0,30]" :fillet="30">
        <dd-layout-div bg="#F3F7FA" :pad="[0,30]" class="fon-xll flex-y-center fon-wb" :height="95">详情内容</dd-layout-div>
        <dd-layout-div :pad="[30,0]">
          <dd-layout-html :html="getInfo.body"/>
          <video v-if="getInfo.video" :src="getInfo.video" width="100%"
                 controls="controls" x5-playsinline="" playsinline="true" webkit-playsinline="true"
                 x-webkit-airplay="true" x5-video-player-type="h5"
                 x5-video-player-fullscreen="" x5-video-orientation="portraint"
          ></video>
          <dd-layout-div class="t-c" :pad="[0,30]">
            <img-wrapper :src="url" not-load="true" isShowView="true" v-for="(url,key) in getInfo.pictures"
                         :key="key"
                         class="dk mar-t mar-b-10 br-r-20" :pictures="getInfo.pictures"/>
          </dd-layout-div>
        </dd-layout-div>

      </dd-layout-div>

    </dd-layout-div>


    <!--海报部分-->
    <dd-poster-goods
      v-model="showMask"
      :label="getInfo.label"
      :cover="getInfo.logo"
      :price="getInfo.money"
      :title="getInfo.title"
      desc="长按识别二维码查看详情"
    />

  </dd-layout-div>
  <!--<div class="mask">-->
  <!--<img-wrapper v-if="couponInfo.logo" :src='couponInfo.logo'/>-->
  <!--</div>-->
  <!--<ddMusic class="posi-f t0 r0 mar-t-150 mar-r" :autoPlay="true" v-if="couponInfo.music"-->
  <!--v-model="couponInfo.music"/>-->
  <!--<div class="info mar-30 bg-f posi-r br-r-16 ">-->
  <!--<div class="info-up pad-30  t-c">-->
  <!--<p class="mar-b-40">{{couponInfo.title}}</p>-->
  <!--<p class="mar-b-40 col-t fon-46 ">{{couponInfo.discount}}</p>-->

  <!--<p class="mar-b col-f bg-t bt flex-center" v-if="couponInfo.receive == 3" @click="confirm">-->
  <!--{{+couponInfo.stock>0? +couponInfo.money-->
  <!--<=0?'免费':couponInfo.money:'不可' }}领取</p>-->
  <!--<p class="mar-b col-f bg-d bt flex-center" v-else-if="couponInfo.receive == 1">已领完</p>-->
  <!--<p class="mar-b col-f bg-d bt flex-center" v-else-if="couponInfo.receive == 2">每人限领次数超限</p>-->
  <!--<p class="mar-b col-f bg-d bt flex-center" v-else>不可领取</p>-->
  <!--<p class="mar-b-40 col-t"><i class="iconfont icon-huo mar-r"></i>已领取{{couponInfo.receiveNum}}份</p>-->
  <!--</div>-->
  <!--<dd-store-data-list class="mar-b-20 pad-l pad-r" :form="tips" :height="height"/>-->
  <!--<div class="pad-r pad-l bg-f flex-wrap flex br-r-16">-->
  <!--<span v-for="(item,key) in config" :key="key" class="mar-r-60 col-9 mar-b-20">-->
  <!--<i class="iconfont icon-trues mar-r-10"></i>{{item}}-->
  <!--</span>-->
  <!--</div>-->
  <!--</div>-->
  <!--<chunk title="使用流程" class="mar-30" icon="icon-tubiaozhizuo-1">-->
  <!--<div slot="content" class="pad-r pad-l">-->
  <!--<dd-steps v-bind="stepsConfig" class="pad-t-10"/>-->
  <!--</div>-->
  <!--</chunk>-->
  <!--<chunk title="适用商家" class="mar-30" icon="icon-tubiaozhizuo-1">-->
  <!--<div slot="content" class="pad-r pad-l">-->
  <!--<div class="flex-bt br-b-d">-->
  <!--<div class="pad-b">-->
  <!--<div class="mar-b">-->
  <!--<user-info-->
  <!--size="20"-->
  <!--:src="storeInfo.logo"-->
  <!--border-radius="44"-->
  <!--:name="storeInfo.name"-->
  <!--fontSize="30"-->
  <!--infoColor="#999"-->
  <!--/>-->
  <!--</div>-->
  <!--<p class="col-9">营业时间：{{storeInfo.startTime}}-{{storeInfo.endTime}}</p>-->
  <!--</div>-->
  <!--<div class="flex-center"><i class="iconfont icon-dianhuahover col-t fon-xxl"-->
  <!--@click="callTel(storeInfo.linkTel)"></i></div>-->
  <!--</div>-->
  <!--<div class="flex-bt pad-t pad-b">-->
  <!--<div>-->
  <!--<div class="lineH-38 mar-r pad-r">{{storeInfo.address}}</div>-->
  <!--&lt;!&ndash;<p class="col-9"></p>&ndash;&gt;-->
  <!--</div>-->
  <!--<div class="flex-center" @click="openMap"><i class="iconfont icon-qunfengfabushangxian col-b fon-xxl"></i>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</chunk>-->
  <!--<div class="flex-bt pad-t bg-f pad-b mar-lr pad-lr" @click="openReport(couponInfo.id,8)">-->
  <!--<div>-->
  <!--<div class="lineH-38 mar-r ">如遇无效、虚假等信息，请立即举报哦！</div>-->
  <!--</div>-->
  <!--<div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>举报</div>-->
  <!--</div>-->
  <!--<chunk title="优惠详情" class="mar-30" icon="icon-tubiaozhizuo-1">-->
  <!--<div slot="content" class="pad-30 fon-b">-->
  <!--{{couponInfo.body}}-->
  <!--<video v-if="couponInfo.video" :src="couponInfo.video" width="100%"-->
  <!--controls="controls" x5-playsinline="" playsinline="true" webkit-playsinline="true"-->
  <!--x-webkit-airplay="true" x5-video-player-type="h5"-->
  <!--x5-video-player-fullscreen="" x5-video-orientation="portraint"-->
  <!--&gt;</video>-->
  <!--<div class="t-c">-->
  <!--<img-wrapper :src="url" not-load="true" isShowView="true" v-for="(url,key) in couponInfo.pictures" :key="key"-->
  <!--class="dk mar-t mar-b-10" :pictures="couponInfo.pictures"/>-->
  <!--</div>-->
  <!--</div>-->
  <!--</chunk>-->
  <!--&lt;!&ndash;<dd-button&ndash;&gt;-->
  <!--&lt;!&ndash;class="mar-30"&ndash;&gt;-->
  <!--&lt;!&ndash;type="release"&ndash;&gt;-->
  <!--&lt;!&ndash;:name="couponInfo.money+'领取'"&ndash;&gt;-->
  <!--&lt;!&ndash;@click="confirm"&ndash;&gt;-->
  <!--&lt;!&ndash;&gt;</dd-button>&ndash;&gt;-->
  <!--<Car v-model="show"-->
  <!--:info="couponInfo"-->
  <!--@confirm="confirm"></Car>-->

  <!--</div>-->
</template>

<script>

  import DdStoreDataList from "@/components/template/dd-store/data-list";
  import Chunk from '@/components/template/dd-store/chunk';
  import Car from '@/components/template/dd-store/car';
  import DdSteps from '@/components/template/other/steps';
  import DdButton from "@/components/template/button"
  import UserInfo from "@/components/template/user";
  import DdMusic from "@/components/template/other/music"
  import {mapActions, mapState} from 'vuex'
  import {format, hideLoading, showDialog, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {Toast} from 'vant'
  import {openLocation, updateShareConfig} from "../../../util/wechat-util";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdLayoutHtml from "../../../components/layout/dd-layout-html";
  import DdPosterGoods from '../../../components/template/dd-poster/goods'


  export default {
    mixins: [utilMixins],
    components: {
      DdLayoutHtml,
      DdLayoutImg,
      DdStoreDataList,
      Chunk,
      DdSteps,
      DdButton,
      UserInfo,
      Car,
      DdMusic,
      DdPosterGoods
    },
    data() {
      return {
        show: false,
        showMask: false,
        couponInfo: {
          logo: '',
          title: '',
          discount: '',
          condition: '',
          receiveNum: 0
        },
        storeInfo: {},
        storeInfoList: [],
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
        config: ['线下核销', '需要预约', '茶水免费', '谢绝自带酒水线下核销', '提供WiFi'],
        height: 50,
        tips: [
          {
            icon: 'icon-dian2',
            label: '使用条件：'
          }, {
            icon: 'icon-dian2',
            label: '有效期至：'
          }, {
            icon: 'icon-dian2',
            label: '每人限领：'
          }
        ]
      }
    },
    methods: {
      ...mapActions('coupon', ['getCouponInfo', 'receiveCoupon']),
      ...mapActions("shop", ["getShopInfoByParams"]),
      openMap() {
        openLocation(this.storeInfo)
      },
      showPop() {
        this.show = !this.show;
      },
      async confirm() {

        if (+this.couponInfo.stock <= 0) return Toast({
          message: '已被抢空',
          duration: 1500
        })

        // 如果有vip价格的话那就拿取vip价格否则就拿取正常的价格。若开启了vip.但是vip价格不存在或者为零的话，就拿取正常价格
        console.log(this.platform.openVip && this.userInfo.isVip && +this.couponInfo.vipMoney > 0 ? this.couponInfo.vipMoney || parseFloat(this.couponInfo.money) : parseFloat(this.couponInfo.money))

        let money = (this.platform.openVip && this.userInfo.isVip && +this.couponInfo.vipMoney > 0 ? +this.couponInfo.vipMoney || parseFloat(this.couponInfo.money) : parseFloat(this.couponInfo.money)).toFixed(2)

        const needPay = !isNaN(money) && money > 0

        if (needPay) {
          try {
            await showDialog("需要支付：" + (+money).toFixed(2) + '元');
          } catch (e) {
            return console.log('老板，该优惠劵是要钱，我也想免费送给你，可是臣妾做不到啊')
          }
        }

        showLoading("领取中")
        const {data, msg} = await this.receiveCoupon({
          couponId: this.couponInfo.id
        });
        hideLoading();
        console.log("orderId", data);

        if (!needPay && +data > 0) {
          Toast.success({
            message: '领取成功',
            duration: 1500
          });
          setTimeout(() => {
            this.getData({couponId: this.couponInfo.id})
          }, 1500)

        } else if (needPay && +data > 0) {
          if (needPay) {
            this.$router.push({
              name: 'cashier',
              params: {
                type: 36,
                param: {
                  orderId: data
                },
                info: {
                  money: money,
                  type: "领取优惠劵",
                }
              }
            });
          } else {

          }


        } else {
          Toast.fail({
            message: msg,
            duration: 1500
          })
        }
        //this.goPointPage('/auxiliary/coupon/receiveDetails')
      },
      async getData(query) {
        showLoading();
        try {
          const info = await this.getCouponInfo({id: query.couponId})

          // info.logo = this.getSingleImg(info.logo);
          //
          // info.reduce = (+info.type == 1 || +info.type == 3 ? info.reduce + '元' : info.discount + '折');
          //
          // info.type = +info.type == 1 ? '代金劵' : +info.type == 3 ? '优惠劵' : ' 折扣劵'
          //
          // info.money = +info.money > 0 ? info.money + '元' : '免费';
          //
          // info.discount = info.reduce + info.type;
          //
          // info.condition = +info.condition > 0 ? '满<span class="col-price">' + info.condition + '</span>元可用' : '无最低消费';
          //
          // this.tips = [
          //   {
          //     icon: 'icon-dian2',
          //     label: '使用条件：' + info.condition
          //   }, {
          //     icon: 'icon-dian2',
          //     label: '有效期至：' + format(new Date(info.endTime * 1000).getTime())
          //   }, {
          //     icon: 'icon-dian2',
          //     label: `每人限领：${+info.max == 0 ? '不限此时' : `每个用户限领${info.max}次`}`
          //   }
          // ]
          //
          //
          // info.pictures = info.media.map(item => {
          //   return this.getSingleImg(item.url);
          // })
          // this.config = info.service;
          //
          // if (this.platform.openVip && this.userInfo.isVip && !isNaN(info.vipMoney) && +this.couponInfo.vipMoney > 0) {
          //   info.money = +info.vipMoney
          // }

          this.storeInfoList = await this.getShopInfoByParams({
            adminId: info.userId,status:1
          });

          this.couponInfo = info;

          this.storeInfo = {
            logo: this.getSingleImg(info.storeLogo),
            name: info.storeName,
            address: info.address,
            startTime: info.businessStartTime,
            endTime: info.businessEndTime,
            lng: info.lng,
            lat: info.lat,
            linkTel: info.linkTel,

          }

          updateShareConfig({
            title: this.couponInfo.title,
            imgUrl: this.getSingleImg(this.couponInfo.logo),
            desc: this.couponInfo.body,
          })

        } catch (e) {
          console.log(e);
        }
        hideLoading();
      }
    }
    ,
    created() {
      let query = this.$route.query;
      this.isFailParams({
        field: query.couponId,
        tips: '缺少优惠劵id',
      }, async () => {
        this.getData(query)
      })
    },
    computed: {
      ...mapState({
        platform: s => s.platform,
        userInfo: s => s.user
      }),
      getInfo() {
        const data = this.couponInfo,
          storeList = this.storeInfoList.map(item => {
            return {
              ...item,
              logo: item.storeLogo && item.storeLogo.length > 10 ? this.getSingleImg(JSON.parse(item.storeLogo)[0].url) : ''
            }
          });

        if (!data.id) return {}


        const money = (+data.money || 0).toFixed(2)
        return {
          ...data,
          logo: this.getSingleImg(data.logo),
          vipMoney: (+data.vipMoney || 0).toFixed(2),
          term: [format(new Date(data.createdAt * 1000).getTime()).split(" ")[0], format(new Date(data.endTime * 1000).getTime()).split(" ")[0]],
          money: money > 0 ? money : +data.stock > 0 ? '免费领取' : '不可领取',
          limitCollar: `${+data.max == 0 ? '不限此时' : `每个用户限领${data.max || ''}次`}`,
          endTime: format(new Date((data.endTime || 0) * 1000).getTime()),
          label: +data.type == 1 ? '代金劵' : +data.type == 3 ? '优惠劵' : ' 折扣劵',
          discount: data.type == 1 || data.type == 3 ? data.reduce + '元' : data.type == 2 ? data.discount + '折' : '',
          pictures: data.media.map(item => {
            return this.getSingleImg(item.url)
          }),
          storeList,
        }
      }
    },
  }

</script>
