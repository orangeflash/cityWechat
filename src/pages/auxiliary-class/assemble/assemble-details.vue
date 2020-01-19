<template>
  <!--拼团详情-->
  <div class="assemble-details">
    <Header/>

    <div>
      <div class="pad-30 bg-t flex-bt"
           v-if="$route.query.orderId && goodsInfo.delivery == 2 && !$route.query.isShare && goodsInfo.stateTips.code !=6">
        <div class="">
          <p class="fon-xl col-f mar-b">{{goodsInfo.stateTips.tips}}</p>
          <p class="fon-xl col-f">{{goodsInfo.stateTips.tips2}}</p>
        </div>
        <div class="pad-lr flex-y-center">
          <i class="iconfont icon-shalou fon-68 col-v"></i>
        </div>
      </div>
      <div class="dh bg-f flex-y-center col-t fon-b pad-lr br-b-e"
           v-if="goodsInfo.delivery == 2 && goodsInfo.stateTips.code !=6">
        拼团成功后，请到店使用，有效期至{{goodsInfo.endTime}}
      </div>
      <dd-address-rendering
        v-if="goodsInfo.delivery == 1"
        :info="addressInfo"
        class="bg-f"></dd-address-rendering>
      <van-cell
        v-else-if="goodsInfo.delivery == 2"
        :title="selfTaking.detailedAddress"
        size="large"
        :label="selfTaking.address"
        :value="selfTaking.linkTel"
      />
    </div>

    <dd-store-order
      class="mar-30 bg-f br-r-20"
      @left="goPointPage('/shopDetail?storeId='+goodsInfo.storeId)"
      :order="goodsInfo"

    >
      <div slot="title" class="order-title-r2">{{goodsInfo.name}}</div>
      <div slot="desc" class="flex mar-t mar-b">
        <span class="col-9 mar-r" v-for="(name,key) in goodsInfo.labels" :key="key" v-if="key<3">{{name}}</span>
      </div>
      <div slot="down" class="flex-y-center flex-bt">
        <div>
          <span class="col-t fon-lg mar-r">￥{{(+goodsInfo.money || 0).toFixed(2)}}</span>
          <span class="col-9 t-d-l">￥{{(+goodsInfo.oldPrice || 0).toFixed(2)}}</span>
        </div>
        <span class="col-9">已拼{{goodsInfo.quantity}}件</span>
      </div>
    </dd-store-order>
    <div class="bg-f flex-y-center dh mar-t flex-bt pad-lr mar-b" v-if="!$route.query.iswriteOff">
      <span class="col-9 fon-b">实付款：<em class="col-t">￥{{(+goodsInfo.totalMoney || 0).toFixed(2)}}</em>（含运费）</span>
      <span class="bg-t pad-14-20-10 col-f br-r-10"
            v-if="goodsInfo.delivery == 2 && (goodsInfo.stateTips.code == 1||goodsInfo.stateTips.code == 2)"
            @click="operation">{{goodsInfo.stateTips.code == 1?'邀请好友拼团':'点击使用'}}</span>
      <span class="col-t" v-else-if="goodsInfo.delivery == 2 && goodsInfo.stateTips.code - 1 == 1" @click="operation">点击使用</span>
      <span class="col-t" v-else-if="!$route.query.iswriteOff">{{tipsMap[goodsInfo.stateTips.code - 1]}}</span>
    </div>

    <dd-button
      v-if="$route.query.iswriteOff"
      @click="writerOff"
      class="mar-b mar-lr"
      type="release"
      name="确认核销"
    ></dd-button>


    <div class="bg-f">
      <div v-if="+goodsInfo.groupId>0" class="br-b-d pad-30">
        <div class="flex-center flex-wrap">
          <div
            class="br-r-c mar-r posi-r mar-b"
            v-for="(face,key) in goodsInfo.faceMap"
            v-if="key < showFaceLen"
          >
            <span class="bg-t col-f  pad-8-10-4 t0 posi-a br-r-20 fon-xs l0" style="margin-left: -0.3rem"
                  v-if="!key">团长</span>
            <face
              :src="face"
              size="48"
              class=" bsd-t"
              borderRadius="36"
            ></face>
          </div>
          <div
            v-if="goodsInfo.num"
            class="br-r-c bsd-b mar-r mar-b flex-center"
            style="width: 0.96rem;height: 0.96rem">
            <i class="iconfont icon-wenhao col-9 fon-46 mar-t-10"></i>
          </div>
        </div>
        <div class="flex flex-bt flex-y-center"
             v-if="goodsInfo.faceMap.length > 10 && showFaceLen != goodsInfo.faceMap.length">
          <span class="col-9">共<em class="col-t">{{goodsInfo.faceMap.length}}</em>人</span>
          <span class="pad-14-20-10 col-t" @click="showFaceLen = goodsInfo.faceMap.length ">查看全部</span>
        </div>
        <div class="pad-t pad-b" v-if="goodsInfo.num && goodsInfo.stateTips.code == 1">
          <p class="fon-sm t-c">还差<em class="fon-b col-t">{{goodsInfo.num}}</em>人</p>
          <div class="posi-r flex-center dh">
            <div class="br-t-d posi-a w100"></div>
            <div class="bg-f posi-r pad-30 col-9 flex-y-center">剩余
              <div>
                <em class="pad-8-10-4 col-f bg-3 fon-b br-r-10 mar-l mar-r-10">{{expireTime[0]}}</em>：
                <em class="pad-8-10-4 col-f bg-3 fon-b br-r-10 mar-r-10">{{expireTime[1]}}</em>：
                <em class="pad-8-10-4 col-f bg-3 fon-b br-r-10 mar-r-10">{{expireTime[2]}}</em></div>
              结束
            </div>
          </div>
        </div>
        <dd-button
          v-if="goodsInfo.stateTips.code == 1"
          @click="joinGroup"
          type="release"
          :name="goodsInfo.isJoin?'点击邀请好友拼团':'我要参与拼团'"
        ></dd-button>
      </div>
      <chunk title="拼团规则">
        <div slot="content" class="flex-y-center pad-t-10 pad-b-20 pad-lr">
          <span class="col-9 mar-r"><em class="col-t mar-r-10">1</em>开团/参团<i class="iconfont icon-toright "></i></span>
          <span class="col-9 mar-r"><em class="col-t mar-r-10">2</em>邀请好友<i class="iconfont icon-toright"></i></span>
          <span class="col-9 mar-r"><em class="col-t mar-r-10">3</em>满员发货，不满可申请退款<i
            class="iconfont"></i></span>
        </div>
      </chunk>
    </div>
    <dd-store-data-list
      class="pad-r pad-l mar-t" v-if="goodsInfo.isJoin && !$route.query.isShare" v-bind="buyInfo"/>

    <mall-category
      v-if="$route.query.isShare || !goodsInfo.stateTips.success"
      method-name="getAssembleList"
      :method-category="{name:'getGoodsCategory',params:{ term: 15}}"
    />

    <!--弹窗-->
    <Popup v-if="isShow" :QRLink="QRLink"
           @close="isShow = false"
           title="出示此二维码给店员"
           :desc="getEndTime()"
    >

    </Popup>
    <share-mask :show-mask.sync="showMask"/>
  </div>


