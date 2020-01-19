<template>
  <div id="ShopDetail">
    <Header :childrenTitle="getInfo.store.name"/>
    <div class="pad-30 bg-f">
      <dd-layout-user
        :src="getInfo.store.logo"
        :size="1.24"
        :fillet="0.08"
      >
        <div slot="icon" class="col-3 flex-y-center fon-44 mar-b-20 lineH-54">{{getInfo.store.name}}
          <!--<i class="iconfont icon-iconfront- col-3 mar-t-10 mar-l-10"></i>-->
        </div>
        <div slot="desc" class="flex flex-y-center">
          <div class="auth-bg w-100 dh-30 mar-r-10 mar-t-05" v-if="getInfo.store.isAuth == 1"></div>
          <span class="col-9 mar-r">{{getInfo.store.shareNum}}分享</span>
          <span class="col-9 mar-r">{{getInfo.store.viewNum}}浏览</span>
        </div>
      </dd-layout-user>
      <div class="flex-y-center pad-t dh-40 flex-y-center">
        <span class="flex-g-1 col-6 fon-b hide-e dh-40 lineH-40">{{getInfo.store.address}}</span>
        <span class="miw-175 col-6 t-r" @click="openMap"><i class="iconfont icon-daohang mar-r"></i>导航</span>
      </div>
    </div>
    <div class="mar-30 br-r-30 bg-f posi-r">
      <Banner
        v-if="photoList.length"
        :swiper="{children:photoList}"
        :showImage="true"
        :height="395/2"
        :key="photoList.length"
      ></Banner>
      <div class="pad-lr-20 pad-tb">
        <div class="flex-bt flex-y-center">
          <div class="flex-y-center">
            <span class="col-f bg-FF4800 fon-xsss pad-4-4-2 mar-r-10 br-r-4" v-if="getInfo.store.isLine">营业中</span>
            <span>营业时间 | {{getInfo.store.startTime}}-{{getInfo.store.endTime}}</span>
          </div>
          <span class="flex-y-center" :class="getInfo.store.follow&&'col-t'" @click="collectHandle">
            <i
              class="iconfont icon-chakantieziguanzhu mar-r-10"
            ></i>关注</span>
        </div>
        <div class="mar-t pad-b-20 flex-wrap" v-if="getInfo.store.tag.length > 0">
          <span class="dis-ib bg-FFECF2 col-FF0E3B pad-8-10-4 mar-r-10 mar-b-10 br-r-4"
                v-for="(tag , t) in getInfo.store.tag"
                v-if="tag"
                :key="t">{{tag}}</span>
        </div>
      </div>
    </div>

    <div class="pad-lr bg-f mar-b">

      <!--个人公告没有-->
      <!--<div class="br-b-F0 dh-110 flex-y-center">-->
      <!--<span>公告 <i class="iconfont icon-gonggao"></i></span>-->
      <!--<div class="flex-g-1 ">-->
      <!--<van-swipe class="hei100 flex-1" v-if="list.length > 0" :autoplay="3000" :show-indicators="false" vertical>-->
      <!--<van-swipe-item-->
      <!--class="dh-88 flex-y-center"-->
      <!--v-for="(item,key) in list"-->
      <!--:key="key"-->
      <!--@click="goPointPage({name:'Announcement',params:{list,index:key}})"-->
      <!--&gt;-->
      <!--<div>-->
      <!--<h1 class="fon-w6 mar-b-10 fon-b">{{item.title}}</h1>-->
      <!--<p class="col-9 dh-34 lineH-34">{{item.content}}</p>-->
      <!--</div>-->
      <!--</van-swipe-item>-->
      <!--</van-swipe>-->
      <!--</div>-->
      <!--<i class="iconfont icon-youjiantou2"></i>-->
      <!--</div>-->


      <div class="br-b-F0 dh-110 flex-y-center flex-bt">
        <span class="fon-xl fon-wb">联系电话</span>
        <i class="iconfont icon-dianhua4 col-t fon-50" @click="callTel(getInfo.store.linkTel)"></i>
      </div>
      <div class="br-b-F0 dh-110 flex-y-center flex-bt">
        <span class="fon-xl fon-wb">{{storeConfig.field}}微信</span>
        <i class="iconfont icon-erweima col-t fon-50" @click="popupConfig.showCode = true"></i>
      </div>
      <div v-if="getInfo.store.vr" class="dh-110 flex-y-center flex-bt">
        <span class="fon-xl fon-wb">{{storeConfig.field}}VR</span>
        <i class="iconfont icon-shipin col-t fon-50" @click="goVr"></i>
      </div>
    </div>

    <div class="pad-l mar-b bg-f pad-tb flex-y-center flex-bt"
         v-if="getInfo.store.meal.indexOf('coupon')>-1&&getInfo.power.coupon.length > 0">
      <div class="mar-r miw-175">
        <div class="fon-xl fon-wb mar-b-20">优惠劵</div>
        <p class="col-9">共{{getInfo.power.coupon.length}}张可领</p>
      </div>
      <div class="flex-g-1 flex-y-center over-a w100">
        <div class="dh-100 flex-g-0 flex-bt flex-y-center" v-for="(item,key) in getInfo.power.coupon" :key="key"
             @click="goPointPage('/auxiliary/coupon/details?couponId='+item.id)">
          <div class="pad-lr coupon-left-bg pad-tb flex-y-center  dh-100">
            <div class="">
              <div class="col-f mar-b-10">
                <span>￥</span>
                <span class="fon-xxl fon-wb">{{item.discount}}</span></div>
              <div class="col-f">{{item.condition}}</div>
            </div>
          </div>
          <div class="mar-r col-f dh-100 w-100 coupon-right-bg fon-xss pad-r-10 flex-center">
            <span class="w-44 pad-l">立即领取</span></div>
        </div>
      </div>
    </div>
    <div v-if="getInfo.store.meal.indexOf('rush')>-1&&getInfo.power.rushBuy.length > 0">
      <div class="pad-30 bg-f">
        <div class="flex-y-center flex-bt">
          <div>
            <span class="fon-xll fon-wb col-3">限时抢购</span>
          </div>
          <div class="col-bb" @click="goPointPage('/auxiliary/rushBuy')">更多<i class="iconfont icon-youjiantou2"></i>
          </div>
        </div>
      </div>
      <div class="mar-b">
        <div class="flex-y-center pad-30 bg-f"
             v-for="(item,key) in getInfo.power.rushBuy"
             @click="goPointPage('/auxiliary/rushBuy/rushBuyDetails?id='+item.id)"
             :key="key"
        >
          <dd-layout-img
            :width="2.34" :height="2.34" :fillet="0.3"
            :src="item.cover"/>
          <div class="mar-l flex-g-1  ">
            <div class="fon-wb fon-lg lineH-40 hide-e-2 dh-76">{{item.title}}</div>
            <div class="flex flex-y-center">
              <div class="flex-g-1 bg-FFEBE3 dh-30 br-r-20 posi-r over-h mar-tb flex-center">
                <div class="posi-a hei100 bg-FF4800 br-r-20 l0" :style="{width:item.percentage}"></div>
              </div>
              <span class="miw-85 t-c col-bb">{{item.percentage}}</span>
            </div>

            <div class="flex-y-center flex-bt">
              <span class="col-t fon-wb fon-xxl">￥{{item.price}}<em class="col-9 t-d-l fon-xss mar-l fon-w1">￥{{item.money}}</em></span>
              <span class="col-f pad-12-20-10 bg-t br-r-30">立即抢购</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="getInfo.store.meal.indexOf('group')>-1&&getInfo.power.assembel.length > 0">
      <div class="pad-30 bg-f">
        <div class="flex-y-center flex-bt">
          <div>
            <span class="fon-xll fon-wb col-3">全民拼团</span>
          </div>
          <div class="col-bb" @click="goPointPage('/auxiliary/assemble')">更多<i class="iconfont icon-youjiantou2"></i>
          </div>
        </div>
      </div>
      <div class="mar-b">
        <div class="flex-y-center pad-30 bg-f"
             v-for="(item,key) in getInfo.power.assembel"
             @click="goPointPage('/auxiliary/assemble/goodsDetails?assembleId='+item.id)"
             :key="key">
          <dd-layout-img
            :width="2.34" :height="2.34" :fillet="0.3"
            :src="item.cover"/>
          <div class="mar-l flex-g-1  ">
            <div class="fon-wb fon-lg lineH-40 hide-e-2 dh-76">{{item.title}}</div>
            <div class=" mar-tb">
              <span class="col-9 bg-FBFBFB pad-4-4-2 mar-r" v-for="(label,l) in item.label" :key="l">{{label}}</span>
            </div>
            <div class="flex-y-center flex-bt">
              <span class="col-t fon-wb fon-xxl">￥{{item.price}}<em class="col-9 t-d-l fon-xss mar-l fon-w1">￥{{item.money}}</em></span>
              <span class="col-f pad-12-20-10 bg-t br-r-30">去购买</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="getInfo.store.meal.indexOf('bargain')>-1&&getInfo.power.bargain.length > 0">
      <div class="pad-30 bg-f">
        <div class="flex-y-center flex-bt">
          <div>
            <span class="fon-xll fon-wb col-3">天天砍价</span>
          </div>
          <div class="col-bb" @click="goPointPage('/auxiliary/bargain')">更多<i class="iconfont icon-youjiantou2"></i>
          </div>
        </div>
      </div>
      <div class="mar-b">
        <div class="flex-y-center pad-lr pad-b bg-f"
             @click="goPointPage('/auxiliary/bargain/details?bargainId='+item.id)"
             v-for="(item,key) in getInfo.power.bargain" :key="key">
          <dd-layout-img
            :width="1.8" :height="1.8" :fillet="0.3"
            @click="goPointPage('/auxiliary/bargain/details?bargainId='+item.id)"
            :src="item.cover"/>
          <div class="mar-l flex-g-1  ">
            <div class="fon-wb fon-lg lineH-40 hide-e-2 dh-76">{{item.title}}</div>
            <div class=" mar-tb">
              <!--<span class="col-9 bg-FBFBFB pad-4-4-2 mar-r">可退换</span>-->
              <!--<span class="col-9 bg-FBFBFB pad-4-4-2 mar-r">假一赔十</span>-->
            </div>
            <div class="flex-y-center flex-bt">
              <span class="col-t fon-wb fon-xxl">￥{{item.price}}<em class="col-9 t-d-l fon-xss mar-l fon-w1">￥{{item.money}}</em></span>
              <span class="col-f pad-12-20-10 bg-t br-r-30">去砍价</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mar-b bg-f pad-b" v-if="getInfo.store.meal.indexOf('shop')>-1&&getInfo.power.goods.length > 0">
      <div class="pad-30 bg-f">
        <div class="flex-y-center flex-bt">
          <div>
            <span class="fon-xll fon-wb col-3">商城商品</span>
          </div>
          <div class="col-bb" @click.stop="goPointPage('/auxiliary/mall/storeDetails?id='+ getInfo.store.id )">更多<i
            class="iconfont icon-youjiantou2"></i></div>
        </div>
      </div>
      <div class="pad-lr flex-bt">
        <div class="w-330 br-r-20 box-sha bg-f"
             v-for="(item,key) in getInfo.power.goods"
             @click="goPointPage({path:'/auxiliary/mall/details',query:{goodsId:item.id}})"
             :key="key">
          <dd-layout-img :src="item.cover" :width="3.3" :height="3.19"
                         @click="goPointPage({path:'/auxiliary/mall/details',query:{goodsId:item.id}})"
                         class="br-r-tr-20 br-r-tl-20"/>
          <div class="pad-30">
            <div class="fon-wb mar-b-20 hide-e">{{item.title}}</div>
            <p class="flex-y-center"><span class="col-t fon-xll mar-r fon-wb">￥{{item.price}}</span> <span
              class="col-9 t-d-l fon-xss">￥{{item.money}}</span></p>
          </div>
        </div>
      </div>
    </div>

    <dd-layout-part-list info-title="同城活动" link-tips="更多" link="/auxiliary/activity"
                         v-if="getInfo.store.meal.indexOf('activity')>-1&&getInfo.power.activity.length > 0">
      <dd-layout-part
        v-for="(item,key) in getInfo.power.activity"
        :src="item.cover"
        :key="key"
        :title="item.title"
        class="mar-l"
        @click="goPointPage('/auxiliary/activity/details?activityId='+item.id)"
      />

    </dd-layout-part-list>

    <div class="dh-96 bg-F2F3F5 flex-bt flex-y-center pad-lr col-9" @click="openReport(getInfo.store.id,2)">
      如遇无效、虚假等信息，请立即举报哦！
      <div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>点此举报</div>
    </div>

    <div class="flex-bt dh flex-bt w100 flex-y-center bg-f">
      <div v-for="(item,key) in tabs"
           :key="key"
           :class="params.sort == item.value?'col-3 fon-wb fon-xll':'fon-lg col-9'"
           class=" dh mar-lr flex-center flex-g-1"
           @click="changeType(item.value)"
      >
        <div class="posi-r dh flex-y-center fon-w5" :class="type == item.value&&'col-3 fon-xll fon-wb'">
          {{item.name}}
          <span v-if="type == item.value" class="dh-8 posi-a b0 flex-center w100">
            <em class="bg-t dh-8 w-48 br-r-16"></em>
          </span>
        </div>
      </div>
    </div>
    <div class="bg-f info-body pad-tb-30" v-show="type=='introduction'">
      <video class="base-pad b-box" v-if="getInfo.store.video" :src="getInfo.store.video" width="100%"
             controls="controls" x5-playsinline="" playsinline="true" webkit-playsinline="true"
             x-webkit-airplay="true" x5-video-player-type="h5"
             x5-video-player-fullscreen="" x5-video-orientation="portraint"
      ></video>
      <dd-layout-html :html="getInfo.store.introduce"/>
      <div class="pad-lr">
        <img :src="item.url" class="mar-b-20 br-r-20" @click="previewImage(item.url,photoList.map(item=>item.url))"
             v-for="(item,key) in photoList" :key="key">
      </div>

    </div>

    <div v-show="type=='dynamic'" class="bg_search_bg">
      <basic-note-item :post-data="item" v-for="(item,key) in postData" :key="key"/>
      <not-data v-if="isRequest && postData.length == 0 "/>
      <more v-else :status="hasMore"/>
    </div>

    <div class="bg_search_bg pad-30">
      <div class="bg-f br-r-30 pad-30">
        <div class="t-c">
          <div id="qrcode" class="w-259 h-259 mar-a mar-b-20 over-h mar-t" ref="qrcode"></div>
        </div>
        <p class="t-c col-9">长按识别二维码保存关注</p>

        <div class="mar-lr flex-bt mar-t">
          <div @click="callTel(getInfo.store.linkTel)"
               class="flex-center flex-g-1 br-r-40 dh-80 bg-line-FF4C61-FE2E4C col-f fon-b mar-r">
            <span class="flex-y-center"><i
              class="iconfont icon-biaoqing1 mar-r fon-xxl"></i>联系{{storeConfig.field}}</span>
          </div>
          <div @click="openMap" class="flex-center flex-g-1 br-r-40 dh-80 bg-line-FDA544-FF9426 col-f fon-b mar-l">
            <span class="flex-y-center"><i class="iconfont icon-daohang mar-r fon-xxl"></i>到店导航</span>
          </div>
        </div>
      </div>
    </div>

    <details-footer v-bind="footerConfig" @method="footerChoice"></details-footer>

    <dd-poster-btn
      qrcode="https://app.zhycms.com/file/2/jpg/2018/12/07/8NJFJlOICB5JErFC.jpg"
      :logo="getInfo.store.logo"
      :nickname="getInfo.store.name||'同城商家'"
      :body="getInfo.store.introduce"
      :desc="'注：联系我时，请说明是在'+$store.state.platform.name+'上看到的...'"
      :photos="photoList&&photoList.length?photoList.map(item=>item.url):[]"
    />

    <!--弹窗-->
    <Popup class="zIndex999999 l0"
           v-if="popupConfig.showCode"
           :QRCode="popupConfig.qrcode"
           @close="popupConfig.showCode = false"
           desc="保存二维码添加我为好友"/>


  </div>

