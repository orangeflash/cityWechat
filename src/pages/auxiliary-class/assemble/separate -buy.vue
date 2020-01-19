<template>
  <!--购买-->
  <div>
    <Header/>
    <div class="dh flex-y-center pad-lr col-f52c2c bg-f br-b-d" v-if="params.delivery==2">购买后，请到店使用</div>
    <!--<Radio-->
    <!--v-bind="radioConfig"-->
    <!--@change="choiceRadio"-->
    <!--&gt;</Radio>-->
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
    <dd-store-order class="mar-30 bg-f br-r-20"
                    :order="goodsInfo"

    >
      <div slot="title" class="order-title-r2">{{goodsInfo.name}}</div>
      <div slot="desc" class="flex mar-t mar-b">
        <span class="col-9 mar-r" v-for="(item,key) in goodsInfo.labels" :key="key" v-if="key<3">{{item}}</span>
      </div>
      <div slot="down" class="flex-y-center flex-bt">
        <div>
          <span class="col-price fon-lg mar-r">￥{{goodsInfo.money}}</span>
          <span class="col-9 t-d-l">￥{{goodsInfo.oldPrice}}</span>
        </div>
        <span class="col-9">已拼1件</span>
      </div>
    </dd-store-order>
    <div class="dh flex-bt bg-f flex-y-center pad-l pad-r">
      <div class="fon-b">购买数量</div>
      <van-stepper v-model="params.num" :max="goodsInfo.limitNum" :min="1"/>
    </div>
    <dd-form-chunk
      title="备注"
    >
      <dd-form-textarea slot="content" v-model="params.note" placeholder="（选填）填写内容已和卖家协商确认"/>
    </dd-form-chunk>
    <div class="dh-100"></div>
    <div class="dh-100"></div>
    <div class="dh-100"></div>
    <div class="bg-f posi-f w100 dh-100 b0 l0 flex-bt br-t-e">
      <div class="flex-g-1 pad-l pad-r fon-sm flex-y-center">实付 <em class="col-price fon-xll">￥{{getTotalMoney}}</em><span
        class="col-f52c2c fon-sm mar-l"> {{freightTips}}</span>
      </div>
      <div class="bg-f52c2c col-f flex-center fon-xll pad-r-60 pad-l-60" @click="beginBuy">立即支付</div>
    </div>
  </div>
</template>