</template>

<script>
  import DdStoreDataList from "@/components/template/dd-store/data-list";
  import DdStoreOrder from '@/components/template/dd-store/order-two'
  import Face from '@/components/template/face'
  import DdButton from "@/components/template/button"
  import Chunk from '@/components/template/dd-store/chunk';
  import MallCategory from '@/components/template/dd-store/mall-category';
  import DdTabs from '@/components/template/dd-tabs';
  import GoodsCard from '@/components/template/goods-card';
  import DdAddressRendering from '@/components/template/dd-addres-rendering';
  import Popup from '@/components/popup'       // 弹窗
  import ShareMask from "@/components/publication/share-mask";
  import {mapActions} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading, timeStampToHMS} from "../../../util";
  import {updateShareConfig} from "../../../util/wechat-util";

  export default {
    mixins: [utilMixins],
    components: {
      DdStoreOrder,
      Face,
      DdButton,
      Chunk,
      DdTabs,
      GoodsCard,
      DdAddressRendering,
      Popup,
      ShareMask,
      MallCategory,
      DdStoreDataList
    },
    data() {
      return {
        showFaceLen: 10,
        showMask: false,
        isShow: false,
        isRequest: true,
        hasMore: true,
        active: 0,
        btnName: '我要参与拼团',
        buyInfo: {
          height: 88,
          form: []
        },
        tabs: [
          {name: '推荐'},
          {name: '手机'},
          {name: '家具'},
          {name: '男装'},
          {name: '服装'},
          {name: '女装'},
          {name: '母婴'},
          {name: '鞋包'},
        ],
        goodsList: [],
        selfTaking: {},
        expireTime: ["00", "00", "00"],
        addressInfo: {
          linkName: ' ',
          linkTel: ' ',
          address: ' ',
          detailedAddress: ' ',
        },
        QRLink: '',
        goodsInfo: {
          isJoin: true,
          stateTips: {},
          cover: {},
          faceMap: [],
        },
        tipsMap: ["拼团中", "待收货", "已发货", "已完成", "拼团失败", "申请退款中", "退款成功", "拒绝退款", "已过期"],
        captainInfo: {},//队长的信息
        params: {
          type: 2,    //团购
        },
        interval: null,
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeAssemble", ["getGroupAssembleInfo", "assembleDownOrder", "getAssembleOrderInfo", "writerOffAssembleOrder"]),
      ...mapActions("storeAuxiliary/releaseGood", ["getAddressInfo"]),
      getEndTime() {
        return `<span class="col-t">核销到期：${this.goodsInfo.endTime}</span><p class="col-9 mar-t-20">到店出示此二维码给店员核销</p>`
      },
      tabsChange(e) {
        console.log(e);
      },
      async joinGroup(e) {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        if (this.goodsInfo.isJoin) {
          this.showMask = true;
        } else {
          this.goPointPage('/auxiliary/assemble/separateBuy?type=2&assembleId=' + this.goodsInfo.id + "&groupId=" + this.goodsInfo.groupId)
        }
      },
      operation() {
        if (this.goodsInfo.delivery == 2 && this.goodsInfo.stateTips.code - 1 == 1) {
          this.isShow = true;
        } else {
          this.joinGroup();
        }
      },
      async writerOff() {
        try {
          await showDialog("确认要核销该订单？");
          showLoading("正在核销中...")
          const res = await this.writerOffAssembleOrder({
            orderId: this.$route.query.orderId
          });
          hideLoading();
          showHandleStatusByFlag(res.code, "核销成功", res.msg);
          res.code && setTimeout(() => {
            this.goPointPage("/auxiliary/assemble")
          })
        } catch (e) {
          console.log(e);
        }
      }
    },
    created() {
      const query = this.$route.query;
      this.isFailParams({
        field: [query.groupId],
        tips: ['缺少拼团Id'],
      }, async () => {
        const result = query.orderId ? await this.getAssembleOrderInfo(query) : await this.getGroupAssembleInfo(query)
        this.QRLink = window.location.href.split("?")[0] + "?groupId=" + query.groupId + '&iswriteOff=true&orderId=' + query.orderId;
        this.addressInfo = {
          linkName: result.receivedName,
          linkTel: result.receivedTel,
          address: ' ',
          detailedAddress: result.receivedAddress,
        }
        if (+result.delivery == 2 && result.selfId) {
          this.getAddressInfo({addressId: result.selfId}).then(result => {
            this.selfTaking = result;
          })
        }
        const now = new Date().getTime();
        this.goodsInfo = {
          music: result.music,
          video: result.video,
          id: result.goodsId,
          groupId: result.groupId,
          cover: {
            src: result.showImgs[0] && this.getSingleImg(result.showImgs[0].url),
            borderRadius: 0.08,
            width: 1.94,
            height: 1.94,
          },
          money: result.groupPrice || result.goodsMoney,
          oldPrice: result.originalPrice,
          storeId: result.storeId,
          isJoin: result.isJoin,
          name: result.title,
          quantity: result.orderNum,
          orderNum: `<i class="iconfont icon-tubiaolunkuo- col-3"></i>
                      <em class="col-3 mar-l mar-r-10">${result.storeName}</em>
                     <i class="iconfont icon-youjiantou1 fon-xs"></i>`,
          freight: +result.freight,
          num: result.groupNum - result.buyNum,
          faceMap: result.groupList ? result.groupList.map(item => item.portrait) : [],
          labels: (() => {
            let arr = []
            for (let key in result.label) arr.push(result.label[key]);
            return arr
          })(),
          buyNum: result.buyNum,
          expireTime: result.expireTime ? result.expireTime * 1000 : now,
          endTime: format(result.endTime * 1000),
          delivery: +result.delivery,
          totalMoney: (result.groupPrice && result.groupPrice * result.orderNum) || result.totalMoney || "0.00",
          stateTips: {
            tips: +result.state == 1 ? '拼团还未成功' : [2, 3, 4].indexOf(+result.state) >= 0 ? '拼团成功' : '',
            tips2: +result.state == 1 ? '邀请小伙伴来拼团吧' : [2, 3, 4].indexOf(+result.state) >= 0 ? '核销码：' + result.code : '',
            success: [2, 3, 4, 6].indexOf(+result.state) >= 0,
            code: +result.state
          },
          details: result.details,
          outTradeNo: result.outTradeNo
        };


        this.buyInfo.form = [
          {
            label: '购买用户',
            className: 'br-b-d fon-b',
            html: `<div class="flex-y-center">
                      <img
                        class="br-r-c mar-r"
                        style="width: 0.48rem;height: 0.48rem;"
                        src="${result.portrait}"/>
                      ${result.userName}
                   </div>`
          }, {
            label: '手机号',
            className: 'br-b-d fon-b',
            html: result.userTel
          }, {
            label: '订单编号',
            className: 'br-b-d fon-b',
            html: result.outTradeNo
          }, {
            label: '下单时间',
            className: 'fon-b',
            html: format(result.createdAt * 1000)

          }
        ]


        let S = 1000;
        let timeStamp = this.goodsInfo.expireTime - now;
        this.interval = setInterval(() => {
          if (timeStamp <= 0) clearInterval(this.interval)
          this.expireTime = timeStampToHMS(timeStamp).split(":");
          timeStamp -= S;
        }, S)

        updateShareConfig({
          title: "拼团 " + this.goodsInfo.name,
          imgUrl: this.goodsInfo.cover.src,
          desc: this.goodsInfo.details,
          link: window.location.href.split("?")[0] + "?groupId=" + query.groupId
        });

      })
    },
    destroyed() {
      clearInterval(this.interval);
    }
  }

</script>