</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import {utilMixins} from "../../plugins/util-mixins";
  import {assetPath, PlaceholderAvatar, PlaceholderImg} from "../../project-config/base";
  import {hideLoading, showLoading} from "../../util";
  import {Toast} from "vant";
  import {openLocation, updateShareConfig} from "../../util/wechat-util";
  import Banner from '@/components/home/banner';
  import DdPosterBtn from '../../components/template/dd-poster-btn'
  import DdLayoutUser from "../../components/layout/dd-layout-user";
  import DdLayoutPartList from "../../components/layout/dd-layout-part-list";
  import DdLayoutImg from "../../components/layout/dd-layout-img";
  import DdLayoutPart from "../../components/layout/dd-layout-part";
  import DdLayoutArticleInfo from "../../components/layout/dd-layout-article-info";
  import DdLayoutActivity from "../../components/layout/dd-layout-activity";
  import DdLayoutHtml from "../../components/layout/dd-layout-html";
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";
  import DetailsFooter from '@/components/template/details-footer'
  import Popup from '../../components/popup'       // 弹窗
  import report from '@/assets/img/other/report.png'


  export default {
    mixins: [utilMixins],
    name: "ShopDetail",
    components: {
      BasicNoteItem,
      DdLayoutHtml,
      DdLayoutArticleInfo,
      DdLayoutPart,
      DdLayoutImg,
      DdLayoutPartList,
      DdLayoutUser,
      DetailsFooter,
      DdPosterBtn,
      Banner,
      DdLayoutActivity,
      Popup
    },
    data() {
      return {
        report,
        popupConfig: {
          showCode: false,
        },
        tabs: [
          {name: '商家介绍', value: 'introduction'},
          {name: '商家动态', value: 'dynamic'},
          // {name: '用户评论', value: 'userComment'}
        ],
        type: 'introduction',
        params: {},
        goodsList: [],
        getGoodsParams: {
          storeId: null,
          page: 1,
          size: 10
        },
        footerConfig: {
          menu: [
            {
              icon: 'icon-shouyexian',
              name: '首页',
              color: '#818181',
            }, {
              icon: 'icon-biaoqing1',
              name: '私信',
              color: '#818181',
            }, {
              icon: 'icon-store1',
              iconActive: 'icon-collection-b',
              name: '入驻',
              color: '#818181',
              colorActive: this.$themeColor,
              useActive: false,
            },
          ],
          main: {
            name: '联系商家',
            childrenName: '',
          }
        },
        isEnter: false,
        postData: [],
        params: {
          size: 10,
          page: 1,
          status: "display",
        },
        hasMore: true,
        isRequest: false,
        assembels: [],
        latLng: undefined,
        showMapDialog: false,
        showQrCodeDialog: false,
        PlaceholderAvatar,
        PlaceholderImg,
        storeId: 0,
        showMoreFeature: true,
        images: [PlaceholderImg, PlaceholderImg, PlaceholderImg, PlaceholderImg, PlaceholderImg],
        link: {
          album: {
            path: '/album',
            query: {
              pictures: [],
              title: "相册"
            }
          }
        },
        coupons: [],
        couponLen: 0,
      }
    },
    methods: {
      ...mapActions("shop", [
        "getShopInfoWithUserId",
        "collectStore",
        "preservationShareNum"
      ]),
      ...mapActions('post', ['getMyPostListByParams']),
      ...mapActions('coupon', ['getMyReleaseCoupon']),
      ...mapActions('mall', ['getMallBusinessGoodsList']),
      ...mapActions("businessDistrict", ["getStoreByAdminId"]),
      goVr() {
        window.location.href = this.getInfo.store.vr
      },
      async footerChoice(e) {
        console.log(e)

        switch (e) {
          case -1:
            this.callTel(this.getInfo.store.linkTel);
            break;
          case 0:
            this.goPointPage('/home')
            break;
          case 1:
            this.goPointPage({path: '/conversation', query: {tId: this.getInfo.store.userId}})
            break;
          case 2:
            const bool = await this.checkBindTel({callBack: true})
            if (!bool) return
            if (this.isEnter) return Toast({message: "您的门店待审核中", duration: 1500});
            this.goPointPage("/publication/businessEnterForm");
            break;
        }
      },
      openMap() {
        openLocation({
          lat: this.shopDetail.lat,
          lng: this.shopDetail.lng,
          name: `${this.shopDetail.storeName}`,
          address: this.shopDetail.address
        })
      },
      changeType(value) {
        this.type = value;
        this.postData.length == 0 && this.getStoreDynamic()
      },
      onInfinite() {
        if (this.type == 'dynamic' && this.hasMore) {
          this.params.page++;
          this.getStoreDynamic()
        }
      },
      /** 获取商家的动态 */
      async getStoreDynamic() {
        showLoading()
        const res = await this.getMyPostListByParams({
          ...this.params,
          userId: this.getInfo.store.userId
        })
        hideLoading()
        this.postData = this.postData.concat(res)
        this.hasMore = res.length >= this.params.size;
        this.isRequest = true;
      },
      async collectHandle() {
        const bool = await this.checkBindTel()
        if (!bool) return
        showLoading();
        const {status} = await this.collectStore({
          postId: this.shopDetail.id,
          userId: this.user.id,
          type: 2
        });
        hideLoading();
        let message = "已取消关注";
        if (status === 1) {
          message = "关注成功";
        }
        Toast.success({
          duration: 800,
          message
        });
        this.getShopInfoWithUserId({id: this.storeId});

      },
      async isBusiness() {
        const storeInfo = await this.getStoreByAdminId({
          adminId: this.user.id
        });

        if (storeInfo && storeInfo.length && storeInfo[0].status == '0') {
          this.isEnter = true;
        }
      }
    },
    mixins: [utilMixins],
    computed: {
      ...mapState("shop", {
        shopDetail: state => state.shopDetail
      }),
      ...mapState("common", {
        storeConfig: state => state.storeConfig
      }),
      ...mapState({
        user: s => s.user
      }),
      getInfo() {
        console.log("this.shopDetail", this.shopDetail)


        let data = this.shopDetail;

        let store = {
            logo: data.storeLogo && this.getSingleImg(this.getType(data.storeLogo) == 'array' ? data.storeLogo[0].url : JSON.parse(data.storeLogo)[0].url),
            name: data.storeName,
            isAuth: data.isAuth,
            shareNum: +data.shareNum || 0,
            viewNum: +data.viewNum || 0,
            address: data.address,
            id: data.id,
            startTime: data.businessStartTime,
            endTime: data.businessEndTime,
            tag: data.storeLabel || [],
            linkTel: data.linkTel,
            isLine: data.businessEndTime > this.formatDateByTimeStamp(new Date().getTime()).split(" ")[1],
            introduce: data.introduce,
            userId: data.adminId,
            wxCode: data.wxImg && data.wxImg.length > 10 && this.getSingleImg(JSON.parse(data.wxImg)[0].url),
            vr: data.vr || '',
            follow: data.follow,
            video: data.video,
            meal: data.meal || [],
          },
          power = {
            bargain: data.bargain || [],
            coupon: data.coupon || [],
            assembel: data.group || [],
            rushBuy: data.rush || [],
            goods: data.goods || [],
            activity: data.activity || []
          }

        this.popupConfig.qrcode = store.wxCode;


        if (power.bargain.length > 0) {
          power.bargain = power.bargain.map(item => {
            return {
              cover: this.getSingleImg(item.logo),
              title: item.title,
              price: (+item.floorPrice).toFixed(2),
              money: (+item.price).toFixed(2),
              id: item.id
            }
          })
        }

        if (power.rushBuy.length > 0) {
          power.rushBuy = power.rushBuy.map(item => {
            return {
              cover: item.showImgs[0] ? this.getSingleImg(item.showImgs[0].url) : '',
              title: item.title,
              price: (+item.rushPrice).toFixed(2),
              money: (+item.originalPrice).toFixed(2),
              id: item.id,
              percentage: parseInt(item.salesNum / (parseInt(item.num) + parseInt(item.salesNum)) * 100) + '%'
            }
          })
        }

        if (power.assembel.length > 0) {
          power.assembel = power.assembel.map(item => {
            return {
              cover: item.showImgs[0] ? this.getSingleImg(item.showImgs[0].url) : '',
              title: item.title,
              price: (+item.groupPrice).toFixed(2),
              money: (+item.originalPrice).toFixed(2),
              label: item.label,
              id: item.id,
            }
          })
        }

        if (power.goods.length > 0) {
          power.goods = power.goods.map(item => {
            return {
              cover: item.showImgs[0] ? this.getSingleImg(item.showImgs[0].url) : '',
              title: item.title,
              price: (+item.currentPrice).toFixed(2),
              money: (+item.originalPrice).toFixed(2),
              label: item.label,
              id: item.id,
            }
          })
        }
        if (power.coupon.length > 0) {
          power.coupon = power.coupon.map(item => {
            if (item.type == 1 || item.type == 3) {
              item.discount = item.reduce + '元'
            } else if (item.type == 2) {
              item.discount = item.discount + '折'
            }
            return {
              price: +item.money > 0 ? item.money : +item.stock > 0 ? '免费领取' : '不可领取',
              discount: item.discount,
              condition: item.condition <= 0 ? '无门槛' : '满' + (+item.condition).toFixed(2) + '可用',
              id: item.id
            }
          })
        }

        if (power.activity.length > 0) {
          power.activity = power.activity.map(item => {
            return {
              cover: item.showImgs[0] ? this.getSingleImg(item.showImgs[0].url) : '',
              title: item.name,
              id: item.id
            }
          })
        }
        return {
          store, power
        }
      },
      photoList() {
        this.link.album.query.pictures = this.shopDetail.photoList
          ? this.shopDetail.photoList.map(({url}) => {
            return {
              url: this.getPathByAssetPath(url)
            }
          })
          : [];
        return this.link.album.query.pictures;
      },
    },
    async created() {

      const {storeId, isShare} = this.$route.query;

      this.getGoodsParams.storeId = this.storeId = storeId;
      if (this.storeConfig.isLogin == 1) {
        const bool = await this.checkBindTel({callBack: true})
        if (bool==false) this.goPointPage({
          path: '/home'
        },true);
      }
      await this.getShopInfoWithUserId({id: storeId});
      document.title = this.shopDetail.storeName || '商家详情'
      this.latLng = {
        latitude: this.shopDetail.lat,
        longitude: this.shopDetail.lng,
      }

      if (isShare) {
        this.preservationShareNum({storeId}).then(result => {
          console.log('分享的结果', result)
        })
      }
      this.isBusiness()

      updateShareConfig({
        title: this.getInfo.store.name,
        imgUrl: this.getInfo.store.logo,
        desc: this.shopDetail.introduce,
        link: window.location.href,
      });


      window.requestAnimationFrame(() => {
        this.getQRCode({
          dom: this.$refs.qrcode,
          url: window.location.href
        });
        // setTimeout(() => {
        //   this.$refs.qrcode.querySelector('canvas').style.display='block'
        //   this.$refs.qrcode.querySelector('img').style.display='none'
        //   console.log('11111111111111', this.$refs.qrcode.querySelector('canvas').style.display)
        // }, 2000)
      })

      this.onscroll(this.onInfinite, this.$route.path);
      if (this.storeConfig.enter != 1) {
        this.footerConfig.menu.splice(2, 1)
      }
      //
      this.tabs[0].name = this.storeConfig.field + '介绍'
      this.tabs[1].name = this.storeConfig.field + '动态'
      this.footerConfig.main.name = '联系' + this.storeConfig.field
    }
  }
</script>