<script>
  import DdStoreOrder from '@/components/template/dd-store/order-two'
  import DdAddressRendering from '@/components/template/dd-addres-rendering';
  import DdFormChunk from "@/components/template/dd-form/chunk"
  import DdFormTextarea from "@/components/template/dd-form/textarea"
  import Radio from "@/components/template/radio"

  import {Toast} from 'vant'
  import {mapActions, mapState} from 'vuex'
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {DdAddressRendering, DdFormChunk, DdFormTextarea, DdStoreOrder, Radio},
    data() {
      return {
        goodsInfo: {
          cover: {},
        },
        radioConfig: {
          value: 0,
          label: '配送方式',
          radios: [
            "快递配送",
            "到店核销",
          ]
        },
        openSelfMention: false,
        selfMentionList: [],
        selfMention: {},
        freightTips: '',
        params: {
          type: null,  //1单独够，2拼团
          goodsId: null,  //商品Id
          groupId: '',  //团Id（参与拼团时传）
          receivedName: '',  //收货人
          receivedAddress: '',  //收货地址
          receivedTel: '',  //收货电话
          totalMoney: 0,  //订单金额
          freight: 0,  //运费
          goodsMoney: 0,  //商品金额
          delivery: 1,  //1快递,2到店核销
          note: '',  //备注
          num: 1,  //购买数量
          selfId: null,  //核销地址
        }
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeAssemble", ["getAssembleGoodsInfo", 'assembleDownOrder']),
      ...mapActions("storeAuxiliary/releaseGood", ["getDeliverSet"]),
      /** 选取自提点 */
      choiceSelfMention(item) {
        this.selfMention = item;
        this.params.selfId = item.id;
        this.openSelfMention = !this.openSelfMention;

      },
      getAddressInfo(e) {
        console.log("getAddressInfo", e);
        this.params.receivedName = e.linkName;
        this.params.receivedAddress = e.address + e.detailedAddress;
        this.params.receivedTel = e.linkTel;
        console.log(this.params)
      },
      choiceRadio(e) {
        console.log(e);
        this.params.delivery = e + 1;
        !e && (this.params.selfId = null)
      },
      // 立即购买
      async beginBuy() {

        //this.params.totalMoney = this.goodsInfo.money * this.params.num + this.goodsInfo.freight;

        if (this.params.delivery == 2 && !this.params.selfId) return Toast.fail({
          message: '请选择自提点',
          duration: 1500
        })
        if (this.params.delivery == 1 && !this.params.receivedTel) return Toast.fail({
          message: '请添加收货地址',
          duration: 1500
        })
        if (this.params.delivery == 2) {
          this.params.receivedName = this.user.userName;
          this.params.receivedTel = this.user.userTel
          this.params.receivedAddress = ''
        }

        const needPay = this.params.totalMoney > 0
        if (needPay) {
          try {
            await showDialog("需要支付" + (+this.params.totalMoney).toFixed(2) + "元");
          } catch (e) {
            console.log('老板，我是要赚钱的啊~')
            return false;
          }
        }
        showLoading("下单中...")
        const res = await this.assembleDownOrder(this.params);
        hideLoading();
        if (res.data && !isNaN(res.data)) {
          if (needPay) {
            this.$router.push({
              name: 'cashier',
              params: {
                type: 37,
                param: {
                  orderId: res.data
                },
                info: {
                  money: this.params.totalMoney,
                  type: "拼团支付",
                  callLink: '/auxiliary/assemble/myOrder',
                }
              }
            });
          } else {
            this.goPointPage('/auxiliary/assemble/myOrder')
          }
        } else {
          showHandleStatusByFlag(res.code, res.msg, res.msg,)
        }


        console.log(this.params)
      }
    },
    computed: {
      ...mapState({
        platform: s => s.platform
      }),
      getTotalMoney() {
        let money = this.goodsInfo.money * this.params.num,
          freight = this.goodsInfo.isPost == 1 || money >= this.goodsInfo.satisfy ? 0 : this.goodsInfo.freight;
        money += freight;
        this.freightTips = freight <= 0 ? '包邮' : '运费 ￥' + ((this.goodsInfo.freight || 0).toFixed(2));
        this.params.freight = freight;
        this.params.totalMoney = money.toFixed(2);
        return this.params.totalMoney
      }
    },
    created() {
      const query = this.$route.query;
      this.isFailParams({
        field: [query.assembleId, query.type],
        tips: ['缺少拼团id', '缺少购买类型']
      }, async () => {
        showLoading();
        const result = await this.getAssembleGoodsInfo({
          goodsId: query.assembleId
        });
        this.params.delivery = +result.delivery;
        this.params.goodsId = query.assembleId;
        this.params.groupId = query.groupId || '';
        this.params.type = query.type;

        result.showImgs.forEach(v => v.notHost = true);
        result.labels = (() => {
          let arr = []
          for (let key in result.label) arr.push(result.label[key]);
          return arr
        })();
        this.goodsInfo = {
          cover: {
            src: result.showImgs[0] && this.getSingleImg(result.showImgs[0].url),
            borderRadius: 0.08,
            width: 1.94,
            height: 1.94,
          },
          limitNum: result.limitNum,
          money: this.params.type == 1 ? result.alonePrice
            : this.params.type == 2 && this.platform.openVip && this.user.isVip && +result.memberPrice > 0 ? +result.memberPrice : result.groupPrice,
          oldPrice: result.originalPrice,
          name: result.title,
          orderNum: `<i class="iconfont icon-tubiaolunkuo- col-3"></i>
                      <em class="col-3 mar-l mar-r-10">${result.storeName}</em>
                     <i class="iconfont icon-youjiantou1 fon-xs"></i>`,
          labels: result.labels,
          freight: +result.freight,
          isPost: +result.isPost,
          satisfy: +result.satisfy
        }
        this.params.goodsMoney = this.goodsInfo.money;
        hideLoading();
        this.getDeliverSet({
          storeId: result.storeId
        }).then(result => {
          console.log("getDeliverSet", result);
          this.selfMentionList = result;
        })
      })
    }
  }

</script>
