<template>
  <!--核销-->
  <div id="writeOff">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <div class="order-desc block">
      <Order :goods="goods" not-operation="true"></Order>
    </div>
    <div class="order-info-single block">
      <p>
        <em class="order-status" :class="+orderInfo.status==3?'success':'fail'">{{orderInfo.tips ||
          (+orderInfo.status==2?'已发货':+orderInfo.status==3?'已完成':+orderInfo.status==1?'已付款':'未付款')}}</em>
        <span>共计<em>{{orderInfo.goodsNum}}</em>件</span>
      </p>
      <div class="order-operation-btns">
        <div @click="isShowContactCode = true">
          <span>
             <i class="iconfont icon-comments"></i>
          <em>联系客服</em>
          </span>
        </div>

        <div @click="callTel(`tel://${orderInfo.linkTel || orderInfo.linkTel || platform.phone}`)">
            <span>
              <i class="iconfont icon-dianhua4"></i>
             <em>拨打电话</em>
            </span>

        </div>
      </div>
    </div>
    <div class="order-info-single block"
         v-if="(goods.delivery == 2 || orderInfo.delivery == 2) && (orderInfo.tips == '已发货'|| orderInfo.tips == '已评价'|| orderInfo.tips == '已完成'|| orderInfo.tips == '待评价')">
      <div class="order-info-single-title">
        <i class="iconfont icon-saoma icon"></i>
        核销订单
        <span>
          <i class="iconfont lock" :class="{'icon-suo1':orderInfo.status!=3,'icon-suo':orderInfo.status==3}"></i>
        </span>
      </div>
      <dd-layout-div class=" bg-f" :pad="[50,0]">
        <dd-layout-div :width="500" class="mar-a" :height="500" id="qrcode" @load="loadHandle"></dd-layout-div>
        <dd-layout-div class="t-c col-9" :mar="[50,0,0]">请将二维码出示给核销员</dd-layout-div>
      </dd-layout-div>
    </div>
    <div class="order-info-single block" v-if="goods.delivery == 2&&$route.query.type != 'mall'">
      <div class="order-info-single-title">
        <i class="iconfont icon-saoma icon"></i>
        核销订单
        <span>
          <i class="iconfont lock" :class="{'icon-suo1':orderInfo.status!=3,'icon-suo':orderInfo.status==3}"></i>
        </span>
      </div>
      <div class="write-off-box">
        <div>请输入核销码</div>
        <div class="code-box">
          <span v-for="(item,key) in code" :key="key" :class="item.className" @click="showKey"><em>{{item.code == -1?'':item.code}}</em></span>
        </div>
        <span class="dh flex-center">核销码：<span class="col-t">{{this.orderInfo.code}}</span></span>
      </div>
    </div>


    <div class="order-info-single block" v-if="goods.delivery == 2 || +orderInfo.delivery == 2">
      <div class="order-info-single-title">
        <i class="iconfont icon-wuliuqiache icon"></i>
        自提地址
      </div>
      <van-cell
        v-if="orderInfo.self"
        :title="orderInfo.self.detailedAddress" size="large" :label="orderInfo.self.address"
        :value="orderInfo.self.linkTel"
      />
      <ul v-else>


        <li
          v-for="(item,key) in orderInfo.selfAddress"
          :key="key"
        >
          <div>联系人：{{item[1]}}&nbsp;&nbsp;&nbsp;手机号：{{item[2]}}</div>
          <div class="address">地址：{{item[3]}}</div>

        </li>
      </ul>
      <!--<ul>-->
      <!--<li>联系人：{{orderInfo.receivedName}}</li>-->
      <!--<li>联系电话：{{orderInfo.receivedTel}}</li>-->
      <!--<li>配送地址：{{orderInfo.receivedAddress}}</li>-->
      <!--</ul>-->
    </div>
    <div class="order-info-single block" v-else>
      <div class="order-info-single-title">
        <i class="iconfont icon-wuliuqiache icon"></i>
        配送信息
      </div>
      <ul>
        <li>联系人：{{orderInfo.receivedName}}</li>
        <li>联系电话：{{orderInfo.receivedTel}}</li>
        <li>配送地址：{{orderInfo.receivedAddress}}</li>
        <li v-if="orderInfo.delivery == 1&&orderInfo.logisticsName">快递名称：{{orderInfo.logisticsName}}</li>
        <li v-if="orderInfo.delivery == 1&&orderInfo.logisticsCode">快递单号：{{orderInfo.logisticsCode}}</li>
      </ul>
    </div>
    <div class="order-info-single block">
      <div class="order-info-single-title">
        <i class="iconfont icon-shiyongxuzhi icon "></i>
        订单详情
      </div>
      <ul>
        <li>订单编号：{{orderInfo.outTradeNo}}</li>
        <li>下单时间：{{formatDateByTimeStamp(orderInfo.createdAt)}}</li>
        <!--<li>支付方式：微信支付</li>-->
      </ul>
    </div>
    <div class="order-info-single block" v-if="orderInfo.note">
      <div class="order-info-single-title">
        <i class="iconfont icon-biaoqian2 "></i>
        订单备注
      </div>
      <ul>
        <li>{{orderInfo.note}}</li>
      </ul>
    </div>

    <van-number-keyboard
      :show="showKeyboard"
      extra-key="."
      close-button-text="完成"
      @blur="onBlur"
      @input="onInput"
      @delete="onDelete"
    />
    <!--弹窗-->
    <Popup v-if="isShowContactCode && orderInfo.wxImg&&orderInfo.wxImg.length > 10"
           :QRCode="orderInfo.wxImg || platform.contactCode"
           @close="isShowContactCode = false"
           desc="联系客服"></Popup>
  </div>
