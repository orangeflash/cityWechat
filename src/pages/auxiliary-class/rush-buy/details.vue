<template>
  <div id="RushBuyDetails">
    <!--<Header/>-->
    <banner
      v-if="giftDetails.showImgs"
      height="375"
      :showImage="true"
      :swiper="{children:giftDetails.showImgs}"
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

      <dd-layout-div
        slot="cover"
        :height="102"
        bg="linear-gradient(90deg,rgba(255,137,43,1) 0%,rgba(255,30,30,1) 100%)"
        class="posi-a b0 l0 r0 zIndex99 flex-y-center flex-bt"
        :pad="[0,30]"
      >
        <span class="col-f fon-xxl fon-wb">抢购中</span>
        <dd-layout-div class="col-f fon-sm flex flex-y-center">
          距离活动结束还有
          <dd-layout-div class="flex flex-y-center" :mar="[0,0,0,10]">
            <dd-layout-div class="col-r bg-f fon-sm flex-center" :mar="[0,5]" :pad="[10,6,6]" :fillet="8">{{timeArr[0]}}
            </dd-layout-div>
            天
            <dd-layout-div class="col-r bg-f fon-sm flex-center" :mar="[0,5]" :pad="[10,6,6]" :fillet="8">{{timeArr[1]}}
            </dd-layout-div>
            时
            <dd-layout-div class="col-r bg-f fon-sm flex-center" :mar="[0,5]" :pad="[10,6,6]" :fillet="8">{{timeArr[2]}}
            </dd-layout-div>
            分
            <dd-layout-div class="col-r bg-f fon-sm flex-center" :mar="[0,5]" :pad="[10,6,6]" :fillet="8">{{timeArr[3]}}
            </dd-layout-div>
            秒
          </dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
    </banner>

    <dd-layout-div @click="$router.go(-1)" :width="52" :height="52" :mar="[50,20]" :fillet="50"
                   class="t0 l0 posi-a bg-0-5 col-f flex-center">
      <i class="iconfont icon-zuojiantou3 mar-t-5"></i>
    </dd-layout-div>


    <dd-layout-div :pad="[40,30]" class="bg-f">
      <dd-layout-div class="fon-wb fon-xxl" :line-height="45">{{getInfo.title}}</dd-layout-div>
      <dd-layout-div class="flex flex-bt flex-y-center bg-f" :mar="[30,0,0]">
        <dd-layout-div class="col-price fon-wb flex flex-y-center flex-wrap" :font-size="40">
          <span class="mar-r">￥{{getInfo.rushPrice}}</span>
          <dd-layout-div bg="#FFE100" v-if="platform.openVip && getInfo.memberPrice > 0" :font-size="22"
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
        :mar="[30,0,0]"
        @click="goPointPage({path:'/auxiliary/vip/enterVip'})">
        <dd-layout-div>
          <dd-layout-div :font-size="32" class="fon-wb flex">
            <i class="iconfont icon-huangguanhuiyuan mar-r fon-35 col-3"></i>超级会员卡
          </dd-layout-div>
          <dd-layout-div class="col-6 mar-t-20">开通超级会员可<span class="col-t">{{getInfo.memberPrice}}购买</span>
          </dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="c-b-t-lr-300 col-f" :pad="[20,25,16]" :fillet="40">立即开通</dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>


    <dd-layout-div class="bg-f mar-b-20" :pad="[30]">
      <dd-layout-div class="fon-wb mar-b" :font-size="36">购买须知</dd-layout-div>
      <dd-layout-div class="flex-bt flex-y-center br-b-d" :height="95">
        <span class="fon-sm fon-wb">每人限购</span>
        <dd-layout-div>
          <span class="col-r fon-wb fon-sm">限时限量，疯狂抢购(每人限购{{getInfo.limitNum}}份)</span>
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div class="flex-bt flex-y-center br-b-d" :height="95">
        <span class="fon-sm fon-wb">有效期</span>
        <dd-layout-div class="col-6">
          到<span
          class="col-r fon-wb fon-sm">{{`${formatDateByTimeStamp(giftDetails.expireTime,'YYYY-MM-DD HH:mm')}`}}</span>
          截止
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div class="flex-bt flex-y-center" :height="95">
        <span class="fon-sm fon-wb">发货方式</span>
        <dd-layout-div class="col-6">
          {{params.delivery==1?`快递配送:￥${getInfo.freight}`:'到店自提'}}
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>


    <dd-layout-div class="flex bg-f flex-y-center" :pad="[30]"
                   @click="goPointPage({path: '/shopDetail', query: {storeId: getInfo.storeId}});">
      <dd-layout-img :src="storeInfo.logo" :width="1.66" :height="1.66" :fillet="0.3"/>
      <dd-layout-div class="flex-g-1 pad-l">
        <dd-layout-div class="fon-wb fon-xll flex">
          <dd-layout-div class="hide-e flex-g-1 pad-t-5">{{storeInfo.name}}
            <!--<img :src="renzheng" class="w-100 mar-r-10 dh-34">-->
          </dd-layout-div>

        </dd-layout-div>
        <dd-layout-div class="flex-bt" :mar="[25,0]">
          <dd-layout-div class="flex-g-1 flex-bt pad-r-20">
            <span class="fon-sm">{{getInfo.fans || 0}}粉丝</span>
            <span class="fon-sm">{{getInfo.goodsNUm || 0}}商品</span>
            <span class="fon-sm"></span>
          </dd-layout-div>
          <i class="iconfont icon-iconfront-"></i>
        </dd-layout-div>
        <dd-layout-div class="flex">
          <dd-layout-div class="iconfont icon-xingxing mar-r-10 fon-xs" v-for="i in 5"
                         :color="i<= (getInfo.star || 5)?'#f7af27':'#eee'"
                         :key="'s'+i"></dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
    <div class="dh-96 bg-F2F3F5 flex-bt flex-y-center pad-lr col-9 fon-xs" @click="openReport(getInfo.id,5)">
      如遇无效、虚假等信息，请立即举报哦！
      <div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>点此举报</div>
    </div>
    <dd-poster-goods
      v-model="showMask"
      label="抢购"
      :cover="giftDetails.showImgs&&giftDetails.showImgs[0]?getSingleImg(giftDetails.showImgs[0].url):''"
      :price="getInfo.rushPrice"
      :origin-price="giftDetails.originalPrice"
      :title="giftDetails.title"
      desc="长按识别二维码，快来和我一起抢吧"
    />


    <dd-layout-div class="bg-f mar-b-20" :pad="[30]">
      <dd-layout-div class="fon-wb mar-b" :font-size="34">商品详情</dd-layout-div>
      <dd-layout-html class="pad-0" :html="getInfo.details"/>

      <video class="base-pad b-box" v-if="getInfo.video" :src="getInfo.video" width="100%"
             controls="controls" x5-playsinline="" playsinline="true" webkit-playsinline="true"
             x-webkit-airplay="true" x5-video-player-type="h5"
             x5-video-player-fullscreen="" x5-video-orientation="portraint"
      ></video>

      <dd-layout-div
        class="info-body pad-t t-c"
        v-if="getInfo.pictures&&getInfo.pictures.length > 0">
        <img
          class="br-r-20 mar-b dis-b mar-a mw100 "
          @click.stop="previewImage(url,getInfo.pictures)"
          v-for="(url,key) in getInfo.pictures"
          :src="url"
          :key="key"/>
      </dd-layout-div>
    </dd-layout-div>


    <dd-layout-div :height="120">
      <dd-layout-div :height="120" class="flex bg-f flex-y-center posi-f b0 l0 r0">
        <dd-layout-div class="flex-g-1 flex">
          <dd-layout-div
            v-for="(item,key) in footerConfig.menu"
            :key="key"
            class="flex-center flex-g-1"
            @click="footerHandle({key})"
          >
            <dd-layout-div class="t-c">
              <i class="iconfont col-9 fon-40" :class="item.icon"></i>
              <dd-layout-div class=" col-9 mar-t-10">{{item.name}}</dd-layout-div>
            </dd-layout-div>
          </dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class=" flex">
          <dd-layout-div
            class="col-f  mar-r c-b-t-lr-300 "
            bg="linear-gradient(90deg,#ff8a2b 0%,#ff3116 100%)"
            :pad="[28,80,24]"
            :fillet="80"
            :font-size="34"
            @click="beginBuy">立即购买
          </dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>

    </dd-layout-div>


    <van-popup v-model="show" position="bottom" style="overflow: initial;background: #f4f4f4;">
      <CellList :is-last="true" :not-center="true" style-class="padding:0.35rem 0.3rem;" class="mar-b-20">

        <dd-layout-div slot="icon" :mar="[-90,30,0,0]">
          <dd-layout-img :width="1.9" :height="1.9" :fillet="0.08"
                         :src="getSingleImg(giftDetails.showImgs&&giftDetails.showImgs[0].url)"/>
        </dd-layout-div>


        <!--<div slot="icon" class="qg-img">-->
        <!--<img-wrapper :src="getSingleImg(giftDetails.showImgs&&giftDetails.showImgs[0].url)"></img-wrapper>-->
        <!--</div>-->
        <template slot="content">
          <div class="flex-x-bt">
            <div class="flex-y-center">
              <span class="fon-40 col-price">￥{{(+giftDetails.rushPrice).toFixed(2)}}</span><span
              class="mar-l-10 col-9 t-d-l">￥{{(+giftDetails.originalPrice).toFixed(2)}}</span>
              <div v-if="+giftDetails.memberPrice>0&&platform.openVip" class="box-btn-sha">
                会员价{{+(giftDetails.memberPrice || 0)}}
              </div>
            </div>
            <!--<div class="col-9"><span class="iconfont icon-huo col-r mar-r-10"></span>1188</div>-->
          </div>
          <div class="mar-t col-3 t-o1">{{giftDetails.title}}</div>
        </template>
      </CellList>
      <div class="bg-f pad-b">
        <dd-address-rendering
          v-if="params.delivery==1"
          class="bg-f"
          @change="getAddressInfo"></dd-address-rendering>
        <van-cell
          v-else-if="params.delivery==2"
          @click="openSelfMention = !openSelfMention"
          :title="selfMention.detailedAddress||'请选择'" size="large"
          :label="selfMention.address||'自提地点详细地址'" is-link
          :value="selfMention.linkTel"
        />
        <div class="">
          <CellList style-class="padding:0.35rem 0.3rem" :after-right="true">
            <div slot="title" class="flex-g-0 fon-lg col-3">购买数量</div>
            <template slot="footer">
              <van-stepper @change="changeNum" v-model="params.num" :max="giftDetails.limitNum"/>
            </template>
          </CellList>
          <van-field
            style="padding:0.35rem 0.3rem"
            v-model="params.note"
            label="备注信息"
            type="textarea"
            placeholder="请输入备注信息"
            rows="1"
            size="100"
            autosize
          />
          <!--<CellList style-class="padding:0.35rem 0.3rem" :after-right="true" title="快递费用" extra="0.01元" extra-class="col-6">-->
          <!--</CellList>-->
          <CellList style-class="padding:0.35rem 0.3rem" :after-right="true">
            <template slot="footer">
              <span class="col-price fon-lg">共{{params.num}}份 合计{{totalMoney}}元</span>
            </template>
          </CellList>
          <CellList style-class="padding:0.35rem 0.3rem"
                    :title="`注：购买后，请在${formatDateByTimeStamp(giftDetails.expireTime,'YYYY-MM-DD HH:mm')}前找商家消费`">
          </CellList>
        </div>
        <dd-button
          class="mar-lr br-r-c"
          type="release"
          name="立即抢购"
          @click="rushBuy"
        />
      </div>
    </van-popup>
    <!--&lt;!&ndash;弹出框&ndash;&gt;-->
    <!--<van-dialog-->
    <!--style="width: 70%"-->
    <!--:title="giftDetails.title"-->
    <!--v-model="dialogShow"-->
    <!--&gt;-->
    <!--<div class="pad-30 flex-col-center">-->
    <!--<div id="qrcode" ref="qrcode"></div>-->
    <!--&lt;!&ndash;<div class="pad-t">仅限{{formatDateByTimeStamp(giftDetails.endTime,"YYYY-MM-DD")}}前使用</div>&ndash;&gt;-->
    <!--<div class="pad-t">仅限特权日使用</div>-->
    <!--</div>-->
    <!--</van-dialog>-->
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
  import {mapActions, mapState, mapGetters} from 'vuex'
  import Banner from '../../../components/home/banner';
  import LayoutOne from "../../../components/template/dd-article/layout-one";
  import CellList from "../../../components/template/dd-store/cell-list";
  import FaceMap from '@/components/template/other/face-map';
  import Chunk from '@/components/template/dd-store/chunk';
  import DdMusic from "@/components/template/other/music"
  import DetailsFooter from '../../../components/template/dd-store/details-footer';
  import DdAddressRendering from '../../../components/template/dd-addres-rendering';
  import {utilMixins, computedDate} from "@/plugins/util-mixins";
  import {PlaceholderAvatar, PlaceholderImg, backendPath} from "@/project-config/base";
  import renzheng from '../../../assets/img/attest/renzheng.png'
  import html2canvas from 'html2canvas'
  import DdButton from "@/components/template/button"

  import DdPosterGoods from '../../../components/template/dd-poster/goods'

  import {
    compareStartEnd,
    countDownTime,
    hideLoading, picLinkToBase64,
    showDialog,
    showHandleStatusByFlag,
    showLoading,
    showText
  } from "../../../util";
  import {updateShareConfig, openLocation} from "../../../util/wechat-util";
  import {changeWeek} from "../../../plugins/auxiliary/auxiliary-config";
  import {redirectPath} from "../../../project-config/base";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdLayoutHtml from "../../../components/layout/dd-layout-html";

  export default {
    components: {
      DdLayoutHtml,
      DdPosterGoods,
      DdLayoutImg, Banner, DdButton, LayoutOne, CellList, FaceMap, Chunk, DdMusic, DetailsFooter, DdAddressRendering
    },
    data() {
      return {
        renzheng,
        showMask: false,
        baseUrl: '',
        PlaceholderAvatar,
        giftDetails: {},
        storeInfo: {},
        footerConfig: {
          menu: [
            {
              icon: 'icon-shouyexian',
              name: '首页',
            }, {
              icon: 'icon-shangjia',
              name: '店铺',
            }, {
              icon: 'icon-ren111',
              name: '我的',
            }
          ],
          main: [
            {name: '立即购买', childrenName: '', style: 'background:var(--mainColor);'},
          ]
        },
        faceMap: {
          faces: [],
          size: 28,
          max: 10
        },
        layoutBody: {
          hd: 1,
          bd: 1,
          ft: 1,
          img: {
            center: 1,
            wid: 1.5,
            hei: 1.5,
          },
        },
        dialogShow: false,
        show: false,
        timeArr: ['00', '00', '00', '00'],
        params: {
          goodsId: null,  //商品Id
          selfId: '',  //核销地址
          receivedName: null,  //收货人
          receivedAddress: null,  //收货地址
          receivedTel: null,  //收货电话
          totalMoney: null,  //订单金额
          goodsMoney: null,  //商品金额
          delivery: 1,  //1快递,2到店核销
          note: '',  //备注
          num: 1,  //购买数量
        },
        //自提点
        openSelfMention: false,
        selfMentionList: [],
        selfMention: {},
      }
    },
    methods: {
      ...mapActions('rushBuy', ['getRushConfig', 'getRushGoodsList', 'getRushGoodsInfo', 'RushSaveOrder']),
      ...mapActions("storeAuxiliary/releaseGood", ["getDeliverSet"]),
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
      openMap() {
        openLocation({
          lat: this.giftDetails.lat,
          lng: this.giftDetails.lng,
          name: this.giftDetails.storeName,
          address: this.giftDetails.address
        })
      },
      async load(id) {
        showLoading();
        const res = await this.getRushGoodsInfo({id,});
        this.findInfo(res.data)
        if (res.code == 1) {
          res.data.showImgs.forEach(v => (v.notHost = true));
          this.giftDetails = res.data
          //倒计时
          let EndTime = parseInt(res.data.endTime), NowTime = parseInt(new Date().getTime() / 1000);
          this.timeArr = countDownTime(EndTime - NowTime)
          this.dsq = setInterval(() => {
            NowTime += 1
            if (EndTime - NowTime <= 0) {
              clearInterval(this.dsq)
            }
            this.timeArr = countDownTime(EndTime - NowTime)
            // console.log('倒计时',this.timeArr,EndTime-NowTime)
          }, 1000)
          //设置数据
          this.faceMap.faces = res.data.receive.map(item => {
            return item.portrait
          })
          this.params.goodsId = res.data.id
          this.params.delivery = res.data.delivery
          this.params.goodsMoney = this.platform.openVip && this.user.isVip && +res.data.memberPrice > 0 ? res.data.memberPrice : res.data.rushPrice
          //获取自提点
          this.getDeliverSet({
            storeId: res.data.storeId
          }).then(result => {
            this.selfMentionList = result;
            console.log("getDeliverSet", result);
          })
          //this.$set(this.footerConfig.main, 'name', res.data.state==1?'立即使用':'立即领取');
          // 配置转发信息
          updateShareConfig({
            title: this.giftDetails.title,
            imgUrl: this.getSingleImg(this.giftDetails.showImgs[0].url),
            desc: '来' + this.giftDetails.storeName + '领取' + this.giftDetails.title,
            link: window.location.href,
          })
        } else {
          showText('数据获取失败')
          return
        }
        hideLoading();
      },
      choiceFace(index) {
        this.goPointPage({path: '/auxiliary/vip/receiveList', query: {id: this.giftDetails.id, type: 'rushBuy'}})
        console.log('choiceFace', index);
      },
      async beginBuy() {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return;
        if (this.isOver) {
          return showDialog('此抢购已结束')
        }
        this.show = true
      },
      footerHandle(e) {
        console.log(e);
        switch (e.key) {
          case 0:
            return this.goPointPage({path: '/auxiliary/rushBuy'})
          case 1:   //店铺
            return this.goPointPage({path: '/shopDetail', query: {storeId: this.giftDetails.storeId}});
          case 2:   //我的
            return this.goPointPage({path: '/auxiliary/rushBuy/myReceive'});
          case 3:   //购买
            if (this.isOver) return showDialog('此抢购已结束')
            this.show = true
            break;
        }
      },
      /** 选取自提点 */
      choiceSelfMention(item) {
        this.selfMention = item;
        this.params.selfId = item.id;
        this.openSelfMention = !this.openSelfMention;
        this.params.receivedTel = this.user.userTel
        this.params.receivedName = this.user.userName
      },
      getAddressInfo(e) {
        console.log("getAddressInfo", e);
        this.params.receivedName = e.linkName;
        this.params.receivedAddress = e.address + e.detailedAddress;
        this.params.receivedTel = e.linkTel;
        console.log(this.params)
      },
      changeNum(e) {
        console.log(e)
      },
      // 立即抢购
      async rushBuy() {

        this.params.totalMoney = this.totalMoney;

        if (this.params.delivery == 2 && !this.params.selfId) return showText('请选择自提点')
        if (this.params.delivery == 1 && !this.params.receivedTel) return showText('请添加收货地址')
        const needPay = this.params.totalMoney > 0
        if (needPay) {
          try {
            await showDialog("需要支付" + this.params.totalMoney + "元");
          } catch (e) {
            console.log('老板，我是要赚钱的啊~')
            return false;
          }
        }
        // console.log(this.params)
        // return
        showLoading("下单中...")
        const res = await this.RushSaveOrder(this.params);
        if (res.code) {
          showHandleStatusByFlag([true, '提交成功'])
          if (needPay) {
            this.$router.push({
              name: 'cashier',
              params: {
                type: 38,
                param: {
                  orderId: res.data
                },
                info: {
                  money: this.params.totalMoney,
                  type: "抢购支付",
                  callLink: '/auxiliary/rushBuy/myReceive',
                }
              }
            });
          } else {
            setTimeout(() => {
              this.goPointPage('/auxiliary/rushBuy/myReceive')
            }, 1000)
          }
        } else {
          showText(res.msg, 2000, true);
        }
      }
    },
    computed: {
      isOver() {
        return +this.giftDetails.num <= 0 || compareStartEnd(this.giftDetails.endTime, this.getDayTimeStamp(0))
      },
      totalMoney() {
        let goodsMoney = Number(this.params.goodsMoney), num = Number(this.params.num);
        return (goodsMoney * num).toFixed(2)
      },
      getInfo() {

        const data = this.giftDetails;

        this.storeInfo = {
          logo: this.getSingleImg(data.storeLogo),
          name: data.storeName
        }


        return {
          ...data,
          rushPrice: (+data.rushPrice || 0).toFixed(2),
          originalPrice: (+data.originalPrice || 0).toFixed(2),
          memberPrice: (+data.memberPrice || 0).toFixed(2),
          pictures: data.detailImgs ? data.detailImgs.map(item => {
            return this.getSingleImg(item.url)
          }) : []
        }
      }
    },
    mixins: [utilMixins],
    created() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id;
        this.load(this.id);
        console.log(this.id)
      } else {
        showHandleStatusByFlag([false, '缺少参数'])
        setTimeout(() => {
          this.$router.go(-1);
        }, 1000)
      }
      //console.log(this.getDayTimeStamp(0,true),this.getDayTimeStamp(0),this.getTimeStamp(new Date()))
    },
    destroyed() {
      clearInterval(this.dsq)
      console.log('离开页面')
    }
  }
</script>
