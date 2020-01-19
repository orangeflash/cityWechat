<template>
  <!--砍价详情-->
  <div :style="{background:bargainInfo.bg}" class="pad-b130">
    <Header/>
    <Banner v-bind="banner" :showImage="true"/>
    <ddMusic slot="float" class="posi-f t0 r0 mar-t-150 mar-r" :autoPlay="true" v-if="bargainInfo.music"
             v-model="bargainInfo.music"/>
    <div class="mar-lr bg-f posi-r t-c mar-t" style="margin-top: -1.2rem">
      <div class="pad-lr br-b-d pad-b">
        <div class="flex-x-center">
          <face
            :src="bargainInfo.portrait"
            size="60"
            style="margin-top: -0.6rem;"
          ></face>
        </div>
        <p class="fon-lg mar-b mar-t">{{bargainInfo.userName}}<span class="col-9">(发起人)</span></p>
        <p class="fon-xl mar-b">{{bargainInfo.title}}</p>
        <div v-if="bargainInfo.state != 4">
          <p class="mar-b">
            <span class="col-price fon-b mar-r">底价:￥{{bargainInfo.floorPrice}}</span>
            <span class="col-9">原价:￥{{bargainInfo.price}}</span>
            <span class="col-9" v-if="orderInfo.money">现价:￥{{orderInfo.money}}</span>
          </p>
          <div class="flex-bt col-9">
            <div>浏览 <em class="col-f52c2c">{{bargainInfo.viewNum}}</em> 分享 <em class="col-f52c2c">{{bargainInfo.shareNum}}</em>
              参与
              <em class="col-f52c2c">{{bargainInfo.joinNum}}</em>
            </div>
            <div>仅剩 <em class="col-t">{{bargainInfo.stock}}份</em></div>
          </div>
        </div>
        <div v-else>
          <ul class="col-9 flex">
            <li class="flex-g-1 t-c fon-lg"><p class="mar-b-20">原价</p><span class="">￥{{bargainInfo.price}}</span></li>
            <li class="flex-g-1 t-c fon-lg"><p class="mar-b-20">底价</p><span class="col-price fon-lg">￥{{bargainInfo.floorPrice}}</span>
            </li>
            <li class="flex-g-1 t-c fon-lg"><p class="mar-b-20">购买价</p><span
              class="col-price fon-lg">￥{{orderInfo.money}}</span>
            </li>
          </ul>
          <div v-if="orderInfo.delivery == 2" class="flex-x-center mar-t mar-b">
            <div class="w-500 h-500" id="qrcode" ref="qrcode"></div>
          </div>
          <!--<div class="fon-xll t-c mar-t mar-b">核销码：<span class="col-t">258741369</span></div>-->
          <div class="fon-b t-c col-6 mar-b">消费截止：{{bargainInfo.endTime}}</div>
          <div class="pad-t col-9 t-l flex-y-center">浏览 <span class="col-f52c2c">{{bargainInfo.viewNum}}</span> 分享 <span
            class="col-f52c2c">{{bargainInfo.shareNum}}</span>
            参与 <span
              class="col-f52c2c">{{bargainInfo.stock}}</span></div>
        </div>

      </div>
      <div class="pad-30" v-if="bargainInfo.state != 4">
        <div v-if="bargainInfo.state >= 2">
          <div class="dh-20 br-v posi-r br-r-20 bg-aec">
            <div class="posi-a w100 col-f flex-center">{{bargainInfo.progress+'%'}}</div>
            <div class="dh-20 bg-t" :style="{width:bargainInfo.progress+'%'}"></div>
          </div>
          <div class="flex-bt col-t mar-b mar-t">
            <span>已砍{{bargainInfo.bargainMoney}}元 </span>
            <span>还剩{{(Math.abs(bargainInfo.price - bargainInfo.bargainMoney - bargainInfo.floorPrice)).toFixed(2)}}元</span>
          </div>
        </div>
        <div class="dh-100 btn-b col-f569 flex-center fon-xll" v-if="bargainInfo.state == 1" @click="startBargain">
          发起砍价
        </div>
        <div class="flex-bt" v-else-if="bargainInfo.state == 2 && orderInfo.userId == userInfo.id">
          <div class="btn-b w100 flex-center dh-100 col-f569 flex-y-center fon-xll mar-r" v-if="bargainInfo.isFloor"
               @click="show = !show">
            现价购买
          </div>
          <div class="btn-b-2 dh-100 w100  flex-center fon-xll flex-y-center col-fe10 mar-l"
               @click="showMask = !showMask">
            邀请好友砍价
          </div>
        </div>
        <div class="flex-bt" v-else-if="orderInfo.userId != userInfo.id">
          <div class="btn-b w100 flex-center dh-100 col-f569 flex-y-center fon-xll mar-r"
               @click="atNowBargain(orderInfo.id)">
            帮好友砍一刀
          </div>
          <div class="btn-b-2 dh-100 w100  flex-center fon-xll flex-y-center col-fe10 mar-l"
               @click="startBargain">
            发起我的砍价
          </div>
        </div>
        <div class="dh-100 btn-b col-f569 flex-center fon-xll" v-else-if="bargainInfo.state == 3" @click="show = !show">
          立即购买
        </div>

        <p class="mar-t" v-if="expireTime.length&&bargainInfo.state == 2">剩余时间：
          <em class="col-t">{{expireTime[0]}}</em>天
          <em class="col-t">{{expireTime[1]}}</em>时
          <em class="col-t">{{expireTime[2]}}</em>分
          <em class="col-t">{{expireTime[3]}}</em>秒</p>
      </div>

    </div>
    <chunk
      title="砍价帮帮团"
      icon="icon-kanjia"
      title-posi="center"
      class="mar-30 col-price"
      v-if="bargainList.length"
    >
      <div slot="content" class="br-t-e col-3 ">
        <div class="flex-y-center flex-bt br-b-d mar-30 pad-b"
             v-for="(order,key) in bargainList"
             :key="key"
        >
          <user-info
            size="33"
            :src="order.portrait"
            :name="order.userName"
            fontSize="26"
            :info="order.time"
            infoColor="#999"
          />
          <div class="t-r">
            <i class="iconfont icon-kanjia fon-46 col-v"></i>
            <span class="col-price fon-lg">已砍{{order.money}}元</span>
          </div>
        </div>
      </div>
    </chunk>
    <chunk
      title="砍价进行时"
      icon="icon-kanjia"
      title-posi="center"
      class="mar-30 col-t"
      v-else-if="orderList.length"
    >
      <div slot="content" class="br-t-e col-3 ">
        <div class="flex-y-center flex-bt br-b-d mar-30 pad-b"
             v-for="(order,key) in orderList"
             :key="key"
        >
          <user-info
            size="33"
            :src="order.portrait"
            :name="order.userName"
            fontSize="26"
            :info="order.time+' 发起砍价'"
            infoColor="#999"
          />
          <div class="t-r">
            <i class="iconfont icon-kanjia fon-46 col-v"></i>
            <span class="col-price fon-lg">砍至{{order.money}}元</span>
          </div>
        </div>
      </div>
    </chunk>

    <chunk title="商家信息" icon="icon-shangdian" class="col-price mar-lr" titlePosi="center">
      <div slot="content" class="pad-r pad-l br-t-d pad-t col-3">
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
          <div class="flex-center"><i class="iconfont icon-dianhuahover col-price fon-xxl"
                                      @click="callTel(storeInfo.linkTel)"></i></div>
        </div>
        <div class="flex-bt pad-t pad-b">
          <div>
            <div class="lineH-38 mar-r pad-r">{{storeInfo.address}}</div>
            <!--<p class="col-9"></p>-->
          </div>
          <div class="flex-center" @click="openLocation(storeInfo)"><i
            class="iconfont icon-qunfengfabushangxian col-b fon-xxl"></i></div>
        </div>
      </div>
    </chunk>
    <div class="flex-bt pad-t bg-F2F3F5 pad-b mar-lr pad-lr" @click="openReport(bargainInfo.id,7)">
      <div>
        <div class="lineH-38 mar-r ">如遇无效、虚假等信息，请立即举报哦！</div>
      </div>
      <div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>举报</div>
    </div>
    <chunk
      title="减价详情"
      icon="icon-wodefabu-xi"
      title-posi="center"
      class="mar-30 col-price"
    >
      <div slot="content" class="br-t-e col-3  pad-30">
        <dd-layout-html :html="bargainInfo.body" class="mih-50 fon-b"></dd-layout-html>
        <div class="t-c">
          <img-wrapper class="mw100 mar-b"
                       isShowView="true"
                       :pictures="bargainInfo.imgs"
                       v-for="(src,k) in bargainInfo.imgs" :key="k" :src="src" not-load="true"/>
        </div>
      </div>
    </chunk>
    <!--<share-mask :show-mask.sync="showMask"/>-->


    <!--海报部分-->
    <dd-poster-goods
      v-model="showMask"
      label="砍价"
      :cover="banner.swiper.children[0]?banner.swiper.children[0].url:''"
      :price="bargainInfo.floorPrice"
      :origin-price="bargainInfo.price"
      :url="codeUrl"
      :title="bargainInfo.title"
      desc="长按识别二维码帮我砍价"
    />

    <!--<div class="posi-f t0 l0 r0 b0 zIndex99 flex-center" v-if="showMask">-->
    <!--<div class="posi-a t0 l0 r0 b0 bg-0-5" @click="showMask = !showMask"></div>-->
    <!--<div class="w-600 bg-f posi-r" ref="baseUrlBox" style="padding: 0;">-->
    <!--<img style="margin: 0;" :src="baseUrl" class="w100 t0 l0" v-if="baseUrl">-->
    <!--<div ref="poster" style="padding: 0;" v-else>-->
    <!--<div class="w-600 h-600">-->
    <!--<img-wrapper v-if="banner.swiper.children[0]" :src="banner.swiper.children[0].url"/>-->
    <!--</div>-->
    <!--<div class="flex-bt pad-30 flex-y-center">-->
    <!--<div class="flex-g-1 pad-r">-->
    <!--<div class="fon-b lineH-40">-->
    <!--<span class="flo-l bg-t col-f lineH-34 fon-sm br-r-10 pad-l-10 pad-t-5 pad-r-10 mar-r">砍价</span>{{bargainInfo.title}}-->
    <!--</div>-->
    <!--<div class="mar-t-20 flex-wrap">-->
    <!--<span class="fon-b col-t mar-r">底价:￥{{bargainInfo.floorPrice}}</span>-->
    <!--<span class="col-9 t-d-l fon-xs">原价:￥{{bargainInfo.price}}</span>-->
    <!--<p class="col-9 mar-t-20 fon-xs">长按识别二维码，帮我砍价</p>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="w-200 h-200 miw-200" id="qrcode" ref="qrcode"></div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->

    <dd-down-order v-model="show" :info="goodsInfo" @confirm="downOrder"/>
    <van-popup
      v-model="openSelfMention"
      :position="selfMentionList.length > 0 ?'bottom':'center'"
      style="background: transparent"
    >

      <div v-if="selfMentionList.length > 0">
        <div class="bg-f dh flex-center fon-lg br-b-d">选取自提点</div>
        <van-cell
          v-for="(item,key) in selfMentionList"
          @click="choiceSelfMention(item)"
          :key="key"
          :title="item.detailedAddress" size="large" :label="item.address"
          :value="item.linkTel"
        />
      </div>
      <div v-else style="padding:10px 30px;border-radius: 8px;color: #fff;font-size: 16px">
        暂无数据
      </div>

    </van-popup>

  </div>