</template>
<script>
  import Order from "../template/order";
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../../plugins/util-mixins";
  import {Toast} from 'vant';
  import {showDialog, hideLoading, showLoading} from "../../../../util";
  import Popup from '../../../../components/popup'
  import DdLayoutImg from "../../../../components/layout/dd-layout-img";
  import {redirectPath} from "../../../../project-config/base";       // 弹窗

  export default {
    components: {DdLayoutImg, Order, Popup},
    data() {
      return {
        goods: this.$route.query.goods || {},
        showKeyboard: false,
        code: [],
        index: 0,
        goodsId: null,
        orderInfo: {},
        isShowContactCode: false,
      }
    },
    mixins: [utilMixins],
    methods: {
      ...mapActions('integralMall', ["lookOrderInfo", "writeOffOrders", "integralGoodsDetails"]),
      ...mapActions('mall', ['getMallOrderDetails', 'mallOrderWriteOff']),
      ...mapActions("storeAuxiliary/releaseGood", ["getAddressInfo"]),
      loadHandle(e) {
        const url = redirectPath + "/personal/integralMall/StoreWriteOff?&appId="
          + localStorage.projectAppId + "&orderId=" + this.$route.query.orderId
        this.getQRCode({
          dom: e.dom,
          url,
        })
      },
      async getMallOrderInfo() {
        showLoading();
        const res = await this.getMallOrderDetails({
          orderId: this.$route.query.orderId
        });
        hideLoading();
        console.log(res);
        this.goods = [];

        res.goods.forEach(item => {
          this.goods.push({
            logo: item.img,
            name: item.name,
            goodsMoney: item.money,
            num: item.num,
            status: item.status,
            ...item
          })
        })
        this.orderInfo = {
          createdAt: res.createdAt,
          outTradeNo: res.orderNum,
          goodsNum: res.goods.length,
          status: res.state == 9 || res.state == 4 || res.state == 3 ? 3 : res.state,
          tips: (() => {
            let tips = '';

            if (res.state == 1) tips = '已付款'
            else if (res.state == 2) tips = '已发货'
            else if (res.state == 3) tips = '已评价'
            else if (res.state == 4) tips = '已完成'
            else if (res.state == 5) tips = '申请退款中'
            else if (res.state == 6) tips = '已退款'
            else if (res.state == 7) tips = '已拒绝退款'
            else if (res.state == 8) tips = '已取消';
            else if (res.state == 9) tips = '待评价';

            return tips
          })(),
          ...res
        }

        this.orderInfo.wxImg = this.orderInfo.wxImg.length > 10 && this.orderInfo.wxImg ? this.getSingleImg(JSON.parse(this.orderInfo.wxImg)[0].url) : '';

        if (this.orderInfo.delivery == 2) {

          this.getAddressInfo({
            addressId: res.selfId
          }).then(result => {
            console.log("getAddressInfo", result);
            this.orderInfo.self = result;
            this.$set(this.orderInfo, self, result)
          })
          if (this.orderInfo.status == 3) {
            this.codeInit(this.orderInfo.code)
          } else {
            this.codeInit(8)
          }


        }
      },

      async load() {
        if (this.$route.query.type == "mall") {
          console.log('从商城来的');
          this.getMallOrderInfo();
          return;
        } else if (!this.$route.query.goods && !this.$route.query.goods.orderId) {
          Toast.fail({
            message: '缺少商品Id',
            duration: 1500
          })
          setTimeout(() => {
              this.$router.go(-1), 1500
            }
          )
          return false;
        } else {
          this.goods = this.$route.query.goods
        }
        this.getOrderInfo();
        // this.integralGoodsDetails({
        //   id : this.id
        // })
      },
      codeInit(arr) {
        this.code = [];
        for (let i = 0; i < 8; i++) {
          this.code.push({
            code: arr[i] || -1,
            className: ''
          })
        }
      },
      getOrderInfo() {
        this.lookOrderInfo({
          orderId: this.goods.orderId
        }).then(result => {
          if (result.code == 1) {
            this.orderInfo = result.data;
            let arr = [];
            this.code = [];
            this.orderInfo.status == 3 ? arr = this.orderInfo.code.split('') : arr = 8;
            // for (let i = 0; i < 8; i++) {
            //   this.code.push({
            //     code: arr[i] || -1,
            //     className: ''
            //   })
            // }
            this.codeInit(arr)

          } else {
            Toast.fail({
              message: '请求失败',
              duration: 1500
            })
            setTimeout(() => {
              this.goPointPage({
                path: '/personal/integralMall'
              })
            }, 1500)
          }
        })
      },
      callTel(tel) {
        location.href = tel;
      },
      beginWriteOff() {
        let code = [];
        this.code.forEach(v => {
          code.push(v.code);
        })
        console.log(code, this.orderInfo.code, this.orderInfo)
        if (code.indexOf(-1) >= 0) {
          return false;
        } else if (+code.join('') === +this.orderInfo.code) {

          if (this.$route.query.type == "mall") {

            showLoading("核销中...")
            this.mallOrderWriteOff({
              code: +code.join(''),
              orderId: this.orderInfo.id
            }).then(result => {
              hideLoading();
              if (result.code == 1) {
                this.getMallOrderInfo();
                Toast.success({
                  message: '核销成功',
                  duration: 1500
                })
                this.onBlur();
              } else {
                Toast.fail({
                  message: result.msg,
                  duration: 800
                })
              }
            })
          } else {
            showLoading("核销中...");
            this.writeOffOrders({
              code: +code.join(''),
              orderId: this.goods.orderId
            }).then(result => {
              hideLoading();
              if (result.code == 1) {
                this.getOrderInfo();
                Toast.success({
                  message: '核销成功',
                  duration: 1500
                })
                this.onBlur();
              } else {
                Toast.fail({
                  message: '核销码不正确',
                  duration: 800
                })
              }
            })
          }
        } else {
          Toast.fail({
            message: '核销码不正确',
            duration: 800
          })
        }
      },
      showKey() {
        if (this.orderInfo.status != 3) this.showKeyboard = true
      },
      onInput(value) {
        if (this.index >= 8) return false;
        let arr = [];

        for (let i = 0; i < this.code.length; i++) {
          if (this.code[i].code != -1) {
            arr.push({
              code: this.code[i].code,
              className: ''
            })
          }
        }
        arr.push({
          code: value,
          className: 'active_'
        })
        while (arr.length < 8) {
          arr.push({
            code: -1,
            className: ''
          })
        }
        this.code = arr
        this.index++;
        this.beginWriteOff();
      },
      onDelete() {
        let arr = [];
        console.log("触发了删除事件");
        this.index > 0 ? this.index-- : this.index = 0;
        for (let i = 0; i < this.index; i++) {
          arr.push({
            code: this.code[i].code,
            className: this.index - 1 == i ? 'active_' : ''
          })
        }
        while (arr.length < 8) {
          arr.push({
            code: -1,
            className: ''
          })
        }
        this.code = arr

      },
      onBlur() {
        this.showKeyboard = false
      }
    },
    computed: {
      ...mapState({
        platform: state => state.platform
      })
    },
    created() {
      this.load();


    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../assets/common";

  #writeOff {
    .block {
      background: #fff;
      margin-top: 20px;
    }

    .order-info-single {
      padding-bottom: 10px;

      &-title {
        padding: 0 30px;
        display: flex;
        align-items: center;
        position: relative;
        z-index: 0;
        color: #333;
        font-size: 28px;
        border-bottom: 1.1px solid #ddd;
        height: 90px;

        .icon {
          color: $themeColor;
          font-size: 40px;
          margin-right: 20px;
        }

        span {
          position: absolute;
          right: 30px;
          top: 25px;

          i {
            font-size: 40px;
            color: #FF8330;
          }
        }


      }

      .order-operation-btns {
        display: flex;
        align-items: center;
        height: 90px;

        div {
          width: 50%;
          text-align: center;

          height: 60px;
          line-height: 60px;
          display: flex;
          align-items: center;

          &:nth-child(1) {
            border-right: 1.1px solid #ddd;
          }

          span {
            width: 200px;
            margin: 0 auto;
            display: flex;
            align-items: center;

            i {
              color: $themeColor;
              font-size: 40px;
              margin-right: 20px;
            }
          }

        }
      }

      p {
        text-align: right;
        color: #999;
        position: relative;
        z-index: 0;
        padding: 30px;
        border-bottom: 1.1px solid #ddd;

        .order-status {
          position: absolute;
          left: 30px;
        }

        .success {
          color: #FF4E00;
        }

        .fail {
          color: #999;
        }
      }

      ul {
        padding: 30px 30px 0 30px;

        > span.title_tips {
          font-size: 30px;
          margin-bottom: 30px;
          display: block;
        }

        li {
          margin-bottom: 30px;
          font-size: 26px;

          div {
            font-size: 24px;
          }

          div.address {
            margin-top: 20px;
            padding-bottom: 15px;
          }
        }
      }

      .write-off-box {
        padding: 15px 0;

        div {
          text-align: center;
          font-size: 28px;
          padding: 30px 0 15px;
        }

        .code-box {
          height: 64px;
          line-height: 64px;

          span {
            display: inline-flex;
            width: 64px;
            height: 64px;
            border-radius: 8px;
            line-height: 64px;
            text-align: center;
            border: 1.1px solid #ddd;
            margin: 0 6px;
            font-size: 40px;
            overflow: hidden;

            em {
              margin: 0 auto;
            }
          }

          span.active_ {
            border-color: $themeColor;
          }
        }
      }
    }
  }


</style>
