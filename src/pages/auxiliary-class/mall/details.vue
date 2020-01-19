<template>
  <div class="mall-details" v-if="goodsInfo.id">
    <dd-goods-header
      v-bind="goodsHeader"
    />
    <dd-layout-div :height="98"/>
    <!--<div class="space"></div>-->
    <a id="top"></a>
    <banner
      :swiper="{children:getInfo.banners}"
      :height="375"
      :showImage="true"
    >
      <dd-layout-div slot="float" :pad="[30]">
        <!--<dd-layout-div :width="72" :height="72" :mar="[18,0,0]" :fillet="72" class="bg-0-5 flex-center">-->
        <!--<i class="iconfont icon-chakantieziguanzhu col-f fon-40 mar-t-10"></i>-->
        <!--</dd-layout-div>-->
        <dd-layout-div :width="72" :height="72" :mar="[18,0,0]" class="bg-0-5 col-f flex-center t-c let-space-5"
                       :line-height="26"
                       :font-size="22"
                       @click="showMask = !showMask"
                       :fillet="72">生成海报
        </dd-layout-div>
      </dd-layout-div>
    </banner>


    <!--标题部分-->
    <dd-layout-div class="bg-f" :pad="[40,30,0]" :mar="[0,0,20,0]">
      <dd-layout-div class="fon-xxl fon-wb dis-ib" :line-height="54">
        <span style="color:#D6AB85" class="fon-xxl fon-wb mar-r" v-if="getInfo.power.length > 0">自营</span>{{getInfo.title}}
      </dd-layout-div>
      <dd-layout-div class="flex flex-bt flex-y-center bg-f" :mar="[30,0,0]">
        <dd-layout-div class="col-t fon-wb flex flex-y-center flex-wrap" :font-size="40">
          <span class="mar-r">￥{{getInfo.currentPrice}}</span>
          <dd-layout-div bg="#FFE100" v-if="platform.openVip" :font-size="22" :pad="[14,10,10]" class="col-3 flex-g-0"
                         :fillet="8">会员
            ￥{{getInfo.vipMoney}}
          </dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="col-9 flex-g-0" :font-size="26">热销：{{getInfo.salesNum}}份</dd-layout-div>
      </dd-layout-div>
      <dd-layout-div class="col-9 fon-xs t-d-l fon-w5 mar-t-20">￥{{getInfo.originalPrice}}</dd-layout-div>
      <dd-layout-div
        class="bg-FFECF2 flex-y-center flex-bt"
        :fillet="12"
        v-if="!user.isVip && platform.openVip"
        :pad="[30]"
        :mar="[30,0,0]"
        @click="goPointPage({path:'/auxiliary/vip/enterVip'})">
        <dd-layout-div>
          <dd-layout-div :font-size="32" class="fon-wb flex">
            <i class="iconfont icon-huangguanhuiyuan mar-r fon-35 col-3"></i>超级会员卡
          </dd-layout-div>
          <dd-layout-div class="col-6 mar-t-20">开通超级会员可<span class="col-t">{{getInfo.vipMoney}}购买</span>
          </dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="c-b-t-lr-300 col-f" :pad="[20,25,16]" :fillet="40">立即开通</dd-layout-div>
      </dd-layout-div>
      <dd-layout-div :height="97" v-if="getInfo.labels.length>0"
                     class="flex-y-center br-b-d">
        <dd-layout-div class="flex-g-1 flex-bt" @click="goodsServiceShow = !goodsServiceShow">
        <span class="col-6 flex-g-1" v-for="(name,key) in getInfo.labels" v-if="key<3" :key="key">
          <i class="iconfont icon-tuanbuxingbiao col-t mar-r-10"></i>{{name}}</span>
        </dd-layout-div>
        <i class="iconfont icon-youjiantou1 col-9"></i>
      </dd-layout-div>


      <dd-layout-div :pad="[40,0]" class="flex br-b-d flex-y-center" v-if="getInfo.coupon.length > 0">
        <dd-layout-div class="mar-r" :mi-w="175">
          <div class="fon-xl fon-wb mar-b-20">优惠劵</div>
          <p class="col-9">共{{getInfo.coupon.length}}张可领</p>
        </dd-layout-div>
        <dd-layout-div class="flex-g-1 flex-y-center over-a">
          <dd-layout-div class="dh-100 flex-g-0 flex-bt flex-y-center over-h" :fillet="4"
                         @click="conponHandle(item)"
                         v-for="(item,key) in getInfo.coupon" :key="key">
            <dd-layout-div :bg='`url(${item.canReceive?couponBgLeft:couponBgLeftAsh})no-repeat 0 0/100% 100% #fff`'
                           class="pad-lr pad-tb flex-y-center  dh-100">
              <div class="">
                <div class="col-f mar-b-10">
                  <span>￥</span>
                  <span class="fon-xxl fon-wb">{{item.discount}}</span></div>
                <div class="col-f">{{item.name}}</div>
              </div>
            </dd-layout-div>
            <dd-layout-div :bg='`url(${item.canReceive?couponBgRight:couponBgRightAsh})no-repeat 0 0/100% 100% #fff`'
                           class="mar-r col-f dh-100 w-100 fon-xss pad-r-10 flex-center">
              <span class="w-44 pad-l">{{item.tips}}</span>
            </dd-layout-div>
          </dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>


      <dd-layout-div :pad="[40,0]" class="flex-bt">
        <span class="fon-b fon-wb">配送方式</span>
        <span class="col-6 fon-sm">
          <span v-if="storeInfo.deliverMode == 3 || storeInfo.deliverMode == 1">快递配送:￥{{getInfo.freight}}</span>
          <span v-if="storeInfo.deliverMode == 3">/</span>
          <span v-if="storeInfo.deliverMode == 3 || storeInfo.deliverMode == 2">到店自提</span>
        </span>
      </dd-layout-div>


    </dd-layout-div>


    <!--商家信息-->
    <dd-layout-div class="flex bg-f flex-y-center" :pad="[30]"
                   @click="goPointPage({path: '/shopDetail', query: {storeId: getInfo.storeId}});">
      <dd-layout-img :src="storeInfo.logo" :width="1.66" :height="1.66" :fillet="0.3"/>
      <dd-layout-div class="flex-g-1 pad-l">
        <dd-layout-div class="fon-wb fon-xll flex">
          <dd-layout-div class="hide-e flex-g-1  pad-t-5">{{storeInfo.name}}
            <!--<img :src="renzheng" class="w-100 mar-r-10 dh-34">-->
          </dd-layout-div>

        </dd-layout-div>
        <dd-layout-div class="flex-bt flex-y-center" :mar="[25,0]">
          <dd-layout-div class="flex-g-1 flex-bt pad-r-20">
            <span class="fon-sm">{{storeInfo.fans || 0}}粉丝</span>
            <span class="fon-sm">{{storeInfo.goodsNum || 0}}商品</span>
            <span class="fon-sm"></span>
          </dd-layout-div>
          <i class="iconfont icon-iconfront-"></i>
        </dd-layout-div>
        <dd-layout-div class="flex">
          <dd-layout-div class="iconfont icon-xingxing mar-r-10 fon-xs" v-for="i in 5"
                         :color="i <= (getInfo.star || 5)?'#f7af27':'#eee'"
                         :key="'s'+i"/>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
    <div class="dh-96 bg-F2F3F5 flex-bt flex-y-center pad-lr col-9 fon-xs" @click="openReport(getInfo.id,4)">
      如遇无效、虚假等信息，请立即举报哦！
      <div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>点此举报</div>
    </div>

    <a id="details"></a>
    <!--商品详情-->
    <dd-layout-div class="bg-f mar-b-20" :pad="[30]">
      <dd-layout-div class="fon-wb mar-b" :font-size="34">商品详情</dd-layout-div>
      <dd-layout-html class="pad-0" :html="getInfo.details"/>
      <video class="base-pad b-box" v-if="getInfo.video" :src="getInfo.video" width="100%"
             controls="controls" x5-playsinline="" playsinline="true" webkit-playsinline="true"
             x-webkit-airplay="true" x5-video-player-type="h5"
             x5-video-player-fullscreen="" x5-video-orientation="portraint"
      ></video>
      <dd-layout-div
        class="info-body pad-lr pad-t t-c"
        v-if="getInfo.pictures&&getInfo.pictures.length > 0">
        <img
          class="br-r-20 mar-b dis-b mar-a mw100 "
          @click.stop="previewImage(url,getInfo.pictures)"
          v-for="(url,key) in getInfo.pictures"
          :src="url"
          :key="key"/>
      </dd-layout-div>
    </dd-layout-div>


    <a id="comment"></a>
    <!--商品评价-->

    <dd-layout-div v-if="mallconfig.displayComment=='yes'" class="bg-f mar-b-20">
      <dd-layout-div class="flex-bt flex-y-center" :pad="[40,30,0]">
        <dd-layout-div class="fon-wb" :font-size="34">商品评价</dd-layout-div>
        <dd-layout-div class="col-t fon-b flex-y-center"
                       @click="goPointPage('/auxiliary/mall/commentList?goodsId='+getInfo.id)">好评度{{getInfo.rate}}<i
          class="iconfont icon-right col-9 fon-xs mar-t-5"></i>
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div v-if="getInfo.comment.length>0">
        <dd-comment :comment=" getInfo.comment[0]"/>
        <dd-layout-div
          @click="goPointPage('/auxiliary/mall/commentList?goodsId='+getInfo.id)"
          class="col-t fonb flex-center" :height="106">查看全部评论
        </dd-layout-div>
      </dd-layout-div>
      <not-data v-else/>
    </dd-layout-div>

    <!--商品推荐-->
    <a id="recommend"></a>
    <dd-layout-div :bg='`url(${back})no-repeat 0 0/100% 100% #fff`' :height="100" class="flex-center fon-xll fon-wb">
      猜你喜欢
    </dd-layout-div>
    <dd-layout-div class="over-a flex bg-f pad-t-5" v-if="tabs.length > 0">
      <dd-layout-div v-for="(item,key) in tabs" :key="key" class="flex-g-0 t-c option-e" :pad="[5,30]">
        <dd-layout-div
          class="fon-wb fon-xl mar-b-20"
          @click="tabsChange(item,key)"
          :class="params.typePid == item.id&&'col-t'"
        >{{item.name}}
        </dd-layout-div>
        <dd-layout-div v-if="params.typePid == item.id" class=" col-f fon-xss  bg-t" :pad="[8,15,4]" :mar="[-5,0,0]"
                       :fillet="20">
          {{item.title}}
        </dd-layout-div>
        <dd-layout-div v-else class=" col-bb">{{item.title}}</dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>

    <GoodsCard :list="goodsList"/>
    <not-data v-if="isRequest&&goodsList.length==0"></not-data>
    <More v-if="goodsList.length > 0" :status="hasMore"></More>

    <!--底部操作-->
    <dd-layout-div :height="100">
      <dd-layout-div :height="100" class="flex bg-f flex-y-center posi-f b0 l0 r0">
        <dd-layout-div class="flex-g-1 flex">
          <dd-layout-div
            v-for="(item,key) in footerConfig.menu"
            :key="key"
            class="flex-center flex-g-1"
            @click="footerHandle({key})"
          >
            <dd-layout-div class="t-c">
              <i class="iconfont col-9 fon-40" :class="item.icon"></i>
              <dd-layout-div class=" col-9 mar-t-5">{{item.name}}</dd-layout-div>
            </dd-layout-div>
          </dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class=" flex">
          <dd-layout-div
            class="col-f bg-t  mar-r"
            :pad="[25,35,20]"
            :fillet="40"
            bg="linear-gradient(90deg, #ffa349, #ff8010)"
            @click="footerHandle({key:3})">加入购物车
          </dd-layout-div>
          <dd-layout-div
            class="col-f  mar-r c-b-t-lr-300"
            :pad="[25,35,20]"
            :fillet="40"
            @click="footerHandle({key:4})"
          >立即购买
          </dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>

    <!--商品选择-->
    <dd-goods-choice
      :show="show"
      @close="show = !show"
      :data="goodsInfo"
      @confrim="confrimChoice"
    ></dd-goods-choice>

    <!--海报部分-->
    <dd-poster-goods
      v-model="showMask"
      :cover="getInfo.banners[0]?getInfo.banners[0]:''"
      :price="getInfo.currentPrice"
      :title="getInfo.title"
      desc="长按识别二维码查看详情"
    />

    <!--<div class="posi-f t0 l0 r0 b0 zIndex99 flex-center" v-if="showMask">-->
    <!--<div class="posi-a t0 l0 r0 b0 bg-0-5" @click="showMask = !showMask"></div>-->
    <!--<div class="w-600 bg-f posi-r" ref="baseUrlBox" style="padding: 0;">-->
    <!--<img style="margin: 0;" :src="baseUrl" class="w100 t0 l0" v-if="baseUrl">-->
    <!--<div ref="poster" style="padding: 0;" v-else>-->
    <!--<div class="w-600 h-600">-->
    <!--<img-wrapper v-if="getInfo.banners[0]"-->
    <!--:src="getInfo.banners[0]"/>-->
    <!--</div>-->
    <!--<div class="flex-bt pad-30 flex-y-center">-->
    <!--<div class="flex-g-1 pad-r">-->
    <!--<div class="fon-b lineH-40">{{getInfo.title}}</div>-->
    <!--<div class="mar-t-20 flex-wrap">-->
    <!--<span class="fon-b col-t mar-r">￥{{getInfo.currentPrice}}</span>-->
    <!--<p class="col-9 mar-t-20 fon-xs">长按识别二维码查看详情</p>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="w-200 h-200 miw-200" id="qrcode" ref="qrcode"></div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <van-popup
      v-model="goodsServiceShow"
      position="bottom"
      style="background: transparent"
    >
      <dd-layout-div class="bg-f" :pad="[30,0,30]" :fillet="[20,20,0,0]">
        <dd-layout-div class="fon-xll flex-center" :pad="[32,0]">服务说明</dd-layout-div>
        <dd-layout-div :pad="[15,30]">
          <dd-layout-div
            class="flex"
            :pad="[30,0]"
            v-for="(item,key) in goodsService"
            :key="key"
          >
            <dd-layout-div :mar="[5,40,0,0]" class="iconfont icon-tuanbuxingbiao col-t"/>
            <div class="body">
              <h4 class="fon-lg">{{item.name}}</h4>
              <p class="col-9 mar-t-15">{{item.body}}</p>
            </div>
          </dd-layout-div>
        </dd-layout-div>
        <dd-button
          style="margin-bottom: 0"
          type="confirm"
          @click="goodsServiceShow = !goodsServiceShow"
        />
      </dd-layout-div>

    </van-popup>


  </div>

