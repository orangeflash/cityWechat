<template xmlns="http://www.w3.org/1999/html">
  <div class="assemble-details">
    <!--<Header/>-->
    <banner
      v-bind="bannerConfig"
      :showImage="true"
      @click="handleMethods"
    >
      <dd-layout-div slot="float" :pad="[30]">
        <dd-layout-div :width="72" :height="72" :mar="[18,0,0]" class="bg-0-5 col-f flex-center t-c let-space-5"
                       :line-height="26"
                       :font-size="22"
                       @click="showMask = !showMask"
                       :fillet="72">生成海报
        </dd-layout-div>
        <ddMusic class="mar-t-25" :autoPlay="true" v-if="getInfo.music"
                 v-model="getInfo.music"/>
      </dd-layout-div>
    </banner>

    <dd-layout-div @click="$router.go(-1)" :width="52" :height="52" :mar="[50,20]" :fillet="50"
                   class="t0 l0 posi-a bg-0-5 col-f flex-center">
      <i class="iconfont icon-zuojiantou3 mar-t-5"></i>
    </dd-layout-div>


    <dd-layout-div class="bg-f" :pad="[0,30,30]" :mar="[0,0,20]">
      <dd-layout-div class="bg-f" :pad="[30,0]">
        <dd-layout-div
          class="col-f fon-b dis-ib fon-wb br-br-r-30 br-tl-r-30 flo-l mar-r"
          bg="linear-gradient(90deg, #f93245 0%, #ed4e6e 100%)"
          :pad="[15,30,12]"
        >{{getInfo.groupNum}}人拼
        </dd-layout-div>
        <dd-layout-div :font-size="36" class="fon-wb" :line-height="60">{{getInfo.title}}</dd-layout-div>
      </dd-layout-div>
      <dd-layout-div class="flex flex-bt flex-y-center bg-f">
        <dd-layout-div class="col-price fon-wb flex flex-y-center flex-wrap" :font-size="40">
          <span>￥{{getInfo.groupPrice}}</span> - <span class="mar-r">{{getInfo.alonePrice}}</span>
          <dd-layout-div bg="#FFE100" :font-size="22" v-if="platform.openVip && getInfo.memberPrice > 0"
                         :pad="[14,10,10]" class="col-3 flex-g-0"
                         :fillet="8">会员
            ￥{{getInfo.memberPrice}}
          </dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="col-9 flex-g-0" :font-size="26">已售{{getInfo.salesNum}}份</dd-layout-div>
      </dd-layout-div>
      <dd-layout-div class="col-9 fon-xs t-d-l fon-w5 mar-t-20">￥{{getInfo.originalPrice}}</dd-layout-div>
      <dd-layout-div
        class="bg-FFECF2 flex-y-center flex-bt"
        :fillet="12"
        v-if="!user.isVip && platform.openVip"
        :pad="[30]"
        :mar="[30,0]"
        @click="goPointPage({path:'/auxiliary/vip/enterVip'})">
        <dd-layout-div>
          <dd-layout-div :font-size="32" class="fon-wb flex">
            <i class="iconfont icon-huangguanhuiyuan mar-r fon-35 col-3"></i>超级会员卡
          </dd-layout-div>
          <dd-layout-div class="col-6 mar-t-20">开通超级会员可<span class="col-price">{{getInfo.memberPrice}}购买</span>
          </dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="c-b-t-lr-300 col-f" :pad="[20,25,16]" :fillet="40">立即开通</dd-layout-div>
      </dd-layout-div>

      <dd-layout-div :br="{bottom:`0.011rem solid #F2F3F5`}" :height="97" v-if="getInfo.labels.length>0"
                     class="flex-y-center">
        <dd-layout-div class="flex-g-1 flex-bt">
        <span class="col-6 flex-g-1" v-for="(name,key) in goodsInfo.labels" v-if="key<3" :key="key">
          <i class="iconfont icon-tuanbuxingbiao col-t mar-r-10"></i>{{name}}</span>
        </dd-layout-div>
        <i class="iconfont icon-youjiantou1 col-9"></i>
      </dd-layout-div>
    </dd-layout-div>


    <dd-layout-div class="bg-f mar-b-20" :pad="[30]" v-if="getInfo.going.length > 0">
      <dd-layout-div class="fon-wb" :font-size="36">正在拼团</dd-layout-div>
      <dd-layout-div :pad="[30,0]" class="flex-y-center flex-bt" v-for="(item , key) in getInfo.going" :key="key">
        <dd-layout-div class="flex-g-1 flex-bt flex-y-center">
          <dd-layout-img :src="item.face" :width="0.96" :height="0.96" :fillet="0.96"/>
          <dd-layout-div :font-size="28" class="fon-wb flex-g-1" :pad="[0,30]">{{item.userName}}</dd-layout-div>
          <dd-layout-div :pad="[0,20,0,0]" class="t-c">
            <dd-layout-div :mar="[0,0,15]">还差<span class="col-t">{{item.num}}</span>人拼成</dd-layout-div>
            <dd-layout-div>剩余{{item.time}}</dd-layout-div>
          </dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="bg-t col-f" :pad="[20,30,16]" :fillet="30"
                       @click="goPointPage('/auxiliary/assemble/assembleDetails?groupId='+item.teamId)">去拼团
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>

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
            <span class="fon-sm">{{getInfo.fans || 0}}粉丝</span>
            <span class="fon-sm">{{getInfo.goodsNUm || 0}}商品</span>
            <span class="fon-sm"></span>
          </dd-layout-div>
          <i class="iconfont icon-iconfront-"></i>
        </dd-layout-div>
        <dd-layout-div class="flex">
          <dd-layout-div class="iconfont icon-xingxing mar-r-10 fon-xs" v-for="i in 5"
                         :color="i <= (getInfo.star || 5)?'#f7af27':'#eee'"
                         :key="'s'+i"></dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
    <div class="dh-96 bg-F2F3F5 flex-bt flex-y-center pad-lr col-9 fon-xs" @click="openReport(getInfo.id,6)">
      如遇无效、虚假等信息，请立即举报哦！
      <div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>点此举报</div>
    </div>


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
            @click="assembleBuy(1)">单独购买
          </dd-layout-div>
          <dd-layout-div
            class="col-f  mar-r bg-f52c2c"
            :pad="[25,35,20]"
            :fillet="40"
            @click="assembleBuy(2)"
          >发起拼团
          </dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>


    <!--海报部分-->
    <dd-poster-goods
      v-model="showMask"
      label="拼团"
      :cover="bannerConfig.swiper.children[0]?getSingleImg(bannerConfig.swiper.children[0].url):''"
      :price="getInfo.groupPrice"
      :title="getInfo.title"
      desc="长按识别二维码来和我一起拼吧"
    />

    <!--<div class="posi-f t0 l0 r0 b0 zIndex99 flex-center" v-if="showMask">-->
    <!--<div class="posi-a t0 l0 r0 b0 bg-0-5" @click="showMask = !showMask"></div>-->
    <!--<div class="w-600 bg-f posi-r" ref="baseUrlBox" style="padding: 0;">-->
    <!--<img style="margin: 0;" :src="baseUrl" class="w100 t0 l0" v-if="baseUrl">-->
    <!--<div ref="poster" style="padding: 0;" v-else>-->
    <!--<div class="w-600 h-600">-->
    <!--<img-wrapper v-if="bannerConfig.swiper.children[0]"-->
    <!--:src="getSingleImg(bannerConfig.swiper.children[0].url)"/>-->
    <!--</div>-->
    <!--<div class="flex-bt pad-30 flex-y-center">-->
    <!--<div class="flex-g-1 pad-r">-->
    <!--<div class="fon-b lineH-40">-->
    <!--<span class="flo-l bg-t col-f lineH-34 fon-sm br-r-10 pad-l-10 pad-t-5 pad-r-10 mar-r">拼团</span>{{getInfo.title}}-->
    <!--</div>-->
    <!--<div class="mar-t-20 flex-wrap">-->
    <!--<span class="fon-b col-price mar-r">￥{{getInfo.groupPrice}} - {{getInfo.alonePrice}}</span>-->
    <!--<p class="col-9 mar-t-20 fon-xs">长按识别二维码，和我一起拼吧</p>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="w-200 h-200 miw-200" id="qrcode" ref="qrcode"></div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->

  </div>