</template>

<script>
  import Banner from '@/components/home/banner';
  import Face from "@/components/template/face";
  import Chunk from '../../../components/template/dd-store/chunk';
  import UserInfo from "@/components/template/user";
  import html2canvas from 'html2canvas'
  import CellList from "@/components/template/dd-store/cell-list";
  import DdButton from "@/components/template/button"
  import DdLayoutHtml from "../../../components/layout/dd-layout-html";
  import DdAddressRendering from '@/components/template/dd-addres-rendering';
  import {mapActions, mapState} from 'vuex'
  import DdMusic from "@/components/template/other/music"
  import {Toast} from 'vant'
  import DdDownOrder from '@/components/template/dd-store/down-order'
  import DdPosterGoods from '../../../components/template/dd-poster/goods'
  import {
    format,
    hideLoading,
    picLinkToBase64,
    showDialog,
    showHandleStatusByFlag,
    showLoading,
    timeStampToHMS
  } from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {openLocation, updateShareConfig} from "../../../util/wechat-util";
  import ShareMask from "@/components/publication/share-mask";
  import {redirectPath} from "../../../project-config/base";

  export default {
    mixins: [utilMixins],
    components: {
      Banner,
      Face,
      Chunk,
      UserInfo,
      ShareMask,
      CellList,
      DdButton,
      DdLayoutHtml,
      DdAddressRendering,
      DdMusic,
      DdDownOrder,
      DdPosterGoods
    },
    data() {
      return {
        banner: {          //参数值
          height: 240,
          swiper: {
            children: []
          }
        },
        bargainInfo: {},
        codeUrl: '',
        orderInfo: {},
        goodsInfo: {},
        storeInfo: {},
        orderList: [],
        bargainList: [],
        expireTime: [],
        showMask: false,
        baseUrl: null,
        show: false,
        selfMentionList: [],
        openSelfMention: false,
        params: {
          note: ''
        }
      }
    },
    methods: {
      openLocation,
      ...mapActions("storeAuxiliary/releaseGood", ["getDeliverSet"]),
      ...mapActions("storeAuxiliary/storeBargain", ["getBargainInfo", "beginBargain", "bargaing", "bargainDownOrder"]),
      async downOrder(item) {
        console.log(item);
        const totalMoney = item.money;
        if (totalMoney > 0) {
          try {
            await showDialog("需要支付" + (+totalMoney).toFixed(2) + '元')
          } catch (e) {
            return false;
          }
        }
        showLoading("下单中...")
        const res = await this.bargainDownOrder({
          orderId: item.id,
          ...item
        });
        hideLoading();
        console.log("bargainDownOrder", res);
        if (res.code && !isNaN(res.data)) {
          try {
            this.$router.push({
              name: 'cashier',
              params: {
                type: 40,
                param: {
                  orderId: res.data,
                },
                info: {
                  money: totalMoney,
                  type: "砍价商品支付",
                  callLink: '/auxiliary/bargain/myJoin'
                }
              }
            });
          } catch (e) {
            console.log('老板，我也是需要生存的')
          }

        } else if (totalMoney <= 0) {
          Toast.success({
            message: '购买成功',
            duration: 1500
          })
        } else {
          Toast.fail({
            message: res.msg,
            duration: 1500
          })
        }

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
              url: window.location.href + '&orderId=' + this.orderInfo.id
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
      async atNowBargain(orderId,) {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        showLoading("疯狂砍价中...")
        const res = await this.bargaing({
          orderId
        });
        showHandleStatusByFlag(res.code, '成功砍掉' + res.data + '元', res.msg, () => {
          this.getInfo({orderId})
        });
      },
      async startBargain() {
        showLoading("正在发起中...")
        const res = await this.beginBargain({
          bargainId: this.$route.query.bargainId
        })
        hideLoading();
        if (res.code) {
          this.atNowBargain(res.data);
        } else {
          Toast({
            message: res.msg,
            duration: 1500
          })
        }
      },
      nowBuy() {

      },
      async getInfo(params) {
        showLoading();
        const res = await this.getBargainInfo(params)
        hideLoading();
        this.findInfo(res)
        this.banner.swiper.children = res.logo.map(item => {
          return {url: this.getSingleImg(item.url)}
        })
        this.bargainInfo = {
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
          state: res.state == 4 && res.orderInfo.userId != this.userInfo.id ? 1 : +res.state,    //1.发起砍价2砍价中3.点击购买4完成
          stock: res.stock || 0,
          useTime: format(res.useTime * 1000),
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
          storeId: res.storeId
        }


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
        this.bargainList = (res.bargainInfo || []).map(item => {


          let time = format(item.createdAt * 1000).split("-");
          time.shift();
          return {
            ...item,
            time: time.join("-")
          }
        });
        this.orderList = (res.orderList || []).map(item => {
          return {
            ...item,
            time: format(item.createdAt * 1000)
          }
        });

        /** 订单信息 */
        this.orderInfo = res.orderInfo || {}
        this.params.delivery = this.orderInfo.delivery
        this.params.orderId = this.orderInfo.id
        if (this.bargainInfo.state == 2) {
          const now = new Date().getTime();
          let S = 1000;
          let timeStamp = res.endTime * 1000 - now;
          this.interval = setInterval(() => {
            if (timeStamp <= 0) {
              clearInterval(this.interval);
              this.expireTime = ["00", "00", "00", "00"];
            } else {
              this.expireTime = timeStampToHMS(timeStamp, true).split(":");
              timeStamp -= S;
            }
          }, S)
        }

        if (this.orderInfo.delivery == 2) {
          //获取自提点
          this.getDeliverSet({
            storeId: this.storeInfo.id,
          }).then(result => {
            this.selfMentionList = result;
            console.log("getDeliverSet", result);
          })
        }

        updateShareConfig({
          title: "砍价 " + this.bargainInfo.title,
          imgUrl: this.banner.swiper.children[0].url,
          desc: "快要砍成了，就差你这一刀了",
          link: window.location.href + '&orderId=' + this.orderInfo.id
        });

        this.codeUrl = window.location.href + '&orderId=' + this.orderInfo.id

        this.bargainInfo.state == 4 && setTimeout(() => {
          this.getQRCode({
            dom: this.$refs.qrcode,
            url: redirectPath + "/auxiliary/bargain/writeOff?appId="
              + localStorage.projectAppId + '&orderId=' + this.orderInfo.id
          });
        }, 500)


        this.goodsInfo = {
          cover: this.banner.swiper.children[0].url,
          money: this.orderInfo.money,
          price: this.bargainInfo.price,
          title: this.bargainInfo.title,
          delivery: this.orderInfo.delivery,
          endTime: this.bargainInfo.useTime,
          orderId: this.orderInfo.id,
          storeId: this.bargainInfo.storeId
        }


      },
      getAddressInfo(e) {
        console.log("getAddressInfo", e);
        this.params.receivedName = e.linkName;
        this.params.receivedAddress = e.address + e.detailedAddress;
        this.params.receivedTel = e.linkTel;
        console.log(this.params)
      },
    },
    computed: {
      ...mapState({
        platform: s => s.platform,
        userInfo: s => s.user
      }),
      getTotalMoney() {
        this.params.money = this.bargainInfo.floorPrice;
        return (this.params.num * this.params.money).toFixed(2);
      }
    },
    created() {
      const query = this.$route.query;
      this.isFailParams({
        field: query.bargainId,
        tips: '缺少商品id'
      }, () => {
        if (query.orderId) {
          this.getInfo({orderId: query.orderId})
        } else {
          this.getInfo({id: query.bargainId})
        }
      })
    },
    destroyed() {
      clearInterval(this.interval);
    }
  }

</script>