</template>

<script>
  import Banner from '@/components/home/banner';
  import GoodsCard from '@/components/template/goods-card';
  import DdTabs from '@/components/template/dd-tabs';
  import DdComment from '@/components/template/dd-comment';
  import DdGoodsHeader from '@/components/template/mall/dd-goods-header';
  import DdGoodsChoice from '@/components/template/mall/dd-goods-choice';
  import MallCoupon from '@/components/template/mall/mall-coupon';
  import DdStoreInfo from '@/components/template/mall/dd-store-info';
  import DdButton from '@/components/template/button';
  import ChoiceLabel from '@/components/template/choice-label';
  import DetailsFooter from '@/components/template/dd-store/details-footer';
  import {mapActions, mapState, mapGetters} from "vuex";
  import {Toast} from 'vant';
  import {utilMixins} from "@/plugins/util-mixins";
  import {hideLoading, picLinkToBase64, showLoading} from "../../../util";
  import {updateShareConfig} from "../../../util/wechat-util";
  import DdMusic from "@/components/template/other/music"
  import html2canvas from 'html2canvas'
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdLayoutHtml from "../../../components/layout/dd-layout-html";
  import DdPosterGoods from '../../../components/template/dd-poster/goods'

  import back from '../../../assets/img/other/back.png'
  import couponBgLeft from '../../../assets/img/other/coupon-bg-left.png'
  import couponBgRight from '../../../assets/img/other/coupon-bg-right.png'
  import couponBgLeftAsh from '../../../assets/img/other/coupon-bg-left-ash.png'
  import couponBgRightAsh from '../../../assets/img/other/coupon-bg-right-ash.png'

  export default {
    mixins: [utilMixins],
    components: {
      DdLayoutHtml,
      DdLayoutImg,
      Banner,
      DetailsFooter,
      GoodsCard,
      DdTabs,
      DdComment,
      DdGoodsHeader,
      DdGoodsChoice,
      MallCoupon,
      DdButton,
      ChoiceLabel,
      DdStoreInfo,
      DdPosterGoods
    },
    data() {
      return {
        back,
        couponBgLeft, couponBgRight, couponBgLeftAsh, couponBgRightAsh,
        showMask: false,
        baseUrl: '',
        footerConfig: {
          menu: [
            {
              icon: 'icon-shangjia',
              name: '店铺',
            }, {
              icon: 'icon-kefu',
              name: '客服',
            }, {
              icon: 'icon-gouwuche2',
              name: '购物车',
            }
          ],
          main: [
            {name: '', childrenName: '加入购物车', style: 'background:var(--mainColor);opacity:0.5;'},
            {name: '', childrenName: '立即购买', style: 'background:var(--mainColor);'},
          ]
        },
        storeInfo: {},
        goodsService: [],
        goodsServiceShow: false,
        goodsInfo: {
          label: [],
          comment: [],
          detailImgs: []
        },
        carGoodsLength: 0,
        goodsId: null,
        openCoupon: false,
        show: false,
        active: 0,
        banners: [],
        tabs: [],
        goodsHeader: {
          tabs: [
            {name: '商品', active: true, id: 'top'},
            {name: '详情', id: 'details'},
            {name: '评论', id: 'comment'},
            {name: '推荐', id: 'recommend'},
          ]
        },
        choiceType: null,
        goodsList: [],
        hasMore: true,
        isRequest: false,
        params: {
          page: 1,
          size: 10,
          typePid: null,   //父级id 搜索使用
          typeId: null,    //子级id 搜索使用
        }
      }
    },
    methods: {
      ...mapActions('shop', ['getShopInfoWithUserIdById', "getShopInfoByParams"]),
      ...mapActions("mall", [
        'getMallConfig',
        'getMallGoodsInfo',
        'mallShoppingCartOperation',
        'getMallCategory',
        'getMallGoodsList',
        'mallSaveCar',
        'mallMyShoppingCar',
        'mallGetGoodsService',
        'setOrderList',
        'mallGetStoreCoupon']),
      async openPoster() {
        this.showMask = !this.showMask;
        if (this.baseUrl) return;
        const that = this;
        showLoading("请稍后...")
        setTimeout(() => {
          picLinkToBase64(this.$refs.poster, () => {
            this.getQRCode({
              dom: this.$refs.qrcode,
              url: window.location.href
            });
            html2canvas(this.$refs.poster, {
              useCORS: true, logging: true,
              width: this.$refs.baseUrlBox.clientWidth,
              height: this.$refs.baseUrlBox.clientHeight,
            }).then(function (canvas) {
              that.baseUrl = canvas.toDataURL("image/jpeg", 1);
              hideLoading();
            });
          })
        }, 1000)
      },
      tips() {
        console.log(this.storeInfo);
        if (this.storeInfo.linkTel) {
          location.href = `tel://${this.storeInfo.linkTel}`
        } else {
          Toast({message: '暂未开通', duration: 1000})
        }
      },
      footerHandle(e) {
        console.log(e);
        switch (e.key) {
          case 0:
            this.goPointPage({path: '/shopDetail', query: {storeId: this.goodsInfo.storeId}})
            break;
          case 1:
            //this.goPointPage('/auxiliary/assemble/release');
            this.tips();
            break;
          case 2:
            this.goPointPage('/auxiliary/mall/cart')
            break;
          case 3:   // 单独购买
            this.openGoodsChoice('shoppingCar')
            break;
          case 4:
            this.openGoodsChoice('buyNow')
            break;
        }
      },
      getPics(vals) {
        return vals.map((item) => {
          return this.getSingleImg(item.url)
        })
      },
      /** tabs事件 */
      tabsChange(item, key) {
        this.params.page = 1;
        this.params.typePid = item.id;
        this.getGoods(true);
      },
      async openGoodsChoice(type) {
        const bool = await this.checkBindTel({callBack: true});
        if (!bool) return
        this.choiceType = type;
        this.show = !this.show;
      },
      async conponHandle(item) {
        if (item.canReceive) {
          if (item.id) {
            const res = await this.mallGetStoreCoupon({
              couponId: item.id
            })
            if (res.code == 1) {
              Toast({
                message: '已领取',
                duration: 1000
              });
              item.canReceive = false
            } else {
              Toast.fail({
                message: res.msg,
                duration: 1500
              });
            }
          } else {
            Toast.fail({
              message: '缺少id',
              duration: 1500
            })
          }
        } else {
          Toast.fail({
            message: '您已领取',
            duration: 1500
          })
        }


      },
      async conpon(result) {

        return console.log("result", result)
        if (result.state == 'receive') {
          showLoading("领取中...")
          const res = await this.mallGetStoreCoupon({
            couponId: result.data.id
          })
          if (res.code == 1) {
            result.data.display = 2;
            Toast({
              message: '已领取',
              duration: 1000
            });
          } else {
            Toast.fail({
              message: res.msg,
              duration: 1500
            });
          }
        }
      },
      async confrimChoice(params = {}) {
        let order = [];
        if (this.choiceType == 'shoppingCar') {
          // this.alert('先加入购物车先');
          this.show = !this.show;

          await this.mallSaveCar({
            goodsId: this.goodsInfo.id,
            storeId: this.goodsInfo.storeId,
            groupId: (params.specGroup && params.specGroup.id) || "",
            data: (params.specGroup && params.specGroup.data) || "",
            money: (params.specGroup && params.specGroup.memberPrice) || params.money,
            num: params.num
          });
          this.getCarInfo();
          this.mallShoppingCartOperation(params);

        } else if (this.choiceType == 'buyNow') {
          console.log("buyNow", params);
          const canVip = this.platform.openVip && this.user.isVip,

            // 判断是不是可以使用vip价格。如果有规格组的话，就优先是有规格组里面的vip价格，没有vip价格就使用默认价格。
            // 若没有规格组里面没有价格，就还是判断是不是可以使用vip价格，没有vip价格就使用默认价格。

            money = (canVip ? (params.specGroup.memberPrice || params.specGroup.money) : params.specGroup.money)
              || (canVip ? (this.goodsInfo.vipMoney || this.goodsInfo.currentPrice) : this.goodsInfo.currentPrice);
          console.log("canVip", canVip, "money", money)
          this.setOrderList([
            {
              storeId: this.goodsInfo.storeId,    //  商家id
              storeName: this.goodsInfo.storeName,   // 商家名称
              storeLogo: this.goodsInfo.storeLogo,   // 商家logo
              goods: [    // 商品集合
                {
                  goodsId: this.goodsInfo.id,                  //商品id
                  groupId: params.specGroup.id || 0,       //商品规格组id
                  money,     //单价
                  num: params.num || 1,                     //数量
                  data: params.specGroup.data || '',        //规格组
                  ...this.goodsInfo
                }
              ]
            }
          ]);

          this.goPointPage('/auxiliary/mall/orderPay')

        }
      },
      /** 获取商品列表 */
      async getGoods(refresh) {
        showLoading();
        const result = await this.getMallGoodsList(this.params);
        this.goodsList = refresh ? result : this.goodsList.concat(result);
        this.hasMore = result.length >= this.params.size;
        this.isRequest = true;
        hideLoading();
        return this.hasMore;
      },
      /**上拉加载 */
      async onInfinite(done) {
        if (this.hasMore) {
          this.params.page++;
          await this.getGoods();
        }
      },
      async getGoodsInfo() {
        const query = this.$route.query;
        if (query.goodsId) {
          this.goodsId = query.goodsId;
          this.getMallCategory().then(result => {
            this.tabs = [{name: '推荐', active: true, title: '猜你喜欢'}].concat(result);
          })
          this.getGoods();
          await this.getMallGoodsInfo({
            goodsId: this.goodsId
          }).then(result => {
            this.findInfo(result)
            result.spec && result.spec.forEach(item => {
              item.data = item.data.map((name, index) => {
                return {
                  name: name,           // 名称
                  field: item.name       // 所属的分类
                }
              })
            })

            this.getShopInfoWithUserIdById(result.storeId).then(res => {
              this.storeInfo = {
                logo: this.getSingleImg(JSON.parse(res.storeLogo)[0].url),
                name: res.storeName,
                id: result.storeId,
                goodsNum: res.goodsNum,
                goodsComment: res.commentNum,
                fans: res.followNum,
                linkTel: res.linkTel,
                deliverMode: +res.deliverMode || 0
              }
            });
            console.log(result);
            this.mallGetGoodsService({
              goodsId: result.id
            }).then(result => {
              console.log("mallGetGoodsService", result);
              this.goodsService = result;
            })

            result.vipMoney = this.platform.openVip ? +result.vipMoney || result.currentPrice : null;

            this.goodsInfo = result;

            if (result.showImgs) {
              this.banners = result.showImgs.map(item => {
                return {
                  url: item.url,
                  notHost: true
                }
              })
            }
          })

          updateShareConfig({
            title: this.goodsInfo.title,
            imgUrl: this.getSingleImg(this.banners[0].url),
            desc: this.goodsInfo.details,
          })


          this.getCarInfo();
        } else {
          Toast.fail({
            message: '缺少goodsId',
            duration: 1500
          })
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        }
      },
      getCarInfo() {
        this.mallMyShoppingCar().then(result => {
          this.carGoodsLength = 0;
          result.forEach(store => {
            this.carGoodsLength = this.carGoodsLength + store.goods.length
          })
        })
      }
    },
    computed: {
      ...mapState("mall", {
        mallconfig: s => s.config,
        shoppingCart: s => s.shoppingCart,
        orderList: s => s.orderList,
      }),
      ...mapState({
        platform: s => s.platform,
        user: s => s.user
      }),
      getInfo() {
        const data = this.goodsInfo;

        return {
          ...data,
          banners: data.showImgs ? data.showImgs.map(item => {
            return this.getSingleImg(item.url)
          }) : [],
          pictures: data.showImgs ? data.detailImgs.map(item => {
            return this.getSingleImg(item.url)
          }) : [],
          currentPrice: (+data.currentPrice || 0).toFixed(2),
          vipMoney: (+data.vipMoney || 0).toFixed(2),
          originalPrice: (+data.originalPrice || 0).toFixed(2),
          labels: data.label || [],
          coupon: data.coupon ? data.coupon.map(item => {

            return {
              ...item,
              tips: item.receive == 1 ? '已领取' : '立即领取',
              canReceive: item.receive == 2
            }

          }) : [],
          comment: data.comment || [],
          rate: (data.rate ? data.rate * 100 : 0) + '%'
        };
      }

    },
    watch: {
      async $route() {
        showLoading();
        await this.getGoodsInfo();
        hideLoading();
      }
    },
    async created() {
      this.getGoodsInfo();
      this.getMallConfig()
    }
  }

</script>
