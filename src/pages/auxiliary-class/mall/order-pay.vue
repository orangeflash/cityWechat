<template>
  <!--商城订单支付-->
  <div id="order-pay">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <div class="order-address-info">
      <div class="choice-delivery"
           v-if="storeInfo.deliverMode"
      >
        <span>请选择配送方式：</span>
        <div class="choice-input-box">
          <span
            v-if="+storeInfo.deliverMode == 3 || +storeInfo.deliverMode == 1"
            @click="params.delivery = 1">
            <i class="iconfont "
               :class="params.delivery==1?'active icon-fuxuankuang':'icon-fangxing'"></i>快递发货</span>
          <span
            v-if="+storeInfo.deliverMode == 3 || +storeInfo.deliverMode == 2"
            @click="params.delivery = 2">
          <i class="iconfont "
             :class="params.delivery==2?'active icon-fuxuankuang':'icon-fangxing'"></i>门店自取</span>
        </div>
      </div>
      <dd-address-rendering
        v-if="params.delivery==1"
        @change="getAddressInfo"></dd-address-rendering>
      <van-cell
        v-else-if="params.delivery==2"
        @click="openSelfMention = !openSelfMention"
        :title="selfMention.detailedAddress||'请选择'" size="large"
        :label="selfMention.address||'自提地点详细地址'" is-link
        :value="selfMention.linkTel"
      />
    </div>

    <div class="goods-list">
      <dd-shopping-car
        v-for="(store,key) in orderState"
        :store="store"
        :coupons="coupons"
        :key="key"
        :hideSettlement="true"
        @change="getTotalInfo"
        @delete="delGoods"
        @choiceCoupon="choiceCoupon(key)"
      ></dd-shopping-car>
    </div>


    <!--<div-->
    <!--v-for="(order,key) in orderList"-->
    <!--:key="key"-->
    <!--&gt;-->
    <!--<div class="goods-info">-->
    <!--<div class="goods">-->
    <!--<div class="goods-store">-->
    <!--<i class="iconfont icon-tubiaolunkuo- icon"></i>-->
    <!--<span>{{order.storeName}}</span>-->
    <!--<i class="iconfont icon-youjiantou1 right"></i>-->
    <!--</div>-->
    <!--<dd-frame-->
    <!--:src="order.img"-->
    <!--:size="97">-->
    <!--<template slot="info">-->
    <!--<div class="goods-title">{{order.name}}</div>-->
    <!--<div class="goods_info">-->
    <!--<span v-if="order.specGroup.data">{{order.specGroup.data}}</span>-->
    <!--</div>-->
    <!--<div class="goods-attr">-->
    <!--<span class="price">￥{{order.money}}</span>-->
    <!--<span class="num">X1</span>-->
    <!--</div>-->
    <!--</template>-->
    <!--</dd-frame>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="goods-other">-->
    <!--<div class="goods-other_row">-->
    <!--<div class="label">购买数量</div>-->
    <!--<van-stepper v-model="order.num"/>-->
    <!--</div>-->
    <!--<div class="goods-other_row tips">-->
    <!--<dd></dd>-->
    <!--<div class="label">优惠券： 已使用优惠券</div>-->
    <!--<span>-10.00</span>-->
    <!--</div>-->
    <!--<div class="goods-other_row">-->
    <!--<div></div>-->
    <!--<div>共{{order.num}}件商品，合计：<em>￥{{order.money * order.num}}</em></div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <div class="order-pay_block">
      <h3>备注：</h3>
      <div>
        <textarea
          v-model="params.note"
          placeholder="（选填）填写内容已和卖家协商确认"></textarea>
      </div>
    </div>
    <van-popup

      v-model="openSelfMention"
      :position="selfMentionList.length > 0 ?'bottom':'center'"
      style="background: transparent"
    >

      <div v-if="selfMentionList.length > 0">
        <div class="goods-coupon_title" style="background: #fff">选取自提点</div>
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

    <van-popup
      v-model="openCoupon"
      position="bottom"
      style="background: transparent"
    >
      <div class="goods-coupon">
        <div class="goods-coupon_title">优惠劵</div>
        <div class="goods-coupon_list">
          <mall-coupon
            :dataList="coupons"
            @click="conpon"
            pageType="choice"
          ></mall-coupon>
        </div>
        <dd-button
          class="confirm"
          type="confirm"
          name="取 消"
          @click="openCoupon = !openCoupon"
        ></dd-button>
      </div>
    </van-popup>
    <dd-pay-footer
      :price="getTotalPrice"
      :number="params.num"
      :freight="params.freight"
      @click="goPay"
    ></dd-pay-footer>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import DdFrame from '@/components/template/dd-frame';
  import DdPayFooter from '@/components/template/mall/dd-pay-footer';
  import DdAddressRendering from '@/components/template/dd-addres-rendering';
  import DdShoppingCar from '@/components/template/mall/dd-shopping-car';
  import MallCoupon from '@/components/template/mall/mall-coupon';
  import DdButton from '@/components/template/button';

  import {Toast} from 'vant'
  import {hideLoading, showDialog, showLoading} from "../../../util";
  import {utilMixins} from "@/plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {DdFrame, DdPayFooter, DdAddressRendering, DdShoppingCar, MallCoupon, DdButton},
    data() {
      return {
        openSelfMention: false,
        selfMentionList: [],     //自提店列表
        selfMention: {},   //已选择的自提点信息
        openCoupon: false,
        coupons: [],   //优惠卷列表
        radio: 1,
        value: 1,
        storeInfo: {
          deliverMode: 1
        },
        goods: {
          money: 0,
          deliveryMoney: 0
        },
        addressInfo: {},
        goodsInfo: {},     //商品信息
        couponInfo: {},    //优惠卡的id
        params: {
          num: 1,
          receivedName: null,    //收货人
          receivedAddress: null,    //收货人地址
          receivedTel: null,    //收货人电话
          totalMoney: 0,    //订单总金额
          freight: 0,    //运费
          goodsMoney: 0,    //商品总金额
          discountMoney: null,    //优惠总金额
          delivery: 1,    //配送方式1快递，2到店
          goods: [],      //商品信息二维数组（商品ID‘goodsId’，组合groupId，名称 name，金额money，数量 num，组合值data，图片img）
          couponId: null,
          selfId: null,      //自提点id
          note: ''     //备注
        },
        orderList: [],   //商品列表
      }
    },
    methods: {
      ...mapActions('mall', ['getMallGoodsInfo', 'mallDownOrder', 'setOrderList', 'mallDelShoppingCar', 'mallGetMyCoupons']),
      ...mapActions("shop", ["getShopInfoWithUserIdById"]),
      ...mapActions("storeAuxiliary/releaseGood", ["getDeliverSet"]),
      ...mapActions(["refreshUserInfo"]),
      /** 选取自提点 */
      choiceSelfMention(item) {
        this.selfMention = item;
        this.params.selfId = item.id;
        this.openSelfMention = !this.openSelfMention;
      },
      conpon(res) {
        this.openCoupon = !this.openCoupon;
        if (res.state == 'choice') {
          this.couponInfo = res.data;
          this.params.couponId = res.data.id;
          console.log(" this.params.couponId", res.data)
        }
      },
      // 选取优惠卷
      choiceCoupon(key) {
        this.openCoupon = !this.openCoupon;
      },
      /** 获取单个订单的总信息 */
      async delGoods(params = {}) {

        try {
          await showDialog("您确定要删除这件商品吗？");
          console.log("又少了一件商品买卖！T _ T");
          console.log(params.childrenId);
          showLoading();
          const res = await this.mallDelShoppingCar({
            childrenId: params.childrenId
          });
          if (res.code == 1) {
            this.orderState.forEach(store => {
              if (params.store == store) {
                store.goods.splice(params.key, 1)
              }
            })
            hideLoading();
          } else {
            Toast({
              message: res.msg,
              duration: 1500
            })
          }
        } catch (e) {
          console.log("原来是误操作啊！");
        }
      },
      getTotalInfo() {
        this.params.goodsMoney = 0;
        this.params.totalMoney = 0;
        this.params.freight = 0;
        this.params.num = 0;
        this.orderState.forEach(item => {
          item.goods.forEach(goods => {
            console.log(goods);
            this.params.goodsMoney = goods.money * goods.num;
            this.params.freight += +goods.freight;
            this.params.num += +goods.num;
            this.params.totalMoney = this.params.goodsMoney + this.params.freight;
          });
        })

      },
      getAddressInfo(info) {
        console.log('info', info)
        /** 收货信息 */
        this.params.receivedName = info.linkName;
        this.params.receivedAddress = info.address + "  " + info.detailedAddress;
        this.params.receivedTel = info.linkTel;
        /** 给每一个订单都进行添加上收货信息 */
        this.orderState.forEach(store => {
          store.receivedName = info.linkName;
          store.receivedAddress = info.address;
          store.receivedTel = info.linkTel;
        })
      },
      async goPay() {
        const res = this.judgeData();
        if (res.msg) return Toast.fail({
          message: res.msg,
          duration: 1500
        })

        this.params.goods = [];
        let goodsNumfail = false;
        this.orderState.forEach(store => {
          this.params.storeId = store.storeId;
          store.goods.forEach(goods => {
            if (+goods.num <= 0) {
              goodsNumfail = true;
            } else {
              this.params.goods.push({
                goodsId: goods.goodsId,
                name: goods.title,
                img: (goods.showImgs.length && this.getSingleImg(goods.showImgs[0].url)) || "无封面图",   //封面
                freight: +goods.freight,
                money: +goods.money || goods.currentPrice || 0,
                groupId: goods.groupId,
                num: +goods.num,
                storeId: store.storeId,
                data: goods.data,
                totalMoney: (+goods.money || goods.currentPrice || 0) * (+goods.num) + (+goods.freight),
                childrenId: goods.childrenId || null
              });
            }

          })
        });
        if (goodsNumfail) return Toast({
          message: '商品数量不能为零',
          duration: 1500
        })
        try {
          await showDialog("需要支付：" + this.params.totalMoney.toFixed(2) + "元");

          showLoading("下单中...");
          const result = await this.mallDownOrder(this.params);
          hideLoading();
          if (result.data && !isNaN(Number(result.data))) {

            this.$router.push({
              name: 'cashier',
              params: {
                type: 29,
                param: {
                  orderId: result.data
                },
                info: {
                  money: this.params.totalMoney,
                  type: "购买商品",
                  callLink: '/auxiliary/mall/order'
                }
              }
            });
          } else {
            Toast({
              message: result.msg,
              duration: 1500,
            })
          }
        } catch (e) {
          console.log('老板，卖点货不容易啊！')
        }
      },
      judgeData() {
        const params = this.params;
        let res = {};
        if (params.delivery == 1 && (!params.receivedAddress || !params.receivedName || !params.receivedTel)) res.msg = '请选择收货信息'
        else if (params.num <= 0) res.msg = '商品数量至少一件';
        else if (!params.delivery) res.msg = '请选择配送方式';
        else if (params.delivery == 2 && !this.params.selfId) res.msg = '请选择自提点地址';
        if (params.delivery == 1) this.params.selfId = null
        if (!res.msg) {
          res.status = 200;
        }
        return res;
      },
      getGoodsOrderInfo(orders) {
        // 批量查询商品信息
        if (orders) {
          orders.forEach((order) => {
            console.log(order);
            if (order.goods) {
              order.goods.forEach((goods) => {
                showLoading()
                this.getMallGoodsInfo({
                  goodsId: goods.id
                }).then(result => {
                  hideLoading();
                  console.log('getMallGoodsInfo', result);
                  const specGroup = _.find(result.specGroup, (spec) => {
                    return spec.id == goods.specId
                  }) || {};
                  this.orderList.push({
                    goodsId: goods.id,     //商品的id
                    name: result.title,     //标题
                    img: (result.showImgs.lenght && this.getSingleImg(result.showImgs[0].url)) || "",   //封面
                    freight: (+result.freight || 0).toFixed(2),    //运费
                    price: (+goods.price).toFixed(2),    //单价
                    storeName: result.storeName,   //商家名称
                    storeId: result.storeId,
                    num: +goods.num,        //数量
                    specGroup,
                    groupId: goods.specId,
                    data: specGroup.data,
                    money: +goods.price || result.currentPrice
                  })
                  console.log('this.orderList', this.orderList);
                })
              })
            }
          })
        }
      }
    }
    ,
    computed: {
      ...
        mapState('mall', {
          orderState: s => s.orderList
        }),
      ...mapState({
        userInfo: s => s.user
      }),
      getTotalPrice() {
        this.params.goodsMoney = 0;
        this.params.totalMoney = 0;
        this.params.freight = 0;
        this.params.num = 0;
        this.params.discountMoney = 0;
        this.orderState.forEach((store, index) => {
          store.goodsMoney = 0;
          store.freight = 0;
          store.num = 0;
          store.copyMoney = 0;  // 备份一下价格   没有任何优惠的
          store.goods.forEach((goods, key) => {
            store.goodsMoney += goods.money * goods.num;
            store.copyMoney += goods.money * goods.num;


            /**
             * 运费计算
             *
             * 判断该商品没有包邮并且，也没有满足包邮条件，运费就进行增加 */
            if (+goods.isPost != 1 && goods.money * goods.num < +goods.satisfy && +this.params.delivery == 1) {
              store.freight += +goods.freight;
              this.$set(this.orderState[index].goods[key], 'freightTips', null)
            } else {
              this.$set(this.orderState[index].goods[key], 'freightTips', '包邮');
            }
            store.num += +goods.num;
          });

          /**
           * 判断是否有优惠卷
           *
           * 优惠卷折扣计算
           *
           * 只优惠商品价格，不优惠快递
           *
           * 先判断优惠卷的商家是否匹配
           * */

            // 优惠的金额
          let couponPrice = 0;
          this.coupons.forEach((item, i) => {
            // 先将所有的优惠卷的状态进行更改
            if (item.reach <= store.goodsMoney) {       //满足条件可以使用
              this.$set(this.coupons[i], 'condition', 1);      //将状态改成可使用
            } else {
              this.$set(this.coupons[i], 'condition', null);      //将状态改成不满足条件
            }
            if (this.couponInfo.storeId == store.storeId) {     //是当前商家的优惠卷
              if (item.id == this.params.couponId && this.coupons[i].condition == 1) {            // 已选中的优惠卷
                this.$set(this.coupons[i], 'condition', 2);      //将状态改成已使用的状态
                // 在接着判断优惠类型
                if (+this.couponInfo.type == 2) {     //折扣
                  couponPrice = store.goodsMoney - (store.goodsMoney * item.discount / 10)
                } else {    //满减
                  couponPrice = +item.discount
                }
              }
            }
          })
          /** 优惠金额提示 */
          if (couponPrice > 0) {
            this.$set(this.orderState[index], 'couponTips', '已优惠￥' + (couponPrice.toFixed(2)));
          } else {
            this.$set(this.orderState[index], 'couponTips', null);
          }
          store.goodsMoney = store.goodsMoney - couponPrice;

          this.params.num += store.num;
          this.params.goodsMoney += store.goodsMoney;     //价格是已经算好优惠卷的价格
          this.params.freight += store.freight;
          this.params.totalMoney += (store.goodsMoney + store.freight)
        })
        this.params.freight = this.params.freight <= 0 ? '0' : this.params.freight;
        this.params.totalMoney=this.params.totalMoney<=0?0.01:+this.params.totalMoney
        //console.log('%c Auth ','color: white; background-color: #2274A5',this.params)
        return this.params.totalMoney;
      },
    }
    ,
    async created() {
      /**
       * 进入该页面需要穿过来的是的一个orders数组
       *
       * 不要用这种方式来做了，利用vue的vuex - store来进行操作，
       *
       * 用链接带参数的感觉不安全,
       *
       * 如果用户刷新页的的话，就让他回到购物车页面去或者首页吧
       *
       */

      if (this.orderState.length) {
        await this.refreshUserInfo();
        this.orderState.forEach(store => {
          this.getShopInfoWithUserIdById(store.storeId).then((res) => {
            this.storeInfo = res;
            /** 默认快递配送 */
            this.params.delivery = res.deliverMode != 'undefined' ? res.deliverMode : 1;
            /** 多选的时候默认选择快递配送 */
            this.params.delivery == 3 && (this.params.delivery = 1);
          });
          this.getDeliverSet({
            storeId: store.storeId
          }).then(result => {
            console.log("getDeliverSet", result);
            this.selfMentionList = result;
          })
          this.mallGetMyCoupons({
            storeId: store.storeId
          }).then(result => {
            console.log("mallGetMyCoupons", result);
            this.coupons = result || [];
          })
        });
      } else {
        Toast.fail({
          message: '非法异常',
          duration: 1500
        });
        setTimeout(() => {
          this.goPointPage('/auxiliary/mall');
        }, 1500)
      }


      // let orders = this.$route.query.orders;
      //
      // this.orderList = [];
      // 当从选择地址后再返回来，orders的数据类型变了，[Object,Object]
      // if (typeof orders == 'string') {
      //   orders = this.order;
      //   console.log("orders",orders)
      // } else {
      //   this.setOrderList(orders);
      // }
      //this.getGoodsOrderInfo(this.orderState);
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  #order-pay {
    background: #f4f4f4;
    font-family: PingFang-SC-Medium;
    padding-bottom: 192px;

    .order-address-info {
      background: #fff;

      .choice-delivery {
        border-bottom: 1.1px solid #ddd;
        height: 88px;
        padding: 0 30px;
        line-height: 88px;

        div {
          float: right;
          height: 88px;
          width: 450px;
          display: flex;
          align-items: center;

          span {
            margin-right: 64px;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;

            i.iconfont {
              margin-right: 10px;
              font-size: 40px;
              height: 80px;
              display: flex;
              align-items: center;
            }

            i.active {
              color: $themeColor;
            }

            .unchoice {
              border: 1.1px solid #999;
              width: 32px;
              height: 32px;
              border-radius: 50%;
            }

            .icon-wanchenggouxuan2 {
              font-size: 36px;
              color: $themeColor;
            }

          }
        }
      }

      .order-address {
        padding: 34px 0;

        div {
          line-height: 34px;
        }

        .order-address-icon-box {
          width: 74px;
          display: flex;
          align-items: center;
          float: left;
          height: 104px;

          i {
            margin: 0 auto;
            font-size: 32px;
          }

        }

        .order-address-details {
          margin-right: 30px;

          .order-main-info {
            font-size: 30px;

            .order-main-tellphone {
              float: right;
            }

          }

          .order-address-info-details {
            margin-top: 16px;
            overflow: hidden;

            span {
              float: left;
              font-size: 24px;
            }

            div {
              margin-left: 120px;
              margin-right: 50px;
            }

            i {
              float: right;
              font-size: 24px;
              margin-top: 10px;
            }

          }
        }
      }
    }

    .goods-list {
      margin: 30px;
    }

    .goods {
      background: #fff;
      padding: 0 20px 30px;
      margin: 30px;
      border-radius: 20px;
      overflow: hidden;

      .goods-store {
        display: flex;
        align-items: center;
        height: 88px;

        span {
          margin: 0 10px 0 20px;
          font-size: 28px;
        }

        i.icon {
          font-size: 36px;
        }

        i.right {
          font-size: 24px;
          height: 18px;
        }
      }

      .goods-title {
        font-size: 26px;
        line-height: 42px;
        height: 84px;
      }

      .goods_info {
        span {
          background: #eee;
          color: #999;
          display: inline-block;
          padding: 5px 10px;
          border-radius: 4px;
          margin: 20px 0 25px;
        }
      }

      .goods-attr {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .price {
          color: $themeColor;
          font-size: 28px;
        }

        .num {
          color: #999;
          font-size: 28px;
        }
      }
    }

    .goods-other {
      background: #fff;

      &_row {
        display: flex;
        justify-content: space-between;
        padding: 0 30px;
        height: 90px;
        align-items: center;

        em, span {
          color: $themeColor;
        }

        span {
          font-size: 26px;
        }

        em {
          font-size: 34px;
        }
      }

      .tips {
        background: #FFF0F1;
        position: relative;
        z-index: 0;

        dd {
          position: absolute;
          z-index: 0;
          border: 23px solid;
          border-top-color: transparent;
          border-left-color: transparent;
          border-right-color: transparent;
          border-bottom-color: #FFF0F1;
          top: -46px;
          margin-left: 23px;
        }

      }
    }

    .order-pay_block {
      div {
        padding: 20px 30px;
        background: #fff;

        textarea {
          border: none;
          resize: none;
          width: 100%;
          height: 150px;
          font-size: 28px;
          line-height: 36px;
        }
      }

      h3 {
        padding: 0 30px;
        height: 84px;
        display: flex;
        align-items: center;
        font-size: 28px;
      }
    }
  }

  .goods-coupon {
    background: #fff;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    overflow: hidden;
    position: relative;
    z-index: 0;

    &_title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 108px;
      font-size: 30px;
      border-bottom: 1.1px solid #ddd;
    }

    &_list {
      padding: 30px;
      max-height: 700px;
      overflow: auto;

      > li {
        display: flex;
        margin-bottom: 40px;

        div.icon-box {
          width: 50px;
          margin-top: -5px;

          i {
            color: $themeColor;

          }
        }

        div.body {
          width: calc(100% - 50px);

          h4 {
            font-size: 28px;
          }

          p {
            margin-top: 20px;
            font-size: 28px;
            color: #999;
          }
        }
      }
    }
  }
</style>