</template>


<script>
  import Banner from '@/components/home/banner';
  import FaceMap from '@/components/template/other/face-map';
  import Chunk from '@/components/template/dd-store/chunk';
  import DetailsFooter from '@/components/template/dd-store/details-footer';
  import UserInfo from "@/components/template/user";
  import DdStoreDataList from "@/components/template/dd-store/data-list";
  import {Toast} from 'vant'
  import html2canvas from 'html2canvas'
  import {mapActions, mapState} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {format, hideLoading, picLinkToBase64, showLoading, timeStampToHMS} from "../../../util";
  import {openLocation, updateShareConfig} from "../../../util/wechat-util";
  import DdMusic from "@/components/template/other/music"
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdLayoutHtml from "../../../components/layout/dd-layout-html";
  import DdPosterGoods from '../../../components/template/dd-poster/goods'
  import renzheng from '../../../assets/img/attest/renzheng.png'

  export default {
    mixins: [utilMixins],
    components: {
      DdLayoutHtml,
      DdLayoutImg,
      Banner,
      FaceMap,
      Chunk,
      UserInfo,
      DdStoreDataList,
      DetailsFooter,
      DdMusic,
      DdPosterGoods
    },
    data() {
      return {
        showMask: false,
        renzheng,
        baseUrl: '',
        show: false,
        userInfo: {
          src: 'http://s1.sinaimg.cn/mw690/006hikKrzy7slvzJkLmf0&690',
          size: 42,
          name: `<span class="fon-b mar-r col-3">hssg</span><em class="col-6">还差2人</em>`,
          info: '<em class="col-6">剩余23:56:02:02</em>'
        },
        storeInfo: {},
        goodsInfo: {
          going: []
        },
        footerConfig: {
          menu: [
            {
              icon: 'icon-shouye',
              name: '首页',
            }, {
              icon: 'icon-shangjia',
              name: '店铺',
            }, {
              icon: 'icon-geren2',
              name: '我的',
            }
          ],
          main: [
            {name: '', childrenName: '单独购买', style: 'background:var(--mainColor);opacity:0.5;'},
            {name: '', childrenName: '发起拼团', style: 'background:var(--mainColor);'},
          ]
        },
        bannerConfig: {          //参数值
          height: 375,
          swiper: {
            children: []
          }
        },
        faceMap: {
          faces: [],
          size: 28,
          max: 11
        },
        dataListConfig: {
          height: 45,
          form: []
        },
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeAssemble", ["getAssembleGoodsInfo"]),
      openLocation,
      async assembleBuy(e) {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        this.goPointPage('/auxiliary/assemble/separateBuy?type=' + e + '&assembleId=' + this.getInfo.id)
      },
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
      handleMethods(item) {
      },
      footerHandle(e) {
        switch (e.key) {
          case 0:
            this.goPointPage("/auxiliary/assemble")
            break;
          case 1:
            this.goPointPage({path: '/shopDetail', query: {storeId: this.storeInfo.storeId}})
            break;
          case 2:
            this.goPointPage("/auxiliary/assemble/myOrder")
            break;
        }
      }
    },
    computed: {
      ...mapState({
        platform: state => state.platform,
      }),
      getInfo() {

        const data = this.goodsInfo;

        const info = {
          ...data,
          groupPrice: (+data.groupPrice || 0).toFixed(2),
          memberPrice: (+data.memberPrice || 0).toFixed(2),
          alonePrice: (+data.alonePrice || 0).toFixed(2),
          originalPrice: (+data.originalPrice || 0).toFixed(2),
          labels: data.labels || []
        }


        return info
      }
    },
    created() {
      const query = this.$route.query;
      this.isFailParams({
        field: query.assembleId,
        tips: '缺少拼团id'
      }, async () => {
        showLoading();
        const result = await this.getAssembleGoodsInfo({
          goodsId: query.assembleId
        });
        this.findInfo(result)
        result.showImgs.forEach(v => v.notHost = true);
        result.labels = (() => {
          let arr = []
          for (let key in result.label) arr.push(result.label[key]);
          return arr
        })();

        result.pictures = result.detailImgs.map(item => {
          return this.getSingleImg(item.url)
        })

        this.footerConfig.main[0].name = '￥' + result.alonePrice;
        this.footerConfig.main[1].name = '￥' + this.platform.openVip && this.user.isVip ? result.memberPrice : result.groupPrice;
        const now = new Date().getTime();

        result.going = result.going.map(item => {
          return {
            userName: item.userName,
            face: item.portrait,
            num: item.num - item.buyNum,
            time: timeStampToHMS(item.expireTime * 1000 - now),
            teamId: item.groupId
          }
        })

        this.faceMap.faces = result.complete.map(item => item.portrait)
        this.bannerConfig.swiper.children = result.showImgs
        this.goodsInfo = result

        // const name = result.storeName.length > 10 ? result.storeName.split(0, 10) + '...' : result.storeName

        this.storeInfo = {
          name: result.storeName,
          logo: result.storeLogo[0] && this.getSingleImg(result.storeLogo[0].url),
          linkTel: result.linkTel,
          address: result.address,
          startTime: result.businessStartTime,
          endTime: result.businessEndTime,
          storeId: result.storeId,
          lng: result.lng,
          lat: result.lat,

        }

        updateShareConfig({
          title: "拼团 " + this.goodsInfo.title,
          imgUrl: this.getSingleImg(this.goodsInfo.showImgs[0].url),
          desc: this.goodsInfo.details,
        });

        hideLoading();
      })
    }
  }

</script>
